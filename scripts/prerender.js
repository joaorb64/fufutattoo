import fs from "fs";
import path from "path";
import http from "http";
import crypto from "crypto";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";

// Post-build prerender: render the stable top-level pages to static HTML so
// crawlers and link-preview bots get real content (title, meta, JSON-LD, copy)
// without executing JS. Flash detail pages are intentionally NOT prerendered —
// there are many, they change often, and Googlebot renders their client-side
// <Seo>/JSON-LD fine; they're covered by the sitemap and the 404 SPA shim.
//
// Speed: the 7 routes render in parallel, and the whole step is skipped when
// the app bundle is byte-for-byte unchanged from the last run (a flash-only
// edit via the online editor changes public/flashes/** and flashes.json, never
// the bundle — so those deploys reuse the cached prerender and never launch a
// browser).

const distDir = path.resolve(
  fileURLToPath(new URL(".", import.meta.url)),
  "../dist",
);
const cacheDir = path.resolve(
  fileURLToPath(new URL(".", import.meta.url)),
  "../.cache/prerender",
);
const PORT = 4173;
const ORIGIN = `http://127.0.0.1:${PORT}`;

// Must match STATIC_ROUTES in generateSitemap.js.
const ROUTES = [
  "/",
  "/about",
  "/flashes",
  "/prep-care",
  "/studio",
  "/painting",
  "/shop",
];

const MIME = {
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".xml": "application/xml",
  ".txt": "text/plain",
};

// The pristine built shell, read once before we start writing route files, so
// every route renders from the same starting point.
const SHELL = fs.readFileSync(path.join(distDir, "index.html"), "utf-8");

// Cache key: the built shell embeds the content-hashed bundle filename, so any
// change to src/**, index.html or i18n produces a different shell — and a
// flash-only edit produces an identical one.
const cacheKey = crypto.createHash("sha1").update(SHELL).digest("hex");

const outPath = (route) =>
  route === "/"
    ? path.join(distDir, "index.html")
    : path.join(distDir, route, "index.html");

function writeOut(route, html) {
  const p = outPath(route);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, html);
}

function tryReuseCache() {
  const keyFile = path.join(cacheDir, "key");
  if (!fs.existsSync(keyFile)) return false;
  if (fs.readFileSync(keyFile, "utf-8").trim() !== cacheKey) return false;
  for (const route of ROUTES) {
    const cached = path.join(cacheDir, "pages", route === "/" ? "index.html" : `${route.slice(1)}.html`);
    if (!fs.existsSync(cached)) return false;
  }
  for (const route of ROUTES) {
    const cached = path.join(cacheDir, "pages", route === "/" ? "index.html" : `${route.slice(1)}.html`);
    writeOut(route, fs.readFileSync(cached, "utf-8"));
  }
  return true;
}

function saveCache(pages) {
  const pagesDir = path.join(cacheDir, "pages");
  fs.rmSync(cacheDir, { recursive: true, force: true });
  fs.mkdirSync(pagesDir, { recursive: true });
  for (const [route, html] of Object.entries(pages)) {
    const name = route === "/" ? "index.html" : `${route.slice(1)}.html`;
    fs.writeFileSync(path.join(pagesDir, name), html);
  }
  fs.writeFileSync(path.join(cacheDir, "key"), cacheKey);
}

function startServer() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    const ext = path.extname(urlPath);
    if (ext && ext !== ".html") {
      const filePath = path.join(distDir, urlPath);
      if (filePath.startsWith(distDir) && fs.existsSync(filePath)) {
        res.setHeader("Content-Type", MIME[ext] || "application/octet-stream");
        return fs.createReadStream(filePath).pipe(res);
      }
      res.statusCode = 404;
      return res.end("Not found");
    }
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(SHELL);
  });
  return new Promise((resolve) =>
    server.listen(PORT, "127.0.0.1", () => resolve(server)),
  );
}

// Runs in the page: collapse the build-time default SEO tags and the ones the
// active route's <Seo> injected into a single set, drop duplicate JSON-LD, and
// mark the survivors data-default so the app's <Seo> effect cleans them on boot
// instead of stacking a second identical set.
function dedupeHead() {
  const head = document.head;
  head.querySelectorAll("[data-default]").forEach((el) => el.remove());

  const sel =
    'title, meta[name="description"], meta[name="robots"], link[rel="canonical"], meta[property^="og:"], meta[name^="twitter:"]';
  const keyOf = (el) =>
    el.tagName === "TITLE"
      ? "title"
      : el.tagName === "LINK"
        ? "canonical"
        : el.getAttribute("property") || el.getAttribute("name");

  const nodes = [...head.querySelectorAll(sel)];
  const seen = new Set();
  for (let i = nodes.length - 1; i >= 0; i--) {
    const k = keyOf(nodes[i]);
    if (k === "og:locale:alternate") continue;
    if (seen.has(k)) nodes[i].remove();
    else seen.add(k);
  }
  for (const el of head.querySelectorAll(sel)) {
    if (keyOf(el) !== "og:locale:alternate") el.setAttribute("data-default", "");
  }

  const ld = new Set();
  for (const s of head.querySelectorAll('script[type="application/ld+json"]')) {
    const t = s.textContent.trim();
    if (ld.has(t)) s.remove();
    else ld.add(t);
  }
}

async function renderRoute(browser, route) {
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on("request", (r) => {
    const u = r.url();
    if (
      u.includes("googletagmanager.com") ||
      u.includes("google-analytics.com") ||
      u.includes("analytics.google.com") ||
      u.includes("fonts.googleapis.com") ||
      u.includes("fonts.gstatic.com")
    ) {
      r.abort();
    } else {
      r.continue();
    }
  });

  // Skip the first-visit language splash; pin the baseline language to the
  // i18n fallbackLng (pt). The detector reads localStorage before navigator.
  await page.evaluateOnNewDocument(() => {
    try {
      localStorage.setItem("langChosen", "1");
      localStorage.setItem("i18nextLng", "pt");
    } catch (e) {
      void e;
    }
  });

  try {
    await page.goto(ORIGIN + route, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    // The app renders synchronously once mounted; every page has an <h1>.
    await page.waitForSelector("#root h1", { timeout: 15000 });
    await page.evaluate(dedupeHead);
    const html = await page.content();
    console.log(`prerendered ${route}`);
    return html;
  } finally {
    await page.close();
  }
}

async function run() {
  if (tryReuseCache()) {
    console.log("prerender: bundle unchanged — reused cached pages (no browser)");
    return;
  }

  const server = await startServer();
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const results = await Promise.allSettled(
      ROUTES.map((route) => renderRoute(browser, route)),
    );
    const pages = {};
    let failed = 0;
    results.forEach((res, i) => {
      if (res.status === "fulfilled") pages[ROUTES[i]] = res.value;
      else {
        failed++;
        console.error(`prerender FAILED for ${ROUTES[i]}:`, res.reason?.message);
      }
    });

    if (failed > 0) {
      process.exitCode = 1;
      return;
    }

    for (const [route, html] of Object.entries(pages)) writeOut(route, html);
    saveCache(pages);
    console.log("prerender: done");
  } finally {
    await browser.close();
    server.close();
  }
}

run();
