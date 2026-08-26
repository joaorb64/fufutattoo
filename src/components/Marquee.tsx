export default function Marquee({ className = "" }: { className?: string }) {
  const text = "FUFU TATTOO · TATTOO ARTIST · PAINTER · LISBOA · TATUADORA · PINTORA · ";
  return (
    <div className={`w-full overflow-hidden select-none ${className}`}>
      <div className="flex w-max animate-marquee">
        <span className="font-[BohoSans] tracking-widest whitespace-nowrap">{text}</span>
        <span className="font-[BohoSans] tracking-widest whitespace-nowrap" aria-hidden>{text}</span>
      </div>
    </div>
  );
}
