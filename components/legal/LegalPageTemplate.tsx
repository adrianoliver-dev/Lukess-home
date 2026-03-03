import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import Container from '@/components/ui/Container'
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp'

interface LegalPageTemplateProps {
  title: string
  lastUpdated: string
  children: React.ReactNode
}

export function LegalPageTemplate({ title, lastUpdated, children }: LegalPageTemplateProps) {
  return (
    <section className="bg-white min-h-screen pt-24 pb-12">
      <Container className="max-w-4xl">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">Inicio</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 font-medium">{title}</span>
        </div>

        {/* Header */}
        <div className="mb-10 pb-6 border-b border-gray-200">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {title}
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-wider">
            Última actualización: {lastUpdated}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-zinc prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-gray-900 prose-a:font-semibold max-w-none mb-16">
          {children}
        </div>

        {/* Estandarized Footer CTA for all Info Pages */}
        <div className="bg-gray-900 text-white rounded-xl p-8 md:p-10 text-center shadow-xl border border-gray-800">
          <h3 className="font-bold text-2xl md:text-3xl mb-4 text-white">
            ¿Tenés alguna duda adicional?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Nuestro equipo en Santa Cruz está disponible todos los días para ayudarte con tallas, stock, envíos o cualquier consulta sobre tu compra.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={buildWhatsAppUrl("Hola, tengo dudas sobre cómo comprar en Lukess Home")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#20bd5a] transition-all shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_25px_rgba(37,211,102,0.5)] transform hover:-translate-y-1"
            >
              <span className="text-2xl">📱</span> Hablar por WhatsApp
            </a>
            <Link
              href="/#ubicacion"
              className="w-full sm:w-auto inline-flex justify-center items-center bg-gray-800 text-white border border-gray-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-700 transition-colors"
            >
              📍 Ver Tiendas
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
