import { BASE_URL } from './config.ts';
import type { SwapiSearchResponse } from './types.ts';

export async function fetchFirst(
  resource: string,
  queryKey: string,
  queryVal: string,
): Promise<any> {
  const url = `${BASE_URL}/${resource}/?${queryKey}=${encodeURIComponent(queryVal)}`;
  const res = await fetch(url);
  const json: SwapiSearchResponse = await res.json();
  const results = Array.isArray(json.results) ? json.results : [];

  if (results.length === 0) {
    return { error: `No ${resource.slice(0, -1)} found for "${queryVal}"` };
  }

  return results[0];
}

export async function searchAll(
  resource: string,
  query: string,
): Promise<SwapiSearchResponse> {
  const url = `${BASE_URL}/${resource}/?search=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const json: SwapiSearchResponse = await res.json();
  return json;
}
