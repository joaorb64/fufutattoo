import yaml from "js-yaml";

// Keep in sync with generateFlashesIndex.js.
export const TAGS_HEADER = `# Shared tag vocabulary.
#
# Each key is a Portuguese tag (lowercase, as typed in the flash editor).
# \`en\` / \`es\` are the lists of words shown as filter chips in that language
# — list more than one and each becomes its own chip that filters the same
# flashes (e.g. "rato" shows as both "rat" and "mouse" in English).
#
# On each build, tags used by a flash but missing here are added with a
# machine translation (refine them afterwards), and tags no flash uses any
# more are removed.

`;

export const TAGS_URL = `${import.meta.env.BASE_URL}flashes/tags.yaml`;
export const LANGS = ["en", "es"] as const;
export type Lang = (typeof LANGS)[number];

// Editing shape: one comma-joined string per language.
export type TagDict = Record<string, Record<Lang, string>>;

const toList = (v: unknown): string[] =>
  Array.isArray(v)
    ? v.map((s) => String(s).trim().toLowerCase()).filter(Boolean)
    : typeof v === "string" && v.trim()
      ? [v.trim().toLowerCase()]
      : [];

export const splitField = (raw: string): string[] =>
  raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

export function parseTagDict(text: string): TagDict {
  const out: TagDict = {};
  let parsed: Record<string, unknown> = {};
  try {
    parsed = (yaml.load(text) || {}) as Record<string, unknown>;
  } catch {
    return out;
  }
  for (const [key, val] of Object.entries(parsed)) {
    const v = (val || {}) as Record<string, unknown>;
    out[key.toLowerCase()] = {
      en: toList(v.en).join(", "),
      es: toList(v.es).join(", "),
    };
  }
  return out;
}

export function serializeTagDict(dict: TagDict): string {
  const obj: Record<string, Record<string, string[]>> = {};
  for (const key of Object.keys(dict).sort()) {
    obj[key] = {
      en: splitField(dict[key].en),
      es: splitField(dict[key].es),
    };
  }
  return (
    TAGS_HEADER +
    yaml.dump(obj, { lineWidth: -1, flowLevel: 2, sortKeys: true })
  );
}

export async function loadTagDict(): Promise<TagDict> {
  try {
    const text = await fetch(TAGS_URL, { cache: "no-cache" }).then((r) =>
      r.ok ? r.text() : "",
    );
    return parseTagDict(text);
  } catch {
    return {};
  }
}

/** Empty EN/ES pair. */
export const emptyEntry = (): Record<Lang, string> => ({ en: "", es: "" });
