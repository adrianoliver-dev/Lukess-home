import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { WHATSAPP_NUMBER } from '@/lib/utils/whatsapp'
import {
  pickupReservationReceivedEmail,
  pickupPaymentConfirmedEmail,
  pickupReadyForCollectionEmail,
  orderCancelledEmail
} from '@/lib/emails/templates'

const resend = new Resend(process.env.RESEND_API_KEY)

// Acepta items de la landing (CartItem) y del inventario (JOIN de Supabase)
interface OrderItem {
  // Landing: item.product.name / item.product.price, plus images
  product?: { name?: string; price?: number; images?: string[]; image_url?: string }
  // Inventario JOIN: item.products.name
  products?: { name?: string }
  // Landing alternativo: item.name / item.price
  name?: string
  price?: number
  // Inventario: item.unit_price
  unit_price?: number
  // Ambas fuentes
  quantity?: number
  qty?: number
  size?: string | null
  color?: string | null
  variant?: string | null
  image_url?: string | null
  // Si viene del carrito completo en admin_new_order
  images?: string[]
}

interface OrderEmailData {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  items?: OrderItem[]
  subtotal?: number
  shippingCost?: number
  shippingDistance?: number | null
  deliveryAddress?: string | null
  locationUrl?: string | null
  deliveryInstructions?: string | null
  deliveryMethod?: 'delivery' | 'pickup'
  hasReceipt?: boolean
  discountAmount?: number
  discountCode?: string | null
  total: number
  notifyByEmail?: boolean
  notifyByWhatsapp?: boolean
}

// ── Shared HTML primitives ─────────────────────────────────────────────────────

function buildHeader(): string {
  return `
    <tr>
      <td style="background-color: #111111; padding: 32px 40px; text-align: center; border-bottom: 3px solid #D4AF37;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 4px; color: #D4AF37; text-transform: uppercase;">LUKESS HOME</h1>
        <p style="margin: 6px 0 0; color: #888; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Mercado Mutualista · Santa Cruz, Bolivia</p>
      </td>
    </tr>
  `
}

function buildOrderNumber(orderId: string): string {
  const shortId = orderId.slice(0, 8).toUpperCase()
  return `
    <tr>
      <td style="padding: 20px 40px 0;">
        <div style="background-color: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 16px 20px;">
          <p style="margin: 0; font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 1.5px;">Número de orden</p>
          <p style="margin: 6px 0 0; font-size: 24px; font-weight: 900; color: #D4AF37; font-family: 'Courier New', monospace; letter-spacing: 3px;">#${shortId}</p>
          <p style="margin: 4px 0 0; font-size: 11px; color: #555; font-family: 'Courier New', monospace;">${orderId}</p>
        </div>
      </td>
    </tr>
  `
}

function buildProductRow(item: OrderItem): string {
  const productName = item.name ?? item.products?.name ?? item.product?.name ?? 'Producto'
  const unitPrice = item.unit_price ?? item.price ?? item.product?.price ?? 0
  const qty = item.quantity ?? item.qty ?? 1
  const size = item.size ?? item.variant ?? null
  const color = item.color ?? null

  // Try to resolve the image from either the direct property or the product object
  const imageUrl = item.image_url ?? item.product?.images?.[0] ?? item.product?.image_url ?? 'https://lukess-home.vercel.app/placeholder-product.jpg'

  const details = [size, color].filter(Boolean).join(' · ')

  return `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #2a2a2a;">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="width: 80px; vertical-align: top;">
              <img src="${imageUrl}" alt="${productName}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 6px; border: 1px solid #333;" />
            </td>
            <td style="padding-left: 12px; vertical-align: middle;">
              <p style="margin: 0; font-size: 14px; font-weight: 600; color: #e0e0e0;">${productName}</p>
              ${details ? `<p style="margin: 4px 0 0; font-size: 12px; color: #888;">${details}</p>` : ''}
              <p style="margin: 4px 0 0; font-size: 12px; color: #aaa;">Cantidad: ${qty} &times; Bs ${unitPrice.toFixed(2)}</p>
            </td>
            <td style="text-align: right; vertical-align: middle; white-space: nowrap;">
              <p style="margin: 0; font-size: 16px; font-weight: 700; color: #D4AF37;">Bs ${(unitPrice * qty).toFixed(2)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `
}

function buildItemsTable(items: OrderItem[]): string {
  const rows = items.map((item) => buildProductRow(item)).join('')

  return `
    <tr>
      <td style="padding: 24px 40px 0;">
        <p style="margin: 0 0 12px; font-size: 12px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1.5px;">Detalle del pedido</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-radius: 8px; overflow: hidden; border: 1px solid #333;">
          <tbody>
            ${rows}
          </tbody>
        </table>
      </td>
    </tr>
  `
}

function buildCostBreakdown(data: OrderEmailData): string {
  const subtotal = data.subtotal ?? data.total
  const shipping = data.shippingCost ?? 0
  const discount = data.discountAmount ?? 0
  const hasShipping = shipping > 0
  const hasDiscount = discount > 0
  const isPickup = shipping === 0 && data.shippingDistance == null

  const shippingLabel = isPickup
    ? 'Retiro en tienda'
    : data.shippingDistance != null
      ? `Costo de envío (${data.shippingDistance.toFixed(1)} km)`
      : 'Costo de envío'

  const shippingValue = isPickup
    ? '<span style="color: #4caf50; font-weight: 700;">Gratis</span>'
    : hasShipping
      ? `Bs ${shipping.toFixed(2)}`
      : '<span style="color: #4caf50; font-weight: 700;">Gratis</span>'

  const mapsUrl = data.locationUrl
    ? data.locationUrl
    : data.deliveryAddress
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.deliveryAddress)}`
      : null

  return `
    <tr>
      <td style="padding: 16px 40px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #333; border-radius: 8px; overflow: hidden;">
          <!-- Subtotal productos -->
          <tr style="background-color: #1a1a1a;">
            <td style="padding: 10px 16px; color: #aaa; font-size: 13px; border-bottom: 1px solid #2a2a2a;">Productos</td>
            <td style="padding: 10px 16px; color: #e0e0e0; font-size: 13px; text-align: right; border-bottom: 1px solid #2a2a2a; white-space: nowrap;">Bs ${subtotal.toFixed(2)}</td>
          </tr>
          <!-- Envío -->
          <tr style="background-color: #1a1a1a;">
            <td style="padding: 10px 16px; color: #aaa; font-size: 13px; border-bottom: ${hasDiscount ? '1px solid #2a2a2a' : '0'};">${shippingLabel}</td>
            <td style="padding: 10px 16px; font-size: 13px; text-align: right; border-bottom: ${hasDiscount ? '1px solid #2a2a2a' : '0'}; white-space: nowrap;">${shippingValue}</td>
          </tr>
          ${hasDiscount ? `
          <!-- Descuento -->
          <tr style="background-color: #1a1a1a;">
            <td style="padding: 10px 16px; color: #aaa; font-size: 13px; border-bottom: 0;">
              Descuento${data.discountCode ? ` <span style="color: #D4AF37; font-family: 'Courier New', monospace; font-size: 11px;">[${data.discountCode}]</span>` : ''}
            </td>
            <td style="padding: 10px 16px; color: #4caf50; font-size: 13px; font-weight: 700; text-align: right; border-bottom: 0; white-space: nowrap;">- Bs ${discount.toFixed(2)}</td>
          </tr>
          ` : ''}
          <!-- Total -->
          <tr style="background: linear-gradient(135deg, #111 0%, #1a1a1a 100%);">
            <td style="padding: 14px 16px; color: #aaa; font-size: 14px; font-weight: 700; border-top: 2px solid #D4AF37;">Total a pagar</td>
            <td style="padding: 14px 16px; color: #D4AF37; font-size: 26px; font-weight: 900; text-align: right; border-top: 2px solid #D4AF37; white-space: nowrap;">Bs ${data.total.toFixed(2)}</td>
          </tr>
        </table>
        ${mapsUrl ? `
        <div style="margin-top: 10px; text-align: center;">
          <a href="${mapsUrl}" target="_blank" style="display: inline-block; background-color: #1a3a1a; border: 1px solid #2d6a2d; border-radius: 8px; padding: 10px 20px; color: #4caf50; font-size: 13px; font-weight: 600; text-decoration: none;">
            📍 Ver ubicación de entrega
          </a>
        </div>
        ` : ''}
      </td>
    </tr>
  `
}

function buildWhatsappCta(): string {
  return `
    <tr>
      <td style="padding: 24px 40px 0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background-color: #1a2e1a; border: 1px solid #2d5a2d; border-radius: 8px; padding: 16px 20px; text-align: center;">
              <p style="margin: 0 0 4px; font-size: 13px; color: #aaa;">¿Tenés dudas sobre tu pedido?</p>
              <p style="margin: 0; font-size: 14px; font-weight: 700; color: #4caf50;">💬 WhatsApp: +${WHATSAPP_NUMBER}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `
}

function buildFooter(): string {
  return `
    <tr>
      <td style="padding: 28px 40px 32px; text-align: center; border-top: 1px solid #2a2a2a; margin-top: 28px;">
        <p style="margin: 0; font-size: 13px; font-weight: 700; color: #D4AF37; letter-spacing: 2px; text-transform: uppercase;">LUKESS HOME</p>
        <p style="margin: 6px 0 0; font-size: 12px; color: #555;">Mercado Mutualista, Santa Cruz, Bolivia</p>
        <p style="margin: 4px 0 0; font-size: 11px; color: #444;">Este email fue enviado porque realizaste un pedido en lukess-home.vercel.app</p>
      </td>
    </tr>
  `
}

function wrapEmail(rows: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin: 0; padding: 0; background-color: #1a1a1a; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #222222; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.5);">
          ${rows}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ── Email builders ─────────────────────────────────────────────────────────────

function buildWelcomeEmailHtml(discountCode: string): string {
  const rows = `
    ${buildHeader()}
    <tr>
      <td style="padding: 40px 40px 20px; text-align: center;">
        <h2 style="margin: 0; font-size: 24px; font-weight: 700; color: #f0f0f0;">¡Bienvenido a Lukess Home!</h2>
        <p style="margin: 16px 0 0; font-size: 15px; color: #aaaaaa; line-height: 1.6;">
          Gracias por unirte a nuestra comunidad. A partir de ahora recibirás nuestras promociones exclusivas, nuevas colecciones y avisos de stock antes que nadie.
        </p>
        <p style="margin: 16px 0 0; font-size: 15px; color: #e0e0e0; line-height: 1.6; font-weight: 600;">
          Para celebrar tu llegada, aquí tienes un 10% de descuento en tu próxima compra.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 40px;">
        <div style="background-color: #111; border: 2px dashed #D4AF37; border-radius: 12px; padding: 24px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 2px;">Código de Descuento</p>
          <p style="margin: 12px 0 0; font-size: 32px; font-weight: 900; color: #D4AF37; letter-spacing: 2px;">${discountCode}</p>
        </div>
        <div style="text-align: center; margin-top: 12px;">
          <p style="margin: 0; font-size: 12px; color: #666;">* Válido por 7 días. De un solo uso.</p>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 40px 40px; text-align: center;">
        <a href="https://lukess-home.vercel.app" style="display: inline-block; background-color: #D4AF37; color: #111; font-size: 14px; font-weight: 900; padding: 16px 32px; border-radius: 8px; text-decoration: none; letter-spacing: 0.5px;">
          Explorar la Tienda →
        </a>
      </td>
    </tr>
    ${buildFooter()}
  `
  return wrapEmail(rows)
}

function buildOrderConfirmationHtml(data: OrderEmailData): string {
  const stepsHtml = [
    { n: '1', icon: '💳', title: 'Confirmamos tu pago', desc: 'Puede tomar unos minutos mientras verificamos la transferencia.' },
    { n: '2', icon: '📦', title: 'Preparamos tu pedido', desc: 'Seleccionamos y empacamos tus productos con cuidado.' },
    { n: '3', icon: '🛵', title: 'Coordinamos la entrega con Yango', desc: 'Te contactaremos por WhatsApp antes de enviar.' },
    { n: '4', icon: '🎉', title: '¡Tu pedido llega a tu puerta!', desc: 'Recibirás tu pedido en la dirección que indicaste.' },
  ].map(step => `
    <tr>
      <td style="padding: 12px 16px; background-color: #1a1a1a; border-radius: 8px; border-left: 3px solid #D4AF37;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width: 32px; vertical-align: middle;">
              <span style="display: inline-block; width: 24px; height: 24px; background-color: #D4AF37; color: #111; border-radius: 50%; text-align: center; line-height: 24px; font-size: 11px; font-weight: 900;">${step.n}</span>
            </td>
            <td style="padding-left: 12px; vertical-align: middle;">
              <p style="margin: 0; font-size: 13px; font-weight: 700; color: #e0e0e0;">${step.icon} ${step.title}</p>
              <p style="margin: 2px 0 0; font-size: 12px; color: #777;">${step.desc}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('')

  const rows = `
    ${buildHeader()}
    <tr>
      <td style="padding: 28px 40px 0; text-align: center;">
        <div style="display: inline-block; background-color: #1a3a1a; border: 1px solid #2d6a2d; border-radius: 999px; padding: 8px 20px;">
          <span style="color: #4caf50; font-size: 13px; font-weight: 600;">✅ Pedido recibido correctamente</span>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 40px 0;">
        <p style="margin: 0; font-size: 22px; font-weight: 700; color: #f0f0f0;">Hola ${data.customerName},</p>
        <p style="margin: 12px 0 0; font-size: 15px; color: #aaaaaa; line-height: 1.6;">
          Recibimos tu pedido correctamente. En breve confirmaremos tu pago y prepararemos todo para que llegue a tus manos.
        </p>
      </td>
    </tr>
    ${buildOrderNumber(data.orderId)}
    ${data.items && data.items.length > 0 ? buildItemsTable(data.items) : ''}
    ${buildCostBreakdown(data)}
    <tr>
      <td style="padding: 28px 40px 0;">
        <p style="margin: 0 0 16px; font-size: 12px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1.5px;">¿Qué sigue?</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: separate; border-spacing: 0 8px;">
          ${stepsHtml}
        </table>
      </td>
    </tr>
    ${buildWhatsappCta()}
    ${buildFooter()}
  `

  return wrapEmail(rows)
}

function buildStatusEmailHtml(
  data: OrderEmailData,
  badge: string,
  badgeBg: string,
  badgeBorder: string,
  badgeColor: string,
  message: string,
  ctaHtml?: string,
): string {
  const rows = `
    ${buildHeader()}
    <tr>
      <td style="padding: 28px 40px 0; text-align: center;">
        <div style="display: inline-block; background-color: ${badgeBg}; border: 1px solid ${badgeBorder}; border-radius: 999px; padding: 8px 20px;">
          <span style="color: ${badgeColor}; font-size: 13px; font-weight: 600;">${badge}</span>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 40px 0;">
        <p style="margin: 0; font-size: 22px; font-weight: 700; color: #f0f0f0;">Hola ${data.customerName},</p>
        <p style="margin: 12px 0 0; font-size: 15px; color: #aaaaaa; line-height: 1.6;">${message}</p>
        ${ctaHtml ? `<div style="margin-top: 24px; text-align: center;">${ctaHtml}</div>` : ''}
      </td>
    </tr>
    ${buildOrderNumber(data.orderId)}
    ${data.items && data.items.length > 0 ? buildItemsTable(data.items) : ''}
    ${buildCostBreakdown(data)}
    ${buildWhatsappCta()}
    ${buildFooter()}
  `

  return wrapEmail(rows)
}

function buildCompletionEmailHtml(data: OrderEmailData, method: 'delivery' | 'pickup'): string {
  const message = method === 'delivery'
    ? 'Tu pedido fue entregado con éxito. ¡Esperamos que disfrutes tu compra!'
    : '¡Gracias por recoger tu pedido! Esperamos que te encante.'

  const rows = `
    ${buildHeader()}
    <tr>
      <td style="padding: 28px 40px 0; text-align: center;">
        <div style="display: inline-block; background-color: #1a3a1a; border: 1px solid #2d6a2d; border-radius: 999px; padding: 8px 20px;">
          <span style="color: #4caf50; font-size: 13px; font-weight: 600;">🎉 Pedido Completado</span>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 40px 0;">
        <p style="margin: 0; font-size: 22px; font-weight: 700; color: #f0f0f0;">¡Gracias, ${data.customerName}!</p>
        <p style="margin: 12px 0 0; font-size: 15px; color: #aaaaaa; line-height: 1.6;">${message}</p>
      </td>
    </tr>
    ${buildOrderNumber(data.orderId)}
    ${data.items && data.items.length > 0 ? buildItemsTable(data.items) : ''}
    ${buildCostBreakdown(data)}
    <tr>
      <td style="padding: 32px 40px; text-align: center;">
        <p style="margin: 0 0 16px; font-size: 15px; color: #aaa;">¿Te gustó tu compra? Volvé a visitarnos</p>
        <a href="https://lukess-home.vercel.app" style="display: inline-block; background-color: #D4AF37; color: #111; font-size: 16px; font-weight: 900; padding: 18px 48px; border-radius: 10px; text-decoration: none; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);">
          🛍️ Volver a comprar
        </a>
        <p style="margin: 16px 0 0; font-size: 13px; color: #666;">O seguinos en nuestras redes para no perderte las nuevas colecciones</p>
        <div style="margin-top: 12px;">
          <a href="https://instagram.com/lukesshome" style="display: inline-block; margin: 0 8px; color: #D4AF37; text-decoration: none; font-size: 12px;">📸 Instagram</a>
          <a href="https://facebook.com/lukesshome" style="display: inline-block; margin: 0 8px; color: #D4AF37; text-decoration: none; font-size: 12px;">📘 Facebook</a>
        </div>
      </td>
    </tr>
    ${buildWhatsappCta()}
    ${buildFooter()}
  `
  return wrapEmail(rows)
}

function buildAdminNewOrderHtml(data: OrderEmailData): string {
  const shortId = data.orderId.slice(0, 8).toUpperCase()
  const isDelivery = data.deliveryMethod === 'delivery'
  const deliveryLabel = isDelivery ? 'Delivery' : 'Recojo en tienda'

  const receiptSection = data.hasReceipt
    ? `
      <tr>
        <td style="padding: 20px 40px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1a2a1a; border: 1px solid #2d5a2d; border-radius: 8px; overflow: hidden;">
            <tr>
              <td style="padding: 16px 20px;">
                <p style="margin: 0 0 6px; font-size: 13px; font-weight: 700; color: #4caf50;">📎 Comprobante de pago</p>
                <p style="margin: 0 0 12px; font-size: 13px; color: #aaa; line-height: 1.5;">El cliente subió un comprobante. Revisá la imagen en el sistema de inventario para verificar.</p>
                <a href="https://lukess-inventory-system.vercel.app/pedidos" target="_blank" style="display: inline-block; background-color: #4caf50; color: #111; font-size: 13px; font-weight: 700; padding: 10px 20px; border-radius: 6px; text-decoration: none;">
                  Ver en sistema de inventario →
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `
    : `
      <tr>
        <td style="padding: 20px 40px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #2a1a1a; border: 1px solid #6a2d2d; border-radius: 8px; overflow: hidden;">
            <tr>
              <td style="padding: 16px 20px;">
                <p style="margin: 0 0 6px; font-size: 13px; font-weight: 700; color: #f87171;">⚠️ Sin comprobante</p>
                <p style="margin: 0; font-size: 13px; color: #aaa; line-height: 1.5;">El cliente no subió comprobante. Verificá el pago directamente en la app del banco antes de confirmar.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `

  const rows = `
    ${buildHeader()}
    <tr>
      <td style="padding: 20px 40px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #2a1f0a; border: 2px solid #D4AF37; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="padding: 14px 20px; text-align: center;">
              <p style="margin: 0; font-size: 15px; font-weight: 700; color: #D4AF37;">🛎️ Nuevo pedido — Verificar pago</p>
              <p style="margin: 6px 0 0; font-size: 13px; color: #c8a44a; line-height: 1.4;">⚠️ Verificá el pago en la app del banco antes de confirmar</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${buildOrderNumber(data.orderId)}
    <tr>
      <td style="padding: 20px 40px 0;">
        <p style="margin: 0 0 12px; font-size: 12px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1.5px;">Datos del cliente</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #333; border-radius: 8px; overflow: hidden;">
          <tr style="background-color: #1a1a1a; border-bottom: 1px solid #2a2a2a;">
            <td style="padding: 10px 16px; color: #888; font-size: 13px; width: 140px;">Cliente</td>
            <td style="padding: 10px 16px; color: #e0e0e0; font-size: 13px; font-weight: 600;">${data.customerName}</td>
          </tr>
          <tr style="background-color: #1a1a1a; border-bottom: 1px solid #2a2a2a;">
            <td style="padding: 10px 16px; color: #888; font-size: 13px;">Email</td>
            <td style="padding: 10px 16px; color: #e0e0e0; font-size: 13px;">${data.customerEmail}</td>
          </tr>
          ${data.customerPhone ? `
          <tr style="background-color: #1a1a1a; border-bottom: 1px solid #2a2a2a;">
            <td style="padding: 10px 16px; color: #888; font-size: 13px;">Teléfono</td>
            <td style="padding: 10px 16px; color: #e0e0e0; font-size: 13px;">${data.customerPhone}</td>
          </tr>
          ` : ''}
          <tr style="background-color: #1a1a1a; border-bottom: 1px solid #2a2a2a;">
            <td style="padding: 10px 16px; color: #888; font-size: 13px;">Subtotal</td>
            <td style="padding: 10px 16px; color: #e0e0e0; font-size: 13px;">Bs ${(data.subtotal ?? data.total).toFixed(2)}</td>
          </tr>
          ${data.shippingCost ? `
          <tr style="background-color: #1a1a1a; border-bottom: 1px solid #2a2a2a;">
            <td style="padding: 10px 16px; color: #888; font-size: 13px;">Costo de Envío</td>
            <td style="padding: 10px 16px; color: #e0e0e0; font-size: 13px;">Bs ${data.shippingCost.toFixed(2)}</td>
          </tr>
          ` : ''}
          ${data.discountAmount ? `
          <tr style="background-color: #1a1a1a; border-bottom: 1px solid #2a2a2a;">
            <td style="padding: 10px 16px; color: #888; font-size: 13px;">Descuento Aplicado</td>
            <td style="padding: 10px 16px; color: #4caf50; font-size: 13px;">-Bs ${data.discountAmount.toFixed(2)}</td>
          </tr>
          ` : ''}
          <tr style="background-color: #1a1a1a; border-bottom: 1px solid #2a2a2a;">
            <td style="padding: 10px 16px; color: #888; font-size: 13px;">Total</td>
            <td style="padding: 10px 16px; color: #D4AF37; font-size: 15px; font-weight: 900;">Bs ${data.total.toFixed(2)}</td>
          </tr>
          <tr style="background-color: #1a1a1a; border-bottom: 1px solid #2a2a2a;">
            <td style="padding: 10px 16px; color: #888; font-size: 13px;">Entrega</td>
            <td style="padding: 10px 16px; color: #e0e0e0; font-size: 13px;">${deliveryLabel}</td>
          </tr>
          ${isDelivery && data.deliveryAddress ? `
          <tr style="background-color: #1a1a1a; border-bottom: 1px solid #2a2a2a;">
            <td style="padding: 10px 16px; color: #888; font-size: 13px;">Dirección</td>
            <td style="padding: 10px 16px; color: #e0e0e0; font-size: 13px;">${data.deliveryAddress}</td>
          </tr>
          ` : ''}
          ${isDelivery && data.locationUrl ? `
          <tr style="background-color: #1a1a1a; border-bottom: 1px solid #2a2a2a;">
            <td style="padding: 10px 16px; color: #888; font-size: 13px;">Ubicación GPS</td>
            <td style="padding: 10px 16px; font-size: 13px;">
              <a href="${data.locationUrl}" target="_blank" style="color: #4caf50; text-decoration: none; font-weight: 600;">📍 Ver en Maps →</a>
            </td>
          </tr>
          ` : ''}
          ${isDelivery && data.deliveryInstructions ? `
          <tr style="background-color: #1a1a1a;">
            <td style="padding: 10px 16px; color: #888; font-size: 13px;">Instrucciones</td>
            <td style="padding: 10px 16px; color: #e0e0e0; font-size: 13px;">${data.deliveryInstructions}</td>
          </tr>
          ` : ''}
        </table>
      </td>
    </tr>
    ${data.items && data.items.length > 0 ? buildItemsTable(data.items) : ''}
    ${receiptSection}
    <tr>
      <td style="padding: 24px 40px 0; text-align: center;">
        <a href="https://lukess-inventory-system.vercel.app/pedidos" target="_blank" style="display: inline-block; background-color: #D4AF37; color: #111; font-size: 14px; font-weight: 900; padding: 14px 32px; border-radius: 8px; text-decoration: none; letter-spacing: 0.5px;">
          Ir al sistema de inventario →
        </a>
        <p style="margin: 10px 0 0; font-size: 11px; color: #555;">lukess-inventory-system.vercel.app/pedidos · Pedido #${shortId}</p>
      </td>
    </tr>
    ${buildFooter()}
  `

  return wrapEmail(rows)
}

// ── CORS headers ──────────────────────────────────────────────────────────────

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: CORS_HEADERS })
}

// ── POST handler ───────────────────────────────────────────────────────────────

export type EmailType =
  | 'welcome_email'
  | 'order_confirmation'
  | 'order_paid'
  | 'order_shipped'
  | 'order_completed'
  | 'order_cancelled'
  | 'admin_new_order'
  | 'pickup_reservation_received'
  | 'pickup_payment_confirmed'
  | 'pickup_ready_for_collection'
  | 'pickup_completed'

export async function POST(req: NextRequest) {
  const corsHeaders = new Headers(CORS_HEADERS)

  try {
    const body = await req.json()
    const { type, orderData } = body as { type: EmailType; orderData: any }

    // EMAIL KILL-SWITCH FOR DEV TESTING
    if (process.env.DISABLE_EMAILS === 'true') {

      return NextResponse.json({ success: true, bypassed: true }, { headers: corsHeaders })
    }

    if (type !== 'welcome_email' && !orderData?.customerEmail) {
      return NextResponse.json(
        { error: 'Email del cliente requerido' },
        { status: 400, headers: corsHeaders },
      )
    }

    const shortId = orderData?.orderId ? orderData.orderId.slice(0, 8).toUpperCase() : ''

    let subject = ''
    let html = ''

    if (type === 'welcome_email') {
      subject = '¡Bienvenido a Lukess Home! Tu regalo adentro 🎁'
      html = buildWelcomeEmailHtml(orderData.discountCode)
    } else {
      switch (type) {
        case 'order_confirmation':
          subject = `✅ Pedido #${shortId} recibido — Lukess Home`
          html = buildOrderConfirmationHtml(orderData)
          break

        case 'order_paid':
          subject = `💳 Pago confirmado — Pedido #${shortId} | Lukess Home`
          html = buildStatusEmailHtml(
            orderData,
            '💳 Pago confirmado',
            '#1a2e1a',
            '#2d5a2d',
            '#4caf50',
            '¡Tu pago fue confirmado! Ya estamos preparando tu pedido con todo el cuidado que merece.',
          )
          break

        case 'order_shipped':
          subject = `🛵 Tu pedido está en camino — Lukess Home`
          html = buildStatusEmailHtml(
            orderData,
            '🛵 En camino',
            '#1a2332',
            '#2d4a6a',
            '#60a5fa',
            'Tu pedido ya salió y está en camino. El repartidor de Yango está llevando tu pedido. Pronto llegará a tu puerta.',
          )
          break

        case 'order_completed':
          subject = `🎉 ¡Tu pedido #${shortId} fue entregado con éxito! | Lukess Home`
          html = buildCompletionEmailHtml(orderData, 'delivery')
          break

        case 'pickup_completed':
          subject = `🎉 ¡Gracias por tu compra, ${orderData.customerName}! | Lukess Home`
          html = buildCompletionEmailHtml(orderData, 'pickup')
          break

        case 'order_cancelled':
          subject = `❌ Pedido #${shortId} cancelado | Lukess Home`
          html = orderCancelledEmail({
            orderId: orderData.orderId,
            customerName: orderData.customerName,
            cancellationReason: orderData.cancellationReason,
            customReason: orderData.customCancellationReason,
          })
          break

        case 'admin_new_order':
          subject = `🛎️ Nuevo pedido #${shortId} — Verificar pago`
          html = buildAdminNewOrderHtml(orderData)
          break

        case 'pickup_reservation_received':
          subject = `Reserva Confirmada - #${shortId}`
          html = pickupReservationReceivedEmail({
            orderId: orderData.orderId,
            customerName: orderData.customerName,
            pickupLocation: orderData.pickupLocationName,
            pickupLocationAddress: orderData.pickupLocationAddress,
            items: orderData.items,
            total: orderData.total,
          })
          break

        case 'pickup_payment_confirmed':
          subject = `Pago Confirmado - #${shortId}`
          html = pickupPaymentConfirmedEmail({
            orderId: orderData.orderId,
            customerName: orderData.customerName,
            pickupLocation: orderData.pickupLocationName,
          })
          break

        case 'pickup_ready_for_collection':
          subject = `¡Tu pedido está listo! - #${shortId}`
          html = pickupReadyForCollectionEmail({
            orderId: orderData.orderId,
            customerName: orderData.customerName,
            pickupLocation: orderData.pickupLocationName,
            pickupLocationAddress: orderData.pickupLocationAddress,
            expiresInHours: orderData.expiresInHours || 48,
          })
          break

        default:
          return NextResponse.json(
            { error: `Tipo de email desconocido: ${type}` },
            { status: 400, headers: corsHeaders },
          )
      }
    }

    // Set recipient from order data, fallback to dev email if missing for some reason
    const recipient = type === 'admin_new_order'
      ? 'financenft01@gmail.com'
      : (orderData.customerEmail ?? 'financenft01@gmail.com')

    const { error } = await resend.emails.send({
      from: 'Lukess Home <onboarding@resend.dev>',
      to: recipient,
      subject,
      html,
    })

    if (error) {
      // Handle Sandbox/Unverified Domain errors gracefully so they don't break the checkout flow
      if (
        error.message?.toLowerCase().includes('sandbox') ||
        error.message?.toLowerCase().includes('verified') ||
        error.message?.toLowerCase().includes('domain')
      ) {
        console.warn(`[send-email] Sandbox/Domain error: Email not sent to ${recipient}. Resend says: ${error.message}`)
        return NextResponse.json({ success: true, warning: 'Email not sent due to sandbox domain verification' }, { headers: corsHeaders })
      }

      console.error('[send-email] Resend error:', error)
      return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders })
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error interno'
    console.error('[send-email] Error:', error)
    return NextResponse.json({ error: msg }, { status: 500, headers: corsHeaders })
  }
}
