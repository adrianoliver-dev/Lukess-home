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
        if (category) {
            const { data, error } = await supabase.rpc('get_available_filters_by_category', {
                p_category: category
            })

            if (error) {
                console.error('Error fetching dynamic filters for category:', category, error)
                return { brands: [], colors: [], sizes: [] }
            }

            // The RPC returns { brands: string[], colors: string[], sizes: string[] }
            if (data && data.length > 0) {
                return {
                    brands: data[0].brands || [],
                    colors: data[0].colors || [],
                    sizes: data[0].sizes || []
                }
            }
        }

        // Default Fallback (no category or error parsing RPC logic)
        // Here we could extract global unique tags if necessary, but returning empty triggers UI hiding
        return { brands: [], colors: [], sizes: [] }
    } catch (err) {
        console.error('Unexpected error in getDynamicFilters:', err)
        return { brands: [], colors: [], sizes: [] }
    }
}
