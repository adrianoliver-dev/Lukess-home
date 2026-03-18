import { LegalPageTemplate } from '@/components/legal/LegalPageTemplate'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Políticas de Envío - Lukess Home',
  description: 'Conoce nuestras políticas de envío a domicilio y retiro en tienda en Santa Cruz. Tiempos estimados, costos y zonas de cobertura.',
}

export default function PoliticasEnvioPage() {
  return (
    <LegalPageTemplate title="Políticas de Envío y Retiro" lastUpdated="2 de marzo de 2026">
      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
        En Lukess Home trabajamos para que recibas tu compra de forma rápida y segura. Aquí te explicamos todo sobre nuestras opciones de entrega a domicilio y retiro en tienda.
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Opciones de Entrega</h2>
        <p className="text-gray-700 mb-6">
          Ofrecemos dos modalidades de entrega para que elijas la que más te convenga:
        </p>

        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">🏪</span> Opción 1: Retiro en Tienda (GRATIS)
          </h3>
          <p className="text-gray-700 mb-3">
            Recoge tu pedido en cualquiera de nuestros 3 puestos del Mercado Mutualista sin costo adicional.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Disponible de <strong>lunes a sábado de 8:00 AM a 10:00 PM</strong>, domingos de 9:00 AM a 9:00 PM.</li>
            <li>Tu pedido estará listo en <strong>1 a 3 horas</strong> después de confirmar el pago.</li>
            <li>Recibirás un WhatsApp cuando esté listo para retirar.</li>
            <li>Tienes <strong>48 horas</strong> desde la confirmación para retirarlo. Pasado ese tiempo, el pedido será cancelado.</li>
          </ul>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">🚚</span> Opción 2: Entrega a Domicilio (Santa Cruz)
          </h3>
          <p className="text-gray-700 mb-3">
            Entregamos en toda la ciudad de Santa Cruz de la Sierra dentro de las primeras 24 a 48 horas hábiles.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Costo de envío: <strong>Bs 15 a Bs 30</strong> (según zona y distancia).</li>
            <li>Zonas dentro del 2do y 3er Anillo: <strong>Bs 15</strong>.</li>
            <li>Zonas externas (4to Anillo en adelante, Plan 3000, Warnes, etc.): <strong>Bs 25-30</strong>.</li>
            <li>Entregas de lunes a sábado de 9:00 AM a 7:00 PM.</li>
          </ul>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Tiempos de Entrega Estimados</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg text-sm">
            <thead className="bg-gray-100 text-gray-900">
              <tr>
                <th className="py-3 px-4 text-left border-b">Modalidad</th>
                <th className="py-3 px-4 text-left border-b">Tiempo Estimado</th>
                <th className="py-3 px-4 text-left border-b">Costo</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-200">
              <tr>
                <td className="py-3 px-4 font-semibold">Retiro en Tienda</td>
                <td className="py-3 px-4">1 a 3 horas</td>
                <td className="py-3 px-4 text-green-600 font-bold">Gratis</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Entrega Anillos 2 y 3</td>
                <td className="py-3 px-4">24 horas hábiles</td>
                <td className="py-3 px-4">Bs 15</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Entrega Zonas Externas</td>
                <td className="py-3 px-4">24 a 48 horas hábiles</td>
                <td className="py-3 px-4">Bs 25-30</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Proceso de Entrega a Domicilio</h2>
        <ol className="space-y-4 text-gray-700">
          <li className="flex gap-3">
            <span className="font-bold text-gray-900 text-lg shrink-0">1.</span>
            <div>
              <strong className="text-gray-900">Confirmación de Pago:</strong>
              <p className="mt-1">Una vez que verificamos tu pago (QR o transferencia), procesamos tu pedido de inmediato.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-gray-900 text-lg shrink-0">2.</span>
            <div>
              <strong className="text-gray-900">Preparación del Pedido:</strong>
              <p className="mt-1">Empaquetamos tus productos y coordinamos la entrega con nuestro courier.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-gray-900 text-lg shrink-0">3.</span>
            <div>
              <strong className="text-gray-900">Notificación por WhatsApp:</strong>
              <p className="mt-1">Te enviamos un mensaje confirmando que tu pedido está en camino.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-gray-900 text-lg shrink-0">4.</span>
            <div>
              <strong className="text-gray-900">Entrega en Dirección:</strong>
              <p className="mt-1">El courier llama al número registrado al llegar a tu domicilio. Debes estar disponible para recibir el pedido.</p>
            </div>
          </li>
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. ¿Qué Pasa Si No Estoy en Casa?</h2>
        <p className="text-gray-700 mb-4">
          Si el courier no te encuentra en la dirección indicada, intentará contactarte por teléfono. Si no hay respuesta:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>El pedido regresará a nuestras tiendas físicas.</li>
          <li>Te notificaremos por WhatsApp para coordinar una segunda entrega o retiro en tienda.</li>
          <li>Si optas por una segunda entrega, se cobrará nuevamente el costo de envío.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Verificación del Pedido</h2>
        <p className="text-gray-700">
          <strong>Importante:</strong> Al recibir tu pedido, verifica que el producto y la talla coincidan con lo solicitado antes de que el courier se retire. Si detectas algún error, contáctanos de inmediato al <strong>+591 75516136</strong> para gestionar el cambio.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Zonas Sin Cobertura</h2>
        <p className="text-gray-700">
          Por el momento, solo realizamos entregas dentro del área metropolitana de Santa Cruz de la Sierra. No enviamos a otras ciudades o provincias. Si vives fuera de Santa Cruz, puedes coordinar el envío con una empresa de encomiendas de tu preferencia.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cambios en la Dirección de Entrega</h2>
        <p className="text-gray-700">
          Si necesitas cambiar la dirección de entrega después de confirmar el pedido, contáctanos lo antes posible al WhatsApp <strong>75516136</strong>. Solo podemos modificar la dirección si el pedido no ha sido despachado aún.
        </p>
      </section>
    </LegalPageTemplate>
  )
}
