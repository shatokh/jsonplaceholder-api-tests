# Bug Handling & Failure Policy

## Principles

- Each automated test maps to a unique **TC ID** (see `/docs/test-cases.md` and `/docs/coverage-matrix.md`).
- For JSONPlaceholder, mutating operations are **non-persistent**; treat success codes with proper JSON echo as **expected**, without follow-up reads.

## On Any Failure (Pipeline)

Collect and attach:

- Full HTTP trace: method, URL, query, request/response headers, request/response bodies.
- JSON Schema diff (why validation failed).
- One-line `curl` reproducer.
- Run metadata: **TC ID**, tags, suite file, start time (UTC), duration, commit SHA, branch, Node/Playwright versions, configured timeouts/retries.
- Links: CI job logs and HTML report.

## Stability Policy

- Allow **one automatic re-run** only for idempotent GETs within the same job.
  - If re-run passes → mark **flaky**, quarantine test, open a **flaky** issue.
  - If re-run fails → proceed to **manual verification**.

## Manual Verification (avoid false green)

1. Reproduce with the provided `curl` **3 times**.
2. Compare actual vs expected: status, headers, contract, key fields.
3. Ensure assertions are not over-strict (e.g., do not assert array order when not guaranteed).

## Defect Classification

- **API bug** - incorrect status/contract/content per oracle.
- **Test bug** - wrong oracle, too-strict assertion, bad data.
- **Flaky** - intermittent infra/network/noise.

## Issue Template (Tracker)

- **Title:** `[API|TEST|FLAKY][TC-ID] Summary`
- **Labels:** `api-bug` / `test-bug` / `flaky` / `quarantine`
- **Severity/Priority:** e.g., S0/P0 breaks `@happy-path`
- **Environment:** runner, Node, Playwright, config
- **Repro steps:** one-line `curl` + input JSON (if data-driven)
- **Expected vs Actual:** status, headers, contract, fields
- **Artifacts:** links to HTML report, logs, schema diff, raw req/resp (mask secrets)
- **Related:** TC ID, suite file, commit/PR links, last green build
- **Notes:** hypothesis, frequency

## Quarantine Policy

- Mark test as quarantined (skip only in **nightly full**).
- **SLA:**
  - Flaky/Test bug - fix within **3 working days**.
  - API bug (high severity) - prioritize with owners; keep in quarantine until fixed.
- **Exit criteria:** two consecutive green nightly runs after the fix is merged.

## Daily Triage

- Nightly summary: number of failures, new vs known, tag/module breakdown, top offenders.
- Metrics: pass rate per tag, flaky rate, MTTR for test bugs.
