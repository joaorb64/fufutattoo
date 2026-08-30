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
