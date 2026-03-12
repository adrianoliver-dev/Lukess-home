"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Star, Quote } from "lucide-react";
import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import Container from "@/components/ui/Container";

/* ───────── Tipos ───────── */

interface Testimonio {
  id: number;
  nombre: string;
  ciudad: string;
  rating: number;
  texto: string;
  iniciales: string;
}

/* ───────── Datos ───────── */

const testimonios: Testimonio[] = [
  {
    id: 1,
    nombre: "Charles M.",
    ciudad: "New York",
    rating: 5,
    iniciales: "CM",
    texto:
      "I've been shopping here for 5 years. The quality is exceptional and the fit is perfect. Always a great experience at their flagship.",
  },
  {
    id: 2,
    nombre: "Robert V.",
    ciudad: "London",
    rating: 5,
    iniciales: "RV",
    texto:
      "Personalized attention and great variety. They outfitted me completely for my wedding. 100% recommended.",
  },
  {
    id: 3,
    nombre: "Fernando S.",
    ciudad: "Miami",
    rating: 5,
    iniciales: "FS",
    texto:
      "The best menswear store I've visited. Premium quality. Absolutely worth the trip to the boutique.",
  },
  {
    id: 4,
    nombre: "David R.",
    ciudad: "Los Angeles",
    rating: 5,
    iniciales: "DR",
    texto:
      "Never disappointed. They have the latest trends and timeless classics that you won't easily find elsewhere.",
  },
];

/* ───────── Variantes de animación ───────── */

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
} as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

/* ───────── Componente Estrellas ───────── */

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < count
            ? "text-lukess-gold fill-lukess-gold"
            : "text-gray-200"
            }`}
        />
      ))}
    </div>
  );
}

/* ───────── Componente Card ───────── */

function TestimonioCard({ testimonio }: { testimonio: Testimonio }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm hover:border border-gray-200 shadow-sm hover:border-gray-200 transition-all duration-300 h-full flex flex-col">
      {/* Comillas decorativas */}
      <div className="mb-4">
        <Quote className="w-8 h-8 text-gray-300" />
      </div>

      {/* Texto */}
      <p className="text-gray-600 text-sm sm:text-base italic leading-relaxed flex-1 mb-6">
        &ldquo;{testimonio.texto}&rdquo;
      </p>

      {/* Rating */}
      <div className="mb-4">
        <StarRating count={testimonio.rating} />
      </div>

      {/* Autor */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        {/* Avatar con iniciales */}
        <div className="w-11 h-11 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-white">
            {testimonio.iniciales}
          </span>
        </div>

        <div>
          <p className="text-sm font-bold text-gray-800">
            {testimonio.nombre}
          </p>
          <p className="text-xs text-gray-400">{testimonio.ciudad}</p>
        </div>
      </div>
    </div>
  );
}

/* ───────── Componente Principal ───────── */

export default function TestimoniosSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  /* ── Scroll programático ── */
  const scrollToIndex = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container) return;

    const card = container.children[index] as HTMLElement | undefined;
    if (!card) return;

    container.scrollTo({
      left: card.offsetLeft - container.offsetLeft,
      behavior: "smooth",
    });
  }, []);

  /* ── Detectar scroll manual para sincronizar dots ── */
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.children[0]
        ? (container.children[0] as HTMLElement).offsetWidth
        : 1;
      const gap = 20; // gap-5 = 1.25rem ≈ 20px
      const newIndex = Math.round(scrollLeft / (cardWidth + gap));
      setActiveIndex(Math.min(newIndex, testimonios.length - 1));
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── Auto-play cada 5s ── */
  const resetAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % testimonios.length;
        scrollToIndex(next);
        return next;
      });
    }, 5000);
  }, [scrollToIndex]);

  useEffect(() => {
    if (inView) resetAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [inView, resetAutoPlay]);

  /* ── Click en dot ── */
  const goTo = (index: number) => {
    setActiveIndex(index);
    scrollToIndex(index);
    resetAutoPlay();
  };

  return (
    <section id="testimonios" className="py-20 md:py-28 bg-white">
      <Container>
        <motion.div
          ref={inViewRef}
          variants={sectionVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* ── Encabezado ── */}
          <motion.div variants={fadeInUp} className="text-center mb-12 md:mb-16">
            <span className="inline-flex items-center gap-2 bg-lukess-gold/10 text-lukess-gold px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
              <Star className="w-3.5 h-3.5 fill-lukess-gold text-lukess-gold" />
              Testimonials
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              What Our {" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-700">
                Clients Say
              </span>
            </h2>

            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Client satisfaction is our ultimate priority.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-lukess-gold/40" />
              <Star className="w-5 h-5 text-lukess-gold fill-lukess-gold" />
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-lukess-gold/40" />
            </div>
          </motion.div>

          {/* ── Carousel ── */}
          <motion.div variants={fadeInUp}>
            {/* Scroll container */}
            <div
              ref={scrollRef}
              className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
              onMouseEnter={() => {
                if (autoPlayRef.current) clearInterval(autoPlayRef.current);
              }}
              onMouseLeave={() => resetAutoPlay()}
              onTouchStart={() => {
                if (autoPlayRef.current) clearInterval(autoPlayRef.current);
              }}
              onTouchEnd={() => resetAutoPlay()}
            >
              {/* Ocultar scrollbar vía className extra */}
              {testimonios.map((testimonio) => (
                <div
                  key={testimonio.id}
                  className="snap-start shrink-0 w-[85vw] sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
                >
                  <TestimonioCard testimonio={testimonio} />
                </div>
              ))}
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {testimonios.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Ir al testimonio ${i + 1}`}
                  className={`
                    rounded-full transition-all duration-300
                    ${activeIndex === i
                      ? "w-8 h-2.5 bg-gray-900"
                      : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
                    }
                  `}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
