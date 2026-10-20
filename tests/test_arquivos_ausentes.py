"""One test per missing month file (F71: warn, and close what does not depend on it).

A step whose input depends on a missing file does not run. Lines that arrived but cannot be
processed become one DEPENDENCIA_AUSENTE pendência per file, valued at their gross; a check that
cannot run is an aviso, never a pendência with a wrong reason. What does not depend on the missing
file must come out as at the tag (ids aside: they are sequential, so they shift).
"""
from __future__ import annotations

import unittest
from decimal import Decimal

from tests.apoio import TAG_DIR, Rodada, ler_csv, por_coluna

# Read by hand from the month files (awk over valor_bruto), not from the engine.
BRUTO_06 = "-145869.38"  # 14 lines of 06_orbe_ajustes_tardios_set2026.csv
BRUTO_01 = "7496228.56"  # 1.943 lines of 01_orbe_relatorio_comissoes_set2026.csv
PRIMEIRO_06 = "TX88446992"


def tag(nome):
    return por_coluna(*ler_csv(TAG_DIR / "saida" / nome))


def sem_id(rows, *cols):
    """Rows as tuples of the given columns, ids left out."""
    return [tuple(r[c] for c in cols) for r in rows]


class Base(unittest.TestCase):
    sem = ()

    @classmethod
    def setUpClass(cls):
        cls.r = Rodada(sem=cls.sem)
        cls.r.rodar()
        cls.avisos = cls.r.run["avisos"]
        cls.out = {n: por_coluna(*cls.r.csv(n)) for n in (
            "comissoes_por_lojista.csv", "divergencias_taxa.csv", "notas_a_emitir.csv",
            "lancamentos_classificados.csv", "pendencias.csv")}

    @classmethod
    def tearDownClass(cls):
        cls.r.fechar()

    def pend(self, tipo):
        return [p for p in self.out["pendencias.csv"] if p["tipo"] == tipo]

    def linha(self, nome, campo, valor):
        return [r for r in self.out[nome] if r[campo] == valor]

    def assertAvisa(self, prefixo):
        self.assertTrue(any(a.startswith(f"Arquivo {prefixo}") for a in self.avisos), self.avisos)

    def test_nenhum_bloco_interrompido(self):
        if not self.sem:
            return
        self.assertFalse([a for a in self.avisos if a.startswith("bloco ")], self.avisos)

    def assertRemessaComoNaTag(self, cols=("cnpj", "lojista", "linha_negocio", "comissao_brl")):
        agora = [r for r in self.out["comissoes_por_lojista.csv"] if r["linha_negocio"] == "REMESSA"]
        antes = [r for r in tag("comissoes_por_lojista.csv") if r["linha_negocio"] == "REMESSA"]
        self.assertEqual(sem_id(agora, *cols), sem_id(antes, *cols))


class Sem01(Base):
    sem = ("01_",)

    def test_avisa_01_e_06(self):
        self.assertAvisa("01")
        self.assertAvisa("06")

    def test_ajustes_do_06_viram_uma_pendencia(self):
        dep = self.pend("DEPENDENCIA_AUSENTE")
        self.assertEqual(len(dep), 1)
        self.assertEqual(dep[0]["valor_brl"], BRUTO_06)
        self.assertEqual(dep[0]["quem_decide"], "Financeiro")
        refs = dep[0]["ref_origem"].split("|")
        self.assertEqual((len(refs), refs[0]), (14, PRIMEIRO_06))

    def test_checkout_nao_roda_sobre_o_06(self):
        # at the tag: -R$ 3.304,39 of commission and six SALDO_NAO_POSITIVO from the 06 alone
        self.assertEqual(self.linha("comissoes_por_lojista.csv", "linha_negocio", "CHECKOUT"), [])
        self.assertEqual(self.pend("SALDO_NAO_POSITIVO"), [])
        notas = self.out["notas_a_emitir.csv"]
        self.assertEqual([(n["linha_negocio"], n["valor_brl"]) for n in notas], [("REMESSA", "39543.45")])

    def test_remessa_como_na_tag(self):
        self.assertRemessaComoNaTag()


class Layout01Mudou(Sem01):
    """01 present with a column renamed: same as missing for the 06 (finding of 17/10 18h33)."""
    sem = ()

    @classmethod
    def setUpClass(cls):
        cls.r = Rodada()
        f01 = next(cls.r.mes.glob("01_*"))
        raw = f01.read_bytes()
        f01.write_bytes(raw.replace(b"valor_bruto", b"valor_bruto_rs", 1))
        cls.r.rodar()
        cls.avisos = cls.r.run["avisos"]
        cls.out = {n: por_coluna(*cls.r.csv(n)) for n in (
            "comissoes_por_lojista.csv", "divergencias_taxa.csv", "notas_a_emitir.csv",
            "lancamentos_classificados.csv", "pendencias.csv")}

    def test_avisa_01_e_06(self):
        self.assertTrue(any(a.startswith("01_") and "colunas ausentes" in a for a in self.avisos))
        self.assertAvisa("06")


class Sem02(Base):
    sem = ("02_",)

    def test_avisa(self):
        self.assertAvisa("02")

    def test_sem_cadastro_inventado(self):
        # at the tag: 249 SEM_CADASTRO, one per EC and per Ponte operation, with no sheet to look at
        self.assertEqual(self.pend("SEM_CADASTRO"), [])

    def test_linhas_da_orbe_viram_pendencia_por_arquivo(self):
        valores = sorted(p["valor_brl"] for p in self.pend("DEPENDENCIA_AUSENTE"))
        self.assertEqual(valores, sorted([BRUTO_01, BRUTO_06]))

    def test_checkout_nao_roda(self):
        self.assertEqual(self.linha("comissoes_por_lojista.csv", "linha_negocio", "CHECKOUT"), [])
        self.assertEqual(self.linha("divergencias_taxa.csv", "linha_negocio", "CHECKOUT"), [])

    def test_comissao_de_remessa_sai_do_spread(self):
        # F12/F13 need only the Ponte file; names come from it, so compare CNPJ and value
        self.assertRemessaComoNaTag(cols=("cnpj", "linha_negocio", "comissao_brl"))

    def test_sem_divergencia_de_spread_contra_o_padrao(self):
        # without the sheet the contracted spread is unknown: no comparison against the 1,5% default
        self.assertEqual(self.linha("divergencias_taxa.csv", "linha_negocio", "REMESSA"), [])
        self.assertEqual(self.pend("DIVERGENCIA_PONTE"), [])

    def test_spread_negativo_continua_pendencia(self):
        self.assertEqual(len(self.pend("SPREAD_NEGATIVO")), 4)


class Sem03(Base):
    sem = ("03_",)

    def test_avisa(self):
        self.assertAvisa("03")

    def test_checkout_como_na_tag(self):
        cols = ("cnpj", "lojista", "linha_negocio", "comissao_brl")
        agora = self.out["comissoes_por_lojista.csv"]
        antes = [r for r in tag("comissoes_por_lojista.csv") if r["linha_negocio"] == "CHECKOUT"]
        self.assertEqual(sem_id(agora, *cols), sem_id(antes, *cols))
        dcols = ("cnpj", "ref_origem", "taxa_contratada_pct", "taxa_aplicada_pct", "diferenca_brl")
        antes = [r for r in tag("divergencias_taxa.csv") if r["linha_negocio"] == "CHECKOUT"]
        self.assertEqual(sem_id(self.out["divergencias_taxa.csv"], *dcols), sem_id(antes, *dcols))

    def test_sem_nota_da_ponte(self):
        self.assertEqual(self.linha("notas_a_emitir.csv", "linha_negocio", "REMESSA"), [])


class Sem04(Base):
    sem = ("04_",)

    def test_avisa(self):
        self.assertAvisa("04")

    def test_classificacao_por_regra_como_na_tag(self):
        self.assertEqual(self.out["lancamentos_classificados.csv"], tag("lancamentos_classificados.csv"))


class Sem05a(Base):
    sem = ("05a_",)

    def test_avisa(self):
        self.assertAvisa("05a")

    def test_meridiano_como_na_tag(self):
        cols = ("banco", "ref_origem", "data", "valor", "conta_codigo", "metodo")
        antes = [r for r in tag("lancamentos_classificados.csv") if r["banco"] == "MERIDIANO"]
        self.assertEqual(sem_id(self.out["lancamentos_classificados.csv"], *cols), sem_id(antes, *cols))


class Sem05b(Base):
    sem = ("05b_",)

    def test_avisa(self):
        self.assertAvisa("05b")

    def test_aurora_como_na_tag(self):
        cols = ("banco", "ref_origem", "data", "valor", "conta_codigo", "metodo")
        antes = [r for r in tag("lancamentos_classificados.csv") if r["banco"] == "AURORA"]
        self.assertEqual(sem_id(self.out["lancamentos_classificados.csv"], *cols), sem_id(antes, *cols))

    def test_sem_transferencia_em_transito_inventada(self):
        # at the tag without 05b: the four Aurora transfers called "in transit" for lack of the statement
        self.assertEqual(self.pend("TRANSFERENCIA_EM_TRANSITO"), [])


class Sem06(Base):
    sem = ("06_",)

    def test_opcional_sem_aviso(self):
        self.assertEqual(self.avisos, [])

    def test_remessa_e_extratos_como_na_tag(self):
        self.assertRemessaComoNaTag()
        self.assertEqual(self.out["lancamentos_classificados.csv"], tag("lancamentos_classificados.csv"))


class RastroDaPendencia(Base):
    """The new pendência obeys the grader's rule: rastro sums to the reported value."""
    sem = ("01_",)

    def test_rastro_soma_o_valor(self):
        dep = self.pend("DEPENDENCIA_AUSENTE")[0]
        h, rows = self.r.csv("rastro.csv")
        soma = sum((Decimal(r[3]) for r in rows if r[0] == dep["id_saida"]), Decimal("0"))
        self.assertEqual(f"{soma:.2f}", dep["valor_brl"])


del Base

if __name__ == "__main__":
    unittest.main()
