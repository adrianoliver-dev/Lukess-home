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
        <section className="bg-zinc-950 border-t border-zinc-800 py-16 px-4">
            <div className="max-w-5xl mx-auto">
                {isSubscribed ? (
                    /* ── Subscribed State ── */
                    <div className="flex flex-col items-center text-center gap-4">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-green-500/10 rounded-full border border-green-500/30">
                            <CheckCircle className="w-7 h-7 text-green-400" />
                        </div>
                        <div>
                            <p className="text-white text-xl font-bold tracking-tight">
                                Ya eres parte del club.
                            </p>
                            <p className="text-zinc-400 text-sm mt-1.5">
                                Te enviamos promociones exclusivas a{' '}
                                <span className="text-white font-semibold">{userEmail}</span>
                            </p>
                        </div>
                    </div>
                ) : (
                    /* ── Default / CTA State ── */
                    <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                        {/* Left: copy */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 bg-accent-500/15 border border-accent-500/30 text-accent-400 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                                <Sparkles className="w-3.5 h-3.5" />
                                Oferta exclusiva
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                                Desbloquea{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-emerald-400">
                                    10% OFF
                                </span>
                                <br />
                                en tu primera compra.
                            </h2>
                            <p className="text-zinc-400 mt-3 text-base max-w-sm">
                                Únete a miles de clientes que reciben las mejores ofertas antes que nadie.
                                Sin spam. Cancela cuando quieras.
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
                                        placeholder="tucorreo@gmail.com"
                                        required
                                        disabled={isSubmitting}
                                        className="flex-1 bg-zinc-800 border-2 border-zinc-700 hover:border-zinc-600 focus:border-accent-500 text-white placeholder-zinc-500 rounded-xl px-4 py-3.5 text-sm focus:outline-none transition-colors disabled:opacity-60"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-white hover:bg-zinc-100 text-zinc-900 font-bold px-5 py-3.5 rounded-xl text-sm transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <ArrowRight className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-zinc-600 text-center md:text-left">
                                    Recibirás tu código de descuento por email. Sin compromiso.
                                </p>
                            </form>

                            <div className="flex items-center gap-6 mt-5 justify-center md:justify-start">
                                {[
                                    { value: '10%', label: 'Descuento inmediato' },
                                    { value: '+500', label: 'Suscriptores' },
                                    { value: '0', label: 'Spam' },
                                ].map(({ value, label }) => (
                                    <div key={label} className="text-center">
                                        <p className="text-white font-black text-lg leading-none">{value}</p>
                                        <p className="text-zinc-500 text-xs mt-1">{label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
