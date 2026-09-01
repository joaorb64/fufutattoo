import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import StickerTitle from "../../components/StickerTitle";
import Seo from "../../components/Seo";
import jelloImg from "../../assets/images/jello.webp";
import tanookiImg from "../../assets/images/sticker_tanooki.webp";
import duckImg from "../../assets/images/sticker_duck.webp";
import birdImg from "../../assets/images/sticker_bird.webp";

// Same sticker pool as the Session & Care page.
const STICKERS = [jelloImg, tanookiImg, duckImg, birdImg];

// Remembers the last sticker shown so a route change never lands on the same one.
let lastSticker: string | null = null;

const pickSticker = () => {
  const pool = STICKERS.filter((s) => s !== lastSticker);
  lastSticker = pool[Math.floor(Math.random() * pool.length)];
  return lastSticker;
};

// Placeholder page for sections that aren't ready yet (Painting & Illustration,
// Shop). Big BohoSans title, a random sticker, and a short "coming soon" line.
const ComingSoon = ({ titleKey }: { titleKey: string }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  // Re-roll the sticker whenever the route changes (the same component instance
  // is reused between /painting and /shop), never repeating the previous one.
  const sticker = useMemo(() => pickSticker(), [pathname]);

  // titleKey is "painting.title" | "shop.title" → the seo.* sub-key.
  const seoKey = titleKey.split(".")[0];

  return (
    <div className="w-full">
      <Seo
        title={t(`seo.${seoKey}.title`)}
        description={t(`seo.${seoKey}.description`)}
        path={pathname}
      />
      <div className="text-center">
        <StickerTitle className="text-6xl md:text-8xl mt-6 mb-6">
          {t(titleKey)}
        </StickerTitle>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-8 py-10">
        <img
          src={sticker}
          alt=""
          aria-hidden
          className="w-48 md:w-64 object-contain pointer-events-none select-none -rotate-6"
        />
        <h2 className="text-4xl md:text-5xl font-[BohoSans] text-home-accent tracking-wider">
          {t("comingSoon.heading")}
        </h2>
      </div>
    </div>
  );
};

export default ComingSoon;
