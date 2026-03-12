import Link from 'next/link'
import { Instagram, Facebook, MapPin, Phone, Mail, ShieldCheck, PackageCheck, Truck, CreditCard } from 'lucide-react'
import Container from '@/components/ui/Container'
import { formatWhatsAppNumber } from '@/lib/utils/whatsapp'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <Container>
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Columna 1: Sobre Lukess Home */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">
              Lukess
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Premium menswear essentials. Elevating everyday style with uncompromising quality and timeless design.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/lukesshome"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-lukess-gold text-gray-400 hover:text-white rounded-full flex items-center justify-center transition-all"
                aria-label="Instagram de Lukess Home"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/share/1HsWDu9YgU/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-lukess-gold text-gray-400 hover:text-white rounded-full flex items-center justify-center transition-all"
                aria-label="Facebook de Lukess Home"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@lukess.home"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-lukess-gold text-gray-400 hover:text-white rounded-full flex items-center justify-center transition-all"
                aria-label="TikTok de Lukess Home"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Columna 2: Atención al Cliente */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Atención al Cliente
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/como-comprar" className="text-sm text-gray-400 hover:text-white transition-colors">
                  ¿Cómo Comprar?
                </Link>
              </li>
              <li>
                <Link href="/metodos-pago" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Métodos de Pago
                </Link>
              </li>
              <li>
                <Link href="/mis-pedidos" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Mis Pedidos
                </Link>
              </li>
              <li>
                <Link href="/politicas-cambio" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Cambios y Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/guia-tallas" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Guía de Tallas
                </Link>
              </li>
              <li>
                <Link href="/preguntas-frecuentes" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Legal y Políticas */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Legal y Políticas
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terminos" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Políticas de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/politicas-envio" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Políticas de Envío
                </Link>
              </li>
              <li>
                <Link href="/garantia-autenticidad" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Garantía de Autenticidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contacto
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-lukess-gold mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">
                  123 Fashion Avenue<br />
                  New York, NY 10001
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-lukess-gold mt-0.5 shrink-0" />
                <a
                  href={`tel:${formatWhatsAppNumber().replace(' ', '')}`}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {formatWhatsAppNumber()}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-lukess-gold mt-0.5 shrink-0" />
                <a
                  href="mailto:demo-lukess@adrianoliver.dev"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  demo-lukess@adrianoliver.dev
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-lukess-gold mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">
                  Lun - Sáb: 8:00 AM - 10:00 PM<br />
                  Dom: 9:00 AM - 9:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Badges de Confianza */}
        <div className="border-t border-gray-800 pt-10 pb-8">
          <h4 className="text-center text-sm font-semibold text-white uppercase tracking-wider mb-6">
            Comprá con Confianza
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-xs text-gray-400 font-medium">Productos 100% Originales</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                <PackageCheck className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-xs text-gray-400 font-medium">Garantía de Calidad</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-orange-500" />
              </div>
              <span className="text-xs text-gray-400 font-medium">Worldwide Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-500" />
              </div>
              <span className="text-xs text-gray-400 font-medium">Pago Seguro QR/Tarjeta</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-xs text-gray-500">
            © {currentYear} Lukess. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}
