import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Rastreo de Pedidos - Lukess Home',
    description: 'Revisa el estado de tu compra, consulta tu código de seguimiento y descarga el comprobante de tus pedidos en Lukess Home.',
}

export default function MisPedidosLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
