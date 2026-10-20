"""Partial totals and counts with a scope, emitted by the engine so the page only displays them.

Scopes: an event is one item; `total` events carry `escopo` "lojista" or "frente"; `fim` is the
month. Running values sit in `parcial`, keyed by the scope they run in: `etapa` (k of n decisions
of the stage), `grupo` (a claim: the divergences one pendência covers), `frente`, `mes`.

Literals come from the critic's round r2 of the panel (19/10), checked against the CSVs and the
source lines, not from this engine: paused sums, counts per stage, refunds, the Atlas estimate.
"""
from __future__ import annotations

import unittest
from decimal import Decimal

from tests.apoio import Rodada

ETAPAS = ("LEITURA", "CHECKOUT", "REMESSA", "NOTAS", "EXTRATOS")


def d(x) -> Decimal:
    return Decimal(str(x))


class Parciais(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.r = Rodada()
        cls.r.rodar()
        cls.ev = cls.r.eventos
        cls.dec = [e for e in cls.ev if e["tipo"] == "decisao"]
        cls.pend = {e["id_saida"]: e for e in cls.dec if e["resultado"] == "pendencia"}
        cls.resumo = cls.r.run["resumo"]

    @classmethod
    def tearDownClass(cls):
        cls.r.fechar()

    def totais(self, escopo, frente=None):
        return [e for e in self.ev if e["tipo"] == "total" and e.get("escopo") == escopo
                and (frente is None or e["frente"] == frente)]

    # ------------------------------------------------------------ stage: k of n, three buckets
    def test_toda_decisao_tem_etapa_e_contagem(self):
        for e in self.dec:
            self.assertIn(e["etapa"], ETAPAS)
            self.assertEqual(set(e["parcial"]["etapa"]), {"k", "n", "regra", "sinalizadas", "pessoa"})

    def test_contagem_por_etapa(self):
        # critic r2: 1.996 = 1.900 + 92 + 4; 257 = 228 + 23 + 6; 23 = 20 + 1 + 2; 187 = 184 + 0 + 3
        esperado = {"CHECKOUT": (1996, 1900, 92, 4), "REMESSA": (257, 228, 23, 6),
                    "NOTAS": (23, 20, 1, 2), "EXTRATOS": (187, 184, 0, 3)}
        for etapa, (n, regra, sinal, pessoa) in esperado.items():
            with self.subTest(etapa=etapa):
                evs = [e for e in self.dec if e["etapa"] == etapa]
                self.assertEqual([e["parcial"]["etapa"]["k"] for e in evs], list(range(1, n + 1)))
                self.assertEqual({e["parcial"]["etapa"]["n"] for e in evs}, {n})
                ultimo = evs[-1]["parcial"]["etapa"]
                self.assertEqual((ultimo["regra"], ultimo["sinalizadas"], ultimo["pessoa"]), (regra, sinal, pessoa))

    def test_decisoes_igual_regra_mais_sinalizadas_mais_pessoa_em_todo_evento(self):
        for e in self.dec:
            p = e["parcial"]["etapa"]
            self.assertEqual(p["k"], p["regra"] + p["sinalizadas"] + p["pessoa"])

    def test_leitura_dos_arquivos(self):
        arqs = [e for e in self.ev if e["tipo"] == "arquivo"]
        self.assertEqual([(e["parcial"]["etapa"]["k"], e["parcial"]["etapa"]["n"]) for e in arqs],
                         [(k, 7) for k in range(1, 8)])
        taxas = next(e for e in arqs if e["fonte"]["arquivo"].startswith("02_"))
        self.assertEqual((taxas["linhas"], taxas["linhas_no_arquivo"]), (30, 43))  # "30 de 43"
        inicio = self.ev[0]
        self.assertEqual((inicio["competencia"], inicio["competencia_seguinte"]), ("09/2026", "10/2026"))

    # ------------------------------------------------------------ merchant and front totals
    def test_fecho_da_comissao_por_lojista(self):
        for frente, n, total in (("CHECKOUT", 21, "203735.34"), ("REMESSA", 14, "39543.45")):
            with self.subTest(frente=frente):
                evs = self.totais("lojista", frente)
                self.assertEqual([e["parcial"]["frente"]["k"] for e in evs], list(range(1, n + 1)))
                corrido = Decimal("0")
                for e in evs:  # the running sum is the sum of the merchants closed so far
                    corrido += d(e["valor"])
                    self.assertEqual(d(e["parcial"]["frente"]["valor"]), corrido)
                    self.assertEqual(e["parcial"]["frente"]["n"], n)
                self.assertEqual(corrido, Decimal(total))
                fim = self.totais("frente", frente)
                self.assertEqual(len(fim), 1)
                self.assertEqual((d(fim[0]["valor"]), fim[0]["n_lojistas"]), (Decimal(total), n))

    def test_somas_pausadas_do_critico(self):
        ck = {e["parcial"]["frente"]["k"]: d(e["parcial"]["frente"]["valor"]) for e in self.totais("lojista", "CHECKOUT")}
        self.assertEqual((ck[3], ck[7], ck[11], ck[19]),
                         tuple(map(Decimal, ("23099.95", "64858.04", "113486.35", "187560.58"))))
        rm = {e["parcial"]["frente"]["k"]: d(e["parcial"]["mes"]["comissao"]) for e in self.totais("lojista", "REMESSA")}
        self.assertEqual((rm[3], rm[12]), (Decimal("214140.91"), Decimal("239908.27")))
        self.assertEqual(d(self.resumo["comissao_total"]), Decimal("243278.79"))

    def test_lojista_sem_nota(self):
        casa = next(e for e in self.totais("lojista", "CHECKOUT") if e["valor"] == -5.5)
        self.assertIs(casa["emite_nota"], False)
        self.assertEqual(casa["n_linhas"], 119)  # critic r2: "119 linhas"
        self.assertEqual(sum(e["emite_nota"] for e in self.totais("lojista", "CHECKOUT")), 20)

    def test_notas_emitindo(self):
        notas = [e for e in self.dec if e["resultado"] == "nota"]
        self.assertEqual([e["parcial"]["frente"]["k"] for e in notas], list(range(1, 22)))
        por_k = {e["parcial"]["frente"]["k"]: d(e["parcial"]["frente"]["valor"]) for e in notas}
        self.assertEqual((por_k[4], por_k[12], por_k[21]),
                         (Decimal("41307.74"), Decimal("128435.73"), Decimal("243284.29")))
        fim = self.totais("frente", "NOTAS")[0]
        self.assertEqual((fim["n_notas"], fim["notas_por_linha"]), (21, {"CHECKOUT": 20, "REMESSA": 1}))
        self.assertEqual(d(fim["notas_menos_comissao"]), Decimal("5.50"))

    # ------------------------------------------------------------ divergence groups
    def test_grupos_de_divergencia(self):
        # Rota Global 87 -> R$ 1.546,28 (PEN-0001); Bridge 5 -> R$ 29,95 (PEN-0002);
        # Mundo Aberto 23 -> R$ 1.418,88 (PEN-0010)
        for pid, n, total in (("PEN-0001", 87, "1546.28"), ("PEN-0002", 5, "29.95"), ("PEN-0010", 23, "1418.88")):
            with self.subTest(pendencia=pid):
                evs = [e for e in self.dec if e["resultado"] == "divergencia" and e["pendencia"] == pid]
                self.assertEqual([e["parcial"]["grupo"]["k"] for e in evs], list(range(1, n + 1)))
                self.assertEqual(d(evs[-1]["parcial"]["grupo"]["valor"]), Decimal(total))
                self.assertEqual(d(self.pend[pid]["valor"]), Decimal(total))
        divs = [e for e in self.dec if e["resultado"] == "divergencia"]
        self.assertEqual([e["parcial"]["mes"]["divergencias"] for e in divs], list(range(1, 116)))

    def test_taxas_da_divergencia(self):
        by = {e["id_saida"]: e for e in self.dec if e["resultado"] == "divergencia"}
        rota, mundo = by["DIV-0001"], by["DIV-0093"]
        self.assertEqual((rota["taxa_contratada_pct"], rota["taxa_aplicada_pct"], rota["diferenca_pp"]), (3.59, 4.09, 0.5))
        self.assertEqual((mundo["taxa_contratada_pct"], mundo["taxa_aplicada_pct"], mundo["diferenca_pp"]), (1.2, 1.5007, 0.3007))

    # ------------------------------------------------------------ pendências
    def test_pendencias_corridas_por_dono(self):
        evs = list(self.pend.values())
        self.assertEqual([e["parcial"]["mes"]["pendencias"] for e in evs], list(range(1, 16)))
        for e in evs:
            self.assertEqual(sum(e["parcial"]["mes"]["por_dono"].values()), e["parcial"]["mes"]["pendencias"])
        self.assertEqual(evs[-1]["parcial"]["mes"]["por_dono"], {"Financeiro": 12, "Comercial": 2, "Tesouraria": 1})
        self.assertEqual(self.resumo["pendencias_por_dono"], {"Financeiro": 12, "Comercial": 2, "Tesouraria": 1})

    def test_dinheiro_em_jogo_corrido(self):
        fim = {k: d(v) for k, v in list(self.pend.values())[-1]["parcial"]["mes"]["em_jogo"].items()}
        self.assertEqual(fim, {"acima_do_contrato": Decimal("2995.11"), "orbe": Decimal("1576.23"),
                               "ponte": Decimal("1418.88"), "devolver_casa": Decimal("15396.77"),
                               "atlas_estimativa": Decimal("7876.05")})
        primeira = self.pend["PEN-0001"]["parcial"]["mes"]["em_jogo"]
        self.assertEqual(d(primeira["acima_do_contrato"]), Decimal("1546.28"))

    def test_campos_de_item_das_pendencias(self):
        rota, bridge, atlas = self.pend["PEN-0001"], self.pend["PEN-0002"], self.pend["PEN-0004"]
        self.assertEqual((rota["tipo_pendencia"], rota["n_linhas"]), ("DIVERGENCIA_ORBE", 87))
        self.assertEqual(rota["por_tipo"], {"VENDA": 83, "ESTORNO": 4})
        self.assertEqual((d(rota["ressarcimento"]), d(bridge["ressarcimento"])), (Decimal("1545.86"), Decimal("29.94")))
        self.assertEqual(atlas["n_linhas"], 57)
        self.assertEqual(atlas["por_tipo"], {"VENDA": 49, "ANTECIPACAO": 5, "REVERSAO ANTECIPACAO": 2, "ESTORNO": 1})
        self.assertEqual((d(atlas["estimativa"]["valor"]), atlas["estimativa"]["mil"]), (Decimal("7876.05"), 7.9))
        self.assertEqual(self.pend["PEN-0003"]["n_linhas"], 118)  # Casa: "descontou a taxa em 118 operações"

    # ------------------------------------------------------------ month
    def test_resumo_do_mes(self):
        r = self.resumo
        self.assertEqual(r["decisoes"], {"total": 2463, "regra": 2332, "sinalizadas": 116, "pessoa": 15})
        self.assertEqual(r["decisoes_por_etapa"]["CHECKOUT"], {"total": 1996, "regra": 1900, "sinalizadas": 92, "pessoa": 4})
        self.assertEqual(r["lojistas"], {"CHECKOUT": 21, "REMESSA": 14})
        self.assertEqual(r["divergencias_operacoes"], {"CHECKOUT": 92, "REMESSA": 23})
        self.assertEqual(r["lancamentos_por_metodo"], {"REGRA": 184})
        self.assertEqual((len(r["lancamentos_por_conta"]), r["lancamentos_por_conta"]["2.1.02.001"]), (22, 85))
        self.assertEqual(r["pendencias_por_tipo"]["SPREAD_NEGATIVO"], 4)
        self.assertEqual(sum(r["pendencias_por_tipo"].values()), 15)
        self.assertEqual(d(r["atlas_estimativa"]), Decimal("7876.05"))
        fim = self.ev[-1]
        self.assertEqual((fim["tipo"], fim["resumo"]), ("fim", r))


if __name__ == "__main__":
    unittest.main()
