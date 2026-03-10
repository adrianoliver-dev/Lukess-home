'use client'

import { useState } from 'react'
import { Loader2, ArrowRight, CheckCircle, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNewsletter } from '@/hooks/useNewsletter'

export function FooterNewsletter() {
    const { isSubscribed, userEmail, markAsSubscribed } = useNewsletter()
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault()
        const trimmed = email.trim().toLowerCase()
        if (!trimmed || isSubmitting) return

        setIsSubmitting(true)
        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: trimmed, source: 'footer' }),
            })

            const data = await res.json()

            if (res.status === 409) {
                // Already subscribed — still mark locally
                markAsSubscribed(trimmed)
                toast('¡Ya estás suscrito! 😊')
                return
            }

            if (!res.ok) throw new Error(data.error || 'Error al suscribir')

            markAsSubscribed(trimmed)
            toast.success('¡Bienvenido! Revisá tu email para tu código de descuento.')
        } catch {
            toast.error('Error al suscribir. Intenta de nuevo.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className="bg-gray-50 border-t border-gray-200 py-16 px-4">
            <div className="max-w-5xl mx-auto">
                {isSubscribed ? (
                    /* ── Subscribed State ── */
                    <div className="flex flex-col items-center text-center gap-4">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full border border-green-200">
                            <CheckCircle className="w-7 h-7 text-green-600" />
                        </div>
                        <div>
                            <p className="text-gray-900 text-xl font-bold tracking-tight">
                                Ya eres parte del club.
                            </p>
                            <p className="text-gray-600 text-sm mt-1.5">
                                Te enviamos promociones exclusivas a{' '}
                                <span className="text-gray-900 font-semibold">{userEmail}</span>
                            </p>
                        </div>
                    </div>
                ) : (
                    /* ── Default / CTA State ── */
                    <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                        {/* Left: copy */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 bg-accent-100 border border-accent-200 text-accent-700 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                                <Sparkles className="w-3.5 h-3.5" />
                                Oferta exclusiva
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight tracking-tight">
                                Desbloquea{' '}
                                <span className="text-lukess-gold font-black">
                                    10% OFF
                                </span>
                                <br />
                                en tu primera compra.
                            </h2>
                            <p className="text-gray-600 mt-3 text-base max-w-sm">
                                Sé el primero en enterarte de nuevas colecciones y ofertas especiales. Sin spam, cancela cuando quieras.
                            </p>
                        </div>

                        {/* Right: form */}
                        <div className="w-full md:w-auto md:min-w-[360px]">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="demo@lukesshome.com"
                                        required
                                        disabled={isSubmitting}
                                        className="flex-1 bg-white border border-gray-300 hover:border-gray-400 focus:border-lukess-gold text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3.5 text-sm focus:outline-none transition-colors disabled:opacity-60 shadow-sm"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-gray-900 hover:bg-black text-white font-bold px-5 py-3.5 rounded-xl text-sm transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:border border-gray-200 shadow-sm"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <ArrowRight className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 text-center md:text-left">
                                    Recibirás tu código de descuento por email. Sin compromiso.
                                </p>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
