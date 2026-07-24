import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const projectRoot = path.resolve(import.meta.dirname, "..");
const resRoot = path.join(projectRoot, "android/app/src/main/res");
const whiteMark = path.join(projectRoot, "public/Standard Playbook ICON WHITE.png");
const blackMark = path.join(projectRoot, "public/Standard Playbook ICON BLACK (1).png");

const launcherSizes = {
  ldpi: 36,
  mdpi: 48,
  hdpi: 72,
  xhdpi: 96,
  xxhdpi: 144,
  xxxhdpi: 192,
};

const adaptiveSizes = {
  ldpi: 81,
  mdpi: 108,
  hdpi: 162,
  xhdpi: 216,
  xxhdpi: 324,
  xxxhdpi: 432,
};

async function renderMark({ source, destination, width, height, background, scale = 1 }) {
  const markSize = Math.round(Math.min(width, height) * scale);
  const mark = await sharp(source)
    .resize(markSize, markSize, { fit: "contain" })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background,
    },
  })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(destination);
}

for (const [density, size] of Object.entries(launcherSizes)) {
  const directory = path.join(resRoot, `mipmap-${density}`);

  await renderMark({
    source: whiteMark,
    destination: path.join(directory, "ic_launcher.png"),
    width: size,
    height: size,
    background: "#000000",
  });

  await renderMark({
    source: whiteMark,
    destination: path.join(directory, "ic_launcher_round.png"),
    width: size,
    height: size,
    background: "#000000",
    scale: 0.88,
  });

  const adaptiveSize = adaptiveSizes[density];
  await renderMark({
    source: whiteMark,
    destination: path.join(directory, "ic_launcher_foreground.png"),
    width: adaptiveSize,
    height: adaptiveSize,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });

  await sharp({
    create: {
      width: adaptiveSize,
      height: adaptiveSize,
      channels: 4,
      background: "#000000",
    },
  })
    .png()
    .toFile(path.join(directory, "ic_launcher_background.png"));
}

async function findSplashFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findSplashFiles(entryPath)));
    } else if (entry.name === "splash.png") {
      files.push(entryPath);
    }
  }

  return files;
}

for (const splashPath of await findSplashFiles(resRoot)) {
  const metadata = await sharp(splashPath).metadata();
  const darkMode = splashPath.includes("night");

  await renderMark({
    source: darkMode ? whiteMark : blackMark,
    destination: splashPath,
    width: metadata.width,
    height: metadata.height,
    background: darkMode ? "#111111" : "#F7F5F1",
    scale: 0.44,
  });
}

await renderMark({
  source: whiteMark,
  destination: path.join(projectRoot, "resources/icon.png"),
  width: 1024,
  height: 1024,
  background: "#000000",
});

console.log("Generated Standard Playbook Android launcher and splash assets.");
