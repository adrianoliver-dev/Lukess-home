"use client";

import { useState } from "react";
import Image from "next/image";
import { MessageCircle, ShoppingBag, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useInView } from "react-intersection-observer";
import Container from "@/components/ui/Container";
import { Product } from "@/lib/types";
import {
  products,
  categories,
  getProductsByCategory,
  type FilterCategory,
} from "@/lib/products";
import { useCart } from "@/lib/context/CartContext";
import toast from "react-hot-toast";

import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

/* ───────── Constantes ───────── */

/* ───────── Variantes de animación ───────── */

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
} as const;

const headingVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

/* ───────── Componente ───────── */

export function CatalogoSection() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("Todos");
  const { addToCart } = useCart();

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.05,
  });

  const filtered = getProductsByCategory(activeFilter);

  const handleAddToCart = (product: any) => {
    // Convertir producto del formato antiguo al nuevo
    const productForCart: Product = {
      id: product.id,
      sku: product.slug,
      name: product.name,
      description: product.description,
      price: product.price,
      cost: 0,
      brand: null,
      sizes: product.sizes,
      colors: null,
      image_url: product.images?.[0] ?? null,
      gallery: product.images,
      is_active: true,
      discount: null,
      is_featured: null,
      category_id: null,
      created_at: new Date().toISOString(),
      categories: { name: product.category },
      inventory: [{ quantity: 99, location_id: '', locations: { name: 'Tienda' } }]
    };

    addToCart(productForCart, 1);
    toast.success(`${product.name} agregado al carrito`);
  };

  return (
    <section id="catalogo" className="py-20 md:py-28 bg-white">
      <Container>
        <motion.div
          ref={ref}
          variants={sectionVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* ── Encabezado ── */}
          <motion.div
            variants={headingVariants}
            className="text-center mb-10 md:mb-14"
          >
            <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-900 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
              <ShoppingBag className="w-3.5 h-3.5" />
              Catálogo
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Nuestros{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-700">
                Productos
              </span>
            </h2>

            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Calidad y estilo para el hombre moderno
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-gray-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-gray-300" />
            </div>
          </motion.div>

          {/* ── Filtros ── */}
          <motion.div
            variants={headingVariants}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 md:mb-14"
            role="tablist"
            aria-label="Filtrar por categoría"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeFilter === cat}
                aria-label={`Filtrar por ${cat}`}
                onClick={() => setActiveFilter(cat)}
                className={`
                  px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold
                  transition-all duration-300
                  ${activeFilter === cat
                    ? "bg-gray-900 text-white shadow-lg shadow-gray-500/25 scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* ── Grid ── */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeFilter}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={sectionVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6"
            >
              {filtered.map((product) => (
                <motion.div
                  key={product.id}
                  variants={cardVariants}
                  layout
                  className="group bg-white border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-sm"
                >
                  {/* Imagen */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 p-3">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-contain transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Badge */}
                    {product.badge && (
                      <span
                        className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider
                          ${product.badge === "Nuevo"
                            ? "bg-black text-white"
                            : "bg-red-600 text-white"
                          }
                        `}
                      >
                        {product.badge}
                      </span>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center gap-2 p-4">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 inline-flex items-center gap-2 bg-white text-gray-900 px-4 py-2.5 text-xs font-semibold"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Agregar
                      </button>
                      <a
                        href={buildWhatsAppUrl(`Hola Lukess Home, me interesa el ${product.name} de ${product.price} Bs. ¿Está disponible?`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Consultar sobre ${product.name} por WhatsApp`}
                        className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 inline-flex items-center gap-2 bg-whatsapp text-white px-4 py-2.5 text-xs font-semibold"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Consultar
                      </a>
                    </div>
                  </div>

                  {/* Info — Zara style */}
                  <div className="px-3 pt-3 pb-2">
                    {/* Nombre */}
                    <h3 className="text-sm text-gray-700 font-normal leading-snug line-clamp-1 mb-1.5">
                      {product.name}
                    </h3>

                    {/* Precio */}
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-bold text-gray-900">
                        {product.price}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        Bs
                      </span>
                    </div>
                  </div>

                  {/* Botones móvil */}
                  <div className="px-3 pb-3 lg:hidden flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-black text-white py-2 text-xs font-semibold transition-all"
                    >
                      Agregar
                    </button>
                    <a
                      href={buildWhatsAppUrl(`Hola Lukess Home, me interesa el ${product.name} de ${product.price} Bs. ¿Está disponible?`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-whatsapp hover:bg-whatsapp-dark text-white transition-all flex items-center justify-center"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* ── CTA inferior ── */}
          <motion.div
            variants={headingVariants}
            className="text-center mt-12 md:mt-16"
          >
            <p className="text-gray-400 text-sm mb-4">
              ¿No encontraste lo que buscas? Tenemos mucho más en tienda
            </p>
            <a
              href={buildWhatsAppUrl("Hola Lukess Home, quiero consultar sobre otros productos")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-secondary-800/25"
            >
              <MessageCircle className="w-4 h-4" />
              Pregunta por más productos
            </a>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
