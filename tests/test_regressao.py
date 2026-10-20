"""September against the evaluated delivery (tag entrega-2026-10-17, commit 44a6536).

The fixtures in tests/fixtures/entrega-2026-10-17/ are the tag's saida/ and relatorio/ byte for
byte (`git show entrega-2026-10-17:saida/<file>`). Every value of September must stay identical.
The only differences allowed are the ones declared below, all additive: a new column, new event
fields and new events. Anything else that changes fails this test.
"""
from __future__ import annotations

import json
import unittest

from tests.apoio import SAIDAS, TAG_DIR, Rodada, ler_csv, ler_eventos

# ---------------------------------------------------------------- declared differences
# New columns, appended at the end of a CSV (the grader reads the required columns by name).
COLUNAS_NOVAS = {"divergencias_taxa.csv": ["base_brl"]}
# New fields on events that already existed at the tag.
CAMPOS_NOVOS = {"base", "escopo", "parcial"}
# New keys in the month summary (`fim.resumo` and execucao.json).
RESUMO_NOVO = set()
# Volatile by nature: when the run happened and how long it took.
VOLATEIS = {"seq", "ts"}


def evento_novo(e: dict) -> bool:
    """Events that did not exist at the tag: front and month totals with a scope."""
    return e.get("tipo") == "total" and e.get("escopo") in ("frente", "mes")


def normalizar(e: dict) -> dict:
    out = {k: v for k, v in e.items() if k not in VOLATEIS and k not in CAMPOS_NOVOS}
    if out.get("tipo") == "inicio":  # the month folder as typed: here a temporary copy of dados/
        out.pop("fonte", None)
    if "resumo" in out:
        out["resumo"] = {k: v for k, v in out["resumo"].items()
                         if k != "duracao_s" and k not in RESUMO_NOVO}
    return out


class RegressaoSetembro(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.r = Rodada()
        cls.r.rodar()

    @classmethod
    def tearDownClass(cls):
        cls.r.fechar()

    def test_csvs_identicos_a_tag(self):
        for nome in SAIDAS:
            with self.subTest(arquivo=nome):
                h_tag, rows_tag = ler_csv(TAG_DIR / "saida" / nome)
                h, rows = self.r.csv(nome)
                corte = len(h_tag)
                self.assertEqual(h[:corte], h_tag)
                # allowed, not required: the feature tests require the new columns
                self.assertIn(h[corte:], ([], COLUNAS_NOVAS.get(nome, [])))
                self.assertEqual(len(rows), len(rows_tag))
                for i, (novo, velho) in enumerate(zip(rows, rows_tag)):
                    self.assertEqual(len(novo), len(h), f"{nome} linha {i + 2}")
                    self.assertEqual(novo[:corte], velho, f"{nome} linha {i + 2}")

    def test_eventos_identicos_a_tag(self):
        tag = [normalizar(e) for e in ler_eventos(TAG_DIR / "relatorio" / "eventos.jsonl")]
        agora = [normalizar(e) for e in self.r.eventos if not evento_novo(e)]
        self.assertEqual(len(agora), len(tag))
        for i, (a, t) in enumerate(zip(agora, tag)):
            self.assertEqual(a, t, f"evento {i + 1} da tag")

    def test_resumo_identico_a_tag(self):
        with open(TAG_DIR / "relatorio" / "execucao.json", encoding="utf-8") as fh:
            tag = json.load(fh)
        resumo = {k: v for k, v in self.r.run["resumo"].items()
                  if k != "duracao_s" and k not in RESUMO_NOVO}
        self.assertEqual(resumo, {k: v for k, v in tag["resumo"].items() if k != "duracao_s"})
        self.assertEqual(self.r.run["arquivos"], tag["arquivos"])
        self.assertEqual(self.r.run["avisos"], tag["avisos"])


if __name__ == "__main__":
    unittest.main()
