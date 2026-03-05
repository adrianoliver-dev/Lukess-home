# Testing Welcome Email Locally

## Problema

El email de bienvenida solo se envía una vez por correo. Para volver a probarlo, debés eliminar los registros de esa sesión de prueba.

## Pasos para Resetear

1. Ir a **Supabase → Tabla `newsletter_subscribers`**
2. Buscar y **borrar la fila** de tu correo de prueba.
3. Ir a **Supabase → Tabla `discount_codes`**
4. Buscar y **borrar el código** de descuento que fue asignado a ese correo (`assigned_email = 'tu@email.com'`).
5. Volver a la landing y suscribirte de nuevo (o marcar el checkbox de marketing en el checkout).

## Notas

- El email de bienvenida se dispara desde `/api/subscribe` cuando se detecta que es un correo **nuevo** en `newsletter_subscribers`.
- El código de descuento generado tiene validez de **7 días** a partir de su creación.
- También podés usar la variable de entorno `DISABLE_EMAILS=false` (ya debe estar así en dev) para asegurarte de que Resend está activo.
