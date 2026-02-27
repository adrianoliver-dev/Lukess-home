import Image from 'next/image'
import Link from 'next/link'
import QuickLinksRow from './QuickLinksRow'
import { createClient } from '@/lib/supabase/server'
import { MessageCircle } from 'lucide-react'

/* ───────── Content ───────── */

const WHATSAPP_URL =
    'https://wa.me/59172643753?text=Hola%2C%20vi%20Lukess%20Home%20y%20quiero%20consultar%20sobre%20sus%20productos'

/* ───────── Component ───────── */

export default async function HeroSection(): Promise<React.JSX.Element> {
    let heroImageUrl = '/products/polo-azul-texturizado.png'

    try {
        const supabase = await createClient()
        const { data } = await supabase
            .from('products')
            .select('images')
            .eq('is_active', true)
            .eq('is_featured', true)
            .limit(1)
            .single()

        if (data?.images && data.images.length > 0) {
            heroImageUrl = data.images[0]
        }
    } catch {
        // Fallback silently to local image
    }

    return (
        <section
            id="inicio"
            aria-label="Bienvenida a Lukess Home"
            className="relative w-full bg-neutral-950 overflow-hidden h-[75vh] min-h-[520px] md:h-[88vh]"
        >
            {/* ── Background image ── */}
            <div className="absolute inset-0 z-0 flex md:grid md:grid-cols-2 w-full h-full">
                <div className="hidden md:block bg-neutral-950 h-full w-full" />
                <div className="w-full h-full relative">
                    <Image
                        src={heroImageUrl}
                        alt="Lukess Home — Ropa masculina de marca"
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover z-0"
                    />
                    {/* Dark overlays for maximum text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 z-10" />
                    <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent z-10" />
                </div>
            </div>

            {/* ── Content ── */}
            <div className="relative z-20 w-full px-5 max-w-7xl mx-auto min-h-[75vh] md:min-h-[88vh] flex flex-col justify-end pb-36 md:pb-48 pt-16 md:pt-24">
                <div className="w-full md:w-[55%] lg:w-[50%] md:pr-8 z-20">
                    {/* Promo badge */}
                    <div className="mb-5 md:mb-6 hero-promo-enter">
                        <span className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg shadow-red-600/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            Hasta 50% OFF — Nueva Colección
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight drop-shadow-md">
                        Ropa Masculina{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-300">
                            de Marca
                        </span>
                        <br className="hidden sm:block" />
                        <span className="block mt-1 text-2xl sm:text-3xl lg:text-4xl font-semibold text-neutral-300">
                            al Mejor Precio de Santa Cruz
                        </span>
                    </h1>

                    {/* Brand strip */}
                    <p className="text-sm sm:text-base text-neutral-400 mt-4 font-medium tracking-wide">
                        Columbia · Fossil · Tommy · Lee · Wrangler
                    </p>

                    {/* CTAs */}
                    <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
                        {/* Primary CTA — COMPRAR AHORA */}
                        <Link
                            href="#catalogo"
                            className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold text-base sm:text-lg uppercase tracking-wider py-4 px-10 rounded-xl shadow-xl shadow-red-600/25 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] w-full sm:w-auto text-center"
                            aria-label="Ver catálogo de productos"
                        >
                            Comprar Ahora
                        </Link>

                        {/* Secondary CTA — WhatsApp */}
                        <a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold text-sm sm:text-base py-3.5 px-6 rounded-xl transition-all duration-200 w-full sm:w-auto"
                            aria-label="Consultar por WhatsApp"
                        >
                            <MessageCircle className="w-5 h-5 text-green-400" />
                            WhatsApp
                        </a>
                    </div>
                </div>
            </div>

            {/* Quick Links Row at bottom */}
            <QuickLinksRow />
        </section>
    )
}
