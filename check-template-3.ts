async function main() {
    const TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
    const WABA_ID = '776830408379447';

    async function check(name: string) {
        const res = await fetch(`https://graph.facebook.com/v21.0/${WABA_ID}/message_templates?name=${name}`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        const data = await res.json();
        const tpl = data.data?.[0];
        if (!tpl) { console.log(`Not found: ${name}`); return; }

        console.log(`\n============================`);
        console.log(`TEMPLATE: ${name}`);
        console.log(`STATUS: ${tpl.status}`);
        const body = tpl.components.find((c: any) => c.type === 'BODY');
        console.log(`BODY TEXT:\n${body?.text}`);
        const exampleValues = body?.example?.body_text?.[0] || [];
        console.log(`VARIABLES RECONOCIDAS EN META: ${exampleValues.length}`);
    }

    await check('pedido_entregado');
    await check('pedido_entregado_simple');
}
main();
