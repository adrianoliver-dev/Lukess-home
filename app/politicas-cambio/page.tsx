import { LegalPageTemplate } from '@/components/legal/LegalPageTemplate'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Políticas de Cambios y Devoluciones - Lukess Home',
  description: 'Conoce los requisitos, plazos y condiciones para realizar cambios de talla o devoluciones de productos en Lukess Home.',
}

export default function PoliticasCambioPage() {
  return (
    <LegalPageTemplate title="Políticas de Cambios y Devoluciones" lastUpdated="2 de marzo de 2026">
      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
        En Lukess Home garantizamos la calidad y originalidad de todas nuestras prendas importadas. Si necesitas cambiar un producto por talla o defecto de fábrica, hemos establecido las siguientes políticas para proteger tanto tu compra como la higiene de nuestro inventario.
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Plazos para Cambios</h2>
        <p className="text-gray-700 mb-4">
          Tienes un plazo máximo de <strong>7 días calendario</strong> contados a partir de la fecha de entrega de tu pedido (o de la compra en tienda física) para solicitar un cambio.
        </p>
        <p className="text-gray-700 text-sm italic">
          *Pasado este plazo, el sistema no autorizará cambios bajo ninguna circunstancia.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Condiciones Obligatorias para Aceptar un Cambio</h2>
        <p className="text-gray-700 mb-4">
          Para que un cambio sea procesado y aceptado, el producto debe cumplir estrictamente con lo siguiente:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-3 ml-4 mb-6">
          <li><strong>Estado impecable:</strong> La prenda no debe haber sido usada, lavada, alterada ni manchada.</li>
          <li><strong>Olor:</strong> No debe presentar olores a perfume, sudor, humo u otros agentes externos.</li>
          <li><strong>Etiquetas originales:</strong> Debe conservar absolutamente todas sus etiquetas de cartón, stickers de marca y etiquetas internas de lavado, sin haber sido cortadas o arrancadas.</li>
          <li><strong>Comprobante:</strong> Es obligatorio presentar el recibo físico, factura o confirmación de pedido por WhatsApp.</li>
        </ul>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <p className="text-red-800 font-medium">Atención:</p>
          <p className="text-red-700 text-sm">Nuestro equipo de ventas en tienda física realizará una inspección detallada de la prenda. Si no cumple con estas condiciones, el cambio será rechazado.</p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Artículos sin Derecho a Cambio</h2>
        <p className="text-gray-700 mb-4">
          Por razones estrictas de salud e higiene, los siguientes artículos <strong>NO tienen cambio ni devolución bajo ningún motivo:</strong>
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>Ropa interior (bóxers, calzoncillos).</li>
          <li>Calcetines y medias.</li>
          <li>Artículos comprados en liquidación, "Sale" o descuento especial (excepto por falla de fábrica demostrable).</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Tipos de Cambio</h2>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">4.1. Cambio por Talla o Color</h3>
        <p className="text-gray-700 mb-4">
          Si la prenda te quedó grande o pequeña, puedes cambiarla por otra talla del mismo modelo. Si no hay stock de la talla que necesitas, puedes elegir otro producto de igual o mayor valor (abonando la diferencia). No realizamos devoluciones de dinero en efectivo si eliges un producto más económico.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">4.2. Cambio por Defecto de Fábrica</h3>
        <p className="text-gray-700 mb-4">
          Al ser importadores directos, revisamos cada prenda, pero si encuentras una falla real de costura o fábrica (no causada por mal uso o lavado incorrecto), te cambiaremos el producto inmediatamente por uno nuevo.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. ¿Cómo Solicitar un Cambio?</h2>
        <p className="text-gray-700 mb-4">
          Todo cambio físico debe realizarse presencialmente en nuestras instalaciones para verificar la prenda:
        </p>
        <ol className="list-decimal list-inside text-gray-700 space-y-3 ml-4">
          <li>Comunícate a nuestro WhatsApp <strong>75516136</strong> indicando tu número de pedido y el motivo del cambio.</li>
          <li>Dirígete a nuestras casetas principales (Puesto 123 o 228) en el Mercado Mutualista.</li>
          <li>Entrega la prenda para su inspección y elige tu nuevo producto.</li>
        </ol>
        <p className="text-gray-700 mt-4">
          <strong>Sobre los envíos:</strong> Si solicitaste entrega a domicilio y necesitas un cambio de talla, los costos de envío (ida y vuelta) corren por cuenta del cliente. Te recomendamos usar nuestra <a href="/guia-tallas" className="text-gray-900 font-semibold hover:underline">Guía de Tallas</a> antes de comprar para evitar este gasto.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Política de Devoluciones (Dinero)</h2>
        <p className="text-gray-700">
          En Lukess Home <strong>no realizamos devoluciones de dinero</strong> en efectivo ni reembolsos a cuentas bancarias por arrepentimiento de compra o errores de talla del cliente. Únicamente emitiremos un reembolso total si el producto entregado presenta una falla de fábrica insalvable y no contamos con stock para reemplazarlo por el mismo artículo u otro similar que el cliente acepte.
        </p>
      </section>
    </LegalPageTemplate>
  )
}
