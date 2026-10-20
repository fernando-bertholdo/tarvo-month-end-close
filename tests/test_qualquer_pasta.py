"""The command and the live server run from any folder, called by path.

`python3 -m src.tarvo` needs the repository root as the working folder (finding of 19/10: run
elsewhere, it says "No module named 'src'"). Called by path, the package finds itself. Paths on
the command line keep the usual meaning: relative to the folder where the command is typed.
"""
from __future__ import annotations

import os
import socket
import subprocess
import sys
import time
import unittest
from pathlib import Path

from tests.apoio import REPO, Rodada

PACOTE = REPO / "src" / "tarvo"


def ambiente():
    env = dict(os.environ, TARVO_IA_PORTA="nenhuma", PYTHONIOENCODING="utf-8")
    env.pop("PYTHONPATH", None)
    return env


class ComandoDeQualquerPasta(unittest.TestCase):
    def setUp(self):
        self.r = Rodada()
        self.fora = self.r.tmp / "outra-pasta"
        self.fora.mkdir()

    def tearDown(self):
        self.r.fechar()

    def rodar(self, *args):
        env = ambiente()
        env["TARVO_IA_CACHE"] = str(self.r.tmp / "ia_cache.json")
        return subprocess.run([sys.executable, str(PACOTE), *args], cwd=self.fora, env=env,
                              capture_output=True, text=True, timeout=120)

    def test_pelo_caminho_com_pastas_explicitas(self):
        p = self.rodar(str(self.r.mes), "--saida", str(self.r.saida), "--relatorio", str(self.r.relatorio))
        self.assertEqual(p.returncode, 0, p.stderr)
        self.assertIn("R$ 203.735,34", p.stdout)
        self.assertTrue((self.r.saida / "comissoes_por_lojista.csv").is_file())
        self.assertTrue((self.r.relatorio / "eventos.jsonl").is_file())

    def test_caminhos_relativos_a_pasta_onde_se_digita(self):
        p = self.rodar("../mes")
        self.assertEqual(p.returncode, 0, p.stderr)
        self.assertTrue((self.fora / "saida" / "rastro.csv").is_file())
        self.assertTrue((self.fora / "relatorio" / "painel.html").is_file())


class ServidorDeQualquerPasta(unittest.TestCase):
    def test_servidor_pelo_caminho_usa_o_motor_real(self):
        with socket.socket() as s:
            s.bind(("127.0.0.1", 0))
            porta = s.getsockname()[1]
        r = Rodada()
        try:
            proc = subprocess.Popen(
                [sys.executable, str(PACOTE / "servidor.py"), str(r.mes), "--porta", str(porta),
                 "--sem-navegador"],
                cwd=r.tmp, env=ambiente(), stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
            try:
                saida, limite = "", time.time() + 20
                while "[servidor] http" not in saida and time.time() < limite and proc.poll() is None:
                    saida += proc.stdout.readline()
            finally:
                proc.terminate()
                proc.wait(timeout=10)
                proc.stdout.close()
        finally:
            r.fechar()
        self.assertIn("motor real", saida)
        self.assertNotIn("não importa", saida)


if __name__ == "__main__":
    unittest.main()
