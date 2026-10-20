"""verificacao/reconcilia.py: exit 0 on a fresh close, exit 1 when any delivered number drifts."""
from __future__ import annotations

import importlib.util
import subprocess
import sys
import unittest
from decimal import Decimal

from tests.apoio import REPO, Rodada

SCRIPT = REPO / "verificacao" / "reconcilia.py"


def reconciliar(r):
    return subprocess.run(
        [sys.executable, str(SCRIPT), str(r.mes), "--saida", str(r.saida), "--relatorio", str(r.relatorio)],
        capture_output=True, text=True, timeout=60)


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

    def test_parcial_adulterado_falha(self):
        # the running sum of the last checkout merchant must be the front total
        path = self.r.relatorio / "eventos.jsonl"
        texto = path.read_text(encoding="utf-8")
        alvo = '"frente": {"k": 21, "n": 21, "valor": 203735.34}'
        self.assertIn(alvo, texto)
        path.write_text(texto.replace(alvo, alvo.replace("203735.34", "203735.43")), encoding="utf-8")
        p = self.reconciliar()
        self.assertEqual(p.returncode, 1, p.stdout)

    def test_divergencia_fora_da_fonte_falha(self):
        # same total kept elsewhere is not enough: the line must match the source rates
        self.adulterar("divergencias_taxa.csv", "PC-0926-0011;1.20;1.5007;29.56", "PC-0926-0011;1.20;1.5007;29.57")
        p = self.reconciliar()
        self.assertEqual(p.returncode, 1, p.stdout)


class ReconciliacaoSemArquivo(unittest.TestCase):
    """A correct close without a month file reconciles too: the script mirrors F71 (review of 19/10)."""

    def fechar_sem(self, sem=(), trocar=None):
        r = Rodada(sem=sem)
        self.addCleanup(r.fechar)
        if trocar:  # (prefix, old bytes, new bytes)
            f = next(r.mes.glob(trocar[0] + "*"))
            f.write_bytes(f.read_bytes().replace(trocar[1], trocar[2], 1))
        r.rodar()
        p = reconciliar(r)
        self.assertEqual(p.returncode, 0, p.stdout[-1500:] + p.stderr[-1500:])

    def test_sem_01(self):
        self.fechar_sem(("01_",))

    def test_layout_do_01_mudou(self):
        self.fechar_sem(trocar=("01_", b"valor_bruto", b"valor_bruto_rs"))

    def test_sem_02(self):
        self.fechar_sem(("02_",))

    def test_sem_03(self):
        self.fechar_sem(("03_",))


class AjusteDeContestacao(unittest.TestCase):
    """F69: half of a Ponte contestation adjustment goes to the commission, whatever its sign."""

    @classmethod
    def setUpClass(cls):
        spec = importlib.util.spec_from_file_location("reconcilia", SCRIPT)
        cls.rc = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(cls.rc)

    def op(self, spread, pct, obs="AJUSTE REF PC-0826-0003"):
        return {"Nº Operação": "PC-0926-9999", "CNPJ Cliente": "11.222.333/0001-81", "Valor ME": "1000",
                "PTAX Ref.": "5", "Spread R$": spread, "Spread %": pct, "Observação": obs}

    def test_ajuste_negativo_entra_na_comissao(self):
        rm = self.rc.remessa([self.op("-40.00", "-0.008")], [])
        self.assertEqual(rm["comissao"], {"11222333000181": Decimal("-20.00")})

    def test_ajuste_acima_do_contrato_nao_e_divergencia(self):
        tabela = [{"cnpj": "11222333000181", "J": Decimal("0.012")}]
        rm = self.rc.remessa([self.op("150.00", "0.03")], tabela)
        self.assertEqual((rm["comissao"], rm["divergencia"]), ({"11222333000181": Decimal("75.00")}, {}))


if __name__ == "__main__":
    unittest.main()
