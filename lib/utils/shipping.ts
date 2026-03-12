// Haversine formula — distance between 2 GPS points in km
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLng = (lng2 - lng1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// Origin: Mercado Mutualista, Santa Cruz de la Sierra
const ORIGIN = { lat: -17.762778, lng: -63.161667 }

export const FREE_SHIPPING_THRESHOLD = 150  // USD
export const MAX_DELIVERY_DISTANCE_KM = 50000  // Worldwide

// Returns shipping cost in USD, or 'out_of_range'
export function calculateShippingCost(
  distanceKm: number,
  orderTotal: number,
): number | 'out_of_range' {
  if (distanceKm > MAX_DELIVERY_DISTANCE_KM) return 'out_of_range'
  if (orderTotal >= FREE_SHIPPING_THRESHOLD) return 0
  return 15 // Flat worldwide shipping
}

export function getDistanceFromMutualista(lat: number, lng: number): number {
  return calculateDistance(ORIGIN.lat, ORIGIN.lng, lat, lng)
}

export function getMapsLink(lat: number, lng: number): string {
  return `https://maps.google.com/?q=${lat},${lng}`
}

export const PICKUP_LOCATIONS = [
  {
    id: 'store-ny',
    name: 'New York Flagship',
    aisle: '5th Ave',
    stall: 'Store 101',
    hours: 'Mon-Sat: 10:00 AM - 8:00 PM',
    mapsUrl: '#',
    mapsLabel: 'View on Maps →',
  },
  {
    id: 'store-ldn',
    name: 'London Boutique',
    aisle: 'Regent Street',
    stall: 'Store 42',
    hours: 'Mon-Sat: 9:00 AM - 7:00 PM',
    mapsUrl: '#',
    mapsLabel: 'View on Maps →',
  },
] as const
