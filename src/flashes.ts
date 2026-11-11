// Single source for loading the generated flash index.
//
// `flashes.json` is a static file on GitHub Pages with a ~10-minute cache,
// so right after a deploy the browser (or an intermediate cache) can still
// serve the previous version — making a just-published flash look missing
// or untranslated. `cache: "no-cache"` forces a revalidation against the
// server (a cheap 304 when nothing changed) so new content shows up at once.

export const FLASHES_URL = `${import.meta.env.BASE_URL}flashes.json`;

export function fetchFlashes(): Promise<Response> {
  return fetch(FLASHES_URL, { cache: "no-cache" });
}

// Parsed index, fetched once per page load and shared by the list and detail
// pages. Keeping it in memory lets the list render fully on the very first
// frame when the visitor comes back from a flash, so the scroll position can be
// restored (an empty, still-loading list has nothing to scroll to).
let cached: Record<string, any> | null = null;
let pending: Promise<Record<string, any>> | null = null;

export function getCachedFlashes(): Record<string, any> | null {
  return cached;
}

export function loadFlashes(): Promise<Record<string, any>> {
  if (cached) return Promise.resolve(cached);
  pending ??= fetchFlashes()
    .then((res) => res.json())
    .then((data) => (cached = data))
    .finally(() => (pending = null));
  return pending;
}
