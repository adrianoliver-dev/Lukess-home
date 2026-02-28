'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
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

interface BannerCarouselProps {
    banners: Banner[]
}

/* ─── Component ─── */
export default function BannerCarousel({ banners }: BannerCarouselProps): React.JSX.Element {
    const [current, setCurrent] = useState<number>(0)
    const [paused, setPaused] = useState<boolean>(false)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const total = banners.length

    const next = useCallback((): void => {
        setCurrent((prev) => (prev + 1) % total)
    }, [total])

    const prev = useCallback((): void => {
        setCurrent((prev) => (prev - 1 + total) % total)
    }, [total])

    const goTo = useCallback((index: number): void => {
        setCurrent(index)
    }, [])

    /* Auto-rotation */
    useEffect(() => {
        if (paused || total <= 1) return

        intervalRef.current = setInterval(next, 5000)
        return (): void => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [next, paused, total])

    return (
        <section
            role="region"
            aria-label="Banner carousel"
            className="relative w-full h-[400px] md:h-[600px] bg-zinc-900 overflow-hidden max-w-[1920px] mx-auto"
            onMouseEnter={(): void => setPaused(true)}
            onMouseLeave={(): void => setPaused(false)}
        >
            {/* ── Slides ── */}
            <div className="relative w-full h-full" aria-live="polite" aria-atomic="true">
                {banners.map((banner, index) => {
                    const isActive = index === current
                    const slideContent = (
                        <>
                            <Image
                                src={banner.image_url}
                                alt={banner.title ?? 'Lukess Home Banner'}
                                fill
                                priority={index === 0}
                                sizes="(max-width: 768px) 100vw, 1920px"
                                className="object-cover object-center"
                            />
                            {/* Subtle gradient overlay for legibility */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                        </>
                    )

                    return (
                        <div
                            key={banner.id}
                            aria-hidden={!isActive}
                            className={`absolute inset-0 transition-opacity duration-700 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                }`}
                        >
                            {banner.link ? (
                                <Link
                                    href={banner.link}
                                    className="block w-full h-full cursor-pointer"
                                    aria-label={banner.title ?? 'Ver promoción'}
                                    tabIndex={isActive ? 0 : -1}
                                >
                                    {slideContent}
                                </Link>
                            ) : (
                                <div className="w-full h-full">{slideContent}</div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* ── Arrow controls (desktop only) ── */}
            {total > 1 && (
                <>
                    <button
                        onClick={prev}
                        aria-label="Banner anterior"
                        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-11 h-11 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors duration-200 shadow-md"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5 text-zinc-900"
                            aria-hidden="true"
                        >
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>

                    <button
                        onClick={next}
                        aria-label="Banner siguiente"
                        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-11 h-11 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors duration-200 shadow-md"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5 text-zinc-900"
                            aria-hidden="true"
                        >
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </>
            )}

            {/* ── Navigation dots ── */}
            {total > 1 && (
                <div
                    role="tablist"
                    aria-label="Navegación de banners"
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2"
                >
                    {banners.map((banner, index) => {
                        const isActive = index === current
                        return (
                            <button
                                key={banner.id}
                                role="tab"
                                aria-selected={isActive}
                                aria-label={`Banner ${index + 1}${banner.title ? `: ${banner.title}` : ''}`}
                                onClick={(): void => goTo(index)}
                                className={`rounded-full bg-white transition-all duration-300 ${isActive
                                        ? 'w-4 h-4 opacity-100 shadow-md'
                                        : 'w-3 h-3 opacity-50 hover:opacity-75'
                                    }`}
                            />
                        )
                    })}
                </div>
            )}
        </section>
    )
}
