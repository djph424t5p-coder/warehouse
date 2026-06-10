"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";

type CounterProps = {
  value: number;
  suffix?: string;
  decimals?: number;
  className?: string;
};

/* Число «накручивается» при появлении в вьюпорте (один раз) */
export default function Counter({
  value,
  suffix = "",
  decimals = 0,
  className = "",
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const format = (n: number) =>
        n.toFixed(decimals).replace(".", ",") + suffix;

      const progress = { v: 0 };
      el.textContent = format(0);

      gsap.to(progress, {
        v: value,
        duration: 1.9,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 86%", once: true },
        onUpdate: () => {
          el.textContent = format(progress.v);
        },
      });
    },
    { scope: ref },
  );

  /* SSR отдаёт финальное значение (SEO, no-JS) */
  return (
    <span ref={ref} className={className}>
      {value.toFixed(decimals).replace(".", ",")}
      {suffix}
    </span>
  );
}
