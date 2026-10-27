// URME 2.1 — export GPX din punctele marcate de utilizator + secțiunea de surse oficiale (linkuri verificate pe web la 2026-10-27).
// Rulare: node tests/gpx-v21.test.mjs   (Playwright din /opt/node-tools, Chromium din /opt/pw-browsers; rețea blocată)
import {createRequire} from 'module'; import path from 'node:path'; import fs from 'node:fs'; import {fileURLToPath} from 'node:url';
const require = createRequire(process.env.PW_ROOT || import.meta.url); const {chromium} = require('playwright');
const FILE = 'file://' + path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'index.html');
const AXE = process.env.FFF_AXE || process.env.AXE_PATH;
let ok = 0, bad = 0; const t = (n, c, x) => { if (c) { ok++; console.log('  ok  ', n); } else { bad++; console.log('  FAIL', n, x ?? ''); } };
const b = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox']});
async function open(stops, opts = {}) {
  const ctx = await b.newContext({viewport: {width: 390, height: 900}, locale: opts.locale || 'ro-RO', acceptDownloads: true, bypassCSP: !!opts.bypass});
  const net = []; await ctx.route(/^https?:/, r => { net.push(r.request().url()); r.abort(); });
  if (stops) await ctx.addInitScript((s) => { try { if (!localStorage.getItem('urme.guide')) localStorage.setItem('urme.guide', JSON.stringify({v: 1, stops: s})); } catch (e) {} }, stops);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => { errs.push('dialog:' + d.message()); d.dismiss(); });
  await p.addInitScript(() => { window.__csp = []; document.addEventListener('securitypolicyviolation', e => window.__csp.push(e.violatedDirective + ' ' + e.blockedURI)); });
  await p.goto(FILE); await p.waitForTimeout(700); return {ctx, p, errs, net};
}
const STOPS = [
  {tg: 'padurea', lb: 'Intrare <în> "pădure" & co', la: 45.380123456, lo: 26.400987654, ac: 8, r: 50, v: 0},
  {tg: 'chihlimbar', lb: '', la: 45.3811, lo: 26.4021, ac: null, r: 25, v: 1},
  {tg: 'fosile', lb: 'Fără poziție', la: null, lo: null, ac: null, r: 100, v: 0},
  {tg: 'alunis', lb: 'Biserica', la: -12.5, lo: -70.25, ac: 30, r: 100, v: 0},
];

console.log('--- export GPX');
{
  const {ctx, p, errs, net} = await open(STOPS);
  t('butonul „Exportă GPX” există', await p.$('#gdGpx') !== null && /Exportă GPX/.test(await p.textContent('#gdGpx')));
  const [d] = await Promise.all([p.waitForEvent('download'), p.click('#gdGpx')]);
  const name = d.suggestedFilename(); const txt = fs.readFileSync(await d.path(), 'utf8');
  t('nume de fișier urme_puncte_AAAALLZZ.gpx', /^urme_puncte_\d{8}\.gpx$/.test(name), name);
  const r = await p.evaluate((x) => { const doc = new DOMParser().parseFromString(x, 'application/xml'); const err = doc.querySelector('parsererror'); if (err) return {err: err.textContent.slice(0, 200)};
    const q = (s, root = doc) => Array.from(root.getElementsByTagName(s));
    return {root: doc.documentElement.nodeName, ver: doc.documentElement.getAttribute('version'), creator: doc.documentElement.getAttribute('creator'),
      wpt: q('wpt').map(w => ({lat: w.getAttribute('lat'), lon: w.getAttribute('lon'), name: w.getElementsByTagName('name')[0].textContent, desc: w.getElementsByTagName('desc')[0].textContent, order: Array.from(w.children).map(c => c.nodeName)})),
      rtept: q('rtept').map(w => w.getAttribute('lat') + ',' + w.getAttribute('lon')), top: Array.from(doc.documentElement.children).map(c => c.nodeName), time: doc.getElementsByTagName('time')[0].textContent}; }, txt);
  t('XML bine format (parser XML al browserului)', !r.err, r.err);
  t('GPX 1.1, rădăcină gpx, creator cu versiunea', r.root === 'gpx' && r.ver === '1.1' && /^URME 2\.\d+\.\d+$/.test(r.creator), [r.root, r.ver, r.creator]);
  t('ordinea elementelor de nivel superior: metadata, wpt…, rte', r.top.join() === 'metadata,wpt,wpt,wpt,rte', r.top);
  t('doar punctele cu poziție (3 din 4), fără coordonate predefinite', r.wpt.length === 3 && r.rtept.length === 3, r.wpt.length);
  t('coordonate cu 6 zecimale, negative păstrate', r.wpt[0].lat === '45.380123' && r.wpt[0].lon === '26.400988' && r.wpt[2].lat === '-12.500000' && r.wpt[2].lon === '-70.250000', r.wpt.map(w => w.lat + ',' + w.lon));
  t('numele: <> eliminate de ghid, iar " și & sunt scăpate în XML și revin identice la parsare', r.wpt[0].name === 'Intrare în "pădure" & co' && /&quot;pădure&quot; &amp; co/.test(txt), r.wpt[0].name);
  t('nume implicit = titlul fișei, când nu e etichetă', /Chihlimbar|chihlimbar/i.test(r.wpt[1].name), r.wpt[1].name);
  t('descriere: fișa, raza, precizia GPS, vizitat', /Fișă: .+ · rază de apropiere 50 m · precizie GPS ±8 m/.test(r.wpt[0].desc) && /vizitat/.test(r.wpt[1].desc) && !/precizie/.test(r.wpt[1].desc), [r.wpt[0].desc, r.wpt[1].desc]);
  t('în wpt: name, desc, type în ordinea cerută de schema GPX', r.wpt.every(w => w.order.join() === 'name,desc,type'), r.wpt[0].order);
  t('ruta urmează ordinea marcării', r.rtept.join('|') === '45.380123,26.400988|45.381100,26.402100|-12.500000,-70.250000', r.rtept);
  t('timp ISO în metadata', /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(r.time), r.time);
  t('nu conține gazde externe în afară de spațiile de nume GPX/XSI', !/https?:\/\/(?!www\.topografix\.com|www\.w3\.org)/.test(txt));
  t('statusul anunță numărul de puncte', /3 puncte/.test(await p.textContent('#gdStatus')), await p.textContent('#gdStatus'));
  fs.writeFileSync('/tmp/_urme_test.gpx', txt);
  t('fără erori / dialoguri / rețea / CSP', errs.length === 0 && net.length === 0 && (await p.evaluate(() => window.__csp)).length === 0, {errs, net});
  await ctx.close();
}
{
  const {ctx, p} = await open([{tg: 'fosile', lb: 'x', la: null, lo: null, ac: null, r: 50, v: 0}]);
  let fired = false; p.once('download', () => { fired = true; });
  await p.click('#gdGpx'); await p.waitForTimeout(400);
  t('fără puncte cu poziție: mesaj, nu se descarcă nimic', !fired && /Niciun punct cu poziție/.test(await p.textContent('#gdStatus')), await p.textContent('#gdStatus'));
  await ctx.close();
}
{
  const {ctx, p} = await open(null);
  let fired = false; p.once('download', () => { fired = true; });
  await p.click('#gdGpx'); await p.waitForTimeout(300);
  t('listă goală: mesaj, nu se descarcă nimic', !fired && /Niciun punct cu poziție/.test(await p.textContent('#gdStatus')));
  await ctx.close();
}

console.log('--- hărți și surse oficiale');
{
  const {ctx, p, errs, net} = await open(null, {bypass: true});
  const L = await p.$$eval('#oficial a', (as) => as.map((a) => ({h: a.href, rel: a.rel, tg: a.target, tx: a.textContent})));
  const want = ['https://tinutulbuzaului.org/harti-si-carti/', 'https://cjbuzau.ro/vestigiile-rupestre/', 'https://www.salvamontromania.ro/harta-salvamont.php', 'https://www.salvamontromania.ro/module.php?node=repartitie_teritoriala', 'https://www.salvamontromania.ro/aplicatia-salvamont.php'];
  t('exact cele 5 linkuri verificate, în această ordine', L.map((a) => a.h).join('|') === want.join('|'), L.map((a) => a.h));
  t('toate cu rel="noopener noreferrer" și target=_blank', L.every((a) => /noopener/.test(a.rel) && /noreferrer/.test(a.rel) && a.tg === '_blank'));
  t('textul spune că linkurile se deschid doar la apăsare și că ghidul e neoficial', /doar dacă apeși/.test(await p.textContent('#oficial')) && /neoficial/.test(await p.textContent('#oficial')));
  t('notă 112 + Buzău fără serviciu Salvamont listat (cu dată)', /27 oct\. 2026/.test(await p.textContent('#oficial')) && /112/.test(await p.textContent('#oficial')) && /Buzău/.test(await p.textContent('#oficial')));
  t('0 cereri de rețea (linkurile nu se încarcă singure)', net.length === 0 && errs.length === 0, {net, errs});
  if (AXE) { await p.addScriptTag({content: fs.readFileSync(AXE, 'utf8')}); const v = await p.evaluate(async () => (await axe.run(document, {resultTypes: ['violations']})).violations.map(x => x.id + ':' + x.nodes.length)); t('axe: 0 violări', v.length === 0, v); }
  await ctx.close();
}
for (const [loc, rx] of [['en-US', /Official maps and sources/], ['fr-FR', /Cartes et sources officielles/], ['it-IT', /Mappe e fonti ufficiali/], ['es-ES', /Mapas y fuentes oficiales/], ['pt-PT', /Mapas e fontes oficiais/], ['de-DE', /Offizielle Karten und Quellen/], ['hu-HU', /Hivatalos térképek és források/]]) {
  const {ctx, p} = await open(null, {locale: loc});
  const eb = await p.textContent('#oficial .eyebrow'); const hrefs = await p.$$eval('#oficial a', (as) => as.length);
  const gp = await p.textContent('#gdGpx');
  t(loc + ': secțiune și buton traduse, 5 linkuri păstrate', rx.test(eb) && hrefs === 5 && !/Exportă GPX/.test(gp), [eb, hrefs, gp]);
  await ctx.close();
}
await b.close(); console.log(`\nURME gpx-v21: ${ok} ok, ${bad} eșuate`); process.exit(bad ? 1 : 0);
