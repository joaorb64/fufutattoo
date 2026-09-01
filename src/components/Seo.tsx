import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SITE_URL } from "../config";
import { resolveLocale } from "../i18n";

// Per-route document metadata. React 19 hoists <title>, <meta> and <link>
// rendered anywhere in the tree into <head> and dedupes them, so every page
// just renders <Seo …/> with its own copy — no helmet dependency needed.
//
// `path` is the route path (e.g. "/flashes"); the canonical/OG URLs are built
// from SITE_URL so they're correct both when prerendered and at runtime.
// `image` may be absolute or root-relative (it's resolved against SITE_URL).

const OG_LOCALE: Record<string, string> = {
  pt: "pt_BR",
  en: "en_US",
  es: "es_ES",
};

export default function Seo({
  title,
  description,
  path,
  image = "/og-image.jpg",
  type = "website",
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
}) {
  const { i18n } = useTranslation();
  const locale = resolveLocale(i18n.language);

  // Drop the build-time fallback metadata from index.html once the app has
  // mounted — from here on <Seo> owns the document head. (Prerendered pages
  // have these stripped at build time already.)
  useEffect(() => {
    document
      .querySelectorAll("head [data-default]")
      .forEach((el) => el.remove());
  }, []);

  const url = SITE_URL + (path === "/" ? "/" : path);
  const imageUrl = image.startsWith("http") ? image : SITE_URL + image;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex ? (
        <meta name="robots" content="noindex,follow" />
      ) : (
        <meta name="robots" content="index,follow" />
      )}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="Fufu" />
      <meta property="og:locale" content={OG_LOCALE[locale] ?? "pt_BR"} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </>
  );
}
