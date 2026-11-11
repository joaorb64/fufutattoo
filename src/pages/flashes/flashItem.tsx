import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { resolveLocale } from "../../i18n";
import FlashPrice from "./flashPrice";

const FlashItem = (props: { flash: any; flashId: string }) => {
  const { t, i18n } = useTranslation();
  const locale = resolveLocale(i18n.language);
  const images = props.flash.images || [];
  const navigate = useNavigate();
  const location = useLocation();

  // How many history steps the opened flash page is from the flash list, so
  // its back button can return there (with search and scroll intact). Opening
  // a similar flash from a flash page adds one more step.
  const fromDepth = (location.state as { listDepth?: number } | null)?.listDepth;
  const listDepth =
    location.pathname === "/flashes" ? 1 : fromDepth ? fromDepth + 1 : undefined;

  const src =
    images[0]?.watermarked ?? images[0]?.thumbnail ?? images[0]?.original ?? "";
  const flashName =
    props.flash.name[locale] || props.flash.name.en || props.flash.name.pt;

  return (
    <div
      className="cursor-pointer group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-3 pb-4"
      onClick={() =>
        navigate(`/flashes/${props.flashId}`, { state: { listDepth } })
      }
    >
      {/* Full image, no crop */}
      <div className="aspect-square overflow-hidden bg-[#ffeedc]">
        {src ? (
          <img
            src={src}
            alt={t("flashes.imageAlt", { name: flashName })}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">
            {t("flashes.noImage")}
          </div>
        )}
      </div>

      {/* Polaroid caption — stacked on mobile, title + price side by side on desktop */}
      <div className="pt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-0.5 md:gap-2">
        <p className="font-[BohoSans] text-2xl sm:text-2xl lg:text-3xl tracking-wide uppercase leading-tight truncate font-medium">
          {flashName}
        </p>
        <p className="shrink-0 leading-tight text-left md:text-right">
          <span className="block text-xs text-zinc-500 uppercase tracking-wide font-semibold">
            {t("flashes.priceFrom")}
          </span>
          <FlashPrice
            price={props.flash.price}
            className="font-[BohoSans] text-2xl text-zinc-900 font-medium"
          />
        </p>
      </div>
    </div>
  );
};

export default FlashItem;
