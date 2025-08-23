// tests/edge.spec.ts
import { test, expect } from '@playwright/test';
import { assertSchema } from '../src/lib/schemaAssert';
import postSchema from '../schemas/post.schema.json';
import largeTplRaw from '../test-data/posts.large.template.json';
import { expandTemplate, strLen, pickExpectedLengths } from './helpers';

// Strongly-typed large post payload after template expansion
type LargePost = {
  title: string;
  body: string;
  userId: number;
  expect?: { titleLength?: number; bodyLength?: number };
};

// Materialize templates into typed payloads once (outside tests)
const expandedLargeTemplates: LargePost[] = (
  Array.isArray(largeTplRaw) ? (largeTplRaw as unknown[]) : []
).map((tpl) => expandTemplate(tpl)) as LargePost[];

test.describe('Edge / Parallel', () => {
  test('Parallel GETs across resources @negative [TC-PARALLEL-GET-SMOKE-023]', async ({
    request,
  }) => {
    const endpoints = ['/posts', '/users', '/todos', '/albums', '/photos'];
    const resps = await Promise.all(endpoints.map((e) => request.get(e)));
    for (const res of resps) expect(res.status()).toBe(200);
  });

  test('GET /posts?userId=999 yields empty array @negative [TC-FILTER-EMPTY-024]', async ({
    request,
  }) => {
    const res = await request.get('/posts', { params: { userId: '999' } });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBe(0);
  });

  test('POST /posts large payload from template @negative [TC-POSTS-POST-LARGE-026]', async ({
    request,
  }) => {
    for (const payload of expandedLargeTemplates) {
      const res = await request.post('/posts', {
        data: { title: payload.title, body: payload.body, userId: payload.userId },
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      });

      // Basic success + contract
      expect(res.status()).toBeGreaterThanOrEqual(200);
      expect(res.status()).toBeLessThan(300);
      const body = await res.json();
      assertSchema(body, postSchema);

      // Expected lengths resolved outside of test conditionals
      const lens = pickExpectedLengths(payload);
      expect(strLen(body.title)).toBe(lens.titleLength);
      expect(strLen(body.body)).toBe(lens.bodyLength);
    }
  });
});
