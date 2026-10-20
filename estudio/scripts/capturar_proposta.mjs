// Tira as telas da proposta de estilo (estudio/referencias/proposta-estilo.html).
// Uso: node estudio/scripts/capturar_proposta.mjs
// Saída: estudio/referencias/proposta-estilo-*.png e um relatório de console no terminal.
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const ESTUDIO = path.resolve(AQUI, '..');
const require = createRequire(path.join(ESTUDIO, 'ferramentas', 'package.json'));
const { chromium } = require('playwright');

const REF = path.join(ESTUDIO, 'referencias');
const URL_BASE = pathToFileURL(path.join(REF, 'proposta-estilo.html')).href;
const saida = (n) => path.join(REF, `proposta-estilo-${n}.png`);

const browser = await chromium.launch({ channel: 'chrome' });
const erros = [];

async function abre(viewport, query = '', extra = {}) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, ...extra });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') erros.push(`${query || '/'}: ${m.text()}`); });
  page.on('pageerror', (e) => erros.push(`${query || '/'}: ${e.message}`));
  await page.goto(URL_BASE + query);
  await page.waitForFunction(() => window.__pronto === true, null, { timeout: 15000 });
  await page.waitForTimeout(300);
  return { ctx, page };
}

// 1. Página inteira e seções, a 1440 de largura, com a cena viva parada no quadro final.
{
  const { ctx, page } = await abre({ width: 1440, height: 900 }, '', { reducedMotion: 'reduce' });
  const fonte = await page.evaluate(() => document.fonts.check('700 20px Manrope'));
  console.log('Manrope carregada:', fonte);
  await page.screenshot({ path: saida('pagina'), fullPage: true });
  for (const id of ['quadro', 'tipografia', 'cor', 'movimento', 'painel']) {
    await page.locator('#' + id).screenshot({ path: saida(id) });
  }
  await ctx.close();
}

// 2. O quadro do filme em tamanho real, 1920x1080: final, com grade e no meio do contador.
for (const [nome, q] of [['quadro-1920', '?quadro=1'], ['quadro-1920-grade', '?quadro=1&grade=1'], ['quadro-1920-q146', '?quadro=1&q=146'], ['quadro-1920-q304', '?quadro=1&q=304']]) {
  const { ctx, page } = await abre({ width: 1920, height: 1080 }, q);
  await page.screenshot({ path: saida(nome) });
  await ctx.close();
}

await browser.close();
console.log(erros.length ? 'Console:\n' + erros.join('\n') : 'Console sem erros nem avisos.');
