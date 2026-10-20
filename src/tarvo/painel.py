"""Build the month-end close panel: embed engine events and outputs into the HTML template.

The page is a single file that opens without a server and without network. It carries:

- the engine events (``__EVENTOS_JSON__``), the source of every number on screen;
- the engine outputs in ``saida/`` and the raw origin lines in the month folder
  (``__DADOS_JSON__``), which the drill-down ("Mergulho") shows. The outputs are embedded
  only if they match the events, so a stale ``saida/`` never reaches the screen.

Usage (from the repository root):
    python3 -m src.tarvo.painel relatorio/eventos.jsonl relatorio/painel.html
"""

from __future__ import annotations

import csv
import datetime
import email
import io
import json
import logging
import re
import sys
from decimal import Decimal, InvalidOperation
from pathlib import Path

logger = logging.getLogger(__name__)

TEMPLATE = Path(__file__).resolve().parent / "vitrine" / "painel.html"
PLACEHOLDER = "__EVENTOS_JSON__"
DATA_PLACEHOLDER = "__DADOS_JSON__"
OUTPUT_FILES = {
    "comissoes": "comissoes_por_lojista.csv",
    "divergencias": "divergencias_taxa.csv",
    "notas": "notas_a_emitir.csv",
    "lancamentos": "lancamentos_classificados.csv",
    "pendencias": "pendencias.csv",
}
VALUE_COLUMN = {"comissoes": "comissao_brl", "divergencias": "diferenca_brl", "notas": "valor_brl",
                "lancamentos": "valor", "pendencias": "valor_brl"}
# Ponte sheet columns the page cannot show as they came: dates are Excel serials and the spread is a
# fraction. The export hands them over converted, next to the cells, so the page only formats.
PONTE_DATE_COLUMNS = ("Data Contratação", "Data Liquidação")
PONTE_PERCENT_COLUMNS = ("Spread %",)
EXCEL_EPOCH = datetime.date(1899, 12, 30)  # day 0 of the 1900 date system, as Excel counts it
PERCENT = Decimal(100)


def _embed(payload) -> str:
    """Serialize a payload as JSON safe to place inside a <script> element."""
    raw = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    # Escaping every "<" also covers "</script" and "<!--", and stays valid JSON.
    return raw.replace("<", "\\u003c")


def render(events: list[dict] | None, data: dict | None, template: Path = TEMPLATE) -> str:
    """Return the page with events and data embedded (empty list and null for live mode)."""
    html = Path(template).read_text(encoding="utf-8")
    for marker in (PLACEHOLDER, DATA_PLACEHOLDER):
        if marker not in html:
            raise ValueError(f"placeholder {marker} missing from {template}")
    html = html.replace(PLACEHOLDER, _embed(events or []), 1)
    return html.replace(DATA_PLACEHOLDER, _embed(data), 1)


def build_panel(events: list[dict], dest: Path, month_dir: Path | None = None,
                out_dir: Path | None = None) -> Path:
    """Read the template, embed events, outputs and origin lines, and write the panel to dest."""
    dest = Path(dest)
    data = collect_data(events, month_dir=month_dir, out_dir=out_dir)
    html = render(events, data)
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(html, encoding="utf-8")
    logger.info("panel written: %s (%d events)", dest, len(events))
    return dest


# ---------------------------------------------------------------- data for the drill-down

def collect_data(events: list[dict] | None, month_dir: Path | None = None,
                 out_dir: Path | None = None) -> dict:
    """Gather what the drill-down shows: raw origin lines and the engine outputs.

    month_dir defaults to the folder named in the `inicio` event; out_dir defaults to
    ``saida`` in the working directory, the engine default. Outputs are kept only when
    they match the events (same ids and values); otherwise ``saida`` is null.
    """
    notes: list[str] = []
    if month_dir is None:
        start = next((e for e in events or [] if e.get("tipo") == "inicio"), None)
        folder = ((start or {}).get("fonte") or {}).get("arquivo") or ""
        month_dir = Path(folder) if folder else None
    origin = {}
    if month_dir is not None and Path(month_dir).is_dir():
        origin = read_origin(Path(month_dir), notes)
    else:
        notes.append("pasta do mês não encontrada: linhas de origem fora do painel")
    outputs = None
    if events:
        outputs = read_outputs(Path(out_dir) if out_dir else Path("saida"), events, notes)
    return {"versao": 1, "origem": origin, "saida": outputs, "avisos": notes}


def _find(folder: Path, prefix: str) -> Path | None:
    hits = sorted(folder.glob(prefix + "*"))
    return hits[0] if hits else None


def read_origin(folder: Path, notes: list[str]) -> dict:
    """Raw lines of each month file, keyed by the reference the engine writes in `fonte.ref`."""
    out: dict[str, dict] = {}
    readers = (("01_", _orbe_csv), ("06_", _orbe_csv), ("02_", _rate_sheet), ("03_", _ponte_eml),
               ("05a_", _aurora_csv), ("05b_", _meridiano_ofx), ("04_", _chart_of_accounts))
    for prefix, reader in readers:
        path = _find(folder, prefix)
        if path is None:
            continue
        try:
            out[path.name] = reader(path)
        except Exception as exc:  # the panel never blocks the close
            notes.append(f"{path.name}: linhas de origem não lidas ({type(exc).__name__})")
    return out


def _orbe_csv(path: Path) -> dict:
    lines = path.read_bytes().decode("utf-8-sig", errors="replace").splitlines()
    header = lines[0] if lines else ""
    rows = {}
    order = []
    for number, text in enumerate(lines[1:], start=2):  # physical line, 1-based, header is 1
        ref = text.split(";", 1)[0].strip()
        if ref:
            rows[ref] = [number, text]
            order.append(ref)
    return {"tipo": "csv", "separador": ";", "cabecalho": header, "linha_cabecalho": 1,
            "linhas": rows, "ordem": order}


def _aurora_csv(path: Path) -> dict:
    lines = path.read_bytes().decode("utf-8-sig", errors="replace").splitlines()
    header_at = next((i for i, l in enumerate(lines) if l.startswith("Data;")), None)
    rows = {}
    order = []
    if header_at is not None:
        for i, text in enumerate(lines[header_at + 1:], start=header_at + 2):  # same L-number as the engine
            if text.strip():
                rows[f"L{i}"] = [i, text]
                order.append(f"L{i}")
    return {"tipo": "csv", "separador": ";", "cabecalho": lines[header_at] if header_at is not None else "",
            "linha_cabecalho": (header_at + 1) if header_at is not None else None,
            "linhas": rows, "ordem": order}


def _meridiano_ofx(path: Path) -> dict:
    text = path.read_bytes().decode("cp1252", errors="replace")
    rows = {}
    order = []
    for match in re.finditer(r"<STMTTRN>(.*?)</STMTTRN>", text, re.S):
        block = match.group(0).replace("\r", "")
        number = text.count("\n", 0, match.start()) + 1
        fitid = re.search(r"<FITID>([^\n<]*)", block)
        ref = fitid.group(1).strip() if fitid else f"L{number}"
        fields = {tag: value.strip() for tag, value in re.findall(r"<([A-Z]+)>([^\n<]*)", block)
                  if tag != "STMTTRN"}
        rows[ref] = [number, block.strip(), fields]
        order.append(ref)
    return {"tipo": "ofx", "linhas": rows, "ordem": order}


def _ponte_eml(path: Path) -> dict:
    from .engine import read_xlsx  # same reader the engine uses

    msg = email.message_from_bytes(path.read_bytes())
    att = next((p for p in msg.walk() if p.get_filename() and p.get_filename().endswith(".xlsx")), None)
    if att is None:
        return {"tipo": "xlsx", "linhas": {}, "ordem": []}
    book = read_xlsx(att.get_payload(decode=True))
    sheet_name, rows = next(iter(book.items()))
    header = next((r for r in rows if r.get("A") == "Nº Operação"), None)
    if header is None:
        return {"tipo": "xlsx", "anexo": att.get_filename(), "aba": sheet_name, "linhas": {}, "ordem": []}
    letters = [k for k in header if k != "_row"]
    names = [header[k] for k in letters]
    out: dict[str, list] = {}
    order = []
    for r in rows:
        op = r.get("A", "")
        if op.startswith("PC-"):
            cells = [r.get(k, "") for k in letters]
            out.setdefault(op, []).append([int(r["_row"]), cells, _ponte_converted(names, cells)])
            order.append(op)
    return {"tipo": "xlsx", "anexo": att.get_filename(), "aba": sheet_name,
            "cabecalho": names, "linha_cabecalho": int(header["_row"]),
            "linhas": out, "ordem": order}


def _ponte_converted(names: list[str], cells: list[str]) -> dict:
    """Dates in ISO and the spread in percent points, keyed by column; unreadable cells are left out."""
    by_name = dict(zip(names, cells))
    converted: dict = {}
    for name in PONTE_DATE_COLUMNS:
        iso = excel_date_iso(by_name.get(name, ""))
        if iso is not None:
            converted[name] = iso
    for name in PONTE_PERCENT_COLUMNS:
        points = fraction_to_percent(by_name.get(name, ""))
        if points is not None:
            converted[name] = points
    return converted


def excel_date_iso(value: str) -> str | None:
    """An Excel serial date ("46269") as ISO ("2026-09-04"); None when the cell is not a serial.

    Args:
        value: the cell as the sheet reader returns it.

    Returns:
        The date in ISO 8601, or None for an empty or non-numeric cell.
    """
    try:
        days = int(Decimal(str(value).strip()))
    except (InvalidOperation, ValueError, OverflowError):
        return None
    return (EXCEL_EPOCH + datetime.timedelta(days=days)).isoformat()


def fraction_to_percent(value: str) -> float | None:
    """A fraction cell ("0.015007") in percent points (1.5007), exact to the digits of the cell.

    Decimal moves the point without binary noise, so the JSON carries 1.5007, not 1.5006999999.

    Args:
        value: the cell as the sheet reader returns it.

    Returns:
        The value times 100, or None for an empty or non-numeric cell.
    """
    try:
        points = Decimal(str(value).strip()) * PERCENT
    except InvalidOperation:
        return None
    if not points.is_finite():
        return None
    return float(points.normalize())


def _rate_sheet(path: Path) -> dict:
    """Tabs of the rate sheet with their row counts, and the merchant register (EC/CNPJ to name).

    The engine reads only the current tab; the panel says so next to the line count. The register
    gives the merchant name as the finance team wrote it, for the live screen before the outputs exist.
    """
    from .engine import cnpj14, read_xlsx

    book = read_xlsx(path.read_bytes())
    tabs = [{"nome": name, "linhas": len(rows)} for name, rows in book.items()]
    by_ec, by_cnpj = {}, {}
    current = next(iter(book.values()), [])
    for row in current:  # same filter as the engine's contract reader
        if row.get("A") and row.get("B") and row["_row"] != "5" and row.get("A") != "Lojista":
            by_cnpj[cnpj14(row["B"])] = row["A"]
            ec = (row.get("C") or "").strip()
            if ec:
                by_ec[ec] = row["A"]
    return {"tipo": "planilha", "abas": tabs, "cadastro": {"ec": by_ec, "cnpj": by_cnpj}}


def _chart_of_accounts(path: Path) -> dict:
    text = path.read_bytes().decode("latin-1")
    rows = list(csv.DictReader(io.StringIO(text), delimiter=";"))
    return {"tipo": "plano", "contas": {r.get("COD_CONTA", ""): r.get("DESCRICAO", "") for r in rows}}


def _read_csv(path: Path) -> tuple[list[str], list[list[str]]]:
    with path.open(newline="", encoding="utf-8") as fh:
        reader = csv.reader(fh, delimiter=";")
        header = next(reader, [])
        return header, [row for row in reader]


def read_outputs(out_dir: Path, events: list[dict], notes: list[str]) -> dict | None:
    """The engine outputs, kept only if every id and value matches the events."""
    tables = {}
    try:
        for key, name in OUTPUT_FILES.items():
            header, rows = _read_csv(out_dir / name)
            tables[key] = {"colunas": header, "linhas": rows}
        rastro_header, rastro_rows = _read_csv(out_dir / "rastro.csv")
    except (OSError, StopIteration) as exc:
        notes.append(f"saídas do motor não lidas em {out_dir} ({type(exc).__name__})")
        return None
    by_id = {}
    for key, table in tables.items():
        cols = table["colunas"]
        i_id, i_val = cols.index("id_saida"), cols.index(VALUE_COLUMN[key])
        for row in table["linhas"]:
            by_id[row[i_id]] = row[i_val]
    for e in events:
        sid = e.get("id_saida") or ""
        if not sid or e.get("tipo") not in ("decisao", "total"):
            continue
        if sid not in by_id:
            notes.append(f"saídas em {out_dir} não batem com os eventos ({sid} ausente)")
            return None
        try:
            if abs(float(by_id[sid]) - float(e.get("valor") or 0)) > 0.005:
                notes.append(f"saídas em {out_dir} não batem com os eventos ({sid})")
                return None
        except ValueError:
            notes.append(f"saídas em {out_dir}: valor ilegível em {sid}")
            return None
    # rastro.csv, compact: id_saida -> [[file index, ref, value, metadata index], ...]
    files, metas, trace = [], [], {}
    file_ix, meta_ix = {}, {}
    i = {c: rastro_header.index(c) for c in ("id_saida", "arquivo_origem", "ref_origem", "valor", "metadata")}
    for row in rastro_rows:
        arq, meta = row[i["arquivo_origem"]], row[i["metadata"]]
        if arq not in file_ix:
            file_ix[arq] = len(files)
            files.append(arq)
        if meta not in meta_ix:
            meta_ix[meta] = len(metas)
            metas.append(meta)
        trace.setdefault(row[i["id_saida"]], []).append(
            [file_ix[arq], row[i["ref_origem"]], row[i["valor"]], meta_ix[meta]])
    tables["rastro"] = {"arquivos": files, "metadados": metas, "itens": trace}
    return tables


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
