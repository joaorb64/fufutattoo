import { useTranslation } from "react-i18next";

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
        <div className="w-screen bg-orange-50 py-12 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <h2 className="text-5xl mb-4 font-[BohoSans]">
              {t("information.before")}
            </h2>
            <div className="flex flex-col gap-4">
              <p>
                <span className="font-bold text-xl">
                  {t("information.remarkings")}
                </span>{" "}
                {t("information.beforeText")}
              </p>
              <p>
                <span className="font-bold text-xl">
                  {t("information.preCare")}
                </span>{" "}
                {t("information.preCareText")}
              </p>
              <p>
                <span className="font-bold text-xl">
                  {t("information.yourSkin")}
                </span>{" "}
                {t("information.skinText")}
              </p>
            </div>
          </div>
        </div>

        <div className="w-screen bg-rose-100 py-12 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <h2 className="text-5xl mb-4 font-[BohoSans]">
              {t("information.during")}
            </h2>
            <div className="flex flex-col gap-4">
              {duringParagraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="w-screen bg-amber-50 py-12 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <h2 className="text-5xl mb-4 font-[BohoSans]">
              {t("information.after")}
            </h2>
            <div className="flex flex-col gap-4">
              <h3 className="text-4xl mt-6 font-[BohoSans]">
                {t("information.otherCare")}
              </h3>
              {afterParagraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Information;
