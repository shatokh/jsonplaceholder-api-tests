# Test Cases - JSONPlaceholder API

> See **/docs/test-conventions.md** for ID scheme, tags, suite layout, oracles, assertions, parameterization, traceability, CI, and bug handling.  
> **Mutations are non-persistent** by design. For `POST`/`PUT`/`PATCH`/`DELETE` we validate **status/headers/contract/echo only** - **no** read-after-write checks.

---

### TC-001-POSTS-GET-200

**Name:** GET `/posts` - 200, JSON, minimal item contract  
**Tags:** `@happy-path`  
**Suite:** `tests/posts.spec.ts`  
**Preconditions:** Base URL is reachable; no auth.  
**Steps:**

- Send `GET /posts`.
- Capture `status`, `headers`, `body`.

**Expected:**

- Status `200`.
- Header `Content-Type` starts with `application/json`.
- Body is an array with length `>= 1`.
- Each item has: `userId:number`, `id:number`, `title:string` (non-empty), `body:string` (non-empty).

---

### TC-002-POSTS-GETID-200

**Name:** GET `/posts/1` - 200, item contract  
**Tags:** `@happy-path`  
**Suite:** `tests/posts.spec.ts`  
**Preconditions:** None.  
**Steps:**

- Send `GET /posts/1`.

**Expected:**

- Status `200`.
- JSON object with `userId:number`, `id:1`, `title:string`, `body:string`.

---

### TC-003-USERS-GET-200

**Name:** GET `/users` - 200, JSON, minimal user contract  
**Tags:** `@happy-path`  
**Suite:** `tests/users.spec.ts`  
**Steps:**

- Send `GET /users`.

**Expected:**

- Status `200`.
- JSON array.
- Each item has `id:number`, `name:string`, `username:string`, `email:string` (`format: email`).

---

### TC-004-TODOS-GET-200

**Name:** GET `/todos` - 200, JSON, minimal todo contract  
**Tags:** `@happy-path`  
**Suite:** `tests/todos.spec.ts`  
**Steps:**

- Send `GET /todos`.

**Expected:**

- Status `200`.
- JSON array.
- Each item has `userId:number`, `id:number`, `title:string`, `completed:boolean`.

---

### TC-005-ALBUMS-GET-200

**Name:** GET `/albums` - 200, JSON, minimal album contract  
**Tags:** `@happy-path`  
**Suite:** `tests/albums_photos.spec.ts`  
**Steps:**

- Send `GET /albums`.

**Expected:**

- Status `200`.
- JSON array.
- Each item has `userId:number`, `id:number`, `title:string`.

---

### TC-006-PHOTOS-GET-200

**Name:** GET `/photos` - 200, JSON, minimal photo contract  
**Tags:** `@happy-path`  
**Suite:** `tests/albums_photos.spec.ts`  
**Steps:**

- Send `GET /photos`.

**Expected:**

- Status `200`.
- JSON array (large; smoke-validate a representative subset, e.g., first `200` items).
- Each validated item has `albumId:number`, `id:number`, `title:string`, `url:string (uri)`, `thumbnailUrl:string (uri)`.

---

### TC-007-POSTS-GET-FILTER-200

**Name:** GET `/posts?userId=1` - filter integrity  
**Tags:** `@happy-path`  
**Suite:** `tests/posts.spec.ts`  
**Steps:**

- Send `GET /posts?userId=1`.

**Expected:**

- Status `200`.
- JSON array.
- **Every** item has `userId === 1`.

---

### TC-008-COMMENTS-GET-FILTER-200

**Name:** GET `/comments?postId=1` - filter integrity  
**Tags:** `@happy-path`  
**Suite:** `tests/comments.spec.ts`  
**Steps:**

- Send `GET /comments?postId=1`.

**Expected:**

- Status `200`.
- JSON array.
- **Every** item has `postId === 1`.

---

### TC-009-POSTS-GET-NESTED-200

**Name:** GET `/posts/1/comments` - nested correctness  
**Tags:** `@happy-path`  
**Suite:** `tests/nested.spec.ts`  
**Steps:**

- Send `GET /posts/1/comments`.

**Expected:**

- Status `200`.
- JSON array.
- **Every** item has `postId === 1`.

---

### TC-010-USERS-GET-NESTED-200

**Name:** GET `/users/1/todos` - nested correctness  
**Tags:** `@happy-path`  
**Suite:** `tests/nested.spec.ts`  
**Steps:**

- Send `GET /users/1/todos`.

**Expected:**

- Status `200`.
- JSON array.
- **Every** item has `userId === 1`.

---

### TC-011-POSTS-POST-2XX

**Name:** POST `/posts` - success (emulated), JSON echo with `id`  
**Tags:** `@happy-path`  
**Suite:** `tests/posts.spec.ts`  
**Preconditions:** Use `Content-Type: application/json; charset=UTF-8`.  
**Steps:**

- Send `POST /posts` with body `{ "title":"Hello", "body":"World", "userId":1 }`.

**Expected:**

- Status is in `2xx` (both `201` and `200` are acceptable).
- Header `Content-Type` starts with `application/json`.
- Response object conforms to **post** schema.
- Fields `title`, `body`, `userId` **echo** input.
- Field `id` exists and is a `number` (exact value not asserted).
- **Notes/Oracle:** non-persistent emulator - **no** follow-up `GET` to verify creation.

---

### TC-012-POSTS-PUT-2XX

**Name:** PUT `/posts/1` - success (emulated), full echo  
**Tags:** `@happy-path`  
**Suite:** `tests/posts.spec.ts`  
**Steps:**

- Send `PUT /posts/1` with a full valid object (e.g., `{ "id":1, "title":"Put Title", "body":"Put Body", "userId":1 }`).

**Expected:**

- Status is in `2xx`.
- JSON object conforms to **post** schema.
- Echoes sent fields (`title`, `body`, `userId`; server-controlled fields may differ by mock).
- **Notes/Oracle:** non-persistent emulator - **no** follow-up `GET` to verify update.

---

### TC-013-POSTS-PATCH-2XX

**Name:** PATCH `/posts/1` - success (emulated), partial update  
**Tags:** `@happy-path`  
**Suite:** `tests/posts.spec.ts`  
**Steps:**

- Send `PATCH /posts/1` with a partial body (e.g., `{ "title":"Updated" }`).

**Expected:**

- Status is in `2xx`.
- JSON object conforms to **post** schema.
- Patched field(s) reflect the request; other fields remain per mock behavior.
- **Notes/Oracle:** non-persistent emulator - **no** follow-up `GET` to verify partial update.

---

### TC-014-POSTS-DELETE-2XX

**Name:** DELETE `/posts/1` - success (emulated)  
**Tags:** `@happy-path`  
**Suite:** `tests/posts.spec.ts`  
**Steps:**

- Send `DELETE /posts/1`.

**Expected:**

- Status is in `2xx`.
- Body is empty or `{}`.
- **Notes/Oracle:** non-persistent emulator - **no** follow-up `GET` to verify absence; `DELETE` may return `2xx` for any `id`.

---

### TC-015-POSTS-POST-UNICODE-2XX

**Name:** POST `/posts` - Unicode payload round-trip  
**Tags:** `@happy-path`  
**Suite:** `tests/posts.spec.ts`  
**Steps:**

- Send `POST /posts` with `title`/`body` containing non-ASCII (e.g., `Żółć кириллица`), `userId:1`.

**Expected:**

- Status is in `2xx`.
- `Content-Type` is JSON (UTF-8).
- Response object conforms to **post** schema.
- Exact Unicode text in `title`/`body` is preserved (echo equals input).

---

### TC-016-UNKNOWN-GET-404

**Name:** GET `/unknown` - 404  
**Tags:** `@negative`  
**Suite:** `tests/negative.spec.ts`  
**Steps:**

- Send `GET /unknown`.
  **Expected:**
- Status `404` (or document **actual** if service behavior differs).
- Body may be empty; must not be HTML.

---

### TC-017-POSTS-GETID-NOTFOUND

**Name:** GET `/posts/999999` - not found (document actual)  
**Tags:** `@negative`  
**Suite:** `tests/negative.spec.ts`  
**Steps:**

- Send `GET /posts/999999`.

**Expected:**

- Preferably status `404`; if status `200`, body should be empty object `{}` or semantically empty.
- Treat non-standard behavior as a **mock trait** and **document** it.

---

### TC-018-POSTS-POST-NO-CTYPE

**Name:** POST `/posts` without `Content-Type` - behavior capture  
**Tags:** `@negative`  
**Suite:** `tests/negative.spec.ts`  
**Steps:**

- Send `POST /posts` with JSON string body but **omit** `Content-Type`.

**Expected:**

- Record **actual** status (typical range: `200/201/400/415/500`).
- Response must not be HTML; if JSON - document structure.

---

### TC-019-POSTS-POST-MALFORMED

**Name:** POST `/posts` malformed JSON - client/server error  
**Tags:** `@negative`  
**Suite:** `tests/negative.spec.ts`  
**Steps:**

- Send `POST /posts` with malformed body (e.g., `{ "title": "broken", `).

**Expected:**

- Status is in `4xx` (parse error) **or** mock may return `2xx` (document actual).
- Must **not** be treated as success in business sense.

---

### TC-020-POSTS-PUT-SCHEMA-INVALID

**Name:** PUT `/posts/1` - wrong types must fail **client** schema  
**Tags:** `@negative`  
**Suite:** `tests/negative.spec.ts`  
**Steps:**

- Send `PUT /posts/1` with invalid types (e.g., `{ "title":123, "body":true, "userId":"one" }`).

**Expected:**

- Even if server returns `2xx`, client JSON Schema validation **fails**.
- Status is recorded; test fails on schema mismatch.

---

### TC-021-POSTS-PATCH-SCHEMA-INVALID

**Name:** PATCH `/posts/1` - wrong types must fail **client** schema  
**Tags:** `@negative`  
**Suite:** `tests/negative.spec.ts`  
**Steps:**

- Send `PATCH /posts/1` with invalid types (e.g., `{ "userId":"2" }`).

**Expected:**

- Client JSON Schema validation **fails** (test fails).
- Record actual status from server.

---

### TC-022-POSTS-DELETE-NONEXIST-2XX

**Name:** DELETE `/posts/999999999` - success (mock trait)  
**Tags:** `@negative`  
**Suite:** `tests/negative.spec.ts`  
**Steps:**

- Send `DELETE /posts/999999999`.

**Expected:**

- Status is in `2xx` (typical for this mock).
- Document that absence is **not** enforced post-delete (non-persistent).

---

### TC-023-POSTS-GET-ACCEPT-NEG

**Name:** GET `/posts` with wrong `Accept` - behavior capture  
**Tags:** `@negative`  
**Suite:** `tests/negative.spec.ts`  
**Steps:**

- Send `GET /posts` with header `Accept: text/xml`.

**Expected:**

- Status is commonly `200` or `406` - **record actual**.
- Header `Content-Type` must **not** indicate HTML; response content documented.

---

### TC-024-MULTI-GET-PARALLEL-200

**Name:** Parallel GETs across resources - health under light load  
**Tags:** `@negative`  
**Suite:** `tests/edge.spec.ts`  
**Steps:**

- In parallel, send `GET /posts`, `GET /users`, `GET /todos`, `GET /albums`, `GET /photos`.

**Expected:**

- All statuses `200`.
- Log durations; no significant errors/timeouts.

---

### TC-025-POSTS-GET-FILTER-EMPTY-200

**Name:** GET `/posts?userId=999` - empty result  
**Tags:** `@negative`  
**Suite:** `tests/negative.spec.ts`  
**Steps:**

- Send `GET /posts?userId=999`.

**Expected:**

- Status `200`.
- Body is an array with length `0`.

### TC-026-USERS-GET-FULLSCHEMA-200

**Name:** GET `/users` — first item matches full nested schema  
**Tags:** `@happy-path`  
**Suite:** `tests/users.spec.ts`  
**Preconditions:** Base URL is reachable; no auth.  
**Steps:**

- Send `GET /users`.
- Parse the JSON array.
- Select the first item (`index 0`).
  **Expected:**
- Status `200`.
- Header `Content-Type` starts with `application/json`.
- Body is an array with length `>= 1`.
- The first item conforms to **full user schema** (`address.geo`, `company`, required string fields).
- Note: list-wide minimal contract is covered by `TC-003-USERS-GET-200`; here we spot-check **strict nested** structure.

### TC-027-POSTS-POST-LARGE-2XX

**Name:** POST `/posts` — large payload from template (data-driven, echo & schema)  
**Tags:** `@negative`  
**Suite:** `tests/edge.spec.ts`  
**Preconditions:**

- Use `Content-Type: application/json; charset=UTF-8`.
- Data source: `/test-data/posts.large.template.json` (expanded via `repeat` and helper).  
  **Steps:**
- Materialize template payload(s) using helper `expandTemplate` (e.g., `title` ⇒ 256 chars, `body` ⇒ 5000 chars, `userId:1`).
- Send `POST /posts` with the expanded JSON body.
- Capture `status`, `headers`, `body`.
  **Expected:**
- Status is in `2xx`.
- Header `Content-Type` starts with `application/json`.
- Response body conforms to **post** JSON Schema.
- Field `title` is echoed; its length equals expected `titleLength` (e.g., `256` code points).
- Field `body` is echoed; its length equals expected `bodyLength` (e.g., `5000` code points).
- Field `userId` equals input (`1`); field `id` exists and is a `number`.
- **Notes/Oracle:** Non-persistent emulator — **no** follow-up `GET`. Length is measured in Unicode code points (emoji-safe). Data-driven expectations are taken from the template (`expect.titleLength`, `expect.bodyLength`).

### TC-028-POSTS-POST-BOUNDARY-2XX

**Name:** POST `/posts` — boundary payloads (data-driven, echo & schema)  
**Tags:** `@happy-path`  
**Suite:** `tests/posts.spec.ts`

**Preconditions:**

- Send requests with header `Content-Type: application/json; charset=UTF-8`.
- Data source: `/test-data/posts.boundary.valid.json` (boundary-valid inputs: minimal/maximal lengths, special characters, etc.).
- Schema: `schemas/post.schema.json` (JSON Schema 2020-12).
- JSONPlaceholder is **non-persistent** for `POST/PUT/PATCH/DELETE` — do **not** verify state via a follow-up `GET`.

**Steps:**

- Iterate over each payload in `/test-data/posts.boundary.valid.json`.
- For each payload, send `POST /posts` with the JSON body.
- Capture `status`, `headers`, and response `body`.

**Expected:**

- `status` is in the `2xx` range.
- `Content-Type` header starts with `application/json`.
- Response `body` conforms to the **post** schema.
- Fields `title`, `body`, and `userId` are echoed exactly as sent.
- Field `id` exists and is a `number`.
- (Data-driven) Inputs at the boundaries remain intact in the echo (e.g., min/max length strings preserved).
