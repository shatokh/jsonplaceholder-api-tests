// ESLint 9 flat config
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';

export default [
  // Ignore build and reports
  { ignores: ['node_modules', 'dist', 'playwright-report', 'test-results'] },

  // Base JS recommendations
  js.configs.recommended,

  // TypeScript recommendations
  ...tseslint.configs.recommended,

  // Apply Playwright rules ONLY to test files
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**'],
  },

  // Disable rules conflicting with Prettier
  prettier,

  // Local tweaks if needed
  {
    rules: {
      // Example: allow conditionals in tests if parameterizing
      // 'playwright/no-conditional-in-test': 'off'
    },
  },
];
