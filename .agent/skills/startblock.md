---
description: Inicia un bloque de trabajo — lee contexto, genera plan, y espera aprobación antes de escribir código
---

# /startblock — Skill de Inicio de Bloque

## Trigger
Usar cuando el usuario envía `/startblock` o pide iniciar un nuevo bloque de trabajo.

## Pasos Obligatorios

### 1. Leer contexto obligatoriamente
Leer **en su totalidad** `.context/activeContext.md` antes de hacer cualquier otra cosa.

### 2. Confirmar lectura
Responder con:
> "Contexto cargado. Bloque actual: [X] — [Nombre]. Último completado: [Y]. Bugs abiertos: [N]."

### 3. Generar Implementation Plan
Crear un plan con las siguientes secciones obligatorias:

```markdown
## Goal
[Descripción del objetivo del bloque]

## Files to Modify / Create
| Action | File | Change |
|--------|------|--------|
| MODIFY | path/to/file.tsx | descripción |
| NEW    | path/to/new.ts   | descripción |

## TypeScript Types Required
- [ ] Type X from database.types.ts
- [ ] New interface Y: { ... }

## Supabase Queries
- SELECT: tabla, columnas, filtros
- INSERT/UPDATE: tabla, campos
- RLS policies affected: [list]

## Terminal Commands (in order, one by one)
1. npm run build
2. ...
```

### 4. STOP — Esperar aprobación
**NO escribir código.** Enviar el plan al usuario y esperar que responda "Approve plan" o proporcione feedback.

### 5. Solo después de aprobación → ejecutar
Una vez aprobado, ejecutar los cambios respetando:
- TypeScript strict, sin `any`
- Imports de `motion/react` (nunca `framer-motion`)
- Usar `@/lib/supabase/server` o `@/lib/supabase/client` según corresponda
- `NEXT_PUBLIC_WHATSAPP_NUMBER` para todos los links de WhatsApp

### 6. Al finalizar — actualizar `.context/activeContext.md`
- Marcar bloque como DONE con fecha
- Listar todos los archivos modificados/creados
- Listar cambios de DB (tablas, migraciones, RLS)
- Listar TODOs/issues descubiertos
- Actualizar "Next Block"
