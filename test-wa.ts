import { sendWhatsAppMessage } from './lib/whatsapp/send-message'

async function main() {
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '72643753'
    const to = `591${number}`

    console.log(`Sending pedido_entregado directly to Meta (${to})...`);

    try {
        const res = await sendWhatsAppMessage({
            to,
            templateName: 'pedido_entregado',
            variables: ['ORD-1234', 'Adrian Test', 'TEST-CODE-99'],
            headerImage: 'https://lrcggpdgrqltqbxqnjgh.supabase.co/storage/v1/object/public/banners/whatsapp/entregado.png'
        });
        console.log('\n✅ SUCCESS! Meta Response:', JSON.stringify(res, null, 2));
    } catch (error: any) {
        console.error('\n❌ FAILED. Error from Meta:', error.message);
    }
}

main()
