import { createClient } from '@/lib/supabase/server'
import Container from "@/components/ui/Container";
import HeroBanner from "@/components/landing/HeroBanner";
import TrustBanner from "@/components/landing/TrustBanner";

import { CatalogoClient } from "@/components/home/CatalogoClient";
import UbicacionSection from "@/components/home/UbicacionSection";
import CTAFinalSection from "@/components/home/CTAFinalSection";
import { NewsletterPopup } from "@/components/marketing/NewsletterPopup";
import { getDynamicFilters } from "@/app/actions/filters";
import { getActiveCategories } from "@/app/actions/categories";

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
    let categoryForFilters: string | null = null;
    if (categoryParam) {
      if (categoryParam !== 'nuevo' && categoryParam !== 'descuento' && categoryParam !== 'descuentos') {
        categoryForFilters = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)
      }
    }

    dynamicFilters = await getDynamicFilters(categoryForFilters)
    activeCategories = await getActiveCategories()
  } catch (err) {
    console.error('Error fetching categories or filters:', err)
  }

  return (
    <>
      <HeroBanner />
      <TrustBanner />

      <CatalogoClient
        initialProducts={products}
        initialFilters={dynamicFilters}
        categories={activeCategories}
        selectedCategory={categoryParam || null}
      />
      <UbicacionSection />
      <CTAFinalSection />

      {/* Popup newsletter */}
      <NewsletterPopup />
    </>
  );
}
