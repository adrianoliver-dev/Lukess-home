const fs = require('fs');
const path = require('path');

const fileReplacements = [
    {
        file: 'components/cart/CheckoutModal.tsx',
        rules: [
            {
                regex: /'bg-gradient-to-r from-green-500 to-green-600 text-white'/g,
                replace: "'bg-gray-900 text-white'"
            },
            {
                regex: /bg-gradient-to-r from-gray-50 to-lukess-gold\/10/g,
                replace: "bg-gray-50"
            },
            {
                regex: /className="text-3xl font-black bg-gradient-to-r from-green-600 to-gray-600 bg-clip-text text-transparent"/g,
                replace: 'className="text-3xl font-black text-gray-900"'
            },
            {
                regex: /bg-gradient-to-br from-green-400 to-green-600/g,
                replace: "bg-gray-900 text-white"
            }
        ]
    },
    {
        file: 'components/catalogo/QuickViewModal.tsx',
        rules: [
            {
                regex: /bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold border border-gray-200 shadow-sm/g,
                replace: "bg-gray-900 text-white px-3 py-1 rounded-md text-xs font-bold border border-gray-200 shadow-sm uppercase tracking-widest"
            },
            {
                regex: /bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold border border-gray-200 shadow-sm/g,
                replace: "bg-gray-900 text-white px-3 py-1 rounded-md text-xs font-bold border border-gray-200 shadow-sm uppercase tracking-widest"
            },
            {
                regex: /'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 hover:border border-gray-200 shadow-sm hover:scale-\[1\.02\] active:scale-\[0\.98\]'/g,
                replace: "'bg-gray-900 text-white hover:bg-black font-bold uppercase tracking-widest text-sm rounded-md transition-colors'"
            }
        ]
    },
    {
        file: 'components/home/CatalogoClient.tsx',
        rules: [
            {
                regex: /'bg-gradient-to-r from-amber-400 to-orange-500 text-white border border-gray-200 shadow-sm shadow-amber-400\/30 scale-105'/g,
                replace: "'bg-gray-900 text-white border border-gray-200 shadow-sm uppercase tracking-widest scale-105 rounded-md'"
            },
            {
                regex: /'bg-gradient-to-r from-red-500 to-red-600 text-white border border-gray-200 shadow-sm shadow-red-500\/30 scale-105'/g,
                replace: "'bg-gray-900 text-white border border-gray-200 shadow-sm uppercase tracking-widest scale-105 rounded-md'"
            }
        ]
    },
    {
        file: 'app/garantia-autenticidad/page.tsx',
        rules: [
            {
                regex: /bg-gradient-to-br from-gray-50 to-gray-100/g,
                replace: "bg-gray-50"
            }
        ]
    },
    {
        file: 'app/blog/[slug]/page.tsx',
        rules: [
            {
                regex: /bg-gradient-to-r from-accent-50 to-accent-100/g,
                replace: "bg-gray-50"
            }
        ]
    },
    {
        file: 'components/marketing/CountdownTimer.tsx',
        rules: [
            {
                regex: /bg-gradient-to-r from-lukess-gold to-lukess-gold/g,
                replace: "bg-gray-900"
            }
        ]
    }
];

const basePath = "c:/LukessHome/lukess-landing-ecommerce";

fileReplacements.forEach(({ file, rules }) => {
    const filePath = path.join(basePath, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf-8');
        rules.forEach(rule => {
            content = content.replace(rule.regex, rule.replace);
        });
        fs.writeFileSync(filePath, content);
        console.log(`Updated gradients in: ${file}`);
    }
});
