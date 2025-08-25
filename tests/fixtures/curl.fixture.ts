// Auto-attach cURL reproduction *only on failure*.
// Conditional check happens in fixture teardown (not in test body).

import { test as base, expect } from '@playwright/test';
import { toCurl, type CurlInput } from '../../src/lib/curl';

export const test = base.extend<{ recordCurl: (input: CurlInput) => void }>({
  recordCurl: [
    async ({}, use, testInfo) => {
      let lastCurl = '';
      await use((input: CurlInput) => {
        lastCurl = toCurl(input);
      });
      // Attach only if test failed (keeps reports clean on pass)
      if (testInfo.status !== 'passed' && lastCurl) {
        await testInfo.attach('cURL repro', { body: lastCurl, contentType: 'text/plain' });
      }
    },
    { auto: true },
  ],
});

export { expect };
