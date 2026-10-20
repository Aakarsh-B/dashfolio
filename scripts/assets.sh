#!/usr/bin/env bash
# Rebuild everything that comes from the content: small card covers, share cards, the resume PDF and the pages.
# Each step skips work that's already up to date. Used by both GitHub workflows; you can run it locally too
# (needs Pillow and Playwright: pip install pillow; npm i --no-save playwright; npx playwright install chromium).
set -euo pipefail
cd "$(dirname "$0")/.."
python3 scripts/thumbs.py
node scripts/og.js
node scripts/resume-pdf.js
SITE_URL=https://aakarsh.design node scripts/build-pages.js
