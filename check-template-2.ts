async function main() {
    const TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
    const WABA_ID = '776830408379447';

    if (!TOKEN) {
        console.error("Missing token");
        return;
    }

    try {
        console.log(`Checking templates for WABA_ID: ${WABA_ID}...`);

        const res = await fetch(`https://graph.facebook.com/v21.0/${WABA_ID}/message_templates?name=pedido_entregado`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        const data = await res.json();

        console.log("\nTEMPLATE DEFINITION IN META:");
        console.log(JSON.stringify(data, null, 2));

        // Let's also check pedido_entregado_simple just in case
        const res2 = await fetch(`https://graph.facebook.com/v21.0/${WABA_ID}/message_templates?name=pedido_entregado_simple`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        const data2 = await res2.json();
        console.log("\nTEMPLATE SIMPLE DEFINITION IN META:");
        console.log(JSON.stringify(data2, null, 2));

    } catch (e: any) {
        console.error(e.message);
    }
}
main();
