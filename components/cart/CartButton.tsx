'use client'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/context/CartContext'

interface CartButtonProps {
  onClick: () => void
}

export function CartButton({ onClick }: CartButtonProps) {
  const { itemCount } = useCart()

  return (
    <button
      onClick={onClick}
      className="relative w-10 h-10 flex items-center justify-center text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
      aria-label="Carrito de compras"
    >
      <ShoppingCart className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </button>
  )
}
