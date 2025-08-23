# CI Examples — Nightly Full Run (GitHub Actions)

> Note: GitHub Actions `cron` uses **UTC**. Adjust hours if you need a specific local time.

## Nightly Full Run (HTML report as artifact)

Create `.github/workflows/nightly-full.yml`:

```yaml
name: Nightly Full API Tests

on:
  schedule:
    - cron: "0 1 * * *"   # 01:00 UTC nightly
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    env:
      PW_SKIP_BROWSER_DOWNLOAD: 1
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"
      - run: npm ci
      - run: npx playwright test --reporter="dot,html"
      - name: Upload HTML report
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report
