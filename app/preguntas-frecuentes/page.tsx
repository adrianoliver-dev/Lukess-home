import { LegalPageTemplate } from '@/components/legal/LegalPageTemplate'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes (FAQ) - Lukess Home',
  description: 'Resolvemos todas tus dudas sobre compras, envíos, tallas, pagos y garantías en Lukess Home. Encuentra respuestas rápidas aquí.',
}

export default function PreguntasFrecuentesPage() {
  return (
    <LegalPageTemplate title="Preguntas Frecuentes (FAQ)" lastUpdated="2 de marzo de 2026">
      <p className="text-lg text-gray-600 mb-10 leading-relaxed">
        Aquí encontrarás respuestas a las consultas más comunes de nuestros clientes. Si no encuentras lo que buscas, no dudes en <a href="/#ubicacion" className="text-gray-900 font-semibold hover:underline">contactarnos por WhatsApp</a>.
      </p>

      {/* Compras y Pagos */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">💳 Compras y Pagos</h2>

        <div className="space-y-6">
          <FAQItem
            question="¿Cómo puedo comprar en Lukess Home?"
            answer="Tenés 3 opciones: (1) Navegar el catálogo web, agregar productos al carrito y hacer tu pedido online. (2) Escribirnos directo por WhatsApp al 75516136. (3) Visitar nuestras tiendas físicas en el Mercado Mutualista."
          />

          <FAQItem
            question="¿Qué métodos de pago aceptan?"
            answer="Aceptamos QR Simple (desde cualquier app bancaria), Transferencia Bancaria (pedí los datos por WhatsApp), y Efectivo o Tarjeta de Crédito/Débito en nuestras tiendas físicas."
          />

          <FAQItem
            question="¿Puedo pagar contra entrega?"
            answer="No, por el momento no ofrecemos pago contra entrega. Debes confirmar el pago antes de que tu pedido sea despachado para garantizar la reserva del producto."
          />

          <FAQItem
            question="¿Los precios están en dólares o bolivianos?"
            answer="Todos nuestros precios están expresados en Bolivianos (Bs) e incluyen IVA cuando corresponde."
          />
        </div>
      </section>

      {/* Envíos y Entregas */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">🚚 Envíos y Entregas</h2>

        <div className="space-y-6">
          <FAQItem
            question="¿Hacen envíos a domicilio?"
            answer="Sí, realizamos entregas en toda Santa Cruz de la Sierra. El costo de envío varía entre Bs 15 y Bs 30 según la zona. Los tiempos de entrega son de 24 a 48 horas hábiles."
          />

          <FAQItem
            question="¿Puedo retirar mi pedido en tienda?"
            answer="¡Sí! El retiro en tienda es GRATIS y tu pedido estará listo en 1 a 3 horas después de confirmar el pago. Tenés 48 horas para retirarlo."
          />

          <FAQItem
            question="¿Envían fuera de Santa Cruz?"
            answer="Por el momento solo realizamos entregas dentro del área metropolitana de Santa Cruz. Si vivís en otra ciudad, podés coordinar el envío con una empresa de encomiendas de tu preferencia."
          />

          <FAQItem
            question="¿Qué pasa si no estoy en casa al momento de la entrega?"
            answer="El courier intentará contactarte por teléfono. Si no hay respuesta, el pedido regresará a nuestras tiendas y te notificaremos para coordinar una segunda entrega (se cobrará nuevamente el costo de envío) o retiro en tienda."
          />
        </div>
      </section>

      {/* Tallas y Productos */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">👕 Tallas y Productos</h2>

        <div className="space-y-6">
          <FAQItem
            question="¿Cómo sé qué talla elegir?"
            answer={`Tenemos una <a href="/guia-tallas" class="text-gray-900 font-semibold hover:underline">Guía de Tallas completa</a> con tablas de medidas para camisas, pantalones, shorts, cinturones y gorras. Regla general: las marcas americanas tallan 1 talla más grande que las locales (si usas L boliviano, probá M en Columbia).`}
          />

          <FAQItem
            question="¿Puedo probarme la ropa antes de comprar?"
            answer="¡Por supuesto! Si venís a nuestras tiendas en el Mercado Mutualista, contamos con probadores para que te pruebes todo lo que quieras sin compromiso."
          />

          <FAQItem
            question="¿Los productos son originales o réplicas?"
            answer={`Todas nuestras prendas son 100% originales importadas directamente desde distribuidores oficiales. Consultá nuestra <a href="/garantia-autenticidad" class="text-gray-900 font-semibold hover:underline">Garantía de Autenticidad</a> para más detalles.`}
          />

          <FAQItem
            question="¿Tienen stock de todos los productos del catálogo?"
            answer="El catálogo web se actualiza en tiempo real con el inventario de nuestras 3 tiendas. Si un producto aparece disponible en la web, significa que hay stock físico en ese momento."
          />
        </div>
      </section>

      {/* Cambios y Devoluciones */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">🔄 Cambios y Devoluciones</h2>

        <div className="space-y-6">
          <FAQItem
            question="¿Puedo cambiar un producto si no me quedó bien?"
            answer={`Sí, tenés 7 días para cambiar productos por talla o color. La prenda debe estar en perfecto estado, sin uso, con todas sus etiquetas originales. Consultá nuestra <a href="/politicas-cambio" class="text-gray-900 font-semibold hover:underline">Política de Cambios</a> completa.`}
          />

          <FAQItem
            question="¿Hacen devoluciones de dinero?"
            answer="No realizamos devoluciones de dinero por arrepentimiento de compra. Solo emitimos reembolsos si el producto presenta una falla de fábrica insalvable y no hay stock para reemplazarlo."
          />

          <FAQItem
            question="¿Puedo cambiar ropa interior o calcetines?"
            answer="No, por razones de salud e higiene, la ropa interior, calcetines y medias NO tienen cambio bajo ninguna circunstancia."
          />
        </div>
      </section>

      {/* Ubicación y Horarios */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">📍 Ubicación y Horarios</h2>

        <div className="space-y-6">
          <FAQItem
            question="¿Dónde están ubicadas sus tiendas?"
            answer="Estamos en el Mercado Mutualista, Santa Cruz de la Sierra. Tenemos 3 puestos: Caseta 47-48 (Pasillo 2), Caseta 123 (Pasillo 3) y Caseta 228-229 (Pasillo 5). Podés ver la ubicación exacta en Google Maps desde nuestra página de inicio."
          />

          <FAQItem
            question="¿Cuáles son los horarios de atención?"
            answer="Lunes a Sábado: 8:00 AM - 10:00 PM. Domingos y feriados: 9:00 AM - 9:00 PM. Estamos abiertos todos los días del año."
          />

          <FAQItem
            question="¿Hay parqueo disponible?"
            answer="Sí, el Mercado Mutualista cuenta con amplio parqueo disponible para clientes."
          />
        </div>
      </section>

      {/* Seguridad y Privacidad */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">🔒 Seguridad y Privacidad</h2>

        <div className="space-y-6">
          <FAQItem
            question="¿Es seguro comprar en el sitio web?"
            answer={`Sí, nuestro sitio usa cifrado SSL/TLS en todas las comunicaciones. No procesamos pagos automáticos en la web, por lo que no almacenamos datos de tarjetas. Consultá nuestra <a href="/privacidad" class="text-gray-900 font-semibold hover:underline">Política de Privacidad</a>.`}
          />

          <FAQItem
            question="¿Qué hacen con mis datos personales?"
            answer="Usamos tus datos únicamente para procesar pedidos, coordinar entregas y enviarte confirmaciones por email/WhatsApp. No vendemos ni compartimos tu información con terceros."
          />
        </div>
      </section>
    </LegalPageTemplate>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white border-l-4 border-gray-900 rounded-r-lg p-5 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-base font-bold text-gray-900 mb-2">{question}</h3>
      <p
        className="text-sm text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: answer }}
      />
    </div>
  )
}
