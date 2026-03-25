'use client'
import { useState, useEffect } from 'react'
import Container from '@/components/ui/Container'
import { Product } from '@/lib/types'
import { useCart } from '@/lib/context/CartContext'
import { trackViewItem } from '@/lib/analytics'
import { ShoppingCart, MessageCircle, Package, TrendingUp, ChevronRight, Home, Ruler, Minus, Plus } from 'lucide-react'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/utils/shipping'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'
import { ProductGallery } from './ProductGallery'
import { SizeGuideModal } from './SizeGuideModal'
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp'
import { hasActiveDiscount as hasDiscount, getDiscount, getPriceWithDiscount } from '@/lib/utils/price'
import { getHexForColor } from '@/lib/utils/colors'
import { useAuth } from '@/lib/context/AuthContext'
import { Review } from '@/types/review'
import { Star, StarOff, AlertCircle, Loader2 } from 'lucide-react'

interface ProductDetailProps {
  product: Product
  relatedProducts: Product[]
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const { addToCart } = useCart()
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)
  const { user, isLoggedIn } = useAuth()
  
  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [isLoadingReviews, setIsLoadingReviews] = useState(true)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [hasReviewed, setHasReviewed] = useState(false)

  const getTotalStock = (p: Product): number => {
    return p.inventory?.reduce(
      (sum, inv) => sum + Math.max(0, inv.quantity - (inv.reserved_qty ?? 0)),
      0
    ) || 0
  }

  const getStockBySize = (p: Product): Record<string, number> => {
    const result: Record<string, number> = {}
    if (!p.inventory) return result
    for (const inv of p.inventory) {
      const size = inv.size ?? ''
      if (!size) continue
      const available = Math.max(0, inv.quantity - (inv.reserved_qty ?? 0))
      result[size] = (result[size] ?? 0) + available
    }
    return result
  }

  const INTERNAL_SIZES = ['Unitalla', 'Única', 'Unico']
  const validSizes = (product.sizes ?? []).filter(
    (s: string) => s && s.trim() !== '' && !INTERNAL_SIZES.includes(s)
  )
  const needsSize = validSizes.length > 0
  const stock = getTotalStock(product)
  const stockBySize = getStockBySize(product)
  const isOutOfStock = stock === 0

  useEffect(() => {
    trackViewItem({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.categories?.name,
      brand: product.brand ?? undefined,
    })

    // Auto-select color if only one available
    if (product.colors && product.colors.length === 1) {
      setSelectedColor(product.colors[0])
    }

    // Auto-select size if only one valid size available
    if (validSizes.length === 1) {
      const onlySize = validSizes[0]
      const sizeStock = stockBySize[onlySize] ?? 0
      if (sizeStock > 0) {
        setSelectedSize(onlySize)
      }
    }
  }, [product.id, product.colors, validSizes.length]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews?product_id=${product.id}`)
        const data = await res.json()
        if (data.reviews) {
          setReviews(data.reviews)
          setAverageRating(data.averageRating)
          setTotalReviews(data.totalCount)
          // Verificamos si el usuario ya dejó una reseña
          if (user && data.reviews.some((r: Review) => r.user_id === user.id)) {
            setHasReviewed(true)
          }
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
      } finally {
        setIsLoadingReviews(false)
      }
    }
    fetchReviews()
  }, [product.id, user])

  const categoryName = product.categories?.name || ''
  const normalizeText = (text: string) =>
    text.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()

  const normalizedCategory = normalizeText(categoryName)
  const SIZE_GUIDE_CATEGORIES = ['camisa', 'polo', 'pantalon', 'jeans', 'short', 'cinturon', 'sombrero', 'gorra', 'belt']
  const shouldShowSizeGuide = SIZE_GUIDE_CATEGORIES.some(cat => normalizedCategory.includes(cat) || normalizedCategory.includes('bermuda'))

  const discount = getDiscount(product)
  const selectedSizeStock = needsSize && selectedSize ? (stockBySize[selectedSize] ?? 0) : stock
  const selectedSizeAgotada = needsSize && !!selectedSize && selectedSizeStock === 0
  const addToCartDisabled = isOutOfStock || (needsSize && !selectedSize) || selectedSizeAgotada
  const addToCartLabel = isOutOfStock
    ? 'SIN STOCK'
    : needsSize && !selectedSize
      ? 'SELECCIONA UNA TALLA'
      : selectedSizeAgotada
        ? 'TALLA AGOTADA'
        : 'AGREGAR AL CARRITO'

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error('Producto sin stock')
      return
    }

    if (needsSize && !selectedSize) {
      toast.error('Por favor selecciona una talla')
      return
    }

    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error('Por favor selecciona un color')
      return
    }

    if (selectedSizeAgotada) {
      toast.error('La talla seleccionada está agotada')
      return
    }

    if (quantity > selectedSizeStock) {
      toast.error('No hay suficiente stock disponible')
      return
    }

    const sizeForCart = needsSize ? selectedSize : undefined
    addToCart(product, quantity, sizeForCart, selectedColor || undefined)
    toast.success(`${quantity}x ${product.name} agregado al carrito`)
  }

  const handleWhatsApp = () => {
    let message: string
    if (stock === 0) {
      message =
        'Hola! Me interesa este producto 👇\n' +
        `*${product.name}*\n` +
        `💰 Precio: Bs ${product.price.toFixed(2)}\n` +
        '¿Cuándo habrá stock disponible? 🙏'
    } else {
      message =
        'Hola! Me interesa este producto 👇\n' +
        `*${product.name}*\n` +
        `💰 Precio: Bs ${product.price.toFixed(2)}\n` +
        (selectedSize ? `📏 Talla: ${selectedSize}\n` : '') +
        '¿Me pueden dar más información? 🙏'
    }
    window.open(buildWhatsAppUrl(message), '_blank')
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoggedIn) {
      toast.error('Inicia sesión para dejar una reseña')
      return
    }
    if (reviewRating === 0) {
      toast.error('Por favor selecciona una calificación')
      return
    }

    setIsSubmittingReview(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          rating: reviewRating,
          comment: reviewComment,
          reviewer_name: user?.user_metadata?.full_name || 'Usuario'
        })
      })

      const data = await res.json()
      if (data.success) {
        toast.success('¡Gracias por tu reseña!')
        // Actualización optimista
        const newReview: Review = data.review
        setReviews([newReview, ...reviews])
        setTotalReviews(prev => prev + 1)
        setAverageRating(prev => (prev * totalReviews + reviewRating) / (totalReviews + 1))
        setHasReviewed(true)
        setReviewRating(0)
        setReviewComment('')
      } else {
        toast.error('Error al enviar la reseña')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Error al conectar con el servidor')
    } finally {
      setIsSubmittingReview(false)
    }
  }



  return (
    <>
      <div className="bg-white border-b border-gray-200">
        <Container>
          <div className="py-3 flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <Link href="/#catalogo" scroll={false} className="text-gray-500 hover:text-gray-900 transition-colors">
              Catálogo
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </div>
        </Container>
      </div>

      <section className="py-8 md:py-12 bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <ProductGallery
                images={(() => {
                  const allImages = product.images && product.images.length > 0
                    ? product.images
                    : [product.image_url || '/placeholder.png']
                  return allImages.filter(Boolean)
                })()}
                productName={product.name}
              />
              {isOutOfStock && (
                <div className="mt-4 bg-gray-100 rounded-lg p-3 text-center">
                  <span className="text-gray-500 font-semibold text-sm uppercase tracking-wider">
                    Agotado
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-5">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                {product.categories?.name || 'Sin categoría'}
              </span>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              {product.brand && (
                <p className="text-sm text-gray-500">
                  Marca: <span className="font-semibold text-gray-700">{product.brand}</span>
                </p>
              )}

              <div className="flex items-baseline gap-3">
                {hasDiscount(product) ? (
                  <>
                    <span className="text-3xl font-black text-gray-900">
                      Bs {getPriceWithDiscount(product).toFixed(2)}
                    </span>
                    <span className="text-lg text-gray-400 line-through ml-0">
                      Bs {product.price.toFixed(2)}
                    </span>
                    <span className="bg-discount text-white text-xs font-semibold px-2 py-0.5 rounded-md">
                      -{discount}%
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-black text-gray-900">
                    Bs {product.price.toFixed(2)}
                  </span>
                )}
              </div>

              {stock === 0 && (
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Sin stock actualmente
                  </span>
                </div>
              )}

              {product.description && (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.description}
                </p>
              )}

              <hr className="border-gray-200" />

              {(needsSize || shouldShowSizeGuide) && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                      Talla
                    </label>
                    {shouldShowSizeGuide && (
                      <button
                        onClick={() => setIsSizeGuideOpen(true)}
                        className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 underline underline-offset-2 transition-colors"
                      >
                        <Ruler className="w-3.5 h-3.5" />
                        Guía de tallas
                      </button>
                    )}
                  </div>

                  {needsSize ? (
                    <div className="flex flex-wrap gap-2">
                      {validSizes.map((size: string) => {
                        const sizeStock = stockBySize[size] ?? 0
                        const sizeAgotada = sizeStock === 0
                        const isSelected = selectedSize === size
                        return (
                          <button
                            key={size}
                            onClick={() => {
                              if (!sizeAgotada) {
                                setSelectedSize(size)
                                setQuantity(1)
                              }
                            }}
                            disabled={sizeAgotada}
                            className={`min-w-[48px] h-12 px-4 text-sm font-semibold border transition-all ${sizeAgotada
                              ? 'opacity-30 cursor-not-allowed line-through border-gray-200 text-gray-400 bg-gray-50'
                              : isSelected
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900'
                              }`}
                          >
                            {size}
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="h-12 flex items-center px-4 bg-gray-50 rounded-lg border border-gray-200 w-fit">
                      <span className="text-sm font-medium text-gray-600">
                        {normalizedCategory.includes('gorra') || normalizedCategory.includes('sombrero')
                          ? 'Talla Única / Ajustable'
                          : 'Talla Única'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                    Color: <span className="text-gray-500 font-normal capitalize">{selectedColor || 'Seleccionar'}</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => {
                      const hex = getHexForColor(color)
                      return (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-10 h-10 rounded-full border-2 transition-all shadow-sm ${selectedColor === color
                            ? 'border-gray-900 scale-110 ring-2 ring-lukess-gold ring-offset-2'
                            : 'border-gray-200 hover:scale-105'
                            }`}
                          style={{ backgroundColor: hex }}
                          aria-label={`Seleccionar color ${color}`}
                          title={color}
                        />
                      )
                    })}
                  </div>
                </div>
              )}

              {!isOutOfStock && !selectedSizeAgotada && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                    Cantidad
                  </label>
                  <div className="inline-flex items-center border border-gray-300">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={needsSize && !selectedSize}
                      className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 h-12 flex items-center justify-center text-sm font-semibold border-x border-gray-300">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(selectedSizeStock, quantity + 1))}
                      disabled={needsSize && !selectedSize}
                      className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 pt-2">
                <Button
                  onClick={handleAddToCart}
                  disabled={addToCartDisabled}
                  variant="primary"
                  fullWidth
                  className="py-4"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {addToCartLabel}
                </Button>
                <Button
                  onClick={handleWhatsApp}
                  variant="whatsapp"
                  fullWidth
                  className="py-4"
                >
                  <MessageCircle className="w-5 h-5" />
                  Consultar por WhatsApp
                </Button>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-base text-gray-400">Envío Gratis en Santa Cruz (compras &gt; Bs {FREE_SHIPPING_THRESHOLD})</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-base text-gray-400">Pick-up Gratuito en Tienda (Mutualista)</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="text-base mt-0.5 text-gray-400">Los pedidos con &ldquo;Retiro en Tienda&rdquo; se reservan por un máximo de <strong>48 horas</strong>.</span>
                </div>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Productos Relacionados
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedProducts.map((p) => {
                  const relatedStock = getTotalStock(p)
                  return (
                    <Link
                      key={p.id}
                      href={`/producto/${p.id}`}
                      className="group"
                    >
                      <div className="relative aspect-[3/4] bg-white overflow-hidden mb-3">
                        <Image
                          src={p.thumbnail_url || p.image_url || '/placeholder.png'}
                          alt={p.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-contain object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        {relatedStock === 0 && (
                          <div className="absolute top-2 left-2 bg-gray-900 text-white px-2 py-0.5 text-xs font-semibold rounded-md">
                            AGOTADO
                          </div>
                        )}
                        {hasDiscount(p) && relatedStock > 0 && (
                          <div className="absolute top-2 right-2 bg-discount text-white px-2 py-0.5 text-xs font-semibold rounded-md">
                            -{getDiscount(p)}%
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                          {p.categories?.name}
                        </p>
                        <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                          {p.name}
                        </h3>
                        <div className="flex items-baseline gap-2">
                          {hasDiscount(p) ? (
                            <>
                              <span className="text-sm font-bold text-gray-900">
                                Bs {getPriceWithDiscount(p).toFixed(2)}
                              </span>
                              <span className="text-xs text-gray-400 line-through">
                                Bs {p.price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-bold text-gray-900">
                              Bs {p.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          <div className="mt-24 pt-16 border-t border-gray-100"></div>

          {/* Reviews Section */}
          <div id="reviews" className="max-w-3xl mx-auto px-4">
            <div className="flex flex-col gap-12">
              {/* Reviews Header & Summary Combined */}
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    Reseñas de clientes
                    {totalReviews > 0 && (
                      <span className="text-sm font-normal text-gray-400">({totalReviews})</span>
                    )}
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gray-50/50 rounded-3xl p-8 border border-gray-100/50">
                  <div className="text-center md:text-left md:border-r border-gray-200 md:pr-8">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                      <div className="text-6xl font-black text-gray-900 tracking-tighter">
                        {averageRating > 0 ? averageRating.toFixed(1) : '0'}
                      </div>
                      <div className="flex flex-col items-start">
                        <div className="flex gap-0.5 mb-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-4 h-4 ${s <= Math.round(averageRating) ? 'fill-lukess-gold text-lukess-gold' : 'text-gray-200'}`}
                            />
                          ))}
                        </div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Calificación promedio</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 max-w-xs mx-auto md:mx-0 w-full">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = reviews.filter(r => r.rating === stars).length
                      const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                      return (
                        <div key={stars} className="flex items-center gap-3 text-[11px]">
                          <span className="w-3 text-gray-600 font-bold">{stars}</span>
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-lukess-gold rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="w-8 text-right text-gray-400 font-medium">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Reviews List & Form Container */}
              <div className="space-y-12">
                {/* Review Form */}
                {!hasReviewed && (
                  <div className="bg-white border-2 border-dashed border-gray-100 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Escribe una reseña</h3>
                    {isLoggedIn ? (
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-700">Tu calificación:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setReviewRating(s)}
                                className="transition-transform hover:scale-110 active:scale-95"
                              >
                                <Star
                                  className={`w-7 h-7 ${s <= reviewRating ? 'fill-lukess-gold text-lukess-gold' : 'text-gray-300'}`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="relative">
                          <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value.slice(0, 500))}
                            placeholder="Cuéntanos tu experiencia con el producto..."
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-lukess-gold focus:bg-white transition-all min-h-[120px] resize-none"
                          />
                          <span className="absolute bottom-3 right-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white/80 px-1.5 py-0.5 rounded-md">
                            {reviewComment.length}/500
                          </span>
                        </div>
                        <Button
                          type="submit"
                          disabled={isSubmittingReview || reviewRating === 0}
                          className="w-full py-4 text-xs font-bold tracking-widest uppercase"
                        >
                          {isSubmittingReview ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Publicar Reseña'
                          )}
                        </Button>
                      </form>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500 text-sm mb-4">Para dejar una reseña, primero debes iniciar sesión.</p>
                        <Link 
                          href="/auth" 
                          className="inline-flex items-center gap-2 text-lukess-gold font-bold text-sm hover:underline underline-offset-4"
                        >
                          Ir a Iniciar Sesión <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-6">
                  {isLoadingReviews ? (
                    <div className="grid grid-cols-1 gap-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse flex flex-col gap-3 pb-6 border-b border-gray-50">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <div className="h-4 w-32 bg-gray-100 rounded" />
                              <div className="h-3 w-20 bg-gray-100 rounded" />
                            </div>
                            <div className="h-3 w-16 bg-gray-100 rounded" />
                          </div>
                          <div className="h-12 w-full bg-gray-50 rounded" />
                        </div>
                      ))}
                    </div>
                  ) : reviews.length > 0 ? (
                    <>
                      {reviews.slice(0, 5).map((review) => (
                        <div key={review.id} className="border-b border-gray-50 pb-6 last:border-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm">{review.reviewer_name}</h4>
                              <div className="flex gap-0.5 mb-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-3 h-3 ${s <= review.rating ? 'fill-lukess-gold text-lukess-gold' : 'text-gray-200'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                              {new Date(review.created_at).toLocaleDateString('es-BO', { month: 'long', year: 'numeric' })}
                            </span>
                          </div>
                          {review.comment && (
                            <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                          )}
                          {review.verified_purchase && (
                            <div className="mt-2 flex items-center gap-1.5 text-[9px] font-bold text-green-600 uppercase tracking-widest">
                              <div className="w-3.5 h-3.5 bg-green-100 rounded-full flex items-center justify-center">
                                <Star className="w-2 h-2 fill-green-600" />
                              </div>
                              Compra Verificada
                            </div>
                          )}
                        </div>
                      ))}
                      {reviews.length > 5 && (
                        <button className="w-full py-3 border border-gray-100 rounded-xl text-xs font-bold text-gray-500 uppercase tracking-widest hover:bg-gray-50 transition-colors">
                          Ver todas las reseñas ({reviews.length})
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                        <StarOff className="w-6 h-6 text-gray-300" />
                      </div>
                      <p className="text-gray-900 font-bold text-sm mb-1">Aún no hay reseñas</p>
                      <p className="text-gray-500 text-xs">Sé el primero en calificar este producto</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={(() => {
          const cat = normalizeText(product.categories?.name || '')
          if (cat.includes('pantalon') || cat.includes('jeans')) return 'inferior'
          if (cat.includes('short')) return 'shorts'
          if (cat.includes('cinturon') || cat.includes('belt')) return 'cinturones'
          if (cat.includes('gorra') || cat.includes('sombrero')) return 'gorras'
          return 'superior'
        })()}
      />

      {/* Sticky Mobile Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] md:hidden pointer-events-none">
        <div className="flex items-center justify-between p-4 gap-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pointer-events-auto">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5 truncate">{product.brand}</p>
            <h3 className="text-sm font-semibold text-gray-900 truncate">{product.name}</h3>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={addToCartDisabled}
            variant="primary"
            size="sm"
            className="h-11 px-6 text-[10px] whitespace-nowrap min-w-[140px]"
          >
            {addToCartLabel === 'AGREGAR AL CARRITO' ? 'COMPRAR' : addToCartLabel}
          </Button>
        </div>
      </div>
    </>
  )
}
