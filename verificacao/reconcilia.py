"""Reconcile the delivered close against the month files. Exit 0 only if every check passes.

Usage, from the repository root (defaults: dados/, saida/, relatorio/ of this repository):

    python3 verificacao/reconcilia.py [pasta_mes] [--saida saida] [--relatorio relatorio]

Two kinds of check, printed one per line:

- completeness: every number in saida/ is the sum of its rastro.csv lines, and the month summary
  (execucao.json, the `fim` event) is the sum of the CSVs;
- source: the headline totals and every divergence line are recomputed from the month files with
  readers of their own (this script never imports the engine), from the rules in REGRAS.md.

Standard library only, Python 3.8+. A failure exits 1 and says what was expected.
"""
from __future__ import annotations

import argparse
import csv
import datetime as dt
import email
import io
import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from collections import defaultdict
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
CENT = Decimal("0.01")
ZERO = Decimal("0")
NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
      "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
      "p": "http://schemas.openxmlformats.org/package/2006/relationships"}
# Constants of the rules, as REGRAS.md states them.
ATLAS_EC = "1076801732"  # F7: no contracted rate, out of commission and notes
CASA_EC = "1018325654"  # F9/F68: zero rate from 01/09 to 31/12
CASA_DE, CASA_ATE = dt.date(2026, 9, 1), dt.date(2026, 12, 31)
SEM_CADASTRO = {"1043300981": "Novo Horizonte Intercambio", "1043396662": "Horizonte Viagens",
                "1038867654": "Kiwi Experience"}  # F6: EC without registration -> sheet name
SPREAD_PADRAO = Decimal("0.015")  # F16
TOLERANCIA_SPREAD = Decimal("0.0005")  # F22: 0,05 pp
COLUNAS_ORBE = ("id_transacao", "data_movimento", "cod_estabelecimento", "nome_estabelecimento",
                "tipo_lancamento", "modalidade", "qtd_parcelas", "valor_bruto", "taxa_aplicada_pct",
                "valor_taxa", "id_referencia", "data_venda_original")  # F71: other columns, missing file
VALOR = {"comissoes_por_lojista.csv": "comissao_brl", "divergencias_taxa.csv": "diferenca_brl",
         "notas_a_emitir.csv": "valor_brl", "lancamentos_classificados.csv": "valor",
         "pendencias.csv": "valor_brl"}


def r2(x: Decimal) -> Decimal:
    return x.quantize(CENT, rounding=ROUND_HALF_UP)


def br(s: str) -> Decimal:
    s = (s or "").strip()
    return Decimal(s.replace(".", "").replace(",", ".")) if "," in s else Decimal(s or "0")


def data_br(s: str):
    s = (s or "").strip()
    return dt.datetime.strptime(s, "%d/%m/%Y").date() if s else None


def so_digitos(s: str) -> str:
    d = re.sub(r"\D", "", s or "")
    return d.zfill(14) if d else ""


# ---------------------------------------------------------------- readers of the month files

def xlsx(data: bytes) -> dict:
    """Sheets by name, each a list of {column letter: text}, sheets resolved through the rels."""
    z = zipfile.ZipFile(io.BytesIO(data))
    shared = []
    if "xl/sharedStrings.xml" in z.namelist():
        for si in ET.fromstring(z.read("xl/sharedStrings.xml")).findall("m:si", NS):
            shared.append("".join(t.text or "" for t in si.iter("{%s}t" % NS["m"])))
    rels = {r.get("Id"): r.get("Target") for r in
            ET.fromstring(z.read("xl/_rels/workbook.xml.rels")).findall("p:Relationship", NS)}
    out = {}
    for sh in ET.fromstring(z.read("xl/workbook.xml")).find("m:sheets", NS):
        target = rels[sh.get("{%s}id" % NS["r"])].lstrip("/")
        path = target if target.startswith("xl/") else "xl/" + target
        rows = []
        for row in ET.fromstring(z.read(path)).iter("{%s}row" % NS["m"]):
            cells = {}
            for c in row.findall("m:c", NS):
                v = c.find("m:v", NS)
                if c.get("t") == "s" and v is not None:
                    text = shared[int(v.text)]
                elif c.get("t") == "inlineStr":
                    text = "".join(t.text or "" for t in c.iter("{%s}t" % NS["m"]))
                else:
                    text = v.text if v is not None else ""
                cells[re.sub(r"\d", "", c.get("r"))] = text
            rows.append(cells)
        out[sh.get("name")] = rows
    return out


def um(pasta: Path, prefixo: str):
    hits = sorted(pasta.glob(prefixo + "*"))
    return hits[0] if hits else None


def orbe(pasta: Path) -> list:
    """Lines of 01 and then 06; a 06 id already in 01 is left out (F76).

    A file missing or with other columns is out (F71); without the 01, the 06 is out too: late
    adjustments only make sense on top of the main report (F76).
    """
    linhas, vistos = [], set()
    for prefixo in ("01_", "06_"):
        f = um(pasta, prefixo)
        texto = f.read_bytes().decode("utf-8-sig", errors="replace") if f else ""
        leitor = csv.DictReader(texto.splitlines(), delimiter=";")
        if f is None or any(c not in (leitor.fieldnames or []) for c in COLUNAS_ORBE):
            if prefixo == "01_":
                return []
            continue
        for r in leitor:
            if r.get("id_transacao") and r["id_transacao"] not in vistos:
                vistos.add(r["id_transacao"])
                linhas.append(r)
    return linhas


def contratos(pasta: Path) -> list:
    """Rows of the current tab; none without the sheet or the tab (F71)."""
    f = um(pasta, "02_")
    folha = xlsx(f.read_bytes()).get("Taxas vigentes", []) if f else []
    out = []
    for c in folha:
        if not c.get("A") or not c.get("B") or c.get("A") == "Lojista":
            continue
        vig = (c.get("K") or "").strip()
        de, ate = dt.date(2000, 1, 1), dt.date(2999, 12, 31)
        m = re.search(r"\d{2}/\d{2}/\d{4}", vig)
        if m and "até" in vig:
            ate = data_br(m.group(0))
        elif m:
            de = data_br(m.group(0))

        def taxa(col):
            s = (c.get(col) or "").strip()
            if not s or s.lower() == "padrão":
                return None
            return Decimal(s[:-1].replace(",", ".")) / 100 if s.endswith("%") else Decimal(s)

        out.append({"nome": c["A"], "cnpj": so_digitos(c["B"]), "ec": (c.get("C") or "").strip(),
                    "de": de, "ate": ate, **{col: taxa(col) for col in "DEFGHIJ"}})
    return out


def ponte(pasta: Path) -> list:
    """Operations of the e-mail attachment; none without the file, the attachment or the header (F71)."""
    f = um(pasta, "03_")
    if f is None:
        return []
    msg = email.message_from_bytes(f.read_bytes())
    anexo = next((p for p in msg.walk() if (p.get_filename() or "").endswith(".xlsx")), None)
    linhas = next(iter(xlsx(anexo.get_payload(decode=True)).values())) if anexo else []
    cab = next((r for r in linhas if r.get("A") == "Nº Operação"), None)
    if cab is None:
        return []
    col = {v: k for k, v in cab.items()}
    obs = col.get("Observação", "P")
    out = []
    for r in linhas:
        if (r.get("A") or "").startswith("PC-"):
            o = {n: r.get(col[n], "") for n in ("Nº Operação", "CNPJ Cliente", "Valor ME", "PTAX Ref.",
                                                "Spread R$", "Spread %")}
            o["Observação"] = r.get(obs, "") or ""
            out.append(o)
    return out


def lancamentos_dos_extratos(pasta: Path) -> int:
    n = 0
    f = um(pasta, "05a_")
    if f:
        linhas = f.read_bytes().decode("utf-8-sig", errors="replace").splitlines()
        cab = next(i for i, l in enumerate(linhas) if l.startswith("Data;"))
        for l in linhas[cab + 1:]:
            p = l.split(";")
            n += len(p) >= 4 and bool(re.match(r"\d{2}/\d{2}/\d{4}", p[0])) and bool(p[3].strip())
    f = um(pasta, "05b_")
    if f:
        n += len(re.findall(r"<STMTTRN>", f.read_bytes().decode("cp1252", errors="replace")))
    return n


# ---------------------------------------------------------------- the rules, recomputed

def coluna(r: dict) -> str:
    if "ANTECIPACAO" in r["tipo_lancamento"]:
        return "I"
    mod = r["modalidade"]
    if mod in ("DEBITO", "PIX", "CREDITO A VISTA"):
        return {"DEBITO": "D", "PIX": "H", "CREDITO A VISTA": "E"}[mod]
    return "F" if int(r["qtd_parcelas"] or 1) <= 6 else "G"


def checkout(linhas: list, tabela: list) -> dict:
    """Commission per CNPJ (F1/F30), divergence per line (F11) and the Casa refund (F72)."""
    com, div, casa, atlas, atlas_taxa = defaultdict(lambda: ZERO), {}, ZERO, ZERO, ZERO
    if not tabela:  # F71: no contracted rate without the sheet; the lines go to a pendência
        linhas = []
    for r in linhas:
        ec, bruto = r["cod_estabelecimento"].strip(), br(r["valor_bruto"])
        if ec == ATLAS_EC:
            atlas += bruto
            atlas_taxa += br(r["valor_taxa"])  # reference only: what the Orbe deducted
            continue
        if int(r["qtd_parcelas"] or 0) > 12:  # F60
            continue
        reversa = r["tipo_lancamento"] in ("ESTORNO", "REVERSAO ANTECIPACAO") and r["data_venda_original"]
        quando = data_br(r["data_venda_original"] if reversa else r["data_movimento"])  # F3/F66
        nome = SEM_CADASTRO.get(ec)
        c = next((c for c in tabela if (c["ec"] == ec or (nome and c["nome"] == nome))
                  and c["de"] <= quando <= c["ate"]), None)
        if c is None:
            continue
        taxa = c[coluna(r)]
        isenta = ec == CASA_EC and CASA_DE <= quando <= CASA_ATE
        if isenta:
            taxa = ZERO
        comissao = r2(bruto * taxa)
        com[c["cnpj"]] += comissao
        if isenta:
            casa += r2(br(r["valor_taxa"]) - comissao)
            continue
        contratada, aplicada = (taxa * 100).quantize(CENT), br(r["taxa_aplicada_pct"])
        if aplicada != contratada:
            div[r["id_transacao"]] = r2(bruto * (aplicada - contratada) / 100)
    return {"comissao": dict(com), "divergencia": div, "casa": casa, "atlas": atlas, "atlas_taxa": atlas_taxa}


def remessa(ops: list, tabela: list) -> dict:
    """50% of the realized spread per operation (F12/F13), divergence above contract (F14/F15)."""
    com, div, base, vistos = defaultdict(lambda: ZERO), {}, {}, set()
    for o in ops:
        op = o["Nº Operação"]
        if op in vistos:  # F18
            continue
        vistos.add(op)
        spread = r2(Decimal(o["Spread R$"]))
        cnpj = so_digitos(o["CNPJ Cliente"])
        if "AJUSTE REF" in (o.get("Observação") or "").upper():  # F69: half, whatever the sign
            com[cnpj] += r2(spread / 2)
            continue
        if spread < 0:  # F17/F65: out of commission and note
            continue
        com[cnpj] += r2(spread / 2)
        if not tabela:  # F71: the contracted spread is unknown without the sheet
            continue
        c = [c for c in tabela if c["cnpj"] == cnpj]
        contratado = c[-1]["J"] if c and c[-1]["J"] is not None else SPREAD_PADRAO
        me, ptax = Decimal(o["Valor ME"]), Decimal(o["PTAX Ref."])
        if Decimal(o["Spread %"]) - contratado > TOLERANCIA_SPREAD:
            div[op] = r2(spread - r2(me * ptax * contratado))
            base[op] = r2(me * ptax)
    return {"comissao": dict(com), "divergencia": div, "base": base}


# ---------------------------------------------------------------- checks

class Conferencia:
    def __init__(self):
        self.falhas = 0

    def igual(self, descricao: str, esperado, saiu) -> None:
        if esperado == saiu:
            print(f"ok      {descricao}")
        else:
            self.falhas += 1
            print(f"FALHOU  {descricao}: esperado {esperado}, saiu {saiu}")


def ler(saida: Path, nome: str) -> list:
    with open(saida / nome, newline="", encoding="utf-8") as fh:
        return list(csv.DictReader(fh, delimiter=";"))


def soma(valores) -> Decimal:
    return sum((Decimal(str(v)) for v in valores), ZERO)


def parciais(ok: Conferencia, eventos: list, resumo: dict) -> None:
    """The running values the page shows end where the month summary says (soma dos parciais = total)."""
    print("Completude: os parciais que a página mostra fecham no total")
    totais = [e for e in eventos if e["tipo"] == "total"]
    for frente in ("CHECKOUT", "REMESSA"):
        lojistas = [e for e in totais if e.get("escopo") == "lojista" and e["frente"] == frente]
        corrido, fora = ZERO, []
        for e in lojistas:
            corrido += Decimal(str(e["valor"]))
            if Decimal(str(e["parcial"]["frente"]["valor"])) != corrido:
                fora.append(e["id_saida"])
        ok.igual(f"{frente}: cada soma corrida é a soma dos lojistas já fechados", [], fora)
        fim = [Decimal(str(e["valor"])) for e in totais if e.get("escopo") == "frente" and e["frente"] == frente]
        # a front with no merchant emits no front total (nothing closed)
        ok.igual(f"{frente}: soma dos lojistas = total da frente = resumo", [corrido] * (2 if lojistas else 1),
                 fim + [Decimal(str(resumo["comissao_" + frente.lower()]))])
    notas = [e for e in eventos if e["tipo"] == "decisao" and e["resultado"] == "nota"]
    ok.igual("notas: a última soma corrida é o total das notas",
             Decimal(str(resumo["notas_brl"])), Decimal(str(notas[-1]["parcial"]["frente"]["valor"])) if notas else ZERO)
    por_etapa = {}
    for e in eventos:
        if e["tipo"] == "decisao":
            p = e["parcial"]["etapa"]
            por_etapa[e["etapa"]] = {"total": p["k"], "regra": p["regra"], "sinalizadas": p["sinalizadas"],
                                     "pessoa": p["pessoa"]}
    ok.igual("contagem da última decisão de cada etapa = resumo por etapa", resumo["decisoes_por_etapa"], por_etapa)
    pend = [e for e in eventos if e["tipo"] == "decisao" and e["resultado"] == "pendencia"]
    if pend:
        jogo = {k: Decimal(str(v)) for k, v in pend[-1]["parcial"]["mes"]["em_jogo"].items()}
        ok.igual("dinheiro em jogo, no fim = resumo",
                 {k: Decimal(str(resumo[r])) for k, r in (("orbe", "divergencia_orbe"), ("ponte", "divergencia_ponte"),
                                                         ("devolver_casa", "devolucao_casa"),
                                                         ("atlas_estimativa", "atlas_estimativa"))},
                 {k: jogo[k] for k in ("orbe", "ponte", "devolver_casa", "atlas_estimativa")})
        ok.igual("pendências por dono, no fim = resumo", resumo["pendencias_por_dono"], pend[-1]["parcial"]["mes"]["por_dono"])


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="Reconcilia o fechamento entregue com os arquivos do mês.")
    ap.add_argument("pasta_mes", nargs="?", default=str(REPO / "dados"))
    ap.add_argument("--saida", default=str(REPO / "saida"))
    ap.add_argument("--relatorio", default=str(REPO / "relatorio"))
    a = ap.parse_args(argv)
    pasta, saida, rel = Path(a.pasta_mes), Path(a.saida), Path(a.relatorio)
    ok = Conferencia()
    csvs = {n: ler(saida, n) for n in VALOR}
    rastro = defaultdict(lambda: ZERO)
    for r in ler(saida, "rastro.csv"):
        rastro[r["id_saida"]] += Decimal(r["valor"])
    with open(rel / "execucao.json", encoding="utf-8") as fh:
        resumo = json.load(fh)["resumo"]
    with open(rel / "eventos.jsonl", encoding="utf-8") as fh:
        eventos = [json.loads(l) for l in fh if l.strip()]

    print("Completude: cada número é a soma das linhas de origem no rastro.csv")
    fora = [(n, r["id_saida"], r[col], f"{rastro[r['id_saida']]:.2f}") for n, col in VALOR.items()
            for r in csvs[n] if Decimal(r[col]) != rastro[r["id_saida"]]]
    ok.igual(f"rastro.csv soma o valor de {sum(len(v) for v in csvs.values())} linhas de saída", [], fora)

    com = csvs["comissoes_por_lojista.csv"]
    div = csvs["divergencias_taxa.csv"]
    notas = csvs["notas_a_emitir.csv"]
    agregado = {
        "comissao_checkout": soma(c["comissao_brl"] for c in com if c["linha_negocio"] == "CHECKOUT"),
        "comissao_remessa": soma(c["comissao_brl"] for c in com if c["linha_negocio"] == "REMESSA"),
        "divergencias_brl": soma(d["diferenca_brl"] for d in div),
        "divergencia_orbe": soma(d["diferenca_brl"] for d in div if d["linha_negocio"] == "CHECKOUT"),
        "divergencia_ponte": soma(d["diferenca_brl"] for d in div if d["linha_negocio"] == "REMESSA"),
        "notas_brl": soma(n["valor_brl"] for n in notas),
        "notas": len(notas),
        "pendencias": len(csvs["pendencias.csv"]),
        "lancamentos": len(csvs["lancamentos_classificados.csv"]),
    }
    print("Completude: o resumo do mês é a soma dos CSVs")
    for k, v in agregado.items():
        ok.igual(f"execucao.json {k} = soma dos CSVs", v, Decimal(str(resumo[k])) if isinstance(v, Decimal) else resumo[k])
    fim = next(e for e in eventos if e["tipo"] == "fim")
    ok.igual("evento fim traz o mesmo resumo de execucao.json", resumo, fim["resumo"])
    decisoes = [e for e in eventos if e["tipo"] == "decisao"]
    pesos = {p: sum(e.get("peso") == p for e in decisoes) for p in ("rotina", "atencao", "excecao")}
    ok.igual(f"decisões = regra + sinalizadas + pessoa ({pesos['rotina']} + {pesos['atencao']} + {pesos['excecao']})",
             len(decisoes), sum(pesos.values()))
    ok.igual("cada pendência é uma decisão para uma pessoa",
             sorted(p["id_saida"] for p in csvs["pendencias.csv"]),
             sorted(e["id_saida"] for e in decisoes if e.get("peso") == "excecao"))

    print("Fonte: os totais recalculados dos arquivos do mês, sem o motor")
    tabela = contratos(pasta)
    ck = checkout(orbe(pasta), tabela)
    rm = remessa(ponte(pasta), tabela)
    por_cnpj = {(c["cnpj"], c["linha_negocio"]): Decimal(c["comissao_brl"]) for c in com}
    ok.igual("comissão de checkout por lojista", {k: v for k, v in ck["comissao"].items()},
             {k[0]: v for k, v in por_cnpj.items() if k[1] == "CHECKOUT"})
    ok.igual("comissão de remessa por lojista", rm["comissao"],
             {k[0]: v for k, v in por_cnpj.items() if k[1] == "REMESSA"})
    ok.igual("comissão de checkout do mês", soma(ck["comissao"].values()), Decimal(str(resumo["comissao_checkout"])))
    ok.igual("comissão de remessa do mês", soma(rm["comissao"].values()), Decimal(str(resumo["comissao_remessa"])))
    ok.igual("divergência linha a linha, checkout (F11)", ck["divergencia"],
             {d["ref_origem"]: Decimal(d["diferenca_brl"]) for d in div if d["linha_negocio"] == "CHECKOUT"})
    ok.igual("divergência linha a linha, remessa (F15/F95)", rm["divergencia"],
             {d["ref_origem"]: Decimal(d["diferenca_brl"]) for d in div if d["linha_negocio"] == "REMESSA"})
    if div and "base_brl" in div[0]:
        ok.igual("base da divergência de spread = Valor ME x PTAX Ref.", rm["base"],
                 {d["ref_origem"]: Decimal(d["base_brl"]) for d in div if d["linha_negocio"] == "REMESSA"})
    ok.igual("a cobrar da Orbe", soma(ck["divergencia"].values()), Decimal(str(resumo["divergencia_orbe"])))
    ok.igual("a contestar com a Ponte", soma(rm["divergencia"].values()), Decimal(str(resumo["divergencia_ponte"])))
    ok.igual("a devolver à Casa do Estudante (F72)", ck["casa"], Decimal(str(resumo["devolucao_casa"])))
    ok.igual("bruto da Atlas, sem faturar (F67)", ck["atlas"], Decimal(str(resumo["atlas_bruto_sem_faturar"])))
    positivas = [v for v in ck["comissao"].values() if v > 0]  # F5: zero or negative has no note
    ok.igual("notas a emitir: lojistas com comissão positiva e a nota única da Ponte",
             (len(positivas) + bool(rm["comissao"]), soma(positivas) + soma(rm["comissao"].values())),
             (resumo["notas"], Decimal(str(resumo["notas_brl"]))))
    ok.igual("lançamentos: uma classificação por linha dos dois extratos", lancamentos_dos_extratos(pasta),
             resumo["lancamentos"])
    if "atlas_estimativa" in resumo:
        ok.igual("estimativa da Atlas: a taxa que a Orbe descontou", ck["atlas_taxa"],
                 Decimal(str(resumo["atlas_estimativa"])))

    if "decisoes_por_etapa" in resumo:
        parciais(ok, eventos, resumo)

    print(f"{ok.falhas} falha(s)." if ok.falhas else "Tudo reconcilia.")
    return 1 if ok.falhas else 0


if __name__ == "__main__":
    sys.exit(main())
