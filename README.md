# JSONPlaceholder API Tests (Playwright · TypeScript · Ajv 2020-12)

Lightweight, maintainable API automation framework targeting `https://jsonplaceholder.typicode.com`.

> **Key premise**: JSONPlaceholder emulates mutations and is **non‑persistent**. For `POST`/`PUT`/`PATCH`/`DELETE` we validate **status / headers / response contract / echo** — we **do not** verify state via follow‑up `GET`.

---

## Features

* ✅ Playwright **API testing** with TypeScript
* ✅ **Tags**: `@happy-path` and `@negative`
* ✅ **Traceability**: each test maps to a unique **TC‑ID** (e.g., `TC-POSTS-GET-200-001`)
* ✅ **JSON Schema (draft 2020‑12)** via Ajv (`ajv/dist/2020`) + `ajv-formats`
* ✅ **Data‑driven** tests (external JSON payloads)
* ✅ **ESLint 9** (flat) + **Prettier**; **Husky** + **lint‑staged** pre‑commit
* ✅ Example **nightly CI** (GitHub Actions) in `/docs/ci-examples.md`

---

## Requirements

* **Node.js** ≥ 20
* **npm** ≥ 9

> Browsers are not required for API tests. Set `PW_SKIP_BROWSER_DOWNLOAD=1` if you initialized Playwright with browsers.

---

## Quick start

```bash
# 1) Install deps
npm ci

# 2) Run tests
npm run test              # full suite
npm run test:happy        # only `@happy-path`
npm run test:negative     # only `@negative`

# 3) Show last HTML report
npm run report
```

---

## Project structure

```
.
├─ docs/
│  ├─ test-conventions.md        # IDs, tags, assertions, decision log
│  ├─ test-cases.md              # 24+ documented TCs (names, steps, expected)
│  ├─ coverage-matrix.md         # traceability table
│  ├─ bug-handling.md            # failures policy, quarantine, template
│  └─ ci-examples.md             # nightly full run example (GitHub Actions)
├─ schemas/                      # JSON Schemas (draft 2020-12)
│  ├─ post.schema.json
│  ├─ comment.schema.json
│  ├─ album.schema.json
│  ├─ photo.schema.json
│  ├─ todo.schema.json
│  ├─ user.schema.json           # minimal (happy-path)
│  └─ user.full.schema.json      # strict nested (spot-check)
├─ test-data/
│  ├─ posts.valid.json
│  ├─ posts.patch.valid.json
│  └─ posts.invalid-types.json
├─ tests/
│  ├─ posts.spec.ts
│  ├─ users.spec.ts              # includes TC-USERS-GET-FULLSCHEMA-025
│  ├─ todos.spec.ts
│  ├─ comments.spec.ts
│  ├─ albums_photos.spec.ts
│  ├─ nested.spec.ts
│  ├─ negative.spec.ts
│  └─ edge.spec.ts
├─ src/
│  └─ lib/
│     └─ schemaAssert.ts         # Ajv2020 helper (allErrors, formats)
├─ playwright.config.ts          # baseURL, reporter, timeouts
├─ eslint.config.mjs             # ESLint 9 flat config
└─ README.md
```

---

## Configuration

**Base URL** (excerpt from `playwright.config.ts`):

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: [['list'], ['html']],
  use: {
    baseURL: 'https://jsonplaceholder.typicode.com',
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
  },
});
```

**Ajv (draft 2020‑12) helper** (`src/lib/schemaAssert.ts`):

```ts
import Ajv2020, { ErrorObject } from 'ajv/dist/2020';
import addFormats from 'ajv-formats';

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

export function assertSchema(data: unknown, schema: object): void {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    const msg = (validate.errors || []).map(formatError).join('\n');
    throw new Error(`Schema validation failed:\n${msg}`);
  }
}

function formatError(e: ErrorObject): string {
  const path = e.instancePath || e.schemaPath || '<root>';
  return `• ${path} — ${e.message} (${JSON.stringify(e.params)})`;
}
```

---

## Test tags & traceability

* **Tags**: `@happy-path` (health/smoke), `@negative` (negatives & edges)
* **TC‑IDs**: every test title ends with `[TC-…]`; see `/docs/test-cases.md` and `/docs/coverage-matrix.md`.
* **Decision Log**: `/docs/test-conventions.md` → **DL‑2025‑08‑23** (non‑persistence policy).

Example test title:

```
GET /posts returns 200 and minimal contract @happy-path [TC-POSTS-GET-200-001]
```

---

## Data‑driven testing

External payloads live under `test-data/` and are imported directly in tests (TypeScript `resolveJsonModule` enabled). Examples:

* `posts.valid.json` → used for `POST /posts`
* `posts.patch.valid.json` → used for `PATCH /posts/1`
* `posts.invalid-types.json` → client‑side schema negative cases

---

## Linting & formatting

```bash
npm run format       # prettier --check
npm run format:fix   # prettier --write
npm run lint         # eslint .
npm run lint:fix     # eslint . --fix
```

**Husky pre‑commit** (runs `lint-staged` only):

```
.husky/pre-commit

#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

**lint‑staged config** (`.lintstagedrc.json`):

```json
{
  "*.{ts,js,json,md,yml,yaml}": [
    "prettier --write",
    "eslint --fix"
  ]
}
```

---

## CI (nightly full)

See `/docs/ci-examples.md` for a copy‑paste GitHub Actions workflow that runs the **full** suite nightly (UTC cron) and uploads the HTML report as an artifact. To enable, place the YAML into `.github/workflows/nightly-full.yml`.

---

## Assumptions & clarifications

* **Non‑persistence** of mutations is *expected*; tests do not perform read‑after‑write checks.
* Response ordering is **not** asserted unless guaranteed by the API.
* We validate `Content-Type` starts with `application/json` and use **JSON Schema** contracts for bodies.

---

## Troubleshooting

* **ESLint ESM warning**: use `eslint.config.mjs` (flat config, ESM) — already provided.
* **Skip browser download**: `PW_SKIP_BROWSER_DOWNLOAD=1 npx playwright install` (optional).

---

## License

MIT
