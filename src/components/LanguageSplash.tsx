import { useTranslation } from "react-i18next";

const LANG_CHOSEN_KEY = "langChosen";

export function hasChosenLanguage(): boolean {
  return localStorage.getItem(LANG_CHOSEN_KEY) === "1";
}

export default function LanguageSplash({ onDone }: { onDone: () => void }) {
  const { i18n } = useTranslation();
  // Language isn't chosen yet, so pin the splash copy to English regardless of
  // what the detector picked.
  const t = i18n.getFixedT("en");

  const select = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem(LANG_CHOSEN_KEY, "1");
    onDone();
  };

  return (
    <div className="fixed inset-0 z-9999 bg-[#ffeedc] flex flex-col items-center justify-center gap-8 p-6 font-[BohoSans] text-center">
      <div>
        <h1 className="text-home-accent font-bold tracking-widest text-7xl md:text-8xl pl-2">
          {/* pl-2 is there to make the text align properly */}
          FUFU
        </h1>
        <p className="text-zinc-800 uppercase text-3xl md:text-4xl tracking-wider">
          {t("hero.artist")}
        </p>
        <p className="text-zinc-600 uppercase text-2xl md:text-3xl tracking-wider">
          {t("hero.location")}
        </p>
      </div>

      <div className="flex flex-col items-stretch gap-4 mt-4 w-full max-w-xs text-xl md:text-2xl uppercase font-medium tracking-wider">
        <button
          onClick={() => select("pt")}
          className="w-full px-8 py-3 bg-home-accent text-white rounded-full hover:bg-home-accent-dark transition-colors cursor-pointer"
        >
          Português
        </button>
        <button
          onClick={() => select("en")}
          className="w-full px-8 py-3 bg-home-accent text-white rounded-full hover:bg-home-accent-dark transition-colors cursor-pointer"
        >
          English
        </button>
        <button
          onClick={() => select("es")}
          className="w-full px-8 py-3 bg-home-accent text-white rounded-full hover:bg-home-accent-dark transition-colors cursor-pointer"
        >
          Español
        </button>
      </div>
    </div>
  );
}
