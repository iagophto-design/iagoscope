/**
 * Baixa imagens do preview Lovable para public/ no mesmo path que o código usa.
 * Uso: bun scripts/sync-lovable-assets.mjs [baseUrl]
 * Default baseUrl: https://iagoscope.lovable.app
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const base = (process.argv[2] ?? "https://iagoscope.lovable.app").replace(/\/$/, "");
const assetsDir = join(import.meta.dirname, "..", "src", "assets");
const publicRoot = join(import.meta.dirname, "..", "public");

const files = (await readdir(assetsDir)).filter((f) => f.endsWith(".asset.json"));

let ok = 0;
let fail = 0;

for (const file of files) {
  const meta = JSON.parse(await readFile(join(assetsDir, file), "utf8"));
  const urlPath = meta.url;
  if (!urlPath?.startsWith("/")) {
    console.warn(`skip ${file}: url inesperada`);
    fail++;
    continue;
  }

  const dest = join(publicRoot, urlPath.replace(/^\//, ""));
  await mkdir(dirname(dest), { recursive: true });

  const src = `${base}${urlPath}`;
  const res = await fetch(src);
  if (!res.ok) {
    console.error(`FAIL ${res.status} ${src}`);
    fail++;
    continue;
  }

  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  console.log(`OK ${urlPath} (${buf.length} bytes)`);
  ok++;
}

console.log(`\n${ok} baixadas, ${fail} falhas`);
process.exit(fail > 0 ? 1 : 0);