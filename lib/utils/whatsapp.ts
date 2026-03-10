// lib/utils/whatsapp.ts
export const WHATSAPP_NUMBER = "59170000000";

export function formatWhatsAppNumber(): string {
    const number = WHATSAPP_NUMBER.replace(/^591/, '');
    return `+591 ${number}`;
}

export function buildWhatsAppUrl(message: string): string {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
