"""Build the month-end close panel: embed engine events into the HTML template.

Usage (from the repository root):
    python3 -m src.tarvo.painel relatorio/eventos.jsonl relatorio/painel.html
"""

from __future__ import annotations

import json
import logging
import sys
from pathlib import Path

logger = logging.getLogger(__name__)

TEMPLATE = Path(__file__).resolve().parent / "vitrine" / "painel.html"
PLACEHOLDER = "__EVENTOS_JSON__"


def _embed(events: list[dict]) -> str:
    """Serialize events as JSON safe to place inside a <script> element."""
    raw = json.dumps(events, ensure_ascii=False, separators=(",", ":"))
    # Escaping every "<" also covers "</script" and "<!--", and stays valid JSON.
    return raw.replace("<", "\\u003c")


def build_panel(events: list[dict], dest: Path) -> Path:
    """Read the template, embed the events and write the panel to dest."""
    dest = Path(dest)
    html = TEMPLATE.read_text(encoding="utf-8")
    if PLACEHOLDER not in html:
        raise ValueError(f"placeholder {PLACEHOLDER} missing from {TEMPLATE}")
    html = html.replace(PLACEHOLDER, _embed(events), 1)
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(html, encoding="utf-8")
    logger.info("panel written: %s (%d events)", dest, len(events))
    return dest


def read_events(path: Path) -> list[dict]:
    """Read a JSONL event log, skipping blank lines."""
    events = []
    with Path(path).open(encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if line:
                events.append(json.loads(line))
    return events


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("uso: python3 -m src.tarvo.painel <eventos.jsonl> <painel.html>", file=sys.stderr)
        return 2
    out = build_panel(read_events(Path(argv[0])), Path(argv[1]))
    print(out)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
