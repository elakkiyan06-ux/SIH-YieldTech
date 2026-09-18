import fs from 'fs';

const content = fs.readFileSync('src/pages/WhereToSell.jsx', 'utf8');
const en = JSON.parse(fs.readFileSync('src/context/locales/en.json', 'utf8'));

const regex = /t\(['"]([^'"]+)['"]\)/g;
let match;
const found = new Set();
while ((match = regex.exec(content)) !== null) {
  found.add(match[1]);
}

const missing = [...found].filter(k => !(k in en));
console.log('Total t() keys found:', found.size);
console.log('Missing keys from en.json:', missing);
