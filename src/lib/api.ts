const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

// Import de l'API mockée optimisée
import { mockApi } from './api/mockApi';
import type { TableData } from './mockDb';

function buildUrl(path: string, params?: Record<string, unknown>) {
  if (USE_MOCKS) {
    // Utiliser l'API mockée optimisée au lieu des fichiers JSON statiques
    return `/api/mock${path}`;
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

export async function apiGet<T = TableData[]>(path: string, params?: Record<string, unknown>): Promise<T> {
  if (USE_MOCKS) {
    // Utiliser l'API mockée optimisée
    const response = await mockApi.findAll(path.replace('/', ''), params);
    return response.data as T;
  } else {
  const url = buildUrl(path, params);
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
  return res.json() as Promise<T>;
  }
}

export async function apiPost<T = TableData, U = Record<string, unknown>>(path: string, body: U): Promise<T> {
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

// Export de l'API mockée pour utilisation directe
export { mockApi };
