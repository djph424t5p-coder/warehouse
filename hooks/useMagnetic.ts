"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "@/lib/gsap";

/*
  Magnetic-эффект: элемент тянется за курсором внутри своих границ,
  отпускается с упругим возвратом. Только для точных указателей.
*/
export default function useMagnetic(
  ref: RefObject<HTMLElement | null>,
  strength = 0.3,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      xTo((event.clientX - rect.left - rect.width / 2) * strength);
      yTo((event.clientY - rect.top - rect.height / 2) * strength);
    };

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [ref, strength]);
}
