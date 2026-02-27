import Image from 'next/image'
import { MessageCircle } from 'lucide-react'
import QuickLinksRow from './QuickLinksRow'

export default function HeroSection() {
    const whatsappUrl = 'https://wa.me/59172643753?text=Hola!%20Me%20interesa%20la%20ropa%20Columbia%20original%20de%20Lukess%20Home'

    return (
        <section className="relative w-full h-[80vh] md:h-[85vh] bg-black overflow-hidden flex flex-col justify-end">
            {/* Background Image (Desktop & Mobile) */}
            <div className="absolute inset-0 w-full h-full">
                {/* Mobile Default */}
                <Image
                    src="/products/polo-azul-texturizado.png"
                    alt="Hombre vistiendo ropa premium Columbia en Santa Cruz de la Sierra"
                    fill
                    priority
                    fetchPriority="high"
                    sizes="100vw"
                    className="object-cover object-top md:hidden"
                />
                {/* Desktop Image */}
                <Image
                    src="/products/polo-azul-texturizado.png"
                    alt="Hombre vistiendo ropa premium Columbia en Santa Cruz de la Sierra"
                    fill
                    priority
                    fetchPriority="high"
                    sizes="100vw"
                    className="hidden md:block object-cover object-top"
                />

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
            </div>

            {/* Hero Content Area */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 md:pb-40 pt-16 md:pt-24">
                <div className="max-w-2xl text-left">
                    {/* Eyebrow */}
                    <span className="block text-accent-500 font-bold uppercase tracking-wider text-xs md:text-sm mb-2 drop-shadow-sm">
                        Nueva Colección 2026
                    </span>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-md">
                        Domina el Calor con <br className="hidden sm:block" />
                        Tecnología Columbia
                    </h1>

                    {/* Subheadline */}
                    <p className="text-neutral-300 text-sm sm:text-lg mb-8 max-w-xl drop-shadow">
                        Protección UV Omni-Shade y máxima frescura. 100% original. Envío a toda Bolivia.
                    </p>

                    {/* CTA */}
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Comprar o consultar directamente por WhatsApp"
                        className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 animate-pulse-subtle"
                    >
                        <MessageCircle className="w-5 h-5 fill-current" />
                        <span className="text-base sm:text-lg">Comprar por WhatsApp</span>
                    </a>
                </div>
            </div>

            {/* Quick Links Row Overlapping bottom */}
            <QuickLinksRow />
        </section>
    )
}
