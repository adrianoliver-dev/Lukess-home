'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Retrieves a list of unique, active categories from the database.
 * Used for populating navigation menus and filters.
 */
export async function getActiveCategories(): Promise<string[]> {
    try {
        const supabase = await createClient()

        // We fetch categories for products that are published and active
        const { data, error } = await supabase
            .from('products')
            .select('categories!inner(name)')
            .eq('is_active', true)
            .eq('published_to_landing', true)

        if (error) {
            console.error('Error fetching active categories:', error)
            return []
        }

        // Extract unique category names
        const categorySet = new Set<string>()
        data?.forEach((product: any) => {
            if (product.categories?.name) {
                categorySet.add(product.categories.name)
            }
        })

        return Array.from(categorySet).sort()
    } catch (err) {
        console.error('Unexpected error fetching categories:', err)
        return []
    }
}
