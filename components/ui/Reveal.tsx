"use client";

import { useGSAP } from "@gsap/react";
import { createElement, useRef, type ElementType, type ReactNode } from "react";
import { EASE_LUXE, gsap, SplitText } from "@/lib/gsap";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /* построчно (маской) или цельным блоком */
  mode?: "lines" | "block";
  delay?: number;
  stagger?: number;
  start?: string;
};

/*
  Reveal текста: построчная маска (SplitText, бесплатен с GSAP 3.13)
  либо подъём цельного блока. Срабатывает один раз при входе в вьюпорт.
*/
export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  mode = "lines",
  delay = 0,
  stagger = 0.09,
  start = "top 82%",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      if (mode === "block") {
        gsap.from(el, {
          autoAlpha: 0,
          y: 48,
          duration: 1.2,
          ease: EASE_LUXE,
          delay,
          scrollTrigger: { trigger: el, start, once: true },
        });
        return;
      }

      SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        linesClass: "will-change-transform",
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 112,
            duration: 1.15,
            ease: EASE_LUXE,
            stagger,
            delay,
            scrollTrigger: { trigger: el, start, once: true },
          }),
      });
    },
    { scope: ref, dependencies: [] },
  );

  return createElement(Tag, { ref, className }, children);
}
