import { LegalPageTemplate } from '@/components/legal/LegalPageTemplate'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guía de Tallas para Ropa de Marca Americana - Lukess Home',
  description: 'Descubre cómo elegir tu talla perfecta en ropa importada como Columbia y Nautica en Bolivia. Tablas de medidas exactas para camisas, pantalones y blazers.',
  keywords: 'guia tallas columbia, tallas nautica, ropa americana bolivia, equivalencia tallas pantalones W L, medidas camisas hombre',
}

export default function GuiaTallasPage() {
  return (
    <LegalPageTemplate title="Guía de Tallas y Ajustes" lastUpdated="2 de marzo de 2026">
      <div className="prose prose-zinc max-w-none">
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          Sabemos que comprar ropa importada por internet genera dudas sobre el calce. Las marcas americanas como <strong>Columbia</strong>, <strong>Nautica</strong> y <strong>Tommy Hilfiger</strong> tienen estándares de costura diferentes a la ropa de confección nacional. Esta guía técnica está diseñada para que elijas tu talla exacta sin temor a equivocarte.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 border-b pb-2">1. Camisas y Poleras (Prendas Superiores)</h2>
        <p className="text-gray-700 mb-4">
          La principal diferencia de marcas como Columbia es su corte <strong>"Relaxed Fit"</strong>. Están diseñadas para la comodidad al aire libre, por lo que son más holgadas en el pecho y los hombros.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6">
          <p className="font-bold text-gray-900 mb-2">💡 La Regla de Oro en Bolivia:</p>
          <p className="text-gray-700">Si en marcas bolivianas o brasileras usas habitualmente talla <strong>L</strong>, en Columbia o Nautica tu talla ideal será la <strong>M</strong>. Siempre calcula una talla menos a tu estándar habitual.</p>
        </div>

        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg text-sm text-left">
            <thead className="bg-gray-100 text-gray-900">
              <tr>
                <th className="py-3 px-4 border-b">Talla Americana</th>
                <th className="py-3 px-4 border-b">Contorno Pecho (cm)</th>
                <th className="py-3 px-4 border-b">Largo Manga (cm)</th>
                <th className="py-3 px-4 border-b">Equivalencia Local</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-200">
              <tr>
                <td className="py-3 px-4 font-bold">S (Small)</td>
                <td className="py-3 px-4">89 - 97</td>
                <td className="py-3 px-4">84</td>
                <td className="py-3 px-4">M Nacional</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">M (Medium)</td>
                <td className="py-3 px-4">97 - 104</td>
                <td className="py-3 px-4">86</td>
                <td className="py-3 px-4">L Nacional</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">L (Large)</td>
                <td className="py-3 px-4">107 - 114</td>
                <td className="py-3 px-4">89</td>
                <td className="py-3 px-4">XL Nacional</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">XL (X-Large)</td>
                <td className="py-3 px-4">117 - 124</td>
                <td className="py-3 px-4">91</td>
                <td className="py-3 px-4">XXL Nacional</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4 border-b pb-2">2. Pantalones, Jeans y Chinos</h2>
        <p className="text-gray-700 mb-4">
          La ropa americana profesional no usa tallas genéricas (40, 42). Utiliza el sistema alfanumérico basado en pulgadas: <strong>W (Waist/Cintura)</strong> y <strong>L (Length/Largo)</strong>.
        </p>

        <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Entendiendo la Cintura (W)</h3>
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg text-sm text-left">
            <thead className="bg-gray-100 text-gray-900">
              <tr>
                <th className="py-3 px-4 border-b">Talla W (Pulgadas)</th>
                <th className="py-3 px-4 border-b">Cintura en cm</th>
                <th className="py-3 px-4 border-b">Talla referencial en pantalón de vestir</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-200">
              <tr><td className="py-3 px-4 font-bold">W30</td><td className="py-3 px-4">76 cm</td><td className="py-3 px-4">Talla 38</td></tr>
              <tr><td className="py-3 px-4 font-bold">W32</td><td className="py-3 px-4">81 cm</td><td className="py-3 px-4">Talla 40</td></tr>
              <tr><td className="py-3 px-4 font-bold">W34</td><td className="py-3 px-4">86 cm</td><td className="py-3 px-4">Talla 42</td></tr>
              <tr><td className="py-3 px-4 font-bold">W36</td><td className="py-3 px-4">91 cm</td><td className="py-3 px-4">Talla 44</td></tr>
              <tr><td className="py-3 px-4 font-bold">W38</td><td className="py-3 px-4">96 cm</td><td className="py-3 px-4">Talla 46</td></tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Entendiendo el Largo (L)</h3>
        <p className="text-gray-700 mb-4">El largo se mide desde la costura de la entrepierna hasta el dobladillo final del pie.</p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-8">
          <li><strong>L30 (Largo 30):</strong> Ideal para estaturas entre 1.60m y 1.74m. (El largo más buscado en Bolivia).</li>
          <li><strong>L32 (Largo 32):</strong> Ideal para estaturas entre 1.75m y 1.82m.</li>
          <li><strong>L34 (Largo 34):</strong> Para hombres altos de 1.83m en adelante.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4 border-b pb-2">3. Blazers y Sacos</h2>
        <p className="text-gray-700 mb-4">
          Los blazers se miden por el ancho del pecho (en pulgadas) seguido de una letra que indica el largo del torso y las mangas: <strong>S (Short)</strong>, <strong>R (Regular)</strong> o <strong>L (Long)</strong>.
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-8">
          <li><strong>Talla 38R:</strong> Para un pecho de ~96cm y estatura promedio. Equivale a una S/M ajustada.</li>
          <li><strong>Talla 40R:</strong> Para un pecho de ~101cm. Equivale a una M.</li>
          <li><strong>Talla 42R:</strong> Para un pecho de ~106cm. Equivale a una L.</li>
          <li><strong>Talla 44R:</strong> Para un pecho de ~111cm. Equivale a una XL.</li>
        </ul>
        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4 border-b pb-2">4. Shorts</h2>
        <p className="text-gray-700 mb-4">
          Los shorts deportivos o casuales siguen el mismo sistema de cintura (W) que los pantalones, pero sin el parámetro de largo (L).
        </p>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg text-sm text-left">
            <thead className="bg-gray-100 text-gray-900">
              <tr>
                <th className="py-3 px-4 border-b">Talla W</th>
                <th className="py-3 px-4 border-b">Cintura (cm)</th>
                <th className="py-3 px-4 border-b">Largo aproximado (cm)</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-200">
              <tr><td className="py-3 px-4 font-bold">W30</td><td className="py-3 px-4">76-80</td><td className="py-3 px-4">48-50</td></tr>
              <tr><td className="py-3 px-4 font-bold">W32</td><td className="py-3 px-4">80-84</td><td className="py-3 px-4">50-52</td></tr>
              <tr><td className="py-3 px-4 font-bold">W34</td><td className="py-3 px-4">84-88</td><td className="py-3 px-4">52-54</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4 border-b pb-2">5. Cinturones</h2>
        <p className="text-gray-700 mb-4">
          Los cinturones de cuero se miden desde la hebilla hasta el agujero central. La talla del cinturón debe ser aproximadamente 2 pulgadas más que tu talla de pantalón.
        </p>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg text-sm text-left">
            <thead className="bg-gray-100 text-gray-900">
              <tr>
                <th className="py-3 px-4 border-b">Talla Cinturón</th>
                <th className="py-3 px-4 border-b">Largo Total (cm)</th>
                <th className="py-3 px-4 border-b">Para tallas de pantalón</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-200">
              <tr><td className="py-3 px-4 font-bold">32</td><td className="py-3 px-4">85-90</td><td className="py-3 px-4">W28-W30</td></tr>
              <tr><td className="py-3 px-4 font-bold">34</td><td className="py-3 px-4">90-95</td><td className="py-3 px-4">W30-W32</td></tr>
              <tr><td className="py-3 px-4 font-bold">36</td><td className="py-3 px-4">95-100</td><td className="py-3 px-4">W32-W34</td></tr>
              <tr><td className="py-3 px-4 font-bold">38</td><td className="py-3 px-4">100-105</td><td className="py-3 px-4">W34-W36</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4 border-b pb-2">6. Gorras, Sombreros y Viseras</h2>
        <p className="text-gray-700 mb-4">
          La mayoría de nuestras gorras deportivas Columbia y sombreros tipo bucket tienen ajuste trasero o son de talla única adaptable.
        </p>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg text-sm text-left">
            <thead className="bg-gray-100 text-gray-900">
              <tr>
                <th className="py-3 px-4 border-b">Talla</th>
                <th className="py-3 px-4 border-b">Circunferencia Cabeza (cm)</th>
                <th className="py-3 px-4 border-b">Descripción</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-200">
              <tr><td className="py-3 px-4 font-bold">S/M</td><td className="py-3 px-4">54-57</td><td className="py-3 px-4">Ajustable con cierre trasero</td></tr>
              <tr><td className="py-3 px-4 font-bold">L/XL</td><td className="py-3 px-4">58-61</td><td className="py-3 px-4">Ajustable con cierre trasero</td></tr>
              <tr><td className="py-3 px-4 font-bold">Unitalla</td><td className="py-3 px-4">55-60</td><td className="py-3 px-4">Ajuste universal (elástico interno)</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-gray-700 mb-8">
          <strong>Cómo medir tu cabeza:</strong> Usa una cinta métrica alrededor de tu cabeza, pasando por encima de las orejas y en la parte más ancha de la frente.
        </p>
      </div>
    </LegalPageTemplate>
  )
}
