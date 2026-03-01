import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateWelcomeDiscount } from '@/lib/supabase/discounts'

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
    return new Response(null, { status: 200, headers: CORS_HEADERS })
}

export async function POST(req: NextRequest) {
    try {
        const { email, source } = await req.json()

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Email inválido' }, { status: 400, headers: CORS_HEADERS })
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // Insert subscriber
        const { error: insertError } = await supabase
            .from('subscribers')
            .insert({ email: email.trim().toLowerCase(), source: source || 'api' })

        if (insertError) {
            if (insertError.code === '23505') {
                // Already subscribed
                return NextResponse.json({ error: 'already_subscribed' }, { status: 409, headers: CORS_HEADERS })
            }
            throw insertError
        }

        // Generate unique discount code
        const discountCode = await generateWelcomeDiscount()

        if (!discountCode) {
            throw new Error('No se pudo generar el código de descuento')
        }

        // Send welcome email via internal route matching fetch (or directly)
        // To send it directly calling our own route, or we can just fetch it:
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin

        // We do not wait for the email as it's non-blocking (fire and forget)
        fetch(`${baseUrl}/api/send-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'welcome_email',
                orderData: {
                    customerEmail: email,
                    discountCode: discountCode,
                },
            }),
        }).catch(err => console.error('[api/subscribe] Error triggering email:', err))

        return NextResponse.json({ success: true, discountCode }, { headers: CORS_HEADERS })
    } catch (error: any) {
        console.error('[api/subscribe] Error:', error)
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500, headers: CORS_HEADERS })
    }
}
