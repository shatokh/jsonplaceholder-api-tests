// tests/comments.spec.ts
// Happy-path for /comments filter by postId with schema validation.

import { test, expect } from '@playwright/test';
import { assertSchema } from '../src/lib/schemaAssert';
import commentSchema from '../schemas/comment.schema.json';

test.describe('Comments API', () => {
  test('GET /comments?postId=1 returns 200 and each has postId=1 @happy-path [TC-008-COMMENTS-GET-FILTER-200]', async ({
    request,
  }) => {
    const res = await request.get('/comments', { params: { postId: '1' } });
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type'] || '').toContain('application/json');

    const body = await res.json();
    expect(Array.isArray(body)).toBeTruthy();
    for (const item of body) {
      assertSchema(item, commentSchema);
      expect(item.postId).toBe(1);
    }
  });
});
