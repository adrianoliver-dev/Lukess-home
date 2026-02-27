import { buildWhatsAppUrl, formatWhatsAppNumber } from '@/lib/utils/whatsapp'
import { LegalPageTemplate } from '@/components/legal/LegalPageTemplate'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cambios y Devoluciones - Lukess Home',
}

export default function PoliticasCambioPage() {
  return (
    <LegalPageTemplate title="Políticas de Cambios y Devoluciones" lastUpdated="10 de febrero de 2026">
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Plazo para Cambios
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Tienes <strong>30 días</strong> desde la fecha de compra para solicitar un cambio
          de producto, siempre que cumpla con las condiciones establecidas.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Condiciones para Cambios
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Para que tu cambio sea aceptado, el producto debe cumplir con:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Estar en perfecto estado, sin uso ni lavado</li>
          <li>Conservar todas las etiquetas originales</li>
          <li>Presentar comprobante de compra (ticket o factura)</li>
          <li>No tener daños, manchas o alteraciones</li>
          <li>Estar en su empaque original (si aplica)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Productos No Cambiables
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Ropa interior y calcetines (por razones de higiene)</li>
          <li>Productos en oferta o liquidación (salvo defecto de fábrica)</li>
          <li>Productos personalizados o hechos a medida</li>
          <li>Accesorios sin empaque original</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Proceso de Cambio
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700">
          <li>Contacta por WhatsApp ({formatWhatsAppNumber()}) indicando el producto a cambiar</li>
          <li>Envía foto del producto y comprobante de compra</li>
          <li>Nuestro equipo verificará que cumpla las condiciones</li>
          <li>Acércate a cualquiera de nuestros 3 puestos con el producto</li>
          <li>Elige tu nuevo producto (mismo valor o superior pagando diferencia)</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Devoluciones de Dinero
        </h2>
        <p className="text-gray-700 leading-relaxed">
          <strong>No realizamos devoluciones de dinero.</strong> Solo ofrecemos cambios
          por otro producto de igual o mayor valor. En caso de defecto de fábrica comprobado,
          se evaluará cada caso individualmente.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Defectos de Fábrica
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Si detectas un defecto de fábrica en tu producto, contáctanos inmediatamente.
          Evaluaremos el caso y, si procede, realizaremos el cambio sin costo adicional
          o gestionaremos la garantía con el fabricante.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Contacto
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Para solicitar un cambio o consultar sobre nuestras políticas:
        </p>
        <div className="mt-4 space-y-2 text-gray-700">
          <p>📱 WhatsApp: <a href={buildWhatsAppUrl("Hola, tengo una consulta sobre cambios")} className="text-gray-900 font-semibold">{formatWhatsAppNumber()}</a></p>
          <p>📍 Mercado Mutualista - 3 puestos (Pasillos -2, -3 y -5)</p>
          <p>🕐 Lun-Sáb: 8:00 AM - 10:00 PM | Dom: 9:00 AM - 9:00 PM</p>
        </div>
      </section>
    </LegalPageTemplate>
  )
}
