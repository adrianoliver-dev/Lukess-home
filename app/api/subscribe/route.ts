import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateWelcomeDiscount } from '@/lib/supabase/discounts'

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS(): Promise<Response> {
    return new Response(null, { status: 200, headers: CORS_HEADERS })
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body = await req.json()
        const { email, source } = body as { email: string; source?: string }

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Email inválido' }, { status: 400, headers: CORS_HEADERS })
        }

        // Use SERVICE_ROLE to bypass RLS policies on server-side insertions
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // Attempt to insert subscriber
        const { error: insertError } = await supabase
            .from('subscribers')
            .insert({ email: email.trim().toLowerCase(), source: source ?? 'api' })

        if (insertError) {
            if (insertError.code === '23505') {
                // Already subscribed — not an error for the user, just skip
                console.log(`[api/subscribe] Skipped: ${email} is already subscribed (23505).`)
                return NextResponse.json({ error: 'already_subscribed' }, { status: 409, headers: CORS_HEADERS })
            }
            console.error('[api/subscribe] Supabase insert error:', insertError)
            throw new Error(insertError.message)
        }

        // Generate unique welcome discount code
        const discountCode = await generateWelcomeDiscount()

        console.log(`[api/subscribe] Success: New subscriber ${email} joined. Generated discount: ${discountCode}`)

        // Fire welcome email — wrapped in its own try/catch so email failures never crash the response
        if (discountCode) {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin
                const emailRes = await fetch(`${baseUrl}/api/send-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'welcome_email',
                        orderData: {
                            customerEmail: email,
                            discountCode,
                        },
                    }),
                })
                if (!emailRes.ok) {
                    const errBody = await emailRes.text()
                    console.error('[api/subscribe] Resend error response:', errBody)
                }
            } catch (emailErr) {
                console.error('[api/subscribe] Resend threw exception:', emailErr)
            }
        }

        return NextResponse.json(
            { success: true, discountCode: discountCode ?? null },
            { headers: CORS_HEADERS }
        )
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Server error'
        console.error('[api/subscribe] Unhandled error:', error)
        return NextResponse.json({ error: msg }, { status: 500, headers: CORS_HEADERS })
    }
}
