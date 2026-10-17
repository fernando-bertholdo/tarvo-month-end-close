"""Short API call to check the key. Prints only 'chave OK' or 'erro <HTTP code> <error type>'."""
import json
import urllib.error
import urllib.request

from .ia import API_URL, model, read_key


def main() -> None:
    key = read_key()
    if not key:
        print("erro 0 chave_ausente")
        return
    body = {"model": model(), "max_tokens": 5, "messages": [{"role": "user", "content": "ok"}]}
    req = urllib.request.Request(API_URL, data=json.dumps(body).encode(), method="POST",
                                 headers={"x-api-key": key, "anthropic-version": "2023-06-01",
                                          "content-type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=30):
            print("chave OK")
    except urllib.error.HTTPError as e:
        try:
            kind = json.loads(e.read().decode()).get("error", {}).get("type", "desconhecido")
        except Exception:
            kind = "desconhecido"
        print(f"erro {e.code} {kind}")
    except Exception as e:
        print(f"erro 0 {type(e).__name__}")


if __name__ == "__main__":
    main()
