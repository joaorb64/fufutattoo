import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import FlashList from "./flashList";
import TagList from "./tagList";

export default function Flashes() {
  const { t } = useTranslation();
  type FlashType = {
    name: { pt?: string; en?: string };
    tags: { pt: string; en: string }[];
    images?: string[];
    description?: string;
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
    const tagsObj: Record<
      string,
      { tag: { pt: string; en: string }; count: number }
    > = {};

    Object.values(flashes).forEach((flash) => {
      flash.tags.forEach((tag) => {
        if (!tagsObj.hasOwnProperty(tag.en)) {
          tagsObj[tag.en] = {
            tag,
            count: 1,
          };
        } else {
          tagsObj[tag.en].count += 1;
        }
      });
    });

    const sortedTags = Object.keys(tagsObj)
      .sort((a, b) => tagsObj[b].count - tagsObj[a].count)
      .reduce(
        (
          Obj: Record<
            string,
            { tag: { pt: string; en: string }; count: number }
          >,
          key,
        ) => {
          Obj[key] = tagsObj[key];
          return Obj;
        },
        {} as Record<
          string,
          { tag: { pt: string; en: string }; count: number }
        >,
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

  const filteredFlashes = useMemo(() => {
    const q = search.trim().toLowerCase();

    return allFlashesArray.filter((f: FlashType) => {
      const namePt = f.name.pt?.toLowerCase() ?? "";
      const nameEn = f.name.en?.toLowerCase() ?? "";
      const tagsPt = f.tags.map((tag) => tag.pt.toLowerCase()).join(" ");
      const tagsEn = f.tags.map((tag) => tag.en.toLowerCase()).join(" ");
      const desc = f.description?.toLowerCase() ?? "";

      const matchesSearch =
        !q ||
        [namePt, nameEn, tagsPt, tagsEn, desc].some((value) =>
          value.includes(q),
        );

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((selectedTag) =>
          f.tags.some(
            (tag) => tag.pt === selectedTag || tag.en === selectedTag,
          ),
        );

      return matchesSearch && matchesTags;
    });
  }, [allFlashesArray, search, selectedTags]);

  const toggleTag = (tag: { pt: string; en: string }) => {
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
