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

const watermarkText = ""; // texto da watermark
const watermarkFraction = 0.04; // tamanho proporcional da fonte
const thumbnailWidth = 200; // largura do thumbnail

// Languages generated from the Portuguese source. To add another one, just
// add its code here (must be a code translatte's languages.js recognizes).
const TARGET_LANGS = ["en", "es"];

// Matches the base path used by vite.config.ts, so image URLs in
// flashes.json resolve correctly whether built locally or on GitHub Pages.
const base = process.env.GITHUB_ACTIONS ? "/fufutattoo" : "";

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
  const material = JSON.stringify([
    data.name ?? "",
    data.tags ?? [],
    data.description ?? "",
  ]);
  return crypto.createHash("sha1").update(material).digest("hex").slice(0, 16);
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
    // the flash editor) while everything else — including tags — still
    // translates and re-caches normally.
    const name = existing?.name_locked
      ? existing.name
      : await translateText(data.name, lang);

    const tags = [];
    for (const tag of data.tags ?? []) {
      tags.push(await translateText(tag, lang));
    }

    const description = data.description
      ? existing?.description_locked
        ? existing.description
        : await translateText(data.description, lang)
      : undefined;

    translations[lang] = {
      name,
      tags,
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

function localizedTags(data) {
  return (data.tags ?? []).map((tag, i) => {
    const out = { pt: tag.toLowerCase() };
    for (const lang of TARGET_LANGS) {
      out[lang] = (data.translations?.[lang]?.tags?.[i] ?? tag).toLowerCase();
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

  const flashFolders = fs
    .readdirSync(flashesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory());

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
        tags: localizedTags(data),
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
