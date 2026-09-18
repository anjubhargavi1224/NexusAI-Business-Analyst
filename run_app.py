"""
NEXUS AI — Business Intelligence & Decision Support
Unified Application Launcher

Usage:
  python run_app.py         # Runs production server at http://localhost:8000 (FastAPI + Built React UI)
  python run_app.py --dev   # Runs backend (port 8000) & Vite frontend dev server (port 5173) concurrently
"""

import sys
import os
import subprocess
import webbrowser
import time
from pathlib import Path

def main():
    root_dir = Path(__file__).resolve().parent
    is_dev = "--dev" in sys.argv

    print("=" * 70)
    print("  NEXUS AI — Business Intelligence & Decision Support")
    print("  MSc Artificial Intelligence in Business Portfolio Edition")
    print("=" * 70)

    if is_dev:
        print("[Mode: DEVELOPMENT]")
        print("Starting FastAPI backend on http://localhost:8000 ...")
        backend_proc = subprocess.Popen(
            [sys.executable, "-m", "uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"],
            cwd=str(root_dir)
        )
        time.sleep(2)

        print("Starting Vite frontend server on http://localhost:5173 ...")
        frontend_proc = subprocess.Popen(
            ["npm.cmd", "run", "dev"],
            cwd=str(root_dir / "frontend"),
            shell=True
        )

        try:
            backend_proc.wait()
            frontend_proc.wait()
        except KeyboardInterrupt:
            print("\nShutting down NEXUS AI servers...")
            backend_proc.terminate()
            frontend_proc.terminate()

    else:
        print("[Mode: PRODUCTION / STANDALONE]")
        dist_dir = root_dir / "frontend" / "dist"
        if not (dist_dir / "index.html").exists():
            print("Frontend production build not found. Building now with Vite...")
            subprocess.run(["npm.cmd", "run", "build"], cwd=str(root_dir / "frontend"), shell=True, check=True)

        print("\nStarting unified NEXUS AI server on http://localhost:8000 ...")
        print("Point your browser to: http://localhost:8000")
        print("Press Ctrl+C to terminate the server.\n")

        import uvicorn
        uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=False)

if __name__ == "__main__":
    main()
