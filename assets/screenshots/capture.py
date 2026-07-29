#!/usr/bin/env python3
"""Playwright headless captura screenshots dos 4 apps ao vivo.
Salva em ./{projeto}-{shot}.png"""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

OUTDIR = Path(__file__).parent
OUTDIR.mkdir(parents=True, exist_ok=True)

TARGETS = [
    ("xequemath", "https://xequemath.vercel.app", "desktop"),
    ("xequemath-mobile", "https://xequemath.vercel.app", "mobile"),
    ("educahubplay", "https://educahubplay.vercel.app", "desktop"),
    ("educahubplay-mobile", "https://educahubplay.vercel.app", "mobile"),
    ("labconect", "https://labconnect-uneb.vercel.app", "desktop"),
    ("labconect-mobile", "https://labconnect-uneb.vercel.app", "mobile"),
    ("hq-lab", "https://hq-lab.vercel.app", "desktop"),
    ("hq-lab-mobile", "https://hq-lab.vercel.app", "mobile"),
    ("andre-fraga-site", "https://www.andrefraga.com", "desktop"),
    ("andre-fraga-mandato", "https://www.andrefraga.com/mandato", "desktop"),
]

DESKTOP = {"viewport": {"width": 1440, "height": 900}, "device_scale_factor": 2}
MOBILE = {"viewport": {"width": 390, "height": 844}, "device_scale_factor": 2,
          "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15"}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for name, url, kind in TARGETS:
        opts = MOBILE if kind == "mobile" else DESKTOP
        ctx = browser.new_context(**opts)
        page = ctx.new_page()
        try:
            page.goto(url, wait_until="networkidle", timeout=25000)
            page.wait_for_timeout(1500)
            outfile = OUTDIR / f"{name}.png"
            page.screenshot(path=str(outfile), full_page=False, type="png")
            print(f"OK {name} -> {outfile.name} ({outfile.stat().st_size // 1024}KB)")
        except Exception as e:
            print(f"FAIL {name} @ {url}: {e}")
        finally:
            ctx.close()
    browser.close()

print("DONE all captures")
