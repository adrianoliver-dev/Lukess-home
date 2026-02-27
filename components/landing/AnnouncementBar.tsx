'use client'
import { useState, useEffect } from 'react'
import { X, MessageCircle, ArrowRight } from 'lucide-react'
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp'

interface AnnouncementMessage {
    id: string
    text: string
    highlight?: string
    cta: string
    ctaHref: string
    ctaIcon?: 'whatsapp' | 'arrow'
}

const messages: AnnouncementMessage[] = [
    {
        id: 'trust-1',
        text: '🏬 3 locales en Mercado Mutualista — Pasillos 2, 3 y 5',
        cta: 'Contactar',
        ctaHref: buildWhatsAppUrl('Hola! Quiero visitar sus locales'),
        ctaIcon: 'whatsapp',
    },
    {
        id: 'delivery',
        text: '📦 Entrega gratis zona norte SCZ — pedidos +200 Bs',
        cta: 'Pedir',
        ctaHref: buildWhatsAppUrl('Hola! Quiero pedir con entrega'),
        ctaIcon: 'whatsapp',
    },
    {
        id: 'original',
        text: '💯 Ropa 100% original — marcas importadas con factura',
        cta: 'Ver productos',
        ctaHref: '#productos',
        ctaIcon: 'arrow',
    },
]

export default function AnnouncementBar() {
    const [isVisible, setIsVisible] = useState(false)
    const [currentMsgIdx, setCurrentMsgIdx] = useState(0)

    useEffect(() => {
        // Check localStorage on mount
        const isDismissed = localStorage.getItem('lukess_announcement_bar_dismissed')
        if (!isDismissed) {
            setIsVisible(true)
        }
    }, [])

    useEffect(() => {
        if (!isVisible) return

        // Allow rotation if user doesn't prefer reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (prefersReducedMotion) return

        const timer = setInterval(() => {
            setCurrentMsgIdx((prev) => (prev + 1) % messages.length)
        }, 8000) // Rotate every 8s

        return () => clearInterval(timer)
    }, [isVisible])

    const handleClose = () => {
        setIsVisible(false)
        localStorage.setItem('lukess_announcement_bar_dismissed', 'true')
    }

    if (!isVisible) return null

    const currentMsg = messages[currentMsgIdx]

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                :root {
                    --announcement-height: 48px;
                }
                @media (max-width: 767px) {
                    :root {
                        --announcement-height: 44px;
                    }
                }
            `}} />
            <div
                role="banner"
                aria-label="Promotional announcement"
                className="fixed top-0 left-0 right-0 z-[60] w-full bg-[#0A0A0A] text-white flex items-center justify-center
                     h-[44px] md:h-[48px] px-4 md:px-8 border-b border-white/5 transition-all duration-300"
            >
                <div
                    aria-live="polite"
                    className="flex items-center justify-center gap-2 md:gap-4 max-w-7xl mx-auto w-full pr-8 text-xs md:text-sm font-semibold animate-in fade-in duration-300 relative"
                >
                    <div className="flex items-center flex-wrap justify-center gap-x-2 gap-y-1 text-center">
                        <span>
                            {currentMsg.id === 'promo' ? (
                                <>
                                    {currentMsg.text}
                                    <span className="text-red-400">{currentMsg.highlight}</span>
                                </>
                            ) : (
                                currentMsg.text
                            )}
                        </span>

                        <a
                            href={currentMsg.ctaHref}
                            className="inline-flex items-center gap-1.5 bg-white text-black hover:bg-gray-100 rounded-md px-3 md:px-4 py-1.5 transition-colors whitespace-nowrap"
                        >
                            {currentMsg.ctaIcon === 'whatsapp' && <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />}
                            {currentMsg.cta}
                            {currentMsg.ctaIcon === 'arrow' && <ArrowRight className="w-3.5 h-3.5" />}
                        </a>
                    </div>
                </div>

                <button
                    onClick={handleClose}
                    aria-label="Close announcement"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white 
                   h-[44px] w-[44px] flex items-center justify-center transition-colors"
                >
                    <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>
            </div>
        </>
    )
}
