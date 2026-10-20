"""Shared helpers for the engine tests: run the close in a temporary folder and read its outputs.

Standard library only, Python 3.8+. The AI stage is pointed at a throwaway cache and the
"nenhuma" port, so a test never calls a model and never touches the versioned cache.
"""
from __future__ import annotations

import csv
import json
import os
import shutil
import tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
DADOS = REPO / "dados"
TAG_DIR = Path(__file__).resolve().parent / "fixtures" / "entrega-2026-10-17"
SAIDAS = ("comissoes_por_lojista.csv", "divergencias_taxa.csv", "notas_a_emitir.csv",
          "lancamentos_classificados.csv", "pendencias.csv", "rastro.csv")
PREFIXOS = ("01_", "02_", "03_", "04_", "05a_", "05b_", "06_")


class Rodada:
    """One close run in a temporary folder; `fechar()` removes it."""

    def __init__(self, sem=(), mes=None):
        self.tmp = Path(tempfile.mkdtemp(prefix="tarvo-teste-"))
        self.mes = self.tmp / "mes"
        self.mes.mkdir()
        origem = Path(mes) if mes else DADOS
        for f in sorted(origem.iterdir()):
            if f.is_file() and not any(f.name.startswith(p) for p in sem):
                shutil.copy(f, self.mes / f.name)
        self.saida = self.tmp / "saida"
        self.relatorio = self.tmp / "relatorio"

    def rodar(self) -> dict:
        from src.tarvo.engine import run_close

        old = {k: os.environ.get(k) for k in ("TARVO_IA_PORTA", "TARVO_IA_CACHE")}
        os.environ["TARVO_IA_PORTA"] = "nenhuma"
        os.environ["TARVO_IA_CACHE"] = str(self.tmp / "ia_cache.json")
        try:
            self.run = run_close(self.mes, self.saida, self.relatorio)
        finally:
            for k, v in old.items():
                if v is None:
                    os.environ.pop(k, None)
                else:
                    os.environ[k] = v
        self.eventos = ler_eventos(self.relatorio / "eventos.jsonl")
        return self.run

    def csv(self, nome: str) -> tuple:
        return ler_csv(self.saida / nome)

    def fechar(self) -> None:
        shutil.rmtree(self.tmp, ignore_errors=True)


def ler_csv(path: Path) -> tuple:
    """(header, rows) of a `;` CSV as written by the engine."""
    with open(path, newline="", encoding="utf-8") as fh:
        rows = list(csv.reader(fh, delimiter=";"))
    return rows[0], rows[1:]


def ler_eventos(path: Path) -> list:
    with open(path, encoding="utf-8") as fh:
        return [json.loads(line) for line in fh if line.strip()]


def por_coluna(header: list, rows: list) -> list:
    return [dict(zip(header, r)) for r in rows]
