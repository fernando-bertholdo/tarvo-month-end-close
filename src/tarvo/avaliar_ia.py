"""Offline check of the AI stage against entries the rules already classify.

Usage: python3 -m src.tarvo.avaliar_ia [--porta api|claude-code] [--n 40]
Sends a stratified sample (by rule account) without the account, to a separate cache,
and compares the AI answer with the rule answer.
"""
import argparse
import csv
import io
import os
from collections import defaultdict
from datetime import date
from decimal import Decimal
from pathlib import Path

from . import ia

ROOT = Path(__file__).resolve().parents[2]
EVAL_CACHE = "/private/tmp/claude-501/-Users-fernandobertholdo-tech-projects-Barte-desafio-real-tarvo-month-end-close/96a01339-e39b-4cc6-a9f5-8baad3c105d3/scratchpad/ia_eval_cache.json"


def load_plano() -> dict:
    f04 = next((ROOT / "dados").glob("04_*"), None)
    rows = list(csv.DictReader(io.StringIO(f04.read_bytes().decode("latin-1")), delimiter=";"))
    return {r["COD_CONTA"]: r["DESCRICAO"] for r in rows if r.get("ACEITA_LANCTO") == "S"}


def sample(rows: list, n: int) -> list:
    """Round-robin over rule accounts so every account is represented."""
    groups = defaultdict(list)
    for r in rows:
        groups[r["conta_codigo"]].append(r)
    picked, i = [], 0
    while len(picked) < n and any(i < len(g) for g in groups.values()):
        for conta in sorted(groups):
            if i < len(groups[conta]) and len(picked) < n:
                picked.append(groups[conta][i])
        i += 1
    return picked


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--porta", choices=["api", "claude-code"], default="api")
    ap.add_argument("--n", type=int, default=40)
    a = ap.parse_args()
    os.environ["TARVO_IA_PORTA"] = a.porta
    os.environ["TARVO_IA_CACHE"] = EVAL_CACHE  # never touch the production cache
    with open(ROOT / "saida" / "lancamentos_classificados.csv", encoding="utf-8") as fh:
        rows = [r for r in csv.DictReader(fh, delimiter=";") if r["metodo"] == "REGRA"]
    picked = sample(rows, a.n)
    lines = [{"banco": r["banco"], "ref": r["ref_origem"], "data": date.fromisoformat(r["data"]),
              "desc": r["descricao"], "valor": Decimal(r["valor"]), "arq": "avaliacao"} for r in picked]
    answers = ia.classify(lines, load_plano())
    lim = ia.threshold()
    hits = above = above_hits = escal = none = 0
    errors = []
    for r, d in zip(picked, answers):
        if d is None:
            none += 1
            continue
        if not d["conta"]:
            escal += 1
        ok = d["conta"] == r["conta_codigo"]
        hits += ok
        if d["conta"] and d["confianca"] >= lim:
            above += 1
            above_hits += ok
        if not ok and d["conta"]:
            errors.append((r["descricao"], r["conta_codigo"], d["conta"], d["confianca"]))
    total = len(picked)
    print(f"porta {a.porta}, modelo {ia.model()}, amostra {total} de {len(rows)} lançamentos por regra, "
          f"{len({r['conta_codigo'] for r in picked})} contas")
    print(f"acerto geral: {hits}/{total} ({hits / total:.0%})" if total else "amostra vazia")
    print(f"acerto acima do limite {lim:.2f}: {above_hits}/{above}" + (f" ({above_hits / above:.0%})" if above else ""))
    print(f"escalou para pessoa: {escal}; sem resposta: {none}")
    print("erros (descrição | conta da regra | conta da IA | confiança):")
    for e in errors:
        print(f"  {e[0]} | {e[1]} | {e[2]} | {e[3]:.2f}")


if __name__ == "__main__":
    main()
