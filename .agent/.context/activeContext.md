# activeContext.md — lukess-home (Landing Page)
**Last Updated:** 2026-03-06
**Updated By:** Adrian Oliver (Agent Update — Block 17-F)

---

## PROJECT PHASE
**Phase 3: Pre-Documentation & Handover**
**Status: FEATURE-COMPLETE — Production Ready**
All development blocks completed. Awaiting client data validation (Aldrin) before Block 17 (final presentation documents).

---

## CURRENT BLOCK
- **Block Number:** B11.A.4
- **Block Name:** Performance Fixes & SEO Complete
- **Status:** ✅ DONE
- **Completed:** 2026-03-25
- **Commit:** `beb2e96` (Landing Build Fix) / `95a396d` (Landing) / `75a2ec0` (Inventory)

### Files Changed
- `components/home/HeroBannerCarousel.tsx` — Refactored to use Next.js `<Image>` with correct `priority` logic for the first slide to improve LCP.
- `app/layout.tsx` — Deferred GTM/GA4 using `next/script` with `strategy="lazyOnload"`.
- `components/analytics/MicrosoftClarity.tsx` — Refactored to use `next/script` with `strategy="lazyOnload"`.
- `app/page.tsx` & `components/home/HomeClientWrapper.tsx` — Implemented `IntersectionObserver` for Google Maps lazy loading (saving ~435KB on initial load) and added `LocalBusiness` JSON-LD.
- `package.json` — Updated `browserslist` target for modern browsers.
- `app/producto/[id]/page.tsx` — Refined `Product` JSON-LD schema.
- `public/llms.txt` — [NEW] Created AI search engine documentation.
- `app/sitemap.ts` — Updated with static routes and dynamic blog post integration.
- `app/robots.ts` — Secured `/auth` and `/mis-pedidos` paths.

### DB Changes
- None required.

---

## STACK
| Layer | Version |
|---|---|
| Next.js | 15 (App Router only — never Pages Router) |
| React | 19.x |
| TypeScript | 5.x strict (no `any`, explicit return types) |
| Tailwind CSS | v4 (config in `@theme` block in CSS, not tailwind.config.ts) |
| Supabase SSR | 0.8.x |
| motion | ^12.x (package name: `motion`, NOT `framer-motion`) |
| tailwindcss-motion | ^1.x (CSS plugin, for micro-interaction utilities) |

---

## ANIMATION RULE
| Use case | Library |
|---|---|
| Micro-interactions (hover, tap, simple fade) | `tailwindcss-motion` CSS utility classes |
| Complex animations (scroll-driven, gestures, layout) | `motion/react` — import `{ motion, AnimatePresence, useScroll, useTransform }` |
| **NEVER use** | ~~`framer-motion`~~ (removed — use `motion/react` instead) |

---

## CRITICAL ENV VARS
NEXT_PUBLIC_WHATSAPP_NUMBER=72643753
NEXT_PUBLIC_SITE_URL=https://lukess-home.vercel.app

text
> ⚠️ WhatsApp was hardcoded as `76020369` in ~20 files. All references now use the env var. NEVER hardcode the number again.

---

## CRITICAL RULES (LEARNED FROM BUGS)
> ⛔ NEVER rename TypeScript interface properties that map directly to Supabase column names without a DB migration first. The DB column name is the source of truth at runtime. (`images` vs `gallery` bug — March 4, 2026)
> ⛔ NEVER rewrite entire components in one prompt if the file is >300 lines. Use scoped edits.
> ⛔ NEVER run DB column renames without updating `database.types.ts` first.

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
OPEN BUGS (Post-Feature-Complete)
ID	Description	Priority
BUG-04	recipientName pre-fill only captures first character typed	🟡 MEDIUM
BUG-05	No scrollTo({top:0}) when switching modal steps (form → qr → success)	🟡 MEDIUM
BUG-06	"⚠️ Últimas X" badge may appear multiple times in ProductDetail	🟡 MEDIUM
BUG-01	QR image overflows on screens < 360px	🟢 LOW
LAST COMPLETED BLOCK
Block: 17-M — QA WhatsApp Templates Alignment

Completed: 2026-03-07

Commit: PENDING — fix(whatsapp): update template variables for pago en tienda and sync template-router

BLOCK HISTORY
Block	Name	Status	Date	Commit
Block	Name	Status	Date	Commit
Cleanup-01	framer-motion removal + Memory Bank setup	✅ DONE	2026-02-26	—
9b-A	WhatsApp centralization (20 files → env var)	✅ DONE	2026-02-27	—
9b-B	Bugs + Fixes Urgentes B	✅ DONE	2026-02-27	—
9c-A	Discount codes system + is_new flag	✅ DONE	2026-02-28	630e701
9d-A/B	Banner carousel + Dynamic Hero (desktop/mobile)	✅ DONE	2026-02-28	35af00c
10-J	Order creation on payment confirm + order history	✅ DONE	2026-02-28	f7ea6c2
10-K	Order history full info (shipping, location, timer)	✅ DONE	2026-02-28	f7ea6c2
10-H	UX — QR download mobile + checkout autofill from last order	✅ DONE	2026-03-03	b8ff0da
13-C/D/E	Discount consumption end-to-end (cart → order → history)	✅ DONE	2026-03-01	6e11a4d
15-A	Vercel Web Analytics + GA4 custom events	✅ DONE	2026-03-01	83f1a91
15-B	WhatsApp API — Backend trigger (checkout → WA notification)	✅ DONE	2026-03-01	1a92b56
15-B-fix	WhatsApp deterministic policy + validation warnings	✅ DONE	2026-03-01	e7a4665
16-A	Source cleanup (console.logs + dead code removal)	✅ DONE	2026-03-03	d0c7807
16-B	Blog system — Markdown architecture + 5 SEO posts	✅ DONE	2026-03-02	b23f45e
16-C	Footer overhaul — 15+ legal/info pages + Size Guide + FAQ	✅ DONE	2026-03-03	fd9162e
16-D	Filter Wars — Dynamic filters, color swatches, RPC	✅ DONE	2026-03-03/04	0cb4d0b
16-E	Analytics — Microsoft Clarity + Google Search Console	✅ DONE	2026-03-04	6a50fc9
16-F	SEO — sitemap env var, GSC HTML verification, metadataBase	✅ DONE	2026-03-04	d2b7496
16-G	Dynamic Hero Banner CMS (desktop/mobile from Supabase)	✅ DONE	2026-03-04	2d0198f
16-H	Performance — Dual Image System, LCP 5.6s→2.5s, thumbnail_url	✅ DONE	2026-03-04	7f509a8
16-H-fix	Gallery bug fix (images vs gallery, duplicate hero)	✅ DONE	2026-03-05	115d769
16-D-C	Memory Bank + Rules Update	✅ DONE	2026-03-05	—
17-A-3.2	Auto-expire pickup reservations after 48h	✅ DONE	2026-03-05	fac6f85
17-B-A-1	Fix Checkout receipt flow and Admin Email recipient	✅ DONE	2026-03-05	3ea40c8
17-C	Premium Email Templates	✅ DONE	2026-03-05	pending
17-F	Checkout Bug Fix & Final Notification QA	✅ DONE	2026-03-06	pending
17-I	Landing Email Builder & WhatsApp Updates	✅ DONE	2026-03-07	f14e41f
17-O	Mega Audit Generation	✅ DONE	2026-03-18	—
17	Final Presentation Documents (Block Commercial)	⬜ PENDING	—	—
