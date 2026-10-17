"""AI stage of the close: proposes the counterpart account for bank lines no rule covers.

The AI only picks an account. Amounts never depend on it. Order: versioned cache,
then the port chosen by TARVO_IA_PORTA (auto, api, claude-code, nenhuma).
Any failure returns None, which the engine turns into a human decision.
"""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import urllib.error
import urllib.request
from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CACHE_PATH = Path(__file__).resolve().parent / "ia_cache.json"
DEFAULT_MODEL = "claude-sonnet-5-5"
DEFAULT_THRESHOLD = 0.90  # raised from 0.80 by Fernando after the blind test (17/10)
API_URL = "https://api.anthropic.com/v1/messages"
TIMEOUT_S = 60

SCHEMA = {
    "type": "object",
    "properties": {
        "conta": {"type": ["string", "null"], "description": "account code from the chart, or null"},
        "confianca": {"type": "number", "minimum": 0, "maximum": 1},
        "motivo": {"type": "string", "description": "short reason in Portuguese"},
        "escalar": {"type": "boolean", "description": "true to hand the case to a person"},
    },
    "required": ["conta", "confianca", "motivo", "escalar"],
    "additionalProperties": False,
}


# The API's structured outputs ignore numeric bounds; range is enforced in validate().
API_SCHEMA = {
    **SCHEMA,
    "properties": {**SCHEMA["properties"], "confianca": {"type": "number"},
                   "conta": {"anyOf": [{"type": "string"}, {"type": "null"}]}},
}


def model() -> str:
    return os.environ.get("TARVO_IA_MODELO") or DEFAULT_MODEL


def threshold() -> float:
    try:
        return float(os.environ.get("TARVO_IA_LIMITE_CONFIANCA", DEFAULT_THRESHOLD))
    except ValueError:
        return DEFAULT_THRESHOLD


def cache_path() -> Path:
    return Path(os.environ.get("TARVO_IA_CACHE") or CACHE_PATH)


def read_key() -> str | None:
    """Read the key from the root .env at call time; never exported, never printed."""
    env = ROOT / ".env"
    try:
        for raw in env.read_text(encoding="utf-8").splitlines():
            line = raw.strip()
            if line.startswith("TARVO_ANTHROPIC_API_KEY="):
                val = line.split("=", 1)[1].strip().strip('"').strip("'")
                return val or None
    except OSError:
        return None
    return None


def resolve_port() -> str:
    port = (os.environ.get("TARVO_IA_PORTA") or "auto").strip().lower()
    if port != "auto":
        return port
    if read_key():
        return "api"
    if shutil.which("claude"):
        return "claude-code"
    return "nenhuma"


def cache_key(ln: dict) -> str:
    return f"{ln.get('banco')}|{ln.get('ref')}|{ln.get('desc')}|{Decimal(str(ln.get('valor'))):.2f}"


def load_cache(path: Path) -> dict:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        if isinstance(data, dict) and isinstance(data.get("decisoes"), dict):
            return data
    except (OSError, ValueError):
        pass
    return {"versao": 1, "decisoes": {}}


def save_cache(path: Path, data: dict) -> None:
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        tmp = path.with_suffix(".tmp")
        tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
        tmp.replace(path)
    except OSError:
        pass


def system_prompt(plano: dict[str, str]) -> str:
    contas = "\n".join(f"- {c}: {d}" for c, d in sorted(plano.items()))
    return (
        "Você classifica movimentos bancários no plano de contas do ERP de uma subadquirente "
        "(empresa de pagamentos que liquida vendas de cartão e Pix para lojistas e cobra comissão).\n"
        "Para cada movimento do extrato, escolha a conta de CONTRAPARTIDA do lançamento "
        "(o banco é a outra perna). Use só contas desta lista de contas analíticas que aceitam lançamento:\n"
        f"{contas}\n\n"
        "Descrição, data, sinal e valor são só contexto: você não calcula nem altera valores.\n"
        "Se não tiver segurança sobre a conta, ou se o movimento puder caber em mais de uma conta, "
        "marque escalar=true, conta=null e explique em motivo. Não invente conta fora da lista.\n"
        "confianca é a sua probabilidade (0 a 1) de a conta estar certa. motivo: uma frase curta em português."
    )


def user_prompt(ln: dict) -> str:
    valor = Decimal(str(ln.get("valor")))
    sinal = "entrada (crédito no banco)" if valor > 0 else "saída (débito no banco)"
    data = ln.get("data")
    data = data.isoformat() if hasattr(data, "isoformat") else str(data)
    return (
        f"Banco: {ln.get('banco')}\nData: {data}\nDescrição: {ln.get('desc')}\n"
        f"Sinal: {sinal}\nValor: {valor:.2f}\n\nClassifique este movimento."
    )


def validate(obj, plano: dict[str, str]) -> dict | None:
    if not isinstance(obj, dict):
        return None
    conta, conf, motivo, escalar = obj.get("conta"), obj.get("confianca"), obj.get("motivo"), obj.get("escalar")
    if not isinstance(escalar, bool) or not isinstance(motivo, str):
        return None
    if isinstance(conf, bool) or not isinstance(conf, (int, float)) or not 0 <= conf <= 1:
        return None
    if conta is not None and not isinstance(conta, str):
        return None
    if not escalar and conta not in plano:
        return None
    if conta is not None and conta not in plano:
        conta = None
    return {"conta": conta, "confianca": float(conf), "motivo": motivo.strip()[:300], "escalar": escalar}


def call_api(ln: dict, plano: dict[str, str]):
    key = read_key()
    if not key:
        return None
    body = {
        "model": model(),
        "max_tokens": 400,
        # temperature is rejected for this model family; decisions are cached for repeatability
        "system": system_prompt(plano),
        "messages": [{"role": "user", "content": user_prompt(ln)}],
        # structured output (JSON schema); forced tool_choice is rejected by this model family
        "output_config": {"format": {"type": "json_schema", "schema": API_SCHEMA}},
    }
    req = urllib.request.Request(
        API_URL,
        data=json.dumps(body).encode("utf-8"),
        headers={"x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=TIMEOUT_S) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    text = "".join(b.get("text", "") for b in data.get("content", []) if b.get("type") == "text")
    return json.loads(text) if text else None


def call_claude_code(ln: dict, plano: dict[str, str]):
    exe = shutil.which("claude")
    if not exe:
        return None
    env = {k: v for k, v in os.environ.items() if k not in ("ANTHROPIC_API_KEY", "TARVO_ANTHROPIC_API_KEY")}
    prompt = system_prompt(plano) + "\n\n" + user_prompt(ln) + "\nResponda só com o JSON do esquema."
    cmd = [exe, "-p", prompt, "--output-format", "json", "--json-schema", json.dumps(SCHEMA),
           "--model", model(), "--tools", "", "--strict-mcp-config"]
    proc = subprocess.run(cmd, capture_output=True, text=True, timeout=TIMEOUT_S, env=env,
                          cwd=str(Path(os.environ.get("TMPDIR", "/tmp"))), stdin=subprocess.DEVNULL)
    if proc.returncode != 0:
        return None
    out = json.loads(proc.stdout)
    if isinstance(out, list):  # some CLI versions print the whole event list
        out = next((e for e in reversed(out) if isinstance(e, dict) and e.get("type") == "result"), {})
    if isinstance(out, dict) and isinstance(out.get("structured_output"), dict):
        return out["structured_output"]
    text = out.get("result") if isinstance(out, dict) else None
    if isinstance(text, str):
        text = text.strip()  # no str.removeprefix: keeps Python 3.8 compatibility
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
        return json.loads(text)
    return None


def ask(port: str, ln: dict, plano: dict[str, str]) -> dict | None:
    fn = call_api if port == "api" else call_claude_code if port == "claude-code" else None
    if fn is None:
        return None
    for _ in range(2):  # one retry on invalid output or transport failure
        try:
            ok = validate(fn(ln, plano), plano)
        except (urllib.error.URLError, OSError, ValueError, subprocess.SubprocessError, KeyError, TypeError):
            ok = None
        if ok:
            return ok
    return None


def to_answer(dec: dict, plano: dict[str, str], porta: str) -> dict:
    conta = dec.get("conta") or ""
    conf = float(dec.get("confianca") or 0)
    motivo = dec.get("motivo") or ""
    aceita = bool(conta in plano and conf >= threshold() and not dec.get("escalar"))
    if dec.get("escalar"):
        motivo = f"IA passou para decisão humana: {motivo}"
    elif not aceita:
        motivo = f"confiança {conf:.2f} abaixo do limite {threshold():.2f}: {motivo}"
    return {"conta": conta, "confianca": conf, "motivo": motivo, "aceita": aceita,
            "modelo": dec.get("modelo") or model(), "porta": porta}


def classify(lines: list[dict], plano: dict[str, str]) -> list[dict | None]:
    """One answer per line, same order. Never raises."""
    try:
        return _classify(lines, plano)
    except Exception:  # the engine must never stop because of the AI stage
        return [None] * len(lines)


def _classify(lines, plano):
    path = cache_path()
    cache = load_cache(path)
    port = None
    out, dirty = [], False
    for ln in lines:
        try:
            key = cache_key(ln)
            hit = cache["decisoes"].get(key)
            if isinstance(hit, dict) and (hit.get("conta") in plano or hit.get("escalar")):
                out.append(to_answer(hit, plano, "cache"))
                continue
            port = port or resolve_port()
            dec = ask(port, ln, plano)
            if dec is None:
                out.append(None)
                continue
            data = ln.get("data")
            cache["decisoes"][key] = {
                "lancamento": {"banco": ln.get("banco"), "ref": ln.get("ref"),
                               "data": data.isoformat() if hasattr(data, "isoformat") else str(data),
                               "desc": ln.get("desc"), "valor": f"{Decimal(str(ln.get('valor'))):.2f}"},
                **dec, "modelo": model(), "porta": port,
                "data": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            }
            dirty = True
            out.append(to_answer(cache["decisoes"][key], plano, port))
        except Exception:
            out.append(None)
    if dirty:
        save_cache(path, cache)
    return out
