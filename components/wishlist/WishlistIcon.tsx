'use client'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import { useWishlist } from '@/lib/context/WishlistContext'
import { motion, AnimatePresence } from 'motion/react'

export function WishlistIcon() {
  const { wishlistCount } = useWishlist()

  return (
    <Link
      href="/wishlist"
      className="relative w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors"
      aria-label={`Lista de deseos (${wishlistCount} productos)`}
    >
      <Heart className="w-5 h-5 text-gray-900" />

      {/* Badge contador */}
      <AnimatePresence>
        {wishlistCount > 0 && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
          >
            {wishlistCount > 9 ? '9+' : wishlistCount}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  )
}
