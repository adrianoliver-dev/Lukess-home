'use client'
import { useState } from 'react'
import { X, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface SizeGuideProps {
  isOpen: boolean
  onClose: () => void
  category?: 'superior' | 'inferior' | 'cinturones' | 'gorras' | 'shorts'
}

export function SizeGuideModal({ isOpen, onClose, category = 'superior' }: SizeGuideProps) {
  const [activeTab, setActiveTab] = useState<string>(category)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">Guía de Tallas</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 pb-2 flex gap-2 overflow-x-auto border-b border-gray-200">
          <TabButton active={activeTab === 'superior'} onClick={() => setActiveTab('superior')}>
            Prendas Superiores
          </TabButton>
          <TabButton active={activeTab === 'inferior'} onClick={() => setActiveTab('inferior')}>
            Pantalones
          </TabButton>
          <TabButton active={activeTab === 'shorts'} onClick={() => setActiveTab('shorts')}>
            Shorts
          </TabButton>
          <TabButton active={activeTab === 'cinturones'} onClick={() => setActiveTab('cinturones')}>
            Cinturones
          </TabButton>
          <TabButton active={activeTab === 'gorras'} onClick={() => setActiveTab('gorras')}>
            Gorras
          </TabButton>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'superior' && <SuperiorContent />}
          {activeTab === 'inferior' && <InferiorContent />}
          {activeTab === 'shorts' && <ShortsContent />}
          {activeTab === 'cinturones' && <CinturonesContent />}
          {activeTab === 'gorras' && <GorrasContent />}

          {/* Link a guía completa */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <Link
              href="/guia-tallas"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 hover:underline"
              onClick={onClose}
            >
              <ExternalLink className="w-4 h-4" />
              Ver guía completa con más detalles
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-semibold rounded-t transition-colors whitespace-nowrap ${active
          ? 'bg-gray-900 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
    >
      {children}
    </button>
  )
}

function SuperiorContent() {
  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        Medidas para camisas, polos y blazers. Todas las medidas en centímetros.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 text-left border">Talla</th>
              <th className="py-2 px-3 text-left border">Pecho (cm)</th>
              <th className="py-2 px-3 text-left border">Hombros (cm)</th>
              <th className="py-2 px-3 text-left border">Largo (cm)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="py-2 px-3 border font-bold">S</td><td className="py-2 px-3 border">89-97</td><td className="py-2 px-3 border">42-44</td><td className="py-2 px-3 border">70-72</td></tr>
            <tr><td className="py-2 px-3 border font-bold">M</td><td className="py-2 px-3 border">97-104</td><td className="py-2 px-3 border">44-47</td><td className="py-2 px-3 border">72-74</td></tr>
            <tr><td className="py-2 px-3 border font-bold">L</td><td className="py-2 px-3 border">107-114</td><td className="py-2 px-3 border">47-50</td><td className="py-2 px-3 border">74-76</td></tr>
            <tr><td className="py-2 px-3 border font-bold">XL</td><td className="py-2 px-3 border">117-124</td><td className="py-2 px-3 border">50-53</td><td className="py-2 px-3 border">76-78</td></tr>
          </tbody>
        </table>
      </div>
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
        <strong>💡 Tip:</strong> Las marcas americanas como Columbia tallan 1 talla más grande. Si usas L nacional, probá M.
      </div>
    </div>
  )
}

function InferiorContent() {
  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        Medidas para pantalones y jeans. Sistema americano W (cintura) / L (largo).
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 text-left border">Talla</th>
              <th className="py-2 px-3 text-left border">Cintura (cm)</th>
              <th className="py-2 px-3 border">Cadera (cm)</th>
              <th className="py-2 px-3 border">Largo recomendado</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="py-2 px-3 border font-bold">W30</td><td className="py-2 px-3 border">76-80</td><td className="py-2 px-3 border">88-92</td><td className="py-2 px-3 border">L30 o L32</td></tr>
            <tr><td className="py-2 px-3 border font-bold">W32</td><td className="py-2 px-3 border">80-84</td><td className="py-2 px-3 border">92-96</td><td className="py-2 px-3 border">L30 o L32</td></tr>
            <tr><td className="py-2 px-3 border font-bold">W34</td><td className="py-2 px-3 border">84-88</td><td className="py-2 px-3 border">96-100</td><td className="py-2 px-3 border">L32</td></tr>
            <tr><td className="py-2 px-3 border font-bold">W36</td><td className="py-2 px-3 border">88-94</td><td className="py-2 px-3 border">100-106</td><td className="py-2 px-3 border">L32 o L34</td></tr>
          </tbody>
        </table>
      </div>
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
        <strong>💡 Tip:</strong> L30 es perfecto para estaturas de 1.60m a 1.74m. L32 para 1.75m en adelante.
      </div>
    </div>
  )
}

function ShortsContent() {
  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        Los shorts usan el mismo sistema de cintura (W) que los pantalones.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 text-left border">Talla</th>
              <th className="py-2 px-3 text-left border">Cintura (cm)</th>
              <th className="py-2 px-3 border">Largo aprox. (cm)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="py-2 px-3 border font-bold">W30</td><td className="py-2 px-3 border">76-80</td><td className="py-2 px-3 border">48-50</td></tr>
            <tr><td className="py-2 px-3 border font-bold">W32</td><td className="py-2 px-3 border">80-84</td><td className="py-2 px-3 border">50-52</td></tr>
            <tr><td className="py-2 px-3 border font-bold">W34</td><td className="py-2 px-3 border">84-88</td><td className="py-2 px-3 border">52-54</td></tr>
            <tr><td className="py-2 px-3 border font-bold">W36</td><td className="py-2 px-3 border">88-94</td><td className="py-2 px-3 border">54-56</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CinturonesContent() {
  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        Los cinturones se miden desde la hebilla hasta el agujero central.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 text-left border">Talla Cinturón</th>
              <th className="py-2 px-3 text-left border">Largo Total (cm)</th>
              <th className="py-2 px-3 border">Para tallas de pantalón</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="py-2 px-3 border font-bold">32</td><td className="py-2 px-3 border">85-90</td><td className="py-2 px-3 border">W28-W30</td></tr>
            <tr><td className="py-2 px-3 border font-bold">34</td><td className="py-2 px-3 border">90-95</td><td className="py-2 px-3 border">W30-W32</td></tr>
            <tr><td className="py-2 px-3 border font-bold">36</td><td className="py-2 px-3 border">95-100</td><td className="py-2 px-3 border">W32-W34</td></tr>
            <tr><td className="py-2 px-3 border font-bold">38</td><td className="py-2 px-3 border">100-105</td><td className="py-2 px-3 border">W34-W36</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function GorrasContent() {
  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        Medidas para gorras, sombreros y viseras.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 text-left border">Talla</th>
              <th className="py-2 px-3 text-left border">Circunferencia Cabeza (cm)</th>
              <th className="py-2 px-3 border">Recomendación</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="py-2 px-3 border font-bold">S/M</td><td className="py-2 px-3 border">54-57</td><td className="py-2 px-3 border">Ajustables con cierre</td></tr>
            <tr><td className="py-2 px-3 border font-bold">L/XL</td><td className="py-2 px-3 border">58-61</td><td className="py-2 px-3 border">Ajustables con cierre</td></tr>
            <tr><td className="py-2 px-3 border font-bold">Unitalla</td><td className="py-2 px-3 border">55-60</td><td className="py-2 px-3 border">Ajuste universal</td></tr>
          </tbody>
        </table>
      </div>
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-sm">
        <strong>💡 Tip:</strong> La mayoría de nuestras gorras Columbia y Nautica tienen ajuste trasero, por lo que se adaptan a casi cualquier medida.
      </div>
    </div>
  )
}
