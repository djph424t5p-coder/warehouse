"use client";

import Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);

export function useLenisContext() {
  return useContext(LenisContext);
}

/*
  Инерционный скролл: Lenis ведёт нативный window-scroll,
  кадры выдаёт тикер GSAP (общий тикер — синхронность со ScrollTrigger).
*/
export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const instance = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      smoothWheel: true,
    });

    instance.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    setLenis(instance);

    return () => {
      gsap.ticker.remove(raf);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
