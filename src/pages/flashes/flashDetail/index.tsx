import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Tag from "../tag";
import Carousel from "../../../components/Carousel";
import FlashItem from "../flashItem";
import Seo from "../../../components/Seo";
import { FlashStructuredData } from "../../../components/StructuredData";
import { WHATSAPP_URL } from "../../../config";
import { resolveLocale } from "../../../i18n";
import { fetchFlashes } from "../../../flashes";
import { tagLabels } from "../tagUtils";

const FlashDetail = () => {
  const { t, i18n } = useTranslation();
  const locale = resolveLocale(i18n.language);
  const { flashId } = useParams<{ flashId: string }>();
  const navigate = useNavigate();
  const [flash, setFlash] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const [similarFlashes, setSimilarFlashes] = useState<any[]>([]);

  const cmToInches = (cm: number) => (cm / 2.54).toFixed(2);

  useEffect(() => {
    fetchFlashes()
      .then((res) => res.json())
      .then((data) => {
        const foundFlash = data[flashId!];
        if (foundFlash) {
          setFlash(foundFlash);

          const similar = Object.entries(data)
            .filter(([id, flash]: [string, any]) => {
              return (
                id !== flashId &&
                flash.tags?.some((tag: any) =>
                  foundFlash.tags?.some((t: any) => t.pt === tag.pt),
                )
              );
            })
            .map(([id, flash]) => ({ ...(flash as object), id }))
            .slice(0, 4);

          setSimilarFlashes(similar);
        } else {
          navigate("/flashes");
        }
      })
      .finally(() => setLoading(false));
  }, [flashId, navigate]);

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "ArrowLeft") {
        setImageIndex((i) =>
          flash?.images?.length
            ? (i - 1 + flash.images.length) % flash.images.length
            : 0,
        );
      }
      if (ev.key === "ArrowRight") {
        setImageIndex((i) =>
          flash?.images?.length ? (i + 1) % flash.images.length : 0,
        );
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flash]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t("flashes.loading", "Loading...")}</p>
      </div>
    );
  }

  if (!flash) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Seo
          title={t("flashes.notFound", "Flash not found.")}
          description={t("flashes.notFound", "Flash not found.")}
          path={`/flashes/${flashId}`}
          noindex
        />
        <p>{t("flashes.notFound", "Flash not found.")}</p>
      </div>
    );
  }

  const images = flash.images || [];
  const flashName = flash.name[locale] || flash.name.en || flash.name.pt;
  const flashDescription =
    flash.description?.[locale] ||
    flash.description?.en ||
    flash.description?.pt ||
    "";
  const flashPath = `/flashes/${flashId}`;
  const flashImage =
    images[0]?.original ?? images[0]?.watermarked ?? images[0]?.thumbnail;
  const seoDescription =
    flashDescription ||
    t("seo.flashDetail.descriptionFallback", {
      name: flashName,
      price: flash.price,
    });
  const flashUrl =
    typeof window !== "undefined"
      ? window.location.origin + window.location.pathname
      : "";
  const whatsappMessage = t("flashes.whatsappMessage", {
    name: flashName,
    url: flashUrl,
  });
  const whatsappHref = `${WHATSAPP_URL}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen p-4 w-full">
      <Seo
        title={t("seo.flashDetail.title", { name: flashName })}
        description={seoDescription}
        path={flashPath}
        image={flashImage}
        type="article"
      />
      <FlashStructuredData
        name={flashName}
        description={flashDescription || undefined}
        image={flashImage}
        price={flash.price}
        path={flashPath}
        flashbookLabel={t("nav.flashes")}
      />
      <button
        onClick={() => navigate("/flashes")}
        className="mb-4 hover:text-brand font-bold flex items-center gap-2 cursor-pointer"
      >
        {t("flashes.backButton")}
      </button>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          {images.length === 0 ? (
            <div className="w-full h-96 bg-black/10 rounded-lg flex items-center justify-center">
              {t("flashes.noImage")}
            </div>
          ) : (
            <>
              <div className="w-full h-96 rounded-lg overflow-hidden">
                <Carousel
                  images={images}
                  alt={flashName}
                  controlledIndex={imageIndex}
                  showDots={false}
                  onIndexChange={(i) => setImageIndex(i)}
                  className="w-full h-96"
                />
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 justify-center flex-wrap">
                  {images.map((_: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setImageIndex(i)}
                      aria-label={`Ir para imagem ${i + 1}`}
                      aria-current={i === imageIndex}
                      className={`w-24 rounded-lg border-2 transition-all bg-white ${
                        i === imageIndex
                          ? "border-teal-600 shadow-lg ring-2 ring-teal-700"
                          : "border-gray-300 hover:border-zinc-200"
                      }`}
                    >
                      <img
                        src={images[i].thumbnail}
                        alt={`${flashName} — ${t("flashes.option", { number: i + 1 })}`}
                        className="w-full h-24 object-cover rounded-t-lg"
                      />
                      <div
                        className={`text-xs mt-1 uppercase tracking-wide ${i === imageIndex ? "font-bold" : ""}`}
                      >
                        {t("flashes.option", { number: i + 1 })}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex flex-col gap-4 p-2">
          <div>
            <h1 className="text-6xl font-[BohoSans] tracking-wide">
              {flashName}
            </h1>
          </div>

          {flash.description && (
            <div>
              <h2 className="text-xl font-bold">{t("flashes.description")}</h2>
              <p className="leading-relaxed">
                {flash.description[locale] ||
                  flash.description.en ||
                  flash.description.pt}
              </p>
            </div>
          )}

          {(flash.size_min || flash.size_max) && (
            <div>
              <h2 className="text-xl font-bold mb-4">
                {t("flashes.recommendedSize")}
              </h2>
              <div className="inline-block">
                <div
                  className="grid gap-x-2 gap-y-2 text-base"
                  style={{ gridTemplateColumns: "60px 1fr 1fr" }}
                >
                  <div></div>
                  <div className="text-zinc-600 text-sm uppercase tracking-wide text-center">
                    {t("flashes.centimeters", "Centimeters")}
                  </div>
                  <div className="text-zinc-600 text-sm uppercase tracking-wide text-center">
                    {t("flashes.inches", "Inches")}
                  </div>

                  {flash.size_min && (
                    <>
                      <div className="text-zinc-600 font-semibold">
                        {t("flashes.sizeMin", "Min")}
                      </div>
                      <div className="text-center">
                        {flash.size_min[0].toFixed(2)} ×{" "}
                        {flash.size_min[1].toFixed(2)}
                      </div>
                      <div className="text-center">
                        {cmToInches(flash.size_min[0])} ×{" "}
                        {cmToInches(flash.size_min[1])}
                      </div>
                    </>
                  )}

                  {flash.size_max && (
                    <>
                      <div className="text-zinc-600 font-semibold">
                        {t("flashes.sizeMax", "Max")}
                      </div>
                      <div className="text-center">
                        {flash.size_max[0].toFixed(2)} ×{" "}
                        {flash.size_max[1].toFixed(2)}
                      </div>
                      <div className="text-center">
                        {cmToInches(flash.size_max[0])} ×{" "}
                        {cmToInches(flash.size_max[1])}
                      </div>
                    </>
                  )}

                  {flash.size_recommended && (
                    <>
                      <div className="text-teal-600 font-semibold">
                        {t("flashes.sizeRec", "Rec.")}
                      </div>
                      <div className="text-right font-semibold text-teal-600">
                        {flash.size_recommended[0].toFixed(2)} ×{" "}
                        {flash.size_recommended[1].toFixed(2)}
                      </div>
                      <div className="text-right font-semibold text-teal-600">
                        {cmToInches(flash.size_recommended[0])} ×{" "}
                        {cmToInches(flash.size_recommended[1])}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <p className="leading-tight">
            <span className="block text-sm text-zinc-500 lowercase">
              {t("flashes.priceFrom")}
            </span>
            <span className="font-[BohoSans] text-4xl tracking-wide">
              €{flash.price}
            </span>
          </p>

          {flash.tags && flash.tags.length > 0 && (
            <div>
              <h2 className="text-lg font-bold">{t("flashes.tags")}</h2>
              <div className="flex flex-wrap gap-2">
                {flash.tags.flatMap((tag: any, i: number) =>
                  tagLabels(tag, locale).map((label, j) => (
                    <Tag key={`${i}-${j}`} label={label} />
                  )),
                )}
              </div>
            </div>
          )}

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start flex items-center justify-center gap-3 bg-[#5B8355] hover:bg-[#4d6f48] text-white font-semibold rounded-full px-6 py-4 transition-colors"
          >
            <img
              src={`${import.meta.env.BASE_URL}whatsapp.svg`}
              alt=""
              className="w-6 h-6 shrink-0 brightness-0 invert"
            />
            {t("flashes.bookWhatsapp")}
          </a>
        </div>
      </div>

      {similarFlashes.length > 0 && (
        <div className="mt-16 border-t-3 border-dashed border-[#C9449E]/40 pt-12 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            {t("flashes.maybeAlsoLike")}
          </h2>
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarFlashes.map((f, i) => (
              <FlashItem key={i} flash={f} flashId={f.id} />
            ))}
          </section>
        </div>
      )}
    </div>
  );
};

export default FlashDetail;
