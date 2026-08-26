import fs from "fs";
import path from "path";
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

      let data = {};

      if (yamlFile) {
        const yamlText = fs.readFileSync(
          path.join(folderPath, yamlFile),
          "utf-8",
        );
        data = yaml.load(yamlText);
      }

      let newTags = [];

      for (const tag of data.tags) {
        let newTag = {
          pt: tag.toLowerCase(),
        };

        let translated = newTag.pt;

        try {
          translated = await translatte(tag, { from: "pt", to: "en" });
          translated = translated.text;
        } catch (e) {
          console.log(e);
        }
        const text = translated.toLowerCase();
        newTag.en = text;

        newTags.push(newTag);
      }

      data.tags = newTags;

      const nameStruct = {
        pt: data.name,
      };

      try {
        const nameEn = await translatte(data.name, { from: "pt", to: "en" });
        nameStruct.en = nameEn.text;
      } catch (e) {}

      data.name = nameStruct;

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
          original: `/flashes/${folder.name}/${img}`,
          watermarked: `/flashes_processed/${folder.name}/${img}`,
          thumbnail: `/flashes_processed/${folder.name}/thumb_${img}`,
        });
      }

      flashes[folder.name] = {
        ...data,
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
