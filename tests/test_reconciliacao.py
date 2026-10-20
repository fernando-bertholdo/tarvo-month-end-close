"""verificacao/reconcilia.py: exit 0 on a fresh close, exit 1 when any delivered number drifts."""
from __future__ import annotations

import subprocess
import sys
import unittest

from tests.apoio import REPO, Rodada

SCRIPT = REPO / "verificacao" / "reconcilia.py"


class Reconciliacao(unittest.TestCase):
    def setUp(self):
        self.r = Rodada()
        self.r.rodar()

    def tearDown(self):
        self.r.fechar()

    def reconciliar(self):
        return subprocess.run(
            [sys.executable, str(SCRIPT), str(self.r.mes), "--saida", str(self.r.saida),
             "--relatorio", str(self.r.relatorio)],
            capture_output=True, text=True, timeout=60)

    def adulterar(self, nome, velho, novo):
        path = self.r.saida / nome
        texto = path.read_text(encoding="utf-8")
        self.assertIn(velho, texto)
        path.write_text(texto.replace(velho, novo, 1), encoding="utf-8")

    def test_fechamento_novo_reconcilia(self):
        p = self.reconciliar()
        self.assertEqual(p.returncode, 0, p.stdout + p.stderr)
        self.assertNotIn("FALHOU", p.stdout)

    def test_comissao_adulterada_falha(self):
        # first CHECKOUT merchant at the tag: Casa do Estudante, -5.50
        self.adulterar("comissoes_por_lojista.csv", ";CHECKOUT;-5.50", ";CHECKOUT;-5.40")
        p = self.reconciliar()
        self.assertEqual(p.returncode, 1, p.stdout)
        self.assertIn("FALHOU", p.stdout)

    def test_rastro_adulterado_falha(self):
        # Mundo Aberto divergence, PC-0926-0011
        self.adulterar("rastro.csv", "DIV-0093;03_email_ponte_cambio_relatorio_set2026.eml;PC-0926-0011;29.56",
                       "DIV-0093;03_email_ponte_cambio_relatorio_set2026.eml;PC-0926-0011;29.66")
        p = self.reconciliar()
        self.assertEqual(p.returncode, 1, p.stdout)

    def test_divergencia_fora_da_fonte_falha(self):
        # same total kept elsewhere is not enough: the line must match the source rates
        self.adulterar("divergencias_taxa.csv", "PC-0926-0011;1.20;1.5007;29.56", "PC-0926-0011;1.20;1.5007;29.57")
        p = self.reconciliar()
        self.assertEqual(p.returncode, 1, p.stdout)


if __name__ == "__main__":
    unittest.main()
