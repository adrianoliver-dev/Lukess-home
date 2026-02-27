# activeContext.md — lukess-home (Landing Page)
**Last Updated:** 2026-02-27
**Updated By:** Antigravity Agent

---

## CURRENT BLOCK
- **Block Number:** —
- **Block Name:** —
- **Status:** —
- **Started:** —
- **Completed:** —

---

## LAST COMPLETED BLOCK
- **Block Number:** 10-E.1
- **Block Name:** Polish Sprint: Brand Foundation & Global Constants
- **Completed:** 2026-02-27
- **Commit:** 8a75be2

### Files Changed
- `lib/utils/whatsapp.ts` — Defined global `WHATSAPP_NUMBER` and updated `buildWhatsAppUrl`
- `components/landing/HeroSection.tsx` — Replaced hardcoded WhatsApp links
- `components/landing/AnnouncementBar.tsx` — Replaced hardcoded WhatsApp links
- `components/cart/CheckoutModal.tsx` — Replaced hardcoded numbers (76020369) and URLs
- `components/producto/SizeGuideModal.tsx` — Added size guides for Gorras, Sombreros, Cinturones
- `app/globals.css` — Enforced bg-white/text-gray-900, removed old color variables
- *Multiple Components* — Replaced `bg-primary-*` and `text-primary-*` with default Tailwind classes via global find-and-replace scripts.

### DB Changes
None

### Build Verification
✅ `npm run build` — 0 errors, exit code 0
✅ Browser Verification — Desktop & mobile layouts checked

---

## OPEN ISSUES
1. `/cart` route returns 404 while cart drawer renders on top
2. Checkout pre-fills with "admin" / "admin@lukesshome.com"
3. Category card images are gray placeholders
4. POS page stuck on loading skeleton
5. "Fosiil" typo in Supabase product data
6. Remaining hardcoded hex colors in CheckoutModal (mostly `#c89b6e` inline for non-Tailwind contexts)

---

## NEXT BLOCK
- **Block:** 9e-B
- **Name:** Mobile-first general + Checkout mobile
- **Dependencies:** 10-D
- **Scope:** Checkout UX, mobile responsiveness pass

---

## BLOCK HISTORY
| Block | Name | Status | Date | Commit |
|---|---|---|---|---|
| Cleanup-01 | framer-motion removal + Memory Bank | ✅ DONE | 2026-02-26 | pending |
| 9b-A | Bugs + Fixes Urgentes A | ✅ DONE | 2026-02-26 | 7a0d980 |
| 9b-B | Bugs + Fixes Urgentes B | ✅ DONE | 2026-02-26 | dc0d079 |
| 9c-A | Inventario: BD + formulario descuentos/is_new | ✅ DONE | — | — |
| 9c-B | Inventario: Upload múltiples imágenes | ✅ DONE | — | — |
| 9d-A | Landing: Badges + Galería múltiple | ✅ DONE | 2026-02-26 | 7956e0f |
| 9d-B | Landing: Banner + Códigos descuento | ✅ DONE | 2026-02-26 | 5b18fcc |
| 9e-A | Visual Polish: Footer + Navbar mobile | ✅ DONE | 2026-02-27 | pending |
| 10-AB | Polish Sprint: Global UI + Product Cards | ✅ DONE | 2026-02-27 | pending |
| 10-C | Polish Sprint: PDP Redesign (Totto style) | ✅ DONE | 2026-02-27 | 65ef4b3 |
| 10-D | Polish Sprint: Hero & Trust redesign | ✅ DONE | 2026-02-27 | 184d5c0 |
| 10-E.1 | Polish Sprint: Brand Foundation | ✅ DONE | 2026-02-27 | 8a75be2 |
| 9e-B | Mobile-first general + Checkout mobile | ⬜ PENDING | — | — |
| 9f | SEO completo | ⬜ PENDING | — | — |
| 9g-A | Investigación dominio + branding | ⬜ PENDING | — | — |
| 9g-B | Dominio + Deploy final producción | ⬜ PENDING | — | — |
