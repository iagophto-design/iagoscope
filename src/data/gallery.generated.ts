// Arquivo gerado por scripts/build-gallery.mjs — não edite à mão.
export type GalleryCategory = "Formatura" | "Estúdio" | "Esporte" | "Eventos";

export type GalleryPhoto = {
  src: string;
  alt: string;
  cat: GalleryCategory;
};

export const galleryPhotos: GalleryPhoto[] = [
  {
    "src": "/galeria/formatura/DSC_0542.JPG",
    "alt": "Formando de medicina com beca verde ao entardecer",
    "cat": "Formatura"
  },
  {
    "src": "/galeria/formatura/DSC_0750-2.JPG",
    "alt": "Bastidores: formanda calçando o salto",
    "cat": "Formatura"
  },
  {
    "src": "/galeria/formatura/DSC_0915-2.JPG",
    "alt": "Discurso no palco com luzes da plateia",
    "cat": "Formatura"
  },
  {
    "src": "/galeria/formatura/DSC_5421.JPG",
    "alt": "Detalhe: rosa branca e terço na mão da formanda",
    "cat": "Formatura"
  },
  {
    "src": "/galeria/formatura/DSC_6059-2.JPG",
    "alt": "Formanda comemorando sob cúpula de vidro",
    "cat": "Formatura"
  },
  {
    "src": "/galeria/formatura/DSC_6391.JPG",
    "alt": "Retrato de formanda de medicina com beca verde",
    "cat": "Formatura"
  },
  {
    "src": "/galeria/formatura/DSC_6444.JPG",
    "alt": "Formandos erguendo os capelos sob a cúpula",
    "cat": "Formatura"
  },
  {
    "src": "/galeria/formatura/DSC_6512.JPG",
    "alt": "Capelos lançados ao alto no palco da colação",
    "cat": "Formatura"
  },
  {
    "src": "/galeria/formatura/formatura-sentada-beca.png",
    "alt": "Formanda sentada na plateia com beca vermelha",
    "cat": "Formatura"
  },
  {
    "src": "/galeria/formatura/VAZ_8269_2-2.JPG",
    "alt": "Retrato de formanda com beca vermelha em estúdio",
    "cat": "Formatura"
  },
  {
    "src": "/galeria/estudio/DSC_4117-2.jpg",
    "alt": "Retrato em preto e branco com reflexo no vidro",
    "cat": "Estúdio"
  },
  {
    "src": "/galeria/estudio/estudio-cadeira.jpg",
    "alt": "Retrato masculino sentado na cadeira",
    "cat": "Estúdio"
  },
  {
    "src": "/galeria/estudio/estudio-estetoscopio.jpg",
    "alt": "Retrato com estetoscópio e braços cruzados",
    "cat": "Estúdio"
  },
  {
    "src": "/galeria/estudio/estudio-jaleco-azul.webp",
    "alt": "Retrato de jaleco com braços cruzados em fundo azul",
    "cat": "Estúdio"
  },
  {
    "src": "/galeria/estudio/estudio-luzes-fundo.webp",
    "alt": "Retrato de preto com luzes ao fundo",
    "cat": "Estúdio"
  },
  {
    "src": "/galeria/estudio/estudio-mao-cintura.jpg",
    "alt": "Retrato com mão na cintura em fundo cinza",
    "cat": "Estúdio"
  },
  {
    "src": "/galeria/estudio/estudio-olho-sombra.jpg",
    "alt": "Olho em close sob sombra dramática",
    "cat": "Estúdio"
  },
  {
    "src": "/galeria/estudio/estudio-pilha-cabecas.jpg",
    "alt": "Pilha de cabeças em preto e branco",
    "cat": "Estúdio"
  },
  {
    "src": "/galeria/estudio/IAG_1210.jpg",
    "alt": "Ensaio em preto e branco na poltrona de couro",
    "cat": "Estúdio"
  },
  {
    "src": "/galeria/estudio/IAG_1324.jpg",
    "alt": "Retrato de corpo inteiro em ambiente minimalista",
    "cat": "Estúdio"
  },
  {
    "src": "/galeria/esporte/Design_sem_nome.webp",
    "alt": "Sequência de nadador em prova de borboleta",
    "cat": "Esporte"
  },
  {
    "src": "/galeria/esporte/IMG_8130.jpg",
    "alt": "Saque de tênis visto através do alambrado",
    "cat": "Esporte"
  },
  {
    "src": "/galeria/esporte/IMG_8335.JPG",
    "alt": "Corredor na pista ao pôr do sol",
    "cat": "Esporte"
  },
  {
    "src": "/galeria/eventos/DSC_7043.jpg",
    "alt": "Casal posando em evento ao ar livre",
    "cat": "Eventos"
  },
  {
    "src": "/galeria/eventos/DSC_7141.webp",
    "alt": "Grupo de amigas posando em evento no deck",
    "cat": "Eventos"
  },
  {
    "src": "/galeria/eventos/evento-igreja.jpg",
    "alt": "Convidada sorrindo na igreja",
    "cat": "Eventos"
  },
  {
    "src": "/galeria/eventos/evento-pista-danca.jpg",
    "alt": "Duas amigas na pista de dança",
    "cat": "Eventos"
  },
  {
    "src": "/galeria/eventos/IMG_6798.JPG",
    "alt": "Retrato de festa com vestido de pérolas",
    "cat": "Eventos"
  }
];

export const gallerySite = {
  heroImage: "/galeria/formatura/DSC_6059-2.JPG",
  contatoImage: "/galeria/formatura/DSC_6512.JPG",
} as const;

export const galleryFilters: GalleryCategory[] = ["Formatura", "Estúdio", "Esporte", "Eventos"];
