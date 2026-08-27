import { useTranslation } from "react-i18next";
import { resolveLocale } from "../../i18n";

const Tag = (props: {
  tag: Record<string, string>;
  selected?: boolean;
  light?: boolean;
  count?: number;
  onClick?: () => void;
}) => {
  const { i18n } = useTranslation();
  const locale = resolveLocale(i18n.language);
  const base =
    "px-2.5 rounded-full font-bold text-sm place-self-center cursor-pointer py-[0.10rem] shrink-0 whitespace-nowrap transition-transform hover:scale-110";
  const bg = props.light
    ? "bg-amber-100 text-zinc-900"
    : props.selected
      ? "bg-teal-600 text-white"
      : "bg-[#C9449E] text-white";
  return (
    <div className={`${base} ${bg}`} onClick={props.onClick}>
      {props.tag[locale] || props.tag.en || props.tag.pt}
      {props.count && <span> ({props.count})</span>}
    </div>
  );
};
export default Tag;
