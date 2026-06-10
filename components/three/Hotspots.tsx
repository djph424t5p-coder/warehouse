"use client";

import { Html } from "@react-three/drei";
import { ARCHITECTURE } from "@/lib/constants";

/*
  Хотспоты на фасаде: латунные маркеры с пульсацией,
  при hover — карточка-аннотация в стиле чертежа.
*/
export default function Hotspots() {
  return (
    <>
      {ARCHITECTURE.hotspots.map((spot, index) => (
        <Html
          key={spot.id}
          position={spot.position as unknown as [number, number, number]}
          center
          zIndexRange={[40, 0]}
        >
          <div className="group relative">
            <span
              aria-hidden="true"
              className="absolute -inset-1.5 rounded-full border border-brass/40 [animation:ping_2.4s_cubic-bezier(0,0,0.2,1)_infinite]"
            />
            <button
              type="button"
              aria-label={spot.title}
              data-cursor="hover"
              className="block h-3.5 w-3.5 rounded-full border border-brass bg-ink/70 transition-transform duration-300 group-hover:scale-150"
            />

            <div className="pointer-events-none absolute top-1/2 left-7 w-60 -translate-y-1/2 border border-line bg-ink/95 p-5 opacity-0 backdrop-blur-sm transition-all duration-400 group-hover:translate-x-1 group-hover:opacity-100">
              <p className="kicker tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-2 font-display text-base text-bone">
                {spot.title}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-stone">
                {spot.text}
              </p>
            </div>
          </div>
        </Html>
      ))}
    </>
  );
}
