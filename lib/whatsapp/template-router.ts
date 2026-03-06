export interface OrderForWhatsApp {
    id: string
    customer_name: string
    customer_phone: string | null
    notify_whatsapp: boolean
    delivery_method: string
    payment_method: string
    shipping_address: string | null
    pickup_location: string | null
    total: number
    cancellation_reason?: string | null
}

export type WhatsAppTemplateConfig = {
    templateName: string;
    variables: string[];
    headerImage?: string;
};

/** URL for the header image on the `pedido_entregado` template */
const ENTREGADO_HEADER_IMAGE =
    'https://lukess-home.vercel.app/images/entregado.png'

export function getWhatsAppTemplate(
    order: OrderForWhatsApp,
    newStatus: string,
    nextPurchaseDiscountCode: string = 'GRACIAS10'
): WhatsAppTemplateConfig | null {

    const orderNumber = order.id.substring(0, 8).toUpperCase();
    const name = order.customer_name;

    const isPickup = order.delivery_method === 'pickup';
    const isCashOnPickup = isPickup && (order.payment_method === 'cash_on_pickup' || order.payment_method === 'efectivo' || order.payment_method === 'cash');

    switch (newStatus) {
        case 'pending':
            return {
                templateName: 'pedido_recibido',
                variables: [name, orderNumber, order.total.toFixed(2)] // {{1}}=name, {{2}}=order, {{3}}=total
            };

        case 'pending_payment':
            if (isCashOnPickup) {
                return {
                    templateName: 'pedido_reservado_pago_en_tienda',
                    variables: [orderNumber, name]
                };
            }
            return null;

        case 'confirmed':
            if (isPickup) {
                return {
                    templateName: 'pago_confirmado_pickup_qr',
                    variables: [orderNumber, name]
                };
            }
            return {
                templateName: 'pago_confirmado',
                variables: [orderNumber, name] // {{1}}=order, {{2}}=name
            };

        case 'shipped':
            // 'shipped' in DB represents 'En camino' or 'Listo para recoger'
            if (isPickup) {
                return {
                    templateName: 'pedido_listo_recojo',
                    variables: [orderNumber, name, order.pickup_location ?? 'tienda'] // {{3}}=location
                };
            }
            return {
                templateName: 'pedido_en_camino',
                variables: [orderNumber, name, order.shipping_address ?? 'tu dirección'] // {{3}}=address
            };

        case 'completed':
            return {
                templateName: 'pedido_entregado',
                variables: [orderNumber, name, nextPurchaseDiscountCode], // {{1}}=order, {{2}}=name, {{3}}=discount
                headerImage: ENTREGADO_HEADER_IMAGE
            };

        case 'cancelled':
            return {
                templateName: 'pedido_cancelado',
                variables: [orderNumber, name, order.cancellation_reason ?? 'Motivo no especificado']
            };

        default:
            return null;
    }
}
