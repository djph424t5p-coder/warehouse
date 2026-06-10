"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import Building from "@/components/three/Building";
import CameraRig from "@/components/three/CameraRig";
import CraneAccent from "@/components/three/CraneAccent";
import HeroPostFX from "@/components/three/HeroPostFX";
import SceneLights from "@/components/three/SceneLights";
import type { Quality } from "@/hooks/useQuality";
import { scrollStore, useAppStore } from "@/lib/stores";
import { BUILDING } from "@/lib/three/buildingConfig";
import { groundMaterial } from "@/lib/three/materials";

/* Мягкая «контактная тень» — статичный radial-градиент вместо ContactShadows */
function Ground() {
  const shadowTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(128, 128, 16, 128, 128, 128);
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.62)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <group>
      <mesh
        rotation-x={-Math.PI / 2}
        position-y={-0.02}
        material={groundMaterial}
      >
        <circleGeometry args={[45, 48]} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.01}>
        <planeGeometry args={[22, 22]} />
        <meshBasicMaterial
          map={shadowTexture}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/*
  Сцена hero. Единственный источник правды о прогрессе — scrollStore,
  сглаженный damp'ом (убирает ступеньки scrub). Читается через getState()
  в useFrame — ноль React-ре-рендеров на скролле.
*/
export default function HeroScene({ quality }: { quality: Quality }) {
  const progressRef = useRef(0);

  /* сигнал прелоадеру: сцена собрана, первый кадр близко */
  useEffect(() => {
    useAppStore.getState().setHeroReady();
  }, []);

  useFrame((_, delta) => {
    progressRef.current = THREE.MathUtils.damp(
      progressRef.current,
      scrollStore.getState().heroProgress,
      6,
      delta,
    );
  });

  const floors = quality === "low" ? BUILDING.floorsLow : BUILDING.floors;

  return (
    <>
      <color attach="background" args={["#0e0d0b"]} />
      <fog attach="fog" args={["#0e0d0b", 26, 72]} />

      <SceneLights />
      <CameraRig progressRef={progressRef} />
      <Ground />

      <Building progressRef={progressRef} floors={floors} />
      {quality === "high" && <CraneAccent progressRef={progressRef} />}
      {quality === "high" && <HeroPostFX />}
    </>
  );
}
