"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import ResidenceCard from "@/components/ui/ResidenceCard";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { RESIDENCES } from "@/lib/constants";
import { gsap } from "@/lib/gsap";

/*
  Десктоп: pinned-секция, лента карточек едет горизонтально по скроллу.
  Мобайл / reduced-motion: нативная горизонтальная лента со snap.
*/
export default function Section4Residences() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const distance = () =>
            Math.max(track.scrollWidth - window.innerWidth, 0);

          const progressEl =
            section.querySelector<HTMLElement>(".res-progress");
          const setProgress = progressEl
            ? gsap.quickSetter(progressEl, "scaleX")
            : null;

          gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${distance()}`,
              pin: true,
              scrub: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => setProgress?.(self.progress),
            },
          });
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="residences"
      className="overflow-hidden bg-ink max-lg:section-pad lg:flex lg:h-svh lg:flex-col lg:justify-center"
    >
      <div className="container-luxe">
        <Reveal mode="block">
          <SectionHeading kicker={RESIDENCES.kicker} title={RESIDENCES.title} />
        </Reveal>
      </div>

      <div className="mt-14 snap-x snap-mandatory overflow-x-auto pb-4 lg:mt-16 lg:snap-none lg:overflow-visible lg:pb-0">
        <div
          ref={trackRef}
          className="flex w-max gap-6 px-[clamp(1.5rem,7vw,6rem)]"
        >
          {RESIDENCES.items.map((residence, index) => (
            <div
              key={residence.id}
              className="w-[min(82vw,420px)] shrink-0 snap-start"
            >
              <ResidenceCard residence={residence} index={index} />
            </div>
          ))}
        </div>
      </div>

      {/* индикатор прогресса ленты */}
      <div className="container-luxe mt-12 hidden lg:block">
        <div className="h-px w-full bg-line">
          <div className="res-progress h-px w-full origin-left scale-x-0 bg-brass" />
        </div>
      </div>
    </section>
  );
}
