# Auditoría Visual y de Código (B11.A.1) - Reporte Extendido
## Proyecto: Lukess Home E-commerce
## Fecha: 24 de Marzo de 2026

Este documento detalla exhaustivamente los hallazgos de la auditoría de código base y componentes visuales del e-commerce. Fue diseñado específicamente como hoja de ruta técnica para el bloque B11.A.1 (Visual Unification) y enumera, archivo por archivo, dónde existe deuda técnica de diseño, valores hardcodeados y oportunidades de mejora en accesibilidad, escalabilidad visual y rendimiento técnico.

---

## 1. DESIGN TOKEN SYSTEM (Sistema de Tokens y Tematización)

El proyecto utiliza **Tailwind CSS v4** mediante directivas de bloque `@theme` dentro de `app/globals.css`. Todo el branding del e-commerce recae teóricamente sobre este esquema unificado.

- **Tokens Base Detectados:**
  - `--color-lukess-gold`: Color dorado de acento primario (`#c89b6e`).
  - `--color-lukess-gold-light`: Variación para interactividades o fondos sútiles.
  - `--color-lukess-gold-dark`: Efectos hover o de profundidad (`#b8895e` aparente).
  - `--color-whatsapp`: Color verde nativo corporativo de la marca integrada (`#25D366`).
  - `--announcement-height`: Control dinámico de alturas fijas para sincronizar márgenes fijos.

### 🔴 Hallazgos: Ignorando el Design System
En una revisión visual exhaustiva de los Modales y Flujos globales Críticos, hallamos que se evitó el sistema base a favor de **arbitrary values (hex hardcodeados)**:

- **En `components/auth/AuthModal.tsx`:**
  - `bg-[#1a1a1a]` y `bg-[#111111]` dictaminan la superficie base en lugar de un neutral estándar como `bg-neutral-900`.
  - El botón primario de registro usa explícitamente `bg-[#c89b6e] hover:bg-[#b8895e] text-white` en duro, separándose por completo de las clases semánticas de Tailwind generadas desde el `globals.css` (debería usar la sintáxis `bg-lukess-gold`).
  - Los anillos de foco en formularios replican esta falla computando sintáxis sucia `focus:ring-[#c89b6e]/40`.

*Impacto Operativo*: Cualquier solicitud futura del cliente de transformar los colores primarios o experimentar con tonos requerirá un Find & Replace manual inseguro cruzando toda la base de componentes. 

---

## 2. COMPONENT CONSISTENCY (Uso y Abuso del Mapeo de UI)

A nivel arquitectura base, la base de código define componentes universales escalables dentro de la carpeta `components/ui/` (`Button.tsx`, `Card.tsx`, `Input.tsx`). 

### 🔴 Hallazgos: Orfandad de UI Components
**Muchos de los botones transaccionales ignoran completamente el uso de `<Button>` e integran código HTML en crudo:**

1. **`components/producto/ProductDetail.tsx`**
   - El botón principal de **Agregar al Carrito** abarca HTML suelto: 
     ```tsx
     <button className="w-full py-4 font-bold text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white">
     ```
   - *El Problema:* Ese botón es matemáticamente el clon exacto del `<Button variant="primary" size="lg" fullWidth>`. No usar el componente UI rompe el *Dry Principle*.
   - **Tarjetas Compuestas ("Productos Relacionados"):** También generadas mediante `div` aislados con estados básicos `<div className="relative aspect-[3/4] group...` sin reciclar ni invocar a su propio `<Card hover>` prop global.

2. **`components/cart/CartDrawer.tsx`**
   - El botón principal **"Proceder al Pago"** repite la incrustación manual:
     ```tsx
     <button className="w-full bg-gray-900 text-white hover:bg-black font-bold uppercase tracking-widest text-sm rounded-md transition-colors py-4">
     ```
   - *El Problema:* Al no abstraerlo a un componente, una decisión de cambio del equipo (por ejemplo, suavizar el texto con minúsculas u oscurecer la paleta) dejaría todos los cajones laterales desfasados.

3. **`components/auth/AuthModal.tsx`**
   - Utiliza pestañas personalizadas y entradas directas que rompen el marco, utilizando bordes de tipo `rounded-xl` interactuando contra los modales estándar que procesan `rounded-2xl` y los botones estándares `rounded-md`. ¡Esa simple diferencia de radios (border-radius) destruye la percepción visual subconsciente "premium"!

---

## 3. RESPONSIVE DESIGN & TOUCH TARGETS (Ergonomía Móvil Táctil)

Analizamos las directrices móviles (Minimum 44x44px Touch Target) orientadas al mercado móvil comercial latinoamericano, que forma gran parte del volumen de ventas objetivo para **Lukess Home**.

### 🟢 Aspectos Positivos
- Los controles de cantidad del **Detalle de Producto** (`w-12 h-12` -> 48px), y Selectores de Tallas (`min-w-[48px] h-12` -> 48px) cumplen brillantemente los estándares de oro para pantallas móviles.

### 🔴 Hallazgos: Fallas Ergonómicas Graves
- **`CartDrawer.tsx` (Controles de Cantidad):**
  - Los botones de incremento/decremento se componen como `w-7 h-7` (apenas 28x28px fijos) creando **Fat-Finger Syndromes** donde los compradores taparan accidentalmente fuera del botón.
  - El botón eliminar basa sus límites en un paddind `p-1.5` envolviendo un ícono miniatura de 16px, limitando gravemente el accionamiento limpio e incrementando fricción durante la lectura del carrito móvil.
- **`CheckoutModal.tsx` (Overflow Errors - BUG-01):**
  - Confirma que el ancho del modal y la densidad de píxeles para validación con el pago por QR rompe o desplaza contenidos en dispositivos con viewports angostos (por ej. iPhone 12/13 mini y Galaxy bases inferiores a 380px ancho).

---

## 4. IMAGE HANDLING & PERFORMANCE CORE WEB VITALS

El proyecto importa impecablemente los empaquetables modulares genéricos de `<Image />` desde `next/image`, evitando problemas de pre-renderizado acumulando Cumulative Layout Shift (CLS).

### 🔴 Hallazgos: Fuga de Ancho de Banda Móvil Feroz (Imágenes en Fill Status)
La base de código, cuando no asume un ancho/alto absoluto de prop en px, invoca agresivamente la propiedad `fill`. Si Next.JS desconoce `sizes`, enviará la máxima proporción al móvil.

1. **El Drawer del Carrito (`CartDrawer.tsx: 86`)**
   ```tsx
   <Image
      src={item.product.image_url || '/placeholder.png'}
      alt={item.product.name}
      fill
      className="object-cover"
   />
   ```
2. **Productos Relacionados (`ProductDetail.tsx: 408`)**
   ```tsx
   <Image src={p.thumbnail_url || p.image_url} fill className="object-contain..." />
   ```
*Impacto Directo*: Las imágenes pueden estar siendo entregadas al peso absoluto para retinas de 4k dentro del entorno del thumbnail de un celular de `w-20`. **Es inminente inyectar `sizes="(max-width: 768px) 100vw, 33vw"` a todas estas estructuras**, lo cual puede disparar las velocidades LCP entre un 30% a un 50% de manera colosal.

---

## 5. ANIMATIONS & MICRO-INTERACTIONS

Se confían tareas estéticas valiosas y transiciones lógicas entre vistas de Next.js mediante integridad robusta nativa o CSS properties. 

### 🔴 Hallazgos de Interacción Plana
- Faltan fuertemente estados de interactividad activa en los botones primarios a lo largo de catálogo y carritos (como `active:scale-[0.98]`). Para transmitir diseño vivo y respuesta kinésica, los botones de e-commerce transaccionales no pueden depender sólo de un mero `transition-colors`.
- **BUG-05 Detectado (`CheckoutModal.tsx`)**: La máquina de estados interactiva (Step='form' u 'options') entre componentes oculta bloques nativos en vez de rotar entre páginas, y el `useEffect` obvia enviar el script nativo para desplazar el usuario al cielo de la pantalla `scrollTo(0, 0)`. Quien navegue en móvil el proceso del Checkout será enviado directo a los pies del paso subsiguiente provocando un despiste altísimo causante de abandonos visuales. 

---

## 6. ACCESSIBILITY (A11Y) - FOCOS DE HARDWARE Y SCREEN READERS

Los lectores para capacidad digital mitigada o la jerarquía para tab-index.

### 🔴 Hallazgos: Silencio Semántico
Ningún botón interactivo constituido de elementos de `lucide-react` contiene descripciones de solo-lector. Los screen-readers dirán la palabra "botón" asumiendo ceguera visual.
- **Acciones Urgentes**:
  - `components/cart/CartDrawer.tsx: 65` `<X className="w-6 h-6" />` -> Necesario agregar al padre: `aria-label="Cerrar cajón"`.
  - Lo propio con botones `<Plus />`, `<Minus />`, `<Trash2 />` en todas las subpáginas y listados interactivos.

---

## 7. SEO METADATA & EMPTY STATES

Existen estructuras complejas que gestionan `json-Ld` que resuelven una inyección excelente. De igual modo la gestión del Fallback de estado vacío en carrito (Carrito Vacío - Agrega Productos) y la visualización del listado de error o agotamiento marcan alto calibre. 

*Detalles Finos:*
El pre-filling inteligente en `CheckoutModal` para `recipientName` y la validación de descuentos cruzada a emails específicos presenta redundancia visual en el bloque lógico (BUG-04 reportado) lo que amerita ser limpiado reescribiendo la dependencia el useEffect del Input subyacente de Customer Data.

---

## 📝 EXECUTIVE ACTION PLAN: CHECKLIST DEL DESARROLLADOR
*Basado en los reportes encontrados, el trabajo estructurado deberá abarcar el siguiente checklist definitivo y riguroso previo al commit log de Visual Unification.*

- [ ] **1. Consolidación Uniforme Global**: Purgar en `CartDrawer`, `ProductDetail` y `CheckoutModal` todo formato de `<button className="...">` duro, reemplazándolos con componentes universales abstractos importados de `components/ui/Button.tsx`. Normalizar además el uso unificado del redondeo (`rounded-xl` en Auth contra el base `rounded-md`).
- [ ] **2. Sustitución Completa Hex -> Design System**: Abstraer los colores hardcoded (`#1a1a1a`, `#111111`, y `#c89b6e`) en `AuthModal.tsx` con dependencias base semánticas configuradas y referidas de (`--color-lukess-gold`).
- [ ] **3. Parametrización y Optimización Image**: Exigir de manera innegociable los valores `sizes={'(max-width: 768px)...'}` en todas y cada una de las dependencias Next gen de catálogo y miniaturas, resolviendo fugas de LCP (carga visual primigenia).
- [ ] **4. Expansión Ergonómica de Padding Móvil**: Aumentar las áreas y anclajes táctiles y botones de cantidad/eliminación a por lo menos de ~`44x44px` perimetrales (ej. `w-11 h-11`). Cuidando de fallas ergonómicas operacionales a usuarios.
- [ ] **5. Restitución de Accesibilidad Semántica ARIA**: Insertar `aria-label`s en componentes dependientes totalmente de íconos del sistema Lucide o equivalentes. 
- [ ] **6. Prevención de Bugs Activos de Estado (`CheckoutModal.tsx`)**: Integrar control manual de Focus & ScrollTo top para subsanar el BUG-05 con `useRef()` o funciones asincrónicas puras en los cambios de pantallas por step conditional, sumado al correctivo reflush de formularios de `recipientName` (BUG-04).
