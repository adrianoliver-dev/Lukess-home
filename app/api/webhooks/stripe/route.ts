import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { sendWhatsAppMessage } from '@/lib/whatsapp/send-message'
import { getWhatsAppTemplate, OrderForWhatsApp } from '@/lib/whatsapp/template-router'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  let event

  try {
    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('Missing stripe-signature or STRIPE_WEBHOOK_SECRET')
    }
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    console.error(`[Stripe Webhook Error]: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const orderId = session.metadata?.order_id

    if (orderId) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      // 1. Update order status to 'confirmed'
      const { data: order, error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: 'confirmed', 
          payment_method: 'stripe',
          payment_receipt_url: session.payment_intent // Reference the Stripe payment intent
        })
        .eq('id', orderId)
        .select()
        .single()

      if (updateError) {
        console.error('[Webhook DB Update Error]:', updateError)
        return NextResponse.json({ error: 'Order update failed' }, { status: 500 })
      }

      // 2. Send WhatsApp Notification if enabled
      if (order.notify_whatsapp && order.customer_phone) {
        const rawPhone = order.customer_phone.replace(/\D/g, '')
        const formattedPhone = rawPhone.startsWith('591') ? rawPhone : `591${rawPhone}`

        const orderForWhatsApp: OrderForWhatsApp = {
          id: order.id,
          customer_name: order.customer_name,
          customer_phone: order.customer_phone,
          notify_whatsapp: order.notify_whatsapp,
          delivery_method: order.delivery_method,
          payment_method: 'stripe',
          shipping_address: order.shipping_address,
          pickup_location: order.pickup_location,
          total: Number(order.total),
        }

        const config = getWhatsAppTemplate(orderForWhatsApp, 'confirmed')

        if (config) {
          try {
            await sendWhatsAppMessage({
              to: formattedPhone,
              templateName: config.templateName,
              variables: config.variables,
              headerImage: config.headerImage,
            })
            // Update DB with the whatsapp message sent
            await supabase.from('orders').update({ whatsapp_last_status_sent: 'confirmed' }).eq('id', order.id)
          } catch (err) {
            console.error('[Webhook WhatsApp Error]:', err)
          }
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
