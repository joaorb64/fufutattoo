import fs from "fs";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";
import yaml from "js-yaml";
import translatte from "translatte";

// Config
const flashesDir = path.resolve("public/flashes");
const outputFile = path.resolve("public/flashes.json");
const outputImagesDir = path.resolve("public/flashes_processed");
const tagsDictFile = path.resolve("public/flashes/tags.yaml");

const watermarkText = ""; // texto da watermark
const watermarkFraction = 0.04; // tamanho proporcional da fonte
const thumbnailWidth = 200; // largura do thumbnail

// Languages generated from the Portuguese source. To add another one, just
// add its code here (must be a code translatte's languages.js recognizes).
const TARGET_LANGS = ["en", "es"];

// Matches the base path used by vite.config.ts. The site is served from the
// root of the custom domain (fufuart.com), so there is no path prefix.
const base = "";

if (!fs.existsSync(outputImagesDir)) fs.mkdirSync(outputImagesDir);

function createTextSVG(width, height, text, fontSize) {
  return Buffer.from(`
    <svg width="${width}" height="${height}">
      <style>
        .title { fill: rgba(255,255,255,0.5); font-size: ${fontSize}px; font-family: Arial, sans-serif; text-anchor: middle; dominant-baseline: middle;}
      </style>
      <text x="50%" y="50%" class="title">${text}</text>
    </svg>
  `);
}

async function processImageWithTextWatermark(inputPath, outputPath) {
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const fontSize = Math.round(metadata.width * watermarkFraction);
  const svgBuffer = createTextSVG(
    metadata.width,
    metadata.height,
    watermarkText,
    fontSize,
  );

  await image
    .composite([{ input: svgBuffer, gravity: "center" }])
    .toFile(outputPath);
}

async function createThumbnail(inputPath, outputPath, width = thumbnailWidth) {
  await sharp(inputPath).resize({ width }).toFile(outputPath);
}

// --- Translation caching ---------------------------------------------------
//
// Source `data.yaml` files hold plain Portuguese text only. Machine
// translations for each TARGET_LANGS entry are cached back into the same
// file under `translations.<lang>`, gated by a hash of the Portuguese
// content: as long as the hash still matches, we reuse the cached text
// instead of calling translatte again. This means editing a flash's price
// or images doesn't retranslate anything, and editing the name/tags/
// description only retranslates the languages affected.
//
// To hand-correct a bad translation, edit `translations.<lang>.name` (or
// `.tags`/`.description`) directly in the yaml and add `locked: true` to
// that language block — a locked block is never touched by this script
// again, no matter what changes on the Portuguese side.

function sourceHash(data) {
  // Tags aren't included: their translations live in tags.yaml, not in the
  // per-flash cache.
  const material = JSON.stringify([data.name ?? "", data.description ?? ""]);
  return crypto.createHash("sha1").update(material).digest("hex").slice(0, 16);
}

// --- Tag dictionary ------------------------------------------------------
//
// `public/flashes/tags.yaml` maps each Portuguese tag to the list of words
// shown as filter chips per language. Tags a flash uses but that are missing
// from the file are added automatically with a machine translation so they
// can be refined later (in the flash editor or by hand).

function loadTagsDict() {
  try {
    return yaml.load(fs.readFileSync(tagsDictFile, "utf-8")) || {};
  } catch {
    return {};
  }
}

const TAGS_HEADER = `# Shared tag vocabulary.
#
# Each key is a Portuguese tag (lowercase, as typed in the flash editor).
# \`en\` / \`es\` are the lists of words shown as filter chips in that language
# — list more than one and each becomes its own chip that filters the same
# flashes (e.g. "rato" shows as both "rat" and "mouse" in English).
#
# New tags used by a flash but missing here are auto-added on the next build
# with a machine translation as a starting point; refine them afterwards.

`;

function saveTagsDict(dict) {
  const sorted = {};
  for (const key of Object.keys(dict).sort()) sorted[key] = dict[key];
  const body = yaml.dump(sorted, { lineWidth: -1, flowLevel: 2 });
  fs.writeFileSync(tagsDictFile, TAGS_HEADER + body);
}

async function ensureTagsInDict(dict, tags) {
  let changed = false;
  for (const raw of tags) {
    const key = String(raw).toLowerCase();
    if (dict[key]) continue;
    dict[key] = {};
    for (const lang of TARGET_LANGS) {
      dict[key][lang] = [(await translateText(key, lang)).toLowerCase()];
    }
    changed = true;
  }
  return changed;
}

function tagChips(dict, lang, key) {
  const entry = dict[key];
  const list = entry && entry[lang];
  const arr = Array.isArray(list) ? list : list ? [list] : [];
  const cleaned = arr.map((s) => String(s).toLowerCase()).filter(Boolean);
  return cleaned.length ? cleaned : [key];
}

async function translateText(text, lang) {
  try {
    const result = await translatte(text, { from: "pt", to: lang });
    return result.text;
  } catch (e) {
    console.log(e);
    return text; // fall back to the Portuguese source rather than leaving it blank
  }
}

async function translateFlash(data) {
  const hash = sourceHash(data);
  const translations = data.translations || {};

  for (const lang of TARGET_LANGS) {
    const existing = translations[lang];
    if (existing?.locked) continue; // whole-block manual override — never touch
    if (existing?._sourceHash === hash) continue; // cache hit — nothing to do

    // `name_locked`/`description_locked` pin just that one field (e.g. set by
    // the flash editor). Tags are not translated here — see tags.yaml.
    const name = existing?.name_locked
      ? existing.name
      : await translateText(data.name, lang);

    const description = data.description
      ? existing?.description_locked
        ? existing.description
        : await translateText(data.description, lang)
      : undefined;

    translations[lang] = {
      name,
      ...(description ? { description } : {}),
      ...(existing?.name_locked ? { name_locked: true } : {}),
      ...(existing?.description_locked ? { description_locked: true } : {}),
      _sourceHash: hash,
    };
  }

  data.translations = translations;
  return data;
}

function localizedName(data) {
  const out = { pt: data.name };
  for (const lang of TARGET_LANGS) {
    out[lang] = data.translations?.[lang]?.name ?? data.name;
  }
  return out;
}

function localizedTags(data, dict) {
  return (data.tags ?? []).map((tag) => {
    const key = String(tag).toLowerCase();
    const out = { pt: key };
    for (const lang of TARGET_LANGS) {
      out[lang] = tagChips(dict, lang, key);
    }
    return out;
  });
}

function localizedDescription(data) {
  if (!data.description) return undefined;
  const out = { pt: data.description };
  for (const lang of TARGET_LANGS) {
    out[lang] = data.translations?.[lang]?.description ?? data.description;
  }
  return out;
}

async function generateFlashesJson() {
  console.log(
    `[${new Date().toLocaleTimeString()}] Gerando flashes.json e imagens...`,
  );
  const flashes = {};
  const tagsDict = loadTagsDict();

  const flashFolders = fs
    .readdirSync(flashesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory());

  // Register any tag that isn't in tags.yaml yet, so a machine translation
  // is available as a starting point and the editor can list it.
  const allTags = new Set();
  for (const folder of flashFolders) {
    const yamlPath = path.join(flashesDir, folder.name, "data.yaml");
    try {
      for (const tag of yaml.load(fs.readFileSync(yamlPath, "utf-8"))?.tags ?? [])
        allTags.add(String(tag).toLowerCase());
    } catch {
      // no readable data.yaml in this folder
    }
  }
  if (await ensureTagsInDict(tagsDict, [...allTags])) saveTagsDict(tagsDict);

  for (const folder of flashFolders) {
    try {
      const folderPath = path.join(flashesDir, folder.name);
      const files = fs.readdirSync(folderPath);

      const yamlFile = files.find((f) => f.endsWith(".yaml"));
      if (!yamlFile) continue;

      const yamlPath = path.join(folderPath, yamlFile);
      const originalYamlText = fs.readFileSync(yamlPath, "utf-8");
      const data = yaml.load(originalYamlText) || {};

      await translateFlash(data);

      // Only touch the file on disk if the cache actually changed something
      // (avoids re-triggering --watch on our own write for no reason).
      const newYamlText = yaml.dump(data);
      if (newYamlText !== originalYamlText) {
        fs.writeFileSync(yamlPath, newYamlText);
      }

      const images = files.filter((f) => /\.(jpe?g|png)$/i.test(f));
      const processedFolder = path.join(outputImagesDir, folder.name);
      if (!fs.existsSync(processedFolder))
        fs.mkdirSync(processedFolder, { recursive: true });

      const imageData = [];

      for (const img of images) {
        const inputImagePath = path.join(folderPath, img);
        const watermarkedPath = path.join(processedFolder, img);
        const thumbPath = path.join(processedFolder, `thumb_${img}`);

        await processImageWithTextWatermark(inputImagePath, watermarkedPath);
        await createThumbnail(watermarkedPath, thumbPath);

        imageData.push({
          original: `${base}/flashes/${folder.name}/${img}`,
          watermarked: `${base}/flashes_processed/${folder.name}/${img}`,
          thumbnail: `${base}/flashes_processed/${folder.name}/thumb_${img}`,
        });
      }

      flashes[folder.name] = {
        name: localizedName(data),
        tags: localizedTags(data, tagsDict),
        description: localizedDescription(data),
        price: data.price,
        size_min: data.size_min,
        size_max: data.size_max,
        size_recommended: data.size_recommended,
        images: imageData,
      };

      fs.writeFileSync(outputFile, JSON.stringify(flashes, null, 2));
    } catch (e) {
      console.log(e);
    }
  }

  // Drop processed-image folders left behind by flashes that no longer exist.
  const liveFolders = new Set(flashFolders.map((f) => f.name));
  for (const dir of fs.existsSync(outputImagesDir)
    ? fs.readdirSync(outputImagesDir, { withFileTypes: true })
    : []) {
    if (dir.isDirectory() && !liveFolders.has(dir.name)) {
      fs.rmSync(path.join(outputImagesDir, dir.name), {
        recursive: true,
        force: true,
      });
      console.log(`Removido flashes_processed/${dir.name} (flash apagado)`);
    }
  }

  console.log(`[${new Date().toLocaleTimeString()}] flashes.json updated!`);
}

// --- Executa inicialmente ---
generateFlashesJson();

// --- Watch mode ---
if (process.argv.includes("--watch")) {
  console.log("Modo watch ativado. Observando alterações em public/flashes...");
  fs.watch(flashesDir, { recursive: true }, (eventType, filename) => {
    if (filename) {
      console.log(`Arquivo alterado: ${filename}`);
      generateFlashesJson();
    }
  });
}
