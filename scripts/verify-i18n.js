import { en } from '../src/context/locales/en.js';
import { ta } from '../src/context/locales/ta.js';
import { hi } from '../src/context/locales/hi.js';
import { te } from '../src/context/locales/te.js';
import { kn } from '../src/context/locales/kn.js';
import { ml } from '../src/context/locales/ml.js';

const languages = { en, ta, hi, te, kn, ml };
const enKeys = Object.keys(en);

console.log('====================================================');
console.log('      FARMOGRAM AI - i18n COMPLETENESS AUDIT       ');
console.log('====================================================');
console.log(`Total Master Translation Keys (EN): ${enKeys.length}\n`);

let hasError = false;

for (const [lang, dict] of Object.entries(languages)) {
  const currentKeys = Object.keys(dict);
  const missingKeys = enKeys.filter(k => !(k in dict));
  const emptyKeys = enKeys.filter(k => dict[k] === '' || dict[k] === null || dict[k] === undefined);
  const completeness = ((currentKeys.length - missingKeys.length) / enKeys.length) * 100;

  console.log(`Language: [${lang.toUpperCase()}]`);
  console.log(`  - Total Keys: ${currentKeys.length}`);
  console.log(`  - Completeness: ${completeness.toFixed(1)}%`);

  if (missingKeys.length > 0) {
    console.error(`  - Missing Keys (${missingKeys.length}):`, missingKeys.slice(0, 5));
    hasError = true;
  }
  if (emptyKeys.length > 0) {
    console.error(`  - Empty Keys (${emptyKeys.length}):`, emptyKeys.slice(0, 5));
    hasError = true;
  }
  console.log('');
}

if (hasError) {
  console.error('❌ i18n Completeness Audit FAILED: Some keys are missing or empty.');
  process.exit(1);
} else {
  console.log('✅ ALL 6 LANGUAGES HAVE 100% KEY PARITY AND VALID VALUES!');
  console.log('====================================================');
}
