import Image from 'next/image'
import Link from 'next/link'
import QuickLinksRow from './QuickLinksRow'
import { createClient } from '@/lib/supabase/server'

const heroContent = {
    headline: "Ropa que aguanta el calor — marcas originales importadas",
    subheadline: "Columbia, camisas, pantalones y gorras. En nuestro local del Mercado Mutualista o te lo enviamos en Santa Cruz.",
    ctaPrimary: {
        text: "Consultar por WhatsApp",
        href: "https://wa.me/59172643753?text=Hola%2C%20vi%20Lukess%20Home%20y%20quiero%20consultar%20sobre%20sus%20productos"
    },
    ctaSecondary: {
        text: "Ver catálogo →",
        href: "#productos"
    }
}

const trustItems = [
    "✓ Marcas originales",
    "✓ 3 puestos en Mercado Mutualista",
    "✓ Entrega en Santa Cruz",
    "✓ +3 años en el mercado"
]

export default async function HeroSection() {
    let heroImageUrl = "/products/polo-azul-texturizado.png"; // Fallback image as per PR 9d-B FIX

    try {
        const supabase = await createClient();
        const { data } = await supabase
            .from('products')
            .select('images')
            .eq('is_active', true)
            .eq('is_featured', true)
            .limit(1)
            .single();

        if (data && data.images && data.images.length > 0) {
            heroImageUrl = data.images[0];
        }
    } catch (e) {
        // Fallback silently to local fallback
    }

    // SVG icon for WhatsApp from the research doc spec
    const WhatsAppIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
    )

    return (
        <section className="relative w-full bg-neutral-950 overflow-hidden h-[70vh] min-h-[500px] md:h-[85vh]">
            {/* Background image or gradient */}
            <div className="absolute inset-0 z-0 flex md:grid md:grid-cols-2 w-full h-full">
                <div className="hidden md:block bg-neutral-950 h-full w-full"></div>
                <div className="w-full h-full relative">
                    <Image
                        src={heroImageUrl}
                        alt="Lukess Home Products"
                        fill
                        priority={true}
                        sizes="(max-width: 768px) 100vw, 100vw"
                        className="object-cover z-0"
                    />
                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                    <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent z-10" />
                </div>
            </div>

            <div className="relative z-20 w-full px-5 max-w-7xl mx-auto min-h-[70vh] md:min-h-[85vh] flex flex-col justify-end pb-24 md:pb-32 pt-16 md:pt-24">
                <div className="max-w-xl md:w-1/2 md:pr-8">
                    {/* Headline */}
                    <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
                        {heroContent.headline}
                    </h1>

                    {/* Subheadline */}
                    <p className="text-base sm:text-lg text-neutral-300 mt-4 max-w-md font-medium leading-relaxed drop-shadow">
                        {heroContent.subheadline}
                    </p>

                    {/* CTAs */}
                    <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                        <a
                            href={heroContent.ctaPrimary.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Comprar o consultar directamente por WhatsApp"
                            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-lg py-4 px-8 rounded-xl shadow-lg shadow-[#25D366]/20 transition-all w-full sm:w-max mt-4 sm:mt-0"
                        >
                            <WhatsAppIcon />
                            <span>{heroContent.ctaPrimary.text}</span>
                        </a>

                        <Link
                            href={heroContent.ctaSecondary.href}
                            className="text-neutral-400 hover:text-white underline text-sm mt-3 sm:mt-0 inline-block transition-colors"
                        >
                            {heroContent.ctaSecondary.text}
                        </Link>
                    </div>

                    {/* Trust Bar below CTAs */}
                    <div className="flex flex-wrap gap-4 mt-6 text-xs text-neutral-400">
                        {trustItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-1.5">
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Links Row Overlapping bottom */}
            <QuickLinksRow />
        </section>
    )
}
