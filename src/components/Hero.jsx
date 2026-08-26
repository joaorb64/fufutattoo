import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import heroImg from "../pages/aboutme/mini.jpeg";
import {
  INSTAGRAM_URL,
  INSTAGRAM_HANDLE,
  WHATSAPP_URL,
  EMAIL,
} from "../config";

const HeroButton = (props) => {
  return (
    <NavLink
      className="group flex bg-[#ffeedcD0] rounded-2xl px-4 py-1 md:bg-none md:px-0 md:py-0 md:rounded-none uppercase font-medium"
      to={props.to}
    >
      <div className="bg-red-800 w-0 group-hover:w-1 mr-2 invisible group-hover:visible"></div>
      {props.children}
    </NavLink>
  );
};

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="min-h-dvh grid md:grid-cols-2 absolute top-0 overflow-hidden content-center">
      {/* Image col */}
      <div className="flex items-center justify-center h-0 md:h-dvh">
        <img
          src={heroImg}
          alt="Tattooing"
          className="h-dvh w-screen md:w-2/3 object-cover fixed md:relative top-0"
        />
      </div>

      {/* Text col */}
      <div className="flex flex-col justify-between md:justify-center items-start z-50 h-dvh w-screen md:w-auto">
        <div className="w-full py-4 md:py-0 px-8 md:px-16 bg-[#ffeedcD0]">
          <h1 className="text-red-800 text-8xl md:text-9xl font-bold tracking-widest font-[BohoSans]">
            FLAVIA
          </h1>
          <p className="md:mt-1 text-zinc-800 uppercase text-4xl md:text-5xl tracking-wider font-[BohoSans]">
            {t("hero.artist")}
          </p>
          <p className="md:mt-1 max-w-md text-zinc-600 uppercase font-[BohoSans] text-2xl md:text-3xl tracking-wider">
            {t("hero.location")}
          </p>
        </div>

        {/* Bottom block — nav links + socials, pushed to bottom by justify-between */}
        <div className="w-full">
          <div className="px-4 md:px-16">
            <ul className="w-full md:mt-12 font-[BohoSans] text-5xl flex flex-col gap-2 md:gap-4 tracking-[0.05em] items-end md:items-start">
              <HeroButton to={"/about"}>{t("hero.about")}</HeroButton>
              <HeroButton to={"/info"}>{t("hero.info")}</HeroButton>
              <HeroButton to={"/studio"}>{t("hero.studio")}</HeroButton>
              <HeroButton to="/flashes">{t("hero.flashes")}</HeroButton>
            </ul>

            {/* Desktop: column with icon + text */}
            <div className="hidden md:flex md:mt-8 flex-col gap-2">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-red-800 hover:text-red-900 transition-colors"
              >
                <div className="mask-[url(instagram.svg)] bg-red-800 w-7 h-7 shrink-0" />
                <span className="tracking-wider text-lg">
                  {INSTAGRAM_HANDLE}
                </span>
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-red-800 hover:text-red-900 transition-colors"
              >
                <div className="mask-[url(whatsapp.svg)] bg-red-800 w-7 h-7 shrink-0" />
                <span className="tracking-wider text-lg">+351 915 204 911</span>
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-2 text-red-800 hover:text-red-900 transition-colors"
              >
                <div className="mask-[url(email.svg)] bg-red-800 w-7 h-7 shrink-0" />
                <span className="tracking-wider text-lg">{EMAIL}</span>
              </a>
            </div>
          </div>

          {/* Mobile: icon-only row with cream background */}
          <div className="md:hidden w-full bg-[#ffeedcD0] flex justify-center gap-8 py-3 mt-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-800 hover:text-red-900 transition-colors"
            >
              <div className="mask-[url(instagram.svg)] bg-red-800 w-7 h-7" />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-800 hover:text-red-900 transition-colors"
            >
              <div className="mask-[url(whatsapp.svg)] bg-red-800 w-7 h-7" />
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="text-red-800 hover:text-red-900 transition-colors"
            >
              <div className="mask-[url(email.svg)] bg-red-800 w-7 h-7" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
