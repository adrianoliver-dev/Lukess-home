# systemPatterns.md — lukess-home Coding Patterns

---

## Server Component Pattern (default)
```tsx
// app/[route]/page.tsx
import { createClient } from "@/lib/supabase/server";

export default async function Page(): Promise<React.JSX.Element> {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("*");

  return <ClientComponent data={data ?? []} />;
}
```
- Pages fetch data and pass as props
- No `"use client"` directive
- All async/await at the page level

---

## Client Component Pattern
```tsx
"use client"; // ← must be first line

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react"; // ← NEVER framer-motion

interface Props {
  data: Product[];
}

export default function MyComponent({ data }: Props): React.JSX.Element {
  const [open, setOpen] = useState(false);
  // ...
}
```
- `"use client"` on the very first line
- Use only when event handlers or browser APIs are required
- Derive prop types from Supabase schema via `types/database.types.ts`

---

## Supabase Client Patterns

### Server-side (Server Components, Route Handlers, Actions)
```ts
import { createClient } from "@/lib/supabase/server";

const supabase = await createClient();
```

### Client-side (Client Components)
```ts
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
```

> ⚠️ NEVER use `service_role` key in client-side code.

---

## Animation Import Convention
```ts
// Complex animations: scroll, layout, gestures
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";

// Micro-interactions: add CSS class from tailwindcss-motion plugin
// e.g. className="motion-preset-fade-in motion-duration-500"
// No JS import needed — pure CSS utility classes
```

---

## TypeScript Rules
- Strict mode always enabled
- No `any` — ever
- Explicit return types on all exported functions
- All Supabase types sourced from `types/database.types.ts`
- Shared utilities go in `lib/utils/`

---

## Import Paths
```ts
import { createClient } from "@/lib/supabase/server";   // server
import { createClient } from "@/lib/supabase/client";   // client
import type { Database } from "@/types/database.types"; // DB types
```

---

## Commit Message Format
```
feat(scope): description
fix(scope): description
chore(scope): description
```
No `console.log` in production code — remove all before committing.

---

## WhatsApp Number (DO NOT hardcode)
```ts
const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER; // "72643753"
const url = `https://wa.me/591${number}?text=...`;
```
