import { track } from '@vercel/analytics'

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}

function isGtagReady(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function'
}

export function trackViewItem(product: {
  id: string
  name: string
  price: number
  category?: string
  brand?: string
}): void {
  try {
    if (!isGtagReady()) return
    window.gtag('event', 'view_item', {
      currency: 'BOB',
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          quantity: 1,
          item_category: product.category,
          item_brand: product.brand,
        },
      ],
    })
  } catch {
    // non-blocking
  }
}

export function trackAddToCart(product: {
  id: string
  name: string
  price: number
  quantity: number
  category?: string
}): void {
  try {
    track('add_to_cart', { product_id: product.id, product_name: product.name, quantity: product.quantity })
  } catch {
    // non-blocking
  }
  try {
    if (!isGtagReady()) return
    window.gtag('event', 'add_to_cart', {
      currency: 'BOB',
      value: product.price * product.quantity,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          quantity: product.quantity,
          item_category: product.category,
        },
      ],
    })
  } catch {
    // non-blocking
  }
}

export function trackRemoveFromCart(product: {
  id: string
  name: string
  price: number
  quantity: number
}): void {
  try {
    if (!isGtagReady()) return
    window.gtag('event', 'remove_from_cart', {
      currency: 'BOB',
      value: product.price * product.quantity,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          quantity: product.quantity,
        },
      ],
    })
  } catch {
    // non-blocking
  }
}

export function trackBeginCheckout(cart: {
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
  total: number
}): void {
  try {
    track('started_checkout', { item_count: cart.items.length, value: cart.total })
  } catch {
    // non-blocking
  }
  try {
    if (!isGtagReady()) return
    window.gtag('event', 'begin_checkout', {
      currency: 'BOB',
      value: cart.total,
      items: cart.items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    })
  } catch {
    // non-blocking
  }
}

export function trackPurchase(order: {
  orderId: string
  total: number
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    category?: string
  }>
}): void {
  try {
    track('completed_purchase', { value: order.total, order_id: order.orderId })
  } catch {
    // non-blocking
  }
  try {
    if (!isGtagReady()) return
    window.gtag('event', 'purchase', {
      transaction_id: order.orderId,
      currency: 'BOB',
      value: order.total,
      items: order.items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
        item_category: item.category,
      })),
    })
  } catch {
    // non-blocking
  }
}

export function trackSearch(searchTerm: string): void {
  try {
    if (!isGtagReady()) return
    window.gtag('event', 'search', {
      search_term: searchTerm,
    })
  } catch {
    // non-blocking
  }
}

export function trackViewItemList(
  listName: string,
  products: Array<{ id: string; name: string; price: number }>
): void {
  try {
    if (!isGtagReady()) return
    window.gtag('event', 'view_item_list', {
      item_list_name: listName,
      items: products.map((p, index) => ({
        item_id: p.id,
        item_name: p.name,
        price: p.price,
        index,
      })),
    })
  } catch {
    // non-blocking
  }
}
