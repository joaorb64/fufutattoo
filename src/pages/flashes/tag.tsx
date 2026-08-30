const Tag = (props: {
  label: string;
  selected?: boolean;
  light?: boolean;
  count?: number;
  onClick?: () => void;
}) => {
  const base =
    "px-2.5 rounded-full font-bold text-sm place-self-center cursor-pointer py-[0.10rem] shrink-0 whitespace-nowrap transition-transform hover:scale-110";
  const bg = props.light
    ? "bg-amber-100 text-zinc-900"
    : props.selected
      ? "bg-teal-600 text-white"
      : "bg-[#C9449E] text-white";
  return (
    <div className={`${base} ${bg}`} onClick={props.onClick}>
      {props.label}
      {props.count ? <span> ({props.count})</span> : null}
    </div>
  );
};
export default Tag;
