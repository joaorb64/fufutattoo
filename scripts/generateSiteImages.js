import fs from "fs";
import path from "path";
import sharp from "sharp";

const sourceDir = path.resolve("images");
const outputDir = path.resolve("src/assets/images");

// Hero photos get more headroom (displayed large); decorative illustrations
// are shown small, so they can be shrunk much further.
const heroPhotos = new Set(["mainpage", "aboutme"]);

fs.mkdirSync(outputDir, { recursive: true });

const files = fs
  .readdirSync(sourceDir)
  .filter((f) => /\.(jpe?g|png)$/i.test(f));

for (const file of files) {
  const name = path.parse(file).name;
  const inputPath = path.join(sourceDir, file);
  const outputPath = path.join(outputDir, `${name}.webp`);
  const isHero = heroPhotos.has(name);

  await sharp(inputPath)
    .resize({ width: isHero ? 1400 : 700, withoutEnlargement: true })
    .webp({ quality: isHero ? 82 : 85 })
    .toFile(outputPath);

  console.log(`${file} -> src/assets/images/${name}.webp`);
}
