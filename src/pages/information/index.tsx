import { useTranslation } from "react-i18next";
import StickerTitle from "../../components/StickerTitle";
import jelloImg from "../../assets/images/jello.webp";
import tanookiImg from "../../assets/images/sticker_tanooki.webp";
import duckImg from "../../assets/images/sticker_duck.webp";
import foxImg from "../../assets/images/sticker_fox.webp";

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

const Section = ({
  bg,
  image,
  imageClassName = "w-44 lg:w-56",
  imageRight = false,
  heading,
  paragraphs,
}: {
  bg: string;
  image: string;
  imageClassName?: string;
  imageRight?: boolean;
  heading: string;
  paragraphs: string[];
}) => (
  <div
    className="w-screen py-12 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden"
    style={{ backgroundColor: bg }}
  >
    <div
      className={`mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl flex items-center gap-8 ${
        imageRight ? "flex-row-reverse" : ""
      }`}
    >
      <img
        src={image}
        alt=""
        aria-hidden
        className={`hidden md:block ${imageClassName} object-contain shrink-0 select-none`}
      />
      <div className="flex-1 min-w-0">
        <div className="relative inline-block mb-4">
          <img
            src={image}
            alt=""
            aria-hidden
            className="md:hidden absolute top-1/2 -translate-y-1/2 -right-24 w-20 pointer-events-none select-none"
          />
          <h2 className="relative text-5xl font-[BohoSans]">{heading}</h2>
        </div>
        <div className="flex flex-col gap-4 text-lg">
          {paragraphs.map((paragraph, idx) => (
            <p key={idx}>
              <RichText text={paragraph} />
            </p>
          ))}
        </div>
      </div>
    </div>
  </div>
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
        <StickerTitle
          sticker={jelloImg}
          mirrorRight
          className="text-6xl md:text-8xl mt-6 mb-6"
        >
          {t("information.title")}
        </StickerTitle>
      </div>

      <div className="flex flex-col">
        <Section
          bg="#9DB2DB"
          image={tanookiImg}
          imageClassName="w-60 lg:w-70"
          heading={t("information.before")}
          paragraphs={[
            t("information.reschedulingText"),
            t("information.preCareText"),
            t("information.skinText"),
          ]}
        />
        <Section
          bg="#DF9F9F"
          image={duckImg}
          imageRight
          heading={t("information.during")}
          paragraphs={duringParagraphs}
        />
        <Section
          bg="#F0E0A2"
          image={foxImg}
          heading={t("information.after")}
          paragraphs={afterParagraphs}
        />
      </div>
    </div>
  );
};
export default Information;
