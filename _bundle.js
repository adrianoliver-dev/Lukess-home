const fs = require('fs');
const path = require('path');

const IGNORE_DIRS = new Set(['node_modules', '.git', '.next', '.image_cache', 'dist', '.scripts']);
const IGNORE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.mp4', '.pdf', '.zip']);

function walkDir(dir, fileList = [], treeLines = [], level = 0) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        const isDir = stat.isDirectory();

        if (isDir && IGNORE_DIRS.has(file)) continue;

        const prefix = '  '.repeat(level) + (isDir ? '📁 ' : '📄 ');
        treeLines.push(`${prefix}${file}`);

        if (isDir) {
            walkDir(filePath, fileList, treeLines, level + 1);
        } else {
            const ext = path.extname(file).toLowerCase();
            if (!IGNORE_EXTS.has(ext)) {
                fileList.push(filePath);
            }
        }
    }
    return { fileList, treeLines };
}

const rootDir = process.cwd();
const { fileList, treeLines } = walkDir(rootDir);

let output = '=== FOLDER TREE ===\n' + treeLines.join('\n') + '\n\n=== FILES ===\n';

for (const file of fileList) {
    // Only include text files we care about to keep size manageable.
    const ext = path.extname(file).toLowerCase();
    const content = fs.readFileSync(file, 'utf-8');
    output += `\n--- FILE: ${path.relative(rootDir, file)} ---\n`;
    output += content;
    output += `\n--- END FILE ---\n`;
}

fs.writeFileSync('_bundled_repo.txt', output);
console.log(`Saved ${fileList.length} files to _bundled_repo.txt`);
console.log(`Total lines: ${output.split('\\n').length}`);
