import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const iconsDirectory = path.join(root, "public", "icons");

const icons = [
  { source: "app-icon.svg", output: "app-icon-192.png", size: 192 },
  { source: "app-icon.svg", output: "app-icon-512.png", size: 512 },
  { source: "apple-touch-icon.svg", output: "apple-touch-icon.png", size: 180 },
];

await mkdir(iconsDirectory, { recursive: true });

await Promise.all(
  icons.map(({ source, output, size }) =>
    sharp(path.join(iconsDirectory, source))
      .resize(size, size)
      .png()
      .toFile(path.join(iconsDirectory, output)),
  ),
);

console.log(`Icônes PWA générées dans ${path.relative(root, iconsDirectory)}`);
