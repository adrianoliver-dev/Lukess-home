import { createClient } from '@/lib/supabase/server'
import Container from "@/components/ui/Container";
import HeroBanner from "@/components/landing/HeroBanner";
import TrustBanner from "@/components/landing/TrustBanner";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const UbicacionSection = dynamic(() => import("@/components/home/UbicacionSection"), { 
  loading: () => <div className="h-96 w-full animate-pulse bg-gray-50/50" />,
});
const CTAFinalSection = dynamic(() => import("@/components/home/CTAFinalSection"), { 
  loading: () => <div className="h-64 w-full animate-pulse bg-gray-50/50" />,
});
const NewsletterPopup = dynamic(() => import("@/components/marketing/NewsletterPopup").then((mod) => mod.NewsletterPopup), { 
  loading: () => <div className="h-64 w-full animate-pulse bg-gray-50/50" />
});

import { CatalogoClient } from "@/components/home/CatalogoClient";
import { getDynamicFilters } from "@/app/actions/filters";
import { getActiveCategories } from "@/app/actions/categories";
import { HomeClientWrapper } from "@/components/home/HomeClientWrapper";

export default async function Home(
  props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
  }
) {
  const searchParams = await props.searchParams
  const sort = searchParams?.sort as string | undefined
  const categoryParam = (searchParams?.category || searchParams?.filter) as string | undefined

  let products = []
  let dynamicFilters = null
  let activeCategories: string[] = []

  try {
    const supabase = await createClient()

    // Fetch productos del inventario real de Supabase
    let query = supabase
      .from('products')
      .select(`
          *,
          categories!inner(name),
          inventory(
            quantity,
            reserved_qty,
            location_id,
            size,
            color,
            locations(name)
          )
        `)
      .eq('is_active', true)
      .eq('published_to_landing', true)

    // El destacado siempre va primero a menos que se fuerce otro sort
    if (!sort || sort === 'recent') {
      query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false })
    } else if (sort === 'price-desc') {
      query = query.order('price', { ascending: false })
    } else if (sort === 'price-asc') {
      query = query.order('price', { ascending: true })
    }

    const { data, error } = await query

    if (error) {
      // Error handled silently in production
    } else {
      products = data || []
    }
  } catch (_err: unknown) {
    // Error handled silently in production
  }

  try {
    activeCategories = await getActiveCategories()
    
    let categoryForFilters: string | null = null;
    if (categoryParam) {
      if (categoryParam !== 'nuevo' && categoryParam !== 'descuento' && categoryParam !== 'descuentos') {
        // Encontrar la categoría real (case-insensitive)
        categoryForFilters = activeCategories.find(
          c => c.toLowerCase() === categoryParam.toLowerCase()
        ) || null;
      }
    }

    // ALWAYS call getDynamicFilters with current category
    dynamicFilters = await getDynamicFilters(categoryForFilters)
  } catch (err) {
    console.error('Error fetching categories or filters:', err)
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lukess-home.vercel.app'

  const localBusinessLd = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: 'Lukess Home',
    description: 'Ropa masculina premium. Básicos de lujo para el hombre moderno.',
    url: baseUrl,
    telephone: '+59175516136',
    email: 'lukess@adrianoliver.dev',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Mercado Mutualista, Puestos 1, 2 y 3',
      addressLocality: 'Santa Cruz de la Sierra',
      addressCountry: 'BO'
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '22:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '09:00',
        closes: '21:00'
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }}
      />
      <HeroBanner />
      <TrustBanner />

      <Suspense fallback={<div className="h-96 w-full animate-pulse bg-gray-50/50" />}>
        <CatalogoClient
          key={categoryParam || 'all'}
          initialProducts={products}
          initialFilters={dynamicFilters}
          categories={activeCategories}
          selectedCategory={categoryParam || null}
        />
      </Suspense>
      <HomeClientWrapper>
        <UbicacionSection />
        <CTAFinalSection />
      </HomeClientWrapper>

      {/* Popup newsletter */}
      <NewsletterPopup />
    </>
  );
}
