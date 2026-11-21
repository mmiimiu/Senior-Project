"""
ไฟล์เริ่มต้นระบบค้นหาคอนโดมิเนียมด้วยภาษาธรรมชาติภาษาไทย (Thai NLP Condo Search)
Tech Stack: Next.js (React/TypeScript) + Python FastAPI + SQLite (backend/data/condos.db)
รันระบบด้วยคำสั่งเดียว:
    npm run dev   หรือ   .venv/bin/python main.py
"""

import os
import shutil
import signal
import subprocess
import time
from pathlib import Path
import uvicorn
from backend.api.routes import app  # noqa: F401

ROOT_DIR = Path(__file__).resolve().parent


def free_port(port: int) -> None:
    """เคลียร์พอร์ตที่ค้างอยู่จากโปรเซสเก่าก่อนสตาร์ทเซิร์ฟเวอร์ใหม่"""
    try:
        res = subprocess.run(
            ["/usr/sbin/lsof", "-ti", f":{port}"],
            capture_output=True,
            text=True,
            check=False,
        )
        pids = [int(p) for p in res.stdout.strip().splitlines() if p.isdigit() and int(p) != os.getpid()]
        for pid in pids:
            try:
                os.kill(pid, signal.SIGTERM)
            except OSError:
                pass
        if pids:
            time.sleep(0.6)
    except Exception:
        pass


def start_nextjs_dev_server(host: str = "127.0.0.1", next_port: int = 3000):
    """สตาร์ท Next.js Dev Server ที่พอร์ต 3000 อัตโนมัติควบคู่กับ FastAPI"""
    next_cli = ROOT_DIR / "node_modules" / "next" / "dist" / "bin" / "next"
    if not next_cli.exists():
        return None
    env = os.environ.copy()
    local_bin = str(Path.home() / ".local" / "bin")
    env["PATH"] = f"{local_bin}:/opt/homebrew/bin:/usr/local/bin:{env.get('PATH', '')}"
    node_bin = shutil.which("node", path=env["PATH"])
    if not node_bin:
        return None
    free_port(next_port)
    print(f"[Next.js Frontend] เปิดหน้าเว็บ Next.js ได้ที่ http://localhost:{next_port}", flush=True)
    return subprocess.Popen(
        [node_bin, str(next_cli), "dev", "-H", host, "-p", str(next_port)],
        cwd=str(ROOT_DIR),
        env=env,
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5500))
    host = os.environ.get("HOST", "127.0.0.1")
    free_port(port)
    next_proc = start_nextjs_dev_server(host, 3000)
    try:
        print(f"[FastAPI + SQLite] เปิดหน้าเว็บ/API ได้ที่ http://localhost:{port}", flush=True)
        print(f"[Swagger Docs]     ดูเอกสาร API ได้ที่ http://localhost:{port}/docs", flush=True)
        uvicorn.run("backend.api.routes:app", host=host, port=port, reload=False)
    finally:
        if next_proc and next_proc.poll() is None:
            next_proc.terminate()
