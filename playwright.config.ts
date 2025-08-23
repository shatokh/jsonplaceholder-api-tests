import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  // Reasonable defaults for API testing
  timeout: 60_000,
  expect: { timeout: 10_000 },
  retries: 0,
  // Reporters: list for local, html as artifact in CI
  reporter: [['list'], ['html', { open: 'never' }]],
  metadata: {
    project: 'JSONPlaceholder API',
  },
  use: {
    baseURL: 'https://jsonplaceholder.typicode.com',
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
  },
});
