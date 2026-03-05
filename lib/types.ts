export interface Product {
  id: string
  sku: string
  name: string
  description: string | null
  price: number
  cost: number
  brand: string | null
  sizes: string[] | null
  colors: string[] | null
  color?: string | null
  image_url: string | null          // Hero image for detail page (800×1000px)
  thumbnail_url?: string | null     // Thumbnail for catalog cards (480×600px, WebP ≤80KB)
  images?: string[] | null          // Gallery images for detail page (up to 5 images)
  is_active: boolean
  is_new?: boolean                  // Badge "NUEVO" - productos de la nueva colección
  is_new_until?: string | null      // Fecha hasta la cual se muestra badge NUEVO
  is_best_seller?: boolean          // Badge "MÁS VENDIDO"
  discount: number | null           // Descuento en porcentaje (0-100)
  discount_percentage?: number | null  // Alias para compatibilidad
  discount_expires_at?: string | null  // Fecha de expiración del descuento
  is_featured: boolean | null       // Producto destacado
  collection?: string | null        // Colección: 'primavera', 'verano', etc.
  subcategory?: string | null       // Subcategoría: 'manga-larga', 'oversize', 'elegante', etc.
  category_id: string | null
  created_at: string
  categories?: {
    name: string
  }
  inventory?: {
    quantity: number
    reserved_qty?: number
    location_id: string
    size?: string | null
    locations?: {
      name: string
    }
  }[]
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  size?: string
  color?: string
}

export interface Order {
  id: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  subtotal: number
  discount: number
  shipping_cost?: number
  total: number
  status: string
  payment_method: string
  delivery_method?: 'delivery' | 'pickup'
  shipping_address?: string | null
  shipping_reference?: string | null
  pickup_location?: string | null
  gps_lat?: number | null
  gps_lng?: number | null
  gps_distance_km?: number | null
  maps_link?: string | null
  recipient_name?: string | null
  recipient_phone?: string | null
  delivery_instructions?: string | null
  created_at: string
}
