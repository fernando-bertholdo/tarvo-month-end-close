"""A bad line in a month file stops what depends on it, never the whole close (F71).

At the tag the statements and the month were read inside the guarded blocks. Reading them with the
other files must keep that: a date that does not exist (31/09) in a statement interrupts the
statements, one in the Orbe report interrupts the checkout, and the rest closes and is written.
Findings of the review of the engine refino (19/10).
"""
from __future__ import annotations

import time
import unittest
from pathlib import Path
from unittest import mock

from src.tarvo import engine
from tests.apoio import Rodada, por_coluna

BRUTO_06 = "-145869.38"  # the 14 lines of the 06, as in test_arquivos_ausentes


def trocar(path: Path, velho: bytes, novo: bytes) -> None:
    raw = path.read_bytes()
    assert velho in raw, (path.name, velho)
    path.write_bytes(raw.replace(velho, novo, 1))


class LinhaRuim(unittest.TestCase):
    def rodada(self, prefixo, velho, novo):
        r = Rodada()
        self.addCleanup(r.fechar)
        trocar(next(r.mes.glob(prefixo + "*")), velho, novo)
        r.rodar()
        return r

    def interrompidos(self, r):
        return [a.split(":")[0] for a in r.run["avisos"] if a.startswith("bloco ")]

    def test_data_ruim_no_extrato_interrompe_so_os_extratos(self):
        r = self.rodada("05a_", b"01/09/2026;TAR PACOTE", b"31/09/2026;TAR PACOTE")
        self.assertEqual(self.interrompidos(r), ["bloco extratos interrompido"])
        self.assertEqual(len(por_coluna(*r.csv("comissoes_por_lojista.csv"))), 35)
        self.assertEqual(r.csv("lancamentos_classificados.csv")[1], [])
        self.assertEqual(r.eventos[-1]["tipo"], "fim")

    def test_data_ruim_na_orbe_interrompe_so_o_checkout(self):
        r = self.rodada("01_", b"TX88410932;01/09/2026", b"TX88410932;31/09/2026")
        self.assertEqual(self.interrompidos(r), ["bloco checkout interrompido"])
        com = por_coluna(*r.csv("comissoes_por_lojista.csv"))
        self.assertEqual(len([c for c in com if c["linha_negocio"] == "REMESSA"]), 14)
        self.assertEqual(r.run["resumo"]["competencia"], "09/2026")

    def test_falha_na_leitura_publica_o_que_ja_foi_lido(self):
        r = Rodada()
        self.addCleanup(r.fechar)
        emitidos = []
        with mock.patch.object(engine.Close, "read_ponte", side_effect=ValueError("anexo ilegível")):
            with self.assertRaises(ValueError):
                engine.run_close(r.mes, r.saida, r.relatorio, emit=emitidos.append)
        self.assertEqual(emitidos[0]["tipo"], "inicio")
        lidos = [e["fonte"]["arquivo"] for e in emitidos if e["tipo"] == "arquivo"]
        self.assertIn("01_orbe_relatorio_comissoes_set2026.csv", lidos)


class AjusteRepetidoSemPlanilha(unittest.TestCase):
    """06 repeats a 01 id and the 02 is missing: the repeat still becomes its own pendência (F76)."""

    def test_repeticao_vira_pendencia_e_sai_do_bruto_do_06(self):
        r = Rodada(sem=("02_",))
        self.addCleanup(r.fechar)
        f01, f06 = next(r.mes.glob("01_*")), next(r.mes.glob("06_*"))
        linha = f01.read_bytes().splitlines(keepends=True)[1]
        self.assertTrue(linha.startswith(b"TX88410932;"))
        f06.write_bytes(f06.read_bytes() + linha)
        r.rodar()
        pend = por_coluna(*r.csv("pendencias.csv"))
        rep = [p for p in pend if p["tipo"] == "AJUSTE_REPETIDO"]
        self.assertEqual([(p["ref_origem"], p["valor_brl"]) for p in rep], [("TX88410932", "608.88")])
        do_06 = [p for p in pend if p["tipo"] == "DEPENDENCIA_AUSENTE" and p["ref_origem"].startswith("TX88446992")]
        self.assertEqual([p["valor_brl"] for p in do_06], [BRUTO_06])


if __name__ == "__main__":
    unittest.main()
