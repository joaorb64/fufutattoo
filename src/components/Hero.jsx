import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "./Seo";
import SplashImage from "./SplashImage";
import heroImg from "../assets/images/mainpage.webp";
import ratImg from "../assets/images/rat.webp";
import {
  INSTAGRAM_URL,
  INSTAGRAM_HANDLE,
  WHATSAPP_URL,
  EMAIL,
} from "../config";

const MaskIcon = ({ src, className = "" }) => (
  <div
    className={`bg-home-accent ${className}`}
    style={{
      WebkitMaskImage: `url(${import.meta.env.BASE_URL}${src})`,
      maskImage: `url(${import.meta.env.BASE_URL}${src})`,
      WebkitMaskSize: "contain",
      maskSize: "contain",
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
    }}
  />
);

const HeroButton = (props) => {
  return (
    <NavLink
      className="group flex bg-[#ffeedcD0] rounded-2xl px-4 py-1 md:bg-none md:px-0 md:py-0 md:rounded-none uppercase font-medium"
      to={props.to}
    >
      <div className="bg-home-accent w-0 group-hover:w-1 mr-2 invisible group-hover:visible"></div>
      {props.children}
    </NavLink>
  );
};

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="min-h-dvh w-full grid md:grid-cols-[1fr_1fr] lg:grid-cols-[11fr_9fr] xl:grid-cols-[3fr_2fr] absolute top-0 overflow-hidden content-center">
      <Seo
        title={t("seo.home.title")}
        description={t("seo.home.description")}
        path="/"
      />
      {/* ── Mobile: splash photo floats behind; title/nav/footer float above ── */}
      <div className="md:hidden relative w-full h-dvh flex flex-col justify-between">
        {/* Splash photo — floating background, bigger than the screen, doesn't
            affect the layout of the content around it */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 h-full flex items-center justify-center pointer-events-none"
          style={{ width: "122vw" }}
        >
          <SplashImage
            src={heroImg}
            alt="Tattooing"
            accentColor="#BF5E5E"
            className="w-full"
            objectPosition="50% 15%"
          />
        </div>

        <div className="relative w-full py-4 pl-8 pr-32 bg-[#ffeedcD0]">
          <img
            src={ratImg}
            alt=""
            aria-hidden
            className="absolute top-3 right-4 w-28 rotate-6 pointer-events-none select-none"
          />
          <h1 className="text-home-accent text-6xl sm:text-8xl font-bold tracking-widest font-[BohoSans]">
            FUFU
          </h1>
          <p className="text-zinc-800 uppercase text-4xl tracking-wider font-[BohoSans]">
            {t("hero.artist")}
          </p>
          <p className="max-w-md text-zinc-600 uppercase font-[BohoSans] text-3xl tracking-wider">
            {t("hero.location")}
          </p>
        </div>

        <div className="relative w-full">
          <div className="px-4">
            <ul className="w-full font-[BohoSans] text-4xl flex flex-col gap-2 tracking-[0.05em] items-end">
              <HeroButton to={"/about"}>{t("hero.about")}</HeroButton>
              <HeroButton to="/flashes">{t("hero.flashes")}</HeroButton>
              <HeroButton to={"/prep-care"}>{t("hero.info")}</HeroButton>
              <HeroButton to={"/painting"}>{t("hero.painting")}</HeroButton>
              <HeroButton to={"/shop"}>{t("hero.shop")}</HeroButton>
            </ul>
          </div>

          <div className="w-full bg-[#ffeedcD0] flex justify-center gap-8 py-3 mt-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-home-accent hover:text-home-accent-dark transition-colors"
            >
              <MaskIcon src="instagram.svg" className="w-7 h-7" />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-home-accent hover:text-home-accent-dark transition-colors"
            >
              <MaskIcon src="whatsapp.svg" className="w-7 h-7" />
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="text-home-accent hover:text-home-accent-dark transition-colors"
            >
              <MaskIcon src="email.svg" className="w-7 h-7" />
            </a>
          </div>
        </div>
      </div>

      {/* Desktop: splash-shaped photo */}
      <div className="hidden md:flex items-center justify-center h-dvh min-w-0 px-4 lg:px-8 xl:px-12">
        <div className="min-w-0" style={{ width: "min(100%, 85dvh)" }}>
          <SplashImage
            src={heroImg}
            alt="Tattooing"
            accentColor="#BF5E5E"
            className="w-full"
            objectPosition="50% 15%"
          />
        </div>
      </div>

      {/* Desktop: text col */}
      <div className="hidden md:flex flex-col justify-center items-start z-50 h-dvh min-w-0">
        <div className="w-full px-6 lg:px-10 xl:px-16 bg-[#ffeedcD0]">
          <h1 className="text-home-accent text-7xl lg:text-8xl xl:text-9xl font-bold tracking-widest font-[BohoSans]">
            FUFU
          </h1>
          <p className="mt-1 text-zinc-800 uppercase text-2xl lg:text-4xl xl:text-5xl tracking-wider font-[BohoSans]">
            {t("hero.artist")}
          </p>
          <p className="mt-1 max-w-md text-zinc-600 uppercase font-[BohoSans] text-xl lg:text-3xl xl:text-4xl tracking-wider">
            {t("hero.location")}
          </p>
        </div>

        {/* Nav links + socials */}
        <div className="w-full px-6 lg:px-10 xl:px-16">
          <ul className="w-full mt-8 lg:mt-10 font-[BohoSans] text-2xl lg:text-3xl xl:text-4xl flex flex-col gap-1.5 md:gap-2.5 tracking-[0.05em] items-start">
            <HeroButton to={"/about"}>{t("hero.about")}</HeroButton>
            <HeroButton to="/flashes">{t("hero.flashes")}</HeroButton>
            <HeroButton to={"/prep-care"}>{t("hero.info")}</HeroButton>
            <HeroButton to={"/painting"}>{t("hero.painting")}</HeroButton>
            <HeroButton to={"/shop"}>{t("hero.shop")}</HeroButton>
          </ul>

          <div className="flex mt-8 flex-col gap-2">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-home-accent hover:text-home-accent-dark transition-colors"
            >
              <MaskIcon src="instagram.svg" className="w-7 h-7 shrink-0" />
              <span className="tracking-wider text-lg">{INSTAGRAM_HANDLE}</span>
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-home-accent hover:text-home-accent-dark transition-colors"
            >
              <MaskIcon src="whatsapp.svg" className="w-7 h-7 shrink-0" />
              <span className="tracking-wider text-lg">+351 915 204 911</span>
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center gap-2 text-home-accent hover:text-home-accent-dark transition-colors"
            >
              <MaskIcon src="email.svg" className="w-7 h-7 shrink-0" />
              <span className="tracking-wider text-lg">{EMAIL}</span>
            </a>
          </div>
        </div>
      </div>

      <img
        src={ratImg}
        alt=""
        aria-hidden
        className="hidden md:block absolute bottom-6 right-6 w-32 lg:w-48 xl:w-56 rotate-6 pointer-events-none select-none z-40"
      />
    </section>
  );
}
