const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ?
            walkDir(dirPath, callback) : callback(dirPath);
    });
}

const targetDirs = [
    path.join("c:/LukessHome/lukess-landing-ecommerce", "app"),
    path.join("c:/LukessHome/lukess-landing-ecommerce", "components"),
    path.join("c:/LukessHome/lukess-landing-ecommerce", "content")
];

targetDirs.forEach(dir => {
    walkDir(dir, (filePath) => {
        if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.md')) {
            let content = fs.readFileSync(filePath, 'utf-8');

            // Replace large shadows
            content = content.replace(/\bshadow-(lg|xl|2xl)\b/g, "border border-gray-200 shadow-sm");

            // Replace accent colors
            content = content.replace(/\baccent-(500|400)\b/g, "lukess-gold");

            fs.writeFileSync(filePath, content);
        }
    });
});

console.log('UI standardization script completed!');
