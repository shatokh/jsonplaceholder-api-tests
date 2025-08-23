# Coverage Matrix — JSONPlaceholder API

| TC ID                         | Resource | Operation              | Type        | Tags         | Suite File                    |
|------------------------------|----------|------------------------|-------------|--------------|-------------------------------|
| TC-POSTS-GET-200-001         | posts    | GET /posts             | Positive    | @happy-path  | tests/posts.spec.ts           |
| TC-POSTS-GETID-200-002       | posts    | GET /posts/{id}        | Positive    | @happy-path  | tests/posts.spec.ts           |
| TC-USERS-GET-200-003         | users    | GET /users             | Positive    | @happy-path  | tests/users.spec.ts           |
| TC-TODOS-GET-200-004         | todos    | GET /todos             | Positive    | @happy-path  | tests/todos.spec.ts           |
| TC-ALBUMS-GET-200-005        | albums   | GET /albums            | Positive    | @happy-path  | tests/albums_photos.spec.ts   |
| TC-PHOTOS-GET-200-006        | photos   | GET /photos            | Positive    | @happy-path  | tests/albums_photos.spec.ts   |
| TC-POSTS-GET-FILTER-200-007  | posts    | GET /posts?userId=1    | Positive    | @happy-path  | tests/posts.spec.ts           |
| TC-COMMENTS-GET-FILTER-200-008| comments| GET /comments?postId=1 | Positive    | @happy-path  | tests/comments.spec.ts        |
| TC-POSTS-GET-NESTED-200-009  | posts    | GET /posts/1/comments  | Positive    | @happy-path  | tests/nested.spec.ts          |
| TC-USERS-GET-NESTED-200-010  | users    | GET /users/1/todos     | Positive    | @happy-path  | tests/nested.spec.ts          |
| TC-POSTS-POST-JSONSCHEMA-002 | posts    | POST /posts            | Positive    | @happy-path  | tests/posts.spec.ts           |
| TC-POSTS-PUT-JSONSCHEMA-011  | posts    | PUT /posts/1           | Positive    | @happy-path  | tests/posts.spec.ts           |
| TC-POSTS-PATCH-JSONSCHEMA-012| posts    | PATCH /posts/1         | Positive    | @happy-path  | tests/posts.spec.ts           |
| TC-POSTS-DELETE-2XX-013      | posts    | DELETE /posts/1        | Positive    | @happy-path  | tests/posts.spec.ts           |
| TC-POSTS-POST-UNICODE-014    | posts    | POST /posts (Unicode)  | Positive    | @happy-path  | tests/posts.spec.ts           |
| TC-UNKNOWN-GET-404-015       | unknown  | GET /unknown           | Negative    | @negative    | tests/negative.spec.ts        |
| TC-POSTS-GETID-NOTFOUND-016  | posts    | GET /posts/999999      | Negative    | @negative    | tests/negative.spec.ts        |
| TC-POSTS-POST-NO-CTYPE-017   | posts    | POST /posts (no ctype) | Negative    | @negative    | tests/negative.spec.ts        |
| TC-POSTS-POST-MALFORMED-018  | posts    | POST /posts (malformed)| Negative    | @negative    | tests/negative.spec.ts        |
| TC-POSTS-PUT-SCHEMA-INVALID-019| posts  | PUT /posts/1 (bad types)| Negative   | @negative    | tests/negative.spec.ts        |
| TC-POSTS-PATCH-SCHEMA-INVALID-020| posts| PATCH /posts/1 (bad types)| Negative | @negative    | tests/negative.spec.ts        |
| TC-POSTS-DELETE-NONEXIST-2XX-021| posts | DELETE /posts/999999999| Negative    | @negative    | tests/negative.spec.ts        |
| TC-ACCEPT-WRONG-NEG-022      | posts    | GET /posts (wrong Accept)| Negative  | @negative    | tests/negative.spec.ts        |
| TC-PARALLEL-GET-SMOKE-023    | mixed    | 5× parallel GETs       | Edge        | @negative    | tests/edge.spec.ts            |
| TC-FILTER-EMPTY-024          | posts    | GET /posts?userId=999  | Edge        | @negative    | tests/negative.spec.ts        |

