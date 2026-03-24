'use client'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/context/CartContext'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/utils/shipping'

import { hasActiveDiscount, getPriceWithDiscount } from '@/lib/utils/price'
import { Product } from '@/lib/types'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  onCheckout: () => void
}

export function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, total, itemCount } = useCart()

  const getAvailableStock = (product: Product, size?: string): number => {
    if (!product.inventory || product.inventory.length === 0) return 0
    if (size) {
      return product.inventory
        .filter(inv => inv.size === size)
        .reduce((sum, inv) => sum + Math.max(0, inv.quantity - (inv.reserved_qty ?? 0)), 0)
    }
    return product.inventory
      .reduce((sum, inv) => sum + Math.max(0, inv.quantity - (inv.reserved_qty ?? 0)), 0)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-[var(--announcement-height,0px)] h-[calc(100vh-var(--announcement-height,0px))] w-full sm:w-96 bg-white border border-gray-200 shadow-sm z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-gray-900" />
                <h2 className="text-gray-900 font-bold uppercase tracking-widest text-sm">Mi Carrito</h2>
                <span className="bg-gray-100 text-gray-900 px-2 py-0.5 rounded-full text-xs font-semibold">
                  {itemCount}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg transition-colors text-gray-900 hover:text-black"
                aria-label="Cerrar carrito"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <ShoppingBag className="w-16 h-16 mb-4" />
                  <p className="text-lg font-semibold">Carrito vacío</p>
                  <p className="text-sm">Agrega productos para comenzar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => {
                    const availableStock = getAvailableStock(item.product, item.size)

                    return (
                      <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                        {/* Image */}
                        <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                          <Image
                            src={item.product.image_url || '/placeholder.png'}
                            alt={item.product.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-gray-900 truncate">
                            {item.product.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                            {item.size && <span className="bg-gray-200 px-2 py-0.5 rounded">Talla: {item.size}</span>}
                            {item.color && <span className="bg-gray-200 px-2 py-0.5 rounded">Color: {item.color}</span>}
                          </div>
                          {hasActiveDiscount(item.product) ? (
                            <div className="flex items-baseline gap-2 mt-1">
                              <p className="text-gray-900 font-bold">
                                Bs {getPriceWithDiscount(item.product).toFixed(2)}
                              </p>
                              <p className="text-gray-400 text-xs line-through">
                                Bs {item.product.price.toFixed(2)}
                              </p>
                            </div>
                          ) : (
                            <p className="text-gray-900 font-bold mt-1">
                              Bs {item.product.price.toFixed(2)}
                            </p>
                          )}

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-11 h-11 flex items-center justify-center bg-white border-2 border-gray-300 rounded-lg hover:border-gray-500 transition-colors"
                              aria-label="Disminuir cantidad"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= availableStock}
                              className="w-11 h-11 flex items-center justify-center bg-white border-2 border-gray-300 rounded-lg hover:border-gray-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="ml-auto p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              aria-label="Eliminar del carrito"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="bg-gray-50 border-t border-gray-200 p-4 space-y-3">
                {/* Shipping progress bar */}
                {total >= FREE_SHIPPING_THRESHOLD ? (
                  <p className="text-xs font-semibold text-green-600">🎉 ¡Envío gratis desbloqueado!</p>
                ) : (
                  <div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1.5">
                      <div
                        className="bg-gray-900 h-1.5 rounded-full transition-all"
                        style={{ width: `\${Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Te faltan Bs \${(FREE_SHIPPING_THRESHOLD - total).toFixed(2)} para envío gratis
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">Total:</span>
                  <span className="text-2xl font-black text-gray-900">
                    Bs {total.toFixed(2)}
                  </span>
                </div>
                <Button
                  onClick={() => { onCheckout(); onClose(); }}
                  variant="primary"
                  fullWidth
                  className="py-4"
                >
                  Proceder al Pago
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
