export type CurlInput = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string; // absolute URL
  headers?: Record<string, string>;
  data?: unknown; // string or JSON-serializable
};

/** Build a portable cURL command (quotes safe for Windows/macOS/Linux shells). */
export function toCurl({ method, url, headers = {}, data }: CurlInput): string {
  const parts: string[] = ['curl', '-i', '-X', method];
  for (const [k, v] of Object.entries(headers)) {
    parts.push('-H', q(`${k}: ${v}`));
  }
  if (data !== undefined) {
    const body = typeof data === 'string' ? data : JSON.stringify(data);
    parts.push('--data', q(body));
  }
  parts.push(q(url));
  return parts.join(' ');
}

function q(s: string): string {
  // Double-quote and escape " and \  → works in cmd/sh/bash/zsh/pwsh with curl
  return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}
