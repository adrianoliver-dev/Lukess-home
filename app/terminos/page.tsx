import { LegalPageTemplate } from '@/components/legal/LegalPageTemplate'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Términos y Condiciones - Lukess Home',
  description: 'Consulta los términos y condiciones de compra en Lukess Home. Información sobre garantías, devoluciones y políticas comerciales en Santa Cruz, Bolivia.',
}

export default function TerminosPage() {
  return (
    <LegalPageTemplate title="Términos y Condiciones de Uso" lastUpdated="2 de marzo de 2026">
      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
        Bienvenido a Lukess Home. Al acceder a nuestro sitio web, realizar compras en línea o visitar nuestras tiendas físicas en el Mercado Mutualista, aceptas los siguientes términos y condiciones. Te recomendamos leerlos detenidamente antes de continuar.
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Información General</h2>
        <p className="text-gray-700 mb-4">
          <strong>Razón Social:</strong> Lukess Home<br />
          <strong>Domicilio Comercial:</strong> Mercado Mutualista, Santa Cruz de la Sierra, Bolivia<br />
          <strong>Contacto:</strong> +591 75516136 (WhatsApp)
        </p>
        <p className="text-gray-700">
          Lukess Home es un negocio especializado en la venta de ropa masculina de marcas importadas reconocidas (Columbia, Nautica, Tommy Hilfiger, entre otras). Operamos a través de tres canales: tiendas físicas, catálogo en línea y pedidos por WhatsApp.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Aceptación de los Términos</h2>
        <p className="text-gray-700">
          Al navegar en nuestro sitio web, agregar productos al carrito, realizar un pedido o visitar nuestras tiendas físicas, confirmas que has leído, entendido y aceptado estos términos. Si no estás de acuerdo con alguna de estas condiciones, te pedimos que no utilices nuestros servicios.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Uso del Sitio Web</h2>
        <p className="text-gray-700 mb-4">
          El sitio web lukess-home.vercel.app es un catálogo informativo donde puedes:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>Explorar productos disponibles con fotos, descripciones y precios actualizados.</li>
          <li>Agregar productos al carrito y generar un pedido de compra.</li>
          <li>Consultar políticas de envío, cambios, devoluciones y métodos de pago.</li>
        </ul>
        <p className="text-gray-700 mt-4">
          <strong>Importante:</strong> El sitio no procesa pagos automáticos. Todo pedido generado debe ser confirmado y pagado siguiendo las instrucciones enviadas por WhatsApp.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Proceso de Compra</h2>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">4.1. Catálogo Web</h3>
        <p className="text-gray-700 mb-4">
          Los productos publicados en el sitio están sujetos a disponibilidad de stock en tiempo real. Una vez que completes tu pedido, recibirás confirmación por WhatsApp con el total a pagar y los datos de pago (QR o transferencia bancaria).
        </p>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">4.2. Pedidos por WhatsApp</h3>
        <p className="text-gray-700 mb-4">
          Puedes realizar compras directamente contactándonos al +591 75516136. Nuestro equipo verificará disponibilidad, confirmará precio y coordinará entrega o retiro en tienda.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">4.3. Compra en Tienda Física</h3>
        <p className="text-gray-700">
          Visita cualquiera de nuestros 3 puestos en el Mercado Mutualista. Puedes probarte la ropa, recibir asesoría personalizada y pagar en efectivo o con tarjeta de débito/crédito.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Precios y Métodos de Pago</h2>
        <p className="text-gray-700 mb-4">
          Todos los precios están expresados en <strong>Bolivianos (Bs)</strong> e incluyen IVA cuando corresponde. Los precios publicados pueden cambiar sin previo aviso debido a fluctuaciones del tipo de cambio o ajustes de proveedores.
        </p>
        <p className="text-gray-700">
          Aceptamos los siguientes métodos de pago:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-3">
          <li><strong>QR Simple:</strong> Pago instantáneo desde cualquier app bancaria de Bolivia.</li>
          <li><strong>Transferencia Bancaria:</strong> Solicitá los datos al WhatsApp 75516136.</li>
          <li><strong>Efectivo o Tarjeta en Tienda:</strong> Disponible solo para retiro en el Mercado Mutualista.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Reservas de Producto</h2>
        <p className="text-gray-700">
          Los pedidos generados desde el catálogo web tienen una validez de <strong>48 horas</strong>. Si en ese plazo no recibimos el comprobante de pago ni confirmación, el pedido será cancelado automáticamente y los productos volverán al inventario disponible.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cambios y Devoluciones</h2>
        <p className="text-gray-700 mb-4">
          Lukess Home garantiza la autenticidad y calidad de todos sus productos. Si el artículo presenta defectos de fábrica o no corresponde con lo solicitado, aceptamos cambios dentro de los primeros <strong>7 días</strong> posteriores a la compra.
        </p>
        <p className="text-gray-700">
          Para más detalles, consulta nuestra <Link href="/politicas-cambio" className="text-gray-900 font-semibold hover:underline">Política de Cambios y Devoluciones</Link>.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Propiedad Intelectual</h2>
        <p className="text-gray-700">
          Todo el contenido del sitio web (textos, imágenes, logotipos, diseño) es propiedad de Lukess Home o de sus respectivos proveedores. Queda prohibida la reproducción total o parcial sin autorización expresa.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitación de Responsabilidad</h2>
        <p className="text-gray-700">
          Lukess Home no se hace responsable por:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-3">
          <li>Fallas en la conexión a Internet del usuario.</li>
          <li>Errores tipográficos menores en descripciones de productos (siempre confirmamos detalles antes del pago).</li>
          <li>Retrasos en entregas causados por terceros (couriers, condiciones climáticas).</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Modificaciones a los Términos</h2>
        <p className="text-gray-700">
          Lukess Home se reserva el derecho de modificar estos términos y condiciones en cualquier momento. Los cambios entrarán en vigencia desde su publicación en el sitio web. Te recomendamos revisar esta página periódicamente.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Ley Aplicable y Jurisdicción</h2>
        <p className="text-gray-700">
          Estos términos se rigen por las leyes de Bolivia. Cualquier disputa será resuelta en los tribunales competentes de Santa Cruz de la Sierra.
        </p>
      </section>
    </LegalPageTemplate>
  )
}
