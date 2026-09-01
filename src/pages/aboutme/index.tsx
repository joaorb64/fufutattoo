import { useTranslation } from "react-i18next";
import SplashImage from "../../components/SplashImage";
import StickerTitle from "../../components/StickerTitle";
import aboutMeImg from "../../assets/images/aboutme.webp";
import beeImg from "../../assets/images/bee2.webp";

const AboutMe = () => {
  const { t } = useTranslation();
  const aboutParagraphs = t("aboutme.paragraphs", {
    returnObjects: true,
  }) as string[];

  return (
    <>
      {/* ── Desktop: centered title, then text left + splash-framed photo right ── */}
      <div className="hidden md:block w-full pt-6 pb-12 px-6 lg:px-10 xl:px-16">
        <div className="text-center mb-8 lg:mb-12 xl:mb-16">
          <StickerTitle
            sticker={beeImg}
            tiltDeg={15}
            className="text-5xl lg:text-6xl xl:text-8xl"
          >
            {t("aboutme.title")}
          </StickerTitle>
        </div>

        <div className="flex items-center gap-8 lg:gap-12 xl:gap-16">
          <div className="flex-1 min-w-0">
            {aboutParagraphs.map((paragraph, idx) => (
              <p
                key={idx}
                className="text-lg lg:text-xl text-zinc-800 leading-relaxed mb-6 max-w-xl"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <SplashImage
            src={aboutMeImg}
            alt="Flávia"
            accentColor="#DFA040"
            className="w-full max-w-65 lg:max-w-sm xl:max-w-xl min-w-0 shrink"
          />
        </div>
      </div>

      {/* ── Mobile: title, then photo, then text ─────────────────────── */}
      <div className="md:hidden w-full flex flex-col items-center px-6 pt-6 pb-8">
        <StickerTitle
          sticker={beeImg}
          tiltDeg={15}
          className="text-5xl mb-6 text-center"
        >
          {t("aboutme.title")}
        </StickerTitle>

        <SplashImage
          src={aboutMeImg}
          alt="Flávia"
          accentColor="#C88841"
          className="w-full max-w-sm mb-8"
        />

        {aboutParagraphs.map((paragraph, idx) => (
          <p key={idx} className="text-lg text-zinc-800 leading-relaxed mb-5">
            {paragraph}
          </p>
        ))}
      </div>
    </>
  );
};

export default AboutMe;
