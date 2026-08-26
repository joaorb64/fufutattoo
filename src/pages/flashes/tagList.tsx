import { useState } from "react";
import { useTranslation } from "react-i18next";
import Tag from "./tag";

type TagData = {
  tag: { pt: string; en: string };
  count: number;
};

const TagList = (props: {
  tags: Record<string, TagData>;
  selectedTags?: string[];
  onToggle?: (tag: { pt: string; en: string }) => void;
  onClear?: () => void;
}) => {
  const selected = props.selectedTags || [];
  const { t, i18n } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const locale = i18n.language.startsWith("pt") ? "pt" : "en";

  const tagValues = Object.values(props.tags);

  return (
    <section className="mb-4 flex flex-col gap-1.5">
      {/* Label row */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-500 font-bold">
          {t("flashes.filterByTag")}
        </span>
        {props.onClear && selected.length > 0 && (
          <button
            onClick={props.onClear}
            className="text-sm text-red-900 underline font-bold cursor-pointer"
          >
            {locale === "pt" ? "Limpar" : "Clear"}
          </button>
        )}
      </div>

      {/* Tags row — collapsed: one line + "mais tags"; expanded: wrap freely */}
      {!expanded ? (
        <div className="flex items-center gap-x-1">
          <div className="flex flex-wrap gap-x-1 gap-y-1 overflow-hidden max-h-6 flex-1 min-w-0">
            {tagValues.map((tag, i) => {
              const isSelected =
                selected.includes(tag.tag.en) || selected.includes(tag.tag.pt);
              return (
                <Tag
                  key={i}
                  tag={tag.tag}
                  count={tag.count}
                  selected={isSelected}
                  onClick={() => props.onToggle && props.onToggle(tag.tag)}
                />
              );
            })}
          </div>
          <button
            onClick={() => setExpanded(true)}
            className="text-xs text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer shrink-0"
          >
            {locale === "pt" ? "▼ mais tags" : "▼ more tags"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap gap-1">
            {tagValues.map((tag, i) => {
              const isSelected =
                selected.includes(tag.tag.en) || selected.includes(tag.tag.pt);
              return (
                <Tag
                  key={i}
                  tag={tag.tag}
                  count={tag.count}
                  selected={isSelected}
                  onClick={() => props.onToggle && props.onToggle(tag.tag)}
                />
              );
            })}
          </div>
          <button
            onClick={() => setExpanded(false)}
            className="text-xs text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer self-start"
          >
            {locale === "pt" ? "▲ menos tags" : "▲ fewer tags"}
          </button>
        </div>
      )}
    </section>
  );
};

export default TagList;
