# Test Cases - JSONPlaceholder API

> See **/docs/test-conventions.md** for ID scheme, tags, suite layout, oracles, assertions, parameterization, traceability, CI, and bug handling.  
> **Mutations are non-persistent** by design. For `POST`/`PUT`/`PATCH`/`DELETE` we validate **status/headers/contract/echo only** - **no** read-after-write checks.

---

### TC-POSTS-GET-200-001

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

### TC-POSTS-GETID-200-002

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

### TC-USERS-GET-200-003

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

### TC-TODOS-GET-200-004

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

### TC-ALBUMS-GET-200-005

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

### TC-PHOTOS-GET-200-006

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

### TC-POSTS-GET-FILTER-200-007

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

### TC-COMMENTS-GET-FILTER-200-008

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

### TC-POSTS-GET-NESTED-200-009

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

### TC-USERS-GET-NESTED-200-010

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

### TC-POSTS-POST-JSONSCHEMA-002

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

### TC-POSTS-PUT-JSONSCHEMA-011

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

### TC-POSTS-PATCH-JSONSCHEMA-012

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

### TC-POSTS-DELETE-2XX-013

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

### TC-POSTS-POST-UNICODE-014

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

### TC-UNKNOWN-GET-404-015

**Name:** GET `/unknown` - 404  
**Tags:** `@negative`  
**Suite:** `tests/negative.spec.ts`  
**Steps:**

- Send `GET /unknown`.
  **Expected:**
- Status `404` (or document **actual** if service behavior differs).
- Body may be empty; must not be HTML.

---

### TC-POSTS-GETID-NOTFOUND-016

**Name:** GET `/posts/999999` - not found (document actual)  
**Tags:** `@negative`  
**Suite:** `tests/negative.spec.ts`  
**Steps:**

- Send `GET /posts/999999`.

**Expected:**

- Preferably status `404`; if status `200`, body should be empty object `{}` or semantically empty.
- Treat non-standard behavior as a **mock trait** and **document** it.

---

### TC-POSTS-POST-NO-CTYPE-017

**Name:** POST `/posts` without `Content-Type` - behavior capture  
**Tags:** `@negative`  
**Suite:** `tests/negative.spec.ts`  
**Steps:**

- Send `POST /posts` with JSON string body but **omit** `Content-Type`.

**Expected:**

- Record **actual** status (typical range: `200/201/400/415/500`).
- Response must not be HTML; if JSON - document structure.

---

### TC-POSTS-POST-MALFORMED-018

**Name:** POST `/posts` malformed JSON - client/server error  
**Tags:** `@negative`  
**Suite:** `tests/negative.spec.ts`  
**Steps:**

- Send `POST /posts` with malformed body (e.g., `{ "title": "broken", `).

**Expected:**

- Status is in `4xx` (parse error) **or** mock may return `2xx` (document actual).
- Must **not** be treated as success in business sense.

---

### TC-POSTS-PUT-SCHEMA-INVALID-019

**Name:** PUT `/posts/1` - wrong types must fail **client** schema  
**Tags:** `@negative`  
**Suite:** `tests/negative.spec.ts`  
**Steps:**

- Send `PUT /posts/1` with invalid types (e.g., `{ "title":123, "body":true, "userId":"one" }`).

**Expected:**

- Even if server returns `2xx`, client JSON Schema validation **fails**.
- Status is recorded; test fails on schema mismatch.

---

### TC-POSTS-PATCH-SCHEMA-INVALID-020

**Name:** PATCH `/posts/1` - wrong types must fail **client** schema  
**Tags:** `@negative`  
**Suite:** `tests/negative.spec.ts`  
**Steps:**

- Send `PATCH /posts/1` with invalid types (e.g., `{ "userId":"2" }`).

**Expected:**

- Client JSON Schema validation **fails** (test fails).
- Record actual status from server.

---

### TC-POSTS-DELETE-NONEXIST-2XX-021

**Name:** DELETE `/posts/999999999` - success (mock trait)  
**Tags:** `@negative`  
**Suite:** `tests/negative.spec.ts`  
**Steps:**

- Send `DELETE /posts/999999999`.

**Expected:**

- Status is in `2xx` (typical for this mock).
- Document that absence is **not** enforced post-delete (non-persistent).

---

### TC-ACCEPT-WRONG-NEG-022

**Name:** GET `/posts` with wrong `Accept` - behavior capture  
**Tags:** `@negative`  
**Suite:** `tests/negative.spec.ts`  
**Steps:**

- Send `GET /posts` with header `Accept: text/xml`.

**Expected:**

- Status is commonly `200` or `406` - **record actual**.
- Header `Content-Type` must **not** indicate HTML; response content documented.

---

### TC-PARALLEL-GET-SMOKE-023

**Name:** Parallel GETs across resources - health under light load  
**Tags:** `@negative`  
**Suite:** `tests/edge.spec.ts`  
**Steps:**

- In parallel, send `GET /posts`, `GET /users`, `GET /todos`, `GET /albums`, `GET /photos`.

**Expected:**

- All statuses `200`.
- Log durations; no significant errors/timeouts.

---

### TC-FILTER-EMPTY-024

**Name:** GET `/posts?userId=999` - empty result  
**Tags:** `@negative`  
**Suite:** `tests/negative.spec.ts`  
**Steps:**

- Send `GET /posts?userId=999`.

**Expected:**

- Status `200`.
- Body is an array with length `0`.

### TC-USERS-GET-FULLSCHEMA-025

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
- Note: list-wide minimal contract is covered by `TC-USERS-GET-200-003`; here we spot-check **strict nested** structure.
