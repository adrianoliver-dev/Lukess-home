"use client";

import { MessageCircle, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

/* ───────── Constantes ───────── */

const WHATSAPP_URL = buildWhatsAppUrl("Hola Lukess Home, quiero consultar sobre sus productos");

/* ───────── Variantes de animación ───────── */

const scaleUp = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

/* ───────── Componente ───────── */

export default function CTAFinalSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section id="contacto-cta" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <motion.div
        ref={ref}
        variants={scaleUp}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-600 via-gray-500 to-gray-700" />

        {/* Decoraciones */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-lukess-gold/10 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-500/20 rounded-full blur-3xl" />
        </div>

        {/* Patrón sutil */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        {/* Contenido */}
        <div className="relative z-10 text-center px-6 sm:px-10 md:px-16 py-14 md:py-20">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white/90 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-lukess-gold animate-pulse" />
            Global Concierge
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
            Ready to Elevate{" "}
            <span className="text-lukess-gold">Your Style</span>?
          </h2>

          <p className="text-white/80 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
            Book a private consultation with our menswear specialists or visit our global flagship stores.
          </p>

          {/* Botón */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 md:px-10 md:py-5 rounded-full text-base md:text-lg font-bold transition-all duration-300 hover:scale-105 border border-gray-200 shadow-sm shadow-black/20"
          >
            <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
            Book Consultation
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
          </a>

          {/* Info adicional */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-white/50 text-xs sm:text-sm">
            <span>24/7 Support</span>
            <span className="hidden sm:inline">•</span>
            <span>Style Advice</span>
            <span className="hidden sm:inline">•</span>
            <span>Made to Measure</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
