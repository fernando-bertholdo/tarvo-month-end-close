// Captures the analyst panel (relatorio/painel.html) for the Critic: the storyboard moments,
// the whole replay at 1x as video, prefers-reduced-motion, dark theme, projection mode and the
// live mode against the real server. Also checks every key number against
// estudio/dados/fechamento.json and collects console errors.
//
// Usage, from the repository root. The live run rewrites relatorio/ and saida/ of the repository it
// serves, so from r2 on it runs against a copy (PAINEL_RAIZ_VIVO), and the frozen data stay untouched:
//     PAINEL_RAIZ_VIVO=/tmp/copia node estudio/scripts/capturar_painel.mjs --so-vivo
//     TARVO_IA_PORTA=nenhuma python3 -m src.tarvo dados
//     node estudio/scripts/capturar_painel.mjs --sem-vivo
// Flags: --so-vivo (live mode only), --sem-vivo, --sem-video, --so-video, --rodada=<r4> (the round's folder).
// Output: estudio/out/previews/painel-<rodada>/*.png, reproducao-1x.mp4, captura.json, captura-vivo.json
import { createRequire } from 'module';
import { spawn, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const ESTUDIO = path.resolve(AQUI, '..');
const RAIZ = path.resolve(ESTUDIO, '..');
const require = createRequire(path.join(ESTUDIO, 'ferramentas', 'package.json'));
const { chromium } = require('playwright');

// r4: each round keeps its screens in its own folder (out/previews/painel-<rodada>)
const RODADA = (process.argv.find((a) => a.startsWith('--rodada=')) || '--rodada=r4').split('=')[1];
const SAIDA = path.join(ESTUDIO, 'out', 'previews', 'painel-' + RODADA);
const PAINEL = pathToFileURL(path.join(RAIZ, 'relatorio', 'painel.html')).href;
const D = JSON.parse(fs.readFileSync(path.join(ESTUDIO, 'dados', 'fechamento.json'), 'utf8'));
const ARGS = new Set(process.argv.slice(2));
const PORTA = 8771;
const RAIZ_VIVO = process.env.PAINEL_RAIZ_VIVO ? path.resolve(process.env.PAINEL_RAIZ_VIVO) : RAIZ;
// Mundo Aberto (defect 03): the divergences of the merchant, from the engine output
const DIVS = fs.readFileSync(path.join(RAIZ, 'saida', 'divergencias_taxa.csv'), 'utf8').trim().split('\n').slice(1).map((l) => l.split(';'));
const MUNDO = DIVS.filter((c) => c[8] === 'Mundo Aberto');
// Notes (defect 01, r3): the running sums of the notes, in the engine's order, from the events
const NOTAS_CENTAVOS = fs.readFileSync(path.join(RAIZ, 'relatorio', 'eventos.jsonl'), 'utf8').trim().split('\n').map((l) => JSON.parse(l))
  .filter((e) => e.tipo === 'decisao' && e.resultado === 'nota').sort((a, b) => a.seq - b.seq)
  .reduce((acc, e) => { acc.push((acc.length ? acc[acc.length - 1] : 0) + Math.round(e.valor * 100)); return acc; }, []);
// the page's own source for the header: the engine's month scope (`fim.resumo.duracao_s`); the frozen
// fechamento.json of the film may come from an earlier run
const DURACAO_S = fs.readFileSync(path.join(RAIZ, 'relatorio', 'eventos.jsonl'), 'utf8').trim().split('\n').map((l) => JSON.parse(l)).filter((e) => e.tipo === 'fim')[0].resumo.duracao_s;
const QUADROS_R3 = path.join(ESTUDIO, 'reviews', 'frames', 'painel-' + RODADA);
fs.mkdirSync(SAIDA, { recursive: true });

// ---------------------------------------------------------------- expected strings (from the engine)
const F2 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const F1 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const F0 = new Intl.NumberFormat('pt-BR');
const brl = (v) => (v < 0 ? '−' : '') + 'R$ ' + F2.format(Math.abs(v));
const pct = (v) => F2.format(v) + '%';
const soma = (...vs) => Math.round(vs.reduce((a, v) => a + Math.round(v * 100), 0)) / 100;
const din = D.dinheiro_em_jogo, rota = D.rastro_um_numero, atlas = din.atlas, pend = D.pendencias;

const ESPERADO = {
  resumo: [
    brl(D.comissao.checkout), brl(D.comissao.remessa), brl(soma(D.comissao.checkout, D.comissao.remessa)),
    brl(din.taxa_acima_do_contrato.total), brl(din.taxa_acima_do_contrato.cobrar_orbe), brl(din.taxa_acima_do_contrato.contestar_ponte),
    brl(din.devolver_casa_do_estudante.valor), '≈ R$ ' + F1.format(atlas.taxa_estimada / 1000) + ' mil',
    F0.format(D.notas.quantidade) + ' notas', brl(D.notas.total_brl),
    'Financeiro ' + pend.por_dono.Financeiro, 'Comercial ' + pend.por_dono.Comercial, 'Tesouraria ' + pend.por_dono.Tesouraria,
    'Todas ' + pend.quantidade, F0.format(pend.quantidade) + ' pendências',
  ],
  rota: [
    rota.data_venda, brl(rota.valor_bruto), pct(rota.taxa_contratada_pct), pct(rota.taxa_aplicada_pct), brl(rota.diferenca_brl),
    F0.format(rota.vendas_com_divergencia) + ' operações', brl(rota.total_a_cobrar_brl), 'Decide: ' + rota.quem_decide,
    'linha ' + F0.format(rota.fontes.linha_origem.linha), rota.parcelas + ' parcelas',
  ],
  atlas: [
    brl(atlas.bruto_lancamentos), atlas.lancamentos + ' lançamentos', atlas.vendas + ' vendas', brl(atlas.taxa_estimada),
    '≈ R$ ' + F1.format(atlas.taxa_estimada / 1000) + ' mil', 'Decide: Comercial',
  ],
  mundo: [
    brl(parseFloat(MUNDO[0][6])), F0.format(MUNDO.length) + ' operações', brl(din.taxa_acima_do_contrato.contestar_ponte), 'Decide: Financeiro',
    'Valor pago pelo cliente', 'à PTAX',
  ],
  // r4: the origin strip of the first group (Rota Global), the same sale as its drawer
  faixa: [
    'Origem · ' + rota.lojista.replace(/\s+Ltda\.?$/, ''), 'Contrato', pct(rota.taxa_contratada_pct), 'A Orbe cobrou', pct(rota.taxa_aplicada_pct),
    brl(rota.diferenca_brl), 'a mais nesta venda', F2.format(rota.taxa_aplicada_pct - rota.taxa_contratada_pct) + ' ponto',
    F0.format(rota.operacoes_com_divergencia) + ' operações', brl(rota.total_a_cobrar_brl), 'a cobrar da Orbe', 'Decide: ' + rota.quem_decide,
  ],
};
// Engine language that must stay out of the main layer (it belongs to "Rastro técnico").
const PROIBIDO = [
  [/→|≤/, 'seta ou menor-igual'],
  [/\b[FL]\d{1,3}\b|\bD35\b/, 'código de regra'],
  [/\b(?:TX|AN)\d{6,}\b/, 'id de transação'],
  [/\b(?:PEN|DIV|NF|LAN|COM)-\d{4}\b/, 'id de saída'],
  [/\.(?:csv|xlsx|eml|ofx)\b/, 'nome de arquivo'],
  [/R\$ ?\d{1,3}(?:,\d{3})+\.\d{2}|\d+\.\d{2}%/, 'formato americano'],
  [/262 mil/, 'Atlas como R$ 262 mil'],
  [/(^|[\s(])-\d/, 'hífen no lugar do sinal de menos'],
  [/Para o \w+ decidir/, 'selo de dono na forma antiga'],
];

// ---------------------------------------------------------------- bookkeeping
const SO_VIVO = ARGS.has('--so-vivo'), SO_VIDEO = ARGS.has('--so-video');
// stale screens of an earlier round never mix with this one: live screens are 5x-*.png
if (!SO_VIDEO) for (const f of fs.readdirSync(SAIDA)) if (f.endsWith('.png') && (SO_VIVO ? /^5\d-/.test(f) : !/^5\d-/.test(f))) fs.rmSync(path.join(SAIDA, f));
const relato = { gerado_em: new Date().toISOString(), telas: [], console: [], numeros: [], proibido: [], rolagem_lateral: [], video: null, vivo: null, conferencia: null, contagens: [], fluxo: [] };
const words = (t) => { const w = String(t || '').split(/\s+/).filter((x) => /[0-9A-Za-zÀ-ÿ]/.test(x)); return w.length + w.filter((x) => /%$/.test(x)).length; };
const pausaRegra = (n) => Math.max(1500, 670 + 270 * n);
const browser = await chromium.launch({ channel: 'chrome' });

async function abre(nome, viewport, extra = {}, url = PAINEL) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, colorScheme: 'light', ...extra });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') relato.console.push(`${nome}: ${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => relato.console.push(`${nome}: pageerror: ${e.message}`));
  await page.goto(url);
  await page.waitForFunction(() => window.__pronto === true, null, { timeout: 20000 });
  await page.evaluate(() => document.fonts.ready);
  return { ctx, page };
}
async function foto(page, nome, descricao, opts = {}) {
  const arquivo = path.join(SAIDA, nome + '.png');
  await page.screenshot({ path: arquivo, fullPage: !!opts.inteira });
  const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth, fonte: document.fonts.check('700 20px Manrope') }));
  if (m.sw > m.iw) relato.rolagem_lateral.push(`${nome}: ${m.sw} > ${m.iw}`);
  relato.telas.push({ arquivo: path.relative(ESTUDIO, arquivo), descricao, viewport: page.viewportSize(), manrope: m.fonte });
  console.log('  ' + nome + ' · ' + descricao);
}
const normal = (t) => t.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ');
async function textoPrincipal(page, seletor = 'body') {
  return normal(await page.evaluate((sel) => {
    const raiz = document.querySelector(sel).cloneNode(true);
    raiz.querySelectorAll('.rastro, script, [hidden]').forEach((n) => n.remove());
    return raiz.innerText || raiz.textContent;
  }, seletor));
}
async function confere(page, onde, esperados, seletor) {
  const t = await textoPrincipal(page, seletor);
  for (const e of esperados) relato.numeros.push({ onde, esperado: e, ok: t.includes(normal(e)) });
}
async function semMotor(page, onde, seletor) {
  const t = await textoPrincipal(page, seletor);
  for (const [re, oque] of PROIBIDO) { const m = t.match(re); if (m) relato.proibido.push(`${onde}: ${oque} ("${m[0]}")`); }
}
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
// r3: during a real playback, every animation frame: the counts add up; a partial of the commission says
// "fechando…" and one of the notes says "emitindo…"; and no frame shows the desk (almost) empty while the
// impact has just reacted (finding 1).
const AMOSTRADOR = () => {
  const P = window.__painel, A = window.__amostra = { quadros: 0, contagem_nao_fecha: [], comissao_sem_fechando: [], notas_sem_emitindo: [], mesa_vazia_com_impacto: [], ultimo: null };
  let antes = null;
  const tick = () => {
    const rep = document.getElementById('v-rep');
    if (!rep.hidden && P.estado()) {
      const t = P.tempo(), c = P.contadores(), k = P.cartaoComissao(), n = P.cartaoNotas();
      const tb = document.getElementById('mesa-tbody'), op = tb ? +getComputedStyle(tb).opacity : 1;
      const imp = document.getElementById('ind-pend-v').textContent + '|' + ((document.querySelector('#imp-lista li') || {}).textContent || '');
      A.quadros++;
      if (c.etapa !== 1 && c.total !== c.regra + c.sinal + c.pessoa) A.contagem_nao_fecha.push([Math.round(t), c]);
      if (k && k.aberto && /R\$/.test(k.texto) && !/fechando…/.test(k.texto)) A.comissao_sem_fechando.push([Math.round(t), k.texto]);
      if (n && n.aberto && !/emitindo…/.test(n.texto)) A.notas_sem_emitindo.push([Math.round(t), n.texto]);
      if (antes && op < 0.5 && imp !== antes.imp) A.mesa_vazia_com_impacto.push([Math.round(t), +op.toFixed(2), imp.slice(0, 60)]);
      if (antes && op < 0.5 && antes.op < 0.5 && antes.mudou) A.mesa_vazia_com_impacto.push([Math.round(t), +op.toFixed(2), imp.slice(0, 60)]);
      antes = { imp, op, mudou: antes ? imp !== antes.imp : false };
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

if (!SO_VIVO && !SO_VIDEO) {
// ---------------------------------------------------------------- 1440x900
console.log('1440x900');
{
  const { ctx, page } = await abre('1440', { width: 1440, height: 900 });
  await foto(page, '01-resumo-1440', 'Resumo ao abrir');
  await confere(page, 'Resumo 1440', ESPERADO.resumo, '#v-resumo');
  await semMotor(page, 'Resumo 1440', 'body');
  await foto(page, '01b-resumo-1440-inteira', 'Resumo, página inteira', { inteira: true });
  const fechado = 'Fechado em ' + F2.format(DURACAO_S) + ' s';
  relato.numeros.push({ onde: 'Cabeçalho', esperado: fechado + ' (fim.resumo.duracao_s)', ok: normal(await page.evaluate(() => document.getElementById('estado').innerText)).includes(fechado) });
  relato.conferencia = await page.evaluate(() => window.__painel.conferencia());
  relato.pausas = await page.evaluate(() => { const a = window.__painel.auditoriaPausas(); const por = {}; a.lista.forEach((x) => { por[x.k] = (por[x.k] || 0) + x.na_tela; }); return { itens: a.itens, menor_sobra_ms: a.menor_sobra, tempo_por_tipo_ms: por, lista: a.lista }; });
  relato.reproducao_etapas_ms = await page.evaluate(() => window.__painel.debugTL().porEtapa);
  const M = await page.evaluate(() => window.__painel.marcos());
  const dur = await page.evaluate(() => window.__painel.duracao());
  const exc = M.primeira_excecao, pes = M.primeira_pessoa;
  relato.reproducao = { duracao_ms: Math.round(dur), primeira_excecao_ms: Math.round(exc), primeira_pessoa_ms: Math.round(pes), marcos: M };
  // Replay moments: the single clock is deterministic, so a seek reproduces the frame exactly.
  for (const [nome, t, desc] of [['02-rep-03s', 3000, 'Reprodução em 3 s'], ['03-rep-10s', 10000, 'Reprodução em 10 s'], ['04-rep-25s', 25000, 'Reprodução em 25 s'],
    ['05-rep-primeira-excecao', exc + 2000, 'Reprodução na primeira exceção (taxa acima do contrato)'], ['06-rep-primeira-pessoa', pes + 2000, 'Reprodução na primeira pendência para uma pessoa'],
    ['06b-rep-nota-ponte', M.nota_ponte + 2000, 'Reprodução na nota única da Ponte: uma batida só (etapa Notas)'],
    ['06c-rep-grupo-spreads', M.grupo_spreads.ultimo_item + 1500, 'Reprodução no grupo dos quatro spreads negativos (atraso de lista, uma pausa)'],
    ['06d-rep-mundo-aberto', M.primeira_excecao_remessa + 2000, 'Reprodução na primeira exceção da remessa: Mundo Aberto, com a base do spread'],
    ['07-rep-fim', dur - 400, 'Reprodução no fim (recapitulação, antes de voltar ao Resumo)']]) {
    await page.evaluate((ms) => window.__painel.seek(ms), t);
    await espera(350);
    await foto(page, nome, desc + ` (relógio ${Math.round(t)} ms)`);
    await semMotor(page, nome, '#v-rep');
    const c = await page.evaluate(() => window.__painel.contadores());
    relato.contagens.push({ tela: nome, ...c, fecha: c.etapa === 1 || c.total === c.regra + c.sinal + c.pessoa });
  }
  // Every 250 ms of the clock: the counts add up, and the commission card never shows a partial
  // without "fechando…" while a merchant of the front is still open (defect 01, r2).
  relato.varredura = await page.evaluate(([passo, somas]) => {
    const P = window.__painel, d = P.duracao(), out = { passo_ms: passo, amostras: 0, contagem_nao_fecha: [], parcial_sem_fechando: [], com_fecho_aberto: 0, notas_abertas: 0, notas_sem_emitindo: [], notas_soma_errada: [] };
    const brl = (c) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(c / 100);
    for (let t = 0; t < d; t += passo) {
      P.seek(t);
      const c = P.contadores(), k = P.cartaoComissao(), n = P.cartaoNotas();
      out.amostras++;
      if (c.etapa !== 1 && c.total !== c.regra + c.sinal + c.pessoa) out.contagem_nao_fecha.push([t, c]);
      if (k && k.aberto) { out.com_fecho_aberto++; if (/R\$/.test(k.texto) && !/fechando…/.test(k.texto)) out.parcial_sem_fechando.push([t, k.texto]); }
      // defect 01, r3: a partial of the notes always says "emitindo… (k de N notas)", with the exact sum of the first k
      if (n && n.notas) {
        if (n.aberto) { out.notas_abertas++; if (!n.texto.includes('emitindo… (' + n.notas + ' de ' + n.total + ' notas)'.replace(/ /g, ' '))) out.notas_sem_emitindo.push([t, n.texto]); }
        else if (/emitindo/.test(n.texto) || n.notas !== n.total) out.notas_sem_emitindo.push([t, n.texto]);
        if (!n.texto.includes(brl(somas[n.notas - 1]))) out.notas_soma_errada.push([t, n.texto]);
      }
    }
    return out;
  }, [250, NOTAS_CENTAVOS]);
  relato.numeros.push({ onde: 'Varredura do relógio (a cada 250 ms)', esperado: 'decisões = regra + sinalizadas + pessoa em toda amostra', ok: !relato.varredura.contagem_nao_fecha.length });
  relato.numeros.push({ onde: 'Varredura do relógio (a cada 250 ms)', esperado: 'cartão da comissão com lojista aberto sempre diz "fechando…"', ok: !relato.varredura.parcial_sem_fechando.length });
  relato.numeros.push({ onde: 'Varredura do relógio (a cada 250 ms)', esperado: 'cartão das notas com nota por emitir sempre diz "emitindo… (k de 21 notas)"; com todas, "21 notas a emitir"', ok: !relato.varredura.notas_sem_emitindo.length && relato.varredura.notas_abertas > 0 });
  relato.numeros.push({ onde: 'Varredura do relógio (a cada 250 ms)', esperado: 'valor do cartão das notas = soma exata das k primeiras notas', ok: !relato.varredura.notas_soma_errada.length });
  // r3, finding 1: the desk is back on the Aurora statement, with the gaze on the Pix row, before the
  // impact reacts; then the Pix item
  relato.marcos_r3 = await page.evaluate(() => window.__painel.marcosR3());
  {
    const foco = relato.marcos_r3.linhas.find((x) => x.k === 'foco'), pix = relato.marcos_r3.linhas.find((x) => x.k === 'pend' && x.t > foco.t);
    for (const [nome, t, desc] of [['r3-extratos-1-volta-a-aurora', foco.t + 300, 'Extratos: fim do lote do Meridiano, a mesa já voltou à Aurora com o olhar na linha do Pix; o impacto ainda não reagiu'],
      ['r3-extratos-2-pix', pix.t + 600, 'Extratos: só então o Pix entra na mesa e no impacto']]) {
      await page.evaluate((ms) => window.__painel.seek(ms), t);
      await espera(400);
      await foto(page, nome, desc + ` (relógio ${Math.round(t)} ms)`);
      const m = await page.evaluate(() => ({ aba: document.querySelector('#abas .aba.atual .longo').textContent, olhar: (() => { const o = document.getElementById('olhar'); if (o.classList.contains('oculto')) return null; const r = o.getBoundingClientRect(); const tr = Array.from(document.querySelectorAll('#mesa-tbody tr')).find((x) => { const b = x.getBoundingClientRect(); return Math.abs(b.top + b.height / 2 - (r.top + r.height / 2)) < b.height / 2; }); return tr ? tr.innerText.replace(/\s+/g, ' ') : null; })(), pend: document.getElementById('ind-pend-v').textContent, primeiro: (document.querySelector('#imp-lista li') || {}).innerText }));
      relato.extratos_r3 = relato.extratos_r3 || []; relato.extratos_r3.push({ tela: nome, relogio_ms: Math.round(t), ...m });
    }
    const [a, b] = relato.extratos_r3;
    relato.numeros.push({ onde: 'Extratos (achado 1, r3)', esperado: 'mesa na Aurora com o olhar na linha do Pix antes de o Pix entrar no impacto', ok: a.aba === 'Aurora' && /PIX RECEBIDO/.test(a.olhar || '') && !/Pix recebido/.test(a.primeiro || '') && /Pix recebido/.test(b.primeiro || '') });
  }
  const iguais = fs.readFileSync(path.join(SAIDA, '03-rep-10s.png')).equals(fs.readFileSync(path.join(SAIDA, '05-rep-primeira-excecao.png')));
  relato.numeros.push({ onde: 'Evidência', esperado: 'quadro dos 10 s diferente do da primeira exceção', ok: !iguais });
  // "Pular para o que precisa de uma pessoa" during the replay
  await page.evaluate(() => window.__painel.seek(0));
  await page.click('#b-pular-rep');
  await espera(1800);
  await foto(page, '08-rep-depois-de-pular', 'Reprodução depois de "Pular para o que precisa de uma pessoa"');
  await page.click('#b-sair');
  await espera(400);
  // and on the summary
  await page.click('#b-pular');
  await espera(1200);
  await foto(page, '09-resumo-depois-de-pular', 'Resumo depois de "Pular para o que precisa de uma pessoa"');
  await page.evaluate(() => window.scrollTo(0, 0));
  // Drill-down: Rota Global, from the divergence table (pitch flow). Finding 3 (r2): the total counts
  // from the frame its label starts to enter; no frame shows the old value under the new label.
  relato.contagem_rota = await page.evaluate((nome) => new Promise((res) => {
    const alvo = Array.from(document.querySelectorAll('.tabela .nome-botao')).filter((b) => b.textContent === nome)[0];
    const t0 = performance.now(), am = [];
    alvo.click();
    (function q() {
      const dec = document.querySelector('#gaveta .decide'), passo = dec && dec.closest('.passo');
      if (passo) {
        const elo = passo.querySelectorAll('.elo')[1], num = elo.querySelector('.grande').textContent.replace(/ /g, ' ');
        am.push({ t: Math.round(performance.now() - t0), total: num, opacidade_rotulo: +parseFloat(getComputedStyle(passo).opacity).toFixed(2), dono: getComputedStyle(dec).visibility === 'visible' && parseFloat(getComputedStyle(dec).opacity) > 0.05 });
      }
      // keep sampling 700 ms after the chain settles, while who decides fades in
      const g = document.getElementById('gaveta');
      if (g.getAttribute('data-assentado') === '1' && !window.__assentouEm) window.__assentouEm = performance.now();
      if (window.__assentouEm && performance.now() - window.__assentouEm > 700) { window.__assentouEm = 0; setTimeout(() => res(am), 0); return; }
      requestAnimationFrame(q);
    })();
  }), rota.lojista);
  {
    const am = relato.contagem_rota, inicio = am.length ? am[0].total : '', fim = am.length ? am[am.length - 1].total : '';
    const antigoSobRotulo = am.filter((a) => a.total === inicio && a.opacidade_rotulo > 0.1).length;
    const comeca = am.find((a) => a.total !== inicio), dono = am.find((a) => a.dono);
    relato.contagem_rota_resumo = { quadros: am.length, valor_inicial: inicio, valor_final: fim, quadros_com_valor_antigo_e_rotulo_visivel: antigoSobRotulo, contagem_comeca_ms: comeca ? comeca.t : null, dono_aparece_ms: dono ? dono.t : null };
    relato.numeros.push({ onde: 'Mergulho Rota Global, contagem', esperado: 'nenhum quadro com o valor antigo sob o rótulo novo', ok: antigoSobRotulo === 0 && fim.includes(F2.format(rota.total_a_cobrar_brl)) });
  }
  await page.waitForSelector('#gaveta[data-assentado="1"]', { timeout: 10000 });
  await espera(500);
  await foto(page, '11-mergulho-rota-global', 'Mergulho da Rota Global aberto (contador assentado)');
  await confere(page, 'Mergulho Rota Global', ESPERADO.rota, '#gaveta');
  await semMotor(page, 'Mergulho Rota Global', '#gaveta');
  await page.evaluate(() => { document.getElementById('gaveta-corpo').scrollTop = 1e6; });
  await espera(300);
  await foto(page, '12-mergulho-rota-global-rastro', 'Mergulho da Rota Global, rolado até a linha de origem e o Rastro técnico');
  const rastro = normal(await page.evaluate(() => document.querySelector('#gaveta .rastro').innerText));
  relato.numeros.push({ onde: 'Rastro técnico Rota Global', esperado: 'linha crua da Orbe', ok: rastro.includes(normal(rota.linha_origem_texto)) });
  await page.keyboard.press('Escape');
  await espera(400);
  // Drill-down: Atlas (estimate, never revenue)
  await page.locator('[data-alvo="pend:PEN-0004"] button').click();
  await espera(1500);
  await foto(page, '13-mergulho-atlas', 'Mergulho da Atlas: estimativa de taxa e o que o bruto não é');
  await confere(page, 'Mergulho Atlas', ESPERADO.atlas, '#gaveta');
  await semMotor(page, 'Mergulho Atlas', '#gaveta');
  await page.keyboard.press('Escape');
  await espera(400);
  // Drill-down: a single-line item (bank statement) and the commission
  await page.locator('[data-alvo="pend:PEN-0013"] button').click();
  await espera(1400);
  await foto(page, '14-mergulho-pix', 'Mergulho de uma pendência de extrato (linha única)');
  await semMotor(page, 'Mergulho Pix', '#gaveta');
  await page.keyboard.press('Escape');
  await espera(300);
  await page.locator('.comissao-corpo > .alvo').click();
  await espera(1400);
  await foto(page, '15-mergulho-comissao', 'Mergulho da comissão apurada (lista por lojista)');
  await page.locator('#gaveta .mini-tabela tr.clicavel').first().click();
  await espera(1400);
  await foto(page, '16-mergulho-comissao-lojista', 'Mergulho de um lojista: linhas e taxa do contrato');
  await semMotor(page, 'Mergulho comissão lojista', '#gaveta');
  await page.keyboard.press('Escape');
  await espera(300);
  // Projection mode
  await page.click('#b-projecao');
  await espera(400);
  await foto(page, '17-projecao-1440', 'Modo projeção (tudo × 1,25)');
  await ctx.close();
}

// ---------------------------------------------------------------- r4: the origin strip and the one-line pending list
// The strip under the divergence table (four links, no arrow glyph, no ids) and one line per pending item
// (title, value, owner seal; the complement in the drawer). Every title that does not fit one line is
// listed, never cut with "…"; values end on one edge and seals start on one edge.
console.log('r4: faixa de origem e pendências em uma linha');
relato.r4 = { telas: [] };
const AUDITA_R4 = () => {
  const linhas = (el) => { const r = document.createRange(); r.selectNodeContents(el); return new Set(Array.from(r.getClientRects()).map((x) => Math.round(x.top))).size; };
  const itens = Array.from(document.querySelectorAll('#pend-lista .pend-item'));
  const titulos = itens.map((li) => ({ titulo: li.querySelector('.pend-titulo').innerText, linhas: linhas(li.querySelector('.pend-titulo')) }));
  const borda = (sel, lado) => new Set(itens.map((li) => Math.round(li.querySelector(sel).getBoundingClientRect()[lado]))).size === 1;
  const faixa = document.querySelector('.faixa'), f = faixa.getBoundingClientRect();
  const caixas = Array.from(faixa.querySelectorAll('.elo-caixa')).map((c) => ({ texto: c.innerText.replace(/\s+/g, ' '), transborda: c.scrollWidth > c.clientWidth + 1 }));
  return { itens: itens.length, que_quebram: titulos.filter((x) => x.linhas > 1).map((x) => x.titulo), maior_numero_de_linhas: Math.max(...titulos.map((x) => x.linhas)),
    valores_numa_borda: borda('.pend-valor', 'right'), selos_numa_borda: borda('.selo', 'left'), reticencia: itens.some((li) => /…/.test(li.innerText)),
    complemento_na_lista: document.querySelectorAll('#pend-lista .pend-meta').length, titulo_px: parseFloat(getComputedStyle(document.querySelector('.pend-titulo')).fontSize),
    faixa: { titulo: document.querySelector('.faixa-titulo').innerText, caixas, caixa_transborda: caixas.some((c) => c.transborda), topo_na_pagina: Math.round(f.top + scrollY), seta_glifo: /→/.test(faixa.innerText) } };
};
const mostra = async (page, sel) => { await page.evaluate((s) => { document.querySelector(s).scrollIntoView({ block: 'start' }); window.scrollBy(0, -(document.getElementById('topo').offsetHeight + 16)); }, sel); await espera(250); };
for (const [rot, vp, proj] of [['1440', { width: 1440, height: 900 }, false], ['1280', { width: 1280, height: 720 }, false], ['proj1440', { width: 1440, height: 900 }, true], ['proj1280', { width: 1280, height: 720 }, true]]) {
  const { ctx, page } = await abre('r4-' + rot, vp, {}, PAINEL + (proj ? '?projecao=1' : ''));
  const a = await page.evaluate(AUDITA_R4);
  relato.r4.telas.push({ tela: rot, ...a });
  await confere(page, 'Faixa de origem ' + rot, ESPERADO.faixa, '.faixa-origem');
  await semMotor(page, 'Faixa de origem ' + rot, '.faixa-origem');
  relato.numeros.push({ onde: 'Faixa de origem ' + rot, esperado: 'quatro elos inteiros, sem glifo de seta', ok: a.faixa.caixas.length === 4 && !a.faixa.caixa_transborda && !a.faixa.seta_glifo });
  relato.numeros.push({ onde: 'Pendências em uma linha ' + rot, esperado: `${pend.quantidade} linhas sem "…" nem complemento; valores numa borda, selos noutra; título que não cabe quebra na própria coluna (no máximo 2 linhas)`,
    ok: a.itens === pend.quantidade && !a.reticencia && !a.complemento_na_lista && a.valores_numa_borda && a.selos_numa_borda && a.maior_numero_de_linhas <= 2, visto: a.que_quebram.length + ' quebram' });
  await mostra(page, '.faixa-titulo');
  await foto(page, `r4-resumo-${rot}-faixa`, `Resumo a ${vp.width}×${vp.height}${proj ? ' em projeção' : ''}: faixa de origem embaixo da tabela de divergências`);
  await mostra(page, '#pend-cabeca');
  await foto(page, `r4-resumo-${rot}-pendencias`, `Resumo a ${vp.width}×${vp.height}${proj ? ' em projeção' : ''}: pendências em uma linha (${a.que_quebram.length} títulos em duas)`);
  await semMotor(page, 'Pendências em uma linha ' + rot, '#pend-lista');
  if (!proj) {
    // a click on the strip opens the Rota Global drawer, as the table row does, and selects that row
    await mostra(page, '.faixa-titulo');
    await page.click('.faixa');
    await page.waitForSelector('#gaveta[data-assentado="1"]', { timeout: 10000 });
    await espera(700);
    const g = await page.evaluate(() => ({ titulo: document.getElementById('gaveta-titulo').textContent, linha: (document.querySelector('.tabela tr.selecionada .nome-botao') || {}).textContent || null }));
    await foto(page, `r4-faixa-abre-gaveta-${rot}`, `Clique na faixa a ${vp.width}×${vp.height}: abre a gaveta da Rota Global e seleciona a linha dela na tabela`);
    relato.numeros.push({ onde: 'Clique na faixa ' + rot, esperado: 'abre a gaveta da Rota Global e seleciona a linha da tabela', ok: g.titulo === rota.lojista && g.linha === rota.lojista });
    await confere(page, 'Gaveta pela faixa ' + rot, ESPERADO.rota, '#gaveta');
    await page.keyboard.press('Escape');
    await espera(400);
    // a pending item opened from its line (the click lands on the value, not on the title)
    // the title's button covers the whole line: a click where the value is opens the drawer
    const valor = page.locator('[data-alvo="pend:PEN-0012"] .pend-valor');
    await valor.scrollIntoViewIfNeeded();
    const caixa = await valor.boundingBox();
    await page.mouse.click(caixa.x + caixa.width / 2, caixa.y + caixa.height / 2);
    await page.waitForSelector('#gaveta[data-assentado="1"]', { timeout: 10000 });
    await espera(1200);
    await foto(page, `r4-gaveta-pendencia-pela-lista-${rot}`, `Pendência aberta pela linha da lista a ${vp.width}×${vp.height}: conferir o crédito da Ponte, com o complemento`);
    await confere(page, 'Gaveta pela lista ' + rot, ['Conferir o crédito da Ponte contra a nota', 'R$ 39.543,45', 'Nota única de remessa.', 'Decide: Financeiro', '228 linhas', '6 de 228 linhas'], '#gaveta');
    await semMotor(page, 'Gaveta pela lista ' + rot, '#gaveta');
    await page.evaluate(() => { document.getElementById('gaveta-corpo').scrollTop = 1e6; });
    await espera(300);
    await foto(page, `r4-gaveta-pendencia-pela-lista-${rot}-rastro`, `A mesma gaveta rolada até o Rastro técnico: o motivo do motor como vem (crédito de 06/10)`);
    const rastro = normal(await page.evaluate(() => document.querySelector('#gaveta .rastro').innerText));
    relato.numeros.push({ onde: 'Gaveta pela lista ' + rot, esperado: 'o motivo do motor como vem, com "06/10", no Rastro técnico', ok: rastro.includes('conferir o crédito da Ponte de 06/10 contra a nota') });
    await page.keyboard.press('Escape');
  }
  await ctx.close();
}

// ---------------------------------------------------------------- pitch flow, timed (storyboard: Rota Global, then "Financeiro 12")
console.log('fluxo do pitch');
for (const [rotulo, vp, proj] of [['1440', { width: 1440, height: 900 }, false], ['1280', { width: 1280, height: 720 }, false], ['projecao-1280', { width: 1280, height: 720 }, true], ['projecao-1440', { width: 1440, height: 900 }, true]]) {
  const { ctx, page } = await abre('fluxo-' + rotulo, vp, {}, PAINEL + (proj ? '?projecao=1' : ''));
  const t0 = Date.now();
  await page.getByRole('button', { name: rota.lojista, exact: true }).first().click();
  await page.waitForSelector('#gaveta[data-assentado="1"]', { timeout: 10000 });
  const cadeia = Date.now() - t0;
  const medida = await page.evaluate(() => {
    const d = document.querySelector('#gaveta .decide').getBoundingClientRect(), c = document.getElementById('gaveta-corpo').getBoundingClientRect();
    const passos = Array.from(document.querySelectorAll('#gaveta .passo')).slice(0, 4).map((x) => x.innerText).join(' ');
    const g = document.getElementById('gaveta').getBoundingClientRect(), linha = document.querySelector('.tabela tr.selecionada').getBoundingClientRect();
    const tam = (sel) => Math.min(...Array.from(document.querySelectorAll(sel)).map((x) => parseFloat(getComputedStyle(x).fontSize)));
    return { dono_visivel_sem_rolar: d.bottom <= c.bottom && d.top >= c.top, texto: passos, gaveta_px: Math.round(g.width), cobre_linha: !(g.left >= linha.right || g.right <= linha.left),
      menor_numero_px: tam('#gaveta .passo .grande'), menor_rotulo_px: Math.min(tam('#gaveta .passo .rot'), tam('#gaveta .decide')) };
  });
  await espera(600); // what the total is and who decides fade in after the count
  await foto(page, `fluxo-${rotulo}-1-rota-global`, `Fluxo do pitch a ${vp.width}×${vp.height}${proj ? ' em projeção' : ''}: Mergulho da Rota Global assentado`);
  const t1 = Date.now();
  await page.evaluate(() => { window.__rolagemAntes = window.scrollY; });
  await page.click('.filtro[data-dono="Financeiro"]');
  await page.mouse.move(2, 2); // no hover left over the list in the screenshot
  await page.waitForFunction(() => document.getElementById('gaveta').hidden, null, { timeout: 3000 });
  await espera(700); // smooth scroll
  const depois = await page.evaluate(() => {
    const f = document.getElementById('filtros-pend').getBoundingClientRect(), topo = document.getElementById('topo').getBoundingClientRect();
    const itens = document.querySelectorAll('#pend-lista .pend-item'), primeiro = itens[0] ? itens[0].getBoundingClientRect() : null;
    const cab = document.getElementById('pend-cabeca').getBoundingClientRect();
    return { gaveta_fechada: document.getElementById('gaveta').hidden, filtros_abaixo_do_cabecalho: f.top >= topo.bottom, primeiro_item_visivel: !!primeiro && primeiro.top >= topo.bottom && primeiro.bottom <= innerHeight,
      contagem_do_filtro_visivel: cab.top >= topo.bottom && cab.bottom <= innerHeight, rolou: window.scrollY !== window.__rolagemAntes,
      itens: itens.length, cabecalho: document.getElementById('pend-cabeca').innerText.replace(/\s+/g, ' '), titulos: Array.from(itens).slice(0, 3).map((x) => x.querySelector('.pend-titulo').innerText) };
  });
  const filtro = Date.now() - t1;
  await foto(page, `fluxo-${rotulo}-2-financeiro`, `Fluxo do pitch a ${vp.width}×${vp.height}${proj ? ' em projeção' : ''}: depois de "Financeiro ${pend.por_dono.Financeiro}"`);
  const leituraCadeia = pausaRegra(words(medida.texto)), leituraLista = pausaRegra(words(depois.cabecalho + ' ' + depois.titulos.join(' ')));
  relato.fluxo.push({ tela: rotulo, cadeia_assenta_ms: cadeia, leitura_cadeia_ms: leituraCadeia, filtro_responde_ms: filtro, leitura_lista_ms: leituraLista,
    total_ms: cadeia + leituraCadeia + filtro + leituraLista, ...medida, texto: undefined, ...depois, titulos: undefined });
  relato.numeros.push({ onde: 'Fluxo ' + rotulo, esperado: 'dono visível sem rolar a gaveta', ok: medida.dono_visivel_sem_rolar });
  relato.numeros.push({ onde: 'Fluxo ' + rotulo, esperado: 'gaveta de 440 px sem cobrir a linha clicada', ok: medida.gaveta_px === 440 && !medida.cobre_linha });
  relato.numeros.push({ onde: 'Fluxo ' + rotulo, esperado: 'números da cadeia a 28 px ou mais, rótulos a 20 px ou mais', ok: medida.menor_numero_px >= 28 && medida.menor_rotulo_px >= 20 });
  relato.numeros.push({ onde: 'Fluxo ' + rotulo, esperado: `filtro fecha a gaveta e mostra ${pend.por_dono.Financeiro} itens abaixo do cabeçalho`, ok: depois.gaveta_fechada && depois.filtros_abaixo_do_cabecalho && depois.primeiro_item_visivel && depois.itens === pend.por_dono.Financeiro });
  relato.numeros.push({ onde: 'Fluxo ' + rotulo, esperado: `"${pend.por_dono.Financeiro} pendências de ${pend.quantidade} no mês · Decide: Financeiro" à vista, abaixo do cabeçalho fixo`, ok: depois.contagem_do_filtro_visivel && /Decide: Financeiro/.test(depois.cabecalho) });
  await ctx.close();
}

// ---------------------------------------------------------------- defect 01 (r2): real playback paused in the middle of the closing, 1x and 2x
console.log('pausa no fecho da comissão, 1x e 2x');
relato.pausas_fecho = [];
for (const vel of [1, 2]) {
  const { ctx, page } = await abre('pausa-' + vel + 'x', { width: 1440, height: 900 });
  const M = await page.evaluate(() => window.__painel.marcos());
  const ck = M.fecho_checkout, rm = M.fecho_remessa;
  const alvos = [['checkout-a', ck.primeiro + (ck.ultimo - ck.primeiro) * 0.25], ['checkout-b', ck.primeiro + (ck.ultimo - ck.primeiro) * 0.7], ['remessa', rm.primeiro + (rm.ultimo - rm.primeiro) * 0.4]];
  await page.click('#b-tocar');
  if (vel === 2) await page.click('#b-2x');
  for (const [rot, alvo] of alvos) {
    await page.waitForFunction((a) => window.__painel.tempo() >= a, alvo, { timeout: 150000, polling: 'raf' });
    await page.click('#b-pausa');
    const t = await page.evaluate(() => window.__painel.tempo());
    const amostras = [];
    for (let k = 0; k < 10; k++) { amostras.push(await page.evaluate(() => window.__painel.cartaoComissao())); await espera(200); }
    const nome = `pausa-${vel}x-${rot}`;
    await foto(page, nome, `Reprodução em ${vel}x pausada no fecho da comissão (${rot}), relógio ${Math.round(t)} ms, 2 s depois da pausa`);
    const ok = amostras.every((a) => !a.aberto || !/R\$/.test(a.texto) || /fechando…/.test(a.texto));
    relato.pausas_fecho.push({ tela: nome, velocidade: vel, relogio_ms: Math.round(t), lojista_aberto: amostras[amostras.length - 1].aberto, textos: [...new Set(amostras.map((a) => a.texto))], ok });
    relato.numeros.push({ onde: 'Pausa no fecho ' + nome, esperado: 'nenhum valor parcial sem "fechando…"', ok });
    await page.click('#b-pausa');
  }
  await ctx.close();
}

// ---------------------------------------------------------------- defect 02 (r2): the replay in projection, at the moments of the old 13, 30, 56 and 108 s
console.log('reprodução em projeção');
relato.projecao_rep = [];
for (const [w, hh] of [[1440, 900], [1280, 720]]) {
  const { ctx, page } = await abre('proj-' + w, { width: w, height: hh }, {}, PAINEL + '?projecao=1');
  const M = await page.evaluate(() => window.__painel.marcos());
  for (const [rot, t, desc] of [['13s', M.primeira_excecao + 2000, 'primeira exceção, Rota Global (antes 13 s)'], ['30s', M.primeira_pessoa + 2000, 'primeira pendência, grupo "Cobrar da Orbe" (antes 30 s)'],
    ['56s', M.primeira_excecao_remessa + 2000, 'primeira exceção da remessa, Mundo Aberto (antes 56 s)'], ['108s', M.nota_ponte + 1500, 'nota única da Ponte, uma batida (antes 108 s)']]) {
    await page.evaluate((ms) => window.__painel.seek(ms), t);
    await espera(450);
    const nome = `rep-proj${w}-${rot}`;
    await foto(page, nome, `Reprodução em projeção a ${w}×${hh}: ${desc}, relógio ${Math.round(t)} ms`);
    const m = await page.evaluate(() => {
      const leg = document.getElementById('legenda').getBoundingClientRect().top;
      const cortados = Array.from(document.querySelectorAll('.mesa-tabela td, .mesa-tabela th')).filter((td) => !td.classList.contains('flex') && !td.classList.contains('marca') && td.scrollWidth > td.clientWidth + 1).map((td) => td.textContent);
      const it = document.querySelector('#imp-lista li'), cont = document.getElementById('mesa-contagem').getBoundingClientRect(), mesa = document.querySelector('.mesa').getBoundingClientRect(), imp = document.querySelector('.impacto').getBoundingClientRect();
      const marcas = Array.from(document.querySelectorAll('.mesa-tabela td.marca > *')).filter((x) => x.getBoundingClientRect().right > x.closest('td').getBoundingClientRect().right + 1).length;
      const linha = document.querySelector('#mesa-motivo .linha');
      return { lado_a_lado: Math.abs(mesa.top - imp.top) < 2 && imp.left > mesa.right, contagem_visivel: cont.bottom <= leg, primeira_decisao_visivel: !it || it.getBoundingClientRect().bottom <= leg,
        celulas_cortadas: cortados, selos_cortados: marcas, linhas_mesa: document.querySelectorAll('#mesa-tbody tr').length, linha_do_motor_px: linha ? parseFloat(getComputedStyle(linha).fontSize) : null };
    });
    relato.projecao_rep.push({ tela: nome, relogio_ms: Math.round(t), ...m });
    relato.numeros.push({ onde: nome, esperado: 'mesa e impacto lado a lado, 5 linhas, contagem e primeira decisão à vista, nenhuma célula nem selo cortado', ok: m.lado_a_lado && m.contagem_visivel && m.primeira_decisao_visivel && !m.celulas_cortadas.length && !m.selos_cortados && m.linhas_mesa === 5 });
    await semMotor(page, nome, '#v-rep');
  }
  await ctx.close();
}

// ---------------------------------------------------------------- r3, defects 01 and 02: the notes stage, real playback paused, 1x and 2x
// The Critic paused at 74.9 s and 76.5 s (1x) and 37.4 s and 38.3 s of wall clock (2x). In r3 the Casa do
// Estudante pause ends before the sweep, so the clock moved: 74.9 s is now the middle of that pause, and
// the states the Critic saw (4 and 12 notes) come later. All four are captured, at both speeds.
console.log('notas pausadas, 1x e 2x');
relato.pausas_notas = [];
{
  const { ctx, page } = await abre('notas-marcos', { width: 1440, height: 900 });
  const M = await page.evaluate(() => window.__painel.marcosR3());
  // first clock time with k notes, read from the state (deterministic seek)
  const comNotas = async (k) => page.evaluate(([k, de]) => { const P = window.__painel; for (let t = de; t < de + 8000; t += 10) { P.seek(t); if (P.cartaoNotas().notas >= k) return t; } return null; }, [k, M.notas.casa]);
  const t4 = await comNotas(4), t5 = await comNotas(5), t12 = await comNotas(12), t13 = await comNotas(13);
  relato.notas_r3 = { ...M.notas, casa_parada_ms: Math.round(M.notas.varredura[0] - M.notas.casa - M.notas.entrada), com_4_notas: [t4, t5], com_12_notas: [t12, t13] };
  await ctx.close();
  const alvos = [['pausa-da-casa', 74900, 'meio da pausa da Casa do Estudante: olhar na linha da Casa, nenhuma nota ainda'],
    ['varredura', 76500, 'varredura das notas, depois da pausa da Casa'],
    ['como-o-critico-a', (t4 + t5) / 2, 'o estado que o Crítico viu a 74,9 s (4 notas), agora na varredura'],
    ['como-o-critico-b', t12 + Math.min(20, (t13 - t12) / 2), 'o estado que o Crítico viu a 76,5 s (12 notas), agora no lote']];
  relato.notas_r3.alvos = alvos.map((a) => [a[0], Math.round(a[1])]);
  for (const vel of [1, 2]) {
    const { ctx: c2, page: p2 } = await abre('notas-' + vel + 'x', { width: 1440, height: 900 });
    await p2.click('#b-tocar');
    if (vel === 2) await p2.click('#b-2x');
    for (const [rot, alvo, desc] of alvos) {
      await p2.waitForFunction((a) => window.__painel.tempo() >= a, alvo, { timeout: 150000, polling: 'raf' });
      await p2.click('#b-pausa');
      const t = await p2.evaluate(() => window.__painel.tempo());
      const leituras = [];
      for (let k = 0; k < 10; k++) { leituras.push(await p2.evaluate(() => { const n = window.__painel.cartaoNotas(), o = document.getElementById('olhar'); let linha = null; if (!o.classList.contains('oculto')) { const r = o.getBoundingClientRect(); const tr = Array.from(document.querySelectorAll('#mesa-tbody tr')).find((x) => { const b = x.getBoundingClientRect(); return Math.abs(b.top + b.height / 2 - (r.top + r.height / 2)) < b.height / 2; }); linha = tr ? tr.innerText.replace(/\s+/g, ' ') : null; } return { ...n, olhar: linha, motor: document.getElementById('mesa-motivo').innerText.replace(/\s+/g, ' '), contagem: window.__painel.contadores() }; })); await espera(200); }
      // the card and the counts hold from the pause on; the gaze may still finish its 200 ms slide, so it is
      // read from 400 ms after the pause
      const ult = leituras[leituras.length - 1], estavel = leituras.every((l) => l.texto === ult.texto && JSON.stringify(l.contagem) === JSON.stringify(ult.contagem)) && leituras.slice(2).every((l) => l.olhar === ult.olhar);
      const nome = `r3-notas-${vel}x-${rot}-${ult.notas}-notas-${Math.round(t)}ms`;
      await foto(p2, nome, `Notas em ${vel}x, pausada a ${(t / 1000).toFixed(2).replace('.', ',')} s do relógio, 2 s depois (${ult.notas} de ${ult.total} notas): ${desc}`);
      const soma = ult.notas ? NOTAS_CENTAVOS[ult.notas - 1] : 0;
      const valorOk = !ult.notas || ult.texto.includes(F2.format(soma / 100));
      const qualificador = !ult.notas ? /nenhuma nota ainda/.test(ult.texto) : ult.aberto ? ult.texto.includes(`emitindo… (${ult.notas} de ${ult.total} notas)`) : /21 notas a emitir/.test(ult.texto);
      const c = ult.contagem, conta = c.total === c.regra + c.sinal + c.pessoa;
      relato.pausas_notas.push({ tela: nome, velocidade: vel, relogio_ms: Math.round(t), estavel, cartao: ult.texto, olhar: ult.olhar, motor: ult.motor, notas: ult.notas, valor_ok: valorOk, qualificador_ok: qualificador, contagem: c, contagem_fecha: conta });
      relato.numeros.push({ onde: 'Pausa nas Notas ' + nome, esperado: 'cartão exato e com qualificador ("nenhuma nota ainda", "emitindo… (k de 21 notas)" ou "21 notas a emitir"), estável 2 s, contagem que fecha', ok: estavel && valorOk && qualificador && conta });
      if (rot === 'pausa-da-casa') relato.numeros.push({ onde: 'Pausa nas Notas ' + nome, esperado: 'no meio da pausa da Casa, o olhar está na linha da Casa e a linha do motor fala da Casa', ok: /Casa do Estudante/.test(ult.olhar || '') && /Casa do Estudante sem nota/.test(ult.motor) });
      await p2.click('#b-pausa'); // continue to the next target
    }
    await c2.close();
  }
}

// ---------------------------------------------------------------- r3: the notes card and the desk in compact projection (1280×720)
// Defect 03: in compact projection the row under the gaze shows its whole text (up to three lines, no
// "…", no word broken in the middle). Checked at the Critic's moments (Remessa and Extratos) and at every
// 50 ms of the clock; plus the room under the table: the engine's line and the counts do not move while
// the gaze moves, and the counts stay above the caption.
console.log('projeção a 1280: Extratos, Remessa e a linha com o olhar');
relato.projecao_r3 = [];
{
  const { ctx, page } = await abre('proj-r3', { width: 1280, height: 720 }, {}, PAINEL + '?projecao=1');
  const M = await page.evaluate(() => window.__painel.marcosR3());
  const MR = await page.evaluate(() => window.__painel.marcos());
  const L = M.linhas, foco = L.find((x) => x.k === 'foco');
  const pendDepois = (t) => L.filter((x) => x.k === 'pend' && x.t > t);
  const [pix, repasse, transf] = pendDepois(foco.t);
  const mundo = L.find((x) => x.k === 'div1' && Math.abs(x.t - MR.primeira_excecao_remessa) < 1);
  const auditoria = () => {
    const leg = document.getElementById('legenda').getBoundingClientRect().top;
    const mesa = document.querySelector('.mesa').getBoundingClientRect(), imp = document.querySelector('.impacto').getBoundingClientRect();
    const cont = document.getElementById('mesa-contagem').getBoundingClientRect();
    const numerosCortados = Array.from(document.querySelectorAll('.mesa-tabela td.valor, .mesa-tabela th')).filter((td) => td.scrollWidth > td.clientWidth + 1).map((td) => td.textContent);
    const selos = Array.from(document.querySelectorAll('.mesa-tabela td.marca > *')).filter((x) => x.getBoundingClientRect().right > x.closest('td').getBoundingClientRect().right + 1).length;
    const tr = document.querySelector('#mesa-tbody tr.foco');
    let foco = null;
    if (tr) {
      const td = tr.querySelector('td.junta') || tr.querySelector('td.flex'), sp = td.classList.contains('junta') ? td.querySelector('.foco-texto') : td.querySelector('span');
      const cs = getComputedStyle(sp), lh = parseFloat(cs.lineHeight), linhas = Math.round(sp.getBoundingClientRect().height / lh);
      const md = document.createElement('span'); md.style.cssText = 'position:absolute;left:-9999px;white-space:nowrap;font:' + cs.font; document.body.appendChild(md);
      const meio = sp.textContent.split(/\s+/).filter((w) => { md.textContent = w; return md.getBoundingClientRect().width > sp.clientWidth + 0.5; }); md.remove();
      const reticencia = cs.webkitLineClamp !== 'none' && sp.scrollHeight > sp.clientHeight + 4;
      foco = { texto: sp.textContent, linhas, palavra_quebrada: meio, reticencia, fonte_px: parseFloat(cs.fontSize), inteiro: !reticencia && linhas <= 3 && !meio.length && sp.scrollWidth <= sp.clientWidth + 1 };
    }
    const selo = tr ? tr.querySelector('td.marca .selo') : null;
    return { lado_a_lado: Math.abs(mesa.top - imp.top) < 2 && imp.left > mesa.right, linhas_mesa: document.querySelectorAll('#mesa-tbody tr').length, numeros_cortados: numerosCortados, selos_cortados: selos,
      selo_linhas: selo ? Math.round(selo.getBoundingClientRect().height / parseFloat(getComputedStyle(selo).lineHeight)) : null, contagem_acima_da_legenda: cont.bottom <= leg, folga_px: Math.round(leg - cont.bottom), foco };
  };
  for (const [rot, t, desc] of [['remessa-varredura', 40000, 'Remessa, varredura (NÓRDICA EDUCAÇÃO INT)'], ['remessa-mundo-aberto', mundo.t + 2000, 'Remessa, primeira exceção: Mundo Aberto (antes 44 s)'],
    ['remessa-spreads', 55000, 'Remessa, grupo dos spreads negativos, olhar em Novo Horizonte (55 s)'], ['extratos-varredura', foco.t - 2700, 'Extratos, varredura (TED RECEBIDA … ORBE ADQUIRENCIA SA)'],
    ['extratos-volta-a-aurora', foco.t + 300, 'Extratos, a mesa volta à Aurora antes do Pix (antes 86 s)'], ['extratos-pix', pix.t + 1500, 'Extratos, Pix recebido sem identificação (antes 89 s)'],
    ['extratos-repasse', repasse.t + 1500, 'Extratos, repasse devolvido (Mundo Aberto)'], ['extratos-transferencia', transf.t + 1500, 'Extratos, transferência para o Meridiano (antes 92,5 s)']]) {
    await page.evaluate((ms) => window.__painel.seek(ms), t);
    await espera(450);
    const nome = `r3-proj1280-${rot}`;
    await foto(page, nome, `Projeção a 1280×720, ${desc}: linha com o olhar inteira, relógio ${Math.round(t)} ms`);
    const a = await page.evaluate(auditoria);
    relato.projecao_r3.push({ tela: nome, relogio_ms: Math.round(t), ...a });
    relato.numeros.push({ onde: nome, esperado: 'linha com o olhar inteira (até 3 linhas a 19 px, sem "…", sem palavra quebrada); números inteiros; mesa e impacto lado a lado; 5 linhas; selo inteiro; contagem acima da legenda', ok: (!a.foco || (a.foco.inteiro && a.foco.fonte_px === 19)) && !a.numeros_cortados.length && a.lado_a_lado && a.linhas_mesa === 5 && !a.selos_cortados && a.contagem_acima_da_legenda });
    await semMotor(page, nome, '#v-rep');
  }
  // the notes card in compact projection, with notes still to come
  await page.evaluate((ms) => window.__painel.seek(ms), relato.notas_r3.com_4_notas[0] + 100);
  await espera(450);
  await foto(page, 'r3-proj1280-notas-emitindo', 'Projeção a 1280×720, Notas: o cartão diz "emitindo… (4 de 21 notas)"');
  const kn = await page.evaluate(() => window.__painel.cartaoNotas());
  relato.numeros.push({ onde: 'r3-proj1280-notas-emitindo', esperado: 'cartão das notas com "emitindo… (4 de 21 notas)" e R$ 41.307,74', ok: kn.texto.includes('emitindo… (4 de 21 notas)') && kn.texto.includes(F2.format(NOTAS_CENTAVOS[3] / 100)) });
  // every 50 ms of the clock: the row under the gaze, the room under the table and the counts
  relato.projecao_r3_relogio = await page.evaluate((cod) => {
    const auditoria = eval('(' + cod + ')');
    const P = window.__painel, d = P.duracao(), out = { passo_ms: 50, amostras: 0, com_olhar: 0, linhas_unicas: {}, cortadas: [], mais_de_3: 0, folga_minima_px: 1e9, contagem_abaixo_da_legenda: [], pulos: [] };
    let ant = null;
    for (let t = 0; t < d; t += 50) {
      P.seek(t);
      const a = auditoria(); out.amostras++;
      out.folga_minima_px = Math.min(out.folga_minima_px, a.folga_px);
      if (!a.contagem_acima_da_legenda) out.contagem_abaixo_da_legenda.push(t);
      if (a.foco) {
        out.com_olhar++;
        out.linhas_unicas[a.foco.texto] = Math.max(out.linhas_unicas[a.foco.texto] || 0, a.foco.linhas);
        if (!a.foco.inteiro) out.cortadas.push([t, a.foco.texto]);
      }
      const mo = document.getElementById('mesa-motivo'), ab = (document.querySelector('#abas .aba.atual .curto') || {}).textContent || '-';
      const cur = { aba: ab, txt: mo.innerText, y: Math.round(mo.getBoundingClientRect().top), janela: (document.querySelector('#mesa-tbody tr') || { getAttribute: () => '' }).getAttribute('data-i') };
      if (ant && ant.aba === cur.aba && ant.txt === cur.txt && ant.janela === cur.janela && ant.y !== cur.y) out.pulos.push([t, ant.y, cur.y]);
      ant = cur;
    }
    out.linhas_unicas = Object.entries(out.linhas_unicas).map(([texto, linhas]) => ({ texto, linhas }));
    return out;
  }, auditoria.toString());
  const pr = relato.projecao_r3_relogio;
  relato.numeros.push({ onde: 'Projeção a 1280, relógio inteiro (a cada 50 ms)', esperado: 'linha com o olhar sempre inteira (até 3 linhas, sem "…", sem palavra quebrada)', ok: !pr.cortadas.length && pr.com_olhar > 0 });
  relato.numeros.push({ onde: 'Projeção a 1280, relógio inteiro (a cada 50 ms)', esperado: 'contagem sempre acima da legenda; linha do motor e contagem paradas enquanto só o olhar anda', ok: !pr.contagem_abaixo_da_legenda.length && !pr.pulos.length });
  await ctx.close();
}

// ---------------------------------------------------------------- defect 03 (r2): Mundo Aberto drawer, the base of the spread
console.log('gaveta Mundo Aberto');
relato.mundo_aberto = [];
for (const [rot, vp, proj] of [['1440', { width: 1440, height: 900 }, false], ['1280', { width: 1280, height: 720 }, false], ['projecao-1280', { width: 1280, height: 720 }, true], ['projecao-1440', { width: 1440, height: 900 }, true]]) {
  const { ctx, page } = await abre('mundo-' + rot, vp, {}, PAINEL + (proj ? '?projecao=1' : ''));
  await page.getByRole('button', { name: 'Mundo Aberto', exact: true }).first().click();
  await page.waitForSelector('#gaveta[data-assentado="1"]', { timeout: 10000 });
  await espera(900);
  await foto(page, `g-mundo-aberto-${rot}`, `Mergulho da Mundo Aberto a ${vp.width}×${vp.height}${proj ? ' em projeção' : ''}: base do spread, taxas, diferença, total, dono`);
  await confere(page, 'Mergulho Mundo Aberto ' + rot, ESPERADO.mundo, '#gaveta');
  await semMotor(page, 'Mergulho Mundo Aberto ' + rot, '#gaveta');
  const conta = await page.evaluate(() => {
    const t = document.getElementById('gaveta-corpo').innerText.replace(/ /g, ' ');
    const num = (s) => parseFloat(s.replace(/\./g, '').replace(',', '.'));
    const base = /R\$ ([\d.]+,\d{2})\s+CAD ([\d.]+,\d{2}) à PTAX ([\d,]+)/.exec(t), taxas = /Contrato\s+([\d,]+)%[\s\S]*?aplicou\s+([\d,]+)%/.exec(t);
    const dif = /R\$ ([\d.]+,\d{2})\s+a mais nesta operação/.exec(t), pago = /Valor pago pelo cliente: R\$ ([\d.]+,\d{2})/.exec(t);
    const d = document.querySelector('#gaveta .decide').getBoundingClientRect(), c = document.getElementById('gaveta-corpo').getBoundingClientRect();
    return { base: base && num(base[1]), cad: base && num(base[2]), ptax: base && num(base[3]), contrato_pct: taxas && num(taxas[1]), aplicado_pct: taxas && num(taxas[2]), diferenca: dif && num(dif[1]), pago_pelo_cliente: pago && num(pago[1]), dono_visivel_sem_rolar: d.bottom <= c.bottom };
  });
  conta.base_confere = !!conta.base && Math.abs(conta.cad * conta.ptax - conta.base) < 0.006;
  conta.diferenca_confere = !!conta.base && Math.abs(conta.base * (conta.aplicado_pct - conta.contrato_pct) / 100 - conta.diferenca) < 0.006;
  relato.mundo_aberto.push({ tela: rot, ...conta });
  relato.numeros.push({ onde: 'Mergulho Mundo Aberto ' + rot, esperado: 'base = CAD × PTAX; base × (aplicado − contrato) = diferença; dono sem rolar', ok: conta.base_confere && conta.diferenca_confere && conta.dono_visivel_sem_rolar });
  await ctx.close();
}

// ---------------------------------------------------------------- 1280x720
console.log('1280x720');
{
  const { ctx, page } = await abre('1280', { width: 1280, height: 720 });
  await foto(page, '20-resumo-1280', 'Resumo a 1280×720');
  await confere(page, 'Resumo 1280', ESPERADO.resumo, '#v-resumo');
  await page.getByRole('button', { name: rota.lojista, exact: true }).first().click();
  await page.waitForSelector('#gaveta[data-assentado="1"]', { timeout: 10000 });
  await espera(600);
  await foto(page, '21-mergulho-rota-global-1280', 'Mergulho da Rota Global a 1280×720');
  await page.keyboard.press('Escape');
  await page.evaluate(() => window.__painel.seek(25000));
  await espera(350);
  await foto(page, '22-rep-25s-1280', 'Reprodução em 25 s a 1280×720');
  // the old 22-rep-25s-1280 was the middle of the checkout closing; this is the same moment in r2
  const Mf = await page.evaluate(() => window.__painel.marcos());
  const tf = Mf.fecho_checkout.primeiro + (Mf.fecho_checkout.ultimo - Mf.fecho_checkout.primeiro) * 0.3;
  await page.evaluate((ms) => window.__painel.seek(ms), tf);
  await espera(1600);
  await foto(page, '22b-rep-fecho-1280', `Reprodução a 1280×720 no meio do fecho da comissão (relógio ${Math.round(tf)} ms), parada`);
  const kc = await page.evaluate(() => window.__painel.cartaoComissao());
  relato.numeros.push({ onde: '22b-rep-fecho-1280', esperado: 'cartão da comissão diz "fechando… (k de N lojistas)"', ok: kc.aberto && /fechando… \(\d+ de \d+ lojistas\)/.test(kc.texto) });
  await ctx.close();
}

// ---------------------------------------------------------------- prefers-reduced-motion
console.log('reduced motion');
{
  const { ctx, page } = await abre('reduzido', { width: 1440, height: 900 }, { reducedMotion: 'reduce' });
  await foto(page, '30-reduzido-resumo', 'prefers-reduced-motion: Resumo');
  await page.click('#b-tocar');
  await espera(400);
  const st = await page.evaluate(() => ({ tocando: window.__painel.tocando(), passos: !document.getElementById('passos').hidden, etapa: window.__painel.estado().etapa }));
  relato.reduzido = { abre_parado: !st.tocando, passo_a_passo: st.passos, etapa: st.etapa };
  await foto(page, '31-reduzido-reproducao', 'prefers-reduced-motion: "Tocar o fechamento" abre no estado final, com passo a passo');
  const cf = await page.evaluate(() => window.__painel.contadores());
  relato.contagens.push({ tela: '31-reduzido-reproducao', ...cf, fecha: cf.total === cf.regra + cf.sinal + cf.pessoa });
  const porPeso = D.eventos.por_peso;
  relato.numeros.push({ onde: 'Reprodução, fim', esperado: `${porPeso.rotina} + ${porPeso.atencao} + ${porPeso.excecao} = ${D.eventos.decisoes}`, ok: cf.total === D.eventos.decisoes && cf.regra === porPeso.rotina && cf.sinal === porPeso.atencao && cf.pessoa === porPeso.excecao });
  await page.click('#b-anterior');
  await espera(300);
  await page.click('#b-anterior');
  await espera(300);
  await foto(page, '32-reduzido-passo-anterior', 'prefers-reduced-motion: dois passos para trás (troca só por opacidade)');
  await ctx.close();
}

// ---------------------------------------------------------------- dark theme
console.log('tema escuro');
{
  const { ctx, page } = await abre('escuro', { width: 1440, height: 900 }, { colorScheme: 'dark' });
  await foto(page, '40-escuro-resumo', 'Tema escuro (prefers-color-scheme): Resumo');
  await page.getByRole('button', { name: rota.lojista, exact: true }).first().click();
  await page.waitForSelector('#gaveta[data-assentado="1"]', { timeout: 10000 });
  await espera(600);
  await foto(page, '41-escuro-mergulho', 'Tema escuro: Mergulho da Rota Global');
  await page.keyboard.press('Escape');
  await page.evaluate(() => window.__painel.seek(25000));
  await espera(350);
  await foto(page, '42-escuro-rep-25s', 'Tema escuro: reprodução em 25 s');
  await ctx.close();
}

} // screens

// ---------------------------------------------------------------- the whole replay at 1x, as video
// Playwright's recordVideo (CDP screencast) only captures the headless window, which Chrome clamps to
// the Mac's usable screen area: the bottom ~88 px of a 900 px viewport come out gray (the studio's
// reference recordings show the same band). So the video is built from full-viewport screenshots
// taken in a loop during the real 1x playback, each frame kept for its real duration.
if (!ARGS.has('--sem-video') && !SO_VIVO) {
  console.log('vídeo da reprodução em 1x (tempo real, quadros por captura de tela)');
  const tmp = fs.mkdtempSync(path.join(SAIDA, '.video-'));
  const { ctx, page } = await abre('video', { width: 1440, height: 900 });
  await page.evaluate(AMOSTRADOR);
  const MR3 = await page.evaluate(() => window.__painel.marcosR3());
  const quadros = [], relogios = [];
  const t0 = Date.now();
  let clique = null, fim = null, i = 0, maiorIntervalo = 0, anterior = 0, maiorEm = null;
  for (;;) {
    const t = Date.now() - t0;
    const nome = `q${String(i).padStart(5, '0')}.jpg`;
    const rel = clique === null ? null : await page.evaluate(() => (document.getElementById('v-rep').hidden ? null : window.__painel.tempo()));
    await page.screenshot({ path: path.join(tmp, nome), type: 'jpeg', quality: 90 });
    quadros.push([nome, t]); relogios.push(rel);
    if (i && t - anterior > maiorIntervalo) { maiorIntervalo = t - anterior; maiorEm = clique === null ? null : anterior - clique; }
    anterior = t; i++;
    if (clique === null && t >= 1500) { clique = Date.now() - t0; await page.click('#b-tocar'); }
    if (clique !== null && fim === null && i % 8 === 0) {
      if (await page.evaluate(() => document.getElementById('v-rep').hidden && !window.__painel.tocando())) fim = Date.now() - t0;
    }
    if (fim !== null && Date.now() - t0 - fim > 2500) break;
    if (t > 240000) break;
  }
  relato.amostra_1x = await page.evaluate(() => window.__amostra);
  await ctx.close();
  // r3: the frames of the notes stage (72 to 78.5 s of the clock: the Casa do Estudante pause, then the
  // sweep) and of the return to the Aurora statement before the Pix item, kept for the strips
  fs.rmSync(QUADROS_R3, { recursive: true, force: true }); fs.mkdirSync(QUADROS_R3, { recursive: true });
  const fx = MR3.linhas.find((x) => x.k === 'foco'), pixT = MR3.linhas.find((x) => x.k === 'pend' && x.t > fx.t).t;
  const tiras = { notas: { de: 72000, ate: 78500, passo: 250, titulo: 'Notas, vídeo em 1x, relógio de 72 a 78,5 s: a pausa da Casa do Estudante e só depois a varredura' },
    extratos: { de: fx.t - 500, ate: pixT + 700, passo: 100, titulo: 'Extratos, vídeo em 1x: fim do lote do Meridiano, a mesa volta à Aurora e só então o Pix entra' } };
  for (const [chave, tira] of Object.entries(tiras)) {
    tira.quadros = [];
    for (let alvo = tira.de; alvo <= tira.ate; alvo += tira.passo) {
      // the last frame captured at or before this clock time
      let k = -1; for (let j = 0; j < relogios.length; j++) if (relogios[j] !== null && relogios[j] <= alvo) k = j;
      if (k < 0 || tira.quadros.some((q) => q.origem === quadros[k][0])) continue;
      const nome = `${chave}-${String(Math.round(relogios[k])).padStart(6, '0')}ms.jpg`;
      fs.copyFileSync(path.join(tmp, quadros[k][0]), path.join(QUADROS_R3, nome));
      tira.quadros.push({ arquivo: nome, origem: quadros[k][0], relogio_ms: Math.round(relogios[k]), video_s: +((quadros[k][1] - quadros[0][1]) / 1000).toFixed(2) });
    }
  }
  fs.writeFileSync(path.join(QUADROS_R3, 'tiras.json'), JSON.stringify(tiras, null, 2));
  const lista = quadros.map(([nome, t], k) => {
    const prox = k + 1 < quadros.length ? quadros[k + 1][1] : t + 40;
    return `file '${nome}'\nduration ${((prox - t) / 1000).toFixed(3)}`;
  }).join('\n') + `\nfile '${quadros[quadros.length - 1][0]}'\n`;
  fs.writeFileSync(path.join(tmp, 'quadros.txt'), lista);
  const mp4 = path.join(SAIDA, 'reproducao-1x.mp4');
  const ff = spawnSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(tmp, 'quadros.txt'),
    '-vf', 'fps=30,format=yuv420p', '-c:v', 'libx264', '-crf', '20', '-movflags', '+faststart', mp4]);
  fs.rmSync(tmp, { recursive: true, force: true });
  const antigo = path.join(SAIDA, 'reproducao-1x.webm');
  if (fs.existsSync(antigo)) fs.rmSync(antigo);
  const total = quadros[quadros.length - 1][1];
  relato.video = {
    mp4: ff.status === 0 ? path.relative(ESTUDIO, mp4) : null, erro_ffmpeg: ff.status === 0 ? null : String(ff.stderr),
    quadros_capturados: quadros.length, quadros_por_segundo_capturados: +(quadros.length / (total / 1000)).toFixed(1),
    maior_intervalo_ms: maiorIntervalo, maior_intervalo_depois_do_clique_ms: maiorEm, clique_em_ms: clique, volta_ao_resumo_em_ms: fim, reproducao_parede_ms: fim - clique,
    nota: 'quadros por captura de tela durante a reprodução real em 1x; cada quadro dura o tempo real até o seguinte; saída a 30 qps',
  };
}

// ---------------------------------------------------------------- the whole replay at 2x, timed on the wall clock
if (!ARGS.has('--sem-video') && !SO_VIVO && !SO_VIDEO) {
  console.log('reprodução em 2x, cronometrada');
  const { ctx, page } = await abre('2x', { width: 1440, height: 900 });
  await page.evaluate(AMOSTRADOR);
  const t0 = Date.now();
  await page.click('#b-tocar');
  await page.click('#b-2x');
  await page.waitForFunction(() => document.getElementById('v-rep').hidden && !window.__painel.tocando(), null, { timeout: 200000, polling: 100 });
  relato.reproducao_2x = { parede_ms: Date.now() - t0, relogio_ms: Math.round(await page.evaluate(() => window.__painel.duracao())) };
  relato.amostra_2x = await page.evaluate(() => window.__amostra);
  await ctx.close();
  for (const [v, a] of [['1x', relato.amostra_1x], ['2x', relato.amostra_2x]]) {
    if (!a) continue;
    relato.numeros.push({ onde: `Reprodução real em ${v}, todo quadro (${a.quadros} quadros)`, esperado: 'decisões = regra + sinalizadas + pessoa; parcial da comissão com "fechando…"; parcial das notas com "emitindo…"', ok: !a.contagem_nao_fecha.length && !a.comissao_sem_fechando.length && !a.notas_sem_emitindo.length });
    relato.numeros.push({ onde: `Reprodução real em ${v}, todo quadro (${a.quadros} quadros)`, esperado: 'nenhum quadro de mesa vazia com o impacto reagindo', ok: !a.mesa_vazia_com_impacto.length });
  }
}

// ---------------------------------------------------------------- live mode against the real server
if (!ARGS.has('--sem-vivo') && !SO_VIDEO) {
  console.log('modo ao vivo (servidor real na porta ' + PORTA + ')');
  const srv = spawn('python3', ['-m', 'src.tarvo.servidor', 'dados', '--porta', String(PORTA), '--sem-navegador'], { cwd: RAIZ_VIVO, stdio: ['ignore', 'pipe', 'pipe'] });
  let log = '';
  srv.stdout.on('data', (b) => { log += b; });
  srv.stderr.on('data', (b) => { log += b; });
  const url = `http://127.0.0.1:${PORTA}/?ao_vivo=1`;
  let ok = false;
  for (let i = 0; i < 50 && !ok; i++) { try { ok = (await fetch(`http://127.0.0.1:${PORTA}/dados`)).ok; } catch { await espera(200); } }
  relato.vivo = { servidor_subiu: ok, raiz: RAIZ_VIVO };
  if (ok) {
    const { ctx, page } = await abre('vivo', { width: 1440, height: 900 }, {}, url);
    await espera(800);
    await foto(page, '50-vivo-espera', 'Ao vivo: antes de rodar (nenhum número antes do motor)');
    const t0 = Date.now();
    await page.getByRole('button', { name: 'Rodar fechamento' }).click();
    await espera(9000);
    await foto(page, '51-vivo-rodando', 'Ao vivo: motor rodando, eventos chegando por SSE');
    await page.waitForFunction(() => /ao vivo/.test(document.getElementById('estado').textContent) && /Fechado/.test(document.getElementById('estado').textContent), null, { timeout: 180000 });
    relato.vivo.rodada_ms = Date.now() - t0;
    await espera(800);
    await foto(page, '52-vivo-fechado', 'Ao vivo: fechamento concluído, Resumo montado com os eventos recebidos');
    await confere(page, 'Ao vivo, Resumo', ESPERADO.resumo, '#v-resumo');
    await page.getByRole('button', { name: rota.lojista, exact: true }).first().click();
    await page.waitForSelector('#gaveta[data-assentado="1"]', { timeout: 10000 });
    await espera(600);
    await foto(page, '53-vivo-mergulho', 'Ao vivo: Mergulho da Rota Global (dados de /dados depois da rodada)');
    await confere(page, 'Ao vivo, Mergulho Rota Global', ESPERADO.rota, '#gaveta');
    await ctx.close();
  }
  srv.kill('SIGINT');
  await new Promise((r) => { srv.on('exit', r); setTimeout(r, 3000); });
  relato.vivo.log = log.split('\n').filter((l) => /servidor\]/.test(l)).slice(0, 6);
}

await browser.close();
if (SO_VIVO) {
  const vivo = { gerado_em: relato.gerado_em, vivo: relato.vivo, telas: relato.telas, console: relato.console, numeros: relato.numeros, proibido: relato.proibido, rolagem_lateral: relato.rolagem_lateral };
  fs.writeFileSync(path.join(SAIDA, 'captura-vivo.json'), JSON.stringify(vivo, null, 2));
} else if (SO_VIDEO) {
  const anterior = JSON.parse(fs.readFileSync(path.join(SAIDA, 'captura.json'), 'utf8'));
  anterior.video = relato.video; anterior.console = anterior.console.concat(relato.console);
  // r3: the per-frame sampler of the 1x playback travels with the video
  if (relato.amostra_1x) {
    const a = relato.amostra_1x;
    anterior.amostra_1x = a;
    anterior.numeros = anterior.numeros.filter((n) => !/^Reprodução real em 1x/.test(n.onde));
    anterior.numeros.push({ onde: `Reprodução real em 1x, todo quadro (${a.quadros} quadros)`, esperado: 'decisões = regra + sinalizadas + pessoa; parcial da comissão com "fechando…"; parcial das notas com "emitindo…"', ok: !a.contagem_nao_fecha.length && !a.comissao_sem_fechando.length && !a.notas_sem_emitindo.length });
    anterior.numeros.push({ onde: `Reprodução real em 1x, todo quadro (${a.quadros} quadros)`, esperado: 'nenhum quadro de mesa vazia com o impacto reagindo', ok: !a.mesa_vazia_com_impacto.length });
  }
  fs.writeFileSync(path.join(SAIDA, 'captura.json'), JSON.stringify(anterior, null, 2));
} else fs.writeFileSync(path.join(SAIDA, 'captura.json'), JSON.stringify(relato, null, 2));
for (const c of relato.contagens) if (!c.fecha) console.log('  CONTAGEM NÃO FECHA: ' + c.tela + ' ' + JSON.stringify(c));
if (relato.pausas) console.log(`  pausas: ${relato.pausas.itens} itens, menor sobra ${relato.pausas.menor_sobra_ms} ms; reprodução ${relato.reproducao.duracao_ms} ms`);
for (const f of relato.fluxo) console.log(`  fluxo ${f.tela}: cadeia ${f.cadeia_assenta_ms} + leitura ${f.leitura_cadeia_ms} + filtro ${f.filtro_responde_ms} + lista ${f.leitura_lista_ms} = ${f.total_ms} ms`);
if (relato.varredura) console.log(`  varredura: ${relato.varredura.amostras} amostras, contagem que não fecha ${relato.varredura.contagem_nao_fecha.length}, parcial sem "fechando…" ${relato.varredura.parcial_sem_fechando.length} (de ${relato.varredura.com_fecho_aberto} com lojista aberto)`);
for (const x of relato.pausas_fecho || []) console.log(`  ${x.tela} (${x.relogio_ms} ms): ${x.ok ? 'ok' : 'FALHA'} · ${x.textos[x.textos.length - 1]}`);
for (const x of relato.projecao_rep || []) console.log(`  ${x.tela}: lado a lado ${x.lado_a_lado}, contagem ${x.contagem_visivel}, decisão ${x.primeira_decisao_visivel}, cortadas ${x.celulas_cortadas.length}, selos ${x.selos_cortados}, linhas ${x.linhas_mesa}, motor ${x.linha_do_motor_px} px`);
for (const x of relato.mundo_aberto || []) console.log(`  Mundo Aberto ${x.tela}: base ${x.base} = ${x.cad} × ${x.ptax} (${x.base_confere}); ${x.base} × (${x.aplicado_pct} − ${x.contrato_pct})% = ${x.diferenca} (${x.diferenca_confere}); dono sem rolar ${x.dono_visivel_sem_rolar}`);
if (relato.contagem_rota_resumo) console.log('  contagem Rota Global: ' + JSON.stringify(relato.contagem_rota_resumo));
if (relato.reproducao_2x) console.log('  2x: ' + JSON.stringify(relato.reproducao_2x));
for (const x of relato.pausas_notas || []) console.log(`  ${x.tela}: ${x.cartao} · olhar ${x.olhar} · estável ${x.estavel}`);
for (const x of relato.projecao_r3 || []) console.log(`  ${x.tela}: foco ${x.foco ? x.foco.linhas + ' linhas, inteiro ' + x.foco.inteiro : '-'}, folga ${x.folga_px}, linhas ${x.linhas_mesa}, selo ${x.selo_linhas}`);
if (relato.projecao_r3_relogio) console.log('  projeção 1280, relógio: ' + JSON.stringify({ amostras: relato.projecao_r3_relogio.amostras, com_olhar: relato.projecao_r3_relogio.com_olhar, cortadas: relato.projecao_r3_relogio.cortadas.length, folga_min: relato.projecao_r3_relogio.folga_minima_px, pulos: relato.projecao_r3_relogio.pulos.length }));
for (const v of ['amostra_1x', 'amostra_2x']) if (relato[v]) console.log(`  ${v}: ${relato[v].quadros} quadros; contagem ${relato[v].contagem_nao_fecha.length}, comissão ${relato[v].comissao_sem_fechando.length}, notas ${relato[v].notas_sem_emitindo.length}, mesa vazia ${relato[v].mesa_vazia_com_impacto.length}`);
for (const x of (relato.r4 || { telas: [] }).telas) console.log(`  r4 ${x.tela}: ${x.itens} pendências, ${x.que_quebram.length} em duas linhas (${x.que_quebram.join('; ')}); valores ${x.valores_numa_borda}, selos ${x.selos_numa_borda}; faixa ${x.faixa.caixas.length} elos, transborda ${x.faixa.caixa_transborda}`);
if (relato.video) console.log('  vídeo: ' + JSON.stringify({ parede: relato.video.reproducao_parede_ms, qps: relato.video.quadros_por_segundo_capturados, maior: relato.video.maior_intervalo_ms }));
const falhas = relato.numeros.filter((n) => !n.ok);
console.log(`\n${relato.telas.length} telas · console: ${relato.console.length ? relato.console.length + ' mensagens' : 'sem erros nem avisos'} · números: ${relato.numeros.length - falhas.length}/${relato.numeros.length} · linguagem do motor na camada principal: ${relato.proibido.length} · rolagem lateral: ${relato.rolagem_lateral.length}`);
for (const f of falhas) console.log('  NÃO BATEU: ' + f.onde + ': ' + f.esperado + (f.visto !== undefined ? ' (visto ' + f.visto + ')' : ''));
for (const p of relato.proibido) console.log('  PROIBIDO: ' + p);
for (const c of relato.console) console.log('  CONSOLE: ' + c);
for (const r of relato.rolagem_lateral) console.log('  ROLAGEM: ' + r);
