import { Product } from '@/lib/types'

export function hasActiveDiscount(product: Product): boolean {
    const discount = product.discount || product.discount_percentage || 0
    if (discount <= 0) return false

    if (product.discount_expires_at) {
        const expiryDate = new Date(product.discount_expires_at)
        if (expiryDate <= new Date()) {
            return false
        }
    }

    return true
}

export function getDiscount(product: Product): number {
    if (!hasActiveDiscount(product)) return 0
    return product.discount || product.discount_percentage || 0
}

export function getPriceWithDiscount(product: Product): number {
    const discount = getDiscount(product)
    return product.price * (1 - discount / 100)
}
