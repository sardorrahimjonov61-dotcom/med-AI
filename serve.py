#!/usr/bin/env python3
"""Serve Med-AI static files from the repository directory, regardless of where command is run."""

from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import argparse


def main() -> None:
    parser = argparse.ArgumentParser(description="Serve Med-AI static app")
    parser.add_argument("--host", default="127.0.0.1", help="Host to bind (default: 127.0.0.1)")
    parser.add_argument("--port", type=int, default=8000, help="Port to bind (default: 8000)")
    args = parser.parse_args()

    root = Path(__file__).resolve().parent
    handler = lambda *h_args, **h_kwargs: SimpleHTTPRequestHandler(*h_args, directory=str(root), **h_kwargs)

    server = ThreadingHTTPServer((args.host, args.port), handler)
    print(f"Serving Med-AI from {root} at http://{args.host}:{args.port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
