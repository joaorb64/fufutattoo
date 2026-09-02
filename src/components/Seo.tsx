import { useEffect } from "react";
import { SITE_URL } from "../config";

// Per-route document metadata. React 19 hoists <title>/<meta>/<link> rendered
// anywhere in the tree into <head>, so each page just renders <Seo …/> with its
// own copy. `path` is the route path (e.g. "/flashes"); `image` may be absolute
// or root-relative.
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
  // Drop the build-time fallback metadata from index.html once the app has
  // mounted — from here on <Seo> owns the document head.
  useEffect(() => {
    document.querySelectorAll("head [data-default]").forEach((el) => el.remove());
  }, []);

  const url = SITE_URL + (path === "/" ? "/" : path);
  const imageUrl = image.startsWith("http") ? image : SITE_URL + image;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? "noindex,follow" : "index,follow"} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Fufu" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </>
  );
}
