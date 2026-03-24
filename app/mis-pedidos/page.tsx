'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/context/AuthContext'
import Container from '@/components/ui/Container'
import { Package, Calendar, MapPin, ChevronRight, Clock, AlertCircle, ShoppingBag, Eye, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

interface OrderItem {
  id: string
  quantity: number
  price_at_purchase: number
  size?: string
  color?: string
  products: {
    name: string
    image_url: string
    sku: string
  }
}

interface Order {
  id: string
  created_at: string
  total_amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  delivery_method: 'delivery' | 'pickup'
  shipping_address?: string
  shipping_city?: string
  items: OrderItem[]
  order_number?: string
}

const statusMap = {
  pending: { label: 'Pendiente', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  processing: { label: 'En proceso', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  shipped: { label: 'En camino', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  delivered: { label: 'Entregado', color: 'bg-green-100 text-green-700 border-green-200' },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-700 border-red-200' },
}

export default function MisPedidosPage() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            items:order_items(
              id,
              quantity,
              price_at_purchase,
              size,
              color,
              products(name, image_url, sku)
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setOrders(data || [])
      } catch (err) {
        console.error('Error fetching orders:', err)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      if (user) {
        fetchOrders()
      } else {
        setLoading(false)
      }
    }
  }, [user, authLoading])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-32 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <section className="min-h-screen pt-32 pb-12 bg-gray-50">
        <Container className="max-w-md text-center">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Inicia sesión</h1>
            <p className="text-gray-500 mb-8">Debes estar registrado para ver tu historial de pedidos.</p>
            <Link
              href="/"
              className="inline-block w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all mb-4"
            >
              Volver al inicio
            </Link>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="min-h-screen pt-32 pb-20 bg-gray-50">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Link href="/" className="hover:text-gray-900 transition-colors">Inicio</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gray-900 font-medium">Mis Pedidos</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Mis Pedidos</h1>
            <p className="text-gray-500 mt-2">Gestiona tus compras y revisa el estado de tus envíos.</p>
          </div>
          {orders.length > 0 && (
            <div className="bg-white px-4 py-2 border border-gray-200 rounded-lg shadow-sm">
              <span className="text-sm font-medium text-gray-500">Total pedidos: </span>
              <span className="text-sm font-bold text-gray-900">{orders.length}</span>
            </div>
          )}
        </div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm"
          >
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Aún no tienes pedidos</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">Cuando realices tu primera compra, aparecerá aquí para que puedas seguirla paso a paso.</p>
            <Link
              href="/#catalogo"
              className="inline-flex items-center gap-2 bg-gray-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-black transition-all"
            >
              Ir a la tienda
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="bg-gray-50/50 p-4 md:p-6 border-b border-gray-100 flex flex-wrap gap-y-4 items-center justify-between">
                  <div className="flex flex-wrap gap-x-8 gap-y-2">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Fecha</p>
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(order.created_at).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total</p>
                      <p className="text-sm font-bold text-gray-900">Bs {order.total_amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Método</p>
                      <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                        {order.delivery_method === 'delivery' ? (
                          <><MapPin className="w-4 h-4 text-gray-400" /> Envío a domicilio</>
                        ) : (
                          <><Package className="w-4 h-4 text-gray-400" /> Retiro en tienda</>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border \${statusMap[order.status]?.color || ''}`}>
                      {statusMap[order.status]?.label || order.status}
                    </span>
                    <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 md:p-6">
                  <div className="divide-y divide-gray-100">
                    {order.items.map((item) => (
                      <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                        <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.products.image_url || '/placeholder.png'}
                            alt={item.products.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-sm truncate">{item.products.name}</h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {item.size && (
                              <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded uppercase">Talla: {item.size}</span>
                            )}
                            {item.color && (
                                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded uppercase">Color: {item.color}</span>
                              )}
                            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded uppercase">Cant: {item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">Bs {item.price_at_purchase.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer Info */}
                  {(order.delivery_method === 'delivery' && order.shipping_address) && (
                    <div className="mt-6 pt-6 border-t border-gray-100 bg-gray-50/30 -mx-6 px-6 pb-6">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Dirección de entrega</p>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {order.shipping_address}{order.shipping_city ? `, \${order.shipping_city}` : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
                    <button className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-all">
                      Repetir pedido
                    </button>
                    <button className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-gray-700 text-sm font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all">
                      <ExternalLink className="w-4 h-4" /> Ver factura
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Support Box */}
            <div className="bg-lukess-gold/10 border border-lukess-gold/20 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 justify-between">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="w-12 h-12 bg-lukess-gold text-white rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">¿Deseas cambiar algo de tu pedido?</h3>
                  <p className="text-sm text-gray-600">Contactate con soporte si necesitas modificar la dirección o cancelar un pedido pendiente.</p>
                </div>
              </div>
              <a
                href="https://wa.me/591XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto text-center px-6 py-3 bg-lukess-gold text-white font-bold rounded-xl hover:bg-lukess-gold-dark transition-all shadow-sm"
              >
                Hablar con Soporte
              </a>
            </div>
          </div>
        )}
      </Container>
    </section>
  )
}
