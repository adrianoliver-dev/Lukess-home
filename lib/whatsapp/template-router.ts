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

const ENTREGADO_HEADER_IMAGE = 'https://lrcggpdgrqltqbxqnjgh.supabase.co/storage/v1/object/public/banners/whatsapp/entregado.png';

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
                variables: [name, orderNumber, order.total.toFixed(2)]
            };

        case 'pending_payment':
            if (isCashOnPickup) {
                return {
                    templateName: 'pedido_reservado_pago_en_tienda_',
                    variables: [name, orderNumber, order.total.toFixed(2)]
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
                templateName: 'pago_confirmado_u',
                variables: [orderNumber, name]
            };

        case 'shipped':
            if (isPickup) {
                return {
                    templateName: 'pedido_listo_recojo',
                    variables: [orderNumber, name, order.pickup_location ?? 'tienda']
                };
            }
            return {
                templateName: 'pedido_en_camino',
                variables: [orderNumber, name, order.shipping_address ?? 'tu dirección']
            };

        case 'completed':
            if (nextPurchaseDiscountCode && nextPurchaseDiscountCode.trim() !== '') {
                return {
                    templateName: 'pedido_entregado',
                    variables: [orderNumber, name, nextPurchaseDiscountCode],
                    headerImage: ENTREGADO_HEADER_IMAGE
                };
            }
            return {
                templateName: 'pedido_entregado_simple',
                variables: [orderNumber, name],
                headerImage: ENTREGADO_HEADER_IMAGE
            };

        case 'cancelled':
            return {
                templateName: 'pedido_cancelado_u',
                variables: [orderNumber, name, order.cancellation_reason ?? 'Motivo no especificado']
            };

        default:
            return null;
    }
}
