"""Build estudio/dados/fechamento.json from the engine output and the case files.

Every number the film shows comes from here. Each value carries its source, so the
Critic can check a frame against a file. Nothing is typed by hand.

Usage (from the repository root, after `python3 -m src.tarvo dados`):
    python3 estudio/scripts/extrair_dados.py
"""

import collections
import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SAIDA = ROOT / "saida"
REL = ROOT / "relatorio"
DADOS = ROOT / "dados"
OUT = ROOT / "estudio" / "dados" / "fechamento.json"


def read_csv(path, delimiter=";"):
    with open(path, newline="", encoding="utf-8") as fh:
        return list(csv.DictReader(fh, delimiter=delimiter))


def br_float(text):
    return float(text.replace(".", "").replace(",", "."))


def src(path, line=None, note=None):
    out = {"arquivo": str(path.relative_to(ROOT))}
    if line is not None:
        out["linha"] = line
    if note:
        out["nota"] = note
    return out


def main():
    execucao = json.loads((REL / "execucao.json").read_text(encoding="utf-8"))
    resumo = execucao["resumo"]
    events = [json.loads(l) for l in (REL / "eventos.jsonl").read_text(encoding="utf-8").splitlines() if l.strip()]

    decisions = [e for e in events if e.get("tipo") == "decisao"]
    by_weight = collections.Counter(e.get("peso") for e in decisions)
    by_front = collections.Counter(e.get("frente") for e in decisions)
    by_method = collections.Counter(e.get("metodo") for e in decisions)

    # The engine emits checkout and bank-statement pending items last, under the PENDENCIAS front.
    # On screen each decision belongs to the stage of the file that produced it.
    stage_of_file = {"01": "CHECKOUT", "06": "CHECKOUT", "02": "CHECKOUT", "03": "REMESSA", "04": "EXTRATOS", "05": "EXTRATOS"}
    by_stage = collections.Counter()
    for e in decisions:
        front = e.get("frente")
        if front == "PENDENCIAS":
            front = stage_of_file[e["fonte"]["arquivo"][:2]]
        by_stage[front] += 1

    pend = read_csv(SAIDA / "pendencias.csv")
    owners = collections.Counter(p["quem_decide"] for p in pend)

    div = read_csv(SAIDA / "divergencias_taxa.csv")
    div1 = div[0]
    orbe_path = DADOS / "01_orbe_relatorio_comissoes_set2026.csv"
    orbe_lines = orbe_path.read_text(encoding="utf-8").splitlines()
    header = orbe_lines[0].split(";")
    origin_idx = next(i for i, l in enumerate(orbe_lines) if l.startswith(div1["ref_origem"] + ";"))
    origin = dict(zip(header, orbe_lines[origin_idx].split(";")))

    pen1 = next(p for p in pend if p["id_saida"] == "PEN-0001")
    # PEN-0001 groups sales and refunds charged at the wrong rate: count each kind.
    div_store = [d for d in div if d["lojista"] == div1["lojista"]]
    div_causes = collections.Counter(d["causa_divergencia"] for d in div_store)
    pen4 = next(p for p in pend if p["id_saida"] == "PEN-0004")
    atlas_ec = re.search(r"EC (\d+)", pen4["motivo"]).group(1)
    orbe_rows = read_csv(orbe_path)
    # PEN-0004 groups every Atlas line (sales, prepayments, reversals, refunds), not only sales.
    atlas_rows = [r for r in orbe_rows if r["cod_estabelecimento"] == atlas_ec]
    atlas_sales = [r for r in atlas_rows if r["tipo_lancamento"] == "VENDA"]
    atlas_fee = round(sum(br_float(r["valor_taxa"]) for r in atlas_rows), 2)

    lanc = read_csv(SAIDA / "lancamentos_classificados.csv")
    notas = read_csv(SAIDA / "notas_a_emitir.csv")
    rules = sorted(set(re.findall(r"\b[FL]\d+\b", (ROOT / "REGRAS.md").read_text(encoding="utf-8"))))

    data = {
        "gerado_de": src(REL / "execucao.json"),
        "executado_em": execucao["executado_em"],
        "duracao_s": {"valor": resumo["duracao_s"], "fonte": src(REL / "execucao.json")},
        "arquivos": [{"arquivo": a["arquivo"], "linhas": a["linhas"]} for a in execucao["arquivos"]],
        "regras_escritas": {"valor": len(rules), "fonte": src(ROOT / "REGRAS.md", note="códigos F e L distintos")},
        "regras_do_financeiro": {
            "valor": len([r for r in rules if r.startswith("F")]),
            "fonte": src(ROOT / "REGRAS.md", note="códigos F distintos: respostas do financeiro no canal do case"),
        },
        "eventos": {
            "total": len(events),
            "decisoes": len(decisions),
            "por_peso": dict(by_weight),
            "por_frente": dict(by_front),
            "por_etapa": {k: by_stage[k] for k in ("CHECKOUT", "REMESSA", "NOTAS", "EXTRATOS")},
            "nota_por_etapa": "PENDENCIAS do motor redistribuída pela etapa do arquivo de origem; é a contagem que o painel mostra",
            "por_metodo": dict(by_method),
            "fonte": src(REL / "eventos.jsonl"),
        },
        "comissao": {
            "checkout": resumo["comissao_checkout"],
            "remessa": resumo["comissao_remessa"],
            "fonte": src(REL / "execucao.json"),
        },
        "notas": {"quantidade": len(notas), "total_brl": resumo["notas_brl"], "fonte": src(SAIDA / "notas_a_emitir.csv")},
        "lancamentos": {
            "quantidade": len(lanc),
            "por_banco": dict(collections.Counter(r["banco"] for r in lanc)),
            "por_metodo": dict(collections.Counter(r["metodo"] for r in lanc)),
            "fonte": src(SAIDA / "lancamentos_classificados.csv"),
        },
        "rastro_um_numero": {
            "lojista": div1["lojista"],
            "data_venda": origin["data_movimento"],
            "valor_bruto": br_float(origin["valor_bruto"]),
            "parcelas": int(origin["qtd_parcelas"]),
            "taxa_contratada_pct": float(div1["taxa_contratada_pct"]),
            "taxa_aplicada_pct": float(div1["taxa_aplicada_pct"]),
            "diferenca_brl": float(div1["diferenca_brl"]),
            "vendas_com_divergencia": len(pen1["ref_origem"].split("|")),
            "operacoes_com_divergencia": len(div_store),
            "operacoes_por_causa": dict(div_causes),
            "nota_operacoes": "as 87 operações são vendas e estornos; não dizer 87 vendas",
            "total_a_cobrar_brl": float(pen1["valor_brl"]),
            "quem_decide": pen1["quem_decide"],
            "linha_origem_texto": orbe_lines[origin_idx],
            "fontes": {
                "divergencia": src(SAIDA / "divergencias_taxa.csv", 2),
                "linha_origem": src(orbe_path, origin_idx + 1),
                "pendencia": src(SAIDA / "pendencias.csv", 2),
            },
        },
        "dinheiro_em_jogo": {
            "taxa_acima_do_contrato": {
                "total": resumo["divergencias_brl"],
                "cobrar_orbe": resumo["divergencia_orbe"],
                "contestar_ponte": resumo["divergencia_ponte"],
                "fonte": src(REL / "execucao.json"),
            },
            "devolver_casa_do_estudante": {"valor": resumo["devolucao_casa"], "fonte": src(SAIDA / "pendencias.csv", 4)},
            "atlas": {
                "bruto_lancamentos": resumo["atlas_bruto_sem_faturar"],
                "lancamentos": len(atlas_rows),
                "vendas": len(atlas_sales),
                "bruto_vendas": round(sum(br_float(r["valor_bruto"]) for r in atlas_sales), 2),
                "taxa_estimada": atlas_fee,
                "fonte_bruto": src(SAIDA / "pendencias.csv", 5, note="soma das 57 linhas, não só vendas"),
                "fonte_taxa": src(orbe_path, note=f"soma de valor_taxa das linhas do EC {atlas_ec}; estimativa, faturada em outubro"),
            },
        },
        "pendencias": {
            "quantidade": len(pend),
            "por_dono": dict(owners),
            "itens": [
                {"id": p["id_saida"], "tipo": p["tipo"], "valor_brl": float(p["valor_brl"]), "quem_decide": p["quem_decide"], "motivo": p["motivo"]}
                for p in pend
            ],
            "fonte": src(SAIDA / "pendencias.csv"),
        },
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{OUT.relative_to(ROOT)}: {len(events)} eventos, {len(pend)} pendências, Atlas {len(atlas_rows)} linhas ({len(atlas_sales)} vendas)")


if __name__ == "__main__":
    main()
