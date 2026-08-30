import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { resolveLocale } from "../../i18n";

const FlashItem = (props: { flash: any; flashId: string }) => {
  const { t, i18n } = useTranslation();
  const locale = resolveLocale(i18n.language);
  const images = props.flash.images || [];
  const navigate = useNavigate();

  const src =
    images[0]?.watermarked ?? images[0]?.thumbnail ?? images[0]?.original ?? "";
  const flashName =
    props.flash.name[locale] || props.flash.name.en || props.flash.name.pt;

  return (
    <div
      className="cursor-pointer group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-3 pb-4"
      onClick={() => navigate(`/flashes/${props.flashId}`)}
    >
      {/* Full image, no crop */}
      <div className="aspect-square overflow-hidden">
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

      {/* Polaroid caption */}
      <div className="pt-3 flex items-center justify-between gap-2">
        <p className="font-[BohoSans] text-3xl tracking-wide uppercase leading-tight truncate font-medium">
          {flashName}
        </p>
        <p className="shrink-0 text-right leading-tight">
          <span className="block text-xs text-zinc-500 uppercase tracking-wide font-semibold">
            {t("flashes.priceFrom")}
          </span>
          <span className="font-[BohoSans] text-2xl text-zinc-900 font-medium">
            €{props.flash.price}
          </span>
        </p>
      </div>
    </div>
  );
};

export default FlashItem;
