'use client'
import { useState } from 'react'
import Container from '@/components/ui/Container'
import { Mail, MapPin, Phone, Send, Loader2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { buildWhatsAppUrl, formatWhatsAppNumber } from '@/lib/utils/whatsapp'
import { createClient } from '@/lib/supabase/client'

const shopLinks = [
  { href: '/?filter=nuevo#catalogo', label: 'Nuevo' },
  { href: '/?filter=camisas#catalogo', label: 'Camisas' },
  { href: '/?filter=pantalones#catalogo', label: 'Pantalones' },
  { href: '/?filter=blazers#catalogo', label: 'Blazers' },
  { href: '/?filter=accesorios#catalogo', label: 'Accesorios' },
]

const serviceLinks = [
  { href: '/como-comprar', label: '¿Cómo Comprar?' },
  { href: '/metodos-pago', label: 'Métodos de Pago' },
  { href: '/mis-pedidos', label: 'Mis Pedidos' },
  { href: '/politicas-cambio', label: 'Cambios y Devoluciones' },
  { href: '/guia-tallas', label: 'Guía de Tallas' },
]

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
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      {/* Newsletter section */}
      <div className="bg-gray-100 py-10">
        <Container>
          <div className="max-w-xl mx-auto text-center space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">
              Recibe Ofertas Exclusivas
            </h3>
            <p className="text-sm text-gray-500">
              Suscríbete y obtén 10% de descuento en tu primera compra
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                className="flex-1 px-4 py-2.5 rounded-lg text-sm text-gray-900 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors bg-white"
                required
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {isSubmitting ? 'Enviando...' : 'Suscribir'}
              </button>
            </form>
          </div>
        </Container>
      </div>

      {/* Main footer grid */}
      <div className="pt-16 pb-8">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Column 1: Brand / About */}
            <div>
              <div className="mb-4">
                <span className="text-xl font-extrabold tracking-tight text-gray-900">
                  LUKESS
                </span>
                <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-gray-400 ml-1.5">
                  HOME
                </span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Ropa y accesorios 100% originales de marcas importadas. Desde 2014 vistiendo a Santa Cruz con estilo.
              </p>

              {/* Social icons */}
              <div className="flex gap-4">
                <a
                  href="https://facebook.com/lukesshome"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-900 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
                <a
                  href="https://instagram.com/lukess.home"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-900 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                </a>
                <a
                  href="https://www.tiktok.com/@lukesshome"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-900 transition-colors"
                  aria-label="TikTok"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Tienda */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">
                Tienda
              </h4>
              <ul className="space-y-3">
                {shopLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Atención al Cliente */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">
                Atención al Cliente
              </h4>
              <ul className="space-y-3">
                {serviceLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contacto */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">
                Contacto
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">WhatsApp</p>
                    <a
                      href={buildWhatsAppUrl('Hola, quiero consultar sobre un producto')}
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {formatWhatsAppNumber()}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Email</p>
                    <a
                      href="mailto:contacto@lukesshome.com"
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      contacto@lukesshome.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Ubicación</p>
                    <p className="text-sm text-gray-500">
                      Mercado Mutualista<br />
                      Pasillos 2, 3 y 5<br />
                      Santa Cruz, Bolivia
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 py-6">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>© 2026 Lukess Home. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              <Link href="/terminos" className="hover:text-gray-900 transition-colors">
                Términos
              </Link>
              <Link href="/privacidad" className="hover:text-gray-900 transition-colors">
                Privacidad
              </Link>
              <Link href="/politicas-envio" className="hover:text-gray-900 transition-colors">
                Envíos
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  )
}
