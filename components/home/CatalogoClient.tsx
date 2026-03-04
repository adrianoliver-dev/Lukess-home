'use client'
import { useState, useMemo, useCallback, useEffect } from 'react'
import Container from '@/components/ui/Container'
import { ShoppingBag, Tag, MessageCircle, Plus, Filter, X, Palette, Ruler, Building2, SlidersHorizontal, Check, Sparkles, Percent, Leaf } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Product } from '@/lib/types'
import { useCart } from '@/lib/context/CartContext'
import toast from 'react-hot-toast'
import { FilterSidebar, type Filters } from '@/components/catalogo/FilterSidebar'
import { ProductBadges } from '@/components/catalogo/ProductBadges'
import { WishlistButton } from '@/components/wishlist/WishlistButton'
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp'
import { hasActiveDiscount as hasDiscount, getDiscount, getPriceWithDiscount } from '@/lib/utils/price'
import { type FilterOptions } from '@/app/actions/filters'

interface CatalogoClientProps {
  initialProducts: Product[]
  initialFilters?: FilterOptions | null
  categories?: string[]
  selectedCategory?: string | null
}

/* ───────── Variantes de animación ───────── */

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0 },
  },
} as const

const headingVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1, ease: 'easeIn' as const },
  },
}

// Toast personalizado que no bloquea - Posición bottom-right
const showAddedToast = (productName: string) => {
  toast.custom((t) => (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: t.visible ? 1 : 0, x: t.visible ? 0 : 100, scale: t.visible ? 1 : 0.9 }}
      className="flex items-center gap-3 bg-white border-2 border-green-200 shadow-xl rounded-xl px-4 py-3 pointer-events-none"
    >
      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
        <Check className="w-5 h-5 text-green-600" />
      </div>
      <div>
        <p className="font-semibold text-gray-900 text-sm">Agregado al carrito</p>
        <p className="text-xs text-gray-500 truncate max-w-[180px]">{productName}</p>
      </div>
    </motion.div>
  ), { duration: 1500, position: 'bottom-right' })
}

export function CatalogoClient({ initialProducts, initialFilters, categories: serverCategories, selectedCategory }: CatalogoClientProps) {
  // Estados de filtros - Ahora son arrays para multiselección
  const [selectedCategories, setSelectedCategories] = useState<string[]>(selectedCategory ? [selectedCategory] : [])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [sidebarFilters, setSidebarFilters] = useState<Filters>({
    priceRange: [0, 1000],
    brands: [],
    colors: [],
    sizes: [],
    inStock: false,
    category: null,
    hasDiscount: null,
  })
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'lowStock'>('all')
  const [showNew, setShowNew] = useState(false)
  const [showDiscount, setShowDiscount] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [displayLimit, setDisplayLimit] = useState(20)

  // Opciones Dinámicas de Filtros — se reciben desde el Server Component como prop
  const [dynamicFilters, setDynamicFilters] = useState<FilterOptions | null>(initialFilters || null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const { addToCart } = useCart()
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.05,
    rootMargin: '50px'
  })

  // Extraer el orden actual de la URL o default
  const sortOrder = searchParams?.get('sort') || 'recent'

  // Sincronizar búsqueda y filtros principales desde la URL
  useEffect(() => {
    if (!searchParams) return

    const busqueda = searchParams.get('busqueda') || ''
    const filter = searchParams.get('filter') || ''

    // Manejar parámetro de búsqueda
    if (busqueda !== searchQuery) {
      if (busqueda) {
        // Limpiar otros filtros al buscar
        setSelectedCategories([])
        setSelectedBrands([])
        setSelectedColors([])
        setStockFilter('all')
        setShowNew(false)
        setShowDiscount(false)
      }
      setSearchQuery(busqueda)
    }

    if (filter) {
      let newCategories: string[] = []
      let newBrands: string[] = []
      let newShowNew = false
      let newShowDiscount = false

      if (filter === 'nuevo') {
        newShowNew = true
      } else if (filter === 'descuento' || filter === 'descuentos') {
        newShowDiscount = true
      } else {
        // Dynamic fallback: capitalize the first letter to match the DB format typically used 
        // e.g., 'gorras' -> 'Gorras', 'polos' -> 'Polos'
        const formattedCategory = filter.charAt(0).toUpperCase() + filter.slice(1);
        newCategories = [formattedCategory];
      }

      // Reiniciar filtros completamente basados en el parametro
      setSelectedCategories(newCategories)
      setSelectedBrands(newBrands)
      setShowNew(newShowNew)
      setShowDiscount(newShowDiscount)
      setSidebarFilters({
        priceRange: [0, 1000],
        brands: [],
        colors: [],
        sizes: [],
        inStock: false,
        category: null,
        hasDiscount: null,
      })
      setStockFilter('all')
      setSelectedColors([])
      setSearchQuery('')
    }
  }, [searchParams, searchQuery])

  // Sync filtros dinámicos cuando llegan nuevas props desde el Server Component
  useEffect(() => {
    setDynamicFilters(initialFilters || null)
  }, [initialFilters])

  // Función para verificar si un producto es nuevo (con expiración)
  const isProductNew = useCallback((product: Product): boolean => {
    return product.is_new === true && (
      !product.is_new_until || new Date(product.is_new_until) > new Date()
    )
  }, [])

  // Función para calcular ahorro
  const getSavings = useCallback((product: Product): number => {
    const discount = getDiscount(product)
    return product.price * (discount / 100)
  }, [])

  // Extraer categorías únicas
  const categories = useMemo(() => {
    if (serverCategories && serverCategories.length > 0) {
      return ['Todos', ...serverCategories.sort()]
    }
    const cats = new Set<string>()
    initialProducts.forEach(p => {
      if (p.categories?.name) cats.add(p.categories.name)
    })
    return ['Todos', ...Array.from(cats).sort()]
  }, [initialProducts, serverCategories])

  // Extraer marcas únicas (dinámico O general)
  const brands = useMemo(() => {
    if (dynamicFilters && dynamicFilters.brands.length > 0) {
      return ['Todas', ...dynamicFilters.brands.sort()]
    }

    // Fallback original para "Todos" los productos
    const brandSet = new Set<string>()
    initialProducts.forEach(p => {
      if (p.brand) brandSet.add(p.brand)
    })
    const sortedBrands = Array.from(brandSet).sort()
    return ['Todas', ...sortedBrands.slice(0, 8)]
  }, [initialProducts, dynamicFilters])

  // Colores estándar o dinámicos
  const colors = useMemo(() => {
    if (dynamicFilters && dynamicFilters.colors.length > 0) {
      return ['Todos', ...dynamicFilters.colors.sort()]
    }

    // Fallback: extraer colores únicos de todos los productos
    const availableColors = new Set<string>()
    initialProducts.forEach(p => {
      if (p.colors && Array.isArray(p.colors)) {
        p.colors.forEach(c => availableColors.add(c))
      }
    })
    return ['Todos', ...Array.from(availableColors).sort()]
  }, [initialProducts, dynamicFilters])

  // Tallas dinámicas
  const sizes = useMemo(() => {
    if (dynamicFilters && dynamicFilters.sizes.length > 0) {
      return dynamicFilters.sizes.sort()
    }

    const availableSizes = new Set<string>()
    initialProducts.forEach(p => {
      if (p.sizes && Array.isArray(p.sizes)) {
        p.sizes.forEach(s => availableSizes.add(s))
      }
    })
    return Array.from(availableSizes).sort()
  }, [initialProducts, dynamicFilters])

  // Calcular stock disponible (quantity - reserved_qty para reflejar reservas activas)
  const getTotalStock = useCallback((product: Product): number => {
    return product.inventory?.reduce(
      (sum, inv) => sum + Math.max(0, inv.quantity - (inv.reserved_qty ?? 0)),
      0
    ) || 0
  }, [])

  // Filtrar y ordenar productos con todos los filtros
  const filteredProducts = useMemo(() => {

    let filtered = initialProducts.filter(p => {
      // Filtro de búsqueda - MEJORADO para incluir más campos
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchesName = p.name.toLowerCase().includes(query)
        const matchesBrand = p.brand?.toLowerCase().includes(query)
        const matchesCategory = p.categories?.name.toLowerCase().includes(query)
        const matchesDescription = p.description?.toLowerCase().includes(query)
        const matchesSKU = p.sku?.toLowerCase().includes(query)

        // Buscar en colores
        const matchesColor = p.colors?.some(color =>
          color.toLowerCase().includes(query)
        )

        // Buscar en tallas
        const matchesSize = p.sizes?.some(size =>
          size.toLowerCase().includes(query)
        )

        // Buscar palabras clave especiales
        const matchesKeywords =
          (query === 'nuevo' || query === 'nuevos') && p.is_new === true ||
          (query === 'descuento' || query === 'descuentos' || query === 'oferta' || query === 'ofertas') && hasDiscount(p)

        if (!matchesName && !matchesBrand && !matchesCategory && !matchesDescription &&
          !matchesSKU && !matchesColor && !matchesSize && !matchesKeywords) {
          return false
        }
      }

      // Filtro por "NUEVO" (productos con is_new = true)
      if (showNew && !isProductNew(p)) return false

      // Filtro por "DESCUENTO"
      if (showDiscount && !hasDiscount(p)) return false

      // Filtros del sidebar - Precio
      if (p.price < sidebarFilters.priceRange[0] || p.price > sidebarFilters.priceRange[1]) return false

      // Filtros del sidebar - Talla
      if (sidebarFilters.sizes.length > 0 && (!p.sizes || !p.sizes.some(s => sidebarFilters.sizes.includes(s)))) return false

      // Filtros del sidebar - Stock
      const stock = getTotalStock(p)
      if (sidebarFilters.inStock && stock === 0) return false

      // Filtros del sidebar - Descuento
      if (sidebarFilters.hasDiscount && !hasDiscount(p)) return false

      // Filtro por categorías (multiselección)
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.categories?.name || '')) return false

      // Filtro por marcas (multiselección)
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand || '')) return false

      // Filtro por colores (multiselección)
      if (selectedColors.length > 0 && (!p.colors || !p.colors.some(c => selectedColors.includes(c)))) return false

      // Filtro por stock (botones superiores)
      if (stockFilter === 'inStock' && stock === 0) return false
      if (stockFilter === 'lowStock' && (stock === 0 || stock >= 5)) return false

      return true
    })

    // Ordenar productos: Solo colocar los sin stock al final. Dejar el resto del orden tal como
    // viene del servidor (ya ordenado por Supabase debido al querystring).
    const sorted = [...filtered].sort((a, b) => {
      const stockA = getTotalStock(a)
      const stockB = getTotalStock(b)
      if (stockA === 0 && stockB > 0) return 1
      if (stockA > 0 && stockB === 0) return -1
      return 0
    })

    return sorted
  }, [selectedCategories, selectedBrands, selectedColors, stockFilter, showNew, showDiscount, searchQuery, sidebarFilters, initialProducts, getTotalStock, isProductNew])

  // Contar filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0
    count += selectedCategories.length
    count += selectedBrands.length
    count += selectedColors.length
    count += sidebarFilters.sizes.length
    if (stockFilter !== 'all') count++
    if (showNew) count++
    if (showDiscount) count++
    if (searchQuery.trim()) count++
    return count
  }, [selectedCategories, selectedBrands, selectedColors, sidebarFilters.sizes, stockFilter, showNew, showDiscount, searchQuery])

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedColors([])
    setStockFilter('all')
    setShowNew(false)
    setShowDiscount(false)
    setSidebarFilters({
      priceRange: [0, 1000],
      brands: [],
      colors: [],
      sizes: [],
      inStock: false,
      category: null,
      hasDiscount: null,
    })
    setSearchQuery('')
    // Limpiar la URL usando el router de Next.js
    router.push('/#catalogo', { scroll: false })
  }

  const handleAddToCart = (product: Product) => {
    const stock = getTotalStock(product)
    if (stock === 0) {
      toast.error('Producto sin stock', { position: 'bottom-center', duration: 1500 })
      return
    }

    addToCart(product, 1)
    showAddedToast(product.name)
  }

  const formatPrice = (n: number) => n.toFixed(2)

  const handleWhatsAppConsult = (product: Product) => {
    const totalStock = getTotalStock(product)
    const message =
      totalStock === 0
        ? 'Hola! Me interesa este producto 👇\n' +
        `*${product.name}*\n` +
        `💰 Precio: Bs ${formatPrice(product.price)}\n` +
        '¿Cuándo habrá stock disponible? 🙏'
        : 'Hola! Me interesa este producto 👇\n' +
        `*${product.name}*\n` +
        `💰 Precio: Bs ${formatPrice(product.price)}\n` +
        '¿Me pueden dar más información? 🙏'
    window.open(buildWhatsAppUrl(message), '_blank')
  }

  return (
    <section id="catalogo" className="py-20 md:py-28 bg-white">
      <Container>
        <motion.div
          ref={ref}
          variants={sectionVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
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
              Nuestros{' '}
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

          {/* ── Barra de Filtros Simplificada ── */}
          <motion.div
            variants={headingVariants}
            className="mb-8 md:mb-12"
          >
            {/* Filtros rápidos principales */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4">
              {/* Botón Nuevo */}
              <button
                onClick={() => {
                  clearAllFilters()
                  setShowNew(true)
                }}
                className={`
                  px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold
                  transition-all duration-300 flex items-center gap-2
                  ${showNew
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-400/30 scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                  }
                `}
              >
                <Sparkles className="w-4 h-4" />
                Nuevo
              </button>

              {/* Botón Descuentos */}
              <button
                onClick={() => {
                  clearAllFilters()
                  setShowDiscount(true)
                }}
                className={`
                  px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold
                  transition-all duration-300 flex items-center gap-2
                  ${showDiscount
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                  }
                `}
              >
                <Percent className="w-4 h-4" />
                Descuentos
              </button>
            </div>

            {/* Botón de filtros + contador + ordenamiento */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md ${showFilters
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-700 text-white hover:bg-gray-800'
                  }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtros
                {activeFiltersCount > 0 && (
                  <span className="bg-white text-gray-800 text-xs font-bold px-2 py-0.5 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-red-600 hover:bg-red-50 transition-all border border-red-200"
                >
                  <X className="w-4 h-4" />
                  Limpiar filtros
                </button>
              )}
            </div>

            {/* Contador y ordenamiento */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4">
              <span className="text-sm font-semibold text-gray-700">
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
              </span>

              <div className="flex items-center gap-2">
                <label htmlFor="sort-order" className="text-sm text-gray-600 font-medium">
                  Ordenar por:
                </label>
                <select
                  id="sort-order"
                  value={sortOrder}
                  onChange={(e) => {
                    const params = new URLSearchParams(searchParams?.toString())
                    params.set('sort', e.target.value)
                    router.push(`${pathname}?${params.toString()}#catalogo`, { scroll: false })
                  }}
                  className="px-3 py-1.5 text-sm border-2 border-gray-200 rounded-lg focus:border-gray-500 focus:outline-none bg-white cursor-pointer"
                >
                  <option value="recent">Más recientes</option>
                  <option value="price-asc">Menor precio</option>
                  <option value="price-desc">Mayor precio</option>
                </select>
              </div>
            </div>

            {/* Filtros activos visuales */}
            {activeFiltersCount > 0 && (
              <div className="px-4 mt-4">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs font-semibold text-gray-600">Filtros activos:</span>

                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                      🔍 "{searchQuery}"
                      <button onClick={() => {
                        setSearchQuery('')
                        window.history.pushState(null, '', '/#catalogo')
                      }} className="hover:text-blue-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedCategories.map(cat => (
                    <span key={cat} className="inline-flex items-center gap-1 bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                      {cat}
                      <button onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== cat))} className="hover:text-gray-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {selectedBrands.map(brand => (
                    <span key={brand} className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">
                      {brand}
                      <button onClick={() => setSelectedBrands(selectedBrands.filter(b => b !== brand))} className="hover:text-amber-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {selectedColors.map(color => (
                    <span key={color} className="inline-flex items-center gap-1 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-medium">
                      {color}
                      <button onClick={() => setSelectedColors(selectedColors.filter(c => c !== color))} className="hover:text-pink-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {sidebarFilters.sizes.map(size => (
                    <span key={size} className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                      Talla {size}
                      <button onClick={() => setSidebarFilters({ ...sidebarFilters, sizes: sidebarFilters.sizes.filter(s => s !== size) })} className="hover:text-green-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {showNew && (
                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">
                      ✨ Nuevo
                      <button onClick={() => setShowNew(false)} className="hover:text-amber-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {showDiscount && (
                    <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                      % Descuentos
                      <button onClick={() => setShowDiscount(false)} className="hover:text-red-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Panel de filtros completo */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-6 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                      {/* Categoría - Multiselección con checkboxes */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Tag className="w-4 h-4 text-gray-600" />
                            Categoría {selectedCategories.length > 0 && `(${selectedCategories.length})`}
                          </label>
                          {selectedCategories.length > 0 && (
                            <button
                              onClick={() => {
                                setSelectedCategories([])
                              }}
                              className="text-xs text-red-600 hover:text-red-700 font-medium"
                            >
                              Limpiar
                            </button>
                          )}
                        </div>
                        <div className="space-y-2">
                          {categories.filter(c => c !== 'Todos').map((cat) => (
                            <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={selectedCategories.includes(cat)}
                                onChange={(e) => {
                                  const params = new URLSearchParams(searchParams?.toString())
                                  if (e.target.checked) {
                                    setSelectedCategories([...selectedCategories, cat])
                                    params.set('filter', cat.toLowerCase())
                                  } else {
                                    setSelectedCategories(selectedCategories.filter(c => c !== cat))
                                    params.delete('filter')
                                  }
                                  router.push(`${pathname}?${params.toString()}#catalogo`, { scroll: false })
                                }}
                                className="w-4 h-4 accent-primary-600 rounded"
                              />
                              <span className="text-sm group-hover:text-gray-900 transition-colors">{cat}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Filtro por Marca - Multiselección */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Building2 className="w-4 h-4 text-gray-600" />
                            Marca {selectedBrands.length > 0 && `(${selectedBrands.length})`}
                          </label>
                          {selectedBrands.length > 0 && (
                            <button
                              onClick={() => setSelectedBrands([])}
                              className="text-xs text-red-600 hover:text-red-700 font-medium"
                            >
                              Limpiar
                            </button>
                          )}
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {brands.filter(b => b !== 'Todas').map((brand) => (
                            <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={selectedBrands.includes(brand)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedBrands([...selectedBrands, brand])
                                  } else {
                                    setSelectedBrands(selectedBrands.filter(b => b !== brand))
                                  }
                                }}
                                className="w-4 h-4 accent-primary-600 rounded"
                              />
                              <span className="text-sm group-hover:text-gray-900 transition-colors">{brand}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Filtro por Color - Multiselección */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Palette className="w-4 h-4 text-gray-600" />
                            Color {selectedColors.length > 0 && `(${selectedColors.length})`}
                          </label>
                          {selectedColors.length > 0 && (
                            <button
                              onClick={() => setSelectedColors([])}
                              className="text-xs text-red-600 hover:text-red-700 font-medium"
                            >
                              Limpiar
                            </button>
                          )}
                        </div>
                        <div className="space-y-2">
                          {colors.filter(c => c !== 'Todos').map((color) => (
                            <label key={color} className="flex items-center gap-2 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={selectedColors.includes(color)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedColors([...selectedColors, color])
                                  } else {
                                    setSelectedColors(selectedColors.filter(c => c !== color))
                                  }
                                }}
                                className="w-4 h-4 accent-primary-600 rounded"
                              />
                              <span className="text-sm group-hover:text-gray-900 transition-colors">{color}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Filtro por Talla - Solo las tallas especificadas */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                          <Ruler className="w-4 h-4 text-gray-600" />
                          Talla
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {sizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => {
                                const newSizes = sidebarFilters.sizes.includes(size)
                                  ? sidebarFilters.sizes.filter(s => s !== size)
                                  : [...sidebarFilters.sizes, size]
                                setSidebarFilters({ ...sidebarFilters, sizes: newSizes })
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all min-w-[40px] ${sidebarFilters.sizes.includes(size)
                                ? 'bg-gray-900 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Filtro por Disponibilidad */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                          <Ruler className="w-4 h-4 text-gray-600" />
                          Disponibilidad
                        </label>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setStockFilter('all')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${stockFilter === 'all'
                              ? 'bg-gray-900 text-white'
                              : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                              }`}
                          >
                            Todos
                          </button>
                          <button
                            onClick={() => setStockFilter('inStock')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${stockFilter === 'inStock'
                              ? 'bg-green-500 text-white'
                              : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300'
                              }`}
                          >
                            En Stock
                          </button>
                          <button
                            onClick={() => setStockFilter('lowStock')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${stockFilter === 'lowStock'
                              ? 'bg-amber-500 text-white'
                              : 'bg-white text-gray-600 border border-gray-200 hover:border-amber-300'
                              }`}
                          >
                            Últimas unidades
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Grid de productos ── */}
          <div>
            {filteredProducts.length === 0 ? (
              /* Estado vacío */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 px-4"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-500 text-center mb-6 max-w-md">
                  No hay productos que coincidan con los filtros seleccionados. Intenta ajustar tus criterios de búsqueda.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <X className="w-4 h-4" />
                  Limpiar todos los filtros
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
                {filteredProducts.slice(0, displayLimit).map((product) => {
                  const stock = getTotalStock(product)
                  const isOutOfStock = stock === 0

                  return (
                    <div
                      key={product.id}
                      className="group bg-white border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-sm cursor-pointer"
                    >
                      {/* Wrapper clickeable para toda la card */}
                      <Link href={`/producto/${product.id}`} className="block">
                        {/* Imagen */}
                        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 p-3">
                          <Image
                            src={product.image_url || '/placeholder.png'}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-contain transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />

                          {/* Badges promocionales */}
                          <ProductBadges
                            isNew={product.is_new}
                            isNewUntil={product.is_new_until}
                            discount={getDiscount(product) || undefined}
                            discountExpiresAt={product.discount_expires_at}
                            isBestSeller={product.is_best_seller}
                            collection={product.collection}
                          />

                          {/* Botón Wishlist */}
                          <WishlistButton
                            productId={product.id}
                            productName={product.name}
                          />

                          {/* AGOTADO overlay */}
                          {isOutOfStock && (
                            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 pointer-events-none">
                              <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                                Agotado
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Info — Zara style */}
                        <div className="px-3 pt-3 pb-2">
                          {/* Brand */}
                          {product.brand && (
                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">
                              {product.brand}
                            </p>
                          )}

                          {/* Nombre */}
                          <h3 className="text-sm text-gray-700 font-normal leading-snug line-clamp-1 mb-1.5 group-hover:text-black transition-colors">
                            {product.name}
                          </h3>

                          {/* Precio */}
                          <div className="flex items-baseline gap-2">
                            {hasDiscount(product) ? (
                              <>
                                <span className="text-sm font-bold text-red-600">
                                  Bs {getPriceWithDiscount(product).toFixed(2)}
                                </span>
                                <span className="text-xs text-gray-400 line-through">
                                  Bs {product.price.toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="text-sm font-bold text-gray-900">
                                Bs {product.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>

                      {/* CTA buttons */}
                      <div className="px-3 pb-3 flex gap-2">
                        <Link
                          href={`/producto/${product.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-all ${isOutOfStock
                            ? 'bg-gray-100 text-gray-400 pointer-events-none'
                            : 'bg-gray-900 hover:bg-black text-white'
                            }`}
                        >
                          {isOutOfStock ? 'Agotado' : 'Ver detalles'}
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleWhatsAppConsult(product)
                          }}
                          className="px-3 py-2 bg-whatsapp hover:bg-whatsapp-dark text-white transition-all"
                          aria-label={`Consultar ${product.name} por WhatsApp`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* ── Botón Cargar Más ── */}
            {filteredProducts.length > 0 && filteredProducts.length > displayLimit && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setDisplayLimit(prev => prev + 12)}
                  className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  Cargar más productos ({filteredProducts.length - displayLimit} restantes)
                </button>
              </div>
            )}

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
                <Plus className="w-4 h-4" />
                Pregunta por más productos
              </a>
            </motion.div>
          </div>
        </motion.div>
      </Container >

    </section >
  )
}
