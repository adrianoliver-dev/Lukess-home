import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
        }
    });
    return results;
}

const files = [...walk('app'), ...walk('components'), ...walk('lib')];
console.log('Replacing $ -> Bs in ' + files.length + ' files...');
for(const f of files) {
   let content = fs.readFileSync(f, 'utf8');
   let original = content;

   // Replace `$XXXX` with `Bs XXXX` where XXXX is a number
   content = content.replace(/\$(?=\d)/g, 'Bs ');

   // Replace `${` with `Bs {` ONLY when it's part of a JSX expression for a known variable like product.price
   // We look for literal "$" followed by "{product", "{item", "{order", "{precio", "{Number"
   content = content.replace(/\$(?=\{(?:product|getPrice|order|item|cart|total|subtotal|shipping|getDiscountedPrice|Number|precio)[^}]+\})/g, 'Bs ');

   if(original !== content) {
       fs.writeFileSync(f, content, 'utf8');
       console.log('Updated', f);
   }
}
