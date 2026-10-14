// Teste pentru funcțiile din v1.1.0: harta cerului (efemeride locale), lista de echipament salvată, fișa de teren tipărită, kit.
// Rulare: node tests/fff-r8.test.mjs   (Playwright din /opt/node-tools, Chromium din /opt/pw-browsers; rețea blocată)
import {createRequire} from 'module'; import fs from 'node:fs'; import path from 'node:path'; import {fileURLToPath} from 'node:url';
const require = createRequire('/opt/node-tools/package.json'); const {chromium} = require('playwright');
const HERE = path.dirname(fileURLToPath(import.meta.url)); const FILE = 'file://' + path.join(HERE, '..', 'index.html');
const AXE = process.env.FFF_AXE || '/tmp/claude-0/-home-claude/78529928-3825-51c3-b9bd-0e81655ab6bc/scratchpad/sweep/node_modules/axe-core/axe.min.js';
let ok = 0, bad = 0; const t = (n, c, x) => { if (c) { ok++; console.log('  ok  ', n); } else { bad++; console.log('  FAIL', n, x ?? ''); } };
const b = await chromium.launch({executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox']});
async function mk(w = 1280, h = 800, scheme = 'light') {
  const ctx = await b.newContext({viewport: {width: w, height: h}, colorScheme: scheme, acceptDownloads: true});
  const net = []; await ctx.route(/^https?:/, r => { net.push(r.request().url()); r.abort(); });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' || /Content Security Policy/.test(m.text())) errs.push(m.text()); });
  return {ctx, p, errs, net};
}
const axeSrc = fs.readFileSync(AXE, 'utf8');
const runAxe = async p => { if (!(await p.evaluate(() => !!window.axe))) await p.evaluate(axeSrc + '\n;0'); return p.evaluate(async () => (await axe.run(document, {resultTypes: ['violations']})).violations.map(v => v.id + ':' + v.nodes.map(n => n.target.join(' ')).join(',').slice(0, 120))); };
const setSky = async (p, d, tm) => { await p.fill('#skyDate', d); await p.fill('#skyTime', tm); await p.waitForTimeout(250); };
const pixels = p => p.evaluate(() => { const c = document.getElementById('skyCanvas'), x = c.getContext('2d'), im = x.getImageData(0, 0, c.width, c.height).data; let n = 0, bright = 0, sum = 0; for (let i = 0; i < im.length; i += 4) if (im[i + 3] > 0) { n++; sum += im[i] + im[i + 1] + im[i + 2]; if (im[i] + im[i + 1] + im[i + 2] > 600) bright++; } return {n, bright, sum, w: c.width}; });
const cell = (p, row, col) => p.evaluate(([r, c]) => { const tr = [...document.querySelectorAll('#skyTable tbody tr')].find(x => x.firstElementChild.textContent === r); return tr ? tr.children[c].textContent : null; }, [row, col]);

for (const scheme of ['light', 'dark']) {
  console.log('--- ' + scheme);
  const {ctx, p, errs, net} = await mk(1280, 800, scheme);
  await p.goto(FILE); await p.waitForTimeout(3600);
  t('pornire fără erori/CSP', errs.length === 0, errs); t('0 cereri de rețea', net.length === 0, net);
  t('harta cerului vizibilă (modulele ephem încărcate)', await p.isVisible('#cerul') && await p.evaluate(() => !!(FFF.ephem && FFF.ephem.stars)));
  const px = await pixels(p); t('canvas desenat (cerc, stele)', px.n > 20000 && px.bright > 200, JSON.stringify(px));
  // fapte astronomice verificabile independent
  await setSky(p, '2026-10-26', '22:00');
  const ill = parseInt(/(\d+)% luminată/.exec(await cell(p, 'Lună', 3))[1], 10); t('lună plină la 26 oct. 2026 (≥ 95% luminată)', ill >= 95, await cell(p, 'Lună', 3));
  await setSky(p, '2027-08-02', '12:00');
  const ill2 = parseInt(/(\d+)% luminată/.exec(await cell(p, 'Lună', 3))[1], 10); t('lună nouă la 2 aug. 2027 (≤ 3% luminată; ziua eclipsei)', ill2 <= 3, await cell(p, 'Lună', 3));
  // Soarele la apusul din planificator (algoritm NOAA independent): altitudinea ≈ -0,8°…0° (refracție)
  const sunsetAlt = async (d) => {
    await p.fill('#planDate', d); await p.waitForTimeout(200);
    const m = /apus (\d\d):(\d\d)/.exec(await p.textContent('#planOut')); await setSky(p, d, m[1] + ':' + m[2]);
    return parseFloat(await cell(p, 'Soare', 1));
  };
  for (const d of ['2026-10-14', '2026-06-21', '2026-12-21', '2027-03-20']) { const a = await sunsetAlt(d); t('Soarele la apusul din planificator, ' + d + ': altitudine în [-1,3; +0,7]°', a > -1.3 && a < 0.7, a); }
  // la 12:00 în iunie Soarele e sus (≈ 65°), noaptea sub orizont
  await setSky(p, '2026-06-21', '13:00'); t('Soare la prânz de solstițiu: altitudine 60–70° (se cunoaște ≈ 68°)', (a => a > 60 && a < 70)(parseFloat(await cell(p, 'Soare', 1))), await cell(p, 'Soare', 1));
  await setSky(p, '2026-10-14', '23:30'); t('Soare sub orizont la 23:30', /sub orizont/.test(await cell(p, 'Soare', 3)));
  const txt = await p.textContent('#skyOut'); t('text: noapte astronomică / Lună / "Cer întunecat"', /noapte astronomică/.test(txt) && /Luna răsare la \d\d:\d\d/.test(txt) && /Cer întunecat/.test(txt), txt);
  // fusul: ora de iarnă vs vară
  await setSky(p, '2026-12-21', '12:00'); t('iarna: UTC+2', /UTC\+2/.test(await p.textContent('#skyOut')));
  await setSky(p, '2026-07-21', '12:00'); t('vara: UTC+3', /UTC\+3/.test(await p.textContent('#skyOut')));
  // Polaris: la nord, altitudine ≈ latitudine
  const pol = await p.evaluate(() => { const s = FFF.ephem.stars.find('Polaris')[0].star, jd = FFF.ephem.jdFromDate(new Date(Date.UTC(2026, 9, 14, 20))), pp = FFF.ephem.stars.position(s, jd), h = FFF.ephem.toHorizontal(pp.ra, pp.dec, jd, 45.38, 26.4, {refraction: false}); return h; });
  t('Polaris: altitudine ≈ 45,4° ± 1,5° și azimut ≈ nord', Math.abs(pol.alt - 45.38) < 1.5 && (pol.az < 3 || pol.az > 357), JSON.stringify(pol));
  await setSky(p, '2026-10-14', '22:00');
  const base = await pixels(p); await p.uncheck('#skyLines'); await p.waitForTimeout(250); const noLines = await pixels(p);
  t('debifare „Figuri de constelații” schimbă desenul', noLines.sum < base.sum, JSON.stringify([base.sum, noLines.sum]));
  t('aria-label al canvasului descrie harta', /stele deasupra orizontului/.test(await p.getAttribute('#skyCanvas', 'aria-label')));
  await p.click('#skyNow'); await p.waitForTimeout(200); t('buton „Acum” completează data de azi', (await p.inputValue('#skyDate')).length === 10);
  // preferințe: persistă după reîncărcare
  await p.reload(); await p.waitForTimeout(1500); t('preferința „figuri” (debifat) se păstrează', !(await p.isChecked('#skyLines')));
  // checklist: persistă
  await p.check('#g2'); await p.check('#g5'); await p.waitForTimeout(100);
  await p.reload(); await p.waitForTimeout(1500);
  t('bifele echipamentului se păstrează după reîncărcare', (await p.isChecked('#g2')) && (await p.isChecked('#g5')) && !(await p.isChecked('#g1')) && /2 din 9/.test(await p.textContent('#gearProgress')), await p.textContent('#gearProgress'));
  // copia de siguranță a kitului conține bifele
  const bun = await p.evaluate(async () => { const x = await FFF.bundle.build(); return x; });
  const bj = typeof bun === 'string' ? JSON.parse(bun) : (bun.bundle || bun);
  t('pachetul .fff.json conține urme.gear și urme.sky', bj && bj.data && 'urme.gear' in bj.data && 'urme.sky' in bj.data, JSON.stringify(bj).slice(0, 200));
  // fișa de teren
  t('buton fișă vizibil', await p.isVisible('#printSheet'));
  await p.evaluate(() => { window.print = () => { window.__printed = (window.__printed || 0) + 1; }; });
  await p.click('#printSheet'); await p.waitForTimeout(400);
  const fz = await p.evaluate(() => ({t: document.getElementById('fisa').innerText || document.getElementById('fisa').textContent, qr: !!document.querySelector('#fisa svg'), pr: window.__printed || 0}));
  t('fișă: titlu, 112, bifele ☒/☐, QR, apel print', /fișă de teren/.test(fz.t) && /112/.test(fz.t) && (fz.t.match(/☒/g) || []).length === 2 && (fz.t.match(/☐/g) || []).length === 7 && fz.qr && fz.pr === 1, JSON.stringify(fz).slice(0, 300));
  await p.emulateMedia({media: 'print'});
  const vis = await p.evaluate(() => ({fisa: getComputedStyle(document.getElementById('fisa')).display, main: getComputedStyle(document.getElementById('main')).display, bg: getComputedStyle(document.getElementById('fisa')).backgroundColor}));
  t('print: doar fișa e vizibilă', vis.fisa === 'block' && vis.main === 'none' && vis.bg === 'rgb(255, 255, 255)', JSON.stringify(vis));
  const pdf = await p.pdf({}); t('print: PDF generat, 1 pagină', pdf.length > 1500 && (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length === 1, (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length);
  await p.emulateMedia({media: 'screen'}); await p.evaluate(() => document.body.classList.remove('print-sheet'));
  // axe
  t('axe 0 violări (pagină)', (await runAxe(p)).length === 0, await runAxe(p));
  await p.evaluate(() => document.getElementById('cerul').scrollIntoView()); await p.waitForTimeout(200);
  await p.click('#app-version'); await p.waitForTimeout(500);
  t('dialog Transparență: listă cu urme.gear', /urme\.gear/.test(await p.evaluate(() => document.querySelector('dialog.fff-dlg[open]')?.textContent || '')));
  t('axe 0 violări cu dialogul Transparență', (await runAxe(p)).length === 0, await runAxe(p));
  await p.keyboard.press('Escape');
  t('fără erori pe parcurs', errs.length === 0, errs); t('0 cereri de rețea', net.length === 0, net);
  await ctx.close();
}
{ console.log('--- 360 px');
  const m = await mk(360, 740, 'dark'); await m.p.goto(FILE); await m.p.waitForTimeout(3600);
  t('360: fără depășire orizontală', await m.p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), await m.p.evaluate(() => document.documentElement.scrollWidth));
  await m.p.evaluate(() => document.getElementById('cerul').scrollIntoView()); await m.p.waitForTimeout(300);
  const cw = await m.p.evaluate(() => document.getElementById('skyCanvas').getBoundingClientRect().width); t('360: canvasul încape (≤ 330 px)', cw > 200 && cw <= 330, cw);
  t('360: tabelul nu depășește ecranul', await m.p.evaluate(() => document.getElementById('skyTable').getBoundingClientRect().right <= innerWidth + 1));
  t('360: axe 0 violări', (await runAxe(m.p)).length === 0, await runAxe(m.p)); t('360: fără erori', m.errs.length === 0, m.errs); await m.ctx.close(); }
{ console.log('--- fără kit');
  const m = await mk(); const html = fs.readFileSync(path.join(HERE, '..', 'index.html'), 'utf8').replace(/<!--fff:kit:start[\s\S]*?<!--fff:kit:end-->/, '');
  const tmp = path.join(HERE, '_nokit.tmp.html'); fs.writeFileSync(tmp, html); await m.p.goto('file://' + tmp); await m.p.waitForTimeout(1500);
  t('fără kit: harta ascunsă, fără erori; bifele funcționează', m.errs.length === 0 && !(await m.p.isVisible('#cerul')), m.errs);
  await m.p.check('#g1'); t('fără kit: contor bife', /1 din 9/.test(await m.p.textContent('#gearProgress')));
  await m.ctx.close(); fs.unlinkSync(tmp); }
await b.close();
console.log(`\n${ok} ok / ${bad} eșuate`); process.exit(bad ? 1 : 0);
