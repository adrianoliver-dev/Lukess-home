import { buildWhatsAppUrl, formatWhatsAppNumber } from '@/lib/utils/whatsapp'
import { LegalPageTemplate } from '@/components/legal/LegalPageTemplate'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Métodos de Pago - Lukess Home',
  description: 'Conoce nuestros métodos de pago: QR Simple, Transferencias Bancarias, Efectivo y Tarjetas en nuestras tiendas en Santa Cruz.',
}

export default function MetodosPagoPage() {
  return (
    <LegalPageTemplate title="Métodos de Pago" lastUpdated="2 de marzo de 2026">
      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
        Para garantizar la seguridad de tus transacciones y mantener nuestros precios competitivos, procesamos todos los pagos de forma directa. Al finalizar tu pedido en la web, el sistema te generará el total a pagar y te contactaremos por WhatsApp para enviarte los datos de cobro.
      </p>

      <section className="mb-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📱</span> Pago por Código QR (Recomendado)
          </h2>
          <p className="text-gray-700 mb-4">
            Es el método más rápido. Paga desde cualquier aplicación bancaria de Bolivia escaneando nuestro QR Simple.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
            <li>Al hacer tu pedido, seleccioná "Pago por QR/Transferencia".</li>
            <li>Te enviaremos el QR por WhatsApp junto con el resumen de tu compra.</li>
            <li>Envianos la captura o el PDF del comprobante al mismo número.</li>
            <li>Aprobamos el pago en el sistema y liberamos tu envío o retiro al instante.</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🏦</span> Transferencia Bancaria Directa
          </h2>
          <p className="text-gray-700 mb-4">
            Si preferís transferir mediante el número de cuenta (CBU), el proceso es igual de sencillo.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
            <li>Solicitanos los datos bancarios al <a href={buildWhatsAppUrl("Hola, necesito los datos para hacer una transferencia")} className="font-semibold text-gray-900 hover:underline">{formatWhatsAppNumber()}</a>.</li>
            <li>Realizá la transferencia desde tu banco.</li>
            <li>Enviá el comprobante para que nuestro administrador verifique el ingreso en nuestra cuenta.</li>
            <li>Una vez confirmado, marcamos tu pedido como "Pagado" en el sistema.</li>
          </ul>
        </div>
      </section>

      <section className="mb-10">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🏪</span> Pago en Tienda Física
          </h2>
          <p className="text-gray-700 mb-4">
            Si elegís la opción de "Retiro en Tienda", podés pagar directamente cuando vengas a recoger tu ropa al Mercado Mutualista.
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <p className="text-gray-700"><strong>Efectivo:</strong> Aceptamos Bolivianos (Bs).</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <p className="text-gray-700"><strong>Tarjetas:</strong> Débito y Crédito (Visa, Mastercard).</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex flex-col md:flex-row gap-6 items-center">
          <div className="text-4xl">⚠️</div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Importante sobre las reservas</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Los pedidos realizados en la web que no registren pago ni envío de comprobante en un plazo de <strong>48 horas</strong>, serán cancelados automáticamente por el sistema y los productos volverán a estar disponibles en el catálogo para otros clientes.
            </p>
          </div>
        </div>
      </section>
    </LegalPageTemplate>
  )
}
