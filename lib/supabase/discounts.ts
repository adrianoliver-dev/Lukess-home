import { createClient } from '@supabase/supabase-js'

export async function generateWelcomeDiscount(): Promise<string | null> {
    try {
        // Use SERVICE_ROLE to bypass RLS — server-side only
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const suffix = Math.random().toString(36).substring(2, 6).toUpperCase()
        const code = `BIENVENIDO-${suffix}`

        const { error } = await supabase.from('discount_codes').insert({
            code,
            discount_type: 'percentage',
            discount_percentage: 10,
            max_uses: 1,
            usage_count: 0,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            is_active: true,
        })

        if (error) {
            console.error('[generateWelcomeDiscount] Supabase Error:', error)
            return null
        }

        return code
    } catch (err) {
        console.error('[generateWelcomeDiscount] Exception:', err)
        return null
    }
}
