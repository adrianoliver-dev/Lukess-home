import { createClient } from "@/lib/supabase/server";

export interface Banner {
    id: string;
    desktop_image_url: string;
    mobile_image_url: string | null;
    image_url: string; // legacy fallback — column is NOT NULL in DB
    title: string | null;
    link: string | null;
    display_order: number;
}

export async function getActiveBanners(): Promise<Banner[]> {
    const supabase = await createClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
        .from("banners")
        .select(
            "id, desktop_image_url, mobile_image_url, image_url, title, link, display_order"
        )
        .eq("is_active", true)
        .or(`start_date.is.null,start_date.lte.${now}`)
        .or(`end_date.is.null,end_date.gte.${now}`)
        .order("display_order", { ascending: true });

    if (error) {
        console.error("Error fetching banners:", error);
        return [];
    }

    return data ?? [];
}
