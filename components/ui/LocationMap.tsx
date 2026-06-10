"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { LOCATION, PROJECT } from "@/lib/constants";
import { EASE_LUXE, gsap } from "@/lib/gsap";

const W = 800;
const H = 600;

const toX = (percent: number) => (percent / 100) * W;
const toY = (percent: number) => (percent / 100) * H;

/*
  Стилизованная карта квартала: не Google Maps, а графика в духе
  гравюры — река, сетка переулков, линии-связи от дома к точкам.
  Геометрия условная; TODO: при необходимости заменить на точную
  SVG-подложку района.
*/
export default function LocationMap() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: EASE_LUXE },
        scrollTrigger: { trigger: rootRef.current, start: "top 70%", once: true },
      });

      tl.from(".map-street", {
        drawSVG: "0%",
        duration: 1.4,
        stagger: 0.06,
      })
        .from(".map-home", { scale: 0, transformOrigin: "center", duration: 0.7 }, "-=0.9")
        .from(
          ".map-link",
          { drawSVG: "0%", duration: 1.0, stagger: 0.12 },
          "-=0.4",
        )
        .from(
          ".map-poi",
          {
            scale: 0,
            autoAlpha: 0,
            transformOrigin: "center",
            duration: 0.6,
            stagger: 0.1,
          },
          "<+0.2",
        );
    },
    { scope: rootRef },
  );

  const home = { x: toX(LOCATION.home.x), y: toY(LOCATION.home.y) };

  return (
    <div ref={rootRef} className="relative h-full w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-full w-full"
        role="img"
        aria-label={`Карта района: ${PROJECT.address}`}
      >
        <rect width={W} height={H} fill="#141b17" />

        {/* Москва-река */}
        <path
          d="M -20 470 C 180 430, 300 330, 430 350 C 560 370, 680 300, 820 320"
          fill="none"
          stroke="#1d2a30"
          strokeWidth="52"
          strokeLinecap="round"
        />

        {/* сетка переулков */}
        <g
          fill="none"
          stroke="#8a847a"
          strokeOpacity="0.18"
          strokeWidth="1.2"
        >
          <path className="map-street" d="M 80 -10 L 200 610" />
          <path className="map-street" d="M 300 -10 L 380 610" />
          <path className="map-street" d="M 520 -10 L 470 610" />
          <path className="map-street" d="M 700 -10 L 760 610" />
          <path className="map-street" d="M -10 130 L 810 90" />
          <path className="map-street" d="M -10 280 L 810 240" />
          <path className="map-street" d="M -10 430 C 250 400, 550 430, 810 390" />
          <path className="map-street" d="M -10 540 L 810 520" />
        </g>

        {/* линии-связи от дома */}
        <g fill="none" stroke="#b8975c" strokeOpacity="0.5" strokeWidth="1">
          {LOCATION.pois.map((poi) => (
            <line
              key={poi.id}
              className="map-link"
              x1={home.x}
              y1={home.y}
              x2={toX(poi.x)}
              y2={toY(poi.y)}
            />
          ))}
        </g>

        {/* точки интереса */}
        {LOCATION.pois.map((poi) => {
          const x = toX(poi.x);
          const y = toY(poi.y);
          const alignRight = poi.x > 62;
          return (
            <g key={poi.id} className="map-poi">
              <circle cx={x} cy={y} r="5" fill="#b8975c" />
              <circle
                cx={x}
                cy={y}
                r="10"
                fill="none"
                stroke="#b8975c"
                strokeOpacity="0.35"
              />
              <text
                x={alignRight ? x - 18 : x + 18}
                y={y - 6}
                textAnchor={alignRight ? "end" : "start"}
                className="fill-bone"
                fontSize="15"
                fontFamily="var(--font-body)"
              >
                {poi.label}
              </text>
              <text
                x={alignRight ? x - 18 : x + 18}
                y={y + 14}
                textAnchor={alignRight ? "end" : "start"}
                fill="#b8975c"
                fontSize="12"
                letterSpacing="1.5"
                fontFamily="var(--font-body)"
              >
                {poi.minutes} МИН
              </text>
            </g>
          );
        })}

        {/* дом */}
        <g className="map-home">
          <rect
            x={home.x - 11}
            y={home.y - 11}
            width="22"
            height="22"
            fill="#b8975c"
            transform={`rotate(45 ${home.x} ${home.y})`}
          />
          <text
            x={home.x}
            y={home.y + 38}
            textAnchor="middle"
            className="fill-bone"
            fontSize="16"
            fontWeight="600"
            fontFamily="var(--font-body)"
          >
            {PROJECT.name}
          </text>
        </g>
      </svg>
    </div>
  );
}
