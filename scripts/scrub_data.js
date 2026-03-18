const fs = require('fs');
const path = require('path');

const files = [
    "lib/utils/whatsapp.ts",
    "lib/emails/templates.ts",
    "docs/audit_lukess_home_landing_10_03.md",
    "content/blog/renovar-guardarropa-masculino-presupuesto.md",
    "content/blog/pantalones-blazers-hombre-calor.md",
    "content/blog/guia-tallas-ropa-marca-bolivia.md",
    "content/blog/donde-comprar-ropa-marca-santa-cruz.md",
    "content/blog/camisas-columbia-bolivia-precios.md",
    "components/cart/CheckoutModal.tsx",
    "app/terminos/page.tsx",
    "app/privacidad/page.tsx",
    "app/preguntas-frecuentes/page.tsx",
    "app/politicas-cambio/page.tsx",
    "app/politicas-envio/page.tsx",
    "components/marketing/NewsletterPopup.tsx",
    "components/marketing/FooterNewsletter.tsx",
    "components/layout/Footer.tsx",
    "components/auth/AuthModal.tsx",
    "app/api/send-email/route.ts"
];

for (const file of files) {
    const fullPath = path.join("c:/LukessHome/lukess-landing-ecommerce", file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf-8');

        // Replace phone numbers
        content = content.replace(/72643753/g, "75516136");

        // Replace emails
        content = content.replace(/tucorreo@gmail\.com/g, "demo@lukesshome.com");
        content = content.replace(/dev\.lukesshome@gmail\.com/g, "demo@lukesshome.com");
        content = content.replace(/financenft01@gmail\.com/g, "demo@lukesshome.com");

        fs.writeFileSync(fullPath, content);
        console.log(`Updated: ${file}`);
    } else {
        console.log(`Not found: ${file}`);
    }
}
