import { test, expect } from '@playwright/test';
import { assertSchema } from '../src/lib/schemaAssert';
import userSchema from '../schemas/user.schema.json';
import userFullSchema from '../schemas/user.full.schema.json';

test.describe('Users API', () => {
  test('GET /users returns 200 and minimal user contract @happy-path [TC-003-USERS-GET-200]', async ({
    request,
  }) => {
    const res = await request.get('/users');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type'] || '').toContain('application/json');

    const body = await res.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
    for (const item of body) assertSchema(item, userSchema);
  });

  test('GET /users - first user matches full nested schema @happy-path [TC-026-USERS-GET-FULLSCHEMA-200]', async ({
    request,
  }) => {
    const res = await request.get('/users');
    expect(res.status()).toBe(200);

    const body = await res.json();
    // Validate only the first item against the strict/nested schema.
    const first = body[0];
    assertSchema(first, userFullSchema);
  });
});
