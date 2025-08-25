import { test, expect } from '@playwright/test';
import { assertSchema } from '../src/lib/schemaAssert';
import commentSchema from '../schemas/comment.schema.json';
import todoSchema from '../schemas/todo.schema.json';

test.describe('Nested endpoints', () => {
  test('GET /posts/1/comments - each has postId=1 @happy-path [TC-009-POSTS-GET-NESTED-200]', async ({
    request,
  }) => {
    const res = await request.get('/posts/1/comments');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBeTruthy();
    for (const item of body) {
      assertSchema(item, commentSchema);
      expect(item.postId).toBe(1);
    }
  });

  test('GET /users/1/todos - each has userId=1 @happy-path [TC-010-USERS-GET-NESTED-200]', async ({
    request,
  }) => {
    const res = await request.get('/users/1/todos');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBeTruthy();
    for (const item of body) {
      assertSchema(item, todoSchema);
      expect(item.userId).toBe(1);
    }
  });
});
