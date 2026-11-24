import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  galleryFilters,
  galleryPhotos,
  gallerySite,
  type GalleryCategory,
  type GalleryPhoto,
} from "@/data/gallery.generated";

const WHATSAPP = "https://wa.me/5541997956828";
const INSTAGRAM = "https://instagram.com/iagoscope";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "In The Act Prod — Fotografia que acontece" },
      { name: "description", content: "Fotografia de formatura, esporte, ensaios e eventos." },
      { property: "og:title", content: "In The Act Prod — Fotografia que acontece" },
      { property: "og:description", content: "Fotografia de formatura, esporte, ensaios e eventos." },
      { name: "twitter:title", content: "In The Act Prod — Fotografia que acontece" },
      { name: "twitter:description", content: "Fotografia de formatura, esporte, ensaios e eventos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const photos = galleryPhotos;
const mono = "font-mono uppercase tracking-[0.12em]";

function plan(rs: number[], W: number, g: number, m: boolean): [number, number][] {
  const n = rs.length;
  const T = m ? [0.75 * W, 0.55 * W] : [0.48 * W, 0.36 * W];
  const pre = [0];
  rs.forEach((r) => pre.push(pre[pre.length - 1]! + r));
  const ht = (i: number, j: number) => (W - (j - i - 1) * g) / (pre[j]! - pre[i]!);
  const dp = Array.from({ length: n + 1 }, () => [Infinity, Infinity]);
  const bk = Array.from({ length: n + 1 }, () => [0, 0]);
  dp[0]![1] = 0;
  for (let j = 1; j <= n; j++)
    for (let p = 0; p < 2; p++)
      for (let i = Math.max(0, j - 6); i < j; i++) {
        const c = dp[i]![1 - p]! + ((ht(i, j) - T[p]!) / T[p]!) ** 2;
        if (c < dp[j]![p]!) {
          dp[j]![p] = c;
          bk[j]![p] = i;
        }
      }
  let p = dp[n]![0]! <= dp[n]![1]! ? 0 : 1;
  let j = n;
  const rows: [number, number][] = [];
  while (j > 0) {
    const i = bk[j]![p]!;
    rows.unshift([i, j]);
    j = i;
    p = 1 - p;
  }
  return rows;
}

function buildRows(items: GalleryPhoto[], ratios: Record<string, number>, W: number, g: number, m: boolean) {
  const rs = items.map((p) => ratios[p.src] ?? 1.5);
  const pre = [0];
  rs.forEach((r) => pre.push(pre[pre.length - 1]! + r));
  return plan(rs, W, g, m).map(([i, j]) => ({
    items: items.slice(i, j),
    height: (W - (j - i - 1) * g) / (pre[j]! - pre[i]!),
  }));
}

function Index() {
  const [active, setActive] = useState<GalleryCategory>("Formatura");
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const [width, setWidth] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [parallax, setParallax] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [fine, setFine] = useState(false);

  const hero = gallerySite.heroImage;
  const heroAlt =
    photos.find((p) => p.src === hero)?.alt ?? "Destaque do portfólio";
  const contato = gallerySite.contatoImage;
  const contatoAlt =
    photos.find((p) => p.src === contato)?.alt ?? "Destaque de formatura";

  const visible = photos.filter((p) => p.cat === active);
  const [mobile, setMobile] = useState(false);
  const gap = mobile ? 8 : 13;
  const rows = width ? buildRows(visible, ratios, width, gap, mobile) : [];

  useEffect(() => {
    photos.forEach((p) => {
      const img = new Image();
      img.onload = () =>
        setRatios((r) => ({ ...r, [p.src]: img.naturalWidth / img.naturalHeight }));
      img.src = p.src;
    });
    setFine(window.matchMedia("(pointer: fine)").matches);
    const onResize = () => setMobile(window.innerWidth < 700);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useLayoutEffect(() => {
    const el = galleryRef.current;
    if (!el) return;
    const ro = new ResizeObserver((es) => setWidth(es[0]?.contentRect.width ?? 0));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let last = window.scrollY;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      setHidden(y > last && y > 120);
      last = y;
      if (!reduce) setParallax(Math.min(y, 800) * 0.15);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!fine) return;
    const onMove = (e: MouseEvent) => {
      if (cursorRef.current)
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [fine]);

  return (
    <div className={`min-h-screen bg-ink text-bone antialiased ${fine ? "md:cursor-none" : ""}`}>
      {fine && (
        <div
          ref={cursorRef}
          className="pointer-events-none fixed left-0 top-0 z-[60] hidden md:block"
          aria-hidden
        >
          <div className="h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold" />
        </div>
      )}

      <header
        className={`fixed top-0 z-40 w-full transition-all duration-300 ${
          hidden ? "-translate-y-full" : ""
        } ${scrolled ? "border-b border-bone/10 bg-ink" : "bg-transparent"}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <span className="font-display text-[15px] font-extrabold uppercase">Iago Medeiros</span>
          <nav className="flex items-center gap-4 md:gap-6">
            <a href="#portfolio" className={`${mono} text-[11px] hover:text-gold`}>
              Portfólio
            </a>
            <a href="#sobre" className={`${mono} text-[11px] hover:text-gold`}>
              Sobre
            </a>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className={`${mono} rounded-[2px] bg-gold px-3 py-2 text-[11px] font-semibold text-ink hover:opacity-90`}
            >
              Fale comigo
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-5 pt-28 md:px-8 md:pt-32">
          <h1
            className="rise text-center font-display font-black uppercase"
            style={{ fontSize: "clamp(38px, 9.6vw, 160px)", lineHeight: 0.94, letterSpacing: "-.02em" }}
          >
            <span className="block text-bone">In The Act</span>
            <span className="block text-gold">Prod</span>
          </h1>

          <div
            className="rise relative mt-8 aspect-[4/5] overflow-hidden border border-bone/12 md:mt-12 md:aspect-[21/10]"
            style={{ animationDelay: "0.15s" }}
          >
            {hero ? (
              <img
                src={hero}
                alt={heroAlt}
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  objectPosition: "center 34%",
                  transform: `translateY(${parallax}px) scale(1.1)`,
                }}
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
            <span
              className={`${mono} absolute left-3 top-3 border border-bone/18 bg-ink/80 px-[13px] py-[10px] text-[11px] md:left-5 md:top-5`}
            >
              // Formatura, esporte e eventos
            </span>
            <span
              className={`${mono} absolute right-5 top-5 hidden border border-bone/18 bg-ink/80 px-[13px] py-[10px] text-[11px] md:block`}
            >
              Fotografia que não posa: acontece.
            </span>
          </div>
        </section>

        <section id="portfolio" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-16 md:px-8 md:py-24">
          <div className="mb-8 flex flex-wrap gap-2">
            {galleryFilters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`${mono} rounded-[2px] border px-3 py-2 text-[11px] transition ${
                  active === f
                    ? "border-gold bg-gold font-semibold text-ink"
                    : "border-bone/15 text-bone/70 hover:border-bone/40 hover:text-bone"
                }`}
              >
                {f} [{photos.filter((p) => p.cat === f).length}]
              </button>
            ))}
          </div>

          <div ref={galleryRef} className="flex flex-col" style={{ gap }}>
            {rows.map((row, r) => (
              <div
                key={active + r}
                className="rise flex"
                style={{ gap, height: `min(${row.height}px, 90vh)`, animationDelay: `${r * 0.08}s` }}
              >
                {row.items.map((p) => (
                  <div
                    key={p.src}
                    className={`group relative h-full overflow-hidden border border-transparent transition hover:border-gold ${fine ? "md:cursor-none" : ""}`}
                    style={{ flex: `${ratios[p.src] ?? 1.5} 1 0` }}
                  >
                    <img
                      src={p.src}
                      alt={p.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:brightness-50"
                    />
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-start gap-1 bg-gradient-to-t from-ink/90 to-transparent p-3 text-left opacity-0 transition duration-300 group-hover:opacity-100">
                      <span className="font-mono text-[12px] uppercase tracking-[0.06em]">
                        {p.alt}
                      </span>
                      <span className={`${mono} text-[10px] text-gold`}>{p.cat}</span>
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section id="sobre" className="scroll-mt-20 border-t border-bone/8">
          <p
            className="mx-auto max-w-6xl px-5 py-24 font-display font-bold uppercase text-bone md:px-8 md:py-40"
            style={{ fontSize: "clamp(20px, 3.5vw, 52px)", lineHeight: 1.15 }}
          >
            Do bastidor tenso antes da colação ao último metro de uma prova, meu foco é{" "}
            <span className="text-gold">o instante que não se repete.</span>
          </p>
        </section>

        <section id="contato" className="bg-gold text-ink">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-[1.25fr_.75fr] md:px-8 md:py-24">
            <div>
              <h2
                className="font-display font-black uppercase"
                style={{ fontSize: "clamp(22px, 3.7vw, 56px)", lineHeight: 1 }}
              >
                Seu momento acontece uma vez.
                <span className="block text-ink/60">Vamos registrar?</span>
              </h2>
              <p className={`${mono} mt-6 text-[13px]`}>
                Fale comigo no WhatsApp e conte sobre o seu evento.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[2px] bg-ink px-5 py-4 font-display text-[12px] font-bold uppercase text-gold hover:opacity-90"
                >
                  Chamar no WhatsApp
                </a>
                <a
                  href={INSTAGRAM}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[2px] border border-ink px-5 py-4 font-display text-[12px] font-bold uppercase hover:bg-ink hover:text-gold"
                >
                  Ver Instagram
                </a>
              </div>
            </div>
            <figure className="bg-ink p-2">
              {contato ? (
                <img
                  src={contato}
                  alt={contatoAlt}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover md:aspect-[4/5]"
                />
              ) : null}
              <figcaption className={`${mono} px-1 pt-2 text-[11px] text-gold`}>
                // Formatura
              </figcaption>
            </figure>
          </div>
        </section>
      </main>

      <footer className={`${mono} border-t border-bone/8 bg-ink px-5 py-8 text-center text-[11px] text-dim`}>
        © Iago Medeiros. Todos os direitos reservados.
      </footer>

    </div>
  );
}