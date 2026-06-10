"use client";

import { useGSAP } from "@gsap/react";
import { useMemo, useRef } from "react";
import { INVESTMENT } from "@/lib/constants";
import { EASE_LUXE, gsap } from "@/lib/gsap";

const W = 600;
const H = 240;
const PAD = 24;

/* Минималистичный график динамики цены: латунная линия с draw-анимацией */
export default function PriceChart() {
  const rootRef = useRef<HTMLDivElement>(null);

  const { path, points } = useMemo(() => {
    const values = INVESTMENT.chart;
    const min = Math.min(...values) - 8;
    const max = Math.max(...values) + 8;
    const stepX = (W - PAD * 2) / (values.length - 1);

    const points = values.map((value, index) => ({
      x: PAD + index * stepX,
      y: H - PAD - ((value - min) / (max - min)) * (H - PAD * 2),
      label: INVESTMENT.chartLabels[index],
      value,
    }));

    const path = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");

    return { path, points };
  }, []);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: EASE_LUXE },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 80%",
          once: true,
        },
      });

      tl.from(".chart-line", { drawSVG: "0%", duration: 1.8 })
        .from(
          ".chart-dot",
          {
            scale: 0,
            transformOrigin: "center",
            duration: 0.5,
            stagger: 0.08,
          },
          "-=1.2",
        )
        .from(
          ".chart-label",
          { autoAlpha: 0, y: 8, duration: 0.6, stagger: 0.05 },
          "-=0.8",
        );
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef}>
      <svg
        viewBox={`0 0 ${W} ${H + 28}`}
        className="w-full"
        role="img"
        aria-label="Динамика цены квадратного метра по годам"
      >
        {/* сетка */}
        <g stroke="#1c2722" strokeOpacity="0.5" strokeWidth="1">
          {[0.25, 0.5, 0.75].map((fraction) => (
            <line
              key={fraction}
              x1={PAD}
              x2={W - PAD}
              y1={PAD + (H - PAD * 2) * fraction}
              y2={PAD + (H - PAD * 2) * fraction}
            />
          ))}
        </g>

        <path
          className="chart-line"
          d={path}
          fill="none"
          stroke="#b8975c"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {points.map((point) => (
          <circle
            key={point.label}
            className="chart-dot"
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#f4efe6"
            stroke="#b8975c"
            strokeWidth="1.5"
          />
        ))}

        {points.map((point) => (
          <text
            key={point.label}
            className="chart-label fill-stone"
            x={point.x}
            y={H + 18}
            textAnchor="middle"
            fontSize="12"
            fontFamily="var(--font-body)"
          >
            {point.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
