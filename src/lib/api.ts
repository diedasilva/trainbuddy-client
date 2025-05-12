const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

function buildUrl(path: string, params?: Record<string, any>) {
  if (USE_MOCKS) {
    // Charge le JSON statique depuis public/mocks
    return `/mocks${path}.json`;
  } else {
    // Version API réelle
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = new URL(`${base}${path}`);
    if (params) {
      Object.entries(params)
        .filter(([, v]) => v != null)
        .forEach(([k, v]) => url.searchParams.set(k, String(v)));
    }
    return url.toString();
  }
}

export async function apiGet<T>(path: string, params?: Record<string, any>): Promise<T> {
  const url = buildUrl(path, params);
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function apiPost<T, U = any>(path: string, body: U): Promise<T> {
  if (USE_MOCKS) {
    throw new Error('POST not supported in mock mode');
  }
  const url = buildUrl(path);
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${url} failed: ${res.status}`);
  return res.json() as Promise<T>;
}
