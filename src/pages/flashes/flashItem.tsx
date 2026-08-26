import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FlashItem = (props: { flash: any; flashId: string }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith("pt") ? "pt" : "en";
  const images = props.flash.images || [];
  const navigate = useNavigate();

  const src = images[0]?.watermarked ?? images[0]?.thumbnail ?? images[0]?.original ?? "";
  const flashName = props.flash.name[locale] || props.flash.name.en || props.flash.name.pt;

  return (
    <div
      className="cursor-pointer group transition-colors duration-300 rounded-sm hover:bg-[#cbbcac]"
      onClick={() => navigate(`/flashes/${props.flashId}`)}
    >
      {/* Full image, no crop */}
      <div className="bg-white aspect-square overflow-hidden transition-colors duration-300 group-hover:bg-[#cbbcac]">
        {src ? (
          <img
            src={src}
            alt={flashName}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">
            {t("flashes.noImage")}
          </div>
        )}
      </div>

      {/* Info always visible */}
      <div className="pt-1 pb-2 px-3 flex items-baseline justify-between gap-2">
        <p className="font-[BohoSans] text-2xl tracking-wide uppercase leading-tight truncate font-bold">
          {flashName}
        </p>
        <p className="font-[BohoSans] text-xl text-zinc-900 shrink-0 font-bold">€{props.flash.price}</p>
      </div>
    </div>
  );
};

export default FlashItem;
