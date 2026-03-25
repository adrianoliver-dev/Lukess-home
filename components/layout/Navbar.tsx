"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, Search, Heart, ShoppingCart, User, ChevronDown, Package, LogOut, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getActiveCategories } from "@/app/actions/categories";
import Container from "@/components/ui/Container";
import { CartButton } from "@/components/cart/CartButton";
import { CartDrawer } from "@/components/cart/CartDrawer";
import dynamic from "next/dynamic";
import { WishlistIcon } from "@/components/wishlist/WishlistIcon";
import { AuthModal } from "@/components/auth/AuthModal";

const CheckoutModal = dynamic(
  () => import("@/components/cart/CheckoutModal").then((mod) => mod.CheckoutModal),
  { ssr: false }
);
import { useCart } from "@/lib/context/CartContext";
import { useAuth } from "@/lib/context/AuthContext";

// Hardcoded links are removed, fetched dynamically in component

const quickLinks = [
  { href: "/#catalogo", label: "Catálogo" },
  { href: "/#ubicacion", label: "Ubicación" },
  { href: "/#cta", label: "Contacto" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const { cart } = useCart();
  const { isLoggedIn, customerName, signOut } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Dynamic categories state
  const [categories, setCategories] = useState<string[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  const cartItemCount = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  useEffect(() => {
    async function fetchCategories() {
      setIsCategoriesLoading(true);
      try {
        const data = await getActiveCategories();
        if (data && data.length > 0) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setIsCategoriesLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle Stripe Success/Cancel Return
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setIsCheckoutOpen(true);
    } else if (params.get('canceled') === 'true') {
      import('react-hot-toast').then(({ toast }) => {
        toast.error('Pago cancelado. Puedes intentarlo de nuevo.', { position: 'bottom-center' });
      });
      // Clean up URL
      window.history.replaceState({}, '', '/');
    }
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string): void => {
    // Extract hash: works for both /#contacto and /?filter=gorras#catalogo
    const hashIndex = href.indexOf('#');
    const hash = hashIndex !== -1 ? href.slice(hashIndex) : '';

    setIsOpen(false);

    // Specific logic for Contacto link as requested
    if (href === '/#cta') {
      e.preventDefault();
      if (pathname === '/') {
        // If already on homepage, scroll smoothly to the CTA section
        document.getElementById('contacto-cta')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        // If on another page, navigate to homepage then scroll
        router.push('/');
        setTimeout(() => {
          document.getElementById('contacto-cta')?.scrollIntoView({ behavior: 'smooth' });
        }, 500); // Give time for the page to render
      }
      return;
    }

    if (pathname === '/') {
      if (!hash) return;

      e.preventDefault();

      // For filter links, push to update URL first
      if (href.includes('?')) {
        window.history.pushState(null, '', href);
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      }

      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          const y = element.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
    // If not on '/', we don't prevent default, letting Next.js <Link> handle the cross-page navigation natively.
  };

  const handleSearch = (e: React.FormEvent): void => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const searchUrl = `/?busqueda=${encodeURIComponent(searchQuery)}#catalogo`;

      setIsOpen(false);

      if (pathname !== '/') {
        router.push(searchUrl);
      } else {
        router.push(searchUrl);

        setTimeout(() => {
          const element = document.getElementById('catalogo');
          if (element) {
            const navbarHeight = 80;
            const top = element.getBoundingClientRect().top + window.scrollY - navbarHeight;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }, 100);
      }
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav
        className="fixed left-0 right-0 z-50 bg-white border-b border-gray-100"
        style={{ top: 'var(--announcement-height, 0px)' }}
      >
        <Container>
          <div className="flex items-center justify-between h-14 md:h-16 gap-4">
            {/* Logo */}
            <Link
              href="/"
              onClick={(e) => {
                if (window.location.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="flex items-center gap-1.5 shrink-0 hover:opacity-80 transition-opacity"
            >
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900">
                LUKESS
              </span>
              <span className="text-[10px] sm:text-xs font-medium tracking-[0.25em] uppercase text-gray-400">
                HOME
              </span>
            </Link>

            {/* Desktop Category Links */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {/* Categorías Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 uppercase tracking-widest"
                >
                  Categorías
                  <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 bg-white border border-gray-200 shadow-sm py-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {isCategoriesLoading ? (
                    <div className="px-4 py-3 text-sm text-gray-400">Cargando...</div>
                  ) : categories.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-400">Sin categorías</div>
                  ) : (
                    categories.map((cat) => (
                      <a
                        key={cat}
                        href={`/?filter=${cat.toLowerCase()}#catalogo`}
                        onClick={(e) => handleNavClick(e, `/?filter=${cat.toLowerCase()}#catalogo`)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        {cat}
                      </a>
                    ))
                  )}
                </div>
              </div>

              {/* Divider + Quick Links */}
              <div className="h-4 w-px bg-gray-200 mx-2"></div>
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 uppercase tracking-widest"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Desktop Search */}
              <form onSubmit={handleSearch} className="hidden lg:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar..."
                    className="w-44 pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-gray-400 focus:outline-none transition-colors"
                  />
                </div>
              </form>

              {/* Wishlist Icon */}
              <div className="hidden lg:block">
                <WishlistIcon />
              </div>

              {/* Auth Button */}
              <div className="hidden lg:block" ref={userMenuRef}>
                {isLoggedIn ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-1.5 px-2 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <User className="w-5 h-5 text-gray-900" />
                      <span className="max-w-[80px] truncate">{customerName}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-1 w-44 bg-white rounded-md shadow-sm border border-gray-200 z-50 overflow-hidden"
                        >
                          <Link
                            href="/mis-pedidos"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                          >
                            <Package className="w-4 h-4" />
                            Mis Pedidos
                          </Link>
                          <Link
                            href="/wishlist"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                          >
                            <Heart className="w-4 h-4" />
                            Mis Favoritos
                          </Link>
                          <div className="h-px bg-gray-100" />
                          <button
                            onClick={() => { signOut(); setIsUserMenuOpen(false); }}
                            className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Cerrar sesión
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    aria-label="Iniciar sesión"
                  >
                    <User className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Cart Button */}
              <div className="hidden lg:block">
                <CartButton onClick={() => setIsCartOpen(true)} />
              </div>

              {/* Hamburger */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-lg transition-colors text-gray-900 hover:bg-gray-50"
                aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={isOpen ? "close" : "open"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {isOpen ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Menu className="w-5 h-5" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </Container>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden bg-white border-t border-gray-100 max-h-[calc(100vh-80px)] overflow-y-auto"
            >
              <div className="px-6 py-4 space-y-1">
                {/* Mobile search */}
                <div className="mb-4">
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar productos..."
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-sm"
                      />
                    </div>
                  </form>
                </div>

                {isCategoriesLoading ? (
                  <div className="px-3 py-2 text-sm text-gray-400">Cargando categorías...</div>
                ) : (
                  categories.map((cat) => (
                    <a
                      key={cat}
                      href={`/?filter=${cat.toLowerCase()}#catalogo`}
                      onClick={(e) => { handleNavClick(e, `/?filter=${cat.toLowerCase()}#catalogo`); setIsOpen(false); }}
                      className="block py-2.5 px-3 rounded-lg text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      {cat}
                    </a>
                  ))
                )}

                {/* Divider */}
                <div className="h-px bg-gray-100 my-3"></div>

                {/* Quick Links */}
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="flex items-center py-2.5 px-3 rounded-lg text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Divider */}
                <div className="h-px bg-gray-100 my-3"></div>

                {/* Auth button mobile */}
                <div>
                  {isLoggedIn ? (
                    <div className="flex gap-2">
                      <Link
                        href="/mis-pedidos"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm font-semibold transition-colors hover:bg-gray-50"
                      >
                        <Package className="w-4 h-4" />
                        Pedidos
                      </Link>
                      <button
                        onClick={() => { signOut(); setIsOpen(false); }}
                        className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-red-500 py-2.5 rounded-lg text-sm font-semibold transition-colors hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Salir
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setIsAuthModalOpen(true); setIsOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm font-semibold transition-colors hover:bg-gray-50"
                    >
                      <User className="w-4 h-4" />
                      Iniciar sesión / Crear cuenta
                    </button>
                  )}
                </div>

                {/* Wishlist + Cart buttons mobile */}
                <div className="flex gap-2 pt-1">
                  <Link
                    href="/wishlist"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors hover:bg-gray-800"
                  >
                    <Heart className="w-4 h-4" />
                    Favoritos
                  </Link>
                  <button
                    onClick={() => {
                      setIsCartOpen(true);
                      setIsOpen(false);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors hover:bg-gray-800"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Carrito
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Overlay when drawer is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Floating cart button - MOBILE ONLY */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-gray-900 text-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-800 transition-colors active:scale-95"
        aria-label={`Ver carrito (Bs {cartItemCount} productos)`}
      >
        <ShoppingCart className="w-6 h-6" />
        {cartItemCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {cartItemCount > 9 ? '9+' : cartItemCount}
          </span>
        )}
      </button>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode="login"
      />
    </>
  );
}
