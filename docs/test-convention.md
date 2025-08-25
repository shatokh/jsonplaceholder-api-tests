# Test Conventions - JSONPlaceholder API

This document standardizes how we **name**, **tag**, **assert**, **trace**, and **maintain** API tests in this repository.

## 1) ID Scheme (unique per automated test)

**Format:** `TC-{SEQ}-{RESOURCE}-{OP}-{QUALIFIER}`

- **SEQ**: 3-digit counter per `{RESOURCE}-{OP}-{ASPECT}` (e.g., `001`, `002`). Never reuse IDs.
- **RESOURCE** (caps):
  - `POSTS`, `COMMENTS`, `ALBUMS`, `PHOTOS`, `TODOS`, `USERS`, `NESTED`, `UNKNOWN`
- **OP**:
  - `GET`, `GETID`, `POST`, `PUT`, `PATCH`, `DELETE`
- **ASPECT** (what we assert/cover):
  - `200` (basic 200 OK), `JSONSCHEMA` (contract), `FILTER`, `NESTED`,
  - `NO-CTYPE`, `MALFORMED`, `SCHEMA-INVALID`,
  - `DELETE-2XX`, `WRONG-ACCEPT`, `PARALLEL`, `EMPTY`, `UNICODE`

**Examples:**

- `TC-001-POSTS-GET-200` - basic list with 200 and minimal contract
- `TC-011-POSTS-POST-2XX` - POST success, JSON echo + id, contract enforced
- `TC-014-POSTS-DELETE-2XX` - DELETE returns 2xx (mock trait)

## 2) Tags

- `@happy-path` - fast health coverage across key resources and one example per mutating op (emulated).
- `@negative` - negatives + edges (unknown route, bad types, malformed JSON, wrong Accept, parallelism, empty filters, large payloads).
- **Full** run = no tag filter.
- Internal operational tag (rare): `@quarantine` - used only to exclude known-flaky/blocked tests from **nightly full**; not used for local runs.

**CLI:**

- `npx playwright test --grep @happy-path`
- `npx playwright test --grep @negative`
- `npx playwright test` (full)

## 3) Suite Layout

Suites live under `tests/` and mirror resources:

- `posts.spec.ts`, `users.spec.ts`, `todos.spec.ts`, `comments.spec.ts`, `albums_photos.spec.ts`, `nested.spec.ts`, `negative.spec.ts`, `edge.spec.ts`.

## 4) Oracles for Mutating Operations (IMPORTANT)

JSONPlaceholder **does not persist** `POST/PUT/PATCH/DELETE`. We therefore:

- Validate **status** (2xx), **headers** (e.g., `Content-Type: application/json`), and **response contract/echo**.
- **Do NOT** expect follow-up `GET` to reflect changes.
- `DELETE` for any ID may return 2xx; treat as expected mock behavior.
- For `POST`, a numeric `id` is expected (value may vary); do not assert exact `id` value.

These rules prevent false failures on a stateless mock.

## 5) Assertion Policy (per test)

- **Status code**
- **Headers:** at least `Content-Type` starts with `application/json`
- **Contract:** JSON Schema (Ajv, Draft 2020-12) for objects and array items
- **Key fields:** e.g., `id`, `userId`; non-empty `title/body`
- **Ordering:** do **not** assert order unless guaranteed by API
- **Optional latency note:** we may log durations; no strict SLOs in CI

## 6) Parameterization & Data-Driven

- **Parameterize** recurring shapes: collections, `GET/{id}`, filters, nested.
- **Data-Driven** for `POST/PUT/PATCH` using files in `/test-data/*.json`.
- Each dataset = its **own TC** (unique ID in test title). In parameterized tests, ensure the TC ID is present in the generated test name.

## 7) Traceability

- Each automated test title **ends with** `[TC-…]`.
- `/docs/test-cases.md` - contains **every** TC with: Name, Description, Preconditions, Steps, Expected.
- `/docs/coverage-matrix.md` - rows = TC IDs; columns = resource, operation, type (happy/negative), tags, suite file.

## 8) Naming Conventions

- Test title: concise action + expectation + tag + `[TC-ID]`.
  - Example: `GET /posts returns 200 and minimal contract @happy-path [TC-001-POSTS-GET-200]`
- Commit messages referencing tests include the TC ID, e.g., `test(posts): add filter by userId @happy-path [TC-007-POSTS-GET-FILTER-200]`.

## 9) CI & Scheduling

- **Nightly full** (UTC cron) runs the entire set. HTML report is published as an artifact.
- Local flows: `test:happy`, `test:negative`, `test:full`.

## 10) Bug Handling (short reference)

- On failure, collect: full HTTP trace, schema diff, one-line `curl`, run metadata (TC ID, tags, suite, UTC time, commit SHA, Node/Playwright versions).
- One automatic re-run only for idempotent GET; if pass → **flaky**.
- See `/docs/bug-handling.md` for full process, quarantine policy, and template.

## 11) Encoding & Headers

- All payloads use UTF-8 JSON.
- Default `Accept: application/json` is set in Playwright config; specify `Content-Type: application/json; charset=UTF-8` for mutating operations.

## 12) Adding a New Test Case - Checklist

1. Define **ID** following the scheme (unique).
2. Place the test in an appropriate **suite**; add **tag**.
3. Ensure **assertions** follow the policy (status, headers, contract, key fields).
4. If data-driven, add JSON to `/test-data` and reference it.
5. Append the case to `/docs/test-cases.md` and `/docs/coverage-matrix.md`.
6. Commit with TC ID in the message.

## 13) Decision Log (confirmed by Volodymyr)

**DL-2025-08-23 - Mutations are non-persistent by design.**  
Per examiner’s clarification: “Treat non-persistence as expected; validate only status/headers/response contract for POST/PUT/PATCH/DELETE, **without verifying state changes** via follow-up GET.”  
Implications:

- Mutation tests assert **2xx**, `Content-Type`, and **JSON Schema/echo** only.
- We **do not** perform read-after-write/DELETE checks.
- `DELETE` may return 2xx for any id; absence is **not** required.
- Any failure caused solely by lack of persistence is a **test-bug** (wrong oracle), not an API defect.

## 14) Attachments: cURL on fail(added in edge.spec.ts for POST only )

- For all mutation tests, we record a ready-to-run `curl` command before the HTTP call.
- A Playwright fixture attaches it **only when a test fails**, under **Attachments → cURL repro**.
- The command is portable across shells (Windows/macOS/Linux).
