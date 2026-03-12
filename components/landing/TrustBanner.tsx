import { MapPin, Truck, ShieldCheck } from 'lucide-react'

/* ───────── Trust Pillars ───────── */

const TRUST_ITEMS = [
    {
        icon: MapPin,
        label: '3 Sucursales en Mercado Mutualista',
    },
    {
        icon: Truck,
        label: 'Envíos gratis por compras mayores a Bs 400',
    },
    {
        icon: ShieldCheck,
        label: 'Pago Seguro QR o Efectivo',
    },
] as const

/* ───────── Component ───────── */

export default function TrustBanner(): React.JSX.Element {
    return (
        <section
            aria-label="Garantías de compra"
            className="bg-neutral-900 border-y border-neutral-800"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ul className="flex items-center justify-between gap-4 py-3.5 md:py-4 overflow-x-auto hide-scrollbar">
                    {TRUST_ITEMS.map((item) => {
                        const Icon = item.icon
                        return (
                            <li
                                key={item.label}
                                className="flex items-center gap-2.5 shrink-0 min-w-max"
                            >
                                <Icon
                                    className="w-4 h-4 md:w-5 md:h-5 text-lukess-gold shrink-0"
                                    aria-hidden="true"
                                />
                                <span className="text-xs sm:text-sm text-neutral-300 font-medium whitespace-nowrap">
                                    {item.label}
                                </span>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </section>
    )
}
