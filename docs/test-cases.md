# Test Cases — JSONPlaceholder API

> See **/docs/test-conventions.md** for ID scheme, tags, suite layout, oracles, assertions, parameterization, traceability, CI, and bug handling policies.

---

## TC-POSTS-GET-200-001
**Name:** GET /posts — 200, JSON, minimal item contract  
**Tags:** @happy-path  
**Suite:** `tests/posts.spec.ts`  
**Preconditions:** Base URL reachable; no auth.  
**Steps:**
1. Send `GET /posts`.  
2. Capture status, headers, body.  
**Expected:**
- Status `200`.  
- Header `Content-Type` starts with `application/json`.  
- Body is an array with length ≥ 1.  
- Each item has: `userId:number`, `id:number`, `title:string` (non-empty), `body:string` (non-empty).

---

## TC-POSTS-GETID-200-002
**Name:** GET /posts/1 — 200, item contract  
**Tags:** @happy-path  
**Suite:** `tests/posts.spec.ts`  
**Preconditions:** None.  
**Steps:** `GET /posts/1`.  
**Expected:** 200; JSON object with `userId:number`, `id:1`, `title:string`, `body:string`.

---

## TC-USERS-GET-200-003
**Name:** GET /users — 200, JSON, minimal user contract  
**Tags:** @happy-path  
**Suite:** `tests/users.spec.ts`  
**Steps:** `GET /users`.  
**Expected:** 200; JSON array; each item has `id:number`, `name:string`, `username:string`, `email:string`.

---

## TC-TODOS-GET-200-004
**Name:** GET /todos — 200, JSON, minimal todo contract  
**Tags:** @happy-path  
**Suite:** `tests/todos.spec.ts`  
**Steps:** `GET /todos`.  
**Expected:** 200; array; each item has `userId:number`, `id:number`, `title:string`, `completed:boolean`.

---

## TC-ALBUMS-GET-200-005
**Name:** GET /albums — 200, JSON, minimal album contract  
**Tags:** @happy-path  
**Suite:** `tests/albums_photos.spec.ts`  
**Steps:** `GET /albums`.  
**Expected:** 200; array; each item has `userId:number`, `id:number`, `title:string`.

---

## TC-PHOTOS-GET-200-006
**Name:** GET /photos — 200, JSON, minimal photo contract  
**Tags:** @happy-path  
**Suite:** `tests/albums_photos.spec.ts`  
**Steps:** `GET /photos`.  
**Expected:** 200; array; item has `albumId:number`, `id:number`, `title:string`, `url:string`, `thumbnailUrl:string`.

---

## TC-POSTS-GET-FILTER-200-007
**Name:** GET /posts?userId=1 — filter integrity  
**Tags:** @happy-path  
**Suite:** `tests/posts.spec.ts`  
**Steps:** `GET /posts?userId=1`.  
**Expected:** 200; array; **every** item has `userId===1`.

---

## TC-COMMENTS-GET-FILTER-200-008
**Name:** GET /comments?postId=1 — filter integrity  
**Tags:** @happy-path  
**Suite:** `tests/comments.spec.ts`  
**Steps:** `GET /comments?postId=1`.  
**Expected:** 200; array; **every** item has `postId===1`.

---

## TC-POSTS-GET-NESTED-200-009
**Name:** GET /posts/1/comments — nested correctness  
**Tags:** @happy-path  
**Suite:** `tests/nested.spec.ts`  
**Steps:** `GET /posts/1/comments`.  
**Expected:** 200; array; **every** item has `postId===1`.

---

## TC-USERS-GET-NESTED-200-010
**Name:** GET /users/1/todos — nested correctness  
**Tags:** @happy-path  
**Suite:** `tests/nested.spec.ts`  
**Steps:** `GET /users/1/todos`.  
**Expected:** 200; array; **every** item has `userId===1`.

---

## TC-POSTS-POST-JSONSCHEMA-002
**Name:** POST /posts — success (emulated), JSON echo with id  
**Tags:** @happy-path  
**Suite:** `tests/posts.spec.ts`  
**Preconditions:** Use `Content-Type: application/json; charset=UTF-8`.  
**Steps:** POST to `/posts` with body `{ "title":"Hello", "body":"World", "userId":1 }`.  
**Expected:** Status in 2xx (201/200 acceptable); `Content-Type` JSON; response object conforms to **post** schema; `title/body/userId` echo input; `id:number` is present.

---

## TC-POSTS-PUT-JSONSCHEMA-011
**Name:** PUT /posts/1 — success (emulated), full echo  
**Tags:** @happy-path  
**Suite:** `tests/posts.spec.ts`  
**Steps:** PUT `/posts/1` with full valid object.  
**Expected:** 2xx; JSON object equals sent body (except server-controlled fields if any).

---

## TC-POSTS-PATCH-JSONSCHEMA-012
**Name:** PATCH /posts/1 — success (emulated), partial update  
**Tags:** @happy-path  
**Suite:** `tests/posts.spec.ts`  
**Steps:** PATCH `/posts/1` with `{ "title":"Updated" }`.  
**Expected:** 2xx; JSON object where at least `title` reflects the patch (other fields remain as per mock behavior).

---

## TC-POSTS-DELETE-2XX-013
**Name:** DELETE /posts/1 — success (emulated)  
**Tags:** @happy-path  
**Suite:** `tests/posts.spec.ts`  
**Steps:** DELETE `/posts/1`.  
**Expected:** 2xx; empty body or `{}`. **No follow-up GET absence check** (non-persistent emulator).

---

## TC-POSTS-POST-UNICODE-014
**Name:** POST /posts — Unicode payload roundtrip  
**Tags:** @happy-path  
**Suite:** `tests/posts.spec.ts`  
**Steps:** POST with `title/body` containing non-ASCII (e.g., `Żółć кириллица`), `userId:1`.  
**Expected:** 2xx; JSON echo preserves exact Unicode text; `Content-Type` JSON (UTF-8).

---

## TC-UNKNOWN-GET-404-015
**Name:** GET /unknown — 404  
**Tags:** @negative  
**Suite:** `tests/negative.spec.ts`  
**Steps:** `GET /unknown`.  
**Expected:** 404 (or documented actual); body may be empty.

---

## TC-POSTS-GETID-NOTFOUND-016
**Name:** GET /posts/999999 — not found  
**Tags:** @negative  
**Suite:** `tests/negative.spec.ts`  
**Steps:** `GET /posts/999999`.  
**Expected:** Document **actual** behavior (404 or empty). Treat as mock trait.

---

## TC-POSTS-POST-NO-CTYPE-017
**Name:** POST /posts without Content-Type — error behavior  
**Tags:** @negative  
**Suite:** `tests/negative.spec.ts`  
**Steps:** POST valid JSON body **without** `Content-Type`.  
**Expected:** Record actual status/headers; assert at least non-HTML response and presence/absence of JSON per behavior.

---

## TC-POSTS-POST-MALFORMED-018
**Name:** POST /posts malformed JSON — client/server error  
**Tags:** @negative  
**Suite:** `tests/negative.spec.ts`  
**Steps:** POST with malformed body (broken JSON).  
**Expected:** 4xx/parse error; capture actual code; ensure no success.

---

## TC-POSTS-PUT-SCHEMA-INVALID-019
**Name:** PUT /posts/1 — wrong types must fail client schema  
**Tags:** @negative  
**Suite:** `tests/negative.spec.ts`  
**Steps:** PUT with `userId:"one"` (string).  
**Expected:** Even if server 2xx, **client JSON Schema validation fails**.

---

## TC-POSTS-PATCH-SCHEMA-INVALID-020
**Name:** PATCH /posts/1 — wrong types must fail client schema  
**Tags:** @negative  
**Suite:** `tests/negative.spec.ts`  
**Steps:** PATCH with `{ "userId":"two" }`.  
**Expected:** Client schema validation error (test fails).

---

## TC-POSTS-DELETE-NONEXIST-2XX-021
**Name:** DELETE /posts/999999999 — success (mock trait)  
**Tags:** @negative  
**Suite:** `tests/negative.spec.ts`  
**Steps:** DELETE very large id.  
**Expected:** Likely 2xx; assert documented trait (no persistence).

---

## TC-ACCEPT-WRONG-NEG-022
**Name:** GET /posts with wrong Accept — behavior capture  
**Tags:** @negative  
**Suite:** `tests/negative.spec.ts`  
**Steps:** GET `/posts` with `Accept: text/xml`.  
**Expected:** Capture actual status/headers; ensure no HTML, document result.

---

## TC-PARALLEL-GET-SMOKE-023
**Name:** Parallel GETs across resources — health under light load  
**Tags:** @negative  
**Suite:** `tests/edge.spec.ts`  
**Steps:** Fire ~5 parallel GETs: `/posts`, `/users`, `/todos`, `/albums`, `/photos`.  
**Expected:** All 200; durations logged; no significant errors.

---

## TC-FILTER-EMPTY-024
**Name:** GET /posts?userId=999 — empty result  
**Tags:** @negative  
**Suite:** `tests/negative.spec.ts`  
**Steps:** GET with filter yielding no items.  
**Expected:** 200; empty array.
