import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Fuse from "fuse.js";
import FlashList from "./flashList";
import TagList from "./tagList";
import { resolveLocale } from "../../i18n";

export default function Flashes() {
  const { t, i18n } = useTranslation();
  const locale = resolveLocale(i18n.language);
  type FlashType = {
    name: Record<string, string>;
    tags: Record<string, string>[];
    images?: string[];
    description?: Record<string, string>;
    price?: number;
  };

  const [flashes, setFlashes] = useState<Record<string, FlashType>>({});
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}flashes.json`)
      .then((res) => res.json())
      .then(async (data) => {
        setFlashes(data);
      });
  }, []);

  const allTags = useMemo(() => {
    // Keyed by the Portuguese text (the canonical, human-authored source of
    // truth) rather than a machine-translated field, so a tag's identity
    // stays stable regardless of translation output.
    const tagsObj: Record<string, { tag: Record<string, string>; count: number }> = {};

    Object.values(flashes).forEach((flash) => {
      flash.tags.forEach((tag) => {
        if (!tagsObj.hasOwnProperty(tag.pt)) {
          tagsObj[tag.pt] = {
            tag,
            count: 1,
          };
        } else {
          tagsObj[tag.pt].count += 1;
        }
      });
    });

    const sortedTags = Object.keys(tagsObj)
      .sort((a, b) => tagsObj[b].count - tagsObj[a].count)
      .reduce(
        (Obj: Record<string, { tag: Record<string, string>; count: number }>, key) => {
          Obj[key] = tagsObj[key];
          return Obj;
        },
        {} as Record<string, { tag: Record<string, string>; count: number }>,
      );

    return sortedTags;
  }, [flashes]);

  const allFlashesArray = useMemo(
    () =>
      Object.entries(flashes).map(([id, flash]) => ({
        id,
        ...flash,
      })),
    [flashes],
  );

  // Fuzzy, weighted search across every language regardless of the active UI
  // locale — e.g. a Portuguese speaker typing "cookie" instead of "biscoito"
  // should still find the flash. Ranked so the current-language name matters
  // most, then the current-language tags, then the name in other languages,
  // then tags in other languages.
  const searchItems = useMemo(
    () =>
      allFlashesArray.map((f) => {
        const langs = Object.keys(f.name ?? {});
        const otherLangs = langs.filter((l) => l !== locale);
        return {
          flash: f,
          nameCurrent: f.name?.[locale] ?? "",
          tagsCurrent: f.tags.map((tag) => tag[locale] ?? tag.pt ?? ""),
          nameOther: otherLangs.map((l) => f.name?.[l] ?? ""),
          tagsOther: f.tags.flatMap((tag) => otherLangs.map((l) => tag[l] ?? "")),
          descAll: Object.values(f.description ?? {}),
        };
      }),
    [allFlashesArray, locale],
  );

  const fuse = useMemo(
    () =>
      new Fuse(searchItems, {
        keys: [
          { name: "nameCurrent", weight: 0.4 },
          { name: "tagsCurrent", weight: 0.3 },
          { name: "nameOther", weight: 0.2 },
          { name: "tagsOther", weight: 0.1 },
          { name: "descAll", weight: 0.05 },
        ],
        threshold: 0.4,
        ignoreLocation: true,
      }),
    [searchItems],
  );

  const filteredFlashes = useMemo(() => {
    const q = search.trim();
    const base = q ? fuse.search(q).map((r) => r.item.flash) : allFlashesArray;

    return base.filter((f: FlashType) => {
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((selectedTag) =>
          f.tags.some((tag) => Object.values(tag).includes(selectedTag)),
        );

      return matchesTags;
    });
  }, [allFlashesArray, fuse, search, selectedTags]);

  const toggleTag = (tag: Record<string, string>) => {
    setSelectedTags((prev) =>
      prev.includes(tag.pt)
        ? prev.filter((t) => t !== tag.pt)
        : [...prev, tag.pt],
    );
  };

  return (
    <div className="col w-full px-4 sm:px-6">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-[BohoSans] mt-6 mb-6">
          {t("flashes.title")}
        </h1>
      </div>

      <div className="mb-4 flex justify-center">
        <div className="relative w-full md:w-120">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("flashes.searchPlaceholder")}
            className="pl-10 pr-10 py-2 rounded-full w-full focus:outline-none focus:ring border-gray-200 focus:border-teal-600 border-2 bg-white"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              aria-label="Limpar busca"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <TagList
        tags={allTags}
        selectedTags={selectedTags}
        onToggle={toggleTag}
        onClear={() => setSelectedTags([])}
      />

      <div className="text-lg font-bold self-center">
        {t("flashes.total", { count: filteredFlashes.length })}
      </div>

      <FlashList flashes={filteredFlashes} />
    </div>
  );
}
