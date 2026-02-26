# activeContext.md — lukess-home
_Última actualización: 22/02/2026 - 1:00 AM_

## Estado actual: PRODUCCIÓN ✅
URL: https://lukess-home.vercel.app
Stack: Next.js · Supabase · Tailwind · TypeScript · Resend · WhatsApp Cloud API

---

## ✅ Implementado y funcionando

### Core e-commerce
- Catálogo con filtros avanzados multiselección (categoría, subcategoría, marca, color, talla, precio, colección)
- Búsqueda inteligente en tiempo real (nombre, marca, categoría, SKU, colores, tallas)
- Carrito con persistencia en localStorage
- Quick View Modal + página de detalle por producto
- Wishlist con Context API
- Stock por talla — tallas agotadas disabled + "⚠️ Últimas X"
- Badges: NUEVO, descuento %, colección

### Checkout y pagos
- Checkout 3 pasos: datos → pago QR Yolo Pago → confirmación
- Upload de comprobante de pago a Supabase Storage
- Reserva de stock al marcar "Ya Pagué" vía RPC `reserve_order_inventory`
- `revalidatePath` post-reserva para invalidar caché de Next.js

### Notificaciones automáticas (al marcar "Ya Pagué")
- Email confirmación al cliente — Resend ✅
- Email notificación al admin con foto del comprobante — Resend ✅
- WhatsApp al cliente via plantilla `pedido_recibido` ⏳ (pendiente verificar — plantillas en revisión en Meta)

### Auth y pedidos
- Login obligatorio solo al momento de pagar (Bloque 4a)
- Página /mis-pedidos funcional con historial del cliente (Bloque 4b)

### Páginas informativas
- /como-comprar · /guia-tallas · /metodos-pago · /politicas-envio
- /politicas-cambio · /terminos · /privacidad · /sobre-nosotros
- /preguntas-frecuentes · /cuidado-prendas · /plazos-entrega

---

## ⏳ Pendiente verificar mañana

### WhatsApp — prueba end-to-end
- Verificar en Meta que plantilla `pedido_recibido` esté aprobada
- Hacer pedido de prueba con notify_whatsapp = true
- Confirmar en Vercel logs: `POST /api/send-whatsapp → 200`
- Confirmar que llega mensaje al WhatsApp del cliente

---

## 🔜 Próximos bloques

### 9a — GA4: setup + eventos ecommerce
- Instalar gtag / next-gtag
- Eventos: view_item, add_to_cart, begin_checkout, purchase
- Variables de entorno: NEXT_PUBLIC_GA_MEASUREMENT_ID

### 9b — SEO: meta tags dinámicos + sitemap + schema markup
- metadata dinámica por producto (generateMetadata)
- sitemap.xml automático
- Schema markup: Product, BreadcrumbList, Organization

### 9c — Pulido visual: múltiples fotos + bugs menores
- Galería de imágenes por producto (campo `images[]` ya existe en BD)
- Bugs anotados durante el desarrollo

### 9d — Dominio lukesshome.com + deploy final producción
- Configurar dominio en Vercel
- Variables de entorno producción verificadas
- Deploy final

---

## 🗂️ Archivos clave

| Archivo | Propósito |
|---|---|
| `app/page.tsx` | Página principal Server Component |
| `components/cart/CheckoutModal.tsx` | Checkout 3 pasos + Ya Pagué |
| `app/api/send-email/route.ts` | Emails centralizados (Resend) |
| `app/api/send-whatsapp/route.ts` | WhatsApp Cloud API centralizado |
| `app/api/checkout/route.ts` | RPC reserva stock + revalidatePath |
| `context/CartContext.tsx` | Estado global carrito |
| `context/WishlistContext.tsx` | Estado global favoritos |
| `lib/supabase/` | Clientes server/client Supabase |

---

## 🔑 Variables de entorno activas
- NEXT_PUBLIC_SUPABASE_URL ✅
- NEXT_PUBLIC_SUPABASE_ANON_KEY ✅
- RESEND_API_KEY ✅
- RESEND_FROM_EMAIL ✅
- WHATSAPP_PHONE_NUMBER_ID ✅
- WHATSAPP_ACCESS_TOKEN ✅
- WHATSAPP_API_VERSION=v21.0 ✅
- NEXT_PUBLIC_WHATSAPP_NUMBER=59176020369 ✅
- NEXT_PUBLIC_SITE_URL ✅

---

## 📌 Reglas críticas del proyecto
- Single-tenant — NO existe organization_id en ninguna tabla
- Proyectos separados pero comparten el mismo Supabase
- Siempre `revalidatePath` después de mutaciones que afecten el catálogo
- Nuevo chat por cada bloque en Cursor
- Plan Mode (Shift+Tab) para bloques que toquen más de 3 archivos
