# activeContext.md — lukess-home (Landing Page)
**Last Updated:** 2026-02-26
**Updated By:** Antigravity Agent

---

## CURRENT BLOCK
- **Block Number:** 9b-A
- **Block Name:** Bugs + Fixes Urgentes — Parte A
- **Status:** PENDING
- **Started:** —

---

## STACK
| Layer | Version |
|---|---|
| Next.js | 16.1.6 (App Router only — never Pages Router) |
| React | 19.2.x |
| TypeScript | 5.9.x strict (no `any`, explicit return types) |
| Tailwind CSS | v4.1.18 (config in `@theme` block in CSS, not tailwind.config.ts) |
| Supabase SSR | 0.8.x |
| motion | ^12.34.3 (package name: `motion`, NOT `framer-motion`) |
| tailwindcss-motion | ^1.1.1 (CSS plugin, for micro-interaction utilities) |

---

## ANIMATION RULE
| Use case | Library |
|---|---|
| Micro-interactions (hover, tap, simple fade) | `tailwindcss-motion` CSS utility classes |
| Complex animations (scroll-driven, gestures, layout) | `motion/react` — import `{ motion, AnimatePresence, useScroll, useTransform }` |
| **NEVER use** | ~~`framer-motion`~~ (removed — use `motion/react` instead) |

---

## CRITICAL ENV VARS
```
NEXT_PUBLIC_WHATSAPP_NUMBER=72643753
```
> ⚠️ Was hardcoded as `76020369` in ~20 files. All references must use this env var.

---

## SUPABASE
- **Project ID:** `lrcggpdgrqltqbxqrnjgh`
- **Types file:** `types/database.types.ts` — regenerate after every migration
- **Server client:** `@/lib/supabase/server`
- **Client client:** `@/lib/supabase/client`

---

## DEPLOY URLS
- Landing: https://lukess-home.vercel.app
- Inventory: https://lukess-inventory-system.vercel.app

---

## DESIGN TOKEN — DO NOT DUPLICATE
```css
--color-accent-500: #c89b6e;  /* único dorado — ya en globals.css */
```

---

## OPEN BUGS
| ID | Description | Priority |
|---|---|---|
| BUG-WA | ~20 files have hardcoded WhatsApp `76020369` — must use `NEXT_PUBLIC_WHATSAPP_NUMBER` | 🔴 CRITICAL |
| BUG-07 | `CatalogoClient` — hash/searchParams useEffect causes hydration warning | 🔴 HIGH |
| BUG-04 | `recipientName` pre-fill only captures first character typed | 🟡 MEDIUM |
| BUG-05 | No `scrollTo({top:0})` when switching modal steps (form → qr → success) | 🟡 MEDIUM |
| BUG-06 | "⚠️ Últimas X" badge appears 3× simultaneously in ProductDetail | 🟡 MEDIUM |
| BUG-01 | QR image overflows on screens < 360px — needs `max-w-[280px]` in CheckoutModal | 🟢 LOW |

---

## LAST COMPLETED BLOCK
- **Block:** Cleanup-01 — framer-motion removal + Memory Bank setup
- **Completed:** 2026-02-26
- **Files Changed:**
  - `app/globals.css` — removed duplicate `@import "tailwindcss"`
  - `components/layout/Navbar.tsx` — `framer-motion` → `motion/react`
  - `components/home/UbicacionSection.tsx` — `framer-motion` → `motion/react`
  - `components/home/TestimoniosSection.tsx` — `framer-motion` → `motion/react`
  - `components/home/PuestosSection.tsx` — `framer-motion` → `motion/react`
  - `components/home/HeroSection.tsx` — `framer-motion` → `motion/react`
  - `components/home/CTAFinalSection.tsx` — `framer-motion` → `motion/react`
  - `components/home/CatalogoSection.tsx` — `framer-motion` → `motion/react`
  - `.context/activeContext.md` — created
  - `.context/systemPatterns.md` — created
  - `.agent/skills/startblock.md` — created
  - `.agent/skills/qa.md` — created

---

## NEXT BLOCK
- **Block:** 9b-A
- **Name:** Bugs + Fixes Urgentes — Parte A
- **Scope:** WhatsApp centralization (`NEXT_PUBLIC_WHATSAPP_NUMBER` across 20 files) + BUG-07 (CatalogoClient hash/searchParams)
- **Dependencies:** None

---

## BLOCK HISTORY
| Block | Name | Status | Date |
|---|---|---|---|
| Cleanup-01 | framer-motion removal + Memory Bank | ✅ DONE | 2026-02-26 |
| 9b-A | Bugs + Fixes Urgentes A | ⬜ PENDING | — |
| 9b-B | Bugs + Fixes Urgentes B | ⬜ PENDING | — |
| 9c-A | Inventario: BD + formulario descuentos/is_new | ⬜ PENDING | — |
| 9c-B | Inventario: Upload múltiples imágenes | ⬜ PENDING | — |
| 9d-A | Landing: Badges + Galería múltiple | ⬜ PENDING | — |
| 9d-B | Landing: Banner + Códigos descuento + Tallas | ⬜ PENDING | — |
| 9e-A | Visual Polish: Footer + Navbar mobile | ⬜ PENDING | — |
| 9e-B | Mobile-first general + Checkout mobile | ⬜ PENDING | — |
| 9f | SEO completo | ⬜ PENDING | — |
| 9g-A | Investigación dominio + branding | ⬜ PENDING | — |
| 9g-B | Dominio + Deploy final producción | ⬜ PENDING | — |
