import { useTranslation } from "react-i18next";

const LANG_CHOSEN_KEY = "langChosen";

export function hasChosenLanguage(): boolean {
  return localStorage.getItem(LANG_CHOSEN_KEY) === "1";
}

export default function LanguageSplash({ onDone }: { onDone: () => void }) {
  const { i18n } = useTranslation();

  const select = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem(LANG_CHOSEN_KEY, "1");
    onDone();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#ffeedc] flex flex-col items-center justify-center gap-8 p-6">
      <h1
        className="text-brand font-[BohoSans] tracking-widest text-center"
        style={{ fontSize: "clamp(3rem, 12vw, 7rem)" }}
      >
        FUFU TATTOO
      </h1>

      <p className="text-zinc-500 font-[BohoSans] text-xl md:text-2xl tracking-wider text-center">
        Tattoo Artist &amp; Painter · Madrid
      </p>

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => select("pt")}
          className="px-8 py-3 bg-brand text-white rounded-full text-xl font-[BohoSans] tracking-wider hover:bg-brand-dark transition-colors cursor-pointer"
        >
          Português
        </button>
        <button
          onClick={() => select("en")}
          className="px-8 py-3 border-2 border-brand text-brand rounded-full text-xl font-[BohoSans] tracking-wider hover:bg-brand/10 transition-colors cursor-pointer"
        >
          English
        </button>
        <button
          onClick={() => select("es")}
          className="px-8 py-3 border-2 border-brand text-brand rounded-full text-xl font-[BohoSans] tracking-wider hover:bg-brand/10 transition-colors cursor-pointer"
        >
          Español
        </button>
      </div>
    </div>
  );
}
