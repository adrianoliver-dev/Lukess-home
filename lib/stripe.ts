import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey && process.env.NODE_ENV === 'production') {
  console.warn('⚠️ STRIPE_SECRET_KEY no está definido en las variables de entorno de Vercel (Producción).')
}

export const stripe = new Stripe(stripeSecretKey || '', {
  apiVersion: '2024-12-18.acacia' as any,
  typescript: true,
})

