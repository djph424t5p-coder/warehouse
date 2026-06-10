"use client";

import { PresentationControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import Building from "@/components/three/Building";
import Hotspots from "@/components/three/Hotspots";
import SceneLights from "@/components/three/SceneLights";
import useQuality from "@/hooks/useQuality";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { BUILDING, TOWER_HEIGHT } from "@/lib/three/buildingConfig";

/*
  Интерактивная модель башни (секция «Архитектура»):
  готовое состояние, drag-вращение, хотспоты-аннотации.
*/
export default function ArchCanvas() {
  const quality = useQuality();
  const [visible, setVisible] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  /* статичная сцена: прогресс всегда 1 */
  const progressRef = useRef(1);

  const showCanvas = quality === "high" || quality === "low";

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
  if (!showCanvas) return <PlaceholderImage variant="facade" />;

  return (
    <div
      ref={wrapRef}
      data-cursor="hover"
      className="h-full w-full"
      style={{ touchAction: "pan-y" }}
    >
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={quality === "low" ? [1, 1.25] : [1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        camera={{ fov: 35, near: 0.5, far: 120, position: [15, 1.8, 18] }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        <SceneLights />
        <PresentationControls
          cursor={false}
          snap
          speed={1.4}
          rotation={[0, 0.55, 0]}
          polar={[-0.12, 0.22]}
          azimuth={[-1.4, 1.4]}
        >
          <group position={[0, -TOWER_HEIGHT / 2, 0]}>
            <Building
              progressRef={progressRef}
              floors={BUILDING.floors}
              animated={false}
            />
            <Hotspots />
          </group>
        </PresentationControls>
      </Canvas>
    </div>
  );
}
