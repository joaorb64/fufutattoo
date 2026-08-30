import { useTranslation } from "react-i18next";
import spacecatImg from "../../assets/images/spacecat.webp";
import duckImg from "../../assets/images/duck.webp";
import squirrelImg from "../../assets/images/squirrel.webp";

// Renders **bold** spans inside an otherwise plain string.
const RichText = ({ text }: { text: string }) => (
  <>
    {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      ) : (
        part
      ),
    )}
  </>
);

const Information = () => {
  const { t } = useTranslation();
  const duringParagraphs = t("information.duringParagraphs", {
    returnObjects: true,
  }) as string[];
  const afterParagraphs = t("information.afterParagraphs", {
    returnObjects: true,
  }) as string[];

  return (
    <div>
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-[BohoSans] mt-6 mb-6">
          {t("information.title")}
        </h1>
      </div>

      <div className="flex flex-col">
        <div className="w-screen bg-[#9DB2DB] py-12 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl flex items-center gap-8">
            <img
              src={spacecatImg}
              alt=""
              aria-hidden
              className="hidden md:block w-40 h-40 lg:w-56 lg:h-56 object-contain shrink-0 select-none"
            />
            <div className="flex-1 min-w-0">
              <div className="relative inline-block mb-4">
                <img
                  src={spacecatImg}
                  alt=""
                  aria-hidden
                  className="md:hidden absolute top-1/2 -translate-y-1/2 -right-20 w-16 pointer-events-none select-none"
                />
                <h2 className="relative text-5xl font-[BohoSans]">
                  {t("information.before")}
                </h2>
              </div>
              <div className="flex flex-col gap-4 text-lg">
                <p>
                  <RichText text={t("information.reschedulingText")} />
                </p>
                <p>
                  <RichText text={t("information.preCareText")} />
                </p>
                <p>
                  <RichText text={t("information.skinText")} />
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-screen bg-[#DF9F9F] py-12 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl flex flex-row-reverse items-center gap-8">
            <img
              src={duckImg}
              alt=""
              aria-hidden
              className="hidden md:block w-40 h-40 lg:w-56 lg:h-56 object-contain shrink-0 select-none"
            />
            <div className="flex-1 min-w-0">
              <div className="relative inline-block mb-4">
                <img
                  src={duckImg}
                  alt=""
                  aria-hidden
                  className="md:hidden absolute top-1/2 -translate-y-1/2 -right-20 w-16 pointer-events-none select-none"
                />
                <h2 className="relative text-5xl font-[BohoSans]">
                  {t("information.during")}
                </h2>
              </div>
              <div className="flex flex-col gap-4 text-lg">
                {duringParagraphs.map((paragraph, idx) => (
                  <p key={idx}>
                    <RichText text={paragraph} />
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-screen bg-[#F0E0A2] py-12 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl flex items-center gap-8">
            <img
              src={squirrelImg}
              alt=""
              aria-hidden
              className="hidden md:block w-40 h-40 lg:w-56 lg:h-56 object-contain shrink-0 select-none"
            />
            <div className="flex-1 min-w-0">
              <div className="relative inline-block mb-4">
                <img
                  src={squirrelImg}
                  alt=""
                  aria-hidden
                  className="md:hidden absolute top-1/2 -translate-y-1/2 -right-20 w-16 pointer-events-none select-none"
                />
                <h2 className="relative text-5xl font-[BohoSans]">
                  {t("information.after")}
                </h2>
              </div>
              <div className="flex flex-col gap-4 text-lg">
                {afterParagraphs.map((paragraph, idx) => (
                  <p key={idx}>
                    <RichText text={paragraph} />
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Information;
