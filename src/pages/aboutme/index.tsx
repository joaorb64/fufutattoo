import { useTranslation } from "react-i18next";
import SplashImage from "../../components/SplashImage";
import aboutMeImg from "../../assets/images/aboutme.webp";
import beeImg from "../../assets/images/bee2.webp";

const Title = ({ className = "" }: { className?: string }) => {
  const { t } = useTranslation();
  return (
    <div className={`relative inline-block ${className}`}>
      <img
        src={beeImg}
        alt=""
        aria-hidden
        className="absolute top-1/2 -translate-y-4/7 -right-24 lg:-right-32 xl:-right-36 w-20 lg:w-28 xl:w-32 -rotate-15 pointer-events-none select-none"
      />
      <h1 className="relative font-[BohoSans]">{t("aboutme.title")}</h1>
      <img
        src={beeImg}
        alt=""
        aria-hidden
        className="absolute top-1/2 -translate-y-4/7 -left-24 lg:-left-32 xl:-left-36 w-20 lg:w-28 xl:w-32 rotate-15 pointer-events-none select-none"
      />
    </div>
  );
};

const AboutMe = () => {
  const { t } = useTranslation();
  const aboutParagraphs = t("aboutme.paragraphs", {
    returnObjects: true,
  }) as string[];

  return (
    <>
      {/* ── Desktop: text left, splash-framed photo right ────────────── */}
      <div className="hidden md:flex w-full items-center gap-8 lg:gap-12 xl:gap-16 py-12 px-6 lg:px-10 xl:px-16">
        <div className="flex-1 min-w-0">
          <div className="text-center mb-6 lg:mb-8 xl:mb-10">
            <Title className="text-5xl lg:text-6xl xl:text-8xl" />
          </div>
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

      {/* ── Mobile: title, then photo, then text ─────────────────────── */}
      <div className="md:hidden w-full flex flex-col items-center px-6 pt-8 pb-8">
        <Title className="text-5xl mb-6 text-center" />

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
