'use client'
import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import {
  X,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
  CreditCard,
  PartyPopper,
  Sparkles,
  User,
  Lock,
  MessageCircle,
  MapPin,
  Truck,
  Store,
  Navigation,
  Loader2,
  Map,
  Paperclip,
  Download,
} from 'lucide-react'
import { useCart } from '@/lib/context/CartContext'
import { useAuth } from '@/lib/context/AuthContext'
import { useNewsletter } from '@/hooks/useNewsletter'
import { trackBeginCheckout, trackPurchase } from '@/lib/analytics'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { Confetti, SparkleEffect } from '@/components/ui/Confetti'
import { AuthModal } from '@/components/auth/AuthModal'
import {
  PICKUP_LOCATIONS,
  FREE_SHIPPING_THRESHOLD,
  MAX_DELIVERY_DISTANCE_KM,
  calculateShippingCost,
  getDistanceFromMutualista,
  getMapsLink,
} from '@/lib/utils/shipping'
import { buildWhatsAppUrl, WHATSAPP_NUMBER } from '@/lib/utils/whatsapp'
import { supabase } from '@/lib/supabase/client'
import { isStoreOpen } from '@/lib/utils/business-hours'

const DeliveryMapPicker = dynamic(
  () => import('@/components/cart/DeliveryMapPicker'),
  {
    ssr: false,
    loading: () => (
      <div className="h-72 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm border-2 border-gray-200">
        Cargando mapa...
      </div>
    ),
  },
)

const MUTUALISTA_LAT = -17.762778
const MUTUALISTA_LNG = -63.161667

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

type Step = 'form' | 'qr' | 'success'
type PaymentMethod = 'qr' | 'libelula' | 'cash_on_pickup'
type DeliveryMethod = 'delivery' | 'pickup'
type LocationState = 'initial' | 'gps_loading' | 'gps_denied' | 'map_open' | 'confirmed'
type ReceiptUploadState = 'idle' | 'uploading' | 'success' | 'error'

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cart, total, clearCart } = useCart()
  const { user, isLoggedIn, customerName, signInWithGoogle } = useAuth()
  const { isSubscribed, markAsSubscribed } = useNewsletter()
  const [step, setStep] = useState<Step>('form')
  const [orderId, setOrderId] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [showAccountCard, setShowAccountCard] = useState(true)
  const [showGoogleBanner, setShowGoogleBanner] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('qr')
  const [whatsappMessage, setWhatsappMessage] = useState('')

  // Refs for BUG-04 & BUG-05 fixes
  const hasManuallyEditedRecipient = useRef(false)
  const modalContentRef = useRef<HTMLDivElement>(null)

  // Ref for double-click prevention
  const doubleSubmitRef = useRef(false)

  const scrollModalToTop = (): void => {
    setTimeout(() => {
      modalContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }, 50)
  }

  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: '',
    website: '',
  })
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [notifyByEmail, setNotifyByEmail] = useState(true)
  const [notifyByWhatsapp, setNotifyByWhatsapp] = useState(false)
  const [emailError, setEmailError] = useState('')

  const [formData, setFormData] = useState<{
    customerData: typeof customerData
    deliveryMethod: DeliveryMethod
    selectedPayment: PaymentMethod
    shippingAddress: string
    shippingReference: string
    pickupLocation: string
    gpsLat: number | null
    gpsLng: number | null
    gpsDistanceKm: number | null
    mapsLink: string
    recipientName: string
    recipientPhone: string
    deliveryInstructions: string
    discountCode: string
    discountValidation: typeof discountValidation
    shippingCost: number
    orderTotal: number
    appliedDiscountAmount: number
    notifyByEmail: boolean
    notifyByWhatsapp: boolean
    marketingConsent: boolean
  } | null>(null)

  // Delivery state
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery')
  const [shippingAddress, setShippingAddress] = useState('')
  const [shippingReference, setShippingReference] = useState('')
  const [pickupLocation, setPickupLocation] = useState('')
  const [shippingAddressError, setShippingAddressError] = useState('')
  const [pickupLocationError, setPickupLocationError] = useState('')

  // Store Hours status
  const [storeStatus, setStoreStatus] = useState<{ open: boolean; message: string; nextOpenTime?: string } | null>(null)

  useEffect(() => {
    if (isOpen) {
      setStoreStatus(isStoreOpen())
    }
  }, [isOpen, deliveryMethod])

  // Location state
  const [locationState, setLocationState] = useState<LocationState>('initial')
  const [locationSource, setLocationSource] = useState<'gps' | 'map' | null>(null)
  const [gpsLat, setGpsLat] = useState<number | null>(null)
  const [gpsLng, setGpsLng] = useState<number | null>(null)
  const [gpsDistanceKm, setGpsDistanceKm] = useState<number | null>(null)
  const [mapsLink, setMapsLink] = useState('')

  // Recipient state
  const [recipientName, setRecipientName] = useState('')
  const [recipientPhone, setRecipientPhone] = useState('')
  const [recipientPhoneError, setRecipientPhoneError] = useState('')

  // Delivery instructions (optional)
  const [deliveryInstructions, setDeliveryInstructions] = useState('')

  // Discount Code
  const [discountCode, setDiscountCode] = useState('')
  const [discountValidation, setDiscountValidation] = useState<{
    valid: boolean
    discount_type: 'percentage' | 'fixed' | null
    discount_amount: number
    message: string
    discount_code_id?: string
  } | null>(null)
  const [isValidatingCode, setIsValidatingCode] = useState(false)

  // Comprobante de pago (opcional)
  const [receiptUploadState, setReceiptUploadState] = useState<ReceiptUploadState>('idle')
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptPreviewUrl, setReceiptPreviewUrl] = useState<string | null>(null)
  const [receiptError, setReceiptError] = useState('')
  const [showReceiptLightbox, setShowReceiptLightbox] = useState(false)
  const [uploadedReceiptPath, setUploadedReceiptPath] = useState<string | null>(null)

  // Computed shipping
  const rawShippingCost: number | 'out_of_range' =
    deliveryMethod === 'pickup'
      ? 0
      : gpsDistanceKm !== null
        ? calculateShippingCost(gpsDistanceKm, total)
        : 0

  const isOutOfRange = rawShippingCost === 'out_of_range'
  const shippingCost = isOutOfRange ? 0 : (rawShippingCost as number)

  let appliedDiscountAmount = 0
  if (discountValidation?.valid) {
    if (discountValidation.discount_type === 'fixed') {
      appliedDiscountAmount = discountValidation.discount_amount
    } else if (discountValidation.discount_type === 'percentage') {
      appliedDiscountAmount = total * (discountValidation.discount_amount / 100)
    }
  }

  const orderTotal = Math.max(0, total - appliedDiscountAmount) + shippingCost
  const selectedPickup = PICKUP_LOCATIONS.find((p) => p.id === pickupLocation)

  // Pre-fill recipient from customer data (only if user hasn't manually edited)
  useEffect(() => {
    if (!hasManuallyEditedRecipient.current) {
      setRecipientName(customerData.name)
    }
    setRecipientPhone((prev) => prev || customerData.phone)
  }, [customerData.name, customerData.phone])

  // Pre-fill from authenticated account
  useEffect(() => {
    let isMounted = true

    const fetchLastOrder = async (email: string) => {
      try {
        const { data } = await supabase
          .from('orders')
          .select('*')
          .eq('customer_email', email)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (data && isMounted) {
          // Si el usuario ya tiene un teléfono guardado pero el form está vacío
          setCustomerData((prev) => ({
            ...prev,
            phone: prev.phone || data.customer_phone || '',
          }))

          if (data.delivery_method === 'pickup') {
            setDeliveryMethod('pickup')
            if (data.pickup_location) setPickupLocation(data.pickup_location)
          } else if (data.delivery_method === 'delivery') {
            setDeliveryMethod('delivery')
            if (data.shipping_address) setShippingAddress(data.shipping_address)
            if (data.shipping_reference) setShippingReference(data.shipping_reference)
            if (data.recipient_name) {
              setRecipientName(data.recipient_name)
              hasManuallyEditedRecipient.current = true
            }
            if (data.recipient_phone) setRecipientPhone(data.recipient_phone)
            if (data.delivery_instructions) setDeliveryInstructions(data.delivery_instructions)

            // Si tenía coordenadas válidas, inicializamos el mapa como "confirmado"
            if (data.gps_lat && data.gps_lng) {
              setGpsLat(Number(data.gps_lat))
              setGpsLng(Number(data.gps_lng))
              if (data.gps_distance_km) setGpsDistanceKm(Number(data.gps_distance_km))
              if (data.maps_link) setMapsLink(data.maps_link)
              setLocationState('confirmed')
            }
          }

          if (data.notify_email !== null) setNotifyByEmail(data.notify_email)
          if (data.notify_whatsapp !== null) setNotifyByWhatsapp(data.notify_whatsapp)
        }
      } catch (err) {
        console.error('Error fetching last order for checkout prefill:', err)
      }
    }

    if (isLoggedIn && user) {
      setCustomerData((prev) => ({
        ...prev,
        name: prev.name || customerName || '',
        phone: prev.phone || user.user_metadata?.phone || '',
        email: prev.email || user.email || '',
      }))

      if (user.email && isOpen) {
        fetchLastOrder(user.email)
      }
    }

    return () => {
      isMounted = false
    }
  }, [isLoggedIn, user, customerName, isOpen])

  // GA4: begin_checkout cuando se abre el modal
  useEffect(() => {
    if (isOpen && step === 'form' && cart.length > 0) {
      trackBeginCheckout({
        items: cart.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
        total,
      })
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // Reset on modal close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('form')
        hasManuallyEditedRecipient.current = false
        setShowConfetti(false)
        setEmailError('')
        setNotifyByEmail(true)
        setNotifyByWhatsapp(false)
        setShowAccountCard(true)
        setShowGoogleBanner(true)
        setSelectedPayment('qr')
        setWhatsappMessage('')
        setDeliveryMethod('delivery')
        setShippingAddress('')
        setShippingReference('')
        setPickupLocation('')
        setShippingAddressError('')
        setPickupLocationError('')
        setLocationState('initial')
        setLocationSource(null)
        setGpsLat(null)
        setGpsLng(null)
        setGpsDistanceKm(null)
        setMapsLink('')
        setRecipientName('')
        setRecipientPhone('')
        setRecipientPhoneError('')
        setDeliveryInstructions('')
        setDiscountCode('')
        setDiscountValidation(null)
        setIsValidatingCode(false)
        setReceiptUploadState('idle')
        setReceiptFile(null)
        setReceiptPreviewUrl(null)
        setReceiptError('')
        setUploadedReceiptPath(null)
      }, 300)
    }
  }, [isOpen])

  const validateEmail = (email: string) => {
    if (!email.trim()) return 'El email es obligatorio'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email inválido'
    return ''
  }

  const setLocation = (lat: number, lng: number) => {
    const distKm = getDistanceFromMutualista(lat, lng)
    setGpsLat(lat)
    setGpsLng(lng)
    setGpsDistanceKm(distKm)
    setMapsLink(getMapsLink(lat, lng))
  }

  const handleGps = () => {
    if (!navigator.geolocation) {
      setLocationState('gps_denied')
      return
    }
    setLocationState('gps_loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(pos.coords.latitude, pos.coords.longitude)
        setLocationSource('gps')
        setLocationState('map_open')
      },
      () => {
        setLocationState('gps_denied')
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const handleOpenMap = () => {
    if (!gpsLat) {
      setLocation(MUTUALISTA_LAT, MUTUALISTA_LNG)
    }
    setLocationSource('map')
    setLocationState('map_open')
  }

  const handleMapLocationUpdate = (lat: number, lng: number) => {
    setLocation(lat, lng)
  }

  const handleConfirmLocation = () => {
    setLocationState('confirmed')
  }

  const handleResetLocation = () => {
    setLocationState('initial')
    setLocationSource(null)
    setGpsLat(null)
    setGpsLng(null)
    setGpsDistanceKm(null)
    setMapsLink('')
  }

  // Out-of-range WhatsApp cotización
  const outOfRangeWaUrl =
    mapsLink
      ? buildWhatsAppUrl(
        `Hola! Quiero cotizar un envío 📦\n*Productos:*\n${cart.map((i) => `• ${i.product.name} x${i.quantity}`).join('\n')}\n💰 Total del pedido: Bs ${total.toFixed(2)}\n📍 Ubicación de entrega: ${mapsLink}\n¿Cuánto cuesta el envío hasta allí? 🙏`,
      )
      : ''

  const handleValidateDiscountCode = async () => {
    if (!discountCode.trim()) {
      setDiscountValidation(null)
      return
    }

    if (!customerData.email.trim()) {
      setDiscountValidation({ valid: false, discount_type: null, discount_amount: 0, message: 'Ingresa tu email arriba antes de validar el cupón.' })
      return
    }

    setIsValidatingCode(true)
    setDiscountValidation(null)

    try {
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('code', discountCode.trim().toUpperCase())
        .single()

      if (error || !data) {
        setDiscountValidation({ valid: false, discount_type: null, discount_amount: 0, message: 'Código no válido' })
        return
      }

      if (data.assigned_email && data.assigned_email !== customerData.email.trim().toLowerCase()) {
        setDiscountValidation({ valid: false, discount_type: null, discount_amount: 0, message: 'Este cupón está vinculado a otro correo. Usa el correo con el que te suscribiste.' })
        return
      }

      if (!data.is_active) {
        setDiscountValidation({ valid: false, discount_type: null, discount_amount: 0, message: 'Código inactivo' })
        return
      }

      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        setDiscountValidation({ valid: false, discount_type: null, discount_amount: 0, message: 'Código expirado' })
        return
      }

      if (data.max_uses !== null && data.usage_count !== null && data.usage_count >= data.max_uses) {
        setDiscountValidation({ valid: false, discount_type: null, discount_amount: 0, message: 'Límite de usos alcanzado' })
        return
      }

      if (data.min_order_amount && total < data.min_order_amount) {
        setDiscountValidation({ valid: false, discount_type: null, discount_amount: 0, message: `Requisito: Bs ${data.min_order_amount} mínimo` })
        return
      }

      setDiscountValidation({
        valid: true,
        discount_type: data.discount_type as 'percentage' | 'fixed',
        // The DB column is `discount_percentage` — guard with Number() to prevent NaN
        discount_amount: Number(data.discount_percentage ?? data.discount_amount ?? 0),
        message: 'Código aplicado con éxito',
        discount_code_id: data.id,
      })
    } catch {
      setDiscountValidation({ valid: false, discount_type: null, discount_amount: 0, message: 'Error de conexión' })
    } finally {
      setIsValidatingCode(false)
    }
  }

  const handleReceiptSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setReceiptError('Solo se aceptan imágenes (JPG, PNG, WebP)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setReceiptError('La imagen no puede superar los 5 MB')
      return
    }

    setReceiptError('')
    setReceiptFile(file)
    setReceiptPreviewUrl(URL.createObjectURL(file))
    setReceiptUploadState('uploading')

    try {
      const form = new FormData()
      form.append('file', file)
      form.append('orderId', orderId)

      const res = await fetch('/api/upload-receipt', {
        method: 'POST',
        body: form,
      })

      const data = await res.json()

      if (!res.ok) {
        setReceiptUploadState('error')
        setReceiptError(data.error || 'Error al subir el comprobante')
        return
      }

      setReceiptUploadState('success')
      setUploadedReceiptPath(data.url)
    } catch {
      setReceiptUploadState('error')
      setReceiptError('Error de conexión. Intenta de nuevo.')
    }
  }

  const handleReceiptReset = () => {
    setReceiptUploadState('idle')
    setReceiptFile(null)
    if (receiptPreviewUrl) URL.revokeObjectURL(receiptPreviewUrl)
    setReceiptPreviewUrl(null)
    setReceiptError('')
    setUploadedReceiptPath(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!customerData.name.trim() || !customerData.phone.trim()) {
      toast.error('Por favor completa nombre y teléfono', { position: 'bottom-center' })
      return
    }

    const phoneRegex = /^\d{7,8}$/
    if (!phoneRegex.test(customerData.phone.replace(/\s/g, ''))) {
      toast.error('Número de teléfono inválido (ej: 70000000)', { position: 'bottom-center' })
      return
    }

    if (!customerData.email.trim() && notifyByEmail) {
      setEmailError('Ingresá tu email para recibir notificaciones por Gmail')
      return
    }
    if (customerData.email.trim()) {
      const emailValidation = validateEmail(customerData.email)
      if (emailValidation) {
        setEmailError(emailValidation)
        return
      }
    }
    setEmailError('')

    if (deliveryMethod === 'delivery') {
      if (locationState !== 'confirmed') {
        toast.error('Confirma tu ubicación de entrega', { position: 'bottom-center' })
        return
      }
      if (isOutOfRange) {
        toast.error('Tu ubicación está fuera de la zona de envío', { position: 'bottom-center' })
        return
      }
      if (!shippingAddress.trim() || shippingAddress.trim().length < 10) {
        setShippingAddressError('Ingresa una dirección válida (mínimo 10 caracteres)')
        return
      }
      setShippingAddressError('')
      if (!recipientName.trim()) {
        toast.error('Ingresa el nombre de quien recibe', { position: 'bottom-center' })
        return
      }
      if (!phoneRegex.test(recipientPhone.replace(/\s/g, ''))) {
        setRecipientPhoneError('Número inválido (7-8 dígitos)')
        return
      }
      setRecipientPhoneError('')
    } else {
      if (!pickupLocation) {
        setPickupLocationError('Selecciona un puesto de recogida')
        return
      }
      setPickupLocationError('')
    }

    // Generate temporary order ID for QR display
    const tempOrderId = crypto.randomUUID()
    setOrderId(tempOrderId)

    // Store form data for later
    const snapshotFormData = {
      customerData: { ...customerData },
      deliveryMethod,
      selectedPayment,
      shippingAddress,
      shippingReference,
      pickupLocation,
      gpsLat,
      gpsLng,
      gpsDistanceKm,
      mapsLink,
      recipientName,
      recipientPhone,
      deliveryInstructions,
      discountCode,
      discountValidation: discountValidation ? { ...discountValidation } : null,
      shippingCost,
      orderTotal,
      appliedDiscountAmount,
      notifyByEmail,
      notifyByWhatsapp,
      marketingConsent,
    }
    setFormData(snapshotFormData)

    if (selectedPayment === 'cash_on_pickup') {
      // Skip QR screen — create order immediately then go to success
      await handleCashOnPickupCheckout(snapshotFormData)
    } else {
      setStep('qr')
      scrollModalToTop()
    }
  }

  const handleCashOnPickupCheckout = async (fd: NonNullable<typeof formData>) => {
    if (doubleSubmitRef.current) return
    doubleSubmitRef.current = true
    setIsProcessing(true)
    const tempOrderId = crypto.randomUUID()
    setOrderId(tempOrderId)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          website: fd.customerData.website,
          user_id: user?.id ?? undefined,
          customer_name: fd.customerData.name,
          customer_phone: fd.customerData.phone.replace(/\s/g, ''),
          customer_email: fd.customerData.email,
          marketing_consent: fd.marketingConsent,
          notify_email: fd.notifyByEmail,
          notify_whatsapp: fd.notifyByWhatsapp,
          subtotal: total,
          shipping_cost: fd.shippingCost,
          total: fd.orderTotal,
          delivery_method: fd.deliveryMethod,
          shipping_address: null,
          shipping_reference: null,
          pickup_location: fd.pickupLocation,
          gps_lat: null,
          gps_lng: null,
          gps_distance_km: null,
          maps_link: null,
          recipient_name: null,
          recipient_phone: null,
          delivery_instructions: null,
          payment_method: 'cash_on_pickup',
          discount_amount: fd.discountValidation?.valid ? fd.appliedDiscountAmount : 0,
          discount_code_id: fd.discountValidation?.valid ? fd.discountValidation.discount_code_id : null,
          discount_code: fd.discountValidation?.valid ? fd.discountCode.toUpperCase() : null,
          items: cart.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
            unit_price: item.product.price,
            size: item.size || null,
            color: item.color || null,
            subtotal: item.product.price * item.quantity,
            image_url: item.product.images?.[0] ?? item.product.image_url ?? null,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Error al crear la orden', { position: 'bottom-center' })
        setIsProcessing(false)
        doubleSubmitRef.current = false
        return
      }

      const { orderId: realOrderId } = data
      setOrderId(realOrderId)
      setStep('success')
      scrollModalToTop()
      setShowConfetti(true)

      trackPurchase({
        orderId: realOrderId,
        total: fd.orderTotal,
        items: cart.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          category: item.product.categories?.name,
        })),
      })

      // Reserve stock for cash_on_pickup
      fetch('/api/reserve-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: realOrderId }),
      }).catch((err) => console.error('[reserve-order] fetch error:', err))

      // Fire-and-forget: pickup reservation confirmation email
      if (fd.notifyByEmail && fd.customerData.email.trim()) {
        const selectedPickupInfo = PICKUP_LOCATIONS.find((p) => p.id === fd.pickupLocation)
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'pickup_reservation_received',
            orderData: {
              orderId: realOrderId,
              customerName: fd.customerData.name,
              customerEmail: fd.customerData.email,
              pickupLocationName: selectedPickupInfo?.name ?? fd.pickupLocation,
              pickupLocationAddress: selectedPickupInfo
                ? `${selectedPickupInfo.aisle} · ${selectedPickupInfo.stall}`
                : '',
              items: cart.map((item) => ({
                name: item.product.name,
                quantity: item.quantity,
                unit_price: item.product.price,
              })),
              total: fd.orderTotal,
            },
          }),
        }).catch((err) => console.error('[send-email] fetch error:', err))
      }

      // Fire-and-forget: newsletter subscription
      if (fd.marketingConsent && fd.customerData.email.trim()) {
        fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: fd.customerData.email.trim(), source: 'checkout' }),
        }).catch((err) => console.error('[subscribe] fetch error:', err))

        markAsSubscribed(fd.customerData.email.trim())
      }

      // Admin notification
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'admin_new_order',
          orderData: {
            orderId: realOrderId,
            customerName: fd.customerData.name,
            customerEmail: fd.customerData.email,
            customerPhone: fd.customerData.phone,
            items: cart,
            subtotal: total,
            shippingCost: fd.shippingCost,
            shippingDistance: null,
            deliveryAddress: null,
            locationUrl: null,
            deliveryInstructions: null,
            discountAmount: fd.discountValidation?.valid ? fd.appliedDiscountAmount : 0,
            discountCode: fd.discountValidation?.valid ? fd.discountCode.toUpperCase() : null,
            total: fd.orderTotal,
            deliveryMethod: fd.deliveryMethod,
            hasReceipt: false,
          },
        }),
      }).catch((err) => console.error('[admin-email] fetch error:', err))
    } catch {
      toast.error('Error al procesar el pedido. Intenta de nuevo.', { position: 'bottom-center' })
    } finally {
      setIsProcessing(false)
      doubleSubmitRef.current = false
    }
  }

  const handlePaymentConfirmed = async () => {
    if (!formData) {
      toast.error('Error: datos del pedido no encontrados')
      return
    }

    if (doubleSubmitRef.current) return
    doubleSubmitRef.current = true
    setIsProcessing(true)

    try {
      // NOW create the order in the database
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          website: formData.customerData.website,
          user_id: user?.id ?? undefined,
          customer_name: formData.customerData.name,
          customer_phone: formData.customerData.phone.replace(/\s/g, ''),
          customer_email: formData.customerData.email,
          marketing_consent: formData.marketingConsent,
          notify_email: formData.notifyByEmail,
          notify_whatsapp: formData.notifyByWhatsapp,
          subtotal: total,
          shipping_cost: formData.shippingCost,
          total: formData.orderTotal,
          delivery_method: formData.deliveryMethod,
          shipping_address: formData.deliveryMethod === 'delivery' ? formData.shippingAddress.trim() : null,
          shipping_reference: formData.deliveryMethod === 'delivery' ? formData.shippingReference.trim() || null : null,
          pickup_location: formData.deliveryMethod === 'pickup' ? formData.pickupLocation : null,
          gps_lat: formData.gpsLat,
          gps_lng: formData.gpsLng,
          gps_distance_km: formData.gpsDistanceKm,
          maps_link: formData.mapsLink || null,
          recipient_name: formData.deliveryMethod === 'delivery' ? formData.recipientName.trim() : null,
          recipient_phone: formData.deliveryMethod === 'delivery' ? formData.recipientPhone.replace(/\s/g, '') : null,
          delivery_instructions: formData.deliveryMethod === 'delivery' ? formData.deliveryInstructions.trim() || null : null,
          payment_method: formData.selectedPayment === 'cash_on_pickup' ? 'cash_on_pickup' : 'qr',
          payment_receipt_url: uploadedReceiptPath,
          discount_amount: formData.discountValidation?.valid ? formData.appliedDiscountAmount : 0,
          discount_code_id: formData.discountValidation?.valid ? formData.discountValidation.discount_code_id : null,
          discount_code: formData.discountValidation?.valid ? formData.discountCode.toUpperCase() : null,
          items: cart.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
            unit_price: item.product.price,
            size: item.size || null,
            color: item.color || null,
            subtotal: item.product.price * item.quantity,
            image_url: item.product.images?.[0] ?? item.product.image_url ?? null,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Error al crear la orden', { position: 'bottom-center' })
        setIsProcessing(false)
        return
      }

      const { orderId: realOrderId } = data
      const shortId = realOrderId.slice(0, 8).toUpperCase()
      setOrderId(realOrderId) // Replace temp ID with real one

      // Build WhatsApp message
      const productList = cart
        .map(
          (item) =>
            `• ${item.product.name} x${item.quantity}${item.size ? ` (${item.size})` : ''}${item.color ? ` - ${item.color}` : ''}`,
        )
        .join('\n')

      const deliveryInfo =
        formData.deliveryMethod === 'delivery'
          ? `\n\n📍 *Dirección:* ${formData.shippingAddress}${formData.shippingReference ? `\nRef: ${formData.shippingReference}` : ''}\n👤 *Recibe:* ${formData.recipientName} · ${formData.recipientPhone}${formData.deliveryInstructions.trim() ? `\n📝 Instrucciones: ${formData.deliveryInstructions.trim()}` : ''}${formData.mapsLink ? `\n📍 Ubicación exacta: ${formData.mapsLink}` : ''}`
          : `\n\n🏪 *Recojo en tienda:* ${PICKUP_LOCATIONS.find((p) => p.id === formData.pickupLocation)?.name ?? formData.pickupLocation}`

      const discountText = formData.discountValidation?.valid
        ? `\n💰 *Descuento:* -Bs ${formData.appliedDiscountAmount.toFixed(2)} (${formData.discountCode.toUpperCase()})`
        : ''

      setWhatsappMessage(
        encodeURIComponent(
          `Hola! Realicé el pedido #${shortId} por Bs ${formData.orderTotal.toFixed(2)}.\n\n` +
          `🛍️ *Productos:*\n${productList}${discountText}${deliveryInfo}\n\n` +
          `Ya realicé el pago por QR. ¿Pueden confirmar? 🙏`,
        ),
      )

      // NOW move to success step
      setStep('success')
      scrollModalToTop()
      setShowConfetti(true)

      // GA4 purchase event
      trackPurchase({
        orderId: realOrderId,
        total: formData.orderTotal,
        items: cart.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          category: item.product.categories?.name,
        })),
      })

      // Fire-and-forget: confirmation email
      if (formData.notifyByEmail && formData.customerData.email.trim()) {
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'order_confirmation',
            orderData: {
              orderId: realOrderId,
              customerName: formData.customerData.name,
              customerEmail: formData.customerData.email,
              customerPhone: formData.customerData.phone,
              items: cart,
              subtotal: total,
              shippingCost: formData.shippingCost,
              shippingDistance: formData.gpsDistanceKm,
              deliveryAddress: formData.deliveryMethod === 'delivery' && formData.shippingAddress.trim() ? formData.shippingAddress.trim() : null,
              locationUrl: formData.deliveryMethod === 'delivery' && formData.mapsLink ? formData.mapsLink : null,
              discountAmount: formData.discountValidation?.valid ? formData.appliedDiscountAmount : 0,
              discountCode: formData.discountValidation?.valid ? formData.discountCode.toUpperCase() : null,
              total: formData.orderTotal,
              notifyByEmail: true,
              notifyByWhatsapp: formData.notifyByWhatsapp,
            },
          }),
        }).catch((err) => console.error('[send-email] fetch error:', err))
      }

      // Fire-and-forget: newsletter subscription
      if (formData.marketingConsent && formData.customerData.email.trim()) {
        fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.customerData.email.trim(), source: 'checkout' }),
        }).catch((err) => console.error('[subscribe] fetch error:', err))

        // Mark global state
        markAsSubscribed(formData.customerData.email.trim())
      }

      // Reserve stock
      fetch('/api/reserve-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: realOrderId }),
      }).catch((err) => console.error('[reserve-order] fetch error:', err))

      // Admin notification
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'admin_new_order',
          orderData: {
            orderId: realOrderId,
            customerName: formData.customerData.name,
            customerEmail: formData.customerData.email,
            customerPhone: formData.customerData.phone,
            items: cart,
            subtotal: total,
            shippingCost: formData.shippingCost,
            shippingDistance: formData.gpsDistanceKm,
            deliveryAddress: formData.deliveryMethod === 'delivery' && formData.shippingAddress.trim() ? formData.shippingAddress.trim() : null,
            locationUrl: formData.deliveryMethod === 'delivery' && formData.mapsLink ? formData.mapsLink : null,
            deliveryInstructions: formData.deliveryInstructions ?? null,
            discountAmount: formData.discountValidation?.valid ? formData.appliedDiscountAmount : 0,
            discountCode: formData.discountValidation?.valid ? formData.discountCode.toUpperCase() : null,
            total: formData.orderTotal,
            deliveryMethod: formData.deliveryMethod,
            hasReceipt: receiptUploadState === 'success',
          },
        }),
      }).catch((err) => console.error('[admin-email] fetch error:', err))
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Intenta de nuevo'
      console.error('Error creating order:', error)
      toast.error('Error al crear la orden: ' + msg, { position: 'bottom-center' })
    } finally {
      setIsProcessing(false)
      doubleSubmitRef.current = false
    }
  }

  const handleContinueShopping = () => {
    clearCart()
    onClose()
    setStep('form')
    hasManuallyEditedRecipient.current = false
    setCustomerData({ name: '', phone: '', email: '', website: '' })
    setNotifyByEmail(true)
    setNotifyByWhatsapp(false)
    setShowConfetti(false)
    setDeliveryMethod('delivery')
    setShippingAddress('')
    setShippingReference('')
    setPickupLocation('')
    setLocationState('initial')
    setLocationSource(null)
    setGpsLat(null)
    setGpsLng(null)
    setGpsDistanceKm(null)
    setMapsLink('')
    setRecipientName('')
    setRecipientPhone('')
    setDeliveryInstructions('')
    setDiscountCode('')
    setDiscountValidation(null)
    setIsValidatingCode(false)
    setReceiptUploadState('idle')
    setReceiptFile(null)
    if (receiptPreviewUrl) URL.revokeObjectURL(receiptPreviewUrl)
    setReceiptPreviewUrl(null)
    setReceiptError('')
  }

  const isContinueDisabled =
    isProcessing ||
    (deliveryMethod === 'delivery' && (locationState !== 'confirmed' || isOutOfRange))

  const continueLabel = isProcessing
    ? 'Procesando...'
    : deliveryMethod === 'delivery' && locationState !== 'confirmed'
      ? '📍 Confirma tu ubicación de entrega'
      : deliveryMethod === 'delivery' && isOutOfRange
        ? '⚠️ Fuera de zona de envío'
        : 'Continuar al Pago'

  return (
    <>
      <Confetti isActive={showConfetti} duration={4000} />

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={step !== 'success' ? onClose : undefined}
              className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div ref={modalContentRef} className="bg-white rounded-2xl border border-gray-200 shadow-sm w-full max-w-lg pointer-events-auto max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div
                  className={`p-6 border-b-2 border-gray-100 flex items-center justify-between rounded-t-2xl transition-colors ${step === 'success'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-900 text-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    {step === 'form' && <ShoppingBag className="w-6 h-6" />}
                    {step === 'qr' && <CreditCard className="w-6 h-6" />}
                    {step === 'success' && <PartyPopper className="w-6 h-6" />}
                    <h2 className="text-2xl font-bold">
                      {step === 'form' && 'Finalizar Compra'}
                      {step === 'qr' && 'Pagar con QR'}
                      {step === 'success' && '¡Compra Exitosa!'}
                    </h2>
                  </div>
                  {step !== 'success' && (
                    <button
                      onClick={onClose}
                      className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* ── STEP 1: FORMULARIO ── */}
                  {step === 'form' && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Honeypot */}
                      <input
                        type="text"
                        name="website"
                        value={customerData.website}
                        onChange={(e) =>
                          setCustomerData({ ...customerData, website: e.target.value })
                        }
                        className="hidden"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                      />

                      {/* ── Banner Google One Tap (solo si no está logueado y no lo cerró) ── */}
                      {!isLoggedIn && showGoogleBanner && (
                        <div className="flex items-center justify-between gap-3 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <Lock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <p className="text-sm font-medium text-gray-700 leading-snug">
                              Guarda tu pedido y rastréalo fácil
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              type="button"
                              onClick={signInWithGoogle}
                              className="flex items-center gap-1.5 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold text-xs px-3 py-1.5 rounded-lg shadow-sm transition-all whitespace-nowrap"
                            >
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                              </svg>
                              Continuar con Google
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowGoogleBanner(false)}
                              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              aria-label="Cerrar"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* ── SECTION A: Datos personales ── */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Datos personales
                        </h3>

                        {isLoggedIn && (
                          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                            <User className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm text-green-700 font-medium">
                              ✓ Datos de tu cuenta
                            </span>
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nombre Completo *
                          </label>
                          <input
                            type="text"
                            required
                            value={customerData.name}
                            onChange={(e) =>
                              setCustomerData({ ...customerData, name: e.target.value })
                            }
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-500 focus:outline-none"
                            placeholder="Juan Pérez"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Teléfono (WhatsApp) *
                          </label>
                          <input
                            type="tel"
                            required
                            value={customerData.phone}
                            onChange={(e) =>
                              setCustomerData({ ...customerData, phone: e.target.value })
                            }
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-500 focus:outline-none"
                            placeholder="70000000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            value={customerData.email}
                            onChange={(e) => {
                              setCustomerData({ ...customerData, email: e.target.value })
                              if (emailError && e.target.value.trim()) setEmailError(validateEmail(e.target.value))
                              if (emailError && !e.target.value.trim()) setEmailError('')
                            }}
                            onBlur={(e) => {
                              if (e.target.value.trim()) setEmailError(validateEmail(e.target.value))
                            }}
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${emailError
                              ? 'border-red-400 focus:border-red-500'
                              : 'border-gray-200 focus:border-gray-500'
                              }`}
                            placeholder="demo@lukesshome.com"
                          />
                          {emailError && (
                            <p className="mt-1 text-xs text-red-500">{emailError}</p>
                          )}
                        </div>

                        {/* Marketing Consent Checkbox */}
                        {!isSubscribed && (
                          <label className="flex items-start gap-3 cursor-pointer group mt-2 bg-gray-50 border-2 border-gray-100 rounded-lg p-3 hover:border-gray-200 transition-colors">
                            <div className="relative flex items-center mt-0.5">
                              <input
                                type="checkbox"
                                checked={marketingConsent}
                                onChange={(e) => setMarketingConsent(e.target.checked)}
                                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded cursor-pointer checked:bg-gray-900 checked:border-gray-900 transition-colors"
                              />
                              <CheckCircle className="absolute inset-0 w-5 h-5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-800">
                                Quiero recibir ofertas exclusivas
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                Desbloquea <span className="text-accent-600 font-bold">10% OFF</span> en tu próxima compra si te unes al newsletter.
                              </p>
                            </div>
                          </label>
                        )}

                        {/* ── Preferencias de notificación ── */}
                        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 space-y-3">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            ¿Cómo querés recibir actualizaciones de tu pedido?
                          </p>

                          <label
                            className="flex items-center gap-3 cursor-pointer group"
                            onClick={() => {
                              if (notifyByEmail && !notifyByWhatsapp) {
                                toast.error('Debes mantener al menos un método de notificación activo', { position: 'bottom-center' })
                                return
                              }
                              setNotifyByEmail(!notifyByEmail)
                              if (emailError && notifyByEmail) setEmailError('')
                            }}
                          >
                            <div className={`w-5 h-5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors ${notifyByEmail
                              ? 'bg-lukess-gold border-lukess-gold'
                              : 'bg-transparent border-gray-500 group-hover:border-gray-300'
                              }`}>
                              {notifyByEmail && (
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                  <path d="M1 4L3.5 6.5L9 1" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm text-gray-200 select-none">
                              📧 Por Gmail <span className="text-xs text-gray-500">(recomendado)</span>
                            </span>
                          </label>

                          <label
                            className="flex items-center gap-3 cursor-pointer group"
                            onClick={() => {
                              if (notifyByWhatsapp && !notifyByEmail) {
                                toast.error('Debes mantener al menos un método de notificación activo', { position: 'bottom-center' })
                                return
                              }
                              setNotifyByWhatsapp(!notifyByWhatsapp)
                            }}
                          >
                            <div className={`w-5 h-5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors ${notifyByWhatsapp
                              ? 'bg-lukess-gold border-lukess-gold'
                              : 'bg-transparent border-gray-500 group-hover:border-gray-300'
                              }`}>
                              {notifyByWhatsapp && (
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                  <path d="M1 4L3.5 6.5L9 1" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm text-gray-200 select-none">
                              💬 Por WhatsApp
                            </span>
                          </label>


                        </div>
                      </div>

                      {/* ── SECTION B: Método de entrega ── */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          ¿Cómo quieres recibir tu pedido?
                        </h3>

                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setDeliveryMethod('delivery')}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${deliveryMethod === 'delivery'
                              ? 'border-gray-900 bg-gray-50 shadow-sm'
                              : 'border-gray-200 hover:border-gray-300'
                              }`}
                          >
                            <Truck
                              className={`w-6 h-6 mb-2 ${deliveryMethod === 'delivery' ? 'text-gray-900' : 'text-gray-400'}`}
                            />
                            <p className="font-bold text-sm text-gray-800">Envío a domicilio</p>
                            <p className="text-xs text-gray-500 mt-0.5">Santa Cruz</p>
                            <div className="mt-2">
                              {total >= FREE_SHIPPING_THRESHOLD ? (
                                <p className="text-xs text-green-600 font-semibold">Gratis 🎉</p>
                              ) : (
                                <>
                                  <p className="text-xs text-gray-500">
                                    Desde Bs 5 · máx. {MAX_DELIVERY_DISTANCE_KM} km
                                  </p>
                                  <p className="text-xs text-green-600">
                                    ≥ Bs {FREE_SHIPPING_THRESHOLD} → Gratis
                                  </p>
                                </>
                              )}
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeliveryMethod('pickup')}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${deliveryMethod === 'pickup'
                              ? 'border-gray-900 bg-gray-50 shadow-sm'
                              : 'border-gray-200 hover:border-gray-300'
                              }`}
                          >
                            <Store
                              className={`w-6 h-6 mb-2 ${deliveryMethod === 'pickup' ? 'text-gray-900' : 'text-gray-400'}`}
                            />
                            <p className="font-bold text-sm text-gray-800">Recoger en tienda</p>
                            <p className="text-xs text-gray-500 mt-0.5">Mercado Mutualista</p>
                            <p className="text-xs text-green-600 font-semibold mt-2">
                              Siempre gratis
                            </p>
                            <p className="text-xs text-gray-400 mt-1">(Las reservas duran 48 horas máximo)</p>
                          </button>
                        </div>

                        {/* ── DELIVERY: location flow ── */}
                        {deliveryMethod === 'delivery' && (
                          <>
                            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 space-y-4">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <p className="text-sm font-semibold text-gray-700">
                                  ¿Dónde entregamos tu pedido?
                                </p>
                              </div>

                              {/* STEP A — Initial: two options */}
                              {locationState === 'initial' && (
                                <div className="space-y-3">
                                  <button
                                    type="button"
                                    onClick={handleGps}
                                    className="flex items-center gap-3 w-full p-3 rounded-xl border-2 border-gray-900 bg-gray-50 hover:bg-gray-100 transition-all text-left"
                                  >
                                    <Navigation className="w-5 h-5 text-gray-700 flex-shrink-0" />
                                    <div>
                                      <p className="text-sm font-bold text-gray-800">
                                        Usar mi ubicación actual
                                      </p>
                                    </div>
                                  </button>

                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-px bg-gray-200" />
                                    <span className="text-xs text-gray-400 px-1">o</span>
                                    <div className="flex-1 h-px bg-gray-200" />
                                  </div>

                                  <button
                                    type="button"
                                    onClick={handleOpenMap}
                                    className="flex items-center gap-3 w-full p-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all text-left"
                                  >
                                    <Map className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                    <div>
                                      <p className="text-sm font-bold text-gray-800">
                                        Elegir en el mapa
                                      </p>
                                    </div>
                                  </button>
                                </div>
                              )}

                              {/* GPS Loading */}
                              {locationState === 'gps_loading' && (
                                <div className="flex items-center justify-center gap-3 py-6">
                                  <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                                  <p className="text-sm text-gray-600 font-medium">
                                    Obteniendo tu ubicación...
                                  </p>
                                </div>
                              )}

                              {/* GPS Denied — instructions + map option */}
                              {locationState === 'gps_denied' && (
                                <div className="space-y-3">
                                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-2.5">
                                    <p className="text-xs font-bold text-red-700">
                                      📍 Ubicación bloqueada
                                    </p>
                                    <p className="text-xs text-red-600">
                                      GPS no disponible en este navegador.
                                    </p>
                                    <div className="space-y-1.5">
                                      <p className="text-xs font-semibold text-gray-700">
                                        Cómo activar:
                                      </p>
                                      <div className="bg-white border border-red-100 rounded-lg p-2.5">
                                        <p className="text-xs text-gray-700 font-medium mb-0.5">
                                          🖥️ Chrome / Edge:
                                        </p>
                                        <p className="text-xs text-gray-600 leading-relaxed">
                                          Haz clic en el ícono 📍 tachado en la barra de dirección
                                          (arriba izquierda) → activa{' '}
                                          <strong>Ubicación</strong> → Permitir → recarga la página
                                        </p>
                                      </div>
                                      <div className="bg-white border border-red-100 rounded-lg p-2.5">
                                        <p className="text-xs text-gray-700 font-medium mb-0.5">
                                          📱 Celular:
                                        </p>
                                        <p className="text-xs text-gray-600 leading-relaxed">
                                          Toca el ícono en la barra de dirección → Permisos →{' '}
                                          <strong>Ubicación</strong> → Permitir
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-px bg-gray-200" />
                                    <span className="text-xs text-gray-400 px-1">o elige en el mapa</span>
                                    <div className="flex-1 h-px bg-gray-200" />
                                  </div>

                                  <button
                                    type="button"
                                    onClick={handleOpenMap}
                                    className="flex items-center gap-3 w-full p-3 rounded-xl border-2 border-gray-900 bg-gray-50 hover:bg-gray-100 transition-all text-left"
                                  >
                                    <Map className="w-5 h-5 text-gray-700 flex-shrink-0" />
                                    <div>
                                      <p className="text-sm font-bold text-gray-800">
                                        Elegir ubicación en el mapa
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Sin necesidad de GPS
                                      </p>
                                    </div>
                                  </button>
                                </div>
                              )}

                              {/* STEP B — Map open (draggable, with live cost) */}
                              {locationState === 'map_open' &&
                                gpsLat !== null &&
                                gpsLng !== null && (
                                  <div className="space-y-3">
                                    {locationSource === 'gps' && (
                                      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                                        <Navigation className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                                        <p className="text-xs text-green-700 font-medium">
                                          ✓ Ubicación GPS · puedes ajustar el pin si es necesario
                                        </p>
                                      </div>
                                    )}

                                    <DeliveryMapPicker
                                      key="map-open"
                                      lat={gpsLat}
                                      lng={gpsLng}
                                      draggable={true}
                                      height={280}
                                      onLocationSelect={handleMapLocationUpdate}
                                    />

                                    {/* Live cost preview */}
                                    {gpsDistanceKm !== null && !isOutOfRange && (
                                      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 space-y-0.5">
                                        <p className="text-xs text-gray-600">
                                          📍{' '}
                                          <span className="font-semibold">
                                            {gpsDistanceKm.toFixed(1)} km
                                          </span>{' '}
                                          del local
                                        </p>
                                        <p className="text-xs text-gray-600">
                                          🚚 Costo de envío:{' '}
                                          {shippingCost === 0 ? (
                                            <span className="text-green-600 font-bold">
                                              Gratis 🎉
                                            </span>
                                          ) : (
                                            <span className="font-bold text-gray-800">
                                              Bs {shippingCost}
                                            </span>
                                          )}
                                        </p>
                                      </div>
                                    )}

                                    {/* Out of range warning in map_open */}
                                    {isOutOfRange && gpsDistanceKm !== null && (
                                      <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-2">
                                        <p className="text-xs font-bold text-red-700">
                                          📍 {gpsDistanceKm.toFixed(1)} km — Fuera de zona de envío
                                        </p>
                                        <p className="text-xs text-red-600">
                                          Máximo {MAX_DELIVERY_DISTANCE_KM} km. Mueve el pin a una
                                          zona más cercana o cotiza por WhatsApp:
                                        </p>
                                        <a
                                          href={outOfRangeWaUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center justify-center gap-2 w-full bg-[#25d366] hover:bg-[#1fb855] text-white text-xs font-semibold py-2 rounded-lg shadow-sm transition-all"
                                        >
                                          <MessageCircle className="w-3.5 h-3.5" />
                                          Cotizar envío por WhatsApp
                                        </a>
                                        <div className="flex items-center gap-2 pt-1">
                                          <div className="flex-1 h-px bg-red-200" />
                                          <span className="text-xs text-red-400">ó</span>
                                          <div className="flex-1 h-px bg-red-200" />
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => setDeliveryMethod('pickup')}
                                          className="text-xs text-lukess-gold font-semibold underline hover:no-underline w-full text-center"
                                        >
                                          🏪 Ver opciones de recojo →
                                        </button>
                                      </div>
                                    )}

                                    {/* Confirm button (only if within range) */}
                                    {!isOutOfRange && (
                                      <button
                                        type="button"
                                        onClick={handleConfirmLocation}
                                        className="w-full bg-gray-900 hover:bg-black text-white font-bold py-2.5 rounded-xl text-sm transition-all"
                                      >
                                        ✓ Confirmar esta ubicación
                                      </button>
                                    )}
                                  </div>
                                )}

                              {/* STEP C — Confirmed: smaller static map + summary */}
                              {locationState === 'confirmed' &&
                                gpsLat !== null &&
                                gpsLng !== null && (
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <p className="text-xs font-bold text-green-700">
                                        ✓ Ubicación de entrega confirmada
                                      </p>
                                      <button
                                        type="button"
                                        onClick={handleResetLocation}
                                        className="text-xs text-gray-500 hover:text-gray-700 underline"
                                      >
                                        Cambiar
                                      </button>
                                    </div>

                                    <DeliveryMapPicker
                                      key="map-confirmed"
                                      lat={gpsLat}
                                      lng={gpsLng}
                                      draggable={false}
                                      height={200}
                                    />

                                    <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 space-y-0.5">
                                      <p className="text-xs text-green-700">
                                        📍{' '}
                                        <span className="font-semibold">
                                          {gpsDistanceKm?.toFixed(1)} km
                                        </span>{' '}
                                        del local
                                      </p>
                                      <p className="text-xs text-green-700">
                                        🚚 Costo de envío:{' '}
                                        {shippingCost === 0 ? (
                                          <span className="font-bold">Gratis 🎉</span>
                                        ) : (
                                          <span className="font-bold">Bs {shippingCost}</span>
                                        )}
                                      </p>
                                      {mapsLink && (
                                        <a
                                          href={mapsLink}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-block text-xs text-lukess-gold hover:underline"
                                        >
                                          Ver en Maps →
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                )}

                              {/* Address + Reference + Recipient — only when confirmed */}
                              {locationState === 'confirmed' && !isOutOfRange && (
                                <>
                                  <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                      Dirección *
                                    </label>
                                    <input
                                      type="text"
                                      value={shippingAddress}
                                      onChange={(e) => {
                                        setShippingAddress(e.target.value)
                                        if (shippingAddressError) setShippingAddressError('')
                                      }}
                                      className={`w-full px-3 py-2.5 border-2 rounded-lg text-sm focus:outline-none transition-colors ${shippingAddressError
                                        ? 'border-red-400 focus:border-red-500'
                                        : 'border-gray-200 focus:border-gray-500'
                                        }`}
                                      placeholder="Calle, número, zona/barrio"
                                    />
                                    {shippingAddressError && (
                                      <p className="mt-1 text-xs text-red-500">
                                        {shippingAddressError}
                                      </p>
                                    )}
                                  </div>

                                  <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                      Referencia
                                    </label>
                                    <input
                                      type="text"
                                      value={shippingReference}
                                      onChange={(e) => setShippingReference(e.target.value)}
                                      className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:border-gray-500 focus:outline-none"
                                      placeholder="Ej: Frente al parque, edificio azul"
                                    />
                                  </div>

                                  {/* Recipient info */}
                                  <div className="border-t border-gray-200 pt-3 space-y-3">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                      ¿Quién recibe el pedido?
                                    </p>

                                    <div>
                                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                        Nombre de quien recibe *
                                      </label>
                                      <input
                                        type="text"
                                        value={recipientName}
                                        onChange={(e) => {
                                          hasManuallyEditedRecipient.current = true
                                          setRecipientName(e.target.value)
                                        }}
                                        className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:border-gray-500 focus:outline-none"
                                        placeholder="Puede ser diferente al tuyo"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                        Teléfono de quien recibe *
                                      </label>
                                      <input
                                        type="tel"
                                        value={recipientPhone}
                                        onChange={(e) => {
                                          setRecipientPhone(e.target.value)
                                          if (recipientPhoneError) setRecipientPhoneError('')
                                        }}
                                        className={`w-full px-3 py-2.5 border-2 rounded-lg text-sm focus:outline-none transition-colors ${recipientPhoneError
                                          ? 'border-red-400 focus:border-red-500'
                                          : 'border-gray-200 focus:border-gray-500'
                                          }`}
                                        placeholder="Para coordinar la entrega"
                                      />
                                      {recipientPhoneError && (
                                        <p className="mt-1 text-xs text-red-500">
                                          {recipientPhoneError}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Delivery instructions — optional */}
                                  <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                      <label className="text-xs font-semibold text-gray-600">
                                        📝 Instrucciones para el mensajero
                                      </label>
                                      <span className="text-xs text-gray-400">
                                        {deliveryInstructions.length}/200
                                      </span>
                                    </div>
                                    <textarea
                                      value={deliveryInstructions}
                                      onChange={(e) => {
                                        if (e.target.value.length <= 200)
                                          setDeliveryInstructions(e.target.value)
                                      }}
                                      rows={3}
                                      className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:border-gray-500 focus:outline-none resize-none"
                                      placeholder='Ej: "Tocar el timbre", "Llamar al llegar", "Casa azul con reja negra"'
                                    />
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Store closed notice for delivery */}
                            {storeStatus && !storeStatus.open && (
                              <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2.5 mb-2">
                                <span className="text-base flex-shrink-0 mt-0.5">ℹ️</span>
                                <div>
                                  <p className="text-xs font-semibold text-blue-700 mb-0.5">
                                    Pedido fuera de horario
                                  </p>
                                  <p className="text-xs text-blue-600 leading-relaxed">
                                    Lo procesaremos cuando abramos: <strong>{storeStatus.nextOpenTime}</strong>.<br />
                                    Los envíos se coordinan en horario de atención.
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Coordination notice */}
                            <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2.5">
                              <span className="text-base flex-shrink-0 mt-0.5">ℹ️</span>
                              <div>
                                <p className="text-xs font-semibold text-blue-700 mb-0.5">
                                  Importante
                                </p>
                                <p className="text-xs text-blue-600 leading-relaxed">
                                  Te avisaremos por WhatsApp antes de enviar tu pedido para
                                  coordinar la entrega. Asegúrate de estar disponible en la
                                  ubicación indicada.
                                </p>
                              </div>
                            </div>
                          </>
                        )}

                        {/* ── PICKUP ── */}
                        {deliveryMethod === 'pickup' && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-1">
                              <Store className="w-4 h-4 text-gray-500" />
                              <p className="text-sm font-semibold text-gray-700">
                                Elige el puesto de recogida
                              </p>
                            </div>

                            {pickupLocationError && (
                              <p className="text-xs text-red-500 mb-1">{pickupLocationError}</p>
                            )}

                            {storeStatus && !storeStatus.open && (
                              <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl p-3 text-xs mb-2 mt-1">
                                <p className="font-bold">⏰ Fuera de horario de atención</p>
                                <p className="mt-1">
                                  Tu pedido será procesado cuando abramos: <strong>{storeStatus.nextOpenTime}</strong><br />
                                  Lun–Sáb 8AM–10PM · Dom 9AM–9PM
                                </p>
                              </div>
                            )}

                            {PICKUP_LOCATIONS.map((loc) => (
                              <button
                                key={loc.id}
                                type="button"
                                onClick={() => {
                                  setPickupLocation(loc.id)
                                  if (pickupLocationError) setPickupLocationError('')
                                }}
                                className={`w-full p-3 rounded-xl border-2 text-left transition-all ${pickupLocation === loc.id
                                  ? 'border-gray-900 bg-gray-50'
                                  : 'border-gray-200 hover:border-gray-300'
                                  }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-gray-800">
                                      {loc.name} — {loc.aisle}, {loc.stall}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">{loc.hours}</p>
                                  </div>
                                  <a
                                    href={loc.mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-xs text-lukess-gold hover:underline whitespace-nowrap flex-shrink-0 mt-0.5"
                                  >
                                    {loc.mapsLabel}
                                  </a>
                                </div>
                              </button>
                            ))}

                            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                              ⏰ Recuerda venir en horario de atención
                            </p>
                          </div>
                        )}
                      </div>

                      {/* ── Código de Descuento ── */}
                      <div className="space-y-2">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Código de descuento
                        </h3>
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <input
                            type="text"
                            value={discountCode}
                            onChange={(e) => {
                              setDiscountCode(e.target.value)
                              if (discountValidation) setDiscountValidation(null)
                            }}
                            className="flex-1 px-3 py-2.5 text-sm bg-white focus:outline-none uppercase placeholder:normal-case"
                            placeholder="Ej: VERANO20"
                            disabled={isValidatingCode}
                          />
                          <button
                            type="button"
                            onClick={handleValidateDiscountCode}
                            disabled={isValidatingCode || !discountCode.trim()}
                            className="px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-1.5"
                          >
                            {isValidatingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Aplicar'}
                          </button>
                        </div>
                        {discountValidation && (
                          <div className={`flex items-center gap-1.5 text-sm ${discountValidation.valid ? 'text-green-600' : 'text-red-500'}`}>
                            {discountValidation.valid ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                            <span>{discountValidation.message}</span>
                          </div>
                        )}
                      </div>

                      {/* ── Método de Pago ── */}
                      <div className="space-y-3">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          ¿Cómo vas a pagar?
                        </h3>

                        {deliveryMethod === 'pickup' ? (
                          <div className="grid grid-cols-1 gap-2">
                            {[
                              { value: 'qr' as PaymentMethod, icon: '📱', label: 'Pagaré por QR', sub: 'Pago online antes de recoger' },
                              { value: 'cash_on_pickup' as PaymentMethod, icon: '🏪', label: 'Pagaré en el puesto', sub: 'Efectivo, QR o tarjeta al recoger' },
                            ].map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => setSelectedPayment(opt.value)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${selectedPayment === opt.value
                                  ? 'border-gray-900 bg-gray-50'
                                  : 'border-gray-200 hover:border-gray-300'
                                  }`}
                              >
                                <span className="text-2xl flex-shrink-0">{opt.icon}</span>
                                <div>
                                  <p className="font-semibold text-sm text-gray-800">{opt.label}</p>
                                  <p className="text-xs text-gray-500">{opt.sub}</p>
                                </div>
                                {selectedPayment === opt.value && (
                                  <CheckCircle className="w-4 h-4 text-gray-900 ml-auto flex-shrink-0" />
                                )}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3">
                            <span className="text-2xl">📱</span>
                            <div>
                              <p className="font-semibold text-sm text-gray-800">Pago online</p>
                              <p className="text-xs text-gray-500">Te mostraremos el QR para pagar</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* ── Order Summary ── */}
                      <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-200 space-y-2">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Subtotal:</span>
                          <span>Bs {total.toFixed(2)}</span>
                        </div>

                        {discountValidation?.valid && (
                          <div className="flex items-center justify-between text-sm text-green-600">
                            <span>Descuento ({discountCode.toUpperCase()}):</span>
                            <span>-Bs {appliedDiscountAmount.toFixed(2)}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Envío:</span>
                          {deliveryMethod === 'pickup' ? (
                            <span className="text-gray-700 font-semibold">
                              Bs 0.00 <span className="text-green-600 text-xs">(Retiro en tienda)</span>
                            </span>
                          ) : isOutOfRange ? (
                            <span className="text-red-600 font-medium text-xs">
                              Fuera de zona · cotizar por WhatsApp
                            </span>
                          ) : locationState !== 'confirmed' ? (
                            <span className="text-amber-600 font-medium text-xs">
                              Pendiente ubicación
                            </span>
                          ) : shippingCost === 0 ? (
                            <span className="text-gray-700 font-semibold">
                              Bs 0.00 <span className="text-green-600 text-xs">(Envío gratis)</span>
                            </span>
                          ) : (
                            <span className="text-gray-700 font-semibold">
                              Bs {shippingCost.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
                          <span className="text-gray-700 font-semibold">Total a Pagar:</span>
                          <span className="text-3xl font-bold text-gray-900">
                            Bs {orderTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>


                      <button
                        type="submit"
                        disabled={isContinueDisabled}
                        className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-xl font-bold text-lg transform hover:scale-105 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {continueLabel}
                      </button>
                    </form>
                  )}

                  {/* ── STEP 2: PAGO QR ── */}
                  {step === 'qr' && (
                    <div className="text-center space-y-6">
                      <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-200">
                        <p className="text-sm text-gray-700 mb-2">Orden #</p>
                        <p className="text-lg font-mono font-bold text-gray-900">
                          {orderId.slice(0, 8).toUpperCase()}
                        </p>
                      </div>

                      <div>
                        <p className="text-base font-bold text-gray-800 mb-4">
                          Escanea el QR para pagar
                        </p>
                        <div className="bg-white p-4 rounded-xl border border-gray-200 inline-block max-w-full overflow-hidden mb-4">
                          <Image
                            src="/qr-yolo-pago.png"
                            alt="QR Yolo Pago"
                            width={280}
                            height={280}
                            className="rounded-lg w-full max-w-[280px] h-auto"
                          />
                        </div>

                        <a
                          href="/qr-yolo-pago.png"
                          download="qr-yolo-pago.png"
                          className="flex items-center justify-center gap-2 w-full max-w-[280px] mx-auto bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-3 px-4 rounded-xl transition-all border border-gray-200 mb-2"
                        >
                          <Download className="w-5 h-5 flex-shrink-0" />
                          <span className="truncate">Descargar QR</span>
                        </a>

                        {formData?.discountValidation?.valid && (
                          <p className="text-xs text-amber-600 mt-2">
                            Al confirmar, tu cupón de descuento se usará permanentemente.
                          </p>
                        )}
                      </div>

                      {/* ── Subir comprobante (opcional) ── */}
                      <div className="border border-gray-200 rounded-lg p-4 text-left space-y-3">
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-4 h-4 text-gray-500" />
                          <p className="text-sm font-semibold text-gray-700">
                            Subí tu comprobante de pago
                          </p>
                          <span className="text-xs text-gray-400 ml-auto">Opcional</span>
                        </div>

                        {receiptUploadState === 'idle' && (
                          <>
                            <p className="text-xs text-gray-500 leading-relaxed">
                              Subí la captura de tu comprobante para acelerar la verificación
                              de tu pago
                            </p>
                            <label className="flex items-center justify-center gap-2 w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm py-2.5 rounded-lg cursor-pointer transition-all">
                              <Paperclip className="w-4 h-4" />
                              Elegir imagen
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0]
                                  if (f) handleReceiptSelect(f)
                                }}
                              />
                            </label>
                            <p className="text-xs text-gray-400 text-center">
                              Formatos: JPG, PNG, WebP · Máx 5 MB
                            </p>
                          </>
                        )}

                        {receiptUploadState === 'uploading' && (
                          <div className="flex items-center justify-center gap-3 py-3">
                            <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                            <p className="text-sm text-gray-600 font-medium">
                              Subiendo comprobante...
                            </p>
                          </div>
                        )}

                        {receiptUploadState === 'success' && (
                          <div className="flex items-center gap-3">
                            {receiptPreviewUrl && (
                              <button
                                type="button"
                                onClick={() => setShowReceiptLightbox(true)}
                                className="flex-shrink-0 focus:outline-none"
                                title="Ver imagen completa"
                              >
                                <img
                                  src={receiptPreviewUrl}
                                  alt="Comprobante"
                                  className="w-[120px] h-[120px] object-cover rounded-xl border-2 border-gray-200 cursor-pointer hover:border-gray-500 transition-colors shadow-sm"
                                />
                              </button>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 text-green-600 font-semibold text-sm">
                                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                Comprobante recibido ✓
                              </div>
                              {receiptFile && (
                                <p className="text-xs text-gray-400 mt-0.5 truncate">
                                  {receiptFile.name}
                                </p>
                              )}
                            </div>
                            <label className="text-xs text-lukess-gold hover:underline cursor-pointer flex-shrink-0">
                              Cambiar imagen
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0]
                                  if (f) {
                                    handleReceiptReset()
                                    handleReceiptSelect(f)
                                  }
                                }}
                              />
                            </label>
                          </div>
                        )}

                        {receiptUploadState === 'error' && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-red-600">
                              <AlertCircle className="w-4 h-4 flex-shrink-0" />
                              <p className="text-sm font-medium">{receiptError}</p>
                            </div>
                            <label className="flex items-center justify-center gap-2 w-full border-2 border-red-300 text-red-600 hover:bg-red-50 font-semibold text-sm py-2 rounded-xl cursor-pointer transition-all">
                              Reintentar
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0]
                                  if (f) {
                                    handleReceiptReset()
                                    handleReceiptSelect(f)
                                  }
                                }}
                              />
                            </label>
                          </div>
                        )}
                      </div>

                      {/* Total a pagar */}
                      <div className="bg-gray-900 text-white p-4 rounded-lg text-center">
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total a Pagar</p>
                        <p className="text-3xl font-bold">Bs {orderTotal.toFixed(2)}</p>
                        {shippingCost > 0 && (
                          <p className="text-xs mt-1 text-gray-400">
                            Incluye Bs {shippingCost.toFixed(2)} de envío
                          </p>
                        )}
                      </div>

                      <button
                        onClick={handlePaymentConfirmed}
                        disabled={isProcessing}
                        className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transform hover:scale-105 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isProcessing ? 'Procesando...' : '✓ Ya Pagué'}
                      </button>
                    </div>
                  )}

                  {/* ── STEP 3: ÉXITO ── */}
                  {step === 'success' && (
                    <div className="text-center space-y-6 py-8 relative overflow-hidden">
                      <SparkleEffect isActive={showConfetti} />

                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', duration: 0.8, bounce: 0.5 }}
                        className="relative"
                      >
                        <div className="w-28 h-28 mx-auto bg-gray-900 text-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm shadow-green-500/30">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: 'spring' }}
                          >
                            <CheckCircle className="w-16 h-16 text-white" />
                          </motion.div>
                        </div>
                        <motion.div
                          initial={{ scale: 1, opacity: 0.5 }}
                          animate={{ scale: 1.5, opacity: 0 }}
                          transition={{ duration: 1, repeat: 2 }}
                          className="absolute inset-0 w-28 h-28 mx-auto border-4 border-green-400 rounded-full"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <PartyPopper className="w-6 h-6 text-lukess-gold" />
                          <h3 className="text-3xl font-black text-gray-900">
                            ¡Felicidades!
                          </h3>
                          <PartyPopper className="w-6 h-6 text-lukess-gold scale-x-[-1]" />
                        </div>
                        <p className="text-lg text-gray-600 font-medium">
                          Tu orden ha sido confirmada
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200"
                      >
                        <p className="text-sm text-gray-600 mb-1">Número de Orden</p>
                        <p className="text-2xl font-mono font-black text-gray-900 tracking-wider">
                          #{orderId.slice(0, 8).toUpperCase()}
                        </p>
                      </motion.div>

                      {/* Delivery info */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55 }}
                        className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 text-left"
                      >
                        {deliveryMethod === 'delivery' ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 mb-2">
                              <Truck className="w-4 h-4 text-gray-500" />
                              <p className="text-sm font-bold text-gray-700">
                                Entrega a domicilio
                              </p>
                            </div>
                            <p className="text-sm text-gray-800">{shippingAddress}</p>
                            {shippingReference && (
                              <p className="text-xs text-gray-500">Ref: {shippingReference}</p>
                            )}
                            {recipientName && (
                              <p className="text-xs text-gray-600">
                                👤 Recibe:{' '}
                                <span className="font-semibold">{recipientName}</span>
                                {recipientPhone && ` · ${recipientPhone}`}
                              </p>
                            )}
                            {deliveryInstructions && (
                              <p className="text-xs text-gray-500">
                                📝 {deliveryInstructions}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 pt-0.5">
                              {gpsDistanceKm !== null &&
                                `${gpsDistanceKm.toFixed(1)} km · `}
                              Envío:{' '}
                              {shippingCost === 0 ? (
                                <span className="text-green-600 font-semibold">Gratis 🎉</span>
                              ) : (
                                <span className="font-semibold text-gray-700">
                                  Bs {shippingCost.toFixed(2)}
                                </span>
                              )}
                            </p>
                            {mapsLink && (
                              <a
                                href={mapsLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block text-xs text-lukess-gold hover:underline"
                              >
                                Ver mi ubicación en Maps →
                              </a>
                            )}
                          </div>
                        ) : selectedPickup ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 mb-2">
                              <Store className="w-4 h-4 text-gray-500" />
                              <p className="text-sm font-bold text-gray-700">Retiro en tienda</p>
                            </div>
                            <p className="text-sm font-semibold text-gray-800">
                              {selectedPickup.name} — {selectedPickup.aisle},{' '}
                              {selectedPickup.stall}
                            </p>
                            <p className="text-xs text-gray-500">{selectedPickup.hours}</p>
                            <a
                              href={selectedPickup.mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block text-xs text-lukess-gold hover:underline"
                            >
                              {selectedPickup.mapsLabel}
                            </a>
                          </div>
                        ) : null}
                      </motion.div>

                      {/* Delivery time banner — only for delivery orders */}
                      {deliveryMethod === 'delivery' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.58 }}
                          className="border-l-4 border-amber-500 bg-gray-50 border border-gray-200 rounded-xl p-4 text-left space-y-2"
                        >
                          <p className="text-sm font-bold text-gray-700">
                            🕐 Tiempo estimado de entrega
                          </p>
                          <div className="space-y-1.5 text-xs text-gray-600">
                            <div className="flex items-start gap-2">
                              <span className="text-base flex-shrink-0">⚡</span>
                              <div>
                                <p className="font-semibold text-gray-700">
                                  Mínimo: ~30 min – 1 hora
                                </p>
                                <p className="text-gray-500">
                                  Si el puesto está abierto y hay disponibilidad de Yango
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-base flex-shrink-0">📅</span>
                              <div>
                                <p className="font-semibold text-gray-700">
                                  Máximo: hasta 2 días hábiles
                                </p>
                                <p className="text-gray-500">
                                  Si el pedido entra fuera de horario o hay alta demanda
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-base flex-shrink-0">🕐</span>
                              <div>
                                <p className="font-semibold text-gray-700">Horario de atención</p>
                                <p className="text-gray-500">
                                  Lun–Sáb 8AM–10PM · Dom 9AM–9PM
                                </p>
                              </div>
                            </div>
                            <div className="bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 mt-1">
                              <p className="text-xs text-amber-700">
                                ⚠️ Pedidos fuera de horario se procesan al día siguiente
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* 48h reservation banner for cash on pickup */}
                      {formData?.selectedPayment === 'cash_on_pickup' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.57 }}
                          className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 text-left space-y-1"
                        >
                          <p className="text-sm font-bold text-amber-800">
                            ⏰ Reserva activa por 48 horas
                          </p>
                          <p className="text-xs text-amber-700 leading-relaxed">
                            Tu pedido estará disponible en{' '}
                            <strong>{selectedPickup?.name ?? pickupLocation}</strong>{' '}
                            durante las próximas 48 horas. Pasado ese tiempo, la reserva se cancelará.
                          </p>
                          <p className="text-xs font-semibold text-amber-800 pt-1">
                            💳 Pago en el puesto: efectivo, QR o tarjeta.
                          </p>
                        </motion.div>
                      )}

                      {/* WhatsApp — Primary CTA */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-3"
                      >
                        {deliveryMethod === 'pickup' ? (
                          <>
                            {formData?.selectedPayment === 'cash_on_pickup' ? (
                              <>
                                <p className="text-sm text-gray-600 text-center">
                                  Avísanos por WhatsApp para confirmar tu reserva.
                                </p>
                                <a
                                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola! Hice el pedido #${orderId.slice(0, 8).toUpperCase()} para recoger en tienda. Pagaré al recoger en efectivo. ¿Pueden confirmar? 🙏`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-black text-white font-bold uppercase py-4 rounded-lg transition-all shadow-sm"
                                >
                                  <MessageCircle className="w-5 h-5" />
                                  CONFIRMAR RESERVA POR WHATSAPP
                                </a>
                                <p className="text-xs text-gray-500 text-center leading-relaxed">
                                  ⏱️ Tu reserva dura <strong>48 horas</strong>. Pasado ese tiempo, se cancelará automáticamente.
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="text-sm text-gray-600 text-center">
                                  Envíanos el comprobante por WhatsApp para confirmar.
                                </p>
                                <a
                                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}${receiptUploadState === 'success' ? encodeURIComponent('\n📎 Ya subí mi comprobante de pago en el sistema.') : ''}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold uppercase py-4 rounded-lg transition-all shadow-sm"
                                >
                                  <MessageCircle className="w-5 h-5" />
                                  CONFIRMAR PAGO POR WHATSAPP
                                </a>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <p className="text-sm text-gray-600 text-center">
                              Revisaremos tu pago y te contactaremos por WhatsApp.
                            </p>
                            <a
                              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}${receiptUploadState === 'success' ? encodeURIComponent('\n📎 Ya subí mi comprobante de pago en el sistema.') : ''}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold uppercase py-4 rounded-lg transition-all shadow-sm"
                            >
                              <MessageCircle className="w-5 h-5" />
                              CONFIRMAR POR WHATSAPP
                            </a>
                          </>
                        )}
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.75 }}
                        className="text-center"
                      >
                        <button
                          onClick={handleContinueShopping}
                          className="text-gray-500 underline hover:text-gray-700 text-sm transition-colors"
                        >
                          Seguir comprando
                        </button>
                      </motion.div>

                      {!isLoggedIn && showAccountCard && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 }}
                          className="border-2 border-gray-200 bg-gray-50 rounded-xl p-5 text-left relative"
                        >
                          <button
                            onClick={() => setShowAccountCard(false)}
                            className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Cerrar"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          <div className="flex items-center gap-2 mb-3 pr-6">
                            <User className="w-5 h-5 text-gray-500" />
                            <p className="font-bold text-gray-800 text-base">
                              Guarda tu historial de pedidos
                            </p>
                          </div>

                          <p className="text-xs text-gray-500 mb-3">
                            Con una cuenta gratuita puedes:
                          </p>

                          <ul className="space-y-1 mb-4">
                            {[
                              'Ver todos tus pedidos',
                              'Guardar tus favoritos',
                              'Checkout más rápido la próxima vez',
                            ].map((benefit) => (
                              <li
                                key={benefit}
                                className="flex items-center gap-2 text-sm text-gray-600"
                              >
                                <span className="text-lukess-gold font-bold">✓</span>
                                {benefit}
                              </li>
                            ))}
                          </ul>

                          <div className="flex gap-2">
                            <button
                              onClick={() => setIsAuthModalOpen(true)}
                              className="flex-1 bg-gray-900 hover:bg-black text-white font-semibold py-2.5 rounded-lg text-sm transition-all"
                            >
                              Crear cuenta gratis
                            </button>
                            <button
                              onClick={() => setShowAccountCard(false)}
                              className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-lg text-sm transition-all"
                            >
                              Saltar →
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode="post-purchase"
        postPurchaseEmail={customerData.email}
        postPurchaseName={customerData.name}
      />

      {/* ── Lightbox comprobante ── */}
      <AnimatePresence>
        {showReceiptLightbox && receiptPreviewUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReceiptLightbox(false)}
            className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4"
          >
            <button
              onClick={() => setShowReceiptLightbox(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors z-10"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={receiptPreviewUrl}
              alt="Comprobante de pago"
              style={{ maxWidth: '90vw', maxHeight: '85vh' }}
              className="rounded-xl border border-gray-200 shadow-sm object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
