import { test, expect } from '@playwright/test';
import { assertSchema } from '../src/lib/schemaAssert';
import todoSchema from '../schemas/todo.schema.json';

test.describe('Todos API', () => {
  test('GET /todos returns 200 and contract @happy-path [TC-004-TODOS-GET-200]', async ({
    request,
  }) => {
    const res = await request.get('/todos');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBeTruthy();
    for (const item of body) assertSchema(item, todoSchema);
  });
});
