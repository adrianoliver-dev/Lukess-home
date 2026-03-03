import { buildWhatsAppUrl, formatWhatsAppNumber } from '@/lib/utils/whatsapp'
import { LegalPageTemplate } from '@/components/legal/LegalPageTemplate'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '¿Cómo Comprar? - Lukess Home | Guía de Compra Fácil',
  description: 'Descubre las 3 formas de comprar ropa de marca en Lukess Home: catálogo online, WhatsApp o visita nuestras tiendas en Mercado Mutualista.',
}

export default function ComoComprarPage() {
  return (
    <LegalPageTemplate title="¿Cómo Comprar en Lukess Home?" lastUpdated="2 de marzo de 2026">
      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
        Comprar en Lukess Home es simple y seguro. Elegí el método que más te convenga: explorá el catálogo online, escribinos directo por WhatsApp o visitá nuestras tiendas físicas en el Mercado Mutualista. Siempre con la garantía de ropa 100% original importada.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <span className="text-3xl">🛒</span> Opción 1: Compra desde el Catálogo Web
        </h2>
        <div className="bg-gray-50 rounded-lg p-6 mb-4">
          <p className="text-gray-700 mb-4">
            Navegá nuestro catálogo completo, seleccioná tus productos favoritos y coordiná tu entrega o retiro en tienda.
          </p>
        </div>
        <ol className="space-y-5 text-gray-700">
          <li className="flex gap-4">
            <span className="font-bold text-gray-900 text-lg shrink-0">1.</span>
            <div>
              <strong className="text-gray-900">Explorá el catálogo</strong>
              <p className="mt-1">Usá los filtros de marca, categoría, color y precio para encontrar exactamente lo que buscás.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-gray-900 text-lg shrink-0">2.</span>
            <div>
              <strong className="text-gray-900">Agregá al carrito</strong>
              <p className="mt-1">Seleccioná talla y cantidad. Revisá siempre la guía de tallas si tenés dudas sobre el calce.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-gray-900 text-lg shrink-0">3.</span>
            <div>
              <strong className="text-gray-900">Revisá tu pedido</strong>
              <p className="mt-1">Verificá que todo esté correcto: productos, tallas y total a pagar.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-gray-900 text-lg shrink-0">4.</span>
            <div>
              <strong className="text-gray-900">Completá tus datos</strong>
              <p className="mt-1">Ingresá tu nombre, teléfono y dirección de entrega (o elegí "Retiro en tienda").</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-gray-900 text-lg shrink-0">5.</span>
            <div>
              <strong className="text-gray-900">Realizá el pago</strong>
              <p className="mt-1">Escaneá el QR de pago o hacé transferencia bancaria. Ambos métodos son instantáneos.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-gray-900 text-lg shrink-0">6.</span>
            <div>
              <strong className="text-gray-900">Confirmación automática por WhatsApp</strong>
              <p className="mt-1">Recibirás un mensaje confirmando tu pedido con los tiempos de entrega o retiro.</p>
            </div>
          </li>
        </ol>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <span className="text-3xl">💬</span> Opción 2: Compra Directa por WhatsApp
        </h2>
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-4">
          <p className="text-gray-700">
            <strong className="text-gray-900">La forma más rápida.</strong> Hablá directo con nuestro equipo, consultá stock en tiempo real y coordiná todo en una sola conversación.
          </p>
        </div>
        <ol className="space-y-5 text-gray-700">
          <li className="flex gap-4">
            <span className="font-bold text-gray-900 text-lg shrink-0">1.</span>
            <div>
              <strong className="text-gray-900">Escribinos</strong>
              <p className="mt-1">
                Enviá un mensaje a{' '}
                <a href={buildWhatsAppUrl("Hola, quiero comprar ropa de marca")} className="text-whatsapp font-semibold hover:underline" target="_blank" rel="noopener noreferrer">
                  {formatWhatsAppNumber()}
                </a>
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-gray-900 text-lg shrink-0">2.</span>
            <div>
              <strong className="text-gray-900">Indicá qué producto te interesa</strong>
              <p className="mt-1">Podés enviar una foto de la web, el nombre de la prenda o simplemente describir lo que buscás (ej: "camisa Columbia azul talla M").</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-gray-900 text-lg shrink-0">3.</span>
            <div>
              <strong className="text-gray-900">Confirmá detalles</strong>
              <p className="mt-1">Verificamos stock, te enviamos fotos reales si lo necesitás, y coordinamos entrega o retiro en tienda.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-gray-900 text-lg shrink-0">4.</span>
            <div>
              <strong className="text-gray-900">Recibí el total a pagar</strong>
              <p className="mt-1">Te enviamos el monto exacto (producto + envío si aplica).</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-gray-900 text-lg shrink-0">5.</span>
            <div>
              <strong className="text-gray-900">Pagá y listo</strong>
              <p className="mt-1">QR, transferencia o efectivo contra entrega. Vos elegís.</p>
            </div>
          </li>
        </ol>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <span className="text-3xl">🏪</span> Opción 3: Compra en Nuestras Tiendas Físicas
        </h2>
        <div className="bg-accent-50 border-2 border-accent-200 rounded-lg p-6 mb-4">
          <p className="text-gray-700">
            <strong className="text-gray-900">La experiencia completa.</strong> Probate la ropa, asesoramiento personalizado en el momento y llevás tu compra al instante.
          </p>
        </div>
        <p className="text-gray-700 mb-6">
          Encontranos en cualquiera de nuestros 3 puestos dentro del <strong>Mercado Mutualista, Santa Cruz de la Sierra</strong>:
        </p>
        <ul className="space-y-3 text-gray-700 mb-6">
          <li className="flex items-start gap-3">
            <span className="text-xl shrink-0">📍</span>
            <span><strong className="text-gray-900">Pasillo 2, Caseta 47-48</strong> — Ropa casual y deportiva</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl shrink-0">📍</span>
            <span><strong className="text-gray-900">Pasillo 3, Caseta 123</strong> — Camisas premium y blazers</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl shrink-0">📍</span>
            <span><strong className="text-gray-900">Pasillo 5, Caseta 228-229</strong> — Calzado y accesorios</span>
          </li>
        </ul>
        <div className="bg-gray-100 rounded-lg p-5">
          <p className="text-gray-900 font-semibold mb-2">🕒 Horarios de Atención:</p>
          <p className="text-gray-700">Lunes a Sábado: 8:00 AM - 10:00 PM</p>
          <p className="text-gray-700">Domingos y feriados: 9:00 AM - 9:00 PM</p>
        </div>
      </section>

      <section>
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg p-8 text-center">
          <h3 className="font-bold text-2xl mb-3">
            ¿Todavía tenés dudas?
          </h3>
          <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
            Nuestro equipo está disponible todos los días para ayudarte con cualquier consulta sobre productos, tallas, envíos o formas de pago.
          </p>
          <a
            href={buildWhatsAppUrl("Hola, tengo dudas sobre cómo comprar")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-whatsapp text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-whatsapp-dark transition-colors shadow-lg"
          >
            📱 Consultar por WhatsApp
          </a>
        </div>
      </section>
    </LegalPageTemplate>
  )
}
