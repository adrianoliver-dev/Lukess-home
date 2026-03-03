import { LegalPageTemplate } from '@/components/legal/LegalPageTemplate'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidad - Lukess Home',
  description: 'Conoce cómo protegemos tus datos personales en Lukess Home. Información transparente sobre recopilación, uso y seguridad de tu información.',
}

export default function PrivacidadPage() {
  return (
    <LegalPageTemplate title="Política de Privacidad y Protección de Datos" lastUpdated="2 de marzo de 2026">
      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
        En Lukess Home respetamos tu privacidad y nos comprometemos a proteger tus datos personales. Esta política explica qué información recopilamos, cómo la utilizamos y qué derechos tienes sobre ella.
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Responsable del Tratamiento de Datos</h2>
        <p className="text-gray-700 mb-4">
          <strong>Razón Social:</strong> Lukess Home<br />
          <strong>Domicilio:</strong> Mercado Mutualista, Santa Cruz de la Sierra, Bolivia<br />
          <strong>Contacto:</strong> +591 72643753 (WhatsApp)
        </p>
        <p className="text-gray-700">
          Somos responsables del tratamiento seguro y confidencial de toda la información personal que nos proporcionas al usar nuestros servicios.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. ¿Qué Información Recopilamos?</h2>
        <p className="text-gray-700 mb-4">
          Recopilamos únicamente la información necesaria para procesar tus pedidos y brindarte una mejor experiencia de compra:
        </p>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">2.1. Información que Proporcionas Directamente</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
          <li><strong>Datos de Contacto:</strong> Nombre completo, correo electrónico, número de teléfono.</li>
          <li><strong>Datos de Envío:</strong> Dirección completa, referencias, coordenadas de Google Maps (opcional).</li>
          <li><strong>Datos de Compra:</strong> Productos seleccionados, tallas, preferencias, historial de pedidos.</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">2.2. Información Recopilada Automáticamente</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li><strong>Datos de Navegación:</strong> Dirección IP, tipo de navegador, dispositivo, páginas visitadas.</li>
          <li><strong>Cookies:</strong> Utilizamos cookies técnicas para mejorar la funcionalidad del sitio (carrito de compras, preferencias de sesión).</li>
          <li><strong>Google Analytics:</strong> Recopilamos estadísticas anónimas de tráfico para optimizar la experiencia del usuario.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. ¿Cómo Utilizamos tu Información?</h2>
        <p className="text-gray-700 mb-4">
          Usamos tus datos personales exclusivamente para los siguientes fines:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>Procesar y confirmar tus pedidos (web, WhatsApp o tienda física).</li>
          <li>Coordinar entregas a domicilio o retiros en tienda.</li>
          <li>Enviarte confirmaciones de pedido, actualizaciones de estado y comprobantes por correo electrónico.</li>
          <li>Gestionar cambios, devoluciones o reclamos relacionados con tu compra.</li>
          <li>Enviarte comunicaciones promocionales (solo si autorizaste recibirlas).</li>
          <li>Mejorar nuestro catálogo y servicios mediante análisis de preferencias de compra.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. ¿Con Quién Compartimos tu Información?</h2>
        <p className="text-gray-700 mb-4">
          <strong>No vendemos ni alquilamos tus datos personales a terceros.</strong> Solo compartimos información estrictamente necesaria con los siguientes proveedores:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li><strong>Servicios de Hosting:</strong> Vercel (almacenamiento del sitio web).</li>
          <li><strong>Base de Datos:</strong> Supabase (almacenamiento seguro de pedidos y usuarios).</li>
          <li><strong>Google Analytics:</strong> Análisis estadístico de tráfico (datos anonimizados).</li>
          <li><strong>WhatsApp Business:</strong> Comunicación directa para confirmación de pedidos y soporte.</li>
          <li><strong>Servicios de Email:</strong> Resend (envío de confirmaciones de compra y notificaciones transaccionales).</li>
        </ul>
        <p className="text-gray-700 mt-4">
          Todos estos proveedores cumplen con estándares internacionales de seguridad y confidencialidad.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Seguridad de tus Datos</h2>
        <p className="text-gray-700">
          Implementamos medidas técnicas y organizativas para proteger tu información contra accesos no autorizados, pérdida o alteración. Entre ellas:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-3">
          <li>Cifrado SSL/TLS en todas las comunicaciones del sitio web.</li>
          <li>Autenticación segura mediante Google OAuth (login sin contraseñas vulnerables).</li>
          <li>Acceso restringido a bases de datos mediante políticas RLS (Row Level Security) en Supabase.</li>
          <li>Auditorías periódicas de seguridad del sistema.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Tus Derechos sobre tus Datos</h2>
        <p className="text-gray-700 mb-4">
          Como usuario, tienes los siguientes derechos respecto a tu información personal:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li><strong>Acceso:</strong> Solicitar una copia de los datos que tenemos sobre ti.</li>
          <li><strong>Rectificación:</strong> Corregir información inexacta o incompleta.</li>
          <li><strong>Eliminación:</strong> Solicitar la eliminación de tus datos (excepto si debemos conservarlos por obligaciones legales).</li>
          <li><strong>Oposición:</strong> Dejar de recibir comunicaciones promocionales en cualquier momento.</li>
          <li><strong>Portabilidad:</strong> Recibir tus datos en formato estructurado para transferirlos a otro servicio.</li>
        </ul>
        <p className="text-gray-700 mt-4">
          Para ejercer cualquiera de estos derechos, contáctanos al <strong>+591 72643753</strong> (WhatsApp) o envía un correo a través de nuestro formulario de contacto.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Uso de Cookies</h2>
        <p className="text-gray-700 mb-4">
          Utilizamos cookies técnicas y analíticas para mejorar tu experiencia en el sitio:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li><strong>Cookies Esenciales:</strong> Necesarias para el funcionamiento del carrito y la sesión de usuario.</li>
          <li><strong>Cookies de Análisis:</strong> Google Analytics para entender cómo los usuarios navegan por el sitio.</li>
        </ul>
        <p className="text-gray-700 mt-4">
          Puedes desactivar las cookies desde la configuración de tu navegador, pero esto puede afectar algunas funcionalidades del sitio.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Retención de Datos</h2>
        <p className="text-gray-700">
          Conservamos tu información personal durante el tiempo necesario para cumplir con los fines descritos en esta política. Los datos de pedidos se mantienen por <strong>2 años</strong> para fines contables y de garantía. Pasado ese plazo, los eliminamos de forma segura.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Menores de Edad</h2>
        <p className="text-gray-700">
          Nuestros servicios están dirigidos a personas mayores de 18 años. No recopilamos intencionalmente información de menores sin el consentimiento de sus padres o tutores legales.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Cambios a esta Política</h2>
        <p className="text-gray-700">
          Lukess Home se reserva el derecho de actualizar esta política de privacidad en cualquier momento. Los cambios serán publicados en esta página con la fecha de última actualización. Te recomendamos revisarla periódicamente.
        </p>
      </section>
    </LegalPageTemplate>
  )
}
