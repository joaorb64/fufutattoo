import fs from "fs";
import path from "path";

// Writes public/sitemap.xml from the generated flash index. Run after
// generateFlashesIndex.js (which produces public/flashes.json) and before
// `vite build` — vite copies public/** into dist/.

const SITE_URL = "https://fufuart.com";
const flashesFile = path.resolve("public/flashes.json");
const outputFile = path.resolve("public/sitemap.xml");

// Stable top-level routes. `/info` is a redirect to `/prep-care`; `/flash-editor`
// is an unlisted internal tool — neither belongs in the sitemap.
const STATIC_ROUTES = [
  { path: "/", priority: "1.0" },
  { path: "/about", priority: "0.8" },
  { path: "/flashes", priority: "0.9" },
  { path: "/prep-care", priority: "0.6" },
  { path: "/studio", priority: "0.6" },
  { path: "/painting", priority: "0.5" },
  { path: "/shop", priority: "0.5" },
];

function loadFlashIds() {
  try {
    const data = JSON.parse(fs.readFileSync(flashesFile, "utf-8"));
    return Object.keys(data);
  } catch {
    return [];
  }
}

function urlEntry(loc, lastmod, priority) {
  return (
    `  <url>\n` +
    `    <loc>${SITE_URL}${loc}</loc>\n` +
    `    <lastmod>${lastmod}</lastmod>\n` +
    (priority ? `    <priority>${priority}</priority>\n` : "") +
    `  </url>`
  );
}

function generateSitemap() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const flashIds = loadFlashIds();

  const entries = [
    ...STATIC_ROUTES.map((r) => urlEntry(r.path, lastmod, r.priority)),
    ...flashIds.map((id) =>
      urlEntry(`/flashes/${encodeURIComponent(id)}`, lastmod, "0.7"),
    ),
  ];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    entries.join("\n") +
    `\n</urlset>\n`;

  fs.writeFileSync(outputFile, xml);
  console.log(
    `[${new Date().toLocaleTimeString()}] sitemap.xml written (${entries.length} URLs)`,
  );
}

generateSitemap();
