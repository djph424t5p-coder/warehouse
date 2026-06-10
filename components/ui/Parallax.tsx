"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /* амплитуда смещения внутреннего слоя, % высоты */
  amount?: number;
};

/*
  Параллакс-рамка: внутренний слой (изображение) увеличен и медленно
  смещается по вертикали при скролле внутри overflow-hidden контейнера.
*/
export default function Parallax({
  children,
  className = "",
  amount = 10,
}: ParallaxProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }
      gsap.fromTo(
        innerRef.current,
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: "none",
          scrollTrigger: {
            trigger: frameRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { scope: frameRef },
  );

  return (
    <div ref={frameRef} className={`overflow-hidden ${className}`}>
      <div
        ref={innerRef}
        className="h-full w-full will-change-transform"
        style={{ scale: 1 + (amount * 2.2) / 100 }}
      >
        {children}
      </div>
    </div>
  );
}
