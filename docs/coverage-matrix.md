# Coverage Matrix - JSONPlaceholder API

| TC ID                             | Resource | Operation                                                  | Type     | Tags        | Suite File                  |
| --------------------------------- | -------- | ---------------------------------------------------------- | -------- | ----------- | --------------------------- |
| TC-001-POSTS-GET-200              | posts    | GET /posts                                                 | Positive | @happy-path | tests/posts.spec.ts         |
| TC-002-POSTS-GETID-200            | posts    | GET /posts/{id}                                            | Positive | @happy-path | tests/posts.spec.ts         |
| TC-003-USERS-GET-200              | users    | GET /users                                                 | Positive | @happy-path | tests/users.spec.ts         |
| TC-004-TODOS-GET-200              | todos    | GET /todos                                                 | Positive | @happy-path | tests/todos.spec.ts         |
| TC-005-ALBUMS-GET-200             | albums   | GET /albums                                                | Positive | @happy-path | tests/albums_photos.spec.ts |
| TC-006-PHOTOS-GET-200             | photos   | GET /photos                                                | Positive | @happy-path | tests/albums_photos.spec.ts |
| TC-007-POSTS-GET-FILTER-200       | posts    | GET /posts?userId=1                                        | Positive | @happy-path | tests/posts.spec.ts         |
| TC-008-COMMENTS-GET-FILTER-200    | comments | GET /comments?postId=1                                     | Positive | @happy-path | tests/comments.spec.ts      |
| TC-009-POSTS-GET-NESTED-200       | posts    | GET /posts/1/comments                                      | Positive | @happy-path | tests/nested.spec.ts        |
| TC-010-USERS-GET-NESTED-200       | users    | GET /users/1/todos                                         | Positive | @happy-path | tests/nested.spec.ts        |
| TC-011-POSTS-POST-2XX             | posts    | POST /posts                                                | Positive | @happy-path | tests/posts.spec.ts         |
| TC-012-POSTS-PUT-2XX              | posts    | PUT /posts/1                                               | Positive | @happy-path | tests/posts.spec.ts         |
| TC-013-POSTS-PATCH-2XX            | posts    | PATCH /posts/1                                             | Positive | @happy-path | tests/posts.spec.ts         |
| TC-014-POSTS-DELETE-2XX           | posts    | DELETE /posts/1                                            | Positive | @happy-path | tests/posts.spec.ts         |
| TC-015-POSTS-POST-UNICODE-2XX     | posts    | POST /posts (Unicode)                                      | Positive | @happy-path | tests/posts.spec.ts         |
| TC-016-UNKNOWN-GET-404            | unknown  | GET /unknown                                               | Negative | @negative   | tests/negative.spec.ts      |
| TC-017-POSTS-GETID-NOTFOUND       | posts    | GET /posts/999999                                          | Negative | @negative   | tests/negative.spec.ts      |
| TC-018-POSTS-POST-NO-CTYPE        | posts    | POST /posts (no ctype)                                     | Negative | @negative   | tests/negative.spec.ts      |
| TC-019-POSTS-POST-MALFORMED       | posts    | POST /posts (malformed)                                    | Negative | @negative   | tests/negative.spec.ts      |
| TC-020-POSTS-PUT-SCHEMA-INVALID   | posts    | PUT /posts/1 (bad types)                                   | Negative | @negative   | tests/negative.spec.ts      |
| TC-021-POSTS-PATCH-SCHEMA-INVALID | posts    | PATCH /posts/1 (bad types)                                 | Negative | @negative   | tests/negative.spec.ts      |
| TC-022-POSTS-DELETE-NONEXIST-2XX  | posts    | DELETE /posts/999999999                                    | Negative | @negative   | tests/negative.spec.ts      |
| TC-023-POSTS-GET-ACCEPT-NEG       | posts    | GET /posts (wrong Accept)                                  | Negative | @negative   | tests/negative.spec.ts      |
| TC-024-MULTI-GET-PARALLEL-200     | mixed    | 5× parallel GETs                                           | Edge     | @negative   | tests/edge.spec.ts          |
| TC-025-POSTS-GET-FILTER-EMPTY-200 | posts    | GET /posts?userId=999                                      | Edge     | @negative   | tests/negative.spec.ts      |
| TC-026-USERS-GET-FULLSCHEMA-200   | users    | GET /users (full schema)                                   | Positive | @happy-path | tests/users.spec.ts         |
| TC-027-POSTS-POST-LARGE-2XX       | posts    | POST /posts (large payload)                                | Negative | @negative   | tests/edge.spec.ts          |
| TC-028-POSTS-POST-BOUNDARY-2XX    | posts    | POST /posts (boundary payloads, data-driven echo & schema) | Positive | @happy-path | tests/posts.spec.ts         |
