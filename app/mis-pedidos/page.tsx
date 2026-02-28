'use client'
import { useState, useEffect } from 'react'
import { Package, Search, Loader2, Shirt, ChevronRight, Clock, CheckCircle, RefreshCw, MessageCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/context/AuthContext'
import { useCart } from '@/lib/context/CartContext'
import Link from 'next/link'
import Image from 'next/image'
import { AuthModal } from '@/components/auth/AuthModal'
import Container from '@/components/ui/Container'
import toast from 'react-hot-toast'
import { Product } from '@/lib/types'
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp'

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled'

interface OrderProduct {
  id: string
  name: string
  image_url: string | null
  images: string[] | null
}

interface OrderItem {
  id: string
  product_id: string
  quantity: number
  unit_price: number
  subtotal: number | null
  size: string | null
  color: string | null
  products: OrderProduct | OrderProduct[] | null
}

interface Order {
  id: string
  created_at: string
  status: OrderStatus
  total: number
  order_items?: OrderItem[]
}

const ORDER_SELECT = `
  id,
  created_at,
  status,
  total,
  order_items (
    id,
    product_id,
    quantity,
    unit_price,
    subtotal,
    size,
    color,
    products (
      id,
      name,
      image_url,
      images
    )
  )
`

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; icon: React.ReactNode }
> = {
  pending: { label: 'Pendiente', icon: <Clock className="w-3.5 h-3.5" /> },
  confirmed: { label: 'Confirmado', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  shipped: { label: 'En camino', icon: <Package className="w-3.5 h-3.5" /> },
  completed: { label: 'Entregado', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  cancelled: { label: 'Cancelado', icon: <Clock className="w-3.5 h-3.5" /> },
}

function resolveProduct(item: OrderItem): OrderProduct | null {
  if (!item.products) return null
  return Array.isArray(item.products) ? (item.products[0] ?? null) : item.products
}

function resolveImage(item: OrderItem): string | null {
  const p = resolveProduct(item)
  if (!p) return null
  if (p.image_url) return p.image_url
  if (p.images && p.images.length > 0) return p.images[0]
  return null
}

function shouldShowSize(size: string | null | undefined): boolean {
  if (!size || size.trim() === '') return false
  if (size === 'Unitalla') return false
  return true
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('es-BO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function OrderCard({ order }: { order: Order }) {
  const { addToCart } = useCart()
  const [isReordering, setIsReordering] = useState(false)
  const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending
  const orderNumber = order.id.slice(0, 8).toUpperCase()

  const handleReorder = async () => {
    const items = order.order_items
    if (!items?.length) return
    setIsReordering(true)

    try {
      const supabase = createClient()
      const productIds = items.map((i) => i.product_id)

      const { data: products } = await supabase
        .from('products')
        .select('*, inventory(quantity, reserved_qty, location_id, size)')
        .in('id', productIds)
        .eq('is_active', true)

      let addedCount = 0
      let skippedCount = 0

      for (const item of items) {
        const product = products?.find((p) => p.id === item.product_id) as Product | undefined
        if (!product) {
          skippedCount++
          continue
        }

        const available = (product.inventory ?? []).reduce(
          (sum, inv) => sum + inv.quantity - (inv.reserved_qty ?? 0),
          0
        )
        if (available <= 0) {
          skippedCount++
          continue
        }

        addToCart(product, item.quantity, item.size ?? undefined, item.color ?? undefined)
        addedCount++
      }

      if (addedCount > 0) {
        toast.success(`Se agregaron ${addedCount} productos al carrito`, { position: 'bottom-center' })
      }
      if (skippedCount > 0) {
        toast(`${skippedCount} producto(s) sin stock no añadidos`, {
          icon: '⚠️',
          position: 'bottom-center',
        })
      }
    } catch (err) {
      console.error('Error al reordenar:', err)
      toast.error('Error al añadir productos al carrito')
    } finally {
      setIsReordering(false)
    }
  }

  const handleWhatsAppSupport = () => {
    const msg = `Hola, quiero consultar sobre mi pedido #${orderNumber}`
    window.open(buildWhatsAppUrl(msg), '_blank')
  }

  return (
    <div className={`border-2 rounded-lg p-6 mb-6 bg-white ${order.status === 'pending' ? 'border-yellow-200 bg-yellow-50/30' :
        order.status === 'completed' ? 'border-green-200 bg-green-50/30' :
          order.status === 'cancelled' ? 'border-red-200 bg-red-50/30' :
            'border-gray-200'
      }`}>
      {/* Header: Order # + Date + Status */}
      <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-5 h-5 text-gray-400" />
            <span className="text-lg font-bold text-gray-900">
              #{orderNumber}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            {formatDate(order.created_at)}
          </p>
        </div>

        {/* Status Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
            order.status === 'completed' ? 'bg-green-100 text-green-700' :
              order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-600'
          }`}>
          {status.icon}
          {status.label}
        </div>
      </div>

      {/* Body: Products + Total */}
      <div className="grid md:grid-cols-[1fr_auto] gap-6 mb-4">
        {/* Products list */}
        <div className="space-y-3">
          {order.order_items?.map(item => {
            const product = resolveProduct(item)
            const imgSrc = resolveImage(item)
            return (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden shrink-0 border border-gray-200">
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={product?.name ?? 'Producto'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Shirt className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {product?.name ?? 'Producto'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {shouldShowSize(item.size) && `Talla: ${item.size} · `}
                    Cantidad: {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  Bs {(item.unit_price * item.quantity).toFixed(2)}
                </span>
              </div>
            )
          })}
        </div>

        {/* Total */}
        <div className="flex flex-col items-start md:items-end justify-center pt-4 md:pt-0 md:pl-6 md:border-l border-gray-200">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
            Total
          </span>
          <span className="text-2xl font-black text-gray-900">
            Bs {order.total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-2 pt-4 border-t border-gray-200">
        <Link
          href={`/pedido/${order.id}`}
          className="w-full sm:flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-bold uppercase tracking-wider hover:border-gray-900 hover:text-gray-900 transition-colors text-center rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          Ver Detalles
        </Link>
        <button
          onClick={handleReorder}
          disabled={isReordering}
          className="w-full sm:flex-1 px-4 py-2.5 bg-gray-900 text-white text-sm font-bold uppercase tracking-wider hover:bg-black transition-colors flex items-center justify-center gap-2 rounded disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        >
          {isReordering ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Comprar de Nuevo
        </button>
        <button
          onClick={handleWhatsAppSupport}
          className="w-full sm:w-auto px-4 py-2.5 bg-white border border-[#25D366] text-[#25D366] hover:bg-[#25D366]/5 transition-colors font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 rounded focus:outline-none focus:ring-2 focus:ring-[#25D366]"
          title="Contactar por WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="sm:hidden text-sm uppercase tracking-wider">Ayuda</span>
        </button>
      </div>
    </div>
  )
}

function GuestSearch() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [searched, setSearched] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)
    setSearched(true)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('orders')
        .select(ORDER_SELECT)
        .eq('customer_email', email.trim().toLowerCase())
        .order('created_at', { ascending: false })

      setOrders((data as unknown as Order[]) ?? [])
    } catch (err) {
      console.error('Error fetching orders:', err)
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded border border-gray-200 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Busca tu pedido con tu email
        </h2>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@ejemplo.com"
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 text-sm"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-gray-900 hover:bg-black text-white rounded font-bold uppercase tracking-wider text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Buscar
          </button>
        </form>
      </div>

      {searched && !isLoading && orders !== null && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="py-20 text-center">
              <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                No encontramos pedidos
              </h2>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                Verifica el correo ingresado o contáctanos por WhatsApp si necesitas ayuda.
              </p>
              <button
                onClick={() => window.open(buildWhatsAppUrl("Hola, quiero consultar mi pedido"), '_blank')}
                className="inline-flex items-center gap-2 px-6 py-3 border border-whatsapp text-whatsapp font-bold text-sm uppercase tracking-wider hover:bg-whatsapp/5 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Contactar Soporte
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
                {orders.length} pedido{orders.length !== 1 ? 's' : ''} encontrado{orders.length !== 1 ? 's' : ''}
              </p>
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </>
          )}
        </div>
      )}

      {!searched && (
        <div className="py-12 border-t border-gray-100 mt-12 text-center">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">¿Ya tienes cuenta?</h3>
          <button
            onClick={() => setIsAuthOpen(true)}
            className="inline-flex items-center px-8 py-3 bg-gray-900 border border-gray-900 text-white text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-gray-900 transition-colors"
          >
            Iniciar sesión
          </button>
        </div>
      )}

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        mode="login"
      />
    </div>
  )
}

function AuthenticatedOrders({ email }: { email: string }) {
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('orders')
          .select(ORDER_SELECT)
          .eq('customer_email', email)
          .order('created_at', { ascending: false })

        setOrders((data as unknown as Order[]) ?? [])
      } catch (err) {
        console.error('Error fetching orders:', err)
        setOrders([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [email])

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
      </div>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="py-20 text-center">
        <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Aún no tienes pedidos
        </h2>
        <p className="text-gray-500 mb-6">
          Explora nuestro catálogo y realiza tu primera compra
        </p>
        <Link
          href="/#catalogo"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-bold text-sm uppercase tracking-wider hover:bg-black transition-colors"
        >
          Ver Productos
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  )
}

export default function MisPedidosPage() {
  const { isLoggedIn, isLoading, user, customerName } = useAuth()
  const [orderCount, setOrderCount] = useState<number | null>(null)

  useEffect(() => {
    if (isLoggedIn && user?.email) {
      const fetchCount = async () => {
        const supabase = createClient()
        const { count } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('customer_email', user.email)

        if (count !== null) setOrderCount(count)
      }
      fetchCount()
    }
  }, [isLoggedIn, user?.email])

  return (
    <section className="bg-white min-h-screen pt-24 pb-12">
      <Container className="max-w-6xl">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-500">Inicio</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 font-medium">Mis Pedidos</span>
        </div>

        {/* Title */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Mis Pedidos
          </h1>
          {isLoggedIn && customerName ? (
            <p className="text-sm text-gray-500">
              Hola, {customerName} {orderCount !== null && `— ${orderCount} ${orderCount === 1 ? 'pedido' : 'pedidos'} en tu historial`}
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              Rastrea y gestiona tus pedidos recientes
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
          </div>
        ) : isLoggedIn && user?.email ? (
          <div className="w-full">
            <AuthenticatedOrders email={user.email} />
          </div>
        ) : (
          <GuestSearch />
        )}
      </Container>
    </section>
  )
}
