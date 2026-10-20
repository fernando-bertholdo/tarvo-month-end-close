// Grava as cenas animadas das referências de movimento (Diretor de arte, STYLE.md).
// Uso: node estudio/scripts/gravar_referencias.mjs [ai-services|buser|comp ...]
// Saída: estudio/referencias/<ref>/gravacao.webm + contexto.json (caixas para recorte,
// marcas de tempo e o que o CSS declara, lido do próprio navegador).
// Playwright vem de estudio/ferramentas (Chrome do sistema, viewport 1440x900).
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const ESTUDIO = path.resolve(AQUI, '..');
// recordVideo precisa do ffmpeg do Playwright; ele fica em ferramentas/ms-playwright (ignorado no git).
process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.join(ESTUDIO, 'ferramentas', 'ms-playwright');
const require = createRequire(path.join(ESTUDIO, 'ferramentas', 'package.json'));
const { chromium } = require('playwright');

const REF = path.join(ESTUDIO, 'referencias');
const VIEW = { width: 1440, height: 900 };

async function gravar(nome, roteiro) {
  const dir = path.join(REF, nome);
  const tmp = path.join(dir, '_tmp');
  fs.mkdirSync(tmp, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome' });
  const ctx = await browser.newContext({
    viewport: VIEW, deviceScaleFactor: 1, recordVideo: { dir: tmp, size: VIEW },
  });
  const page = await ctx.newPage();
  const t0 = Date.now();
  const marcas = [];
  const marca = (rotulo, extra = {}) => marcas.push({ rotulo, t_ms: Date.now() - t0, ...extra });
  const contexto = { url: null, gravado_em_utc: new Date().toISOString(), viewport: VIEW, marcas };
  await roteiro(page, marca, contexto);
  const video = page.video();
  await ctx.close();
  await browser.close();
  fs.renameSync(await video.path(), path.join(dir, 'gravacao.webm'));
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.writeFileSync(path.join(dir, 'contexto.json'), JSON.stringify(contexto, null, 2));
  console.log(nome, 'ok:', marcas.length, 'marcas');
}

const caixa = (page, sel) => page.evaluate((sel) => {
  const e = document.querySelector(sel); if (!e) return null;
  const b = e.getBoundingClientRect();
  return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) };
}, sel);

// ---------------------------------------------------------------- ai-services
// Cena do hero "Uma política, de ponta a ponta": 3 cenários (Caixa, Provisão, Receita)
// trocados pelas abas. Gravamos o Caixa ao carregar e os outros dois pelo clique.
async function aiServices(page, marca, ctx) {
  ctx.url = 'https://www.barte.com/ai-services';
  await page.addInitScript(() => {
    window.__trocas = [];
    const obs = new MutationObserver((ms) => {
      for (const m of ms) {
        const el = m.target;
        if (m.attributeName !== 'class' || !el.classList) continue;
        if (el.classList.contains('sset') || el.classList.contains('steps') || el.classList.contains('padwrap')) {
          window.__trocas.push({ t: Math.round(performance.now()), cls: el.className, scn: el.dataset.scn || null });
        }
      }
    });
    document.addEventListener('DOMContentLoaded', () => obs.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] }));
  });
  marca('goto');
  await page.goto(ctx.url, { waitUntil: 'load', timeout: 90000 });
  marca('load');
  ctx.caixa_cena = await caixa(page, '.hx .padwrap');
  ctx.caixa_passos = await caixa(page, '.hx .steps');
  // A cena toca uma vez e segura o estado final (não troca de cenário sozinha em 45 s,
  // conferido na primeira gravação). Os outros dois cenários entram pelo clique nas abas.
  await page.waitForTimeout(16000);
  for (const aba of ['Provisão', 'Receita']) {
    marca('clique-' + aba);
    await page.locator('.hx .scnbar').getByText(aba, { exact: true }).click();
    await page.waitForTimeout(15000);
  }
  marca('fim');
  ctx.trocas_de_classe = await page.evaluate(() => window.__trocas);
  ctx.nav_start_vs_t0_ms = await page.evaluate(() => Math.round(performance.timeOrigin));
  ctx.palavras_por_cenario = await page.evaluate(() => [...document.querySelectorAll('.hx .sset')].map((s) => ({
    scn: s.dataset.scn,
    texto: s.innerText.replace(/\s+/g, ' ').trim(),
    palavras: s.innerText.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length,
  })));
}

// ---------------------------------------------------------------- Buser
// Seção #fluxos: "sem agente" (tela com cursor falso, ciclo de 12 s) e, depois do
// interruptor, "com agente" (botão afunda, carregando, resultados; ciclo de 8 s).
async function buser(page, marca, ctx) {
  ctx.url = 'https://mktbarte.github.io/cases/case-buser.html';
  ctx.nota = 'O case Buser é servido em barte.com/cases/buser por um iframe que aponta para esta URL.';
  marca('goto');
  await page.goto(ctx.url, { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(1500);
  await page.evaluate(() => document.getElementById('fluxos').scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.waitForTimeout(1200);
  marca('fluxos-visivel');
  ctx.caixa_fluxos = await caixa(page, '#fluxos');
  ctx.caixa_tela_off = await caixa(page, '#fluxos .f-off .tela');
  ctx.caixa_controle = await caixa(page, '#fl-ctl');
  await page.waitForTimeout(25000);
  marca('clique-interruptor');
  await page.click('#fl-sw');
  await page.waitForTimeout(600);
  ctx.caixa_tela_on = await caixa(page, '#fluxos .f-on .tela');
  await page.waitForTimeout(17000);
  marca('fim');
  ctx.animacoes_declaradas = await page.evaluate(() => {
    const out = [];
    for (const a of document.getAnimations()) {
      const t = a.effect && a.effect.target; if (!t || !t.closest || !t.closest('#fluxos')) continue;
      const tim = a.effect.getComputedTiming();
      const cls = (t.getAttribute('class') || '') + (t.closest('.f-on') ? ' [com agente]' : ' [sem agente]');
      out.push({ nome: a.animationName || null, alvo: cls, duracao_ms: tim.duration, atraso_ms: tim.delay, curva: tim.easing,
        quadros_chave: a.effect.getKeyframes().map((k) => ({ offset: k.offset, easing: k.easing, opacity: k.opacity, transform: k.transform, offsetDistance: k.offsetDistance })) });
    }
    const vistos = new Set();
    return out.filter((o) => { const k = o.nome + o.alvo + o.atraso_ms; if (vistos.has(k)) return false; vistos.add(k); return true; });
  });
  ctx.textos = await page.evaluate(() => ({
    off: document.querySelector('#fluxos .f-off').innerText.replace(/\s+/g, ' ').trim(),
    on: document.querySelector('#fluxos .f-on').innerText.replace(/\s+/g, ' ').trim(),
  }));
}

// ---------------------------------------------------------------- Comp
// Palco #palco dentro do #trilho: o P&L se monta em 4 atos guiados pela rolagem.
// Rolamos em saltos e esperamos cada ato assentar. O ato 1 é armado no carregamento,
// então o reiniciamos com a própria lógica da página (tira p1..p4 e dispara scroll).
async function comp(page, marca, ctx) {
  ctx.url = 'https://mktbarte.github.io/cases/case-comp.html';
  ctx.nota = 'O case Comp é servido em barte.com/cases/comp por um iframe que aponta para esta URL.';
  marca('goto');
  await page.goto(ctx.url, { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(1500);
  const geo = await page.evaluate(() => {
    const t = document.getElementById('trilho'); const p = document.getElementById('palco');
    const top = t.getBoundingClientRect().top + scrollY;
    return { top, curso: t.offsetHeight - p.offsetHeight };
  });
  ctx.trilho = geo;
  const vaiPara = (frac) => page.evaluate(({ y }) => { window.scrollTo({ top: y, behavior: 'instant' }); window.dispatchEvent(new Event('scroll')); }, { y: Math.round(geo.top + geo.curso * frac) });
  await vaiPara(0.02);
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    const p = document.getElementById('palco');
    p.dataset.ato = '0'; ['p1', 'p2', 'p3', 'p4'].forEach((c) => p.classList.remove(c));
  });
  await page.waitForTimeout(1500);
  ctx.caixa_compo = await caixa(page, '#palco .compo');
  ctx.caixa_palco = await caixa(page, '#palco');
  marca('ato-1');
  await page.evaluate(() => window.dispatchEvent(new Event('scroll')));
  await page.waitForTimeout(4500);
  // O salto de rolagem faz o screencast perder quadros; por isso, em cada ato, rolamos,
  // esperamos assentar, desarmamos só aquele ato e o rearmamos pela lógica da página,
  // já parados. A transição gravada é a do rearme.
  for (const [n, frac] of [[2, 0.30], [3, 0.55], [4, 0.80]]) {
    marca('rola-ato-' + n);
    await vaiPara(frac);
    await page.waitForTimeout(2500);
    await page.evaluate((n) => { const p = document.getElementById('palco'); p.dataset.ato = String(n - 1); p.classList.remove('p' + n); }, n);
    await page.waitForTimeout(1500);
    marca('ato-' + n);
    await page.evaluate(() => window.dispatchEvent(new Event('scroll')));
    await page.waitForTimeout(n === 4 ? 7000 : 4500);
  }
  marca('fim');
  ctx.transicoes_declaradas = await page.evaluate(() => {
    const pega = (sel) => [...document.querySelectorAll(sel)].map((e) => {
      const s = getComputedStyle(e);
      return { sel, prop: s.transitionProperty, duracao: s.transitionDuration, curva: s.transitionTimingFunction, atraso: s.transitionDelay,
        ad: s.getPropertyValue('--ad').trim(), ld: s.getPropertyValue('--ld').trim(), texto: (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80) };
    });
    return [...pega('#palco .agrupo'), ...pega('#palco .orq'), ...pega('#palco .painelx'), ...pega('#palco .linha-pnl'), ...pega('#palco .fecho'), ...pega('#palco .passo')];
  });
}

const TODAS = { 'ai-services': aiServices, buser, comp };
const pedidas = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(TODAS);
for (const n of pedidas) await gravar(n, TODAS[n]);
