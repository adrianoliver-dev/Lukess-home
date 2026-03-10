'use client'

import { useState, useEffect } from 'react'
import { X, Gift, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import toast from 'react-hot-toast'

import { useAuth } from '@/lib/context/AuthContext'
import { useNewsletter } from '@/hooks/useNewsletter'

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isLoggedIn } = useAuth()
  const { isSubscribed, markAsSubscribed } = useNewsletter()

  useEffect(() => {
    setMounted(true)

    // 1. Si el usuario está logueado, NUNCA mostrar el popup
    if (isLoggedIn) return

    // 2. Si ya está suscrito globalmente, nunca mostrar
    if (isSubscribed) return

    // 3. Revisar si ya descartó el popup en los últimos 30 días
    const dismissedData = localStorage.getItem('lukess_newsletter_dismissed')
    if (dismissedData) {
      try {
        const { timestamp } = JSON.parse(dismissedData)
        const daysPassed = (Date.now() - timestamp) / (1000 * 60 * 60 * 24)
        if (daysPassed < 30) return
      } catch {
        localStorage.removeItem('lukess_newsletter_dismissed')
      }
    }

    // 4. Temporizador (12 segundos)
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 12000)

    // 5. Exit Intent (Mouseleave superior)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 10) {
        setIsOpen(true)
        document.removeEventListener('mouseleave', handleMouseLeave)
      }
    }

    if (!isOpen) {
      document.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isLoggedIn, isSubscribed, isOpen])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('lukess_newsletter_dismissed', JSON.stringify({
      timestamp: Date.now()
    }))
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    const trimmed = email.trim().toLowerCase()
    if (!trimmed || isSubmitting) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, source: 'popup' })
      })

      const data = await res.json()

      if (res.status === 409) {
        markAsSubscribed(trimmed)
        toast('Ya estás suscrito 😊')
        handleClose()
        return
      }

      if (!res.ok) throw new Error(data.error || 'Error al suscribir')

      markAsSubscribed(trimmed)
      toast.success('¡Suscripción exitosa! Revisá tu email para tu código.')
      handleClose()
    } catch {
      toast.error('Error al suscribir, intenta de nuevo')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl border border-gray-200 shadow-sm max-w-md w-full p-8 relative pointer-events-auto overflow-hidden">
              {/* Background glow */}
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-lukess-gold/20 rounded-full blur-3xl pointer-events-none" />

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 hover:bg-zinc-800 rounded-full transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>

              {/* Content */}
              <div className="space-y-6 relative">
                <div className="inline-flex p-4 bg-lukess-gold/15 border border-lukess-gold/30 rounded-2xl">
                  <Gift className="w-10 h-10 text-lukess-gold" />
                </div>

                <div>
                  <p className="text-xs font-bold text-lukess-gold uppercase tracking-widest mb-2">
                    Oferta para nuevos clientes
                  </p>
                  <h3 className="text-3xl font-black text-white leading-tight tracking-tight">
                    Desbloquea{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-lukess-gold to-emerald-400">
                      10% OFF
                    </span>
                    {' '}en tu primera compra.
                  </h3>
                  <p className="text-zinc-400 text-sm mt-2">
                    Únete. Recibe tu código al instante. Sin compromiso.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="demo@lukesshome.com"
                    className="w-full bg-zinc-800 border-2 border-zinc-700 focus:border-lukess-gold text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                    required
                    disabled={isSubmitting}
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-zinc-900 py-3.5 rounded-xl font-black text-sm hover:bg-zinc-100 transition-colors border border-gray-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isSubmitting ? 'Un momento...' : 'OBTENER MI 10% OFF →'}
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full text-xs text-zinc-600 hover:text-zinc-400 transition-colors py-1"
                  >
                    No gracias, prefiero pagar precio completo
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
