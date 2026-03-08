async function main() {
    const TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
    const WABA_ID = '776830408379447';

    async function checkAll(name: string) {
        const res = await fetch(`https://graph.facebook.com/v21.0/${WABA_ID}/message_templates?name=${name}`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        const data = await res.json();

        console.log(`\n=== ALL VERSIONS OF: ${name} ===`);
        if (!data.data || data.data.length === 0) {
            console.log("No templates found.");
            return;
        }

        data.data.forEach((tpl: any) => {
            console.log(`\n--- ID: ${tpl.id} | Language: ${tpl.language} | Status: ${tpl.status} ---`);
            const body = tpl.components.find((c: any) => c.type === 'BODY');
            console.log(`BODY TEXT:\n${body?.text}`);
            const exampleValues = body?.example?.body_text?.[0] || [];
            console.log(`VARIABLES RECONOCIDAS: ${exampleValues.length}`);
        });
    }

    await checkAll('pedido_entregado');
}
main();
