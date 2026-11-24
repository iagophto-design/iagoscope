/**
 * Uso único: copia imagens de public/__l5e para public/galeria com .txt de legenda.
 */
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";

const root = join(import.meta.dirname, "..");
const publicRoot = join(root, "public");

/** @type {{ file: string; url: string; cat: "formatura"|"estudio"|"esporte"|"eventos"; alt: string }[]} */
const seed = [
  { file: "VAZ_8269_2-2.JPG", url: "/__l5e/assets-v1/77683763-cf32-42c9-9834-332c3ec57903/VAZ_8269_2-2.JPG", cat: "formatura", alt: "Retrato de formanda com beca vermelha em estúdio" },
  { file: "DSC_6059-2.JPG", url: "/__l5e/assets-v1/6ae79dde-880a-4bcd-b3aa-b6315f47c58e/DSC_6059-2.JPG", cat: "formatura", alt: "Formanda comemorando sob cúpula de vidro" },
  { file: "DSC_0750-2.JPG", url: "/__l5e/assets-v1/7a3bbbd0-4851-45c7-b2b3-9d9aa214cd36/DSC_0750-2.JPG", cat: "formatura", alt: "Bastidores: formanda calçando o salto" },
  { file: "DSC_0915-2.JPG", url: "/__l5e/assets-v1/e78b4886-1ddb-4681-814f-74eca70fb8e3/DSC_0915-2.JPG", cat: "formatura", alt: "Discurso no palco com luzes da plateia" },
  { file: "DSC_6391.JPG", url: "/__l5e/assets-v1/113385b2-7814-4e7f-8ca9-20f858de28d2/DSC_6391.JPG", cat: "formatura", alt: "Retrato de formanda de medicina com beca verde" },
  { file: "DSC_6444.JPG", url: "/__l5e/assets-v1/36beead8-7a82-4ef1-b4c3-f82d8c2b7349/DSC_6444.JPG", cat: "formatura", alt: "Formandos erguendo os capelos sob a cúpula" },
  { file: "DSC_6512.JPG", url: "/__l5e/assets-v1/88f8a51c-da4d-4781-bab4-4365c316e2e5/DSC_6512.JPG", cat: "formatura", alt: "Capelos lançados ao alto no palco da colação" },
  { file: "DSC_0542.JPG", url: "/__l5e/assets-v1/f37e69a0-0d08-4d87-bae0-1820e8dcc912/DSC_0542.JPG", cat: "formatura", alt: "Formando de medicina com beca verde ao entardecer" },
  { file: "DSC_5421.JPG", url: "/__l5e/assets-v1/029ba7d9-03ab-4c08-b4db-b4e18a951433/DSC_5421.JPG", cat: "formatura", alt: "Detalhe: rosa branca e terço na mão da formanda" },
  { file: "formatura-sentada-beca.png", url: "/__l5e/assets-v1/7b197901-60df-4e7a-acbe-f3f9d72b8202/formatura-sentada-beca.png", cat: "formatura", alt: "Formanda sentada na plateia com beca vermelha" },
  { file: "IAG_1210.jpg", url: "/__l5e/assets-v1/1628a726-3387-4416-b7de-e0f8ab6827b1/IAG_1210.jpg", cat: "estudio", alt: "Ensaio em preto e branco na poltrona de couro" },
  { file: "IAG_1324.jpg", url: "/__l5e/assets-v1/7916481a-8f4e-4cc4-8fa7-2105d1503e31/IAG_1324.jpg", cat: "estudio", alt: "Retrato de corpo inteiro em ambiente minimalista" },
  { file: "DSC_4117-2.jpg", url: "/__l5e/assets-v1/56dc6472-8a87-4b28-9ba6-99d0b6e0e877/DSC_4117-2.jpg", cat: "estudio", alt: "Retrato em preto e branco com reflexo no vidro" },
  { file: "estudio-estetoscopio.jpg", url: "/__l5e/assets-v1/c6d3231f-d34f-4539-bafc-6bd5b12ddd91/estudio-estetoscopio.jpg", cat: "estudio", alt: "Retrato com estetoscópio e braços cruzados" },
  { file: "estudio-cadeira.jpg", url: "/__l5e/assets-v1/a31f9053-e688-4761-b3cf-f83e59609732/estudio-cadeira.jpg", cat: "estudio", alt: "Retrato masculino sentado na cadeira" },
  { file: "estudio-mao-cintura.jpg", url: "/__l5e/assets-v1/24b51cb6-5af4-4e0f-91f2-6eee1774702c/estudio-mao-cintura.jpg", cat: "estudio", alt: "Retrato com mão na cintura em fundo cinza" },
  { file: "estudio-pilha-cabecas.jpg", url: "/__l5e/assets-v1/f406366a-0e66-40ee-b67b-adbe1e7e5c03/estudio-pilha-cabecas.jpg", cat: "estudio", alt: "Pilha de cabeças em preto e branco" },
  { file: "estudio-olho-sombra.jpg", url: "/__l5e/assets-v1/695bea7c-68d6-49ed-bbde-7aacddddc545/estudio-olho-sombra.jpg", cat: "estudio", alt: "Olho em close sob sombra dramática" },
  { file: "estudio-luzes-fundo.webp", url: "/__l5e/assets-v1/6b5da106-25f2-49ec-8be4-e47c816d8227/estudio-luzes-fundo.webp", cat: "estudio", alt: "Retrato de preto com luzes ao fundo" },
  { file: "estudio-jaleco-azul.webp", url: "/__l5e/assets-v1/a53ee0d1-a077-4792-812c-9f4387dee793/estudio-jaleco-azul.webp", cat: "estudio", alt: "Retrato de jaleco com braços cruzados em fundo azul" },
  { file: "Design_sem_nome.webp", url: "/__l5e/assets-v1/adfb9970-331e-466d-92e3-4d929bedb3ff/Design_sem_nome.webp", cat: "esporte", alt: "Sequência de nadador em prova de borboleta" },
  { file: "IMG_8130.jpg", url: "/__l5e/assets-v1/67a83e8a-28f9-4541-b2e8-95611b72c545/IMG_8130.jpg", cat: "esporte", alt: "Saque de tênis visto através do alambrado" },
  { file: "IMG_8335.JPG", url: "/__l5e/assets-v1/71d3f569-59a2-45ad-baca-f2c5225a40cd/IMG_8335.JPG", cat: "esporte", alt: "Corredor na pista ao pôr do sol" },
  { file: "IMG_6798.JPG", url: "/__l5e/assets-v1/2597369a-f64c-43cf-b5d7-900f77724efb/IMG_6798.JPG", cat: "eventos", alt: "Retrato de festa com vestido de pérolas" },
  { file: "DSC_7043.jpg", url: "/__l5e/assets-v1/aec8e1e8-8ee9-4bcb-8582-b10cb85fc1aa/DSC_7043.jpg", cat: "eventos", alt: "Casal posando em evento ao ar livre" },
  { file: "DSC_7141.webp", url: "/__l5e/assets-v1/89250738-e1d8-449b-81fd-c395e2229bab/DSC_7141.webp", cat: "eventos", alt: "Grupo de amigas posando em evento no deck" },
  { file: "evento-igreja.jpg", url: "/__l5e/assets-v1/4f1be96c-6de6-4074-9c44-d370d08d5b59/evento-igreja.jpg", cat: "eventos", alt: "Convidada sorrindo na igreja" },
  { file: "evento-pista-danca.jpg", url: "/__l5e/assets-v1/72522e51-cfe8-4938-be29-cb6dce6f020d/evento-pista-danca.jpg", cat: "eventos", alt: "Duas amigas na pista de dança" },
];

for (const item of seed) {
  const dir = join(publicRoot, "galeria", item.cat);
  await mkdir(dir, { recursive: true });
  const dest = join(dir, item.file);
  const src = join(publicRoot, item.url.replace(/^\//, "").split("/").join("/"));
  await copyFile(src, dest);
  const stem = basename(item.file, extname(item.file));
  await writeFile(join(dir, `${stem}.txt`), `${item.alt}\n`, "utf8");
  console.log(`→ galeria/${item.cat}/${item.file}`);
}