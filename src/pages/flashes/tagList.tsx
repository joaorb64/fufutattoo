import { useState } from "react";
import { useTranslation } from "react-i18next";
import Tag from "./tag";
import { resolveLocale } from "../../i18n";
import { tagLabels, type LTag } from "./tagUtils";

type TagData = {
  tag: LTag;
  count: number;
};

const TagList = (props: {
  tags: Record<string, TagData>;
  selectedTags?: string[];
  onToggle?: (tag: LTag) => void;
  onClear?: () => void;
}) => {
  const selected = props.selectedTags || [];
  const { t, i18n } = useTranslation();
  const locale = resolveLocale(i18n.language);
  const [expanded, setExpanded] = useState(false);

  // One entry per chip: a tag with several synonyms (e.g. "rato" -> rat,
  // mouse) becomes several chips that all toggle the same tag.
  const chips = Object.values(props.tags).flatMap(({ tag, count }) =>
    tagLabels(tag, locale).map((label, i) => ({
      tag,
      label,
      count: i === 0 ? count : undefined,
      selected: selected.includes(String(tag.pt)),
    })),
  );

  const renderChips = () =>
    chips.map((chip, i) => (
      <Tag
        key={`${chip.label}-${i}`}
        label={chip.label}
        count={chip.count}
        selected={chip.selected}
        onClick={() => props.onToggle && props.onToggle(chip.tag)}
      />
    ));

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
            className="text-sm text-brand-dark underline font-bold cursor-pointer"
          >
            {t("flashes.clearTags")}
          </button>
        )}
      </div>

      {/* Tags row — collapsed: one line + "mais tags"; expanded: wrap freely */}
      {!expanded ? (
        <div className="flex items-center gap-x-1">
          <div className="flex flex-wrap gap-x-1 gap-y-1 overflow-hidden max-h-6 flex-1 min-w-0">
            {renderChips()}
          </div>
          <button
            onClick={() => setExpanded(true)}
            className="text-xs text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer shrink-0"
          >
            {t("flashes.moreTags")}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap gap-1">{renderChips()}</div>
          <button
            onClick={() => setExpanded(false)}
            className="text-xs text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer self-start"
          >
            {t("flashes.fewerTags")}
          </button>
        </div>
      )}
    </section>
  );
};

export default TagList;
