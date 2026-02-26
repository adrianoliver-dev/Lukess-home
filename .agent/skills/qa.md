---
description: QA completo — build, lint, browser screenshots, checklist de calidad, y oferta de commit
---

# /qa — Quality Assurance Completo

## Trigger
Usar cuando el usuario envía `/qa` o pide verificar antes de un commit/deploy.

## Pasos Obligatorios (en orden)

### 1. Build check
```
npm run build
```
- ✅ PASS: cero errores, cero warnings de TypeScript
- ❌ FAIL: mostrar errores exactos, no continuar hasta resolverlos

### 2. Lint check
```
npm run lint
```
- ✅ PASS: cero errores ESLint
- ❌ FAIL: mostrar errores y corregirlos

### 3. Browser Sub-Agent screenshots
Abrir Browser Sub-Agent y capturar screenshots en:
- **360px** (móvil mínimo — Galaxy S)
- **1280px** (desktop estándar)

Verificar visualmente:
- Layout no rompe en ninguna resolución
- Navbar y menú móvil funcionan
- No hay overflow horizontal
- Colores dorados usan `accent-500` (#c89b6e) correctamente

### 4. Checklist de calidad — verificar con grep/search

| Check | Comando | Resultado esperado |
|---|---|---|
| Sin `console.log` en producción | `grep -r "console\.log" --include="*.ts" --include="*.tsx" app/ components/ lib/` | 0 resultados |
| Sin tipos `any` | `grep -r ": any" --include="*.ts" --include="*.tsx" .` | 0 resultados |
| Sin `framer-motion` | `grep -r "framer-motion" --include="*.ts" --include="*.tsx" .` | 0 resultados |
| WhatsApp usa env var | `grep -r "76020369\|wa\.me/591[^$]" --include="*.ts" --include="*.tsx" .` | 0 resultados (hardcodeos) |
| Un solo dorado | `grep -r "#c89b6e\|accent-500" --include="*.tsx" --include="*.ts" --include="*.css" .` | Solo en globals.css |

### 5. Resultado

#### ✅ PASS total
Ofrecer commit con mensaje convencional:
```
feat(scope): descripción de los cambios
```
Preguntar al usuario: "¿Apruebas este mensaje de commit?"

#### ❌ FAIL (cualquier check)
- Mostrar lista de issues encontrados
- Proponer correcciones
- Re-run QA después de corregir
