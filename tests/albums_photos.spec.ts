import { test, expect } from '@playwright/test';
import { assertSchema } from '../src/lib/schemaAssert';
import albumSchema from '../schemas/album.schema.json';
import photoSchema from '../schemas/photo.schema.json';

test.describe('Albums & Photos API', () => {
  test('GET /albums returns 200 and contract @happy-path [TC-ALBUMS-GET-200-005]', async ({
    request,
  }) => {
    const res = await request.get('/albums');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBeTruthy();
    for (const item of body) assertSchema(item, albumSchema);
  });

  test('GET /photos returns 200 and contract @happy-path [TC-PHOTOS-GET-200-006]', async ({
    request,
  }) => {
    const res = await request.get('/photos');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBeTruthy();
    // Validate only a sample of 200 items to optimize test performance(TBD with Volodymyr)
    const sample = body.slice(0, 200);
    for (const item of sample) assertSchema(item, photoSchema);
    expect(body.length).toBeGreaterThanOrEqual(200);
  });
});
