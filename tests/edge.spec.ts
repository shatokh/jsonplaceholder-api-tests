// tests/edge.spec.ts
import { test, expect } from './fixtures/curl.fixture';
import { assertSchema } from '../src/lib/schemaAssert';
import postSchema from '../schemas/post.schema.json';
import largeTplRaw from '../test-data/posts.large.template.json';
import { expandTemplate, strLen, pickExpectedLengths } from './helpers';

// Resolve base URL for cURL outside of test bodies to avoid conditional-in-test warnings
const BASE_URL_FOR_CURL = process.env.BASE_URL || 'https://jsonplaceholder.typicode.com';

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
  test('Parallel GETs across resources @negative [TC-024-MULTI-GET-PARALLEL-200]', async ({
    request,
  }) => {
    const endpoints = ['/posts', '/users', '/todos', '/albums', '/photos'];
    const resps = await Promise.all(endpoints.map((e) => request.get(e)));
    for (const res of resps) expect(res.status()).toBe(200);
  });

  test('GET /posts?userId=999 yields empty array @negative [TC-025-POSTS-GET-FILTER-EMPTY-200]', async ({
    request,
  }) => {
    const res = await request.get('/posts', { params: { userId: '999' } });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBe(0);
  });

  test('POST /posts large payload from template @negative [TC-027-POSTS-POST-LARGE-2XX]', async ({
    request,
    recordCurl,
  }) => {
    for (const payload of expandedLargeTemplates) {
      // Record cURL before the request (fixture attaches on failure only)
      recordCurl({
        method: 'POST',
        url: `${BASE_URL_FOR_CURL}/posts`,
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        data: { title: payload.title, body: payload.body, userId: payload.userId },
      });

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
