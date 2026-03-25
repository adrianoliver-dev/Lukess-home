import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/auth/', '/mis-pedidos/'],
        },
        sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://lukess-home.vercel.app'}/sitemap.xml`,
    }
}
