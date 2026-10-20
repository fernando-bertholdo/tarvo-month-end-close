"""CLI: python3 -m src.tarvo <month_folder> [--saida saida] [--relatorio relatorio].

From any folder, call the package by path: python3 <repo>/src/tarvo <month_folder>.
Paths on the command line are relative to the folder where the command is typed.
"""
import argparse
import sys
from pathlib import Path

if __package__:
    from .engine import run_close
else:  # run by path: put the repository root on the import path
    sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
    from src.tarvo.engine import run_close


def main() -> int:
    ap = argparse.ArgumentParser(description="Fecha o mês da Tarvo a partir da pasta de arquivos do mês.")
    ap.add_argument("pasta_mes")
    ap.add_argument("--saida", default="saida")
    ap.add_argument("--relatorio", default="relatorio")
    a = ap.parse_args()
    run = run_close(a.pasta_mes, a.saida, a.relatorio)
    r = run["resumo"]
    brl = lambda v: f"R$ {v:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    print(f"Fechamento de {a.pasta_mes}: {len(run['arquivos'])} arquivos lidos")
    for f in run["arquivos"]:
        print(f"  {f['arquivo']}: {f['linhas']} linhas")
    print(f"Comissão checkout:        {brl(r['comissao_checkout'])}")
    print(f"Comissão remessa:         {brl(r['comissao_remessa'])}")
    print(f"Divergências a cobrar:    {brl(r['divergencia_orbe'])} (Orbe) + {brl(r['divergencia_ponte'])} (Ponte)")
    print(f"Devolução Casa do Estudante: {brl(r['devolucao_casa'])}")
    print(f"Atlas sem faturar (bruto): {brl(r['atlas_bruto_sem_faturar'])}")
    print(f"Notas a emitir:           {r['notas']} ({brl(r['notas_brl'])})")
    print(f"Lançamentos classificados: {r['lancamentos']}")
    print(f"Pendências:               {r['pendencias']}")
    for w in run["avisos"]:
        print(f"AVISO: {w}")
    print(f"Arquivos em {a.saida}/; eventos e painel em {a.relatorio}/ ({r['duracao_s']} s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
