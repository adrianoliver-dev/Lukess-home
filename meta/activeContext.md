# activeContext.md — lukess-home (Landing Page)
**Last Updated:** 2026-02-27T18:34-04:00
**Updated By:** Antigravity Agent

---

## CURRENT BLOCK
- **Block Number:** 10-H.4
- **Block Name:** Fix Size Guide visibility (Unitalla)
- **Status:** ✅ DONE
- **Started:** 2026-02-27
- **Completed:** 2026-02-27

---

## LAST COMPLETED BLOCK
- **Block Number:** 10-H.4
- **Block Name:** Fix Size Guide visibility (Unitalla)
- **Completed:** 2026-02-27
- **Commit:** pending

### Files Changed
- `components/producto/ProductDetail.tsx` — Refactored size selector to show "Guía de Tallas" even when `needsSize` is false (e.g., Gorras/Cinturones). Added "Talla Única" fallback display to maintain UI consistency.

### Database Changes
- None

### Build Verification
✅ `npm run build` exit code 0 — 22 pages, no errors.

---

## OPEN ISSUES
1. `/cart` route returns 404 while cart drawer renders on top
2. Checkout pre-fills with "admin" / "admin@lukesshome.com"
3. Category card images are gray placeholders
4. POS page stuck on loading skeleton
5. "Fosiil" typo in Supabase product data

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
| 10-E.2 | Polish Sprint: Navbar & Footer Redesign | ✅ DONE | 2026-02-27 | 13eecc3 |
| 10-E.4 | Polish Sprint: Navbar & Footer Functional Fixes | ✅ DONE | 2026-02-27 | f05ebd8 |
| 10-E.5 | Extreme Polish: Navbar Dropdown & Side Cart | ✅ DONE | 2026-02-27 | 6470845 |
| 10-E.5b | Fix Pickup Locations & Catalog Routing | ✅ DONE | 2026-02-27 | c2fc2d0 |
| 10-E.6-A | Fix All Store Maps Links | ✅ DONE | 2026-02-27 | c221afb |
| 10-E.6-B | Category Restructure | ✅ DONE | 2026-02-27 | 98b2024 |
| 10-E.3 | CartDrawer & CheckoutModal Branding Polish | ✅ DONE | 2026-02-27 | 26fac30 |
| 10-F | Cart discount fix + Size Guide Shorts/Billeteras | ✅ DONE | 2026-02-27 | 4899abb |
| 10-G | Restructure Footer & Polish Size Guide | ✅ DONE | 2026-02-27 | f308958 |
| 10-I | Radical UX/UI cleanup of Checkout stages | ✅ DONE | 2026-02-27 | a69df6c |
| 10-H.1 | Fix Size Guide whitelist (belts/hats) | ✅ DONE | 2026-02-27 | a7ca5c4 |
| 10-H.2 | Fix Size Guide whitelist & Checkout dual buttons | ✅ DONE | 2026-02-27 | a80630c |
| 10-H.3 | Hash anchor navigation cross-route | ✅ DONE | 2026-02-27 | b4bb562 |
| 10-H.4 | Fix Size Guide visibility (Unitalla) | ✅ DONE | 2026-02-27 | pending |
| 9e-B | Mobile-first general + Checkout mobile | ⬜ PENDING | — | — |
| 9f | SEO completo | ⬜ PENDING | — | — |
| 9g-A | Investigación dominio + branding | ⬜ PENDING | — | — |
| 9g-B | Dominio + Deploy final producción | ⬜ PENDING | — | — |
