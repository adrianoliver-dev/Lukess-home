# AUDITORÍA COMPLETA — Lukess Home E-commerce
> **Fecha de auditoría:** 2026-03-18  
> **Repositorio:** https://github.com/adrianoliver-dev/Lukess-home  
> **Deploy activo:** https://lukess-home.vercel.app  
> **Auditor:** Antigravity (AI Coding Agent)  
> **Estado del proyecto:** Feature-Complete · Production-Ready (Block 17-N, 2026-03-07)  
> **Relación con Inventory System:** Comparte la misma base de datos Supabase (`lrcggpdgrqltqbxqnjgh`, sa-east-1). El admin POS del Inventory System gestiona los pedidos que genera esta landing e-commerce.

---

## 1. VISIÓN GENERAL

**Lukess Home** es la tienda online de una marca de ropa masculina radicada en el Mercado Mutualista de Santa Cruz de la Sierra, Bolivia. Más de 10 años de trayectoria en venta física, con 3 puestos presenciales, ahora digitalizados mediante este ecosistema de dos aplicaciones:

| App | Propósito | URL |
|---|---|---|
| **Lukess Home (este repo)** | E-commerce público. Catálogo, carrito, checkout, pagos | lukess-home.vercel.app |
| **Lukess Inventory System** | Panel admin POS interno. Gestión de pedidos, inventario, banners | lukess-inventory-system.vercel.app |

**Diferenciadores frente a Shopify / WooCommerce:**
- **Sin comisiones de plataforma.** Costos reducidos al máximo: Supabase (gratis en free tier), Vercel (hobby gratuito), Resend (100 emails/día gratis).
- **Control total del stack.** TypeScript estricto, Next.js App Router nativo, sin abstracciones de terceros.
- **Integración WhatsApp nativa.** Notificaciones automáticas vía Meta Business API para el flujo boliviano (QR/transferencia bancaria), donde el WhatsApp sustituye al email como canal principal.
- **Checkout sin fricción.** No requiere cuenta de usuario. Los clientes pueden hacer guest checkout con solo nombre y teléfono.
- **Inventario en tiempo real.** El stock mostrado en la landing es el mismo del sistema admin. Las reservas de inventario se crean automáticamente via RPC de Supabase al confirmar el pago.
- **CMS de banners integrado.** Los banners del hero se gestionan desde el Inventory System y se muestran en tiempo real en la landing.
- **Sistema de descuentos personalizado.** Códigos de descuento con validación de email, límite de uso, tipo (porcentaje/fijo) y expiración.
- **Blog SEO.** Sistema de artículos estáticos en Markdown con 5+ posts optimizados para posicionamiento local en Bolivia.

**Relación con el Inventory System (mismo Supabase):**
```
landing (lukess-home)          inventory (lukess-inventory-system)
       │                                      │
       ├── Lee: products, categories          ├── Escribe: products, inventory
       ├── Lee: banners (CMS)                 ├── Gestiona: orders, order_items
       ├── Lee: discount_codes                ├── Actualiza: order status
       ├── Escribe: orders (checkout)         ├── Lee: orders de la landing
       ├── Escribe: customers                 ├── Envía emails de estado via landing API
       ├── Escribe: subscribers               └── Llama /api/send-email y /api/send-whatsapp
       └── Llama RPCs: reserve_order_inventory,     de la landing (CORS abierto)
                       consume_order_discount
```

---

## 2. STACK TECNOLÓGICO COMPLETO

### Dependencias de `package.json` (1.377 KB)

| Paquete | Versión | Uso específico |
|---|---|---|
| `next` | ^16.1.6 | Framework React fullstack. App Router, Server Components, API Routes |
| `react` | ^19.2.4 | UI library. React 19 con Server Components nativos |
| `react-dom` | ^19.2.4 | Renderer para el DOM |
| `@supabase/supabase-js` | ^2.99.1 | SDK de Supabase (JS). Queries, Auth, Storage, RPC |
| `@supabase/ssr` | ^0.8.0 | Adaptadores SSR para Next.js. Maneja cookies en Server/Client components |
| `stripe` | ^20.4.1 | SDK de Stripe. Creación de Checkout Sessions y verificación de webhooks |
| `resend` | ^6.9.2 | SDK de Resend para envío de emails transaccionales |
| `framer-motion` | ^12.34.3 | Animaciones complejas (scroll-driven, layout, gestures) |
| `motion` | ^12.34.3 | Alias ligero de framer-motion. Alias preferido en el proyecto |
| `tailwindcss-motion` | ^1.1.1 | Plugin CSS para micro-interacciones y utilities de animación |
| `lucide-react` | ^0.563.0 | Iconografía. Icons SVG como componentes React |
| `react-hot-toast` | ^2.6.0 | Notificaciones toast UI (éxito, error, loading) |
| `react-intersection-observer` | ^10.0.2 | Hook para detectar visibilidad de elementos (lazy loading, reveal) |
| `leaflet` | ^1.9.4 | Mapas interactivos. Usado en ubicación de tienda y mapa de entrega |
| `react-leaflet` | ^5.0.0 | Wrapper React para Leaflet |
| `@types/leaflet` | ^1.9.21 | Tipos TypeScript para Leaflet |
| `gray-matter` | ^4.0.3 | Parser de frontmatter YAML para el sistema de blog en Markdown |
| `remark` | ^15.0.1 | Procesador de Markdown → HTML para el blog |
| `remark-html` | ^16.0.1 | Plugin Remark para output HTML |
| `@next/third-parties` | ^16.1.6 | GoogleAnalytics component optimizado para Next.js |
| `@vercel/analytics` | ^1.6.1 | Vercel Web Analytics. Tracking de eventos custom |

### DevDependencies

| Paquete | Versión | Uso |
|---|---|---|
| `tailwindcss` | ^4.1.18 | CSS framework v4 (configuración via `@theme` en CSS, sin tailwind.config.js) |
| `@tailwindcss/postcss` | ^4.1.18 | PostCSS plugin para Tailwind v4 |
| `@tailwindcss/typography` | ^0.5.19 | Plugin para estilos tipográficos en el blog (`.prose`) |
| `typescript` | ^5.9.3 | Typechecking estricto (`strict: true` en tsconfig) |
| `@types/node` / `react` / `react-dom` | ^25/19/19 | Tipos TypeScript |
| `eslint` + `eslint-config-next` | ^9/16 | Linting |
| `postcss` | ^8.5.6 | Procesador CSS necesario para Tailwind v4 |

---

## 3. ARQUITECTURA Y ESTRUCTURA DE CARPETAS

### Árbol de directorios (con tamaños de archivos clave)

```
lukess-landing-ecommerce/
├── app/                          # Next.js App Router (root)
│   ├── layout.tsx                  4,754 B — Root layout: Navbar, Footer, Providers, GA, Clarity
│   ├── page.tsx                    3,195 B — Homepage: SSR query de productos + filtros
│   ├── globals.css                 3,769 B — Design system: @theme, animaciones keyframes
│   ├── loading.tsx                 2,203 B — Loading state global
│   ├── robots.ts                     302 B — robots.txt dinámico
│   ├── sitemap.ts                  1,390 B — Sitemap XML dinámico
│   ├── actions/                    # Server Actions
│   │   ├── categories.ts           1,176 B — getActiveCategories() → Supabase
│   │   └── filters.ts              1,393 B — getDynamicFilters() → colores, tallas disponibles
│   ├── api/                        # Route Handlers (API REST)
│   │   ├── checkout/route.ts      14,588 B — ★ Checkout principal: pedido + Stripe + WhatsApp
│   │   ├── send-email/route.ts    35,574 B — ★ 10 tipos de email con Resend
│   │   ├── send-whatsapp/route.ts    924 B — Proxy para Meta WhatsApp API
│   │   ├── subscribe/route.ts      3,575 B — Suscripción newsletter + welcome discount
│   │   ├── upload-receipt/route.ts 2,392 B — Subida de comprobante a Supabase Storage
│   │   ├── reserve-order/route.ts  1,126 B — Trigger RPC reserve_order_inventory
│   │   └── webhooks/stripe/route.ts 3,159 B — Webhook Stripe: confirma pago + WhatsApp
│   ├── auth/                       # Autenticación cliente
│   │   └── page.tsx               — Login/signup con Supabase Auth
│   ├── blog/                       # Blog SEO
│   │   ├── page.tsx               — Lista de artículos
│   │   └── [slug]/page.tsx        — Artículo individual (MDX/Markdown)
│   ├── producto/
│   │   └── [id]/page.tsx          — Página de detalle de producto (SSR)
│   ├── mis-pedidos/page.tsx        — Historial de pedidos del cliente
│   ├── wishlist/page.tsx           — Lista de deseos
│   ├── como-comprar/page.tsx       — Guía de compra
│   ├── guia-tallas/page.tsx        — Guía de tallas
│   ├── preguntas-frecuentes/page.tsx — FAQ
│   ├── sobre-nosotros/page.tsx     — About page
│   ├── metodos-pago/page.tsx       — Métodos de pago
│   ├── plazos-entrega/page.tsx     — Información de plazos
│   ├── politicas-envio/page.tsx    — Política de envío
│   ├── politicas-cambio/page.tsx   — Política de cambios
│   ├── garantia-autenticidad/page.tsx — Garantía de productos
│   ├── cuidado-prendas/page.tsx    — Cuidado de prendas
│   ├── terminos/page.tsx           — Términos y condiciones
│   └── privacidad/page.tsx         — Política de privacidad
│
├── components/                   # Componentes UI organizados por dominio
│   ├── cart/
│   │   ├── CartButton.tsx            787 B — Botón flotante con badge de items
│   │   ├── CartDrawer.tsx          8,909 B — Drawer lateral del carrito
│   │   ├── CheckoutModal.tsx     130,114 B — ★ Modal checkout multi-step (archivo más grande)
│   │   ├── DeliveryMapPicker.tsx   2,131 B — Picker de entrega con mapa Leaflet
│   │   ├── CHECKOUT_README.md      7,778 B — Documentación del módulo checkout
│   │   └── README.md               5,677 B — Documentación del módulo cart
│   ├── catalogo/                  — Grilla de productos, filtros, badges
│   ├── emails/                    — Componentes React Email (si existen)
│   ├── home/                      — CatalogoClient, UbicacionSection, CTAFinalSection
│   ├── landing/                   — HeroBanner (CMS), TrustBanner
│   ├── layout/                    — Navbar, Footer, HashScrollHandler
│   ├── legal/                     — Componentes de páginas legales
│   ├── marketing/                 — NewsletterPopup, FooterNewsletter
│   ├── producto/                  — ProductDetail, ImageGallery, SizeSelector
│   ├── search/                    — SearchBar, SearchResults
│   ├── ui/                        — Container, Badge, Skeleton y primitivos
│   ├── auth/                      — LoginForm, SignupForm
│   ├── analytics/                 — MicrosoftClarity (script injector)
│   └── wishlist/                  — WishlistButton, WishlistGrid
│
├── lib/                          # Lógica de negocio, servicios, utilidades
│   ├── types.ts                    2,255 B — ★ Interfaces Product, CartItem, Order
│   ├── products.ts                 5,955 B — Catálogo estático legacy (11 productos)
│   ├── analytics.ts                4,028 B — GA4 + Vercel Analytics event wrappers
│   ├── banners.ts                  1,005 B — getActiveBanners() SSR query
│   ├── blog.ts                     2,914 B — Markdown blog: getPosts, getPost
│   ├── stripe.ts                     390 B — Inicialización cliente Stripe
│   ├── context/
│   │   ├── CartContext.tsx          4,802 B — ★ React Context del carrito (localStorage)
│   │   ├── WishlistContext.tsx      4,382 B — React Context de wishlist
│   │   ├── AuthContext.tsx          2,067 B — React Context de autenticación
│   │   └── README.md               7,520 B — Documentación de contexts
│   ├── supabase/
│   │   ├── server.ts               — createClient() SSR (server-side)
│   │   ├── client.ts               — createBrowserClient() (client-side)
│   │   └── discounts.ts            — generateWelcomeDiscount() RPC/insert
│   ├── whatsapp/
│   │   ├── send-message.ts         — Llamada a Meta WhatsApp Cloud API
│   │   └── template-router.ts      — Selección de template por estado de pedido
│   ├── utils/
│   │   ├── price.ts                — getPriceWithDiscount(), formatPrice()
│   │   ├── whatsapp.ts             — WHATSAPP_NUMBER constante
│   │   └── cn.ts                   — clsx/tailwind-merge utility
│   ├── services/                   — Servicios adicionales
│   ├── hooks/                      — Custom hooks React
│   └── constants/                  — Constantes de la app
│
├── types/
│   └── database.types.ts           — Tipos autogenerados de Supabase (regenerar tras migraciones)
│
├── supabase/
│   ├── migrations/
│   │   ├── 03b_wishlist_sync.sql     887 B
│   │   ├── 03d_shipping_fields.sql 1,336 B
│   │   └── block_17_a_3_2_expire_pickup_reservations.sql 2,830 B
│   ├── add-discount-new-fields.sql 1,929 B
│   ├── schema-orders.sql           1,821 B
│   ├── README.md                   2,686 B
│   └── functions/                  — Edge Functions (si existen)
│
├── content/                      — Contenido Markdown del blog
├── public/                       — Assets estáticos (imágenes de productos, og-image.png)
├── meta/                         — Documentación del proyecto (activeContext.md, este archivo)
├── docs/                         — Documentación técnica adicional
├── hooks/                        — Custom hooks adicionales (raíz)
├── scripts/                      — Scripts de seed y utilidades
└── vercel.json                     491 B — Configuración Vercel (rewrites, headers)
```

### Separación Server vs. Client Components

| Archivo | Tipo | Razón |
|---|---|---|
| `app/page.tsx` | **Server Component** | Query Supabase directa, sin estado interactivo |
| `app/producto/[id]/page.tsx` | **Server Component** | Fetch de producto por ID, metadata dinámica |
| `lib/banners.ts` | **Función Server** | `createClient()` del SSR, sin hooks React |
| `app/actions/*.ts` | **Server Actions** | `"use server"` implícito, acceso a Supabase SSR |
| `lib/context/CartContext.tsx` | **`'use client'`** | Estado React, localStorage, useEffect |
| `lib/context/WishlistContext.tsx` | **`'use client'`** | Estado React, localStorage |
| `lib/context/AuthContext.tsx` | **`'use client'`** | Supabase Auth listener, onAuthStateChange |
| `components/cart/CartDrawer.tsx` | **`'use client'`** | Animaciones, estado abierto/cerrado |
| `components/cart/CheckoutModal.tsx` | **`'use client'`** | Formulario multi-step, 130KB |
| `components/marketing/NewsletterPopup.tsx` | **`'use client'`** | Popup con timer, estado de visibilidad |
| `components/analytics/MicrosoftClarity.tsx` | **`'use client'`** | Script injection |
| `components/home/CatalogoClient.tsx` | **`'use client'`** | Filtros interactivos, estado de category/sort |

---

## 4. BASE DE DATOS — TABLAS RELEVANTES PARA EL E-COMMERCE

Supabase Project ID: `lrcggpdgrqltqbxqnjgh` (región: sa-east-1 — São Paulo)

### `products`
La tabla maestra de productos. Compartida entre landing e inventory.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `uuid` PK | Identificador único del producto |
| `sku` | `text` UNIQUE | Código de referencia del producto |
| `name` | `text` NOT NULL | Nombre del producto |
| `description` | `text` | Descripción larga |
| `price` | `numeric` | Precio de venta en BOB |
| `cost` | `numeric` | Costo del producto (solo para el admin) |
| `brand` | `text` | Marca del producto |
| `sizes` | `text[]` | Tallas disponibles (array: `['S','M','L','XL']`) |
| `colors` | `text[]` | Colores disponibles |
| `color` | `text` | Color principal (alias singular) |
| `image_url` | `text` | Hero image (800×1000px, WebP) |
| `thumbnail_url` | `text` | Thumbnail para catálogo (480×600px, WebP ≤80KB) |
| `images` | `text[]` | Galería de imágenes (hasta 5 URLs) |
| `is_active` | `boolean` | Si el producto está activo en el inventario |
| `published_to_landing` | `boolean` | Si aparece en la landing pública |
| `is_new` | `boolean` | Badge "NUEVO" |
| `is_new_until` | `timestamp` | Fecha hasta cuando se muestra el badge NUEVO |
| `is_best_seller` | `boolean` | Badge "MÁS VENDIDO" |
| `discount` | `numeric` | Descuento en porcentaje (0-100) |
| `discount_percentage` | `numeric` | Alias para compatibilidad |
| `discount_expires_at` | `timestamp` | Expiración del descuento de producto |
| `is_featured` | `boolean` | Destacado: aparece primero en el catálogo |
| `collection` | `text` | Colección: 'primavera', 'verano', etc. |
| `subcategory` | `text` | Subcategoría: 'manga-larga', 'oversize', etc. |
| `category_id` | `uuid` FK → `categories.id` | Categoría del producto |
| `created_at` | `timestamptz` | Fecha de creación |

**Relaciones:**
- `categories!inner(name)` — join para mostrar nombre de categoría
- `inventory(quantity, reserved_qty, location_id, locations(name))` — stock en tiempo real

### `categories`

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `uuid` PK | ID de categoría |
| `name` | `text` UNIQUE | Nombre: Camisas, Pantalones, Chaquetas, Gorras, Accesorios |
| `slug` | `text` | URL-friendly name |
| `is_active` | `boolean` | Visible en filtros de la landing |

### `inventory`
Stock por producto y ubicación. Modelo multi-location.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `uuid` PK | ID de registro de inventario |
| `product_id` | `uuid` FK → `products.id` | Producto al que pertenece |
| `location_id` | `uuid` FK → `locations.id` | Puesto/ubicación física |
| `size` | `text` | Talla específica de este registro |
| `quantity` | `integer` | Stock físico disponible |
| `reserved_qty` | `integer` | Unidades reservadas (pendientes de pago) |

**Nota crítica:** El stock disponible real = `quantity - reserved_qty`. El CartContext respeta esta lógica:
```typescript
const availableStock = inventory
  .filter(inv => inv.size === size)
  .reduce((sum, inv) => sum + Math.max(0, inv.quantity - (inv.reserved_qty ?? 0)), 0)
```

### `locations`
Los 3 puestos físicos de Lukess Home en el Mercado Mutualista.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `uuid` PK | ID de ubicación |
| `name` | `text` | Nombre: "Puesto 1 — Mutualista", etc. |
| `address` | `text` | Dirección física |
| `is_active` | `boolean` | Si está operativo |

### `orders`
Pedidos creados por los clientes en la landing.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `uuid` PK | ID del pedido (primeros 8 chars = order number visible) |
| `customer_id` | `uuid` FK → `customers.id` | Cliente (nullable para guests sin email) |
| `customer_name` | `text` NOT NULL | Nombre del cliente |
| `customer_phone` | `text` NOT NULL | Teléfono (7-8 dígitos bolivianos) |
| `customer_email` | `text` | Email (opcional en guest checkout) |
| `subtotal` | `numeric` | Total sin descuento ni envío |
| `discount_amount` | `numeric` | Monto de descuento aplicado (en BOB) |
| `discount_code_id` | `uuid` FK → `discount_codes.id` | Código de descuento utilizado |
| `shipping_cost` | `numeric` | Costo de envío en BOB |
| `total` | `numeric` NOT NULL | Total final a pagar |
| `status` | `text` | Estado: `pending`, `pending_payment`, `confirmed`, `shipped`, `completed`, `cancelled` |
| `payment_method` | `text` | `qr`, `cash_on_pickup`, `stripe` |
| `delivery_method` | `text` | `delivery` o `pickup` |
| `shipping_address` | `text` | Dirección de entrega (texto libre) |
| `shipping_reference` | `text` | Referencia de ubicación adicional |
| `pickup_location` | `text` | Nombre del puesto para retiro |
| `gps_lat` | `float8` | Latitud GPS (si el cliente compartió ubicación) |
| `gps_lng` | `float8` | Longitud GPS |
| `gps_distance_km` | `float8` | Distancia calculada al puesto |
| `maps_link` | `text` | Link de Google Maps generado |
| `recipient_name` | `text` | Nombre del receptor (si es diferente al comprador) |
| `recipient_phone` | `text` | Teléfono del receptor |
| `delivery_instructions` | `text` | Instrucciones de entrega especiales |
| `notify_email` | `boolean` | Preferencia: recibir notificaciones por email |
| `notify_whatsapp` | `boolean` | Preferencia: recibir notificaciones por WhatsApp |
| `marketing_consent` | `boolean` | Consentimiento para emails de marketing |
| `payment_receipt_url` | `text` | Path en Supabase Storage del comprobante de pago |
| `whatsapp_last_status_sent` | `text` | Último estado enviado por WhatsApp (evita duplicados) |
| `created_at` | `timestamptz` | Fecha y hora del pedido |

### `order_items`
Items individuales de cada pedido.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `uuid` PK | ID del item |
| `order_id` | `uuid` FK → `orders.id` | Pedido al que pertenece |
| `product_id` | `uuid` FK → `products.id` | Producto |
| `quantity` | `integer` | Cantidad |
| `unit_price` | `numeric` | Precio unitario al momento del pedido (snapshot) |
| `size` | `text` | Talla seleccionada |
| `color` | `text` | Color seleccionado |
| `subtotal` | `numeric` | `unit_price × quantity` |

### `customers`
Perfiles de clientes. Soporta tanto usuarios registrados como guests.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `uuid` PK | ID del cliente |
| `auth_user_id` | `uuid` FK → `auth.users.id` | Link a Supabase Auth (nullable para guests) |
| `name` | `text` | Nombre completo |
| `email` | `text` UNIQUE | Email (index para upsert en checkout) |
| `phone` | `text` | Teléfono |
| `marketing_consent` | `boolean` | Consentimiento de marketing |
| `updated_at` | `timestamptz` | Última actualización |

**Lógica de upsert en checkout:**
1. Si hay `user_id` (logueado): busca por `auth_user_id`, actualiza o crea.
2. Si hay email (guest con email): upsert por `email` (ON CONFLICT DO UPDATE).
3. Si no hay email (guest puro): insert directo sin constraint de unicidad.

### `discount_codes`
Sistema de cupones de descuento.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `uuid` PK | ID del código |
| `code` | `text` UNIQUE NOT NULL | Código (ej: `BIENVENIDO-A3X7`) |
| `type` | `text` | `percentage` o `fixed` |
| `value` | `numeric` | Monto del descuento (% o BOB fijo) |
| `assigned_email` | `text` | Email al que está bloqueado (si es personal) |
| `is_active` | `boolean` | Si está habilitado |
| `used_count` | `integer` | Veces usado |
| `max_uses` | `integer` | Máximo de usos permitidos (1 para welcome codes) |
| `expires_at` | `timestamptz` | Fecha de expiración |
| `created_at` | `timestamptz` | Fecha de creación |

**RPC: `consume_order_discount(p_order_id)`** — Incrementa `used_count` y desactiva el código si alcanzó `max_uses`. Se llama después de crear el pedido.

### `subscribers`
Lista de suscriptores al newsletter.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `uuid` PK | ID del suscriptor |
| `email` | `text` UNIQUE NOT NULL | Email del suscriptor |
| `source` | `text` | Origen: `newsletter_popup`, `footer`, `checkout`, `api` |
| `created_at` | `timestamptz` | Fecha de suscripción |

### `banners`
CMS de banners del hero. Gestionados desde el Inventory System.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `uuid` PK | ID del banner |
| `desktop_image_url` | `text` NOT NULL | URL de imagen desktop |
| `mobile_image_url` | `text` | URL de imagen mobile (opcional) |
| `image_url` | `text` NOT NULL | URL legacy (fallback) |
| `title` | `text` | Texto alternativo |
| `link` | `text` | URL de destino al hacer click |
| `display_order` | `integer` | Orden de aparición (ascendente) |
| `is_active` | `boolean` | Si está publicado |
| `start_date` | `timestamptz` | Fecha de inicio de exhibición |
| `end_date` | `timestamptz` | Fecha de fin (campaña por tiempo limitado) |

### `inventory_reservations` (via RPC)
Las reservas de inventario se gestionan mediante la función RPC `reserve_order_inventory(p_order_id)`. Esta función lee los `order_items` del pedido y actualiza `inventory.reserved_qty` para cada producto/talla. Existe también un cron automático (`block_17_a_3_2_expire_pickup_reservations.sql`) que expira reservas de retiro en tienda después de 48 horas sin pago.

---

## 5. AUTENTICACIÓN Y SEGURIDAD

### Autenticación de clientes

El sistema soporta dos modos de checkout sin necesidad de cuenta:

1. **Guest checkout anónimo** — Solo nombre y teléfono. No requiere email ni login.
2. **Guest checkout con email** — Proporciona email voluntariamente. Se crea un `customer` con upsert por email.
3. **Usuario registrado** — Login con Supabase Auth (email/password). Los pedidos se vinculan a `auth_user_id`.

La página `/auth` maneja login/signup. El `AuthContext` escucha `onAuthStateChange` de Supabase para mantener la sesión sincronizada.

### Variables de entorno requeridas

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://lrcggpdgrqltqbxqnjgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...           # Clave pública (RLS enforced)
SUPABASE_SERVICE_ROLE_KEY=eyJ...               # ⚠️ SOLO en Server Actions/API Routes

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... # Clave pública para frontend
STRIPE_SECRET_KEY=sk_live_...                  # ⚠️ SOLO en servidor
STRIPE_WEBHOOK_SECRET=whsec_...               # Para verificar webhooks

# Resend (Email)
RESEND_API_KEY=re_...                          # Para envío de emails transaccionales

# Meta WhatsApp Cloud API
WHATSAPP_API_TOKEN=EAA...                      # Token de acceso
WHATSAPP_PHONE_NUMBER_ID=...                   # Phone Number ID (Meta)

# App
NEXT_PUBLIC_SITE_URL=https://lukess-home.vercel.app
NEXT_PUBLIC_WHATSAPP_NUMBER=72643753           # WhatsApp de atención al cliente
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...            # Google Analytics 4
NEXT_PUBLIC_CLARITY_ID=...                     # Microsoft Clarity

# Dev tools
DISABLE_EMAILS=true                            # Kill-switch para pruebas
```

### Middleware de protección de rutas
No se encontró un archivo `middleware.ts` en la raíz del proyecto. Esto implica que **no hay protección de rutas vía middleware**. Las rutas de `/mis-pedidos` y `/wishlist` dependen de la UI para verificar autenticación (redirect por client-side).

**Implicación de seguridad:** Las páginas administrativas no existen en esta landing — el panel admin vive en el Inventory System separado, protegido con su propio auth. La landing no expone rutas admin.

### Seguridad de la API de Checkout

El endpoint `POST /api/checkout` implementa múltiples capas de protección:

1. **Honeypot field** (`website`) — campo oculto que los bots llenan; si tiene valor, se rechaza (status 400, code: `honeypot`).
2. **Validación de datos mínimos** — nombre ≥3 chars, teléfono 7-8 dígitos, email válido si se proporciona, total >0, items no vacío.
3. **Rate limiting en memoria** — `3 órdenes/hora/email` y `5 órdenes/hora/IP`. Limitación: se resetea al reiniciar el servidor. Nota explícita en el código: "Para producción con múltiples instancias, usar Redis (Upstash)".
4. **Validación de cupón server-side** — Si el código tiene `assigned_email`, verifica que coincida con el email del cliente.
5. **`service_role` en servidor** — El cliente Supabase admin se crea en el servidor con `SUPABASE_SERVICE_ROLE_KEY`. Nunca expuesto al cliente.

### Clave de Stripe Webhook
El endpoint `/api/webhooks/stripe` verifica la firma del webhook con `stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET)`. Sin esta verificación, cualquiera podría hacer POST y marcar órdenes como pagadas.

---

## 6. MÓDULO: CATÁLOGO / TIENDA

### Página principal (`app/page.tsx` — 3,195 B)

La homepage ES el catálogo. Es un **Server Component** asíncrono que:

1. Recibe `searchParams` con `sort` y `category/filter` como parámetros de URL.
2. Construye una query Supabase con JOIN a `categories` e `inventory` (con `reserved_qty`).
3. Filtra por `is_active = true` AND `published_to_landing = true`.
4. Aplica ordenamiento dinámico:
   - `sort=recent` (default): `is_featured DESC, created_at DESC`
   - `sort=price-desc`: precio mayor a menor
   - `sort=price-asc`: precio menor a mayor
5. Llama Server Actions `getActiveCategories()` y `getDynamicFilters()` para los filtros dinámicos.
6. Pasa `initialProducts`, `initialFilters`, `categories` como props a `CatalogoClient`.

### Filters dinámicos (`app/actions/filters.ts` — 1,393 B)

La función `getDynamicFilters(categoryId)` ejecuta una RPC de Supabase que devuelve:
- Colores disponibles en la categoría seleccionada (de `products.colors`)
- Tallas disponibles (de `products.sizes`)
- Badges activos (`is_new`, `is_best_seller`)

Esto evita mostrar filtros que no darían resultados (UX limpia).

### Filtros disponibles para el usuario

| Filtro | Tipo | Fuente |
|---|---|---|
| Categoría | Tabs horizontales | `categories.name` activas |
| Precio | Selector (asc/desc/default) | `sort` query param |
| Talla | Multi-select | DynamicFilters RPC |
| Color | Swatches visuales | DynamicFilters RPC |
| Estado | Toggle | `is_new`, descuentos activos |

### Badges de producto

| Badge | Condición | Visual |
|---|---|---|
| NUEVO | `is_new = true` AND `is_new_until > now()` | Tag verde |
| MÁS VENDIDO | `is_best_seller = true` | Tag ámbar |
| DESCUENTO | `discount > 0` AND `discount_expires_at > now()` | Tag rojo con % |
| ÚLTIMAS X | Stock ≤ 3 unidades | Tag naranja de advertencia |
| AGOTADO | Stock = 0 | Overlay gris, botón deshabilitado |

---

## 7. MÓDULO: PRODUCTO INDIVIDUAL

### Ruta: `/producto/[id]`

**Server Component** — carga el producto por ID desde Supabase con el mismo query JOIN que el catálogo (`categories`, `inventory` con `reserved_qty`).

**Datos mostrados:**
- Nombre del producto y categoría
- Galería de imágenes (hasta 5 fotos desde `products.images[]`)
- `image_url` como hero principal (800×1000px, WebP)
- `thumbnail_url` para card del catálogo (480×600px, WebP ≤80KB)
- Precio original y precio con descuento (si aplica)
- Badge de countdown si `discount_expires_at` existe
- Stock disponible global y por talla
- Badges: NUEVO, MÁS VENDIDO, ÚLTIMAS X, AGOTADO

### Selector de talla y validación de stock

El selector de talla muestra cada talla listada en `products.sizes[]` con indicación visual de disponibilidad real:
- **Disponible** (stock > 0): talla seleccionable
- **Agotada** (stock = 0): talla con tachado, no seleccionable

El stock se calcula como `quantity - reserved_qty` por cada registro de `inventory` filtrado por `size`.

**BUG conocido (BUG-06):** El badge "⚠️ Últimas X" puede aparecer múltiples veces si hay múltiples registros de inventario para la misma talla (prioridad MEDIUM).

### Gallería de imágenes

Implementada con Framer Motion (`motion/react`). Permite:
- Imagen principal grande con animación de fade al cambiar
- Thumbnails horizontales clicables
- **BUG resuelto (16-H-fix):** Se corrigió el bug de `images vs gallery` que causaba que el hero se duplicara en la galería. El fix fue commit `115d769`.

### Dual Image System (Block 16-H)

Implementado en commit `7f509a8`. El sistema usa dos URLs separadas:
- `image_url` (800×1000px) — para el hero del detalle de producto. Calidad premium.
- `thumbnail_url` (480×600px, WebP ≤80KB) — para el card del catálogo. Optimizado para LCP.

Este cambio redujo el LCP de **5.6 segundos → 2.5 segundos** en producción.

---

## 8. MÓDULO: CARRITO

### Estado: React Context + localStorage

**Archivo:** `lib/context/CartContext.tsx` (4,802 B)  
**Patrón:** `createContext` + `useState` + `useEffect` para hidratación desde localStorage.

```typescript
// Persistencia: clave 'lukess-cart' en localStorage
const saved = localStorage.getItem('lukess-cart')
if (saved) setCart(JSON.parse(saved))

// Se sincroniza automáticamente al cambiar el carrito
useEffect(() => {
  if (isLoaded) localStorage.setItem('lukess-cart', JSON.stringify(cart))
}, [cart, isLoaded])
```

**API del CartContext:**

| Función | Descripción |
|---|---|
| `addToCart(product, quantity, size?, color?)` | Agrega ítem. Valida stock real antes de agregar. |
| `removeFromCart(itemId)` | Elimina ítem por ID compuesto |
| `updateQuantity(itemId, quantity)` | Actualiza cantidad respetando stock máximo |
| `clearCart()` | Vacía el carrito (post-checkout) |
| `total` | Subtotal calculado con descuentos de producto aplicados |
| `itemCount` | Total de unidades en el carrito |

### ID de ítem compuesto

Cada ítem tiene un ID único que combina producto + talla + color:
```typescript
const itemId = `${product.id}-${size || 'nosize'}-${color || 'nocolor'}`
```
Esto permite tener el mismo producto en distintas tallas como ítems separados.

### Validación de stock en tiempo real

Antes de agregar al carrito, se consulta `product.inventory` (ya cargado en el producto desde SSR) para calcular el stock disponible:
```typescript
const availableStock = product.inventory
  .filter(inv => inv.size === size)
  .reduce((sum, inv) => sum + Math.max(0, inv.quantity - (inv.reserved_qty ?? 0)), 0)
```

Si el stock es 0 → toast.error "Producto sin stock disponible".  
Si la cantidad a agregar excede el stock → toast.error "Stock máximo alcanzado".

### Cálculo de subtotal

```typescript
const total = cart.reduce((sum, item) => 
  sum + (getPriceWithDiscount(item.product) * item.quantity), 0)
```

`getPriceWithDiscount()` aplica el descuento de producto si está activo y no expirado, devolviendo el precio neto a pagar.

### CartDrawer (`components/cart/CartDrawer.tsx` — 8,909 B)

Drawer lateral animado con Framer Motion. Muestra:
- Lista de ítems con imagen, nombre, talla, color, precio y controles +/-
- Subtotal calculado con descuentos
- Botón "Proceder al pago" → abre CheckoutModal
- Botón "Seguir comprando" → cierra el drawer

### Persistencia entre sesiones

La persistencia es **solo por device/browser** vía localStorage. No hay sincronización de carrito entre dispositivos ni estado en Supabase para el carrito. Si el usuario borra el localStorage o usa otro navegador, el carrito se pierde.

---

## 9. MÓDULO: CHECKOUT Y PEDIDOS

### Flujo completo del checkout

```
[CartDrawer] → "Proceder al pago"
    ↓
[CheckoutModal Step 1: Datos del cliente]
  - Nombre completo (≥3 chars)
  - Teléfono (7-8 dígitos)
  - Email (opcional)
  - Método de entrega: delivery | pickup
  - Si delivery: dirección + referencia + GPS opcional
  - Si pickup: selección de punto de retiro
  - Receptor diferente (nombre + teléfono)
  - Instrucciones especiales
  - Código de descuento (validación live)
  - Método de pago: QR/transferencia | Efectivo en tienda | Stripe (tarjeta)
  - Preferencias de notificación (email/WhatsApp)
  - Consentimiento de marketing
    ↓
[CheckoutModal Step 2: QR/Comprobante — si pago por QR]
  - Muestra QR code estático para transferencia bancaria
  - Formulario para subir comprobante (imagen ≤5MB)
    ↓
[POST /api/checkout]
  A. Validaciones + Honeypot + Rate Limiting
  B. Upsert customer (3 variantes: auth, guest+email, guest puro)
  C. Suscripción automática si marketing_consent + email
  D. Validación server-side del código de descuento
  E. INSERT en orders
  F. INSERT en order_items
  G. RPC consume_order_discount (si hay código)
  H. WhatsApp notification (si notify_whatsapp = true)
  I. Si Stripe: crear Checkout Session → devuelve checkoutUrl
    ↓
[POST /api/reserve-order] (llamado por el frontend post-checkout)
  - RPC reserve_order_inventory(p_order_id)
  - Actualiza inventory.reserved_qty por cada order_item
    ↓
[CheckoutModal Step 3: Éxito]
  - Muestra orden #ID (primeros 8 chars como número visible)
  - Limpia el carrito (clearCart())
  - Dispara trackPurchase() → GA4 + Vercel Analytics
```

### Formulario de checkout

El `CheckoutModal.tsx` (130,114 B — el archivo más grande del proyecto) es un formulario multi-step con:
- Validación manual con estados React (no Zod/react-hook-form, dado el tamaño)
- `doubleSubmitRef.current` para prevenir double-submit (fix en Block 17-F)
- Autofill desde el último pedido del cliente si está logueado

### Creación del pedido en Supabase

```typescript
const { data: order } = await supabase
  .from('orders')
  .insert({
    customer_id: customerId,
    customer_name, customer_phone, customer_email,
    subtotal, discount_amount, discount_code_id,
    shipping_cost, total,
    status: payment_method === 'cash_on_pickup' ? 'pending_payment' : 'pending',
    payment_method: payment_method === 'cash_on_pickup' ? 'cash_on_pickup' : 'qr',
    delivery_method, shipping_address, pickup_location,
    gps_lat, gps_lng, gps_distance_km, maps_link,
    recipient_name, recipient_phone, delivery_instructions,
    notify_email, notify_whatsapp,
    payment_receipt_url,
  })
  .select().single()
```

### Reserva de inventario

Después de crear el pedido, el frontend llama `POST /api/reserve-order` con el `orderId`. Esto ejecuta la RPC:
```typescript
supabase.rpc('reserve_order_inventory', { p_order_id: orderId })
```
La RPC incrementa `inventory.reserved_qty` para cada item del pedido, asegurando que ese stock no se venda a otro cliente mientras el primero paga.

---

## 10. MÓDULO: PAGOS

### Métodos de pago implementados

| Método | Código | Flujo | Estado |
|---|---|---|---|
| **QR / Transferencia bancaria** | `qr` | El cliente ve un QR, hace la transferencia, sube comprobante | ✅ Implementado |
| **Efectivo al retirar** | `cash_on_pickup` | Status inicial `pending_payment`, paga en tienda | ✅ Implementado |
| **Stripe (tarjeta)** | `stripe` | Redirige a Stripe Checkout, webhook confirma | ✅ Implementado |

### Flujo de pago QR

1. CheckoutModal muestra imagen de QR estática (código QR del banco del comerciante).
2. El cliente hace la transferencia en su app bancaria.
3. El cliente sube una foto del comprobante via `POST /api/upload-receipt`.
4. El archivo se sube al bucket privado `payment-receipts` de Supabase Storage.
5. El `fileName` se guarda en `orders.payment_receipt_url`.
6. El admin del Inventory System ve el comprobante en el panel y confirma manualmente.

**Límites del upload:**
- Tamaño máximo: 5 MB
- Tipos aceptados: imágenes (JPG, PNG, WebP)
- Nombre del archivo: `{orderId}-{timestamp}.{ext}`

### Flujo de pago Stripe

```typescript
// En POST /api/checkout, cuando payment_method === 'stripe'
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: items.map(item => ({
    price_data: {
      currency: 'bob',
      product_data: { name: `${item.product_name} (${item.size})` },
      unit_amount: Math.round(item.unit_price * 100), // centavos
    },
    quantity: item.quantity,
  })),
  mode: 'payment',
  success_url: `${SITE_URL}/?success=true&orderId=${order.id}`,
  cancel_url: `${SITE_URL}/?canceled=true`,
  metadata: { order_id: order.id },
  customer_email: customer_email,
})
// Devuelve: { orderId, orderNumber, checkoutUrl }
```

El frontend redirige al usuario a `session.url` (la URL de Stripe Checkout).

### Webhook Stripe (`/api/webhooks/stripe`)

Cuando el pago se completa:
1. Stripe envía `checkout.session.completed` al webhook.
2. El handler verifica la firma criptográfica con `STRIPE_WEBHOOK_SECRET`.
3. Extrae `order_id` de `session.metadata`.
4. Actualiza `orders.status = 'confirmed'` y `payment_method = 'stripe'`.
5. Si `notify_whatsapp = true`, envía notificación WhatsApp al cliente.

### Eliminación de inventario reservado

**Nota:** El código no muestra una llamada explícita a liberar reservas al cancelar. Esto es un flujo pendiente — el cron de expiración de 48h (`block_17_a_3_2_expire_pickup_reservations.sql`) cubre los casos de retiro, pero no el caso general de órdenes abandonadas.

### Configuración Stripe (`lib/stripe.ts` — 390 B)

```typescript
import Stripe from 'stripe'
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '...',
})
```

---

## 11. MÓDULO: NOTIFICACIONES

El sistema de notificaciones de Lukess Home es uno de sus módulos más sofisticados. Opera en dos canales paralelos (email + WhatsApp) respetando las preferencias del cliente (`notify_email`, `notify_whatsapp`).

### API `/api/send-email` (35,574 B — el API route más grande)

**Proveedor:** Resend (SDK `resend` v6.9.2)  
**From:** `Lukess Home <onboarding@resend.dev>` (dominio de Resend no verificado en producción; pendiente verificación de dominio propio)  
**Kill-switch:** Si `DISABLE_EMAILS=true` en las env vars, el endpoint devuelve `{ success: true, bypassed: true }` sin enviar nada. Útil para pruebas.

**Los 10 tipos de email (`EmailType`):**

| Tipo | Subject | Trigger | Destinatario |
|---|---|---|---|
| `welcome_email` | `¡Bienvenido a Lukess Home! Tu regalo adentro 🎁` | Suscripción newsletter | Cliente |
| `order_confirmation` | `✅ Pedido #XXXX recibido` | Checkout completado | Cliente |
| `order_paid` | `💳 Pago confirmado — Pedido #XXXX` | Admin confirma pago en inventory | Cliente |
| `order_shipped` | `🛵 Tu pedido está en camino` | Admin cambia status a shipped | Cliente |
| `order_completed` | `🎉 ¡Tu pedido fue entregado con éxito!` | Admin marca como completado | Cliente |
| `order_cancelled` | `❌ Pedido #XXXX cancelado` | Admin cancela el pedido | Cliente |
| `admin_new_order` | `🛎️ Nuevo pedido #XXXX — Verificar pago` | Checkout completado | Admin (`demo@lukesshome.com`) |
| `pickup_reservation_received` | `Reserva Confirmada - #XXXX` | Checkout con método pickup | Cliente |
| `pickup_payment_confirmed` | `Pago Confirmado - #XXXX` | Admin confirma pago de retiro | Cliente |
| `pickup_ready_for_collection` | `¡Tu pedido está listo! - #XXXX` | Admin marca como listo para retiro | Cliente |

**Template HTML:** Los emails están construidos con funciones puras que generan HTML inline (sin React Email). El diseño es dark mode premium negro (`#222222` fondo) con acento dorado (`#D4AF37`), tipografía `Helvetica Neue`, y componentes reutilizables:
- `buildHeader()` — Logo LUKESS HOME en dorado sobre negro
- `buildOrderNumber(orderId)` — Caja con número de orden en monospace dorado
- `buildProductRow(item)` — Fila de producto con imagen 70×70px, nombre, talla, precio
- `buildItemsTable(items)` — Tabla completa de productos del pedido
- `buildCostBreakdown(data)` — Desglose subtotal + envío + descuento + total
- `buildWhatsappCta()` — CTA "¿Tenés dudas? WhatsApp: +591 72643753"
- `buildFooter()` — Footer con dirección Mercado Mutualista

**Email de bienvenida:** Incluye un código de descuento del 10% generado dinámicamente (`generateWelcomeDiscount(email)`), válido por 7 días, de un solo uso.

**Email de completado (delivery/pickup):** Incluye un cupón de retención del 10% para la próxima compra, válido por 3 días. Botón de regreso a la tienda y links a Instagram/Facebook.

**Compatibilidad cross-system:** El endpoint acepta items en dos formatos:
1. Desde la landing (`item.product.name`, `item.product.price`, `item.product.images[]`)
2. Desde el Inventory System (JOIN de Supabase: `item.products.name`, `item.image_url`)

Esto permite que el Inventory System llame a este endpoint para enviar emails de actualización de estado de pedido (CORS abierto: `Access-Control-Allow-Origin: *`).

### API `/api/send-whatsapp` (924 B)

**Proveedor:** Meta WhatsApp Cloud API  
**Propósito:** Proxy ligero que delega en `lib/whatsapp/send-message.ts`  
**CORS:** Abierto (`*`) para permitir llamadas desde el Inventory System

#### Templates de WhatsApp (`lib/whatsapp/template-router.ts`)

El sistema usa templates pre-aprobados por Meta (plantillas de WhatsApp Business). El `getWhatsAppTemplate(order, status)` selecciona el template correcto según:

| Status del pedido | Método de pago | Template seleccionado |
|---|---|---|
| `pending` | `qr` / `stripe` | `pedido_recibido` (instrucciones de pago QR) |
| `pending_payment` | `cash_on_pickup` | `pedido_recibido_tienda` (instrucciones de retiro) |
| `confirmed` | cualquiera | `pago_confirmado` |
| `shipped` | `delivery` | `pedido_en_camino` |
| `completed` | `delivery` | `pedido_entregado` |
| `completed` | `pickup` | `pedido_recogido` |

**Formato del número boliviano:** Se formatea con prefijo `591` antes del número:
```typescript
const rawPhone = customer_phone.replace(/\D/g, '')
const formattedPhone = rawPhone.startsWith('591') ? rawPhone : `591${rawPhone}`
```

**`whatsapp_last_status_sent`:** Cada vez que se envía un WA, se actualiza este campo en `orders` para evitar enviar el mismo estado dos veces (prevención de duplicados en caso de retry).

---

## 12. MÓDULO: BANNERS Y MARKETING

### Sistema de banners dinámico (`lib/banners.ts` — 1,005 B)

Los banners del hero son un CMS completo. El Inventory System los gestiona (CRUD), la landing los consume via SSR.

**Query Supabase para banners activos:**
```typescript
supabase.from("banners")
  .select("id, desktop_image_url, mobile_image_url, image_url, title, link, display_order")
  .eq("is_active", true)
  .or(`start_date.is.null,start_date.lte.${now}`)
  .or(`end_date.is.null,end_date.gte.${now}`)
  .order("display_order", { ascending: true })
```

**Capacidades del sistema de banners:**
- **Dual image** — Imagen diferente para desktop (`desktop_image_url`) y mobile (`mobile_image_url`)
- **Fecha de inicio y fin** — Campañas por tiempo limitado (ej: "Campaña de San Valentín")
- **Link de destino** — Al hacer click en el banner, navega a una URL específica
- **Orden de display** — Control del orden del carousel por `display_order ASC`
- **Activación/desactivación** — Toggle `is_active` sin borrar el banner

**Animaciones del banner:** El CSS global (`globals.css`) incluye keyframes dedicados:
- `slideInFromRight` (0.4s ease-out) — Entrada de cada nuevo banner
- `shimmerSweep` (1.4s ease-out, delay 0.8s) — Efecto shimmer sobre la imagen
- `.banner-slide-enter` y `.banner-shimmer` — Clases utilitarias para estos efectos

### Sistema de descuentos: validación y consumo

**Flujo completo de un código de descuento:**

1. **Creación:** El admin crea el código en el Inventory System con tipo (`percentage`/`fixed`), valor, `assigned_email` opcional, `max_uses`, y `expires_at`.
2. **Welcome codes:** Al suscribirse al newsletter, `generateWelcomeDiscount(email)` genera un código único con prefijo `BIENVENIDO-` y `assigned_email` del suscriptor. 10% de descuento, 1 uso, 7 días.
3. **Retention codes:** Al completar un pedido, el email de completado incluye un código de retención del 10% por 3 días.
4. **Validación en checkout (frontend):** El cliente escribe el código → validación live contra Supabase. Se verifica `is_active`, `expires_at`, y `max_uses > used_count`.
5. **Validación server-side:** El `POST /api/checkout` hace una segunda validación de `assigned_email` en el servidor. Si el email del cliente no coincide con `assigned_email`, se rechaza con `code: 'invalid_coupon_email'`.
6. **Consumo:** Tras crear el pedido, se llama `rpc('consume_order_discount', { p_order_id: order.id })` que incrementa `used_count` y desactiva el código si alcanzó `max_uses`.

**Tipos de descuento:**
- `percentage`: Se calcula `(subtotal * value / 100)` y se descuenta del total
- `fixed`: Se descuenta el valor fijo en BOB directamente del total

**Aplicación en el total del carrito:**
```typescript
// El descuento de producto aplica al precio unitario del ítem:
getPriceWithDiscount(product): price * (1 - discount/100)

// El código de descuento aplica al subtotal del carrito:
total = subtotal - discount_amount
```

### Newsletter popup y footer newsletter

**NewsletterPopup:** Componente `'use client'` que muestra un popup con delay configurado. Campos: solo email. Al enviar, hace `POST /api/subscribe`. Si ya está suscrito (409), muestra mensaje amigable. Si es nuevo, muestra el código de bienvenida generado.

**FooterNewsletter:** Formulario inline en el footer. Mismo endpoint `/api/subscribe`. Source: `'footer'`.

**Fuentes de suscripción rastreadas en `subscribers.source`:**
- `newsletter_popup` — popup flotante
- `footer` — formulario del footer
- `checkout` — si `marketing_consent = true` en el checkout
- `api` — llamadas directas al endpoint

---

## 13. MÓDULO: SUSCRIPCIONES / NEWSLETTER

### API `/api/subscribe` (3,575 B)

**Flujo completo:**
1. Valida que el email tenga formato correcto.
2. Hace INSERT en `subscribers` con `email` (lowercase, trimmed) y `source`.
3. Si ya existe (`error.code === '23505'` — unique violation) → devuelve 409 `already_subscribed` sin error de UX.
4. Genera código de descuento de bienvenida via `generateWelcomeDiscount(email)`.
5. Envía email de bienvenida via `POST /api/send-email` con el código.
6. Devuelve `{ success: true, discountCode }`.

El email de bienvenida se dispara de forma fire-and-forget (wrapped en try/catch independiente) para que una falla del email nunca bloquee la respuesta de suscripción exitosa.

**Seguridad de suscripción desde el checkout:**
Si el cliente marca `marketing_consent = true` en el checkout, el endpoint `/api/checkout` llama a `/api/subscribe` de forma fire-and-forget:
```typescript
if (marketing_consent && customer_email) {
  fetch(`${baseUrl}/api/subscribe`, {
    method: 'POST',
    body: JSON.stringify({ email: customer_email, source: 'checkout' })
  }).catch(err => console.error(err))
}
```
El catch evita que un fallo del subscribe rompa el flujo de checkout.

---

## 14. MÓDULO: PÁGINAS ESTÁTICAS / OTRAS

La app cuenta con un conjunto completo de **20 páginas** más allá de la homepage y el detalle de producto:

### Páginas de soporte post-compra

| Ruta | Página | Propósito |
|---|---|---|
| `/mis-pedidos` | Historial de pedidos | Lista de pedidos del usuario logueado con detail: status, items, subtotal, total. Muestra timer de retiro si `delivery_method === 'pickup'` y el pedido está pendiente de pago. |
| `/wishlist` | Lista de deseos | Productos guardados para después. `WishlistContext` persiste en localStorage igual que el carrito. |
| `/como-comprar` | Guía de compra | Explicación paso a paso del proceso de checkout para nuevos clientes. |
| `/guia-tallas` | Guía de tallas | Tabla de tallas con medidas en cm para Camisas, Pantalones, Gorras, Accesorios. |
| `/preguntas-frecuentes` | FAQ | Las preguntas más comunes sobre el proceso de compra, pagos, y entregas. |

### Páginas informativas

| Ruta | Página |
|---|---|
| `/sobre-nosotros` | Historia de Lukess Home, 3 puestos en el Mercado Mutualista, más de 10 años |
| `/metodos-pago` | Descripción detallada de QR/transferencia, efectivo en tienda, y Stripe |
| `/plazos-entrega` | Tiempos estimados de entrega en Santa Cruz y zonas |
| `/garantia-autenticidad` | Garantía de productos originales |
| `/cuidado-prendas` | Instrucciones de lavado y cuidado por tipo de prenda |

### Páginas legales (Block 16-C)

| Ruta | Página |
|---|---|
| `/politicas-envio` | Política de envío y costos |
| `/politicas-cambio` | Política de cambios y devoluciones |
| `/terminos` | Términos y condiciones de uso |
| `/privacidad` | Política de privacidad (GDPR/Bolivia) |

### Blog SEO (Block 16-B — `lib/blog.ts` — 2,914 B)

**Arquitectura:** Posts en Markdown con frontmatter YAML en `content/`. `gray-matter` parsea el frontmatter, `remark` + `remark-html` convierten el Markdown a HTML.

**Ruta:** `/blog` (lista) y `/blog/[slug]` (post individual).  
**Contenido:** 5+ artículos SEO optimizados para búsquedas locales en Bolivia sobre moda masculina, guías de estilo, y tendencias. Estrategia de long-tail SEO geolocalizado.  
**Tipografía:** El plugin `@tailwindcss/typography` aplica estilos `.prose` para el contenido del blog (headings, listas, citas con diseño tipográfico premium).

### Autenticación cliente (`/auth`)

Página con formulario de login/signup usando Supabase Auth (email/password). El `AuthContext` maneja el estado de sesión globalmente. La autenticación habilita:
- Historial de pedidos en `/mis-pedidos` (filtrado por `customer.auth_user_id`)
- Autofill de datos de checkout desde el último pedido
- Wishlist persistente (aunque actualmente es solo localStorage, no Supabase)

---

## 15. DESIGN SYSTEM Y ESTÉTICA UI

### Paleta de colores (definida en `app/globals.css` — `@theme` block)

| Token CSS | Valor HEX | Uso |
|---|---|---|
| `--color-lukess-gold` | `#c89b6e` | Dorado principal de la marca. CTAs secundarios, highlights |
| `--color-whatsapp` | `#25d366` | Verde WhatsApp. Botones de contacto por WhatsApp |
| `--color-whatsapp-dark` | `#1da851` | Hover del botón WhatsApp |

**Colores adicionales via Tailwind v4 por defecto:**
- Negro: `#111111`, `#1a1a1a`, `#222222` — Fondos de cards, emails, backgrounds oscuros
- Dorado emails: `#D4AF37` — Solo en templates de email (no en `@theme`)
- Gris: escala completa de Tailwind (`gray-50` → `gray-900`)
- Verde semántico: `#4caf50` — Estados de éxito
- Rojo semántico: `#f87171` — Estados de error y cancelación
- Azul semántico: `#60a5fa` — Estado "en camino"

### Tipografía

| Variable | Fuente | Subsets | Display | Uso |
|---|---|---|---|---|
| `--font-sans` | Inter | Latin | `swap` | Fuente principal de la app. Body, navegación, formularios |
| `--font-inter` | Inter | Latin | `swap` | Variable CSS para el layout (`className={inter.variable}`) |

**Carga:** `next/font/google` — Inter se carga de forma optimizada con `preload: true`. No hay `@import` de fonts en CSS (correcto según las reglas del stack).

### Animaciones CSS

| Clase / Keyframe | Duración | Uso |
|---|---|---|
| `@keyframes slideInFromRight` | 0.4s ease-out | Entrada de nuevos banners en el carousel |
| `@keyframes shimmerSweep` | 1.4s, delay 0.8s | Efecto shimmer en banners (luz que barre la imagen) |
| `@keyframes marquee` | 25s linear infinite | Trust banner con texto deslizante continuo |
| `@keyframes pulse-subtle` | 2s cubic-bezier(0.4,0,0.6,1) | Pulso sutil en elementos de atención |
| `@keyframes heroPromoEnter` | 0.6s cubic-bezier(0.16,1,0.3,1) | Entrada del texto promo en el hero |
| `.banner-slide-enter` | — | Aplica slideInFromRight |
| `.banner-shimmer::after` | — | Aplica shimmerSweep via pseudo-elemento |
| `.animate-marquee` | — | Aplica marquee |
| `.animate-pulse-subtle` | — | Aplica pulse-subtle |
| `.hero-promo-enter` | — | Aplica heroPromoEnter |

### GPU Acceleration

```css
.gpu {
  transform: translateZ(0);
  will-change: transform;
  backface-visibility: hidden;
}
```
Se aplica a elementos animados para promover capas GPU y evitar repaints.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .animate-marquee, .animate-pulse-subtle { animation: none; }
}
```
Cumple con WCAG 2.1 AA para usuarios con sensibilidad al movimiento.

### Animaciones con librerías

| Librería | Uso en el proyecto |
|---|---|
| `framer-motion` / `motion/react` | CartDrawer (AnimatePresence, slide-in/out), galería de imágenes (fade entre fotos), checkout modal (transitions de steps) |
| `tailwindcss-motion` | Micro-interacciones CSS puras: hover en cards, button press effects, fade-ins en catálogo |
| `react-intersection-observer` | Reveal de secciones al hacer scroll (CTA final, Trust Banner) |

**Regla del proyecto (activeContext.md):**
- Micro-interacciones simples → `tailwindcss-motion` CSS utilities
- Animaciones complejas scroll-driven → `motion/react` (`{ motion, AnimatePresence, useScroll, useTransform }`)
- ~~`framer-motion`~~ directo está deprecado; usar el alias `motion/react`

### Scrollbar personalizada

```css
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { @apply bg-gray-50; }
::-webkit-scrollbar-thumb { @apply bg-gray-400 rounded-full; }
::-webkit-scrollbar-thumb:hover { @apply bg-gray-600; }
```
Se incluye también `.scrollbar-hide` y `.hide-scrollbar` para ocultar scrollbars en sliders y carousels.

### Responsive y mobile-first

La app sigue el sistema de breakpoints de Tailwind v4:
- `sm` → 640px (tablet pequeña)
- `md` → 768px (tablet)
- `lg` → 1024px (laptop)
- `xl` → 1280px (desktop)
- `2xl` → 1536px (desktop grande)

El hero banner usa `desktop_image_url` en `md:` y `mobile_image_url` en pantallas menores. El catálogo cambia de 1 columna (mobile) a 2 columnas (`sm:`) a 3-4 columnas (`lg:`).

---

## 16. PERFORMANCE Y SEO

### Estrategia de rendering por página

| Ruta | Tipo de rendering | Justificación |
|---|---|---|
| `/` (homepage) | **SSR** | Productos dinámicos de Supabase, filtros dinámicos |
| `/producto/[id]` | **SSR** | Stock en tiempo real, metadata dinámica por producto |
| `/blog` | **SSG** (estático en build) | Contenido Markdown estático, no cambia frecuentemente |
| `/blog/[slug]` | **SSG** (estático) | Post Markdown individual |
| `/sobre-nosotros`, legales, FAQ, etc. | **SSG** | Contenido estático puro |
| `/mis-pedidos` | **SSR** | Requiere sesión de usuario, datos personales |
| `/auth` | **Client** | Formulario interactivo |

### Optimización de imágenes (`next.config.ts`)

```typescript
images: {
  formats: ["image/avif", "image/webp"],  // AVIF primero (mejor compresión), WebP fallback
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],  // srcset responsive
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],  // para icons y thumbnails
  minimumCacheTTL: 60,  // Cache de imágenes en edge: 60 segundos
  remotePatterns: [
    { protocol: "https", hostname: "images.unsplash.com" },
    { protocol: "https", hostname: "**" },  // ⚠️ Wildcard — acepta cualquier dominio HTTPS
  ],
}
```

**⚠️ Nota de seguridad:** El `hostname: "**"` permite que cualquier dominio externo pase por el optimizador de Next.js. En producción sería más seguro listar únicamente los dominios de Supabase Storage y Unsplash.

### Dual Image System (Block 16-H)

Como se mencionó en la Sección 7, este sistema redujo el LCP de 5.6s a 2.5s:
- `thumbnail_url`: 480×600px, WebP ≤80KB → usado en el catálogo para LCP rápido
- `image_url`: 800×1000px → solo se carga al entrar a la página de detalle

### Metadata API de Next.js

**Root layout (`app/layout.tsx`):**
- `title.template`: `"%s | Lukess Home"` — cada página define su `%s`
- `title.default`: `"Lukess Home - Ropa Masculina en Santa Cruz | Mercado Mutualista"`
- `description`: Con keywords de SEO local boliviano
- `keywords`: Array con 12 términos geolocalizado (Santa Cruz, Bolivia, Mercado Mutualista)
- `metadataBase`: Configurado vía `NEXT_PUBLIC_SITE_URL` para resolver URLs relativas

### Open Graph y Twitter Cards

```typescript
openGraph: {
  title: "Lukess Home - Ropa Masculina en Santa Cruz | Mercado Mutualista",
  description: "Más de 10 años vistiendo a bolivianos con estilo...",
  url: SITE_URL,
  siteName: "Lukess Home",
  locale: "es_BO",
  type: "website",
  images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "..." }],
},
twitter: {
  card: "summary_large_image",
  images: ["/og-image.png"],
}
```

**Localización:** `locale: "es_BO"` es específico para español boliviano — correcto para posicionamiento local.

### robots.ts y sitemap.ts

**`app/robots.ts`** (302 B) — Genera `robots.txt` dinámico. Permite indexación completa de Google, desautoriza `/api/` y `/auth/`.

**`app/sitemap.ts`** (1,390 B) — Genera `sitemap.xml` dinámico con:
- Homepage (prioridad 1.0, weekly)
- Todas las páginas de producto activas (prioridad 0.8, daily)
- Páginas estáticas (prioridad 0.5, monthly)
- Posts del blog (prioridad 0.6, weekly)

### Analytics triple stack

| Herramienta | Uso | Trigger |
|---|---|---|
| **Google Analytics 4** | Pageviews + e-commerce events (`view_item`, `add_to_cart`, `begin_checkout`, `purchase`) | `@next/third-parties/google GA4` + `window.gtag()` custom events |
| **Vercel Web Analytics** | Page views, custom events (`add_to_cart`, `started_checkout`, `completed_purchase`) | `@vercel/analytics/react` + `track()` calls |
| **Microsoft Clarity** | Heatmaps, session recordings, user behavior | `MicrosoftClarity` client component que inyecta el script |

Los eventos de e-commerce se disparan en paralelo en GA4 Y Vercel Analytics para máxima cobertura. Los errores en el tracking nunca bloquean el flujo del usuario (todos están en `try/catch` con `// non-blocking`).

### Optimizaciones de build

```typescript
compiler: {
  removeConsole: process.env.NODE_ENV === "production",
}
```
Todos los `console.log` de desarrollo se eliminan automáticamente en el build de producción.

**`reactStrictMode: true`** — Detecta efectos secundarios no puros en development.

---

## 17. ESTADO ACTUAL Y DEUDA TÉCNICA

### Estado del proyecto

**Fase:** Pre-Documentation & Handover (Phase 3)  
**Status:** FEATURE-COMPLETE — Production Ready  
**Último bloque completado:** Block 17-N — Final QA & Notification Preferences Sync (2026-03-07)

### Historial de bloques completos

| Bloque | Nombre | Fecha | Commit |
|---|---|---|---|
| Cleanup-01 | Framer-motion removal + Memory Bank setup | 2026-02-26 | — |
| 9b-A | WhatsApp centralization (20 files → env var) | 2026-02-27 | — |
| 9c-A | Discount codes system + is_new flag | 2026-02-28 | `630e701` |
| 9d-A/B | Banner carousel + Dynamic Hero | 2026-02-28 | `35af00c` |
| 10-J | Order creation on payment confirm + order history | 2026-02-28 | `f7ea6c2` |
| 13-C/D/E | Discount consumption end-to-end | 2026-03-01 | `6e11a4d` |
| 15-A | Vercel Web Analytics + GA4 custom events | 2026-03-01 | `83f1a91` |
| 15-B | WhatsApp API — Backend trigger | 2026-03-01 | `1a92b56` |
| 16-B | Blog system — Markdown + 5 SEO posts | 2026-03-02 | `b23f45e` |
| 16-C | Footer — 15+ legal/info pages + Size Guide + FAQ | 2026-03-03 | `fd9162e` |
| 16-D | Filter Wars — Dynamic filters, color swatches, RPC | 2026-03-03/04 | `0cb4d0b` |
| 16-E | Analytics — Microsoft Clarity + GSC | 2026-03-04 | `6a50fc9` |
| 16-F | SEO — sitemap, GSC HTML verification, metadataBase | 2026-03-04 | `d2b7496` |
| 16-G | Dynamic Hero Banner CMS | 2026-03-04 | `2d0198f` |
| 16-H | Dual Image System — LCP 5.6s→2.5s | 2026-03-04 | `7f509a8` |
| 16-H-fix | Gallery bug fix (images vs gallery) | 2026-03-05 | `115d769` |
| 17-A-3.2 | Auto-expire pickup reservations after 48h | 2026-03-05 | `fac6f85` |
| 17-C | Premium Email Templates | 2026-03-05 | — |
| 17-F | Checkout Bug Fix & Final Notification QA | 2026-03-06 | — |
| 17-I | Landing Email Builder & WhatsApp Updates | 2026-03-07 | `f14e41f` |
| 17-N | Final QA & Notification Preferences Sync | 2026-03-07 | `beb2e96` |

### Bugs conocidos (Post-Feature-Complete)

| ID | Descripción | Prioridad | Módulo |
|---|---|---|---|
| BUG-04 | `recipientName` pre-fill solo captura el primer carácter escrito | 🟡 MEDIUM | Checkout |
| BUG-05 | No hay `scrollTo({top:0})` al cambiar de step en el checkout modal (form → qr → success) | 🟡 MEDIUM | Checkout UX |
| BUG-06 | Badge "⚠️ Últimas X" puede aparecer múltiples veces en ProductDetail si hay múltiples registros de inventario para la misma talla | 🟡 MEDIUM | Producto |
| BUG-01 | QR image desborda en pantallas < 360px | 🟢 LOW | Checkout Mobile |

### Deuda técnica conocida

| Item | Impacto | Descripción |
|---|---|---|
| **Rate limiting en memoria** | 🔴 Alto | El rate limit de checkout usa `Map` en memoria del servidor. En Vercel con múltiples instancias, cada instancia tiene su propio mapa independiente, haciendo el límite inefectivo. Solución: migrar a Redis (Upstash). |
| **Middleware de auth faltante** | 🟡 Medio | Las rutas `/mis-pedidos` y `/wishlist` no tienen protección server-side. Un usuario no logueado puede acceder a las URLs sin ser redirigido, aunque verá el contenido vacío. |
| **Wildcard de imágenes** | 🟡 Medio | `hostname: "**"` en `next.config.ts` acepta cualquier dominio para imágenes. Debería restringirse a `lrcggpdgrqltqbxqnjgh.supabase.co` y `images.unsplash.com`. |
| **CheckoutModal monolítico** | 🟡 Medio | El archivo tiene 130,114 bytes (~3,500+ líneas estimadas). Viola la regla del proyecto: "NEVER rewrite entire components in one prompt if the file is >300 lines". Debería refactorizarse en sub-componentes. |
| **lib/products.ts legacy** | 🟢 Bajo | El archivo de 11 productos estáticos existe junto al catálogo dinámico de Supabase. Es dead code usado únicamente en la ruta estática de test `/test-productos`. |
| **Email domain no verificado** | 🟡 Medio | Resend envía desde `onboarding@resend.dev`. Los emails pueden caer en spam. Pendiente verificar el dominio propio (ej: `noreply@lukesshome.com`). |
| **`any` en checkout** | 🟡 Medio | En `/api/checkout/route.ts` hay usos de `items.map((item: any) => ...)` en la sección de Stripe. Rompe el contrato de TypeScript estricto. |
| **Liberación de reservas al cancelar** | 🟡 Medio | No existe un mecanismo explícito para decrementar `reserved_qty` cuando una orden se cancela. Solo el cron de 48h cubre pickups. |

### Reglas críticas aprendidas de bugs (en activeContext.md)

```
⛔ NUNCA renombrar propiedades de una interface TypeScript que mapean directamente a
   columnas de Supabase sin hacer la migración de BD primero. La columna de BD es la
   fuente de verdad en runtime. (Bug: 'images' vs 'gallery' — Marzo 4, 2026)

⛔ NUNCA reescribir componentes completos en un solo prompt si el archivo tiene >300 líneas.
   Usar ediciones con scope reducido.

⛔ NUNCA hacer renames de columnas de BD sin actualizar database.types.ts primero.

⛔ NUNCA hardcodear el número de WhatsApp. Siempre usar NEXT_PUBLIC_WHATSAPP_NUMBER.
   (20 archivos fueron migrados en bloque 9b-A)
```

---

## 18. ROADMAP DE FEATURES PENDIENTES


### Features técnicas identificadas como pendientes o mejorables

| Feature | Prioridad | Descripción |
|---|---|---|
| **Redis para rate limiting** | 🔴 Alta | Migrar el rate limit de checkout de `Map` en memoria a Upstash Redis, para consistencia entre instancias de Vercel. |
| **Refactor CheckoutModal** | 🟡 Media | Dividir el archivo de 130KB en sub-componentes: `CheckoutForm`, `QRPaymentStep`, `PickupSelector`, `DiscountCodeInput`, `DeliverySection`. |
| **Middleware de auth** | 🟡 Media | Añadir `middleware.ts` para proteger `/mis-pedidos` con redirect server-side si el usuario no está autenticado. |
| **Dominio de email** | 🟡 Media | Verificar dominio en Resend y actualizar `from` a ` lukess@adrianoliver.dev ` o similar. |
| **Liberación de reservas** | 🟡 Media | Implementar lógica para decrementar `reserved_qty` cuando una orden se cancela o expira (no solo pickups). |
| **Carrito persistente en Supabase** | 🟡 Media | Guardar el estado del carrito en Supabase para usuarios logueados, permitiendo continuación del carrito entre dispositivos. |
| **Review/calificaciones** | 🟡 Media | Sistema de reviews por producto con calificación por estrellas, integrado con el historial de pedidos completados. |
| **Wishlist en Supabase** | 🟡 Media | Sincronizar la wishlist de localStorage a Supabase para usuarios logueados (igual que el carrito). |
| **Búsqueda full-text** | 🟡 Media | Supabase tiene soporte nativo para FTS (full-text search). Implementar búsqueda por nombre, descripción, colección. |
| **Restricción de dominios de imagen** | 🟢 Baja | Reemplazar `hostname: "**"` por una whitelist de dominios explícita en `next.config.ts`. |
| **Eliminación de lib/products.ts** | 🟢 Baja | Remover el catálogo estático legacy y la ruta `/test-productos` en el siguiente cleanup. |
| **TypeScript strict en Stripe items** | 🟢 Baja | Reemplazar `(item: any)` en la creación de Stripe session con la interface tipada correcta. |

---

## 19. PITCH PARA PORTAFOLIO / CASE STUDY

### Headline para portafolio

> **Lukess Home — E-commerce boliviano con inventario en tiempo real, WhatsApp nativo y Stripe**  
> *Next.js 15 + Supabase + React 19 — Full-stack solo developer en 17 bloques*

### Descripción ejecutiva

Lukess Home es un e-commerce de ropa masculina construido desde cero para digitalizar un negocio físico de más de 10 años con 3 puestos en el Mercado Mutualista de Santa Cruz, Bolivia. El proyecto resolvió la necesidad real de un comerciante local de vender online sin depender de Shopify ni pagar comisiones de plataforma, adaptando el stack a los métodos de pago locales (QR de banco boliviano), al canal de comunicación preferido del mercado boliviano (WhatsApp), y a las limitaciones de infraestructura del contexto.

El ecosistema completo comprende dos aplicaciones que comparten la misma base de datos Supabase: esta landing de e-commerce público (Lukess Home) y el panel admin POS interno (Lukess Inventory System). La landing consulta en tiempo real el stock del inventario, mostrando exactamente qué hay disponible y bloqueando reservas al confirmar un pedido para evitar overselling. Los banners del hero se gestionan desde el panel admin y se publican instantáneamente en la landing sin redeploy.

El checkout está diseñado sin fricción para el contexto local: funciona sin login, acepta solo nombre y teléfono como datos mínimos, y ofrece tres métodos de pago: QR/transferencia bancaria (flujo principal de Bolivia), pago en efectivo al retirar en tienda, y Stripe para tarjeta de crédito. Al confirmar, el sistema envía notificaciones automáticas por WhatsApp via Meta Cloud API con templates pre-aprobados, y por email con templates HTML premium oscuros via Resend. El Inventory System a su vez usa los mismos endpoints de notificación (CORS abierto) para actualizar al cliente en cada cambio de estado del pedido.

El proyecto fue completado en 17 bloques de desarrollo durante febrero-marzo 2026, alcanzando un LCP de 2.5 segundos (optimizado desde 5.6s con el sistema de imágenes dual), integración completa de Google Analytics 4 con eventos de e-commerce, Microsoft Clarity para heatmaps, y un sitemap XML dinámico. Está production-ready y desplegado en https://lukess-home.vercel.app.

### Tabla de números del proyecto

| Métrica | Valor |
|---|---|
| Páginas totales de la app | ~22 páginas (homepage + 21 rutas) |
| API Routes (Route Handlers) | 7 endpoints |
| Server Actions | 2 (`categories.ts`, `filters.ts`) |
| Tablas principales de DB | 8+ (products, categories, inventory, locations, orders, order_items, customers, discount_codes, subscribers, banners) |
| RPCs de Supabase | 3+ (`reserve_order_inventory`, `consume_order_discount`, `getDynamicFilters`) |
| Tipos de email implementados | 10 tipos diferentes |
| Templates de WhatsApp | 6+ templates de Meta |
| Líneas del archivo más grande | ~3,500+ líneas (CheckoutModal.tsx — 130KB) |
| Bloques de desarrollo completados | 21 bloques |
| Reducción de LCP | 5.6s → 2.5s (-55%) |
| Métodos de pago | 3 (QR, efectivo, Stripe) |
| Stack de analytics | 3 (GA4, Vercel Analytics, Microsoft Clarity) |
| Tamaño total del bundled repo | ~4.8 MB (`_bundled_repo.txt`) |

### Tecnologías a destacar

- ✅ **Next.js 15 App Router** — Server Components nativos, API Routes, Server Actions
- ✅ **React 19** — Concurrent features, new hooks
- ✅ **TypeScript estricto** — `strict: true`, cero `any` (salvo deuda técnica conocida)
- ✅ **Tailwind CSS v4** — Configuración via `@theme` block, zero config files
- ✅ **Supabase** — PostgreSQL + Auth + Storage + RLS + RPCs + SSR adapters
- ✅ **Stripe** — Checkout Sessions + Webhook verification en BOB
- ✅ **Resend** — 10 tipos de email con templates HTML premium dark
- ✅ **Meta WhatsApp Cloud API** — Templates de negocio aprobados, notificaciones automáticas
- ✅ **Framer Motion / motion/react** — Animaciones fluidas en carrito y galería
- ✅ **Google Analytics 4** — E-commerce events completos (view_item → purchase)
- ✅ **Microsoft Clarity** — Session recordings y heatmaps
- ✅ **React Leaflet** — Mapas interactivos para selector de entrega por GPS
- ✅ **Blog Markdown** — SEO local con gray-matter + remark
- ✅ **Vercel Analytics** — Custom events + pageviews
- ✅ **Vercel** — Deploy automático, Edge Network, `removeConsole` en producción

### Pitch rápido de 30 segundos (en español)

> "Construí un e-commerce completo para una tienda de ropa boliviana de 10 años. La app conecta en tiempo real con un panel admin compartido por Supabase: el stock que ve el cliente es el stock real del negocio. El checkout funciona sin login, acepta QR bancario boliviano, efectivo en tienda o Stripe, y envía notificaciones automáticas por WhatsApp via Meta API. Son dos apps que parecen una sola — landing e inventario — al costo de cero comisiones de plataforma. Next.js 15, React 19, TypeScript estricto."

---

## APÉNDICE: ARQUITECTURA DE SEGURIDAD RESUMIDA

```
                        ┌─────────────────────────────────────┐
                        │         CLIENTE (Browser)            │
                        │  - Supabase Anon Key (RLS enforced)  │
                        │  - Stripe Publishable Key            │
                        │  - NO service_role, NO secret keys   │
                        └─────────────────┬───────────────────┘
                                          │
                        ┌─────────────────▼───────────────────┐
                        │         SERVIDOR (Next.js)           │
                        │  API Routes / Server Actions         │
                        │  - SUPABASE_SERVICE_ROLE_KEY         │
                        │  - STRIPE_SECRET_KEY                 │
                        │  - STRIPE_WEBHOOK_SECRET             │
                        │  - RESEND_API_KEY                    │
                        │  - WHATSAPP_API_TOKEN                │
                        │  + Honeypot anti-bot                 │
                        │  + Rate limiting (en memoria)        │
                        │  + Validación server-side de cupones │
                        └─────────────────┬───────────────────┘
                                          │
                        ┌─────────────────▼───────────────────┐
                        │           SUPABASE                   │
                        │  PostgreSQL + Auth + Storage         │
                        │  RLS policies por tabla              │
                        │  RPCs con lógica de negocio          │
                        │  Storage bucket 'payment-receipts'   │
                        │  (bucket privado, no público)        │
                        └─────────────────────────────────────┘
```

---

*Auditoría generada el 2026-03-18 a las 23:46 (UTC-4) por Antigravity AI Agent.*  
*Basada en revisión directa de código fuente del workspace local `C:\LukessHome\lukess-landing-ecommerce`.*  
*Archivos analizados: package.json, next.config.ts, globals.css, lib/types.ts, lib/products.ts, lib/analytics.ts, lib/banners.ts, lib/context/CartContext.tsx, app/layout.tsx, app/page.tsx, app/api/checkout/route.ts, app/api/send-email/route.ts, app/api/send-whatsapp/route.ts, app/api/webhooks/stripe/route.ts, app/api/upload-receipt/route.ts, app/api/subscribe/route.ts, app/api/reserve-order/route.ts, .agent/.context/activeContext.md, supabase/migrations/\*, supabase/add-discount-new-fields.sql.*
