# PROJECT RULES — lukess-home (Landing Page + E-commerce)

## Project Identity
- **Repo**: FinanceNFT010/lukess-home (NOT lukess-inventory-system)
- **Deploy**: https://lukess-home.vercel.app
- **Purpose**: Public-facing landing page + checkout for Lukess Home clothing store in Santa Cruz, Bolivia
- **DB Project**: lrcggpdgrqltqbxqnjgh (Supabase sa-east-1)
- **Supabase Auth**: Google OAuth for buyers (not admins)

## Scope Boundaries
You work ONLY on files in this project.
NEVER touch files in lukess-inventory-system — that is a separate workspace.

## Critical Context
- WhatsApp number: ALWAYS use env var `NEXT_PUBLIC_WHATSAPP_NUMBER`. NEVER hardcode the number directly. Current number: 72643753 (country code: 591 → full: 59172643753).
- All new utility functions go to `lib/utils/`. Functions shared with inventory system are duplicated here, NOT imported cross-project.
- `components/cart/CheckoutModal.tsx` has 1998 lines — do NOT add logic to it. Create sub-components for new features.
- Tailwind: only `accent-500` (#c89b6e) for gold color. Never `bg-[#c89b6e]` or `bg-[#D4AF37]` inline.
- Images: always `<Image>` from next/image with explicit width/height. Hero image must be a local asset, not Unsplash.
- Analytics: always call `trackBeginCheckout` / `trackPurchase` on relevant checkout steps.

## DB Tables Used by This Project
buyers: `customers`, `orders`, `order_items`, `inventory_reservations`, `wishlists`, `subscribers`, `products` (read-only via landing), `inventory` (read-only for stock), `categories`, `locations`

## Environment Variables (all required)
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_WHATSAPP_NUMBER,
NEXT_PUBLIC_GA_MEASUREMENT_ID, RESEND_API_KEY, LANDING_URL,
WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN, WHATSAPP_API_VERSION
