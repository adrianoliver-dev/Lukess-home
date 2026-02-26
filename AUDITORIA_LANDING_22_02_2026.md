
# AUDITORÍA LANDING PAGE — LUKESS HOME
**Fecha:** 22 de Febrero de 2026  
**Auditor:** Cursor AI — Solo lectura, sin cambios  
**Archivos auditados:** 10 componentes/páginas principales

---

══════════════════════════════════════════
## SECCIÓN 1 — ESTADO DE COMPONENTES CLAVE
══════════════════════════════════════════

---

### 1.1 `components/cart/CheckoutModal.tsx`

**Qué hace:**  
Modal completo de checkout en 3 pasos: `form` → `qr` → `success`. Maneja datos del cliente, método de entrega (delivery GPS o pickup en tienda), pago por QR Yolo Pago, subida de comprobante y notificaciones post-compra.

**Variables de estado (28 estados):**
- `step: 'form' | 'qr' | 'success'` — paso actual
- `orderId: string` — ID de la orden creada
- `isProcessing: boolean` — indicador de carga al enviar
- `showConfetti: boolean` — activa animación de confeti en éxito
- `isAuthModalOpen: boolean` — controla el modal de auth post-compra
- `showAccountCard / showGoogleBanner: boolean` — visibilidad de banners opcionales
- `selectedPayment: 'qr' | 'libelula'` — método de pago (Libélula = deshabilitado)
- `whatsappMessage: string` — mensaje pre-armado para WA
- `customerData: { name, phone, email, website }` — datos del cliente (website = honeypot anti-bot)
- `marketingConsent / notifyByEmail / notifyByWhatsapp: boolean` — preferencias de notificación
- `emailError: string` — error de validación del email
- `deliveryMethod: 'delivery' | 'pickup'`
- `shippingAddress / shippingReference / pickupLocation: string`
- `shippingAddressError / pickupLocationError: string`
- `locationState: 'initial' | 'gps_loading' | 'gps_denied' | 'map_open' | 'confirmed'`
- `locationSource: 'gps' | 'map' | null`
- `gpsLat / gpsLng / gpsDistanceKm: number | null`
- `mapsLink: string`
- `recipientName / recipientPhone: string`
- `recipientPhoneError: string`
- `deliveryInstructions: string`
- `receiptUploadState: 'idle' | 'uploading' | 'success' | 'error'`
- `receiptFile / receiptPreviewUrl: File | string | null`
- `receiptError: string`
- `showReceiptLightbox: boolean`

**Props:**
- `isOpen: boolean`
- `onClose: () => void`

**Dependencias externas:**
- `useCart` (CartContext) — `cart`, `total`, `clearCart`
- `useAuth` (AuthContext) — `user`, `isLoggedIn`, `customerName`, `signInWithGoogle`
- `trackBeginCheckout`, `trackPurchase` (GA4 analytics)
- `framer-motion` — animaciones de entrada/salida
- `next/dynamic` — carga lazy de `DeliveryMapPicker`
- `lucide-react` — iconos
- `react-hot-toast` — notificaciones
- `AuthModal` — modal de auth embebido
- `PICKUP_LOCATIONS`, `calculateShippingCost`, `getDistanceFromMutualista`, `getMapsLink` (lib/utils/shipping)
- APIs internas: `/api/checkout`, `/api/send-email`, `/api/reserve-order`, `/api/upload-receipt`, `/api/send-whatsapp`

**Observaciones técnicas:**
- El componente tiene 1998 líneas — candidato a refactorizar en subcomponentes
- El `useEffect` de reset al cerrar el modal usa `setTimeout(300ms)` para aguardar la animación de salida antes de limpiar el estado
- El reset al cerrar NO limpia `customerData` (nombre, teléfono, email) — esto puede ser intencional para pre-rellenado en próximas aperturas, pero inconsistente con el resto del reset
- La imagen QR (`/qr-yolo-pago.png`) está hardcodeada con `width={280}` y `height={280}`. En pantallas < 360px puede desbordarse del contenedor con padding `p-6`
- Libélula está implementado visualmente pero deshabilitado (opacity-50, pointer-events-none)

---

### 1.2 `components/layout/Navbar.tsx`

**Qué hace:**  
Navbar fijo con scroll detection, menú desktop con mega-menu (dropdowns por hover), menú mobile (drawer animado), buscador, wishlist, carrito flotante mobile, autenticación y links rápidos.

**Variables de estado:**
- `isOpen: boolean` — menú hamburguesa mobile
- `scrolled: boolean` — detecta scroll > 20px para cambiar apariencia
- `isCartOpen / isCheckoutOpen / isAuthModalOpen: boolean`
- `isUserMenuOpen: boolean` — dropdown de usuario en desktop
- `searchQuery: string`

**Props:** Ninguna (standalone)

**Dependencias externas:**
- `useCart` — `cart` para contador de items
- `useWishlist` — `wishlistCount`
- `useAuth` — `isLoggedIn`, `customerName`, `signOut`
- `usePathname`, `useRouter` (next/navigation) — para lógica de navegación
- `framer-motion` — animaciones del drawer y hamburguesa
- `CartButton`, `CartDrawer`, `CheckoutModal`, `WishlistIcon`, `AuthModal`
- `useRef` para `userMenuRef` (click outside para cerrar dropdown)

**Observaciones técnicas:**
- `handleNavClick` implementa lógica de redirección correcta: si `pathname !== '/'` usa `router.push(href)`, si ya está en home hace scroll manual + dispara `HashChangeEvent` + actualiza `window.history`
- El drawer mobile tiene `max-h-[calc(100vh-80px)] overflow-y-auto` — tiene scroll interno correcto
- El botón flotante de carrito mobile (`fixed bottom-6 right-6`) está implementado correctamente
- La constante `WHATSAPP_URL` está hardcodeada en la línea 18-19

---

### 1.3 `components/layout/Footer.tsx`

**Qué hace:**  
Footer con sección de newsletter, grid 4 columnas (Atención al cliente, Legal, Guías, Contacto), redes sociales y barra inferior con copyright.

**Variables de estado:**
- `email: string` — campo del formulario de newsletter

**Props:** Ninguna

**Dependencias externas:**
- `react-hot-toast` — notificación de suscripción
- `lucide-react` — iconos
- `Link` (next/link)

**Observaciones técnicas:**
- El `handleNewsletterSubmit` solo guarda el email en `localStorage` — NO conecta con Supabase ni ningún servicio real
- El ícono de TikTok usa `<Send />` de lucide (no existe ícono oficial de TikTok en lucide-react) — se muestra una flecha de papel
- Los links del footer (`/como-comprar`, `/metodos-pago`, `/preguntas-frecuentes`, `/guia-tallas`, etc.) apuntan a páginas que existen en el proyecto
- WhatsApp hardcodeado en 2 lugares: líneas 147 y 215

---

### 1.4 `components/home/PromoBanner.tsx`

**Qué hace:**  
Banner rotativo con 3 promociones, auto-avance cada 5 segundos, navegación manual con flechas y puntos indicadores.

**Variables de estado:**
- `current: number` — índice del banner activo (0-2)

**Props:** Ninguna

**Dependencias externas:**
- `framer-motion` — `AnimatePresence` + `motion.div` para transiciones
- `useRouter` — importado pero NO usado (solo `window.history.pushState`)
- `lucide-react` — ChevronLeft, ChevronRight
- `Link` (next/link)

**Observaciones técnicas:**
- Los 3 banners están hardcodeados en el componente. El `handlePromoClick` hace scroll + pushState + dispara `HashChangeEvent` — solo funciona si ya se está en la homepage
- `useRouter` es importado pero nunca se usa — es código muerto
- El área clickeable es solo el botón CTA, no el banner completo (el div de fondo no tiene handler de click)
- Los filtros `descuentos` y `primavera` apuntan a filtros que deben existir en la BD (campo `collection` o campo `discount`)
- El timer se reinicia si el componente se desmonta/remonta (SPA navigation)

---

### 1.5 `components/home/HeroSection.tsx`

**Qué hace:**  
Sección Hero full-screen con imagen de fondo (Unsplash), overlay oscuro con gradiente, título animado, dos CTAs (Ver Catálogo + WhatsApp) e indicadores de confianza.

**Variables de estado:** Ninguna (componente puramente visual)

**Props:** Ninguna

**Dependencias externas:**
- `framer-motion` — `motion.div` con variantes `containerVariants`, `fadeInUp`, `fadeInDown`, `scaleIn`
- `lucide-react` — MessageCircle, ChevronDown, MapPin

**Observaciones técnicas:**
- La imagen de fondo es una URL de Unsplash (`images.unsplash.com`). En producción debería ser una imagen propia servida desde el dominio o CDN
- El botón "Ver Catálogo" usa `<a href="#catalogo">` (ancla nativa), no `handleNavClick` — esto funciona correctamente en la homepage
- El botón "Explorar" (flecha animada al fondo) apunta a `#ubicacion`, no a `#catalogo`
- `WHATSAPP_URL` hardcodeado en línea 8-9

---

### 1.6 `components/home/CatalogoClient.tsx`

**Ruta real:** `components/home/CatalogoClient.tsx` (NO en `components/catalogo/`)

**Qué hace:**  
Catálogo completo con filtros multiselección (categoría, subcategoría, marca, color, talla, stock), búsqueda por texto, ordenamiento (reciente/precio), paginación por "Cargar más" (de 20 en 20), grid responsive de productos y acciones rápidas (añadir al carrito, consultar WhatsApp).

**Variables de estado:**
- `selectedCategories / selectedSubcategories / selectedBrands / selectedColors: string[]`
- `showFilters: boolean` — visibilidad del panel de filtros
- `sidebarFilters: Filters` — precio, tallas, stock, descuento
- `stockFilter: 'all' | 'inStock' | 'lowStock'`
- `showNew / showDiscount: boolean`
- `showCollection: string | null`
- `searchQuery: string`
- `displayLimit: number` — empieza en 20, incrementa de 12 en 12
- `sortOrder: 'recent' | 'price-asc' | 'price-desc'`

**Props:**
- `initialProducts: Product[]` — pasado desde el Server Component `app/page.tsx`

**Dependencias externas:**
- `useCart` — `addToCart`
- `useInView` (react-intersection-observer) — para animar la sección al entrar en viewport
- `framer-motion`
- `FilterSidebar`, `ProductBadges`, `WishlistButton`
- Escucha eventos: `hashchange`, `searchUpdate`, `popstate`, `applyPromoFilter`

**Observaciones técnicas:**
- Tiene un `console.log` de debug en producción (línea 334: `🔍 Filtrando productos...` y línea 111: `📝 Actualizando búsqueda...`)
- El filtrado `filteredProducts` usa `useMemo` con muchas dependencias — correcto para performance
- El `useEffect` que detecta búsqueda desde URL tiene la dependencia `[searchQuery]` comentada/omitida intencionalmente para evitar loop, lo que puede causar stale closures

---

### 1.7 `app/producto/[id]/page.tsx`

**Qué hace:**  
Server Component que obtiene el producto por ID desde Supabase (filtrando `is_active = true` y `published_to_landing = true`), obtiene hasta 4 productos relacionados de la misma categoría y renderiza `ProductDetail`.

**Variables de estado:** Ninguna (Server Component puro)

**Props:**
- `params: Promise<{ id: string }>` — async params de Next.js 16

**Dependencias externas:**
- `createClient` (Supabase server)
- `notFound()` (next/navigation) — si producto no existe o no está publicado
- `ProductDetail` — componente cliente

**Observaciones técnicas:**
- Usa `await params` correctamente para Next.js 16
- El select incluye `inventory(quantity, reserved_qty, location_id, size, locations(name))` — completo
- Los productos relacionados solo usan `inventory(quantity, reserved_qty)` — correcto, no necesitan más
- NO tiene `generateMetadata` — la página de detalle no tiene SEO dinámico (título/descripción del producto)

---

### 1.8 `components/producto/ProductDetail.tsx`

**Qué hace:**  
Componente cliente de detalle de producto: galería de imágenes (con soporte multi-imagen), precio con/sin descuento, selector de talla con stock por talla, selector de color, selector de cantidad, add to cart, consulta WhatsApp, productos relacionados y modal de guía de tallas.

**Variables de estado:**
- `selectedSize / selectedColor: string`
- `quantity: number`
- `isSizeGuideOpen: boolean`

**Props:**
- `product: Product`
- `relatedProducts: Product[]`

**Dependencias externas:**
- `useCart` — `addToCart`
- `trackViewItem` (GA4)
- `framer-motion`
- `ProductGallery`, `SizeGuideModal`
- `FREE_SHIPPING_THRESHOLD` (lib/utils/shipping)

**Observaciones técnicas:**
- `ProductGallery` usa `product.images[]` cuando existe, con fallback a `[product.image_url]` — el campo múltiple está implementado
- Las funciones `getDiscount`, `hasDiscount`, `getPriceWithDiscount`, `getSavings` están duplicadas aquí y en `CatalogoClient.tsx` — candidatas a extraer a `lib/utils/product.ts`
- El umbral de stock bajo es `LOW_STOCK_THRESHOLD = 3` en ProductDetail vs `stock <= 5` en CatalogoClient — **inconsistencia**: en el catálogo se muestra "⚠️ Últimas unidades" para ≤ 5, pero en el detalle el warning bajo-stock de talla es para ≤ 3
- El botón WhatsApp del detalle usa `window.open` (hardcodeado en línea 146)

---

### 1.9 `app/globals.css`

**Qué hace:**  
Define el sistema de diseño completo via `@theme` de Tailwind CSS v4, estilos base, utilidades y configuración de scroll/scrollbar.

**Observaciones técnicas:**
- Tailwind v4 con `@import "tailwindcss"` y configuración via `@theme` — correcto
- `overflow-x: hidden` y `max-width: 100vw` en `body` — mitiga overflow horizontal a nivel global
- `scroll-margin-top: 80px` en `section[id]` y `[id]` — compensa el navbar fijo
- `@media (prefers-reduced-motion: reduce)` implementado correctamente

---

══════════════════════════════════════════
## SECCIÓN 2 — BUGS IDENTIFICADOS
══════════════════════════════════════════

---

### BUG-01: overflow-x en mobile
**Estado: MITIGADO pero con riesgo residual**

`globals.css` aplica `overflow-x: hidden` en `html` y `body`, lo que oculta cualquier desbordamiento. Sin embargo existe un caso real de riesgo:

- **CheckoutModal, step `qr`**: La imagen QR tiene `width={280}` y `height={280}` fijo dentro de un contenedor con `p-6` (24px cada lado). En un teléfono de 320px de ancho:
  - Modal container: `p-4` (16px × 2) = 288px disponibles
  - Contenido: `p-6` (24px × 2) = 240px disponibles
  - Imagen QR: 280px → **DESBORDA 40px**. El `overflow-y-auto` del modal no previene este desbordamiento horizontal.
  - El `overflow-x: hidden` del body lo oculta pero la imagen queda cortada/invisible en ese extremo.

**Recomendación:** Cambiar la imagen QR a `className="w-full max-w-[280px]"` con `width={280}` y `height={280}` como solo hints para Next.js Image.

---

### BUG-02: CheckoutModal — login step en mobile
**Estado: RIESGO MENOR, no texto vertical**

El banner de Google (solo visible cuando `!isLoggedIn && showGoogleBanner`) usa:
```
flex items-center justify-between gap-3 ... px-4 py-3
```
- Texto izquierdo: `text-sm font-medium` + `min-w-0` — puede wrappear (está bien)
- Botón derecho: `whitespace-nowrap text-xs px-3 py-1.5` + `flex-shrink-0`

En pantallas muy pequeñas (< 330px), el layout puede comprimir el texto izquierdo al mínimo pero **NO causa texto vertical**. La palabra "Continuar con Google" siempre permanece en una línea.

**Riesgo real:** En un Samsung Galaxy S5 (360px) o similar, el botón con el logo de Google + "Continuar con Google" en `text-xs` cabe con ~2px de margen. Funciona pero visualmente apretado.

---

### BUG-03: Auto-relleno después de Google login
**Estado: BUG CONFIRMADO — teléfono no se rellena**

En `CheckoutModal.tsx`, líneas 141-150:
```typescript
useEffect(() => {
  if (isLoggedIn && user) {
    setCustomerData((prev) => ({
      ...prev,
      name: prev.name || customerName || '',
      phone: prev.phone || user.user_metadata?.phone || '',
      email: prev.email || user.email || '',
    }))
  }
}, [isLoggedIn, user, customerName])
```

**Problema:** Google OAuth **NO comparte número de teléfono** en los metadatos del usuario. `user.user_metadata?.phone` siempre será `undefined` tras un login con Google. Solo el nombre (via `customerName` del contexto) y el email (via `user.email`) se rellenan correctamente.

**Resultado:** Después de login con Google:
- ✅ Nombre: se rellena desde `customerName` (que viene del `display_name` o `full_name` de Google)
- ✅ Email: se rellena desde `user.email`
- ❌ Teléfono: siempre queda vacío — el usuario debe ingresarlo manualmente

---

### BUG-04: Campos "Quien recibe" — solo primera letra/número
**Estado: BUG CONFIRMADO — ROOT CAUSE IDENTIFICADO**

En `CheckoutModal.tsx`, líneas 135-138:
```typescript
useEffect(() => {
  setRecipientName((prev) => prev || customerData.name)
  setRecipientPhone((prev) => prev || customerData.phone)
}, [customerData.name, customerData.phone])
```

**Cómo ocurre:**
1. El usuario empieza a escribir en "Nombre Completo": escribe "J"
2. `customerData.name` = `"J"` → el efecto dispara → `recipientName` = `"" || "J"` = `"J"` ✅
3. El usuario escribe "u" → `customerData.name` = `"Ju"` → el efecto dispara → `recipientName` = `"J" || "Ju"` → como `"J"` es **truthy**, `recipientName` **permanece `"J"`** ❌

**Resultado:** `recipientName` y `recipientPhone` solo capturan **el primer carácter** escrito en los campos de datos del cliente. El usuario que escribe en "Quien recibe" y lo deja en blanco para que se auto-rellene, verá solo "J" o "7".

**Causa raíz:** La lógica `prev || newValue` es correcta para "no sobreescribir si ya hay un valor", pero falla durante la escritura en tiempo real porque el primer carácter ya setea `prev` a un valor truthy.

**Fix correcto:** El pre-relleno debería hacerse solo cuando el modal abre/el usuario llega a ese paso, no en cada keystroke. O comparar si `prev === ''` en lugar de `!prev`.

---

### BUG-05: Scroll al QR card y confirmación
**Estado: BUG CONFIRMADO — no hay scroll al cambiar de step**

No existe ningún `scrollIntoView`, `window.scrollTo` ni referencia a elementos al hacer `setStep('qr')` o `setStep('success')`.

**El modal tiene:** `max-h-[90vh] overflow-y-auto` en el contenedor blanco.

**Lo que pasa:**
- El usuario llena el formulario largo y probablemente ha scrolleado hacia abajo dentro del modal
- Al hacer click en "Continuar al Pago" y pasar al step `qr`, el contenido cambia pero el **scroll interno del modal permanece en la posición donde estaba** (abajo del formulario)
- El usuario no ve el QR — tiene que subir manualmente
- Lo mismo al pasar a step `success`

**Fix correcto:** Usar un `ref` en el contenedor de contenido (`<div className="p-6">`) y llamar `contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })` al cambiar de step.

---

### BUG-06: "⚠️ Últimas X" duplicado
**Estado: BUG CONFIRMADO — triple aparición posible**

En `components/producto/ProductDetail.tsx` existen **3 lugares** donde aparece el warning de pocas unidades:

**Lugar 1** — Badge de stock general (línea 241-252):
```tsx
{(stock === 0 || stock <= 5) && (
  <span>⚠️ Últimas unidades disponibles</span>
)}
```
Aparece si `stock total <= 5`, sin importar la talla seleccionada.

**Lugar 2** — Bajo cada botón de talla (líneas 317-320):
```tsx
{sizeBaja && (
  <span>⚠️ Últimas {sizeStock}</span>
)}
```
`sizeBaja` = `!sizeAgotada && sizeStock <= LOW_STOCK_THRESHOLD` (umbral = **3**)

**Lugar 3** — Sección de cantidad (líneas 381-390):
```tsx
{needsSize && selectedSize && selectedSizeStock <= 3 && (
  <p>⚠️ Últimas {selectedSizeStock} en talla {selectedSize}</p>
)}
{!needsSize && stock <= 5 && (
  <p>⚠️ Últimas unidades disponibles</p>
)}
```

**Escenario de triplicación:** Producto con tallas, `stock total = 4` (suma de todas las tallas), y una talla con `sizeStock = 2`:
- Lugar 1 muestra: "⚠️ Últimas unidades disponibles" (stock <= 5) ✓
- Lugar 2 muestra: "⚠️ Últimas 2" bajo ese botón de talla (sizeStock <= 3) ✓
- Si el usuario selecciona esa talla → Lugar 3 muestra: "⚠️ Últimas 2 en talla M" ✓

**Resultado:** 3 warnings simultáneos. El Lugar 1 es el más redundante dado que los otros dos son más específicos.

**Inconsistencia de umbrales:** Lugar 1 y Lugar 3 (sin talla) usan umbral `<= 5`, pero Lugar 2 y Lugar 3 (con talla) usan `LOW_STOCK_THRESHOLD = 3`.

---

### BUG-07: Navbar links desde páginas internas
**Estado: IMPLEMENTADO CORRECTAMENTE**

En `handleNavClick` (Navbar.tsx, líneas 112-144):
```typescript
if (pathname !== '/') {
  setIsOpen(false);
  router.push(href); // href = '/#catalogo?filter=camisas'
} else {
  // scroll manual + hashchange event
}
```

Cuando se está en `/producto/[id]` y se hace click en "CAMISAS", llama a `router.push('/#catalogo?filter=camisas')`. Esto navega a la home con el hash correcto y `CatalogoClient.tsx` detecta el `hashchange` event para aplicar el filtro.

**No hay bug aquí.** La lógica está correctamente implementada. Los links funcionan desde cualquier página interna.

---

══════════════════════════════════════════
## SECCIÓN 3 — ESTADO DE FEATURES
══════════════════════════════════════════

---

### F-01: Newsletter popup/sección
**Estado: EXISTE pero es 100% visual — NO guarda en Supabase**

- **NewsletterPopup** (`components/marketing/NewsletterPopup.tsx`): Modal que aparece después de 10 segundos, solo la primera vez (guarda flag en `localStorage`). Al suscribirse, guarda el email en `localStorage.setItem('newsletter-email', email)` y muestra un toast de éxito. **NO hace ninguna llamada a Supabase ni API de email.**

- **Sección Newsletter en Footer** (`components/layout/Footer.tsx`): Formulario estático en el footer. Al enviar, también guarda en `localStorage` y muestra toast. **Misma no-funcionalidad.**

**Datos que se "pierden":** Cualquier email ingresado en el popup o footer solo existe en el localStorage del cliente. No hay tabla `newsletter_subscribers` en Supabase ni integración con Resend/Mailchimp.

---

### F-02: Countdown timer
**Estado: FUNCIONAL pero se reinicia en cada recarga**

- Existe `components/marketing/CountdownTimer.tsx` y está usado en `app/page.tsx`
- La fecha objetivo se calcula en el **Server Component** de la página:
  ```typescript
  const countdownDate = new Date()
  countdownDate.setDate(countdownDate.getDate() + 3)
  ```
- **Problema:** Cada vez que el usuario recarga la página, el servidor recalcula `countdownDate = ahora + 3 días`. El contador siempre muestra "3 días", nunca termina.
- El mensaje actual es `"Cyber Week termina en"` — nombre de campaña hardcodeado en `app/page.tsx`
- **Para una fecha fija real**, `countdownDate` debería ser `new Date('2026-02-28T23:59:59')` o similar, no una fecha dinámica.

---

### F-03: Banner rotativo (PromoBanner.tsx)
**Estado: FUNCIONAL — 3 banners, solo botón es clickeable**

- **Cantidad:** 3 banners hardcodeados
  1. "20% OFF" → filtro `descuentos` → fondo rojo gradiente
  2. "Nueva Colección Primavera" → filtro `primavera` → fondo verde
  3. "Envío Gratis (≥ Bs 300)" → scroll a `#contacto` → fondo verde oscuro
- **Auto-rotación:** cada 5000ms via `setInterval`
- **Clickeable:** Solo el botón CTA (`<Link>` con `handlePromoClick`) — el área del banner NO es clickeable
- **Comportamiento:** `handlePromoClick` hace scroll al elemento + `pushState` + `HashChangeEvent` — solo funciona si ya está en la homepage
- **Falla en producción:** El banner de "20% OFF" filtra por `filter=descuentos` pero el `CatalogoClient` también acepta `filter=descuento` (sin 's'). El banner usa la versión con 's' que está correctamente manejada en `CatalogoClient.tsx` línea 198
- **`useRouter`** es importado pero **nunca usado** — código muerto

---

### F-04: Badges en product cards
**Estado: COMPLETAMENTE IMPLEMENTADO**

`components/catalogo/ProductBadges.tsx` muestra (en orden de prioridad visual):

| Badge | Posición | Condición | Estilo |
|-------|----------|-----------|--------|
| `NUEVO` | Abajo-izquierda, círculo animado | `product.is_new === true` | Gradiente amber-naranja-rojo, `animate-pulse` |
| `PRIMAVERA` | Arriba-izquierda | `product.collection === 'primavera' && !isNew` | Gradiente verde |
| `-X%` | Arriba-izquierda | `discount > 0` | Rojo con icono Percent |
| `MÁS VENDIDO` | Arriba-izquierda | `product.is_best_seller === true` | Negro primario con TrendingUp |

Y en el grid de cards (`CatalogoClient.tsx`):
- `AGOTADO` overlay negro/rojo cuando `stock === 0`
- `⚠️ Últimas unidades` pill ámbar cuando `stock <= 5`

**Total: 6 tipos de badge distintos.**

---

### F-05: Número de WhatsApp hardcodeado
**Ocurrencias en archivos de CÓDIGO (componentes y páginas):**

| # | Archivo | Línea(s) | Contexto |
|---|---------|----------|----------|
| 1 | `components/layout/Navbar.tsx` | 19 | Constante `WHATSAPP_URL` |
| 2 | `components/layout/Footer.tsx` | 147, 215 | Link contacto + barra inferior |
| 3 | `components/home/HeroSection.tsx` | 9 | Constante `WHATSAPP_URL` |
| 4 | `components/home/CatalogoClient.tsx` | 495, 1289 | Consulta producto + CTA inferior |
| 5 | `components/home/CTAFinalSection.tsx` | 10 | Constante `WHATSAPP_URL` |
| 6 | `components/home/UbicacionSection.tsx` | 11, 159 | Constante + teléfono |
| 7 | `components/home/CatalogoSection.tsx` | 25, 324 | (componente legacy) |
| 8 | `components/cart/CheckoutModal.tsx` | 265, 1863 | Out-of-range WA + success step |
| 9 | `components/producto/ProductDetail.tsx` | 146 | Consulta producto |
| 10 | `components/producto/SizeGuideModal.tsx` | 60 | Consulta tallas |
| 11 | `components/wishlist/WishlistClient.tsx` | 99 | Consulta wishlist |
| 12 | `app/mis-pedidos/page.tsx` | 290, 385 | Consulta pedido + CTA |
| 13 | `app/api/send-email/route.ts` | 201, 538 | Template HTML email |
| 14 | `app/preguntas-frecuentes/page.tsx` | 91 | CTA |
| 15 | `app/como-comprar/page.tsx` | 46, 89 | Texto + CTA |
| 16 | `app/guia-tallas/page.tsx` | 126 | CTA |
| 17 | `app/privacidad/page.tsx` | 62-63 | Texto |
| 18 | `app/politicas-cambio/page.tsx` | 54, 92 | Texto + CTA |
| 19 | `app/politicas-envio/page.tsx` | 87-88 | CTA |
| 20 | `app/terminos/page.tsx` | 110 | Texto |

**Total: ~30 apariciones en 20 archivos de código fuente.**

`NEXT_PUBLIC_WHATSAPP_NUMBER=59176020369` está en `.env.local` pero **no se usa en los componentes** — cada uno tiene el número hardcodeado directamente.

---

### F-06: Campo `images[]` en productos
**Estado: IMPLEMENTADO Y EN USO**

`ProductDetail.tsx` (líneas 177-183):
```typescript
<ProductGallery 
  images={product.images && product.images.length > 0 
    ? product.images 
    : [product.image_url || '/placeholder.png']
  }
  productName={product.name}
/>
```

`ProductGallery.tsx` existe en `components/producto/ProductGallery.tsx` y recibe el array `images[]`.

**En el catálogo (grid de products)**, solo se usa `product.image_url` — la galería múltiple es exclusiva de la página de detalle `/producto/[id]`.

---

### F-07: Guía de tallas
**Estado: INCOMPLETA — faltan gorras y cinturones**

`SizeGuideModal.tsx` tiene exactamente **2 tabs de tallas**:

| Tab | Tallas | Medidas |
|-----|--------|---------|
| Camisas / Polos | S, M, L, XL | Pecho, cintura, hombros, largo |
| Pantalones | 38, 40, 42, 44 | Cintura, cadera, largo, entrepierna |
| Cómo Medir | — | Guía de medición (sin tabla) |

**Faltantes confirmados:**
- ❌ **Gorras**: No hay tabla de tallas (S/M, M/L, L/XL o talla única)
- ❌ **Cinturones**: No hay guía (talla = largo del cinturón o cintura del usuario)
- ❌ **Billeteras/Accesorios**: No necesitan guía, pero podría mencionarse que son talla única

El modal se activa correctamente desde el botón "Guía de tallas" en `ProductDetail.tsx` y pre-selecciona el tab correcto según la categoría del producto.

---

══════════════════════════════════════════
## SECCIÓN 4 — PALETA DE COLORES ACTUAL
══════════════════════════════════════════

**Definidas en `app/globals.css` via `@theme` de Tailwind CSS v4:**

### Escala Primary (Negro — Masculino)
| Token | Valor | Uso |
|-------|-------|-----|
| `--color-primary-50` | `#f5f5f5` | Fondos suaves |
| `--color-primary-100` | `#e5e5e5` | Bordes claros |
| `--color-primary-200` | `#cccccc` | — |
| `--color-primary-300` | `#b3b3b3` | — |
| `--color-primary-400` | `#666666` | Iconos secundarios |
| `--color-primary-500` | `#333333` | Negro principal |
| `--color-primary-600` | `#1a1a1a` | Botones, precios |
| `--color-primary-700` | `#0d0d0d` | Hover oscuro |
| `--color-primary-800` | `#000000` | Negro puro |
| `--color-primary-900` | `#000000` | (igual a 800) |

### Escala Secondary (Gris)
| Token | Valor |
|-------|-------|
| `--color-secondary-500` | `#4a4a4a` |
| `--color-secondary-800` | `#1f1f1f` |
| `--color-secondary-900` | `#141414` |
| (otros intermedios) | graduación de gris |

### Escala Accent (Dorado — Signature)
| Token | Valor | Uso |
|-------|-------|-----|
| `--color-accent-400` | `#d4a574` | Dorado claro, decoraciones |
| `--color-accent-500` | `#c89b6e` | **Dorado principal** (CTA secundario, bordes premium) |
| `--color-accent-600` | `#8b7355` | Footer newsletter bg |
| `--color-accent-700` | `#6e5c44` | — |

### Colores funcionales
| Token | Valor | Uso |
|-------|-------|-----|
| `--color-success-600` | `#2e7d32` | — |
| `--color-success-700` | `#1b5e20` | — |
| `--color-whatsapp` | `#25d366` | Botones WhatsApp |
| `--color-whatsapp-dark` | `#1da851` | Hover WhatsApp |

### Consistencia de uso
**Dispersión ALTA:** Los componentes mezclan tokens del sistema con valores hex hardcodeados:
- `bg-[#c89b6e]` — hardcodeado en CheckoutModal, ProductDetail, Navbar (en lugar de `bg-accent-500`)
- `bg-[#fdf8f3]` — hardcodeado en múltiples lugares (el valor debería mapearse a `bg-accent-50`)
- `bg-[#25d366]` y `bg-[#1fb855]` — hardcodeados en varios componentes (en lugar de `bg-whatsapp`)
- `bg-[#111]` y `border-[#333]` — usados en el panel de preferencias de notificación del checkout
- `bg-[#D4AF37]` — color dorado distinto al del design system (`#c89b6e`) usado en los checkboxes del checkout

**Conclusión:** Hay al menos 3 valores de "dorado" distintos en uso:
- `#c89b6e` (accent-500 — el oficial)
- `#d4a574` (accent-400)
- `#D4AF37` (nuevo dorado más brillante, solo en CheckoutModal)

---

══════════════════════════════════════════
## SECCIÓN 5 — RESPONSIVE/MOBILE
══════════════════════════════════════════

### Componentes con responsive bien definido ✅

| Componente | Clases responsive usadas |
|------------|--------------------------|
| `Navbar.tsx` | `lg:hidden`, `lg:flex`, `lg:block`, `h-[72px] md:h-20`, `hidden md:inline`, `sm:text-2xl md:text-[28px]` |
| `HeroSection.tsx` | `sm:px-6 lg:px-8`, `text-4xl sm:text-5xl md:text-7xl`, `flex-col sm:flex-row`, `sm:text-lg md:text-xl` |
| `PromoBanner.tsx` | `h-[400px] md:h-[500px]`, `text-4xl md:text-6xl`, `text-xl md:text-2xl` |
| `CatalogoClient.tsx` | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`, `px-4 sm:px-5`, `text-sm sm:text-base` |
| `Footer.tsx` | `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`, `flex-col md:flex-row`, `flex-col sm:flex-row` |
| `CheckoutModal.tsx` | `max-w-lg w-full`, `max-h-[90vh] overflow-y-auto`, `grid grid-cols-2` (delivery buttons) |

### Elementos con riesgo en mobile ⚠️

| Componente | Elemento problemático | Riesgo |
|------------|-----------------------|--------|
| `CheckoutModal.tsx` | `<Image width={280} height={280}>` (QR) | Desbordamiento en pantallas < 360px |
| `CheckoutModal.tsx` | `grid grid-cols-2` en sección de métodos de pago | En 320px, columnas de ~140px — ajustado pero funcional |
| `SizeGuideModal.tsx` | Tabla con 5 columnas + `overflow-x-auto` | Correcto — tiene scroll horizontal en la tabla |
| `ProductDetail.tsx` | `grid lg:grid-cols-2` — en mobile es 1 columna | Correcto |
| `HeroSection.tsx` | `w-64 h-64` y `w-80 h-80` (partículas blur) | Decorativo, `pointer-events-none`, no causa scroll |
| `CatalogoClient.tsx` | Panel de filtros con `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` | Correcto — colapsa a 1 columna en mobile |

### Navbar mobile
El drawer mobile tiene:
- `max-h-[calc(100vh-80px)]` — altura máxima correcta
- `overflow-y-auto` — scroll interno habilitado ✅
- No desborda — el overlay `fixed inset-0` cierra el menú al hacer click fuera ✅
- El botón carrito flotante `fixed bottom-6 right-6` puede solaparse con el botón flotante de WhatsApp si ambos están visibles simultáneamente (no hay WhatsApp flotante, está en el navbar, así que no hay conflicto)

---

══════════════════════════════════════════
## SECCIÓN 6 — DEPENDENCIAS Y VERSIONES
══════════════════════════════════════════

### Dependencies (producción)

| Paquete | Versión |
|---------|---------|
| `next` | ^16.1.6 |
| `react` | ^19.2.4 |
| `react-dom` | ^19.2.4 |
| `@supabase/supabase-js` | ^2.95.3 |
| `@supabase/ssr` | ^0.8.0 |
| `framer-motion` | **^12.33.0** |
| `lucide-react` | ^0.563.0 |
| `react-hot-toast` | ^2.6.0 |
| `react-intersection-observer` | ^10.0.2 |
| `leaflet` | ^1.9.4 |
| `react-leaflet` | ^5.0.0 |
| `@types/leaflet` | ^1.9.21 |
| `resend` | ^6.9.2 |
| `@next/third-parties` | **^16.1.6** |

### devDependencies

| Paquete | Versión |
|---------|---------|
| `tailwindcss` | ^4.1.18 |
| `@tailwindcss/postcss` | ^4.1.18 |
| `typescript` | ^5.9.3 |
| `@types/react` | ^19.2.13 |
| `@types/react-dom` | ^19.2.3 |
| `@types/node` | ^25.2.1 |
| `eslint` | ^9.39.2 |
| `eslint-config-next` | ^16.1.6 |
| `postcss` | ^8.5.6 |

### Paquetes específicamente solicitados

| Paquete | Versión | Observación |
|---------|---------|-------------|
| `framer-motion` | ^12.33.0 | Versión muy reciente (v12) — compatible con React 19 |
| `recharts` | **NO INSTALADO** | No figura en package.json |
| `date-fns` | **NO INSTALADO** | No figura en package.json |
| `@next/third-parties` | ^16.1.6 | Instalado (para Google Analytics) |

### Observaciones sobre dependencias
- **`recharts` y `date-fns` no están instalados** — si se planea agregar gráficas de ventas o formateo de fechas avanzado, se necesitarán instalar
- `framer-motion v12` es la más reciente y tiene breaking changes respecto a v10/v11 — en particular la API de `useAnimation` y algunos hooks cambió
- `react-leaflet v5` es compatible con React 19 y Next.js 16
- `resend ^6.9.2` es la versión más reciente — correcta para las plantillas HTML de email implementadas

---

## RESUMEN EJECUTIVO

| Categoría | Estado | Prioridad de fix |
|-----------|--------|-----------------|
| BUG-04: Pre-relleno "Quien recibe" | 🔴 Confirmado | Alta |
| BUG-05: Sin scroll al cambiar step | 🔴 Confirmado | Alta |
| BUG-06: Triple warning "⚠️ Últimas X" | 🟡 Confirmado | Media |
| BUG-03: Teléfono no se rellena tras Google login | 🟡 Confirmado (limitación OAuth) | Media |
| BUG-01: QR desborda en < 360px | 🟡 Riesgo real, mitigado por CSS | Media |
| BUG-02: Google banner en mobile | 🟢 No crítico | Baja |
| BUG-07: Navbar links internos | ✅ Funciona bien | — |
| F-01: Newsletter no persiste datos | 🔴 No funcional | Alta |
| F-02: Countdown se reinicia | 🟡 Diseño débil | Media |
| F-07: Guía de tallas incompleta | 🟡 Falta gorras/cinturones | Media |
| F-05: WhatsApp hardcodeado x30 | 🟡 Mantenibilidad | Baja |
| Colores dispersos en componentes | 🟡 Inconsistencia | Baja |

---
*Auditoría generada el 22/02/2026. No se realizaron cambios al código.*
