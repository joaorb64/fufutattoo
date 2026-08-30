import { useEffect, useState } from "react";
import yaml from "js-yaml";
import { TAGS_DICT_PATH, commitTextFile } from "./github";
import { fetchFlashes } from "../../flashes";

const TAGS_HEADER = `# Shared tag vocabulary.
#
# Each key is a Portuguese tag (lowercase, as typed in the flash editor).
# \`en\` / \`es\` are the lists of words shown as filter chips in that language
# — list more than one and each becomes its own chip that filters the same
# flashes (e.g. "rato" shows as both "rat" and "mouse" in English).
#
# New tags used by a flash but missing here are auto-added on the next build
# with a machine translation as a starting point; refine them afterwards.

`;

const TAGS_URL = `${import.meta.env.BASE_URL}flashes/tags.yaml`;
const LANGS = ["en", "es"] as const;

type Dict = Record<string, { en: string[]; es: string[] }>;

const toList = (v: unknown): string[] =>
  Array.isArray(v)
    ? v.map((s) => String(s).trim().toLowerCase()).filter(Boolean)
    : typeof v === "string" && v.trim()
      ? [v.trim().toLowerCase()]
      : [];

const parseField = (raw: string): string[] =>
  raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

export default function TagDictionary({ token }: { token: string }) {
  // Raw text per tag/lang while editing (so commas can be typed freely).
  const [fields, setFields] = useState<Record<string, { en: string; es: string }>>(
    {},
  );
  const [order, setOrder] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [commitUrl, setCommitUrl] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      const dict: Dict = {};
      try {
        const text = await fetch(TAGS_URL, { cache: "no-cache" }).then((r) =>
          r.ok ? r.text() : "",
        );
        const parsed = (yaml.load(text) || {}) as Record<string, unknown>;
        for (const [key, val] of Object.entries(parsed)) {
          const v = (val || {}) as Record<string, unknown>;
          dict[key.toLowerCase()] = { en: toList(v.en), es: toList(v.es) };
        }
      } catch {
        // start from whatever flashes.json gives us
      }
      // Fold in any tag used by a flash but missing from the file.
      try {
        const flashes = await fetchFlashes().then((r) => r.json());
        for (const flash of Object.values(flashes) as any[]) {
          for (const tag of flash.tags || []) {
            const key = String(tag.pt).toLowerCase();
            if (!dict[key]) {
              dict[key] = {
                en: toList(tag.en),
                es: toList(tag.es),
              };
            }
          }
        }
      } catch {
        // offline / no flashes.json — the file contents alone are fine
      }

      if (!alive) return;
      const keys = Object.keys(dict).sort();
      setOrder(keys);
      setFields(
        Object.fromEntries(
          keys.map((k) => [
            k,
            { en: dict[k].en.join(", "), es: dict[k].es.join(", ") },
          ]),
        ),
      );
      setLoaded(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const setField = (tag: string, lang: "en" | "es", value: string) => {
    setState("idle");
    setFields((prev) => ({ ...prev, [tag]: { ...prev[tag], [lang]: value } }));
  };

  const addTag = () => {
    const key = newTag.trim().toLowerCase();
    if (!key || fields[key]) {
      setNewTag("");
      return;
    }
    setFields((prev) => ({ ...prev, [key]: { en: "", es: "" } }));
    setOrder((prev) => [...prev, key].sort());
    setNewTag("");
  };

  const removeTag = (tag: string) => {
    setFields((prev) => {
      const next = { ...prev };
      delete next[tag];
      return next;
    });
    setOrder((prev) => prev.filter((t) => t !== tag));
    setState("idle");
  };

  const save = async () => {
    if (state === "saving") return;
    const obj: Dict = {};
    for (const key of [...order].sort()) {
      const f = fields[key];
      if (!f) continue;
      obj[key] = { en: parseField(f.en), es: parseField(f.es) };
    }
    const body = yaml.dump(obj, { lineWidth: -1, flowLevel: 2, sortKeys: true });

    setState("saving");
    setError(null);
    setCommitUrl(null);
    try {
      const { commitUrl: url } = await commitTextFile({
        token,
        path: TAGS_DICT_PATH,
        text: TAGS_HEADER + body,
        message: "Atualiza dicionário de tags",
        onProgress: setMsg,
      });
      setCommitUrl(url);
      setState("done");
    } catch (e) {
      setError((e as Error).message);
      setState("error");
    }
  };

  const inputClass =
    "w-full border border-zinc-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500";

  return (
    <details className="rounded border border-zinc-200 bg-zinc-50 p-3 text-sm">
      <summary className="cursor-pointer font-semibold text-zinc-700">
        🏷️ Dicionário de tags (traduções){loaded ? ` — ${order.length}` : ""}
      </summary>
      <div className="mt-3 flex flex-col gap-3 text-zinc-600">
        <p>
          Escreve as traduções de cada tag. Para ter mais de uma tradução na
          mesma língua, separa por vírgula (ex. <code>rat, mouse</code>) — cada
          uma aparece como um chip próprio que filtra os mesmos flashes.
        </p>

        {!loaded ? (
          <p className="text-zinc-400">A carregar…</p>
        ) : (
          <>
            <div className="grid grid-cols-[minmax(0,7rem)_1fr_1fr_auto] gap-2 items-center">
              <span className="text-xs font-semibold text-zinc-500">
                Tag (PT)
              </span>
              <span className="text-xs font-semibold text-zinc-500">Inglês</span>
              <span className="text-xs font-semibold text-zinc-500">
                Espanhol
              </span>
              <span />
              {order.map((tag) => (
                <FieldsRow
                  key={tag}
                  tag={tag}
                  fields={fields[tag]}
                  inputClass={inputClass}
                  onChange={setField}
                  onRemove={() => removeTag(tag)}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <input
                className={inputClass}
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Nova tag em português"
              />
              <button
                type="button"
                onClick={addTag}
                disabled={!newTag.trim()}
                className="shrink-0 border border-zinc-300 rounded px-3 text-zinc-600 disabled:opacity-40 cursor-pointer"
              >
                Adicionar
              </button>
            </div>

            <div>
              <button
                type="button"
                onClick={save}
                disabled={state === "saving"}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-zinc-300 text-white font-semibold rounded-full px-5 py-2 cursor-pointer"
              >
                {state === "saving" && (
                  <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}
                {state === "saving" ? "A guardar…" : "Guardar dicionário"}
              </button>
            </div>

            {state === "saving" && msg && (
              <p className="text-zinc-500">{msg}</p>
            )}
            {state === "done" && (
              <p className="text-teal-700">
                Guardado. O site atualiza em alguns minutos.{" "}
                {commitUrl && (
                  <a
                    href={commitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Ver commit
                  </a>
                )}
              </p>
            )}
            {state === "error" && error && (
              <p className="text-red-600">{error}</p>
            )}
          </>
        )}
      </div>
    </details>
  );
}

function FieldsRow({
  tag,
  fields,
  inputClass,
  onChange,
  onRemove,
}: {
  tag: string;
  fields?: { en: string; es: string };
  inputClass: string;
  onChange: (tag: string, lang: "en" | "es", value: string) => void;
  onRemove: () => void;
}) {
  return (
    <>
      <span className="text-sm font-medium text-zinc-700 truncate" title={tag}>
        {tag}
      </span>
      {LANGS.map((lang) => (
        <input
          key={lang}
          className={inputClass}
          value={fields?.[lang] ?? ""}
          onChange={(e) => onChange(tag, lang, e.target.value)}
          placeholder={lang === "en" ? "rat, mouse" : "rata, ratón"}
        />
      ))}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remover tag ${tag}`}
        className="text-zinc-400 hover:text-red-600 cursor-pointer px-1"
      >
        ×
      </button>
    </>
  );
}
