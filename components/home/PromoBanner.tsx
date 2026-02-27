'use client'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface BannerSlide {
  id: number
  text: string
  bg: string
  textColor: string
  href?: string
}

const BANNER_SLIDES: BannerSlide[] = [
  { id: 1, text: '🚚 Envío gratis en compras mayores a Bs. 400', bg: 'bg-accent-500', textColor: 'text-white', href: '/como-comprar' },
  { id: 2, text: '✨ Colección Premium 2026', bg: 'bg-primary-900', textColor: 'text-white' },
  { id: 3, text: '💳 Paga con QR Yolo Pago — rápido y seguro', bg: 'bg-accent-500/80', textColor: 'text-white', href: '/metodos-pago' },
]

export function PromoBanner() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNER_SLIDES.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [isPaused])

  const goToNext = () => setCurrent((prev) => (prev + 1) % BANNER_SLIDES.length)
  const goToPrev = () => setCurrent((prev) => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length)

  return (
    <div
      className="relative h-11 md:h-12 w-full overflow-hidden flex items-center justify-center bg-gray-900 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {BANNER_SLIDES.map((slide, index) => (
        <Link
          key={slide.id}
          href={slide.href || '#'}
          className={`absolute inset-0 flex items-center justify-center px-10 ${slide.bg} ${slide.textColor} transition-opacity duration-0 ${index === current ? 'opacity-100 z-10 hover:brightness-110 cursor-pointer' : 'opacity-0 z-0 pointer-events-none'
            }`}
          aria-hidden={index !== current}
        >
          {index === current && (
            <>
              {/* Shimmer effect */}
              <div className="banner-shimmer absolute inset-0 w-full h-full pointer-events-none" />

              {/* Text with slide-in animation */}
              <p
                key={`text-${slide.id}-${current}`}
                className="banner-slide-enter text-xs md:text-sm font-medium text-center truncate max-w-7xl flex items-center justify-center gap-1.5"
              >
                {slide.text}
                <ChevronRight className="w-3 h-3 flex-shrink-0" />
              </p>
            </>
          )}
        </Link>
      ))}

      {/* Navegación manual */}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToPrev(); }}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 md:p-1.5 text-white opacity-60 hover:opacity-100 z-20 rounded-full transition-all focus:outline-none"
        aria-label="Banner anterior"
      >
        <ChevronLeft className="w-4 h-4 md:w-5 md:w-5" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToNext(); }}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 md:p-1.5 text-white opacity-60 hover:opacity-100 z-20 rounded-full transition-all focus:outline-none"
        aria-label="Banner siguiente"
      >
        <ChevronRight className="w-4 h-4 md:w-5 md:w-5" />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
        {BANNER_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrent(i); }}
            className={`flex-shrink-0 rounded-full transition-all duration-300 focus:outline-none ${i === current ? 'bg-white w-2 h-2' : 'bg-white/40 w-1.5 h-1.5 hover:bg-white/60'
              }`}
            aria-label={`Ir a banner ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
