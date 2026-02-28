import { createClient } from '@/lib/supabase/server'
import BannerCarousel from './BannerCarousel'
import Link from 'next/link'

/* ─── Types ─── */
interface Banner {
    id: string
    image_url: string
    title: string | null
    link: string | null
    is_active: boolean
    display_order: number
    created_at: string
}

/* ─── Fallback static hero shown when no banners exist ─── */
function FallbackHero(): React.JSX.Element {
    return (
        <section
            aria-label="Lukess Home — Bienvenida"
            className="w-full h-[400px] md:h-[600px] bg-zinc-900 flex flex-col items-center justify-center text-center px-6"
        >
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                Lukess <span className="text-amber-400">Home</span>
            </h2>
            <p className="text-zinc-400 text-base md:text-lg max-w-md mb-8">
                Ropa masculina de marca al mejor precio de Santa Cruz
            </p>
            <Link
                href="#catalogo"
                className="inline-flex items-center justify-center bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold text-sm uppercase tracking-widest py-3 px-8 rounded-full transition-colors duration-200"
            >
                Ver Catálogo
            </Link>
        </section>
    )
}

/* ─── Server Component ─── */
export default async function HeroBanner(): Promise<React.JSX.Element> {
    let banners: Banner[] = []

    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('banners')
            .select('id, image_url, title, link, is_active, display_order, created_at')
            .eq('is_active', true)
            .order('display_order', { ascending: true })

        if (!error && data) {
            banners = data
        }
    } catch {
        // Silently fall back to static hero
    }

    if (banners.length === 0) {
        return <FallbackHero />
    }

    return <BannerCarousel banners={banners} />
}
