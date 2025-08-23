// tests/helpers.ts
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
