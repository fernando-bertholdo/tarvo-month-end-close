"""The base a rate divergence applies to, written by the engine (the page used to compute it).

Checkout (F11): bruto × (aplicada − contratada), so the base is the gross of the line.
Remessa (F15/F95): Spread R$ − Valor ME × PTAX × contratado, so the base is Valor ME × PTAX Ref.,
not the Valor R$ the client paid. Expected values read by hand from the source lines.
"""
from __future__ import annotations

import unittest

from tests.apoio import Rodada, por_coluna


class BaseDaDivergencia(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.r = Rodada()
        cls.r.rodar()
        cls.div = {d["id_saida"]: d for d in por_coluna(*cls.r.csv("divergencias_taxa.csv"))}
        cls.ev = {e["id_saida"]: e for e in cls.r.eventos
                  if e.get("tipo") == "decisao" and e.get("resultado") == "divergencia"}

    @classmethod
    def tearDownClass(cls):
        cls.r.fechar()

    def test_remessa_base_e_valor_me_vezes_ptax(self):
        # anexo da Ponte, PC-0926-0011: CAD 2.438,46 x PTAX 4,0315 = 9.830,65149; pago R$ 9.978,18
        self.assertEqual(self.div["DIV-0093"]["base_brl"], "9830.65")
        self.assertEqual(self.ev["DIV-0093"]["base"], 9830.65)

    def test_checkout_base_e_o_bruto_da_linha(self):
        # 01, linha 727, TX88423890: Rota Global, bruto 6.449,10
        self.assertEqual(self.div["DIV-0001"]["base_brl"], "6449.10")
        self.assertEqual(self.ev["DIV-0001"]["base"], 6449.10)

    def test_toda_divergencia_tem_base(self):
        self.assertEqual(len(self.div), 115)
        for did, d in self.div.items():
            with self.subTest(id_saida=did):
                self.assertNotEqual(d["base_brl"], "")
                self.assertIn("base", self.ev[did])


if __name__ == "__main__":
    unittest.main()
