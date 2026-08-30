import { useState } from "react";
import { TAGS_DICT_PATH, commitTextFile } from "./github";
import {
  LANGS,
  emptyEntry,
  serializeTagDict,
  type TagDict,
} from "./tagDict";

export default function TagDictionary({
  dict,
  onChange,
  token,
  onSaved,
}: {
  dict: TagDict;
  onChange: (updater: (prev: TagDict) => TagDict) => void;
  token: string;
  onSaved?: () => void;
}) {
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">(
    "idle",
  );
  const [msg, setMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [commitUrl, setCommitUrl] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");

  const tags = Object.keys(dict).sort();

  const setField = (tag: string, lang: "en" | "es", value: string) => {
    setState("idle");
    onChange((prev) => ({
      ...prev,
      [tag]: { ...(prev[tag] ?? emptyEntry()), [lang]: value },
    }));
  };

  const addTag = () => {
    const key = newTag.trim().toLowerCase();
    setNewTag("");
    if (!key || dict[key]) return;
    onChange((prev) => ({ ...prev, [key]: emptyEntry() }));
  };

  const removeTag = (tag: string) => {
    setState("idle");
    onChange((prev) => {
      const next = { ...prev };
      delete next[tag];
      return next;
    });
  };

  const save = async () => {
    if (state === "saving") return;
    setState("saving");
    setError(null);
    setCommitUrl(null);
    try {
      const { commitUrl: url } = await commitTextFile({
        token,
        path: TAGS_DICT_PATH,
        text: serializeTagDict(dict),
        message: "Atualiza dicionário de tags",
        onProgress: setMsg,
      });
      setCommitUrl(url);
      setState("done");
      onSaved?.();
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
        🏷️ Todas as tags e traduções ({tags.length})
      </summary>
      <div className="mt-3 flex flex-col gap-3 text-zinc-600">
        <p>
          Para ter mais de uma tradução na mesma língua, separa por vírgula
          (ex. <code>rat, mouse</code>) — cada uma vira um chip próprio que
          filtra os mesmos flashes.
        </p>

        <div className="grid grid-cols-[minmax(0,7rem)_1fr_1fr_auto] gap-2 items-center">
          <span className="text-xs font-semibold text-zinc-500">Tag (PT)</span>
          <span className="text-xs font-semibold text-zinc-500">Inglês</span>
          <span className="text-xs font-semibold text-zinc-500">Espanhol</span>
          <span />
          {tags.map((tag) => (
            <TagRow
              key={tag}
              tag={tag}
              entry={dict[tag]}
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
            {state === "saving" ? "A guardar…" : "Guardar só o dicionário"}
          </button>
        </div>

        {state === "saving" && msg && <p className="text-zinc-500">{msg}</p>}
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
      </div>
    </details>
  );
}

function TagRow({
  tag,
  entry,
  inputClass,
  onChange,
  onRemove,
}: {
  tag: string;
  entry?: { en: string; es: string };
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
          value={entry?.[lang] ?? ""}
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
