"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import HeroPoster from "@/components/three/HeroPoster";
import HeroScene from "@/components/three/HeroScene";
import useQuality from "@/hooks/useQuality";

/*
  Оболочка hero-сцены: quality-гейт (static → постер), переключение
  frameloop по видимости (за пределами hero GPU не работает),
  страховка на потерю WebGL-контекста.
*/
export default function HeroCanvas() {
  const quality = useQuality();
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);

  const canvasActive = quality === "high" || quality === "low";
  const showCanvas = canvasActive && !failed;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !showCanvas) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [showCanvas]);

  if (!quality) return null;
  if (!showCanvas) return <HeroPoster />;

  return (
    <div ref={wrapRef} className="h-full w-full">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={quality === "low" ? [1, 1.25] : [1, 1.75]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ fov: 36, near: 0.5, far: 110, position: [11, 1.8, 14] }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener(
            "webglcontextlost",
            (event) => {
              event.preventDefault();
              setFailed(true);
            },
            { once: true },
          );
        }}
      >
        <HeroScene quality={quality} />
      </Canvas>
    </div>
  );
}
