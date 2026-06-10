"use client";

import { useGSAP } from "@gsap/react";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { PROJECT } from "@/lib/constants";
import { EASE_LUXE, gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { scrollStore, useAppStore } from "@/lib/stores";

const HeroCanvas = dynamic(() => import("@/components/three/HeroCanvas"), {
  ssr: false,
});

/* Подписи стадий стройки по порогам прогресса */
const STAGES: Array<[number, string]> = [
  [0.12, "Фундамент"],
  [0.7, "Монолитный каркас"],
  [0.88, "Фасад"],
  [Infinity, "Дом готов"],
];

export default function Section1Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<gsap.core.Timeline | null>(null);
  const phase = useAppStore((state) => state.phase);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduced) {
        /* без пина и стройки — сразу готовый дом */
        scrollStore.setState({ heroProgress: 1 });
        return;
      }

      const stageEl = section.querySelector<HTMLElement>(".hero-stage");
      const hintEl = section.querySelector<HTMLElement>(".hero-hint");
      let currentStage = "";

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          scrollStore.setState({ heroProgress: self.progress });

          if (stageEl) {
            const stage =
              STAGES.find(([limit]) => self.progress < limit)?.[1] ?? "";
            if (stage !== currentStage) {
              currentStage = stage;
              stageEl.textContent = stage;
            }
          }
          if (hintEl) {
            hintEl.style.opacity = String(
              Math.max(0, 1 - self.progress * 10),
            );
          }
        },
      });

      /* интро после прелоадера: канвас проявляется, заголовок — построчно */
      gsap.set(".hero-canvas-wrap", { autoAlpha: 0 });
      gsap.set(".hero-meta", { autoAlpha: 0, y: 26 });

      const split = SplitText.create(".hero-title", {
        type: "lines",
        mask: "lines",
      });

      introRef.current = gsap
        .timeline({ paused: true, defaults: { ease: EASE_LUXE } })
        .to(".hero-canvas-wrap", { autoAlpha: 1, duration: 1.8 }, 0)
        .from(split.lines, { yPercent: 115, duration: 1.25 }, 0.3)
        .to(
          ".hero-meta",
          { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.12 },
          0.7,
        );
    },
    { scope: sectionRef },
  );

  useEffect(() => {
    if (phase !== "loading") introRef.current?.play();
  }, [phase]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-svh overflow-hidden"
    >
      {/* процедурная 3D-стройка (постер-fallback на слабых устройствах) */}
      <div className="hero-canvas-wrap absolute inset-0">
        <HeroCanvas />
      </div>

      {/* градиент для читаемости текста поверх сцены */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42svh] bg-gradient-to-t from-ink/90 to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-end">
        <div className="container-luxe pb-[9vh]">
          <p className="hero-meta kicker">{PROJECT.kicker}</p>
          <h1 className="hero-title display-hero mt-6">{PROJECT.name}</h1>
          <div className="hero-meta mt-10 flex flex-wrap items-end justify-between gap-8 hairline-t pt-8">
            <p className="max-w-130 text-stone">{PROJECT.tagline}</p>
            <div className="flex items-baseline gap-10">
              <p className="hero-stage kicker">Фундамент</p>
              <p className="hero-hint kicker text-stone">
                Листайте — дом строится
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
