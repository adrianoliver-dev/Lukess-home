'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Ruler, MessageCircle } from 'lucide-react'
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp'

interface SizeGuideModalProps {
  isOpen: boolean
  onClose: () => void
  category?: string // 'Camisas', 'Pantalones', etc.
}

type TabType = 'camisas' | 'pantalones' | 'cinturones' | 'sombreros' | 'como-medir'

const camisasData = [
  { talla: 'S', pecho: '88-92', cintura: '72-76', hombros: '42-44', largo: '68-70' },
  { talla: 'M', pecho: '92-96', cintura: '76-80', hombros: '44-46', largo: '70-72' },
  { talla: 'L', pecho: '96-100', cintura: '80-84', hombros: '46-48', largo: '72-74' },
  { talla: 'XL', pecho: '100-106', cintura: '84-90', hombros: '48-50', largo: '74-76' },
]

const pantalonesData = [
  { talla: '38', cintura: '76-80', cadera: '88-92', largo: '100-102', entrepierna: '76-78' },
  { talla: '40', cintura: '80-84', cadera: '92-96', largo: '102-104', entrepierna: '78-80' },
  { talla: '42', cintura: '84-88', cadera: '96-100', largo: '104-106', entrepierna: '80-82' },
  { talla: '44', cintura: '88-94', cadera: '100-106', largo: '106-108', entrepierna: '82-84' },
]

const cinturonesData = [
  { talla: 'S (28-30)', cintura: '71-76' },
  { talla: 'M (32-34)', cintura: '81-86' },
  { talla: 'L (36-38)', cintura: '91-96' },
  { talla: 'XL (40-42)', cintura: '101-106' },
]

const sombrerosData = [
  { talla: 'M', cabeza: '57-58' },
  { talla: 'L', cabeza: '59-60' },
]

const gorrasData = [
  { talla: 'Universal', cabeza: 'Ajustable' },
]

export function SizeGuideModal({ isOpen, onClose, category }: SizeGuideModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('camisas')

  // Establecer tab inicial según categoría
  useEffect(() => {
    if (!category) return;
    const cat = category.toLowerCase()
    if (cat.includes('camisa') || cat.includes('polo')) {
      setActiveTab('camisas')
    } else if (cat.includes('pantalon') || cat.includes('jeans') || cat.includes('short')) {
      setActiveTab('pantalones')
    } else if (cat.includes('cinturon')) {
      setActiveTab('cinturones')
    } else if (cat.includes('sombrero') || cat.includes('gorra')) {
      setActiveTab('sombreros')
    }
  }, [category, isOpen])

  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleWhatsAppConsult = () => {
    const message = `Hola! Tengo dudas sobre las tallas.\n\n` +
      `¿Me pueden ayudar a elegir la talla correcta?`

    window.open(buildWhatsAppUrl(message), '_blank')
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <Ruler className="w-5 h-5 text-gray-900" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Guía de Tallas</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex gap-2 px-6 overflow-x-auto hide-scrollbar whitespace-nowrap">
                  <button
                    onClick={() => setActiveTab('camisas')}
                    className={`flex-shrink-0 px-6 py-3 text-sm font-semibold transition-all relative ${activeTab === 'camisas'
                      ? 'text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Prendas Superiores
                    {activeTab === 'camisas' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('pantalones')}
                    className={`flex-shrink-0 px-6 py-3 text-sm font-semibold transition-all relative ${activeTab === 'pantalones'
                      ? 'text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Prendas Inferiores
                    {activeTab === 'pantalones' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('cinturones')}
                    className={`flex-shrink-0 px-6 py-3 text-sm font-semibold transition-all relative ${activeTab === 'cinturones'
                      ? 'text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Cinturones
                    {activeTab === 'cinturones' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('sombreros')}
                    className={`flex-shrink-0 px-6 py-3 text-sm font-semibold transition-all relative ${activeTab === 'sombreros'
                      ? 'text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Sombreros y Gorras
                    {activeTab === 'sombreros' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('como-medir')}
                    className={`flex-shrink-0 px-6 py-3 text-sm font-semibold transition-all relative ${activeTab === 'como-medir'
                      ? 'text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Cómo Medir
                    {activeTab === 'como-medir' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-240px)]">
                <AnimatePresence mode="wait">
                  {activeTab === 'camisas' && (
                    <motion.div
                      key="camisas"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Medidas para Camisas y Polos
                      </h3>
                      <p className="text-sm text-gray-600 mb-6">
                        Todas las medidas están en centímetros (cm). Para obtener la medida correcta,
                        mide sobre una prenda similar que te quede bien.
                      </p>

                      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm font-semibold text-gray-900 mb-1">📏 Cómo usar esta tabla:</p>
                        <p className="text-xs text-gray-600">
                          Mide una prenda tuya que te quede bien acostada sobre una superficie plana,
                          y compárala con estas medidas.
                        </p>
                      </div>

                      {/* Tabla responsive */}
                      <div className="overflow-x-auto w-full">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 border border-gray-200">
                                Talla
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 border border-gray-200">
                                Pecho (cm)
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 border border-gray-200">
                                Cintura (cm)
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 border border-gray-200">
                                Hombros (cm)
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 border border-gray-200">
                                Largo (cm)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {camisasData.map((row, i) => (
                              <tr
                                key={row.talla}
                                className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                              >
                                <td className="px-4 py-3 text-sm font-bold text-gray-900 border border-gray-200">
                                  {row.talla}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">
                                  {row.pecho}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">
                                  {row.cintura}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">
                                  {row.hombros}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">
                                  {row.largo}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-900">
                          <strong>💡 Consejo:</strong> Si estás entre dos tallas, te recomendamos elegir
                          la talla más grande para mayor comodidad.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'pantalones' && (
                    <motion.div
                      key="pantalones"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Medidas para Pantalones
                      </h3>
                      <p className="text-sm text-gray-600 mb-6">
                        Todas las medidas están en centímetros (cm). Mide tu pantalón favorito
                        para comparar con nuestra tabla.
                      </p>

                      {/* Tabla responsive */}
                      <div className="overflow-x-auto w-full">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 border border-gray-200">
                                Talla
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 border border-gray-200">
                                Cintura (cm)
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 border border-gray-200">
                                Cadera (cm)
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 border border-gray-200">
                                Largo (cm)
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 border border-gray-200">
                                Entrepierna (cm)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {pantalonesData.map((row, i) => (
                              <tr
                                key={row.talla}
                                className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                              >
                                <td className="px-4 py-3 text-sm font-bold text-gray-900 border border-gray-200">
                                  {row.talla}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">
                                  {row.cintura}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">
                                  {row.cadera}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">
                                  {row.largo}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">
                                  {row.entrepierna}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-900">
                          <strong>💡 Consejo:</strong> Para un ajuste perfecto, mide la cintura donde
                          normalmente usas el pantalón (no la cintura natural).
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'cinturones' && (
                    <motion.div
                      key="cinturones"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Medidas para Cinturones
                      </h3>
                      <p className="text-sm text-gray-600 mb-6">
                        Para elegir tu talla correcta, puedes usar la medida de pantalón que
                        normalmente usas.
                      </p>
                      <div className="overflow-x-auto w-full">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 border border-gray-200">
                                Talla
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 border border-gray-200">
                                Cintura (cm)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {cinturonesData.map((row, i) => (
                              <tr key={row.talla} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-4 py-3 text-sm font-bold text-gray-900 border border-gray-200">
                                  {row.talla}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">
                                  {row.cintura}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'sombreros' && (
                    <motion.div
                      key="sombreros"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Medidas para Sombreros y Gorras
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Para medir tu cabeza, usa una cinta métrica y colócala alrededor,
                        justo por encima de las orejas y cejas.
                      </p>

                      <h4 className="font-semibold text-gray-900 mt-2 mb-2">Sombreros</h4>
                      <div className="overflow-x-auto w-full mb-6">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 border border-gray-200">
                                Talla
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 border border-gray-200">
                                Circunferencia (cm)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {sombrerosData.map((row, i) => (
                              <tr key={row.talla} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-4 py-3 text-sm font-bold text-gray-900 border border-gray-200">
                                  {row.talla}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">
                                  {row.cabeza}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <h4 className="font-semibold text-gray-900 mt-2 mb-2">Gorras</h4>
                      <div className="overflow-x-auto w-full">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 border border-gray-200">
                                Talla
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 border border-gray-200">
                                Circunferencia
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {gorrasData.map((row, i) => (
                              <tr key={row.talla} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-4 py-3 text-sm font-bold text-gray-900 border border-gray-200">
                                  {row.talla}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">
                                  {row.cabeza}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'como-medir' && (
                    <motion.div
                      key="como-medir"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Cómo Tomar tus Medidas
                      </h3>

                      <div className="space-y-6">
                        {/* Camisas */}
                        <div>
                          <h4 className="text-base font-bold text-gray-900 mb-3">
                            📐 Para Camisas y Polos:
                          </h4>
                          <div className="space-y-3">
                            <div className="flex gap-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-bold text-gray-900">1</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">Pecho</p>
                                <p className="text-sm text-gray-600">
                                  Mide alrededor de la parte más ancha del pecho, pasando la cinta
                                  por debajo de las axilas y sobre los omóplatos.
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-bold text-gray-900">2</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">Cintura</p>
                                <p className="text-sm text-gray-600">
                                  Mide alrededor de la cintura natural, donde normalmente se dobla
                                  el cuerpo hacia los lados.
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-bold text-gray-900">3</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">Hombros</p>
                                <p className="text-sm text-gray-600">
                                  Mide de un extremo del hombro al otro, pasando por la parte
                                  posterior del cuello.
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-bold text-gray-900">4</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">Largo</p>
                                <p className="text-sm text-gray-600">
                                  Mide desde el punto más alto del hombro hasta donde quieres
                                  que llegue la camisa.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Pantalones */}
                        <div className="pt-4 border-t border-gray-200">
                          <h4 className="text-base font-bold text-gray-900 mb-3">
                            📐 Para Pantalones:
                          </h4>
                          <div className="space-y-3">
                            <div className="flex gap-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-bold text-gray-900">1</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">Cintura</p>
                                <p className="text-sm text-gray-600">
                                  Mide alrededor de donde normalmente usas el pantalón,
                                  no la cintura natural.
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-bold text-gray-900">2</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">Cadera</p>
                                <p className="text-sm text-gray-600">
                                  Mide alrededor de la parte más ancha de las caderas y glúteos.
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-bold text-gray-900">3</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">Entrepierna</p>
                                <p className="text-sm text-gray-600">
                                  Mide desde la entrepierna hasta el final del pantalón
                                  (donde quieres que llegue).
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Consejos generales */}
                        <div className="pt-4 border-t border-gray-200">
                          <h4 className="text-base font-bold text-amber-600 mb-3">
                            ⚠️ Consejos Importantes:
                          </h4>
                          <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex gap-2">
                              <span className="text-amber-500">•</span>
                              <span>Usa una cinta métrica flexible (de costura)</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="text-amber-500">•</span>
                              <span>No aprietes demasiado la cinta, debe estar ajustada pero cómoda</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="text-amber-500">•</span>
                              <span>Mide sobre ropa interior o ropa ajustada</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="text-amber-500">•</span>
                              <span>Pide ayuda a alguien para medidas más precisas</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-600 text-center sm:text-left">
                    ¿Aún tienes dudas sobre tu talla?
                  </p>
                  <button
                    onClick={handleWhatsAppConsult}
                    className="inline-flex items-center gap-2 bg-whatsapp hover:bg-whatsapp-dark text-white px-6 py-3 rounded-full text-sm font-semibold transition-all hover:scale-105 shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Consultar por WhatsApp
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
