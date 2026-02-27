import { Percent, TrendingUp, Leaf } from 'lucide-react'

interface ProductBadgesProps {
  isNew?: boolean
  isNewUntil?: string | null
  discount?: number
  discountExpiresAt?: string | null
  lowStock?: number
  isBestSeller?: boolean
  collection?: string | null
}

export function ProductBadges({ isNew, isNewUntil, discount, discountExpiresAt, isBestSeller, collection }: ProductBadgesProps): React.ReactElement {
  // Badge NUEVO: solo si is_new=true Y (no tiene fecha límite O la fecha no ha expirado)
  const isActuallyNew = isNew === true && (
    !isNewUntil || new Date(isNewUntil) > new Date()
  )

  // Descuento activo: solo si discount > 0 Y (no tiene fecha límite O la fecha no ha expirado)
  const hasActiveDiscount = !!(discount && discount > 0) && (
    !discountExpiresAt || new Date(discountExpiresAt) > new Date()
  )

  return (
    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
      {isActuallyNew && (
        <span className="bg-black text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm">
          Nuevo
        </span>
      )}

      {hasActiveDiscount && (
        <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-sm flex items-center gap-1">
          <Percent className="w-2.5 h-2.5" />
          -{discount}%
        </span>
      )}

      {collection === 'primavera' && !isActuallyNew && (
        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-sm flex items-center gap-1">
          <Leaf className="w-2.5 h-2.5" />
          Primavera
        </span>
      )}

      {isBestSeller && (
        <span className="bg-gray-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-sm flex items-center gap-1">
          <TrendingUp className="w-2.5 h-2.5" />
          Top
        </span>
      )}
    </div>
  )
}
