

async function main() {
    const TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
    const PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!TOKEN || !PHONE_ID) {
        console.error("Missing token or phone id");
        return;
    }

    try {
        // First get the Whatsapp Business Account ID from the Phone ID
        const wabaRes = await fetch(`https://graph.facebook.com/v21.0/${PHONE_ID}?fields=whatsapp_business_api_data{whatsapp_business_account_id}`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        const wabaData = await wabaRes.json();
        const WABA_ID = wabaData.whatsapp_business_api_data?.whatsapp_business_account_id || wabaData.whatsapp_business_account?.id;

        if (!WABA_ID) {
            console.log("Could not find WABA ID", wabaData);
            // Let's try alternative
            const wabaAltRes = await fetch(`https://graph.facebook.com/v21.0/${PHONE_ID}?fields=whatsapp_account`, {
                headers: { Authorization: `Bearer ${TOKEN}` }
            });
            console.log("Alt WABA Data:", await wabaAltRes.json());
        }

        console.log(`Checking templates for WABA_ID: ${WABA_ID}...`);

        const res = await fetch(`https://graph.facebook.com/v21.0/${WABA_ID}/message_templates?name=pedido_entregado`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        const data = await res.json();

        console.log("\nTEMPLATE DEFINITION IN META:");
        console.log(JSON.stringify(data, null, 2));
    } catch (e: any) {
        console.error(e.message);
    }
}

main();
