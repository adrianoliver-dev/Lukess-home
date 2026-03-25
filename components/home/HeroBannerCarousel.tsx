"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Banner } from "@/lib/banners";
import Image from "next/image";

interface HeroBannerCarouselProps {
    banners: Banner[];
}

export default function HeroBannerCarousel({
    banners,
}: HeroBannerCarouselProps): React.JSX.Element | null {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, [banners.length]);

    const goToPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    }, [banners.length]);

    const goTo = useCallback((index: number) => {
        setCurrentIndex(index);
    }, []);

    // Auto-advance
    useEffect(() => {
        if (banners.length <= 1 || isPaused) return;
        const interval = setInterval(goToNext, 5000);
        return () => clearInterval(interval);
    }, [banners.length, isPaused, goToNext]);

    if (banners.length === 0) return null;

    const isMultiple = banners.length >= 2;

    return (
        <section
            className="relative w-full h-[100dvh] md:h-[85vh] min-h-[500px] overflow-hidden bg-zinc-900"
            aria-label="Banner promocional"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Slide track */}
            <div
                className="flex h-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {banners.map((banner, i) => {
                    const imageContent = (
                        <div className="relative w-full h-full">
                            <Image
                                src={
                                    i === 0 && banner.mobile_image_url
                                        ? banner.mobile_image_url
                                        : (banner.desktop_image_url ?? banner.image_url)
                                }
                                alt={banner.title ?? "Banner promocional"}
                                fill
                                priority={i === 0}
                                className="object-cover"
                                sizes="100vw"
                                quality={90}
                            />
                        </div>
                    );

                    const hasLink =
                        banner.link && banner.link !== "/" && banner.link.trim() !== "";

                    return (
                        <div
                            key={banner.id}
                            className="min-w-full h-full flex-shrink-0 relative"
                            aria-hidden={i !== currentIndex}
                        >
                            {hasLink ? (
                                <Link
                                    href={banner.link!}
                                    className="block w-full h-full"
                                    tabIndex={i === currentIndex ? 0 : -1}
                                    aria-label={banner.title ?? "Ver promoción"}
                                >
                                    {imageContent}
                                </Link>
                            ) : (
                                imageContent
                            )}

                            {/* Subtle gradient overlay for depth */}
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"
                                aria-hidden="true"
                            />
                        </div>
                    );
                })}
            </div>

            {/* Left / Right arrows — desktop only */}
            {isMultiple && (
                <>
                    <button
                        onClick={goToPrev}
                        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label="Banner anterior"
                    >
                        <svg
                            className="w-5 h-5 text-zinc-800"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>

                    <button
                        onClick={goToNext}
                        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label="Siguiente banner"
                    >
                        <svg
                            className="w-5 h-5 text-zinc-800"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </>
            )}

            {/* Navigation dots */}
            {isMultiple && (
                <div
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2"
                    role="tablist"
                    aria-label="Seleccionar banner"
                >
                    {banners.map((_, i) => (
                        <button
                            key={i}
                            role="tab"
                            aria-selected={i === currentIndex}
                            aria-label={`Banner ${i + 1}`}
                            onClick={() => goTo(i)}
                            className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-white ${i === currentIndex
                                    ? "w-6 h-2 bg-white"
                                    : "w-2 h-2 bg-white/50 hover:bg-white/80"
                                }`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
