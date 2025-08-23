// tests/helpers.ts

// Safe JSON parse to avoid try/catch in tests
export function safeParseJson(text: string): unknown | null {
  try {
    if (!text || text.trim() === '') return {};
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function isPlainEmptyObject(value: unknown): boolean {
  return (
    !!value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value as Record<string, unknown>).length === 0
  );
}

// Count string length in Unicode code points (emoji-safe)
export function strLen(val: unknown): number {
  if (typeof val !== 'string') return 0;
  return [...val].length;
}
// Expand simple templates in test data
export function expandTemplate<T>(input: T): T {
  if (Array.isArray(input)) {
    return input.map((x) => expandTemplate(x)) as unknown as T;
  }
  if (input && typeof input === 'object') {
    const obj = input as Record<string, unknown>;
    if (Object.prototype.hasOwnProperty.call(obj, 'repeat')) {
      const rep = obj['repeat'] as { unit: unknown; times: unknown };
      const unit = typeof rep.unit === 'string' ? rep.unit : '';
      const times = typeof rep.times === 'number' ? rep.times : 0;
      return unit.repeat(times) as unknown as T;
    }
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) out[k] = expandTemplate(v);
    return out as unknown as T;
  }
  return input;
}

/**
 * Normalize optional expected lengths from data without using conditionals in tests.
 */
export function pickExpectedLengths(input: {
  expect?: { titleLength?: number; bodyLength?: number };
}): { titleLength: number; bodyLength: number } {
  const e = input.expect;
  const t = e && typeof e.titleLength === 'number' ? e.titleLength : 0;
  const b = e && typeof e.bodyLength === 'number' ? e.bodyLength : 0;
  return { titleLength: t, bodyLength: b };
}
