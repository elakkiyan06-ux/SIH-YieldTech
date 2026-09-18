import fs from 'fs';
import path from 'path';

function findFiles(dir, exts) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (item !== 'node_modules' && item !== 'dist' && item !== '.git') {
        files = files.concat(findFiles(fullPath, exts));
      }
    } else if (exts.some(ext => item.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

const srcFiles = findFiles('src', ['.jsx', '.js']);
const en = JSON.parse(fs.readFileSync('src/context/locales/en.json', 'utf8'));

const allUsedKeys = new Set();
const keyLocations = {};

for (const file of srcFiles) {
  if (file.includes('locales')) continue;
  const content = fs.readFileSync(file, 'utf8');
  const matches = [...content.matchAll(/t\(['"]([a-zA-Z0-9_\-:]+)['"]/g)];
  for (const m of matches) {
    allUsedKeys.add(m[1]);
    if (!keyLocations[m[1]]) keyLocations[m[1]] = [];
    keyLocations[m[1]].push(path.basename(file));
  }
}

const missing = [...allUsedKeys].filter(k => !(k in en));
console.log(`Scanned ${srcFiles.length} files in src/`);
console.log(`Total unique t('...') keys in application: ${allUsedKeys.size}`);
console.log(`Total missing keys from en.json: ${missing.length}\n`);

const missingWithDetails = missing.map(k => ({
  key: k,
  files: [...new Set(keyLocations[k])]
}));

console.log(JSON.stringify(missingWithDetails, null, 2));
