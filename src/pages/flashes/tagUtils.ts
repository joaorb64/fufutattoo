// A localized tag as it appears in flashes.json, e.g.
//   { pt: "rato", en: ["rat", "mouse"], es: ["rata", "ratón"] }
// `pt` is the canonical identity; each language holds one or more chip labels.
export type LTag = Record<string, string | string[]>;

const toArr = (v: string | string[] | undefined): string[] =>
  v == null ? [] : Array.isArray(v) ? v : [v];

/** Chip labels for the given locale, falling back to the Portuguese tag. */
export function tagLabels(tag: LTag, locale: string): string[] {
  const labels = toArr(tag[locale]);
  return labels.length ? labels : toArr(tag.pt);
}

/** Every string form of a tag across all languages — for fuzzy search. */
export function tagSynonyms(tag: LTag): string[] {
  return Object.values(tag).flatMap(toArr);
}
