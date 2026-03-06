export function pickupReservationReceivedEmail(data: {
  orderId: string
  customerName: string
  pickupLocation: string
  pickupLocationAddress: string
  items: Array<{
    name?: string
    product?: { name?: string; price?: number }
    products?: { name?: string }
    quantity?: number
    qty?: number
    unit_price?: number
    price?: number
  }>
  total: number
}): string {
  const shortId = data.orderId.slice(0, 8).toUpperCase()
  const itemsList = data.items.map(item => {
    const itemName = item.name ?? item.products?.name ?? item.product?.name ?? 'Producto'
    const itemQty = item.quantity ?? item.qty ?? 1
    const itemPrice = item.unit_price ?? item.price ?? item.product?.price ?? 0
    return `<li>${itemName} x${itemQty} — Bs ${(itemPrice * itemQty).toFixed(2)}</li>`
  }).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f9fafb;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <!-- Header -->
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="color:#111;font-size:28px;font-weight:800;margin:0;">LUKESS HOME</h1>
          <p style="color:#6b7280;margin:8px 0 0;">Ropa Premium para Hombres</p>
        </div>

        <!-- Main Card -->
        <div style="background:#fff;border-radius:12px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color:#111;font-size:24px;font-weight:700;margin:0 0 16px;">¡Reserva Confirmada!</h2>
          <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 24px;">
            Hola <strong>${data.customerName}</strong>,<br><br>
            Recibimos tu pedido <strong>#${shortId}</strong> para recoger en tienda. Tu reserva estará activa por <strong>48 horas</strong>.
          </p>

          <!-- Pickup Info Banner -->
          <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px;margin:0 0 24px;border-radius:8px;">
            <p style="margin:0;color:#92400e;font-size:14px;font-weight:600;">
              ⏰ Importante: Recoge tu pedido en las próximas 48 horas
            </p>
            <p style="margin:8px 0 0;color:#92400e;font-size:14px;">
              Pasado ese tiempo, la reserva se cancelará automáticamente.
            </p>
          </div>

          <!-- Pickup Location -->
          <div style="background:#f3f4f6;padding:16px;border-radius:8px;margin:0 0 24px;">
            <h3 style="color:#111;font-size:14px;font-weight:700;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.05em;">📍 Recoge en:</h3>
            <p style="color:#374151;font-size:16px;font-weight:600;margin:0;">${data.pickupLocation}</p>
            <p style="color:#6b7280;font-size:14px;margin:4px 0 0;">${data.pickupLocationAddress}</p>
          </div>

          <!-- Order Items -->
          <h3 style="color:#111;font-size:14px;font-weight:700;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.05em;">Tu Pedido:</h3>
          <ul style="list-style:none;padding:0;margin:0 0 24px;">
            ${itemsList}
          </ul>

          <!-- Total -->
          <div style="border-top:2px solid #e5e7eb;padding-top:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="color:#6b7280;font-size:14px;font-weight:600;text-transform:uppercase;">Total a Pagar:</span>
              <span style="color:#111;font-size:28px;font-weight:800;">Bs ${data.total.toFixed(2)}</span>
            </div>
          </div>

          <!-- Payment Method -->
          <div style="background:#dbeafe;border-left:4px solid #3b82f6;padding:16px;margin:24px 0 0;border-radius:8px;">
            <p style="margin:0;color:#1e40af;font-size:14px;font-weight:600;">
              💳 Pago en el puesto: Efectivo, QR o Tarjeta
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align:center;margin-top:32px;color:#9ca3af;font-size:12px;">
          <p style="margin:0;">Mercado Mutualista, Santa Cruz de la Sierra</p>
          <p style="margin:8px 0 0;">Lun–Sáb 8AM–10PM · Dom 9AM–9PM</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function pickupPaymentConfirmedEmail(data: {
  orderId: string
  customerName: string
  pickupLocation: string
}): string {
  const shortId = data.orderId.slice(0, 8).toUpperCase()
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f9fafb;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="color:#111;font-size:28px;font-weight:800;margin:0;">LUKESS HOME</h1>
        </div>
        <div style="background:#fff;border-radius:12px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color:#10b981;font-size:24px;font-weight:700;margin:0 0 16px;">✓ Pago Confirmado</h2>
          <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 24px;">
            Hola <strong>${data.customerName}</strong>,<br><br>
            Confirmamos el pago de tu pedido <strong>#${shortId}</strong>. Ahora estamos preparando tu orden para que la recojas en <strong>${data.pickupLocation}</strong>.
          </p>
          <div style="background:#d1fae5;border-left:4px solid #10b981;padding:16px;border-radius:8px;">
            <p style="margin:0;color:#065f46;font-size:14px;font-weight:600;">
              Te avisaremos por WhatsApp cuando esté lista para recoger.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

export function pickupReadyForCollectionEmail(data: {
  orderId: string
  customerName: string
  pickupLocation: string
  pickupLocationAddress: string
  expiresInHours: number
}): string {
  const shortId = data.orderId.slice(0, 8).toUpperCase()
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f9fafb;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="color:#111;font-size:28px;font-weight:800;margin:0;">LUKESS HOME</h1>
        </div>
        <div style="background:#fff;border-radius:12px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color:#10b981;font-size:24px;font-weight:700;margin:0 0 16px;">🎉 ¡Tu pedido está listo!</h2>
          <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 24px;">
            Hola <strong>${data.customerName}</strong>,<br><br>
            Tu pedido <strong>#${shortId}</strong> ya está listo para recoger en <strong>${data.pickupLocation}</strong>.
          </p>
          <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px;margin:0 0 24px;border-radius:8px;">
            <p style="margin:0;color:#92400e;font-size:14px;font-weight:600;">
              ⏰ Retíralo en las próximas ${data.expiresInHours} horas
            </p>
          </div>
          <div style="background:#f3f4f6;padding:16px;border-radius:8px;">
            <h3 style="color:#111;font-size:14px;font-weight:700;margin:0 0 8px;">📍 Recoge en:</h3>
            <p style="color:#374151;font-size:16px;font-weight:600;margin:0;">${data.pickupLocation}</p>
            <p style="color:#6b7280;font-size:14px;margin:4px 0 0;">${data.pickupLocationAddress}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

export function orderCancelledEmail(data: {
  orderId: string
  customerName: string
  cancellationReason: string
  customReason?: string
}): string {
  const shortId = data.orderId.slice(0, 8).toUpperCase()

  const reasonMap: Record<string, string> = {
    'expired_reservation': 'La reserva expiró (no recogido en 48h)',
    'out_of_stock': 'Producto sin stock',
    'customer_request': 'Solicitud del cliente',
    'payment_failed': 'Pago no confirmado',
    'duplicate_order': 'Pedido duplicado',
    'other': data.customReason || 'Motivo no especificado',
  }

  const displayReason = reasonMap[data.cancellationReason] || data.cancellationReason

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f9fafb;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="color:#111;font-size:28px;font-weight:800;margin:0;">LUKESS HOME</h1>
        </div>
        <div style="background:#fff;border-radius:12px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color:#ef4444;font-size:24px;font-weight:700;margin:0 0 16px;">Pedido Cancelado</h2>
          <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 24px;">
            Hola <strong>${data.customerName}</strong>,<br><br>
            Lamentamos informarte que tu pedido <strong>#${shortId}</strong> ha sido cancelado.
          </p>
          <div style="background:#fee2e2;border-left:4px solid #ef4444;padding:16px;border-radius:8px;margin:0 0 24px;">
            <p style="margin:0;color:#991b1b;font-size:14px;font-weight:600;">Motivo:</p>
            <p style="margin:4px 0 0;color:#991b1b;font-size:14px;">${displayReason}</p>
          </div>
          <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 24px;">
            Si crees que esto es un error o necesitas más información, no dudes en contactarnos por WhatsApp al <a href="https://wa.me/59172643753" style="color:#D4AF37;text-decoration:none;font-weight:700;">+591 72643753</a>.
          </p>
          <div style="text-align:center;">
            <a href="https://lukess-home.vercel.app" style="display: inline-block; background-color: #D4AF37; color: #111; font-size: 16px; font-weight: 900; padding: 16px 32px; border-radius: 8px; text-decoration: none; letter-spacing: 0.5px;">
              Volver a la tienda
            </a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}
