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

export const FREE_SHIPPING_THRESHOLD = 400
export const MAX_DELIVERY_DISTANCE_KM = 50000  // Worldwide

// Returns shipping cost in Bs, or 'out_of_range'
export function calculateShippingCost(
  distanceKm: number,
  orderTotal: number,
): number | 'out_of_range' {
  if (distanceKm > MAX_DELIVERY_DISTANCE_KM) return 'out_of_range'
  if (orderTotal >= FREE_SHIPPING_THRESHOLD) return 0
  
  const baseCost = 5
  const costPerKm = 1.14 // Approx to get Bs 15 for 8.8km (5 + 8.8 * 1.14 = 15.03)
  return Math.round(baseCost + (distanceKm * costPerKm))
}

export function getDistanceFromMutualista(lat: number, lng: number): number {
  return calculateDistance(ORIGIN.lat, ORIGIN.lng, lat, lng)
}

export function getMapsLink(lat: number, lng: number): string {
  return `https://maps.google.com/?q=${lat},${lng}`
}

export const PICKUP_LOCATIONS = [
  {
    id: 'puesto-1',
    name: 'Puesto 1 (Caseta 47-48)',
    aisle: 'Pasillo Principal',
    stall: '47-48',
    hours: 'Lun-Sáb: 8:00 AM - 10:00 PM',
    mapsUrl: 'https://maps.app.goo.gl/hjBRWHtFGePRphPB9',
    mapsLabel: 'Ver en Maps →',
  },
  {
    id: 'puesto-2',
    name: 'Puesto 2 (Caseta 123)',
    aisle: 'Pasillo Central',
    stall: '123',
    hours: 'Lun-Sáb: 8:00 AM - 10:00 PM',
    mapsUrl: 'https://maps.app.goo.gl/C7HLiz6cWNjvMFh1A',
    mapsLabel: 'Ver en Maps →',
  },
  {
    id: 'puesto-3',
    name: 'Puesto 3 (Caseta 228-229)',
    aisle: 'Sector Ropa',
    stall: '228-229',
    hours: 'Lun-Sáb: 8:00 AM - 10:00 PM',
    mapsUrl: 'https://maps.app.goo.gl/7nxUX1ofcJhmfWKC6',
    mapsLabel: 'Ver en Maps →',
  },
] as const
