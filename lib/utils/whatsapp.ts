// lib/utils/whatsapp.ts
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '59172643753';

export function formatWhatsAppNumber(): string {
    // Manejar el caso donde el número de entorno incluye el 591
    const number = WHATSAPP_NUMBER.replace(/^591/, '');
    return `+591 ${number}`;
}

export function buildWhatsAppUrl(message: string): string {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
