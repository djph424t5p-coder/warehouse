"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useLenis } from "@/hooks/useLenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PROJECT } from "@/lib/constants";
import { useAppStore } from "@/lib/stores";

/* Минимальная длительность прелоадера — «уверенная», не суетливая */
const MIN_DURATION_MS = 2200;
/* Страховка, если сигнал готовности hero-сцены не пришёл */
const HERO_TIMEOUT_MS = 4000;

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const heroReadyPromise = () =>
  new Promise<void>((resolve) => {
    if (useAppStore.getState().heroReady) return resolve();
    const timeout = setTimeout(resolve, HERO_TIMEOUT_MS);
    const unsubscribe = useAppStore.subscribe((state) => {
      if (state.heroReady) {
        clearTimeout(timeout);
        unsubscribe();
        resolve();
      }
    });
  });

/*
  Прелоадер: счётчик 0→100, привязанный к реальной готовности
  (шрифты + первый кадр hero), затем занавес-reveal из двух панелей.
*/
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const phase = useAppStore((state) => state.phase);
  const lenis = useLenis();

  useGSAP(
    () => {
      if (useAppStore.getState().phase !== "loading") return;

      const counter = counterRef.current;
      if (!counter) return;

      document.body.style.overflow = "hidden";
      lenis?.stop();

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      let cancelled = false;
      const progress = { value: 0 };
      let target = 0;

      const render = () => {
        counter.textContent = String(Math.round(progress.value));
      };

      const bump = (add: number) => {
        if (cancelled) return;
        target = Math.min(target + add, 99);
        gsap.to(progress, {
          value: target,
          duration: 0.9,
          ease: "power2.out",
          overwrite: true,
          onUpdate: render,
        });
      };

      const finish = () => {
        if (cancelled) return;
        gsap.to(progress, {
          value: 100,
          duration: 0.5,
          ease: "power2.inOut",
          overwrite: true,
          onUpdate: render,
          onComplete: reveal,
        });
      };

      const reveal = () => {
        if (cancelled) return;
        window.scrollTo(0, 0);
        document.body.style.overflow = "";
        lenis?.start();
        useAppStore.getState().setPhase("revealing");

        if (reduced) {
          gsap.set(rootRef.current, { autoAlpha: 0 });
          useAppStore.getState().setPhase("ready");
          ScrollTrigger.refresh();
          return;
        }

        gsap
          .timeline({
            defaults: { ease: "power4.inOut" },
            onComplete: () => {
              useAppStore.getState().setPhase("ready");
              ScrollTrigger.refresh();
            },
          })
          .to(".preloader-content", {
            yPercent: -120,
            autoAlpha: 0,
            duration: 0.7,
            ease: "power3.in",
          })
          .to(
            ".preloader-panel",
            { yPercent: -101, duration: 1.15, stagger: 0.12 },
            "-=0.15",
          );
      };

      /* Ползучий старт до прихода реальных сигналов */
      gsap.to(progress, {
        value: 30,
        duration: 1.8,
        ease: "power1.out",
        onUpdate: render,
      });

      const fonts = document.fonts.ready.then(() => bump(35));
      const hero = heroReadyPromise().then(() => bump(45));
      const floor = delay(MIN_DURATION_MS).then(() => bump(20));

      Promise.all([fonts, hero, floor]).then(finish);

      return () => {
        cancelled = true;
        document.body.style.overflow = "";
      };
    },
    { scope: rootRef, dependencies: [lenis] },
  );

  if (phase === "ready") return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[95] overflow-hidden"
    >
      {/* Занавес: две ink-панели */}
      <div className="absolute inset-0 flex">
        <div className="preloader-panel h-full w-1/2 bg-ink" />
        <div className="preloader-panel h-full w-1/2 bg-ink" />
      </div>

      <div className="preloader-content absolute inset-0 flex flex-col justify-between p-[6vw]">
        <p className="kicker">{PROJECT.kicker}</p>
        <div className="flex items-end justify-between">
          <p className="font-display text-xl tracking-[0.08em]">
            {PROJECT.name}
          </p>
          <p className="display-hero tabular-nums">
            <span ref={counterRef}>0</span>
          </p>
        </div>
      </div>
    </div>
  );
}
