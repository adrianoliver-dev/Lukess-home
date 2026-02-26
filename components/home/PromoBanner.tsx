'use client'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface BannerSlide {
  id: number
  text: string
  bg: string
  textColor: string
}

const BANNER_SLIDES: BannerSlide[] = [
  { id: 1, text: '🚚 Envío gratis en compras mayores a Bs. 400', bg: 'bg-accent-600', textColor: 'text-white' },
  { id: 2, text: '⭐ Camisas Columbia originales — Mercado Mutualista', bg: 'bg-primary-800', textColor: 'text-white' },
  { id: 3, text: '💳 Paga con QR Yolo Pago — rápido y seguro', bg: 'bg-accent-700', textColor: 'text-white' },
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
      className="relative h-12 md:h-14 w-full overflow-hidden flex items-center justify-center bg-gray-900 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {BANNER_SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ease-in-out px-10 ${slide.bg} ${slide.textColor} ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          aria-hidden={index !== current}
        >
          <p className="text-xs md:text-sm font-medium text-center truncate w-full max-w-7xl">
            {slide.text}
          </p>
        </div>
      ))}

      {/* Navegación manual */}
      <button
        onClick={goToPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 md:p-1.5 text-white/70 hover:text-white z-20 rounded-full hover:bg-black/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Banner anterior"
      >
        <ChevronLeft className="w-4 h-4 md:w-5 md:w-5" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 md:p-1.5 text-white/70 hover:text-white z-20 rounded-full hover:bg-black/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Banner siguiente"
      >
        <ChevronRight className="w-4 h-4 md:w-5 md:w-5" />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-1 md:bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {BANNER_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 flex-shrink-0 rounded-full transition-all duration-300 focus:outline-none ${i === current ? 'bg-white w-3 md:w-4' : 'bg-white/40 w-1 md:w-1.5 hover:bg-white/60'
              }`}
            aria-label={`Ir a banner ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
