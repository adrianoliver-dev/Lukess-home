// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

/**
 * Edge Function: expire-reservations
 * Manual trigger for expire_pickup_reservations() PostgreSQL function.
 * Also called by pg_cron every hour automatically.
 *
 * verify_jwt is disabled — this endpoint is admin/cron use only,
 * contains no sensitive data, and only returns { success: boolean }.
 */
Deno.serve(async (_req: Request): Promise<Response> => {
    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

        if (!supabaseUrl || !supabaseKey) {
            return new Response(
                JSON.stringify({ error: 'Missing Supabase environment variables' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            )
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        const { error } = await supabase.rpc('expire_pickup_reservations')

        if (error) {
            return new Response(
                JSON.stringify({ success: false, error: error.message }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            )
        }

        return new Response(
            JSON.stringify({ success: true, message: 'Expired reservations processed' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Internal server error'
        return new Response(
            JSON.stringify({ success: false, error: message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
})
