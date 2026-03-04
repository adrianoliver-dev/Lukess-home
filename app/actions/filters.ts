'use server'

import { createClient } from '@/lib/supabase/server'

export type FilterOptions = {
    brands: string[];
    colors: string[];
    sizes: string[];
}

/**
 * Gets dynamic filter options (brands, colors, sizes) available 
 * based on the provided category. If no category is provided, returns all options.
 */
export async function getDynamicFilters(category?: string | null): Promise<FilterOptions> {
    const supabase = await createClient()

    try {
        // Siempre llamar al RPC, con la categoría o sin ella (null = todos)
        const { data, error } = await supabase.rpc('get_available_filters_by_category', {
            p_category: category || null
        })

        if (error) {
            console.error('Error fetching dynamic filters:', error)
            return { brands: [], colors: [], sizes: [] }
        }

        if (data && data.length > 0) {
            return {
                brands: data[0].brands || [],
                colors: data[0].colors || [],
                sizes: data[0].sizes || []
            }
        }

        // Si el RPC retorna vacío (no hay productos), retornar arrays vacíos
        return { brands: [], colors: [], sizes: [] }
    } catch (err) {
        console.error('Unexpected error in getDynamicFilters:', err)
        return { brands: [], colors: [], sizes: [] }
    }
}
