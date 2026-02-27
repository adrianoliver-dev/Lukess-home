import Image from 'next/image'
import Link from 'next/link'

const CATEGORIES = [
    { id: 'camisas', name: 'Camisas', href: '/?filter=camisas#catalogo', image: '/products/camisa-columbia-verde.png', objectPosition: 'center top' },
    { id: 'pantalones', name: 'Pantalones', href: '/?filter=pantalones#catalogo', image: '/products/pantalon-jean-indigo-oscuro.png', objectPosition: 'center center' },
    { id: 'cinturones', name: 'Cinturones', href: '/?filter=accesorios-cinturones#catalogo', image: '/products/cinturon-cuero-cafe.png', objectPosition: 'center center' },
    { id: 'gorras', name: 'Gorras', href: '/?filter=gorras#catalogo', image: '/products/gorra-azul-minimalista.png', objectPosition: 'center center' },
]

export default function QuickLinksRow() {
    return (
        <nav
            aria-label="Navegación rápida de categorías"
            className="absolute bottom-0 left-0 w-full z-20 pb-4 md:pb-8"
        >
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ul className="flex gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-2 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                    {CATEGORIES.map((cat) => (
                        <li key={cat.id} className="snap-start shrink-0">
                            <Link
                                href={cat.href}
                                className="group relative block w-36 h-24 md:w-52 md:h-32 rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-accent-500 shadow-lg"
                            >
                                {/* Image */}
                                <Image
                                    src={cat.image}
                                    alt={`Categoría ${cat.name}`}
                                    fill
                                    sizes="(max-width: 768px) 144px, 208px"
                                    className="object-cover transition-transform duration-500 group-hover:scale-110 active:scale-105"
                                    style={{ objectPosition: cat.objectPosition }}
                                />

                                {/* Dark Overlay (lightens on hover) */}
                                <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/10" />

                                {/* Category Text */}
                                <div className="absolute inset-0 flex items-center justify-center p-2">
                                    <span className="text-white font-bold text-sm md:text-lg text-center drop-shadow-md tracking-wide">
                                        {cat.name}
                                    </span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    )
}
