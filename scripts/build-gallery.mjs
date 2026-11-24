/**
 * Lê public/galeria/{formatura,estudio,esporte,eventos}/ e gera src/data/gallery.generated.ts
 */
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join } from "node:path";

const root = join(import.meta.dirname, "..");
const galleryRoot = join(root, "public", "galeria");
const outFile = join(root, "src", "data", "gallery.generated.ts");

const FOLDER_TO_CATEGORY = {
  formatura: "Formatura",
  estudio: "Estúdio",
  esporte: "Esporte",
  eventos: "Eventos",
};

const IMAGE_EXT = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
]);

function humanizeAlt(filename) {
  const stem = basename(filename, extname(filename));
  return stem
    .replace(/^\d+[-_.\s]*/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function captionFor(dir, filename) {
  const stem = basename(filename, extname(filename));
  const captionPath = join(dir, `${stem}.txt`);
  try {
    const text = (await readFile(captionPath, "utf8")).trim();
    if (text) return text;
  } catch {
    /* optional */
  }
  return humanizeAlt(filename);
}

async function readSiteConfig() {
  const sitePath = join(galleryRoot, "site.json");
  try {
    const raw = await readFile(sitePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function collectPhotos() {
  const photos = [];

  for (const [folder, category] of Object.entries(FOLDER_TO_CATEGORY)) {
    const dir = join(galleryRoot, folder);
    let names;
    try {
      names = await readdir(dir);
    } catch {
      continue;
    }

    const images = [];
    for (const name of names) {
      if (!IMAGE_EXT.has(extname(name).toLowerCase())) continue;
      const full = join(dir, name);
      if (!(await stat(full)).isFile()) continue;
      const src = `/galeria/${folder}/${name}`;
      const alt = await captionFor(dir, name);
      images.push({ name, src, alt, cat: category });
    }

    images.sort((a, b) => a.name.localeCompare(b.name, "pt-BR", { numeric: true }));
    photos.push(...images);
  }

  return photos;
}

function resolveSitePath(site, photos, key, fallbackCategory) {
  const rel = site[key];
  if (typeof rel === "string" && rel.length > 0) {
    const normalized = rel.replace(/^\/+/, "").replace(/^galeria\//, "");
    const src = `/galeria/${normalized}`;
    if (photos.some((p) => p.src === src)) return src;
  }
  const fb = photos.find((p) => p.cat === fallbackCategory);
  return fb?.src ?? photos[0]?.src ?? "";
}

function emitTs(photos, site) {
  const hero = resolveSitePath(site, photos, "heroImage", "Formatura");
  const contato = resolveSitePath(site, photos, "contatoImage", "Formatura");

  const body = `// Arquivo gerado por scripts/build-gallery.mjs — não edite à mão.
export type GalleryCategory = "Formatura" | "Estúdio" | "Esporte" | "Eventos";

export type GalleryPhoto = {
  src: string;
  alt: string;
  cat: GalleryCategory;
};

export const galleryPhotos: GalleryPhoto[] = ${JSON.stringify(
    photos.map(({ src, alt, cat }) => ({ src, alt, cat })),
    null,
    2,
  )};

export const gallerySite = {
  heroImage: ${JSON.stringify(hero)},
  contatoImage: ${JSON.stringify(contato)},
} as const;

export const galleryFilters: GalleryCategory[] = ["Formatura", "Estúdio", "Esporte", "Eventos"];
`;

  return body;
}

const photos = await collectPhotos();
const site = await readSiteConfig();
await mkdir(dirname(outFile), { recursive: true });
await writeFile(outFile, emitTs(photos, site), "utf8");
console.log(`galeria: ${photos.length} fotos → ${outFile}`);