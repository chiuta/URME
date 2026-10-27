// URME 2.2 — traseu parcurs opțional (doar în memorie) exportat ca <trk> în GPX. Poziția GPS este simulată de Playwright (geolocation).
// Rulare: node tests/track-v22.test.mjs   (Playwright din PW_ROOT, Chromium din CHROMIUM_PATH; rețea blocată)
import {createRequire} from 'module'; import path from 'node:path'; import fs from 'node:fs'; import {fileURLToPath} from 'node:url';
const require = createRequire(process.env.PW_ROOT || import.meta.url); const {chromium} = require('playwright');
const FILE = 'file://' + path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'index.html');
let ok = 0, bad = 0; const t = (n, c, x) => { if (c) { ok++; console.log('  ok  ', n); } else { bad++; console.log('  FAIL', n, x ?? ''); } };
const b = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox']});
async function open(lang = 'ro-RO') {
  const ctx = await b.newContext({viewport: {width: 390, height: 900}, locale: lang, acceptDownloads: true, permissions: ['geolocation'], geolocation: {latitude: 45.38, longitude: 26.40, accuracy: 10}});
  const net = []; await ctx.route(/^https?:/, r => { net.push(r.request().url()); r.abort(); });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => { errs.push('dialog:' + d.message()); d.dismiss(); });
  await p.addInitScript(() => { window.__csp = []; document.addEventListener('securitypolicyviolation', e => window.__csp.push(e.violatedDirective)); });
  await p.goto(FILE); await p.waitForTimeout(700); return {ctx, p, errs, net};
}
const dl = async p => { const [d] = await Promise.all([p.waitForEvent('download'), p.click('#gdGpx')]); return fs.readFileSync(await d.path(), 'utf8'); };
const parse = (p, x) => p.evaluate((x) => { const doc = new DOMParser().parseFromString(x, 'application/xml'); if (doc.querySelector('parsererror')) return {err: 1};
  return {top: Array.from(doc.documentElement.children).map(c => c.nodeName), pts: Array.from(doc.getElementsByTagName('trkpt')).map(q => [q.getAttribute('lat'), q.getAttribute('lon'), q.getElementsByTagName('time')[0].textContent])}; }, x);

console.log('--- implicit: nicio urmă');
{
  const {ctx, p, errs} = await open();
  t('caseta există și este debifată implicit', (await p.$('#gdRec')) !== null && !(await p.isChecked('#gdRec')));
  await p.click('#gdMark'); await p.waitForTimeout(800);
  const x = await dl(p); const r = await parse(p, x);
  t('fără înregistrare: GPX fără <trk> (neschimbat față de 2.1)', !r.err && r.top.join() === 'metadata,wpt,rte' && !/<trk>/.test(x), r.top);
  await ctx.close();
}
console.log('--- înregistrare');
{
  const {ctx, p, errs, net} = await open();
  await p.click('#gdMark'); await p.waitForTimeout(800);
  await p.check('#gdRec'); await p.click('#gdWatch'); await p.waitForTimeout(600);
  const P = [[45.3801, 26.4001], [45.3803, 26.4003], [45.38031, 26.40031], [45.3806, 26.4006]];   // al 3-lea: sub 8 m de al 2-lea
  for (const [la, lo] of P) { await ctx.setGeolocation({latitude: la, longitude: lo, accuracy: 10}); await p.waitForTimeout(500); }
  await ctx.setGeolocation({latitude: 45.39, longitude: 26.41, accuracy: 500}); await p.waitForTimeout(500);   // imprecis: ignorat
  t('mesajul de stare arată numărul de puncte ale traseului', /Traseu: \d+ puncte/.test(await p.textContent('#gdStatus')), await p.textContent('#gdStatus'));
  await p.click('#gdWatch');
  const x = await dl(p); const r = await parse(p, x);
  t('XML bine format; ordinea: metadata, wpt, rte, trk', !r.err && r.top.join() === 'metadata,wpt,rte,trk', r.top);
  t('traseu: punctele depărtate ≥ 8 m, fără cel apropiat și fără fixul imprecis', r.pts && r.pts.length >= 3 && r.pts.length <= 5 && !r.pts.some(q => q[0] === '45.390000') && !r.pts.some(q => q[0] === '45.380310'), r.pts);
  t('fiecare punct are timp ISO UTC', r.pts.every(q => /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(q[2])), r.pts);
  t('mesaj de export cu numărul de puncte ale traseului', /traseul parcurs \(\d+ puncte\)/.test(await p.textContent('#gdStatus')), await p.textContent('#gdStatus'));
  const stored = await p.evaluate(() => JSON.stringify(Object.keys(localStorage).map(k => [k, localStorage.getItem(k)])));
  t('traseul NU este salvat în localStorage (nicio coordonată 45.3801…45.3806)', !/45\.380[1-6]/.test(stored), stored.slice(0, 300));
  await p.click('#gdClear'); await p.waitForTimeout(200);
  await p.click('#gdMark'); await p.waitForTimeout(800);
  const y = await dl(p);
  t('„Șterge toate punctele” șterge și traseul', !/<trk>/.test(y));
  t('0 cereri de rețea, 0 erori, 0 încălcări CSP', net.length === 0 && errs.length === 0 && (await p.evaluate(() => window.__csp)).length === 0, [net, errs]);
  await ctx.close();
}
console.log('--- pornire fără puncte marcate');
{
  const {ctx, p} = await open();
  await p.click('#gdWatch'); await p.waitForTimeout(300);
  t('fără casetă și fără puncte: mesajul vechi „niciun punct”', /Niciun punct nu are poziție/.test(await p.textContent('#gdStatus')));
  await p.check('#gdRec'); await p.click('#gdWatch'); await p.waitForTimeout(300);
  t('cu caseta bifată pornește și fără puncte marcate', (await p.getAttribute('#gdWatch', 'aria-pressed')) === 'true');
  await ctx.close();
}
console.log('--- limbi');
for (const l of ['en', 'fr', 'it', 'es', 'pt', 'de', 'hu']) {
  const {ctx, p} = await open(l + '-' + l.toUpperCase());
  await p.evaluate((l) => { const s = document.querySelector('#langSel, select[data-lang], #lang'); if (s) { s.value = l; s.dispatchEvent(new Event('change', {bubbles: true})); } }, l);
  await p.waitForTimeout(300);
  const lab = await p.textContent('label[for="gdRec"]'), note = await p.textContent('.gd-recnote');
  t(l + ': eticheta și nota sunt traduse (nu româna)', !/Înregistrează/.test(lab) && !/Opțional/.test(note) && lab.length > 10, lab);
  await ctx.close();
}
await b.close(); console.log(`\n${ok} ok / ${bad} eșuate`); process.exit(bad ? 1 : 0);
