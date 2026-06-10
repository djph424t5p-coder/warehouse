"use client";

import { useEffect, useMemo } from "react";
import { mulberry32 } from "@/lib/three/progress";
import { useAppStore } from "@/lib/stores";

/*
  Статичный fallback hero для слабых устройств / без WebGL /
  prefers-reduced-motion: кинематографичный SVG-силуэт башни.
  TODO: заменить на рендер-постер (/public/assets/hero-poster.jpg),
  когда будут готовы визуализации.
*/
export default function HeroPoster() {
  const setHeroReady = useAppStore((state) => state.setHeroReady);
  useEffect(() => setHeroReady(), [setHeroReady]);

  /* детерминированная сетка светящихся окон */
  const windows = useMemo(() => {
    const rand = mulberry32(20260610);
    const cells: Array<{ x: number; y: number; lit: boolean }> = [];
    for (let row = 0; row < 14; row += 1) {
      for (let col = 0; col < 6; col += 1) {
        cells.push({
          x: 318 + col * 28,
          y: 150 + row * 30,
          lit: rand() > 0.55,
        });
      }
    }
    return cells;
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-ink">
      <svg
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMax slice"
        className="h-full w-full origin-bottom motion-safe:animate-[poster-zoom_24s_ease-in-out_infinite_alternate]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="poster-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#232a25" />
            <stop offset="0.6" stopColor="#151612" />
            <stop offset="1" stopColor="#0e0d0b" />
          </linearGradient>
          <linearGradient id="poster-tower" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#1b1813" />
            <stop offset="0.5" stopColor="#26221a" />
            <stop offset="1" stopColor="#161310" />
          </linearGradient>
        </defs>

        <rect width="800" height="600" fill="url(#poster-sky)" />

        {/* соседние силуэты */}
        <rect x="120" y="330" width="120" height="270" fill="#13110d" />
        <rect x="560" y="370" width="150" height="230" fill="#12100c" />

        {/* башня */}
        <rect x="300" y="130" width="200" height="470" fill="url(#poster-tower)" />
        <rect x="300" y="124" width="200" height="6" fill="#b8975c" opacity="0.85" />
        <rect x="396" y="84" width="4" height="40" fill="#b8975c" opacity="0.85" />

        {windows.map((cell, index) =>
          cell.lit ? (
            <rect
              key={index}
              x={cell.x}
              y={cell.y}
              width="14"
              height="18"
              fill="#ffc98a"
              opacity={0.5 + (index % 5) * 0.1}
            />
          ) : null,
        )}

        <rect x="0" y="592" width="800" height="8" fill="#0c0b09" />
      </svg>

      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
    </div>
  );
}
