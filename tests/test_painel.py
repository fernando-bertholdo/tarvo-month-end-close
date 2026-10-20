"""The panel the command writes carries the run's own outputs and origin lines.

The drill-down shows `saida/` only when it matches the events. The engine passes the run's
folders to the panel, so a run with other folders never embeds, or loses, another run's outputs.
"""
from __future__ import annotations

import json
import re
import unittest

from tests.apoio import DADOS, Rodada


def dados_embutidos(painel) -> dict:
    html = painel.read_text(encoding="utf-8")
    m = re.search(r'<script type="application/json" id="dados">(.*?)</script>', html, re.S)
    return json.loads(m.group(1))


class PainelDaRodada(unittest.TestCase):
    def test_saidas_e_origem_da_propria_rodada(self):
        r = Rodada(sem=("06_",))  # outputs differ from the repository's saida/
        try:
            r.rodar()
            dados = dados_embutidos(r.relatorio / "painel.html")
        finally:
            r.fechar()
        self.assertIsNotNone(dados["saida"], dados["avisos"])
        self.assertIn("01_orbe_relatorio_comissoes_set2026.csv", dados["origem"])
        self.assertNotIn("06_orbe_ajustes_tardios_set2026.csv", dados["origem"])


class ConversoesDaPonte(unittest.TestCase):
    """The Ponte sheet stores dates as Excel serials and the spread as a fraction.

    The page only formats, so the export converts them in Python and hands them over next to
    the cells as they came (Director, r4): the date in ISO and the spread in percent points.
    """

    @classmethod
    def setUpClass(cls):
        from src.tarvo.painel import read_origin

        notas: list = []
        origem = read_origin(DADOS, notas)
        cls.notas = notas
        cls.ponte = next(v for k, v in origem.items() if k.startswith("03_"))

    def linha(self, ref: str, ocorrencia: int = 0) -> dict:
        numero, celulas, convertidos = self.ponte["linhas"][ref][ocorrencia]
        return {"numero": numero, "celulas": dict(zip(self.ponte["cabecalho"], celulas)),
                "convertidos": convertidos}

    def test_mundo_aberto_data_iso_e_spread_em_pontos(self):
        linha = self.linha("PC-0926-0011")
        self.assertEqual(linha["numero"], 10)
        self.assertEqual(linha["convertidos"]["Data Contratação"], "2026-09-04")
        self.assertEqual(linha["convertidos"]["Data Liquidação"], "2026-09-07")
        self.assertEqual(linha["convertidos"]["Spread %"], 1.5007)

    def test_celulas_continuam_como_chegaram(self):
        celulas = self.linha("PC-0926-0011")["celulas"]
        self.assertEqual(celulas["Data Contratação"], "46269")
        self.assertEqual(celulas["Spread %"], "0.015007")

    def test_spread_negativo_e_operacao_repetida(self):
        self.assertEqual(self.linha("PC-0926-0210")["convertidos"]["Spread %"], -1.5523)
        self.assertEqual(self.linha("PC-0926-0162", 1)["convertidos"]["Data Contratação"],
                         "2026-09-22")

    def test_json_sem_ruido_de_ponto_flutuante(self):
        texto = json.dumps(self.linha("PC-0926-0011")["convertidos"], ensure_ascii=False)
        self.assertIn('"Spread %": 1.5007', texto)

    def test_celula_ilegivel_fica_de_fora(self):
        from src.tarvo.painel import excel_date_iso, fraction_to_percent

        self.assertIsNone(excel_date_iso(""))
        self.assertIsNone(excel_date_iso("15/09/2026"))
        self.assertIsNone(fraction_to_percent(""))
        self.assertIsNone(fraction_to_percent("n/d"))
        self.assertEqual(fraction_to_percent("0.01501"), 1.501)


if __name__ == "__main__":
    unittest.main()
