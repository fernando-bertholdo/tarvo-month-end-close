"""The month of the close comes from the files, not from the code ("nada é fixo para setembro")."""
from __future__ import annotations

import unittest

from tests.apoio import Rodada, por_coluna


class CompetenciaDosArquivos(unittest.TestCase):
    def rodar(self, mes_movimento=None):
        r = Rodada()
        self.addCleanup(r.fechar)
        if mes_movimento:  # the Orbe files of another month: every date moved to that month
            for f in list(r.mes.glob("01_*")) + list(r.mes.glob("06_*")):
                f.write_bytes(f.read_bytes().replace(b"/09/2026", mes_movimento.encode()))
        r.rodar()
        return r

    def test_setembro(self):
        r = self.rodar()
        self.assertEqual(r.run["resumo"]["competencia"], "09/2026")
        self.assertEqual(r.run["resumo"]["competencia_seguinte"], "10/2026")

    def test_outro_mes_muda_a_discriminacao_das_notas(self):
        r = self.rodar("/10/2026")
        self.assertEqual(r.run["resumo"]["competencia"], "10/2026")
        self.assertEqual(r.run["resumo"]["competencia_seguinte"], "11/2026")
        notas = por_coluna(*r.csv("notas_a_emitir.csv"))
        self.assertTrue(notas)
        for n in notas:
            self.assertIn("competência 10/2026", n["discriminacao"])

    def test_motivo_da_atlas_usa_os_meses_do_fechamento(self):
        setembro = por_coluna(*self.rodar().csv("pendencias.csv"))
        outubro = por_coluna(*self.rodar("/10/2026").csv("pendencias.csv"))
        atlas = [p["motivo"] for p in setembro if p["tipo"] == "SEM_CONTRATO"]
        self.assertIn("faturar setembro com outubro", atlas[0])
        atlas = [p["motivo"] for p in outubro if p["tipo"] == "SEM_CONTRATO"]
        self.assertIn("faturar outubro com novembro", atlas[0])

    def test_motivos_dos_extratos_usam_os_meses_do_fechamento(self):
        r = self.rodar("/10/2026")
        motivos = {p["tipo"]: p["motivo"] for p in por_coluna(*r.csv("pendencias.csv"))}
        self.assertIn("até o fechamento de novembro", motivos["CREDITO_NAO_IDENTIFICADO"])
        self.assertIn("sem entrada em outubro: conferir no extrato de novembro", motivos["TRANSFERENCIA_EM_TRANSITO"])

    def test_so_os_extratos_dao_o_mes(self):
        # without the Orbe and the Ponte, the statement dates say the month (review of 19/10)
        r = Rodada(sem=("01_", "03_", "06_"))
        self.addCleanup(r.fechar)
        r.rodar()
        self.assertEqual(r.run["resumo"]["competencia"], "09/2026")
        motivos = {p["tipo"]: p["motivo"] for p in por_coluna(*r.csv("pendencias.csv"))}
        self.assertIn("até o fechamento de outubro", motivos["CREDITO_NAO_IDENTIFICADO"])
        self.assertIn("sem entrada em setembro: conferir no extrato de outubro", motivos["TRANSFERENCIA_EM_TRANSITO"])

    def test_virada_do_ano(self):
        r = self.rodar("/12/2026")
        self.assertEqual(r.run["resumo"]["competencia_seguinte"], "01/2027")


if __name__ == "__main__":
    unittest.main()
