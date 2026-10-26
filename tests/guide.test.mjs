// URME 2.0 — Ghid pe teren: puncte marcate de utilizator (poziție la cerere), fișe legate, anunț de apropiere, mod manual, i18n, stocare.
// Rulare: node tests/guide.test.mjs   (Playwright din /opt/node-tools, Chromium din /opt/pw-browsers; rețea blocată)
import {createRequire} from 'module'; import path from 'node:path'; import fs from 'node:fs'; import {fileURLToPath} from 'node:url';
const require = createRequire(process.env.PW_ROOT || import.meta.url); const {chromium} = require('playwright');
const FILE = 'file://' + path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'index.html');
const AXE = process.env.FFF_AXE || process.env.AXE_PATH;
let ok = 0, bad = 0; const t = (n, c, x) => { if (c) { ok++; console.log('  ok  ', n); } else { bad++; console.log('  FAIL', n, x ?? ''); } };
const b = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox']});
const A = {latitude: 45.3800, longitude: 26.4000, accuracy: 8};
const B2 = {latitude: 45.3900, longitude: 26.4100, accuracy: 8};
async function open(opts = {}, init) {
  const ctx = await b.newContext({viewport: {width: 390, height: 900}, locale: 'ro-RO', permissions: ['geolocation'], geolocation: A, ...opts});
  const net = []; await ctx.route(/^https?:/, r => { net.push(r.request().url()); r.abort(); });
  if (init) await ctx.addInitScript(init);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => { errs.push('dialog:' + d.message()); d.dismiss(); });
  await p.goto(FILE); await p.waitForTimeout(600); return {ctx, p, errs, net};
}
const stops = p => p.evaluate(() => JSON.parse(localStorage.getItem('urme.guide') || '{"stops":[]}').stops);

console.log('--- structură și țintele fișelor');
{
  const {ctx, p, errs, net} = await open();
  t('secțiunea Ghid pe teren există', await p.$('#ghid') !== null);
  const opts = await p.$$eval('#gdTarget option', o => o.map(x => x.textContent));
  t('listă de fișe: 4 secțiuni + 7 plante', opts.length === 11, opts.length);
  t('prima plantă: Pătlagină', opts.some(x => /Pătlagină/.test(x)));
  t('lista goală arată un mesaj', /Niciun punct/.test(await p.textContent('#gdList')));
  t('start fără puncte cu poziție: mesaj, nu pornește', (await p.click('#gdWatch'), await p.waitForTimeout(100), /Niciun punct nu are poziție/.test(await p.textContent('#gdStatus'))));
  t('următoarea oprire fără puncte: mesaj', (await p.click('#gdNext'), /Niciun punct/.test(await p.textContent('#gdStatus'))));
  t('fără erori / dialoguri / rețea', errs.length === 0 && net.length === 0, {errs, net});
  await ctx.close();
}

console.log('--- marcare cu poziție, fără poziție, ștergere');
{
  const {ctx, p, errs} = await open();
  await p.selectOption('#gdTarget', {label: (await p.$$eval('#gdTarget option', o => o.map(x => x.textContent))).find(x => /Pătlagină/.test(x))});
  await p.fill('#gdLabel', 'Poteca <b>x</b>');
  await p.click('#gdMark'); await p.waitForTimeout(400);
  let s = await stops(p);
  t('un punct salvat cu poziție', s.length === 1 && s[0].la === 45.38 && s[0].lo === 26.4, s);
  t('numele fără < >', s[0].lb === 'Poteca bx/b'.replace('bx/b', 'bxb') || !/[<>]/.test(s[0].lb), s[0].lb);
  t('acuratețea se salvează', s[0].ac === 8);
  t('punctul apare în listă cu „poziție salvată”', /poziție salvată/.test(await p.textContent('#gdList')));
  t('HTML-ul din nume nu devine element', (await p.$$('#gdList b')).length === 0);
  await p.selectOption('#gdTarget', 'fosile'); await p.fill('#gdLabel', ''); await p.click('#gdAdd');
  s = await stops(p);
  t('al doilea punct fără poziție (nume din fișă)', s.length === 2 && s[1].la === null && /fără poziție/.test(await p.textContent('#gdList')));
  await p.click('#gdList li:first-child .mini-btn:last-child'); await p.waitForTimeout(100);
  t('ștergerea unui punct', (await stops(p)).length === 1);
  t('stocare cu prefixul urme.', await p.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('urme.')).includes('urme.guide')));
  t('fără erori', errs.length === 0, errs);
  await ctx.close();
}

console.log('--- poziție refuzată');
{
  const {ctx, p} = await open({permissions: []});
  await p.click('#gdMark'); await p.waitForTimeout(500);
  t('mesaj de refuz, niciun punct adăugat', /nu e permisă|nu este permisă/.test(await p.textContent('#gdStatus')) && (await stops(p)).length === 0, await p.textContent('#gdStatus'));
  await p.click('#gdAdd');
  t('adăugarea fără poziție funcționează oricum', (await stops(p)).length === 1);
  await ctx.close();
}

console.log('--- ghid GPS: anunț de apropiere');
{
  const {ctx, p, errs} = await open();
  await p.selectOption('#gdTarget', 'chihlimbar'); await p.fill('#gdLabel', 'Chihlimbar'); await p.click('#gdMark'); await p.waitForTimeout(300);
  await ctx.setGeolocation(B2);
  await p.selectOption('#gdTarget', 'alunis'); await p.fill('#gdLabel', 'Biserica'); await p.click('#gdMark'); await p.waitForTimeout(300);
  t('două puncte marcate', (await stops(p)).length === 2);
  await ctx.setGeolocation({latitude: 45.50, longitude: 26.50, accuracy: 10});
  await p.click('#gdWatch'); await p.waitForTimeout(700);
  t('butonul devine „Oprește”', /Oprește/.test(await p.textContent('#gdWatch')));
  t('departe: niciun anunț', await p.$eval('#gdNear', e => e.hidden));
  await ctx.setGeolocation({latitude: 45.38010, longitude: 26.40010, accuracy: 6}); await p.waitForFunction(() => !document.getElementById('gdNear').hidden, null, {timeout: 8000}).catch(() => {});
  t('aproape de „Chihlimbar”: anunț cu distanța', !(await p.$eval('#gdNear', e => e.hidden)) && /Chihlimbar/.test(await p.textContent('#gdNearTxt')), await p.textContent('#gdNearTxt'));
  t('punctul e marcat parcurs', (await stops(p))[0].v === 1);
  await p.click('#gdNearOpen'); await p.waitForTimeout(300);
  t('fișa se deschide (focus pe titlul secțiunii Chihlimbar)', await p.evaluate(() => document.activeElement && document.activeElement.closest('#chihlimbar') !== null));
  await ctx.setGeolocation({latitude: 45.38010, longitude: 26.40012, accuracy: 6}); await p.waitForTimeout(600);
  t('nu se repetă anunțul pentru un punct deja parcurs', (await stops(p)).filter(x => x.v).length === 1);
  await ctx.setGeolocation({latitude: 45.39005, longitude: 26.41005, accuracy: 6}); await p.waitForFunction(() => /Biserica/.test(document.getElementById('gdNearTxt').textContent), null, {timeout: 8000}).catch(() => {});
  t('al doilea punct anunțat (Biserica)', /Biserica/.test(await p.textContent('#gdNearTxt')) && (await stops(p)).every(x => x.v === 1));
  await p.click('#gdWatch');
  t('oprire: mesaj și buton „Pornește”', /oprit/.test(await p.textContent('#gdStatus')) && /Pornește/.test(await p.textContent('#gdWatch')));
  await p.click('#gdReset');
  t('reia parcursul: nimic parcurs', (await stops(p)).every(x => x.v === 0));
  t('fără erori', errs.length === 0, errs);
  await ctx.close();
}

console.log('--- raza de apropiere');
{
  const {ctx, p} = await open();
  await p.selectOption('#gdRadius', '25'); await p.click('#gdMark'); await p.waitForTimeout(300);
  await ctx.setGeolocation({latitude: 45.3804, longitude: 26.4000, accuracy: 5});  // ~44 m spre nord
  await p.click('#gdWatch'); await p.waitForTimeout(1500);
  t('44 m > raza de 25 m: fără anunț', await p.$eval('#gdNear', e => e.hidden));
  await ctx.setGeolocation({latitude: 45.38015, longitude: 26.4000, accuracy: 5});  // ~17 m
  await p.waitForFunction(() => !document.getElementById('gdNear').hidden, null, {timeout: 8000}).catch(() => {});
  t('17 m < raza de 25 m: anunț', !(await p.$eval('#gdNear', e => e.hidden)));
  await ctx.close();
}

console.log('--- mod manual (fără GPS)');
{
  const {ctx, p} = await open({permissions: []});
  for (const id of ['padurea', 'plante', 'fosile']) { await p.selectOption('#gdTarget', id === 'plante' ? {index: 4} : id); await p.click('#gdAdd'); }
  await p.click('#gdNext');
  t('oprirea 1 din 3', /Oprirea 1 din 3/.test(await p.textContent('#gdStatus')), await p.textContent('#gdStatus'));
  t('focus pe fișa deschisă', await p.evaluate(() => document.activeElement && document.activeElement.closest('#padurea') !== null));
  await p.click('#gdNext'); await p.click('#gdNext');
  t('oprirea 3 din 3', /Oprirea 3 din 3/.test(await p.textContent('#gdStatus')));
  await p.click('#gdNext');
  t('după ultima: mesaj de final', /Toate punctele/.test(await p.textContent('#gdStatus')));
  await p.click('#gdClear');
  t('ștergere totală', (await stops(p)).length === 0);
  await ctx.close();
}

console.log('--- persistență și date ostile');
{
  const hostile = JSON.stringify({v: 1, stops: [
    {tg: 'fosile', lb: '<img src=x onerror=alert(1)>' + 'z'.repeat(200), la: 45.4, lo: 26.4, ac: 5, r: 50, v: 0},
    {tg: 'inexistent', lb: 'x', la: 1, lo: 1}, {tg: 'padurea', la: 999, lo: 5, r: 7}, null, 'text', {tg: 5},
    {tg: 'alunis', la: 'abc', lo: {}, r: 100}
  ].concat(Array.from({length: 60}, () => ({tg: 'padurea', la: 45, lo: 26})))});
  const {ctx, p, errs} = await open({}, `try{localStorage.setItem('urme.guide', ${JSON.stringify(hostile)})}catch(e){}`);
  const s = await stops(p);
  await p.click('#gdAdd'); // salvează starea curentă
  const s2 = await stops(p);
  t('import ostil: maximum 30, intrările invalide omise', s2.length <= 30 && s2.every(x => ['padurea', 'fosile', 'alunis'].includes(x.tg)), s2.length);
  t('nume tăiat la 60 și fără < >', s2[0].lb.length <= 60 && !/[<>]/.test(s2[0].lb));
  t('latitudine 999 respinsă (fără poziție)', s2.filter(x => x.tg === 'padurea')[0].la === null);
  t('HTML ostil nu devine element, fără alert', (await p.$$('#gdList img')).length === 0 && errs.length === 0, errs);
  await ctx.close();
  const c2 = await open({}, `try{localStorage.setItem('urme.guide','{coruptă')}catch(e){}`);
  t('stocare coruptă: pagina pornește', /Niciun punct/.test(await c2.p.textContent('#gdList')) && c2.errs.length === 0, c2.errs);
  await c2.ctx.close();
  const c3 = await open();
  await c3.p.click('#gdAdd'); await c3.p.goto(FILE); await c3.p.waitForTimeout(500);
  t('după reîncărcare punctul revine', (await stops(c3.p)).length === 1 && !/Niciun punct/.test(await c3.p.textContent('#gdList')));
  await c3.ctx.close();
}

console.log('--- limbi și avertismente');
{
  const {ctx, p} = await open();
  const dict = await p.evaluate(() => JSON.parse(document.getElementById('urme-i18n').textContent));
  const keys = Object.keys(dict.ro).filter(k => k.startsWith('gd.'));
  t('cheile gd.* există în toate cele 8 limbi', keys.length >= 30 && ['ro', 'en', 'fr', 'it', 'es', 'pt', 'de', 'hu'].every(l => keys.every(k => dict[l][k] && dict[l][k].length > 1)), keys.length);
  for (const l of ['en', 'fr', 'it', 'es', 'pt', 'de', 'hu']) {
    await p.selectOption('#langSel', l); await p.waitForTimeout(150);
    const txt = await p.$eval('#ghid', e => e.textContent);
    t('limba ' + l + ': secțiunea nu a rămas în română', !/Marchează poziția|Fișa de legat|Următoarea oprire|Niciun punct/.test(txt) && txt.length > 400);
    t('limba ' + l + ': GPS-ul din siguranță nu mai spune „nu folosește GPS”', !/nu folosește GPS|does not use GPS/.test(await p.$eval('[data-i18n="safety.5"]', e => e.textContent)));
  }
  await p.selectOption('#langSel', 'ro');
  const sf = await p.$eval('[data-i18n="safety.5"]', e => e.textContent);
  t('avertismentul din siguranță actualizat (ro): citește poziția doar la cerere', /doar dacă apeși/.test(sf) && /nu se trimite nicăieri/.test(sf));
  t('avertisment în secțiune: informativ, neoficial', /neoficial/.test(await p.$eval('#ghid .small-note', e => e.textContent)));
  await ctx.close();
}

console.log('--- accesibilitate, mobil');
{
  const {ctx, p} = await open({viewport: {width: 360, height: 800}});
  await p.click('#gdAdd'); await p.selectOption('#gdTarget', 'padurea'); await p.fill('#gdLabel', 'x'.repeat(60)); await p.click('#gdAdd');
  t('fără depășire orizontală la 360 px', await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth) <= 1);
  if (AXE) {
    await p.evaluate(fs.readFileSync(AXE, 'utf8') + '\n;0');
    const ax = await p.evaluate(async () => (await window.axe.run(document.getElementById('ghid'), {resultTypes: ['violations']})).violations.map(v => v.id + ':' + v.nodes.length));
    t('axe 0 violări în Ghid pe teren', ax.length === 0, ax);
  }
  await ctx.close();
  const m = await open({hasTouch: true, isMobile: true});
  const sizes = await m.p.evaluate(() => ['#gdMark', '#gdAdd', '#gdWatch', '#gdNext', '#gdTarget', '#gdRadius'].map(s => [s, document.querySelector(s).getBoundingClientRect().height]));
  t('ținte tactile ≥ 44 px', sizes.every(([, h]) => h >= 43.5), sizes);
  await m.ctx.close();
}
await b.close(); console.log(`\n${ok} ok / ${bad} eșuate`); process.exit(bad ? 1 : 0);
