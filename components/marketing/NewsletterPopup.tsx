'use client'
import { useState, useEffect } from 'react'
import { X, Mail, Gift, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

import { useAuth } from '@/lib/context/AuthContext'

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isLoggedIn } = useAuth()

  useEffect(() => {
    setMounted(true)

    // 1. Si el usuario está logueado, NUNCA mostrar el popup
    if (isLoggedIn) return

    // 2. Revisar si ya descartó/completó el popup en los últimos 30 días
    const dismissedData = localStorage.getItem('lukess_newsletter_dismissed')
    if (dismissedData) {
      try {
        const { timestamp } = JSON.parse(dismissedData)
        const daysPassed = (Date.now() - timestamp) / (1000 * 60 * 60 * 24)
        if (daysPassed < 30) return // Ocultar si pasaron menos de 30 días
      } catch (e) {
        // Fallback por si la data está corrupta
        localStorage.removeItem('lukess_newsletter_dismissed')
      }
    }

    // 3. Temporizador (12 segundos)
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 12000)

    // 4. Exit Intent (Mouseleave superior)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 10) {
        setIsOpen(true)
        // Ya no necesitamos escuchar más
        document.removeEventListener('mouseleave', handleMouseLeave)
      }
    }

    // Solo agregar el listener si no está abierto aún
    if (!isOpen) {
      document.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isLoggedIn, isOpen])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('lukess_newsletter_dismissed', JSON.stringify({
      timestamp: Date.now()
    }))
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!email || isSubmitting) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), source: 'popup' })
      })

      const data = await res.json()

      if (res.status === 409) {
        toast('Ya estás suscrito 😊')
        handleClose()
        return
      }

      if (!res.ok) throw new Error(data.error || 'Error al suscribir')

      toast.success('¡Suscripción exitosa! Revisa tu email.')
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative pointer-events-auto">
              {/* Botón cerrar */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Contenido */}
              <div className="text-center space-y-6">
                <div className="inline-flex p-4 bg-accent-500/20 rounded-full">
                  <Gift className="w-12 h-12 text-accent-500" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    10% OFF en tu primera compra
                  </h3>
                  <p className="text-gray-600">
                    Suscríbete a nuestro newsletter y recibe ofertas exclusivas
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tucorreo@ejemplo.com"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-600 focus:outline-none"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gray-800 text-white py-3 rounded-lg font-bold hover:bg-gray-900 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : null}
                    {isSubmitting ? 'Suscribiendo...' : 'Obtener mi descuento'}
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    No gracias, prefiero pagar precio completo
                  </button>
                </form>

                <p className="text-xs text-gray-500">
                  Podrás desuscribirte en cualquier momento
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
