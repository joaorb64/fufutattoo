import { SITE_URL, INSTAGRAM_URL } from "../config";

// Renders a JSON-LD <script>. React keeps it in place in the DOM (JSON-LD is
// valid anywhere in the document and search engines read it from the body),
// and it ends up in the prerendered HTML too.
function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

// Site-wide identity: the artist (Person) + her practice (a generic
// LocalBusiness — tattoo and painting, not a tattoo-parlour-only business),
// based in Madrid.
export function SiteStructuredData() {
  const person = {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: "Flávia",
    alternateName: "Fufu",
    jobTitle: "Tattoo artist and painter",
    url: SITE_URL,
    image: OG_IMAGE,
    sameAs: [INSTAGRAM_URL],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Madrid",
      addressCountry: "ES",
    },
  };

  const business = {
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: "Fufu",
    description: "Tattoo and painting by Flávia (Fufu), in Madrid.",
    url: SITE_URL,
    image: OG_IMAGE,
    priceRange: "€€",
    sameAs: [INSTAGRAM_URL],
    founder: { "@id": `${SITE_URL}/#person` },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Madrid",
      addressCountry: "ES",
    },
    areaServed: ["Madrid", "Spain"],
  };

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          person,
          business,
          {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url: SITE_URL,
            name: "Fufu",
            inLanguage: ["pt", "es", "en"],
            publisher: { "@id": `${SITE_URL}/#person` },
          },
        ],
      }}
    />
  );
}

// Per-flash: a Product with a price offer, plus a breadcrumb trail.
export function FlashStructuredData({
  name,
  description,
  image,
  price,
  path,
  flashbookLabel,
}: {
  name: string;
  description?: string;
  image?: string;
  price?: number;
  path: string;
  flashbookLabel: string;
}) {
  const url = SITE_URL + path;

  const product: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    url,
    brand: { "@type": "Brand", name: "Fufu" },
  };
  if (description) product.description = description;
  if (image) product.image = image.startsWith("http") ? image : SITE_URL + image;
  if (typeof price === "number") {
    product.offers = {
      "@type": "Offer",
      price,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url,
    };
  }

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Fufu", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: flashbookLabel,
        item: `${SITE_URL}/flashes`,
      },
      { "@type": "ListItem", position: 3, name, item: url },
    ],
  };

  return (
    <>
      <JsonLd data={product} />
      <JsonLd data={breadcrumb} />
    </>
  );
}
