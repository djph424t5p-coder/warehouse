"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/*
  Кастомный курсор: латунная точка + расширяющееся кольцо.
  Точка догоняет курсор быстро, кольцо — с инерцией.
  На интерактивных элементах ([data-cursor]) кольцо раскрывается.
*/
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (fine && !reduced) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("cursor-hidden");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dotPos = { ...target };
    const ringPos = { ...target };
    let ringScale = 1;
    let targetScale = 1;
    let visible = false;

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      if (!visible) {
        visible = true;
        dotPos.x = ringPos.x = target.x;
        dotPos.y = ringPos.y = target.y;
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.4 });
      }
    };

    const onOver = (event: PointerEvent) => {
      if ((event.target as Element).closest?.("[data-cursor]")) {
        targetScale = 1.8;
      }
    };

    const onOut = (event: PointerEvent) => {
      if ((event.target as Element).closest?.("[data-cursor]")) {
        targetScale = 1;
      }
    };

    const onLeaveWindow = () => {
      visible = false;
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.4 });
    };

    const tick = () => {
      dotPos.x += (target.x - dotPos.x) * 0.4;
      dotPos.y += (target.y - dotPos.y) * 0.4;
      ringPos.x += (target.x - ringPos.x) * 0.14;
      ringPos.y += (target.y - ringPos.y) * 0.14;
      ringScale += (targetScale - ringScale) * 0.14;

      dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%) scale(${ringScale})`;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    gsap.ticker.add(tick);

    return () => {
      document.documentElement.classList.remove("cursor-hidden");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.documentElement.removeEventListener(
        "pointerleave",
        onLeaveWindow,
      );
      gsap.ticker.remove(tick);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[110]"
    >
      <div
        ref={ringRef}
        className="absolute top-0 left-0 h-10 w-10 rounded-full border border-brass/50 opacity-0"
      />
      <div
        ref={dotRef}
        className="absolute top-0 left-0 h-1.5 w-1.5 rounded-full bg-brass opacity-0"
      />
    </div>
  );
}
