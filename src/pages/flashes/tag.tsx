import { useTranslation } from "react-i18next";

const Tag = (props: {
  tag: { pt: string; en: string };
  selected?: boolean;
  light?: boolean;
  count?: number;
  onClick?: () => void;
}) => {
  const { i18n } = useTranslation();
  const locale = i18n.language.startsWith("pt") ? "pt" : "en";
  const base =
    "px-2 rounded-md font-bold text-sm place-self-center cursor-pointer py-[0.10rem] shrink-0 whitespace-nowrap";
  const bg = props.light
    ? "bg-amber-100 text-zinc-900"
    : props.selected
      ? "bg-red-500 text-white"
      : "bg-red-700 text-amber-50";
  return (
    <div className={`${base} ${bg}`} onClick={props.onClick}>
      {props.tag[locale] || props.tag.en || props.tag.pt}
      {props.count && <span> ({props.count})</span>}
    </div>
  );
};
export default Tag;
