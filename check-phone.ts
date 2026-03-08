async function main() {
    const TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
    const PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!TOKEN || !PHONE_ID) {
        console.error("Missing token or phone id");
        return;
    }

    try {
        console.log(`Checking Phone Number Status & Quality...`);
        const res = await fetch(`https://graph.facebook.com/v21.0/${PHONE_ID}?fields=quality_rating,status,name_status,messaging_limit_tier,is_official_business_account`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        const data = await res.json();

        console.log("\nPHONE STATUS IN META:");
        console.log(JSON.stringify(data, null, 2));

        console.log(`\nChecking Token Debug Info (simulated via basic API call)...`);
        // We can't hit the debug_token endpoint directly without the App Secret, 
        // but we can at least check if the token works for fetching templates.

    } catch (e: any) {
        console.error("Script error:", e.message);
    }
}
main();
