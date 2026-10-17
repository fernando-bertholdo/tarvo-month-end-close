"""Local live server for the Tarvo month-end close screen.

Usage, from the repository root:

    python3 -m src.tarvo.servidor dados [--porta 8765] [--vitrine padrao|refinada]
                                        [--sem-pausa] [--sem-navegador] [--exemplo]

Endpoints:
    GET  /          the page template (vitrine), served as is
    POST /rodar     starts one close run in a background thread (202, or 409 if busy)
    GET  /eventos   Server-Sent Events with the events of the current run,
                    paced by `peso`; the stream closes after the `fim` event

Standard library only.
"""

from __future__ import annotations

import argparse
import json
import mimetypes
import sys
import threading
import time
import traceback
import webbrowser
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

REPO_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_VITRINE = REPO_ROOT / "src" / "tarvo" / "vitrine" / "painel.html"
REFINED_VITRINE = REPO_ROOT / "vitrine-refinada" / "painel.html"
EXAMPLE_LOG = REPO_ROOT / "src" / "tarvo" / "vitrine" / "exemplo_eventos.jsonl"

HEARTBEAT_S = 10.0
# Pause applied before delivering each event to the screen, by `peso`.
PAUSE_BY_WEIGHT = {"rotina": 0.0, "atencao": 0.3, "excecao": 1.2}
# Routine events are grouped: one short pause every ROUTINE_GROUP routine events.
ROUTINE_GROUP = 25
ROUTINE_GROUP_PAUSE = 0.05


def _now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


class Run:
    """One close run: an append-only event buffer that readers can follow."""

    def __init__(self) -> None:
        self.events: list[dict] = []
        self.done = False
        self.cond = threading.Condition()

    def emit(self, event: dict) -> None:
        with self.cond:
            self.events.append(dict(event))
            if event.get("tipo") == "fim":
                self.done = True
            self.cond.notify_all()

    def finish(self, reason: str | None = None) -> None:
        """Guarantee the run ends with a `fim` event."""
        with self.cond:
            if self.done:
                return
        seq = len(self.events) + 1
        if reason:
            self.emit({"seq": seq, "ts": _now_iso(), "tipo": "aviso", "motivo": reason})
            seq += 1
        self.emit({"seq": seq, "ts": _now_iso(), "tipo": "fim",
                   "motivo": "fechamento interrompido" if reason else "fechamento concluído",
                   "resumo": {}})

    def wait_for(self, index: int, timeout: float) -> tuple[list[dict], bool]:
        """Return events from `index` on (possibly empty after timeout) and the done flag."""
        with self.cond:
            if len(self.events) <= index and not self.done:
                self.cond.wait(timeout)
            return self.events[index:], self.done


class State:
    """Server-wide state: the current run and how to start one."""

    def __init__(self, month_dir: Path, use_example: bool, paced: bool) -> None:
        self.month_dir = month_dir
        self.use_example = use_example
        self.paced = paced
        self.lock = threading.Lock()
        self.run: Run | None = None
        self.run_started = threading.Condition()

    def start_run(self) -> bool:
        with self.lock:
            if self.run is not None and not self.run.done:
                return False
            run = Run()
            with self.run_started:
                self.run = run
                self.run_started.notify_all()
        threading.Thread(target=self._execute, args=(run,), daemon=True).start()
        return True

    def current_run(self, timeout: float) -> Run | None:
        with self.run_started:
            if self.run is None:
                self.run_started.wait(timeout)
            return self.run

    def _execute(self, run: Run) -> None:
        started = time.monotonic()
        try:
            if self.use_example:
                fake_run_close(run.emit)
            else:
                from src.tarvo.engine import run_close  # imported late: engine may change

                run_close(str(self.month_dir), out_dir="saida", report_dir="relatorio",
                          emit=run.emit)
            run.finish()
        except Exception as exc:  # keep the screen alive and say what broke
            traceback.print_exc()
            run.finish(f"erro no motor: {type(exc).__name__}: {exc}")
        print(f"[servidor] rodada concluída em {time.monotonic() - started:.1f} s, "
              f"{len(run.events)} eventos", flush=True)


def fake_run_close(emit) -> dict:
    """Stand-in engine: replays the example event log."""
    summary: dict = {}
    with EXAMPLE_LOG.open(encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if not line:
                continue
            event = json.loads(line)
            emit(event)
            if event.get("tipo") == "fim":
                summary = event.get("resumo", {})
            time.sleep(0.02)
    return summary


def engine_available() -> bool:
    path = REPO_ROOT / "src" / "tarvo" / "engine.py"
    if not path.exists():
        return False
    try:
        from src.tarvo import engine  # noqa: F401
    except Exception as exc:
        print(f"[servidor] aviso: src/tarvo/engine.py não importa ({exc})", flush=True)
        return False
    return hasattr(engine, "run_close")


def make_handler(state: State, page: Path):
    static_root = page.parent.resolve()

    class Handler(BaseHTTPRequestHandler):
        protocol_version = "HTTP/1.1"

        def log_message(self, fmt, *args):  # quieter log, one line per request
            sys.stderr.write(f"[http] {self.command} {self.path} {args[1] if len(args) > 1 else ''}\n")

        def _send(self, code: int, body: bytes, ctype: str) -> None:
            self.send_response(code)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body)

        def _json(self, code: int, payload: dict) -> None:
            self._send(code, json.dumps(payload, ensure_ascii=False).encode("utf-8"),
                       "application/json; charset=utf-8")

        def do_GET(self):
            path = urlparse(self.path).path
            if path in ("/", "/index.html", "/painel.html"):
                self._serve_file(page)
            elif path == "/eventos":
                self._stream_events()
            elif path == "/favicon.ico":
                self._send(204, b"", "image/x-icon")
            else:
                target = (static_root / path.lstrip("/")).resolve()
                if static_root in target.parents and target.is_file():
                    self._serve_file(target)
                else:
                    self._send(404, b"not found", "text/plain; charset=utf-8")

        def do_POST(self):
            path = urlparse(self.path).path
            length = int(self.headers.get("Content-Length") or 0)
            if length:
                self.rfile.read(length)
            if path != "/rodar":
                self._send(404, b"not found", "text/plain; charset=utf-8")
                return
            if state.start_run():
                self._json(202, {"status": "iniciado"})
            else:
                self._json(409, {"status": "em curso"})

        def _serve_file(self, file: Path) -> None:
            try:
                body = file.read_bytes()  # read per request: the template may change
            except OSError:
                self._send(404, b"pagina nao encontrada", "text/plain; charset=utf-8")
                return
            ctype = mimetypes.guess_type(file.name)[0] or "application/octet-stream"
            if ctype.startswith("text/") or ctype in ("application/javascript", "application/json"):
                ctype += "; charset=utf-8"
            self._send(200, body, ctype)

        def _write(self, chunk: str) -> None:
            self.wfile.write(chunk.encode("utf-8"))
            self.wfile.flush()

        def _stream_events(self) -> None:
            self.send_response(200)
            self.send_header("Content-Type", "text/event-stream; charset=utf-8")
            self.send_header("Cache-Control", "no-cache")
            self.send_header("Connection", "close")
            self.send_header("X-Accel-Buffering", "no")
            self.end_headers()
            self.close_connection = True
            try:
                self._write(": conectado\n\n")
                run = None
                while run is None:  # no run yet: wait for POST /rodar, keep alive
                    run = state.current_run(HEARTBEAT_S)
                    if run is None:
                        self._write(": ping\n\n")
                index = 0
                routine_count = 0
                last_write = time.monotonic()
                while True:
                    wait = max(0.1, HEARTBEAT_S - (time.monotonic() - last_write))
                    batch, done = run.wait_for(index, wait)
                    if not batch:
                        if done:
                            return
                        self._write(": ping\n\n")
                        last_write = time.monotonic()
                        continue
                    for event in batch:
                        index += 1
                        if state.paced and event.get("tipo") == "decisao":
                            weight = event.get("peso", "rotina")
                            if weight == "rotina":
                                routine_count += 1
                                if routine_count % ROUTINE_GROUP == 0:
                                    time.sleep(ROUTINE_GROUP_PAUSE)
                            else:
                                time.sleep(PAUSE_BY_WEIGHT.get(weight, 0.0))
                        line = json.dumps(event, ensure_ascii=False, separators=(",", ":"))
                        self._write(f"data: {line}\n\n")
                        last_write = time.monotonic()
                        if event.get("tipo") == "fim":
                            return
            except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
                return  # browser closed or reconnected

    return Handler


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="python3 -m src.tarvo.servidor",
                                     description="Tela ao vivo do fechamento mensal da Tarvo.")
    parser.add_argument("month_dir", help="pasta do mês (ex.: dados)")
    parser.add_argument("--porta", type=int, default=8765)
    parser.add_argument("--vitrine", choices=("padrao", "refinada"), default="padrao")
    parser.add_argument("--sem-pausa", action="store_true", help="entrega os eventos sem ritmo")
    parser.add_argument("--sem-navegador", action="store_true", help="não abre o navegador")
    parser.add_argument("--exemplo", action="store_true",
                        help="motor falso: reemite src/tarvo/vitrine/exemplo_eventos.jsonl")
    args = parser.parse_args(argv)

    month_dir = Path(args.month_dir)
    use_example = args.exemplo
    if not use_example:
        if not month_dir.is_dir():
            print(f"[servidor] pasta do mês não encontrada: {month_dir}", file=sys.stderr)
            return 2
        if not engine_available():
            print("[servidor] aviso: motor real (src/tarvo/engine.py:run_close) indisponível; "
                  "usando o motor de exemplo", flush=True)
            use_example = True

    page = DEFAULT_VITRINE
    if args.vitrine == "refinada":
        if REFINED_VITRINE.is_file():
            page = REFINED_VITRINE
        else:
            print(f"[servidor] aviso: {REFINED_VITRINE.relative_to(REPO_ROOT)} não existe; "
                  "usando a vitrine padrão", flush=True)
    if not page.is_file():
        print(f"[servidor] aviso: {page.relative_to(REPO_ROOT)} ainda não existe; "
              "GET / responde 404 até ele aparecer", flush=True)

    state = State(month_dir.resolve(), use_example, paced=not args.sem_pausa)
    try:
        server = ThreadingHTTPServer(("127.0.0.1", args.porta), make_handler(state, page))
    except OSError as exc:
        print(f"[servidor] não consegui abrir a porta {args.porta}: {exc}", file=sys.stderr)
        return 1
    server.daemon_threads = True

    url = f"http://127.0.0.1:{args.porta}/?ao_vivo=1"
    motor = "exemplo" if use_example else "real"
    print(f"[servidor] {url}  (motor {motor}, vitrine {page.relative_to(REPO_ROOT)}, "
          f"pausa {'desligada' if args.sem_pausa else 'ligada'})", flush=True)
    if not args.sem_navegador:
        threading.Timer(0.5, webbrowser.open, args=(url,)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[servidor] encerrado", flush=True)
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
