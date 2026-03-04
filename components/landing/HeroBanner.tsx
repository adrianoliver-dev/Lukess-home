import Image from "next/image";
import Link from "next/link";
import { getActiveBanners } from "@/lib/banners";
import HeroBannerCarousel from "@/components/home/HeroBannerCarousel";

// Always fetch fresh banners on every request — no caching
export const dynamic = "force-dynamic";

/**
 * HeroBanner — Server Component
 *
 * Fetches active banners from Supabase and renders:
 * - HeroBannerCarousel when 1+ banners are active
 * - Static fallback hero when no banners are configured
 */
export default async function HeroBanner(): Promise<React.JSX.Element> {
    const banners = await getActiveBanners();

    // If there are active banners, use the dynamic carousel
    if (banners.length > 0) {
        return <HeroBannerCarousel banners={banners} />;
    }

    // Static fallback hero (original design preserved)
    return (
        <section
            className="relative w-full aspect-[3/4] md:aspect-video @container bg-zinc-900 overflow-hidden mx-auto max-w-[1920px]"
            aria-label="Promoción Principal"
        >
            {/* Background Images with Art Direction */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Mobile Asset (Vertical 3:4) */}
                <Image
                    src="/images/hero-mobile.webp"
                    alt="Hombre vistiendo ropa casual premium frente a mall moderno en Santa Cruz"
                    fill
                    priority
                    className="object-cover object-top sm:hidden"
                    sizes="100vw"
                    quality={100}
                />
                {/* Desktop Asset (Horizontal 16:9) */}
                <Image
                    src="/images/hero-desktop.webp"
                    alt="Hombre vistiendo ropa casual premium frente a mall moderno en Santa Cruz"
                    fill
                    priority
                    className="hidden sm:block object-cover object-center"
                    sizes="100vw"
                    quality={100}
                />
                {/* WCAG Contrast Overlay */}
                <div
                    className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent sm:bg-gradient-to-r sm:from-black/90 sm:via-black/50 sm:to-transparent z-10"
                    aria-hidden="true"
                />
            </div>

            {/* Content Container */}
            <div className="relative z-20 flex flex-col justify-end h-full px-6 pb-12 mx-auto max-w-[1920px] w-full sm:px-12 md:px-16 md:justify-center">
                <div className="max-w-xl">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white lg:text-7xl drop-shadow-lg text-balance">
                        Ropa Masculina Premium
                        <br />
                        <span className="text-amber-400">en Santa Cruz</span>
                    </h1>
                </div>

                <div className="mt-4 max-w-lg">
                    <p className="text-lg font-medium text-zinc-200 md:text-xl drop-shadow-md text-pretty">
                        Camisas Columbia, blazers, pantalones y accesorios. Visítanos en
                        nuestros 3 locales en el Mercado Mutualista.
                    </p>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <Link
                        href="/#catalogo"
                        className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-zinc-900 transition-all bg-white rounded-xl hover:scale-[1.03] hover:bg-zinc-100 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-zinc-300 active:scale-95"
                    >
                        Explorar la Colección
                    </Link>
                    <div className="flex items-center gap-2 text-sm font-bold text-zinc-300 drop-shadow-sm">
                        <svg
                            className="w-5 h-5 text-amber-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        <span>Envío gratis por compras mayores a Bs 400</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
