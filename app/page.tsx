import { createClient } from '@/lib/supabase/server'
import Container from "@/components/ui/Container";
import HeroSection from "@/components/landing/HeroSection";
import TrustBanner from "@/components/landing/TrustBanner";
import AnnouncementBar from "@/components/landing/AnnouncementBar";
import PuestosSection from "@/components/home/PuestosSection";
import { CatalogoClient } from "@/components/home/CatalogoClient";
import TestimoniosSection from "@/components/home/TestimoniosSection";
import UbicacionSection from "@/components/home/UbicacionSection";
import CTAFinalSection from "@/components/home/CTAFinalSection";
import { NewsletterPopup } from "@/components/marketing/NewsletterPopup";

export default async function Home() {
  let products = []

  try {
    const supabase = await createClient()

    // Fetch productos del inventario real de Supabase
    const { data, error } = await supabase
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
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      // Error handled silently in production
    } else {
      products = data || []
    }
  } catch (_err: unknown) {
    // Error handled silently in production
  }

  return (
    <>
      <AnnouncementBar />
      <HeroSection />
      <TrustBanner />

      <PuestosSection />
      <CatalogoClient initialProducts={products} />
      <TestimoniosSection />
      <UbicacionSection />
      <CTAFinalSection />

      {/* Popup newsletter */}
      <NewsletterPopup />
    </>
  );
}
