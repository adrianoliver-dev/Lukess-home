import { LegalPageTemplate } from '@/components/legal/LegalPageTemplate'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Garantía de Autenticidad - Lukess Home | Ropa 100% Original Importada',
    description: 'Lukess Home garantiza la autenticidad de todas sus marcas: Columbia, Nautica, Tommy Hilfiger. Importadores directos en Santa Cruz, Bolivia.',
    keywords: 'ropa original bolivia, columbia original santa cruz, importador directo ropa marca, nautica original bolivia',
}

export default function GarantiaAutenticidadPage() {
    return (
        <LegalPageTemplate title="Garantía de Autenticidad 100% Original" lastUpdated="2 de marzo de 2026">
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                En Lukess Home <strong className="text-gray-900">NO vendemos réplicas ni imitaciones</strong>. Cada prenda que ofrecemos es importada directamente desde distribuidores oficiales de marcas reconocidas a nivel mundial. Tu inversión está protegida con nuestra garantía de autenticidad verificable.
            </p>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">¿Cómo Garantizamos la Originalidad?</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                        <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">📦</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Importación Directa</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            Trabajamos únicamente con proveedores certificados en Estados Unidos y distribuidores oficiales de cada marca. Cada lote que ingresa al país viene con documentación aduanera verificable.
                        </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                        <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">🏷️</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Etiquetas Originales</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            Todas nuestras prendas incluyen etiquetas de cartón originales de la marca, etiquetas internas de lavado con códigos de modelo, composición de materiales y país de fabricación.
                        </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                        <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">🔍</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Control de Calidad</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            Cada artículo pasa por una revisión exhaustiva antes de ser publicado en nuestra tienda. Verificamos costuras, materiales, logotipos y detalles que distinguen una prenda original de una falsificación.
                        </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                        <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">✅</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Comprobante de Compra</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            Cada compra viene acompañada de un ticket o factura con nuestros datos comerciales. Este documento respalda la originalidad del producto y es válido para cualquier reclamo de garantía.
                        </p>
                    </div>
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Marcas que Importamos Directamente</h2>
                <p className="text-gray-700 mb-6">
                    Lukess Home es distribuidor oficial en Santa Cruz de las siguientes marcas premium:
                </p>
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                    <ul className="grid md:grid-cols-2 gap-4 text-gray-700">
                        <li className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-gray-900"></span>
                            <strong className="text-gray-900">Columbia Sportswear:</strong> Outdoor, camisas PFG, chaquetas técnicas.
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-gray-900"></span>
                            <strong className="text-gray-900">Nautica:</strong> Polos, camisas náuticas, pantalones chinos.
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-gray-900"></span>
                            <strong className="text-gray-900">Tommy Hilfiger:</strong> Camisas casual, jeans premium.
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-gray-900"></span>
                            <strong className="text-gray-900">Calvin Klein:</strong> Ropa interior, accesorios, cinturones.
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-gray-900"></span>
                            <strong className="text-gray-900">Levi's:</strong> Jeans clásicos y camisas denim.
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-gray-900"></span>
                            <strong className="text-gray-900">Dockers:</strong> Pantalones de vestir y chinos.
                        </li>
                    </ul>
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">¿Cómo Detectar una Falsificación?</h2>
                <p className="text-gray-700 mb-6">
                    Para protegerte al comprar ropa de marca en otros lugares, te compartimos señales clave de productos falsos:
                </p>
                <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-6 space-y-3 text-sm text-gray-700">
                    <p>❌ <strong>Etiquetas mal impresas:</strong> Logotipos borrosos, faltas ortográficas en la etiqueta de composición.</p>
                    <p>❌ <strong>Materiales de baja calidad:</strong> Telas ásperas, costuras torcidas o hilos sueltos.</p>
                    <p>❌ <strong>Precios extremadamente bajos:</strong> Una camisa Columbia original no puede costar Bs 50. Si el precio es muy bajo, desconfía.</p>
                    <p>❌ <strong>Sin etiquetas originales:</strong> Las réplicas no tienen etiquetas de cartón colgantes ni códigos de modelo reales.</p>
                    <p>❌ <strong>Vendedores sin ubicación física:</strong> Solo venden por redes sociales sin tienda verificable.</p>
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Nuestra Garantía de Satisfacción</h2>
                <p className="text-gray-700 mb-4">
                    Si dentro de los primeros <strong>7 días</strong> de tu compra detectas que un producto no cumple con los estándares de originalidad prometidos (y cumples con las <Link href="/politicas-cambio" className="text-gray-900 font-semibold hover:underline">condiciones de cambio</Link>), nos comprometemos a:
                </p>
                <ul className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                    <li>Reemplazar el artículo por uno nuevo de la misma marca y modelo.</li>
                    <li>Ofrecerte un producto de igual o mayor valor sin costo adicional.</li>
                    <li>Devolver el 100% de tu dinero si no contamos con stock para reemplazo.</li>
                </ul>
            </section>
        </LegalPageTemplate>
    )
}
