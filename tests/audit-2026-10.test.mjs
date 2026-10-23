// URME — regresii din auditul adversarial (octombrie 2026): ore după miezul nopții în planificator, ținte tactile.
// Rulare: node tests/audit-2026-10.test.mjs   (Playwright din /opt/node-tools, Chromium din /opt/pw-browsers; rețea blocată)
import {createRequire} from 'module'; import path from 'node:path'; import {fileURLToPath} from 'node:url';
const require = createRequire('/opt/node-tools/package.json'); const {chromium} = require('playwright');
const FILE = 'file://' + path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'index.html');
let ok = 0, bad = 0; const t = (n, c, x) => { if (c) { ok++; console.log('  ok  ', n); } else { bad++; console.log('  FAIL', n, x ?? ''); } };
const b = await chromium.launch({executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox']});
async function open(opts = {}) {
  const ctx = await b.newContext({viewport: {width: 390, height: 800}, locale: 'ro-RO', ...opts});
  await ctx.route(/^https?:/, r => r.abort());
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(FILE); await p.waitForTimeout(800); return {ctx, p, errs};
}
console.log('--- planificator: întoarcere după miezul nopții');
{
  const {ctx, p, errs} = await open();
  for (const [d, s] of [['2026-06-21', '20:00'], ['2026-12-21', '23:30'], ['2026-03-29', '22:15']]) {
    await p.fill('#planDate', d); await p.fill('#planStart', s); await p.waitForTimeout(100);
    const txt = await p.textContent('#planOut');
    const times = [...txt.matchAll(/\b(\d{2}):(\d{2})\b/g)].map(m => +m[1]);
    t(`${d} ${s}: nicio oră ≥ 24 în text`, times.length > 0 && times.every(h => h < 24), txt.slice(0, 200));
  }
  await p.fill('#planDate', '2026-06-21'); await p.fill('#planStart', '08:00'); await p.waitForTimeout(100);
  t('plecare 08:00: întoarcere 13:00–14:00 neschimbată', /13:00–14:00/.test(await p.textContent('#planOut')));
  t('fără erori', errs.length === 0, errs);
  await ctx.close();
}
console.log('--- ținte tactile (pointer: coarse)');
{
  const {ctx, p} = await open({hasTouch: true, isMobile: true});
  const sizes = await p.evaluate(() => ['#planDate', '#planStart', '#skyDate', '#skyTime', '#gearCopy', '#printSheet', '#skyNow'].map(s => { const e = document.querySelector(s); const r = e && e.getBoundingClientRect(); return [s, r ? r.height : -1]; }));
  t('butoane mici și câmpuri dată/oră ≥ 44 px', sizes.every(([, h]) => h >= 43.5), sizes.filter(([, h]) => h < 43.5));
  await ctx.close();
}
await b.close(); console.log(`\n${ok} ok / ${bad} eșuate`); process.exit(bad ? 1 : 0);
