"""The panel the command writes carries the run's own outputs and origin lines.

The drill-down shows `saida/` only when it matches the events. The engine passes the run's
folders to the panel, so a run with other folders never embeds, or loses, another run's outputs.
"""
from __future__ import annotations

import json
import re
import unittest

from tests.apoio import Rodada


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


if __name__ == "__main__":
    unittest.main()
