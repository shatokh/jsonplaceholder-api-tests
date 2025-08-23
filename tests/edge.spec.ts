import { test, expect } from '@playwright/test';

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
});
