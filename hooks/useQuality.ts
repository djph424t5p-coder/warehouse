"use client";

import { useEffect, useState } from "react";

export type Quality = "high" | "low" | "static";

/*
  Градация качества 3D:
  - static: нет WebGL2 / reduced-motion / совсем слабое железо → постер
  - low: мобильные и слабые устройства → без постобработки, меньше этажей
  - high: полная сцена с Bloom
*/
function detect(): Quality {
  try {
    const canvas = document.createElement("canvas");
    if (!canvas.getContext("webgl2")) return "static";
  } catch {
    return "static";
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "static";
  }

  const deviceMemory = (
    navigator as Navigator & { deviceMemory?: number }
  ).deviceMemory;

  if (deviceMemory !== undefined && deviceMemory <= 2) return "static";

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const lowCpu =
    navigator.hardwareConcurrency !== undefined &&
    navigator.hardwareConcurrency <= 4;

  if (coarse || lowCpu || (deviceMemory !== undefined && deviceMemory <= 4)) {
    return "low";
  }

  return "high";
}

export default function useQuality() {
  const [quality, setQuality] = useState<Quality | null>(null);
  useEffect(() => setQuality(detect()), []);
  return quality;
}
