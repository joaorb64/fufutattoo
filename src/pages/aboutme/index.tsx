import { useTranslation } from "react-i18next";
import aboutMeImg from "./aboutme.jpg";

const AboutMe = () => {
  const { t } = useTranslation();
  const aboutParagraphs = t("aboutme.paragraphs", {
    returnObjects: true,
  }) as string[];

  return (
    <>
      {/* ── Desktop: side-by-side ────────────────────────────────────────
          Text left (55 %), image right (45 %).

          Right column tricks:
          • width  calc(45% + max(0,50vw-50%))  → extends to viewport right
          • margin-right min(0, 50%-50vw)        → negative on wide screens
          • inner div top:-5rem                  → image starts at topbar,
                                                    no cream stripe above it
      ─────────────────────────────────────────────────────────────────── */}
      <div className="hidden md:flex w-full">

        {/* Left: text */}
        <div className="flex-1 min-w-0 py-12 pl-14 pr-10">
          <h1 className="text-8xl font-[BohoSans] mb-10">
            {t("aboutme.title")}
          </h1>
          {aboutParagraphs.map((paragraph, idx) => (
            <p
              key={idx}
              className="text-xl text-zinc-800 leading-relaxed mb-6 max-w-xl"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Right: image — bleeds to viewport right, top flush with topbar */}
        <div
          className="relative"
          style={{
            width: "calc(45% + max(0px, 50vw - 50%))",
            marginRight: "min(0px, calc(50% - 50vw))",
            alignSelf: "stretch",
          }}
        >
          {/* Inner div climbs 5rem above the flex row to meet the topbar */}
          <div
            className="absolute overflow-hidden"
            style={{ top: "-5rem", left: 0, right: 0, bottom: 0 }}
          >
            <img
              src={aboutMeImg}
              alt="Flávia"
              className="w-full h-full object-cover"
              style={{ objectPosition: "50% 20%" }}
            />
            <div
              className="absolute inset-y-0 left-0 pointer-events-none"
              style={{
                width: "8rem",
                background: "linear-gradient(to right, #ffeedc, transparent)",
              }}
            />
          </div>
        </div>

      </div>

      {/* ── Mobile: title → photo → text ─────────────────────────────────
          Title comes first so there's something to read without scrolling.
          Photo is full-bleed (escapes padding with 50%-50vw margins).
      ─────────────────────────────────────────────────────────────────── */}
      <div className="md:hidden w-full">

        <h1 className="text-6xl font-[BohoSans] px-6 pt-6 pb-5">
          {t("aboutme.title")}
        </h1>

        {/* Full-bleed photo */}
        <div
          className="relative overflow-hidden"
          style={{
            marginLeft: "min(0px, calc(50% - 50vw))",
            marginRight: "min(0px, calc(50% - 50vw))",
            width: "max(100%, 100vw)",
            height: "65vh",
          }}
        >
          <img
            src={aboutMeImg}
            alt="Flávia"
            className="w-full h-full object-cover"
            style={{ objectPosition: "50% 20%" }}
          />
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              height: "35%",
              background: "linear-gradient(to top, #ffeedc 10%, transparent)",
            }}
          />
        </div>

        {/* Text */}
        <div className="px-6 pt-5 pb-8">
          {aboutParagraphs.map((paragraph, idx) => (
            <p
              key={idx}
              className="text-lg text-zinc-800 leading-relaxed mb-5"
            >
              {paragraph}
            </p>
          ))}
        </div>

      </div>
    </>
  );
};

export default AboutMe;
