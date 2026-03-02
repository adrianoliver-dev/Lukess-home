import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient()

    const { data: products } = await supabase
        .from('products')
        .select('id, updated_at')
        .eq('is_active', true)
        .eq('published_to_landing', true)

    const productRoutes: MetadataRoute.Sitemap = (products || []).map((product) => ({
        url: `https://lukesshome.com/producto/${product.id}`,
        lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    }))

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: 'https://lukesshome.com',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: 'https://lukesshome.com/mis-pedidos',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ]

    return [...staticRoutes, ...productRoutes]
}
