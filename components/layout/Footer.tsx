'use client'
import { useState } from 'react'
import Container from '@/components/ui/Container'
import { Mail, MapPin, Phone, Facebook, Instagram, Send, Loader2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { buildWhatsAppUrl, formatWhatsAppNumber } from '@/lib/utils/whatsapp'
import { createClient } from '@/lib/supabase/client'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!email || isSubmitting) return

    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('subscribers')
        .insert({ email: email.trim().toLowerCase(), source: 'footer' })

      if (error?.code === '23505') {
        toast('Ya estás suscrito 😊')
        setEmail('')
        return
      }
      if (error) throw error
      toast.success('¡Suscripción exitosa!')
      setEmail('')
    } catch {
      toast.error('Error al suscribir, intenta de nuevo')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="bg-gray-800 text-white mt-20">
      {/* Newsletter section */}
      <div className="bg-accent-500 py-12">
        <Container>
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h3 className="text-2xl font-bold">Recibe Ofertas Exclusivas</h3>
            <p className="text-white/90">
              Suscríbete y obtén 10% de descuento en tu primera compra
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 border-2 border-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                required
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-gray-800 px-6 py-3 rounded-lg font-bold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 shadow-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                {isSubmitting ? 'Suscribiendo...' : 'Suscribir'}
              </button>
            </form>
          </div>
        </Container>
      </div>

      {/* Main footer */}
      <div className="py-12">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Columna 1: Atención al Cliente */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-accent-400">
                Atención al Cliente
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/como-comprar" className="hover:text-accent-400 transition-colors text-sm">
                    ¿Cómo Comprar?
                  </Link>
                </li>
                <li>
                  <Link href="/metodos-pago" className="hover:text-accent-400 transition-colors text-sm">
                    Métodos de Pago
                  </Link>
                </li>
                <li>
                  <Link href="/mis-pedidos" className="hover:text-accent-400 transition-colors text-sm">
                    Mis Pedidos
                  </Link>
                </li>
                <li>
                  <Link href="/preguntas-frecuentes" className="hover:text-accent-400 transition-colors text-sm">
                    Preguntas Frecuentes
                  </Link>
                </li>
              </ul>
            </div>

            {/* Columna 2: Legal */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-accent-400">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/terminos" className="hover:text-accent-400 transition-colors text-sm">
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link href="/politicas-envio" className="hover:text-accent-400 transition-colors text-sm">
                    Políticas de Envío
                  </Link>
                </li>
                <li>
                  <Link href="/politicas-cambio" className="hover:text-accent-400 transition-colors text-sm">
                    Cambios y Devoluciones
                  </Link>
                </li>
                <li>
                  <Link href="/privacidad" className="hover:text-accent-400 transition-colors text-sm">
                    Política de Privacidad
                  </Link>
                </li>
              </ul>
            </div>

            {/* Columna 3: Guías */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-accent-400">Guías</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/guia-tallas" className="hover:text-accent-400 transition-colors text-sm">
                    Guía de Tallas
                  </Link>
                </li>
                <li>
                  <Link href="/cuidado-prendas" className="hover:text-accent-400 transition-colors text-sm">
                    Cuidado de Prendas
                  </Link>
                </li>
                <li>
                  <Link href="/plazos-entrega" className="hover:text-accent-400 transition-colors text-sm">
                    Plazos de Entrega
                  </Link>
                </li>
                <li>
                  <Link href="/sobre-nosotros" className="hover:text-accent-400 transition-colors text-sm">
                    Sobre Nosotros
                  </Link>
                </li>
              </ul>
            </div>

            {/* Columna 4: Contacto */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-accent-400">Contáctanos</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">WhatsApp</p>
                    <a href={buildWhatsAppUrl("Hola, quiero consultar sobre un producto")} className="hover:text-accent-400 transition-colors text-sm">
                      {formatWhatsAppNumber()}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Email</p>
                    <a href="mailto:contacto@lukesshome.com" className="hover:text-accent-400 transition-colors text-sm">
                      contacto@lukesshome.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Ubicación</p>
                    <p className="text-sm text-white/80">
                      Mercado Mutualista<br />
                      Santa Cruz, Bolivia
                    </p>
                  </div>
                </li>
              </ul>

              {/* Redes sociales */}
              <div className="flex gap-3 mt-6">
                <a
                  href="https://facebook.com/lukesshome"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com/lukess.home"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.tiktok.com/@lukesshome"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 rounded-full hover:bg-white/20 hover:text-accent-500 transition-colors"
                  aria-label="TikTok"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-6">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/70">
            <p>© 2026 Lukess Home. Todos los derechos reservados.</p>
            <p>
              📍 Mercado Mutualista, Santa Cruz, Bolivia |
              <a href={buildWhatsAppUrl("Hola, quiero consultar sobre un producto")} className="hover:text-white ml-1">
                WhatsApp: {formatWhatsAppNumber()}
              </a>
            </p>
          </div>
        </Container>
      </div>
    </footer>
  )
}
