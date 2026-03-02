import { createClient } from '@/lib/supabase/server'
import { ProductDetail } from '@/components/producto/ProductDetail'
import { notFound } from 'next/navigation'
import type { Metadata, ResolvingMetadata } from 'next'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: ProductPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('name, description, image_url, gallery')
    .eq('id', id)
    .single()

  if (!product) {
    return {
      title: 'Producto no encontrado'
    }
  }

  const images = product.image_url ? [product.image_url] : []
  if (product.gallery && product.gallery.length > 0) {
    images.push(...product.gallery)
  }

  return {
    title: product.name,
    description: `Compra ${product.name} en Lukess Home. ${product.description ? product.description.slice(0, 100) : 'Ingresa ahora para ver colores, tallas y más detalles.'}`,
    openGraph: {
      title: `${product.name} | Lukess Home`,
      description: `Compra ${product.name} en Lukess Home.`,
      images: images.map(url => ({ url })),
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Obtener producto
  const { data: product } = await supabase
    .from('products')
    .select(
      `
      *,
      categories(name),
      inventory(
        quantity,
        reserved_qty,
        location_id,
        size,
        locations(name)
      )
    `
    )
    .eq('id', id)
    .eq('is_active', true)
    .eq('published_to_landing', true)
    .single()

  if (!product) {
    notFound()
  }

  // Obtener productos relacionados (misma categoría)
  const { data: relatedProducts } = await supabase
    .from('products')
    .select(
      `
      *,
      categories(name),
      inventory(quantity, reserved_qty)
    `
    )
    .eq('category_id', product.category_id)
    .eq('is_active', true)
    .eq('published_to_landing', true)
    .neq('id', id)
    .limit(4)

  const inStock = product.inventory && product.inventory.some((i: any) => i.quantity - (i.reserved_qty || 0) > 0)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image_url ? [product.image_url] : [],
    description: `Compra ${product.name} en Lukess Home. ${product.description || ''}`,
    brand: {
      '@type': 'Brand',
      name: 'Lukess Home'
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'BOB',
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://lukesshome.com/producto/${product.id}`
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} relatedProducts={relatedProducts || []} />
    </>
  )
}
