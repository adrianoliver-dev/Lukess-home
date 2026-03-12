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
import toast from 'react-hot-toast'
import { ProductGallery } from './ProductGallery'
import { SizeGuideModal } from './SizeGuideModal'
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp'
import { hasActiveDiscount as hasDiscount, getDiscount, getPriceWithDiscount } from '@/lib/utils/price'

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

  useEffect(() => {
    trackViewItem({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.categories?.name,
      brand: product.brand ?? undefined,
    })
  }, [product.id]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const categoryName = product.categories?.name || ''
  const normalizeText = (text: string) =>
    text.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()

  const normalizedCategory = normalizeText(categoryName)
  const SIZE_GUIDE_CATEGORIES = ['camisa', 'polo', 'pantalon', 'jeans', 'short', 'cinturon', 'sombrero', 'gorra', 'belt']
  const shouldShowSizeGuide = SIZE_GUIDE_CATEGORIES.some(cat => normalizedCategory.includes(cat))

  const stock = getTotalStock(product)
  const stockBySize = getStockBySize(product)
  const isOutOfStock = stock === 0
  const discount = getDiscount(product)

  const INTERNAL_SIZES = ['Unitalla', 'Única', 'Unico']
  const validSizes = (product.sizes ?? []).filter(
    (s: string) => s && s.trim() !== '' && !INTERNAL_SIZES.includes(s)
  )
  const needsSize = validSizes.length > 0
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
    toast.success(`${quantity}x Bs {product.name} agregado al carrito`)
  }

  const handleWhatsApp = () => {
    let message: string
    if (stock === 0) {
      message =
        'Hola! Me interesa este producto 👇\n' +
        `*Bs {product.name}*\n` +
        `💰 Precio: $Bs {product.price.toFixed(2)}\n` +
        '¿Cuándo habrá stock disponible? 🙏'
    } else {
      message =
        'Hola! Me interesa este producto 👇\n' +
        `*Bs {product.name}*\n` +
        `💰 Precio: $Bs {product.price.toFixed(2)}\n` +
        (selectedSize ? `📏 Talla: ${selectedSize}\n` : '') +
        '¿Me pueden dar más información? 🙏'
    }
    window.open(buildWhatsAppUrl(message), '_blank')
  }

  return (
    <>
      {/* Breadcrumbs */}
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

      {/* Product Detail */}
      <section className="py-8 md:py-12 bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery */}
            <div>
              <ProductGallery
                images={(() => {
                  // images array already contains hero as first item
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

            {/* Info */}
            <div className="space-y-5">
              {/* Category */}
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                {product.categories?.name || 'Sin categoría'}
              </span>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Brand */}
              {product.brand && (
                <p className="text-sm text-gray-500">
                  Marca: <span className="font-semibold text-gray-700">{product.brand}</span>
                </p>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3">
                {hasDiscount(product) ? (
                  <>
                    <span className="text-3xl font-black text-gray-900">
                      Bs {getPriceWithDiscount(product).toFixed(2)}
                    </span>
                    <span className="text-lg text-gray-400 line-through ml-0">
                      Bs {product.price.toFixed(2)}
                    </span>
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{discount}%
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-black text-gray-900">
                    Bs {product.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock */}
              {stock === 0 && (
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Sin stock actualmente
                  </span>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Divider */}
              <hr className="border-gray-200" />

              {/* Sizes */}
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

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`min-w-[48px] h-12 px-4 text-sm font-semibold border transition-all ${selectedColor === color
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900'
                          }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
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

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={addToCartDisabled}
                  className={`w-full py-4 font-bold text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${addToCartDisabled
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-900 hover:bg-black text-white'
                    }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {addToCartLabel}
                </button>
                <button
                  onClick={handleWhatsApp}
                  className="w-full py-4 border border-whatsapp text-whatsapp hover:bg-whatsapp/5 font-bold text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Consultar por WhatsApp
                </button>
              </div>

              {/* Trust Badges */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-base">🚚</span>
                  <span>Envío Gratis en Santa Cruz (compras &gt; Bs {FREE_SHIPPING_THRESHOLD})</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-base">🏬</span>
                  <span>Pick-up Gratuito en Tienda (Mutualista)</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="text-base mt-0.5">⏱️</span>
                  <span>Los pedidos con &ldquo;Retiro en Tienda&rdquo; se reservan por un máximo de <strong>48 horas</strong>.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
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
                          className="object-contain object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        {relatedStock === 0 && (
                          <div className="absolute top-2 left-2 bg-gray-900 text-white px-2 py-1 text-xs font-semibold">
                            AGOTADO
                          </div>
                        )}
                        {hasDiscount(p) && relatedStock > 0 && (
                          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs font-bold">
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
                                ${p.price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-bold text-gray-900">
                              ${p.price.toFixed(2)}
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
        </Container>
      </section>

      {/* Size Guide Modal */}
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
    </>
  )
}
