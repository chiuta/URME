// Notele 58b (data verificării) și 58d (variante accesibile) există în toate cele 8 limbi și în HTML.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const s = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const d = JSON.parse(s.match(/<script type="application\/json" id="urme-i18n">(.*?)<\/script>/s)[1]);
let n = 0;
for (const l of ['ro', 'en', 'fr', 'it', 'es', 'pt', 'de', 'hu']) for (const k of ['ver.note', 'acc.note']) { assert.ok(d[l] && d[l][k], l + ' ' + k); n++; }
assert.match(s, /data-i18n="ver\.note"/); assert.match(s, /data-i18n="acc\.note"/);
assert.match(d.en['ver.note'], /27 Oct 2026/);
console.log('  ok  ' + n + ' chei în 8 limbi\n\n' + (n + 3) + ' reușite, 0 eșuate');
