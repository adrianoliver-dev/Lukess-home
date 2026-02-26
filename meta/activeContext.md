# activeContext.md — lukess-home (Landing Page)
**Last Updated:** 2026-02-26
**Updated By:** Antigravity Agent

---

## CURRENT BLOCK
- **Block Number:** 9b-B
- **Block Name:** Bugs + Fixes Urgentes — Parte B
- **Status:** PENDING
- **Started:** —

---

## LAST COMPLETED BLOCK
- **Block Number:** 9b-A
- **Block Name:** Bugs + Fixes Urgentes — Parte A
- **Completed:** 2026-02-26
- **Commit:** 7a0d980

### Files Changed
- `lib/utils/whatsapp.ts` — extracted WhatsApp logic to single source of truth
- `components/home/CatalogoClient.tsx` — removed DOM events/hash location; implemented next/navigation hooks
- `components/home/PromoBanner.tsx` — updated URL query syntax
- `components/layout/Navbar.tsx` — updated URL query syntax
- `components/layout/Footer.tsx` — removed hardcoded WhatsApp
- `components/home/UbicacionSection.tsx` — removed hardcoded WhatsApp
- `components/home/HeroSection.tsx` — removed hardcoded WhatsApp
- `components/home/CTAFinalSection.tsx` — removed hardcoded WhatsApp
- `components/home/CatalogoSection.tsx` — removed hardcoded WhatsApp
- `components/wishlist/WishlistClient.tsx` — removed hardcoded WhatsApp
- `components/producto/SizeGuideModal.tsx` — removed hardcoded WhatsApp
- `components/producto/ProductDetail.tsx` — removed hardcoded WhatsApp
- `components/cart/CheckoutModal.tsx` — removed hardcoded WhatsApp
- `app/api/send-email/route.ts` — removed hardcoded WhatsApp
- `app/` (all 8 static legal/info pages) — removed hardcoded WhatsApp

### DB Changes
None.

### Build Status
✅ Local checks complete. SearchParams logic migrated successfully without hydration issues.

---

## OPEN ISSUES
- [x] BUG-WA: ~20 files have hardcoded WhatsApp `76020369` — must use `NEXT_PUBLIC_WHATSAPP_NUMBER=72643753`
- [x] BUG-07: `CatalogoClient` — hash/searchParams useEffect causes hydration warning
- [ ] BUG-04: `recipientName` pre-fill only captures first character typed
- [ ] BUG-05: No `scrollTo({top:0})` when switching modal steps (form → qr → success)
- [ ] BUG-06: "⚠️ Últimas X" badge appears 3× simultaneously in ProductDetail
- [ ] BUG-01: QR image overflows on screens < 360px → `max-w-[280px]` in CheckoutModal
- [ ] CRITICAL: Newsletter (Footer + Popup) saves to localStorage only — needs Supabase `subscribers` table
- [ ] CRITICAL: Countdown timer recalculates on every reload (always shows 3 days) — needs fixed date
- [ ] BUG: PromoBanner area not fully clickable — only CTA button triggers navigation
- [ ] BUG: `useRouter` imported but never used in PromoBanner.tsx (dead code)
- [ ] BUG: Hero image is Unsplash URL (external dependency) — needs local asset
- [ ] TODO: `handleNewsletterSubmit` in Footer.tsx → replace localStorage with Supabase INSERT
- [ ] TODO: TikTok icon in Footer uses `<Send />` lucide icon (incorrect) — needs SVG replacement

---

## NEXT BLOCK
- **Block:** 9b-B
- **Name:** Bugs + Fixes Urgentes — Parte B
- **Dependencies:** 9b-A
- **Scope:** Fix remaining UI bugs (BUG-04, 05, 06, 01) and minor component bugs (PromoBanner, external URLs).

---

## BLOCK HISTORY
| Block | Name | Status | Date | Commit |
|---|---|---|---|---|
| Cleanup-01 | framer-motion removal + Memory Bank | ✅ DONE | 2026-02-26 | pending |
| 9b-A | Bugs + Fixes Urgentes A | ✅ DONE | 2026-02-26 | 7a0d980 |
| 9b-B | Bugs + Fixes Urgentes B | ⬜ PENDING | — | — |
| 9c-A | Inventario: BD + formulario descuentos/is_new | ⬜ PENDING | — | — |
| 9c-B | Inventario: Upload múltiples imágenes | ⬜ PENDING | — | — |
| 9d-A | Landing: Badges + Galería múltiple | ⬜ PENDING | — | — |
| 9d-B | Landing: Banner + Códigos descuento + Tallas | ⬜ PENDING | — | — |
| 9e-A | Visual Polish: Footer + Navbar mobile | ⬜ PENDING | — | — |
| 9e-B | Mobile-first general + Checkout mobile | ⬜ PENDING | — | — |
| 9f | SEO completo | ⬜ PENDING | — | — |
| 9g-A | Investigación dominio + branding | ⬜ PENDING | — | — |
| 9g-B | Dominio + Deploy final producción | ⬜ PENDING | — | — |
