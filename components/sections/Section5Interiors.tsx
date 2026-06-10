"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { INTERIORS } from "@/lib/constants";
import { gsap } from "@/lib/gsap";

/*
  TODO: заменить градиентные плейсхолдеры на реальные фотографии интерьеров
  (/public/assets/interiors/*.jpg) — тёмные, тёплые, без водяных знаков.
*/
const PLACEHOLDER_BACKDROPS = [
  "radial-gradient(120% 90% at 70% 20%, #3a332a 0%, #1c1813 45%, #0e0d0b 100%)",
  "radial-gradient(110% 100% at 30% 80%, #2e2c24 0%, #181610 50%, #0e0d0b 100%)",
  "radial-gradient(130% 110% at 50% 0%, #33291c 0%, #1a1510 48%, #0e0d0b 100%)",
];

export default function Section5Interiors() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      gsap.utils.toArray<HTMLElement>(".interior-slide").forEach((slide) => {
        /* кадр раскрывается из «рамки» по мере скролла */
        gsap.fromTo(
          slide,
          { clipPath: "inset(16% 9% 16% 9%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: slide,
              start: "top 85%",
              end: "top 18%",
              scrub: true,
            },
          },
        );

        /* медленный кен-бёрнс внутреннего слоя */
        const media = slide.querySelector(".interior-media");
        if (media) {
          gsap.fromTo(
            media,
            { scale: 1.18 },
            {
              scale: 1.02,
              ease: "none",
              scrollTrigger: {
                trigger: slide,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="interiors" className="bg-ink section-pad">
      <div className="container-luxe">
        <SectionHeading kicker={INTERIORS.kicker} title={INTERIORS.title} />
      </div>

      <div className="mt-16 flex flex-col gap-10 lg:gap-16">
        {INTERIORS.slides.map((slide, index) => (
          <figure
            key={slide.id}
            className="interior-slide relative flex min-h-[88svh] items-end overflow-hidden will-change-[clip-path]"
          >
            <div
              className="interior-media absolute inset-0 will-change-transform"
              style={{ background: PLACEHOLDER_BACKDROPS[index % 3] }}
            />

            <p
              aria-hidden="true"
              className="absolute top-10 right-[6vw] font-display text-7xl text-bone/15 tabular-nums"
            >
              {String(index + 1).padStart(2, "0")}
            </p>

            <figcaption className="container-luxe relative z-10 pb-16">
              <Reveal as="p" className="kicker">
                {slide.title}
              </Reveal>
              <Reveal
                as="p"
                mode="block"
                delay={0.15}
                className="mt-3 max-w-100 text-sm text-stone"
              >
                {slide.text}
              </Reveal>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
