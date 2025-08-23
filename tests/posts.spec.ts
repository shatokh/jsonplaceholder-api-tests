import { test, expect } from '@playwright/test';
import { assertSchema } from '../src/lib/schemaAssert';
import postSchema from '../schemas/post.schema.json';
import validPosts from '../test-data/posts.valid.json';
import patchPayloads from '../test-data/posts.patch.valid.json';

test.describe('Posts API', () => {
  test('GET /posts returns 200 and minimal contract @happy-path [TC-POSTS-GET-200-001]', async ({
    request,
  }) => {
    const res = await request.get('/posts');
    expect(res.status(), 'status').toBe(200);
    expect(res.headers()['content-type'] || '').toContain('application/json');

    const body = await res.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
    for (const item of body) assertSchema(item, postSchema);
  });

  test('GET /posts/1 returns item with id=1 @happy-path [TC-POSTS-GETID-200-002]', async ({
    request,
  }) => {
    const res = await request.get('/posts/1');
    expect(res.status()).toBe(200);

    const body = await res.json();
    assertSchema(body, postSchema);
    expect(body.id).toBe(1);
  });

  test('GET /posts?userId=1 filters by userId @happy-path [TC-POSTS-GET-FILTER-200-007]', async ({
    request,
  }) => {
    const res = await request.get('/posts', { params: { userId: '1' } });
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body)).toBeTruthy();
    for (const item of body) {
      assertSchema(item, postSchema);
      expect(item.userId).toBe(1);
    }
  });

  test('POST /posts echoes valid JSON + id @happy-path [TC-POSTS-POST-JSONSCHEMA-002]', async ({
    request,
  }) => {
    const payload = validPosts[0]; // {title, body, userId}
    const res = await request.post('/posts', {
      data: payload,
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    });
    expect(res.status()).toBeGreaterThanOrEqual(200);
    expect(res.status()).toBeLessThan(300);
    expect(res.headers()['content-type'] || '').toContain('application/json');

    const body = await res.json();
    assertSchema(body, postSchema);
    expect(body.title).toBe(payload.title);
    expect(body.body).toBe(payload.body);
    expect(body.userId).toBe(payload.userId);
    expect(typeof body.id).toBe('number');
  });

  test('PUT /posts/1 full echo @happy-path [TC-POSTS-PUT-JSONSCHEMA-011]', async ({ request }) => {
    const payload = { id: 1, title: 'Put Title', body: 'Put Body', userId: 1 };
    const res = await request.put('/posts/1', {
      data: payload,
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    });
    expect(res.status()).toBeGreaterThanOrEqual(200);
    expect(res.status()).toBeLessThan(300);

    const body = await res.json();
    assertSchema(body, postSchema);
    expect(body.title).toBe(payload.title);
    expect(body.body).toBe(payload.body);
    expect(body.userId).toBe(payload.userId);
  });

  test('PATCH /posts/1 partial update @happy-path [TC-POSTS-PATCH-JSONSCHEMA-012]', async ({
    request,
  }) => {
    const patch = patchPayloads[0]; // e.g., { title: "Updated title #1" }
    const res = await request.patch('/posts/1', {
      data: patch,
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    });
    expect(res.status()).toBeGreaterThanOrEqual(200);
    expect(res.status()).toBeLessThan(300);

    const body = await res.json();
    assertSchema(body, postSchema);

    // Compare only the patched fields without using 'any'
    const bodyObj = body as Record<string, unknown>;
    const patchObj = patch as Record<string, unknown>;
    for (const k of Object.keys(patchObj)) {
      expect(bodyObj[k]).toStrictEqual(patchObj[k]);
    }
  });

  test('DELETE /posts/1 returns 2xx (mock, non-persistent) @happy-path [TC-POSTS-DELETE-2XX-013]', async ({
    request,
  }) => {
    const res = await request.delete('/posts/1');
    expect(res.status()).toBeGreaterThanOrEqual(200);
    expect(res.status()).toBeLessThan(300);

    const txt = await res.text();
    // JSONPlaceholder may return empty string or "{}"
    expect(['', '{}']).toContain(txt.trim());
  });

  test('POST /posts supports Unicode roundtrip @happy-path [TC-POSTS-POST-UNICODE-014]', async ({
    request,
  }) => {
    const payload = validPosts[1]; // Unicode data
    const res = await request.post('/posts', {
      data: payload,
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    });
    expect(res.status()).toBeGreaterThanOrEqual(200);
    expect(res.status()).toBeLessThan(300);

    const body = await res.json();
    assertSchema(body, postSchema);
    expect(body.title).toBe(payload.title);
    expect(body.body).toBe(payload.body);
  });
});
