'use client'
import { useMemo, useState } from 'react'
import { useWishlist } from '@/lib/context/WishlistContext'
import { useAuth } from '@/lib/context/AuthContext'
import { Product } from '@/lib/types'
import Container from '@/components/ui/Container'
import { Heart, ShoppingCart, Trash2, ExternalLink, MessageCircle, Share2, Check, LogIn, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/context/CartContext'
import toast from 'react-hot-toast'
import { ProductBadges } from '@/components/catalogo/ProductBadges'
import { AuthModal } from '@/components/auth/AuthModal'
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp'
import { hasActiveDiscount as hasDiscount, getDiscount, getPriceWithDiscount } from '@/lib/utils/price'

interface WishlistClientProps {
  allProducts: Product[]
}

export function WishlistClient({ allProducts }: WishlistClientProps) {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist()
  const { isLoggedIn, customerName } = useAuth()
  const { addToCart } = useCart()
  const router = useRouter()
  const [authModalOpen, setAuthModalOpen] = useState(false)

  // Filtrar productos que están en la wishlist
  const wishlistProducts = useMemo(() => {
    return allProducts.filter(p => wishlist.includes(p.id))
  }, [allProducts, wishlist])

  const getTotalStock = (product: Product): number => {
    return product.inventory?.reduce((sum, inv) => sum + inv.quantity, 0) || 0
  }

  const handleAddToCart = (product: Product) => {
    const stock = getTotalStock(product)
    if (stock === 0) {
      toast.error('Producto sin stock', { position: 'bottom-center' })
      return
    }

    // Tallas válidas = excluir 'Unitalla'
    const validSizes = (product.sizes ?? []).filter(s => s !== 'Unitalla')

    if (validSizes.length > 1) {
      // Múltiples tallas → el cliente debe elegir desde la página de detalle
      toast('Selecciona una talla para este producto', {
        position: 'bottom-center',
        icon: '👕',
      })
      router.push(`/producto/${product.id}`)
      return
    }

    // 0 tallas válidas (accesorio/Unitalla) o exactamente 1 → añadir directo
    const sizeToAdd = validSizes.length === 1 ? validSizes[0] : undefined

    addToCart(product, 1, sizeToAdd)
    toast.custom((t) => (
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: t.visible ? 1 : 0, y: t.visible ? 0 : -20, scale: t.visible ? 1 : 0.9 }}
        className="flex items-center gap-3 bg-white border border-gray-200 border border-gray-200 shadow-sm rounded-xl px-4 py-3"
      >
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <Check className="w-5 h-5 text-gray-900" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">Agregado al carrito</p>
          <p className="text-xs text-gray-500 truncate max-w-[180px]">{product.name}</p>
        </div>
      </motion.div>
    ), { duration: 1500, position: 'bottom-center' })
  }

  const handleAddAllToCart = () => {
    let addedCount = 0
    let requiredSizeCount = 0

    wishlistProducts.forEach(product => {
      const stock = getTotalStock(product)
      if (stock > 0) {
        const validSizes = (product.sizes ?? []).filter(s => s !== 'Unitalla')
        if (validSizes.length > 1) {
          requiredSizeCount++
        } else {
          const sizeToAdd = validSizes.length === 1 ? validSizes[0] : undefined
          addToCart(product, 1, sizeToAdd)
          addedCount++
        }
      }
    })

    if (addedCount > 0) {
      toast.success(`${addedCount} productos agregados al carrito`, { position: 'bottom-center' })
    }
    if (requiredSizeCount > 0) {
      toast('Algunos productos requieren elegir talla', {
        position: 'bottom-center',
        icon: '👕',
      })
    }
  }

  const handleWhatsAppConsult = (product: Product) => {
    const message = `Hola! Estoy interesado en:\n\n` +
      `📦 ${product.name}\n` +
      `💰 Precio: Bs ${product.price.toFixed(2)}\n` +
      `${product.brand ? `🏷️ Marca: ${product.brand}\n` : ''}` +
      `\n¿Tienen disponible?`

    window.open(buildWhatsAppUrl(message), '_blank')
  }

  const handleClearWishlist = () => {
    if (window.confirm('¿Estás seguro de eliminar todos tus favoritos?')) {
      clearWishlist()
      toast.success('Lista de deseos limpiada', {
        position: 'bottom-center',
        icon: '🗑️',
      })
    }
  }

  const wishlistCount = wishlistProducts.length

  return (
    <>
      <section className="py-8 md:py-12 bg-white">
        <Container>
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900">Inicio</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 font-medium">Lista de Deseos</span>
          </div>

          {/* Title + Actions */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Lista de Deseos
              </h1>
              <p className="text-sm text-gray-500">
                {wishlistCount} {wishlistCount === 1 ? 'producto guardado' : 'productos guardados'}
              </p>
            </div>

            {wishlistCount > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddAllToCart}
                  className="hidden sm:flex px-4 py-2 bg-gray-900 text-white text-sm font-bold uppercase tracking-wider hover:bg-black transition-colors items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Agregar Todo al Carrito
                </button>
                <button
                  onClick={handleAddAllToCart}
                  className="sm:hidden px-3 py-2 bg-gray-900 text-white text-sm font-bold uppercase tracking-wider hover:bg-black transition-colors flex items-center gap-2"
                  title="Agregar Todo al Carrito"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClearWishlist}
                  className="px-3 py-2 border border-gray-300 text-gray-600 text-sm hover:border-red-600 hover:text-red-600 transition-colors"
                  title="Vaciar lista"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </Container>
      </section>

      <section className="pb-24 bg-white min-h-[50vh]">
        <Container>
          {/* Grid de productos o estado vacío */}
          {wishlistProducts.length === 0 ? (
            /* Estado vacío */
            <div className="py-20 text-center">
              <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Tu lista de deseos está vacía
              </h2>
              <p className="text-gray-500 mb-6">
                Guarda tus productos favoritos para comprarlos más tarde
              </p>
              <Link
                href="/#catalogo"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-bold text-sm uppercase tracking-wider hover:bg-black transition-colors"
              >
                Explorar Catálogo
              </Link>
            </div>
          ) : (
            /* Grid de productos */
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {wishlistProducts.map((product) => {
                const stock = getTotalStock(product)
                const isOutOfStock = stock === 0

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group bg-white border border-gray-200 hover:border-gray-900 transition-colors relative flex flex-col h-full"
                  >
                    {/* Botón eliminar */}
                    <button
                      onClick={() => {
                        removeFromWishlist(product.id)
                        toast.success('Eliminado de favoritos', {
                          position: 'bottom-center',
                          icon: '💔',
                        })
                      }}
                      className="absolute top-2 right-2 z-20 p-2 bg-white/90 backdrop-blur hover:bg-white text-gray-400 hover:text-red-500 rounded-full transition-colors"
                      title="Eliminar de la lista"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>

                    <Link href={`/producto/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-50">
                      {/* Imagen */}
                      <Image
                        src={product.image_url || '/placeholder.png'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Badges */}
                      <ProductBadges
                        isNew={product.is_new}
                        discount={getDiscount(product) || undefined}
                        lowStock={isOutOfStock ? 0 : stock}
                        isBestSeller={product.is_best_seller}
                        collection={product.collection}
                      />
                    </Link>

                    {/* Info */}
                    <div className="p-4 flex flex-col flex-grow">
                      {/* Categoría */}
                      <span className="text-xs uppercase tracking-widest text-gray-500 mb-1.5 line-clamp-1">
                        {product.categories?.name || 'Producto'}
                      </span>

                      {/* Nombre */}
                      <Link href={`/producto/${product.id}`} className="block flex-grow">
                        <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-2 line-clamp-2 hover:underline decoration-2 underline-offset-4">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Precio */}
                      <div className="flex items-center gap-2 mb-4">
                        {hasDiscount(product) ? (
                          <>
                            <span className="text-sm md:text-base font-bold text-gray-900">
                              Bs {getPriceWithDiscount(product).toFixed(2)}
                            </span>
                            <span className="text-xs md:text-sm text-gray-400 line-through">
                              Bs {product.price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm md:text-base font-bold text-gray-900">
                            Bs {product.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Botones de acción inferior */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={isOutOfStock}
                        className={`w-full py-2.5 text-xs md:text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${isOutOfStock
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-900 text-white hover:bg-black'
                          }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {isOutOfStock ? 'Sin Stock' : 'Agregar'}
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </Container>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          mode="login"
        />
      </section>
    </>
  )
}
