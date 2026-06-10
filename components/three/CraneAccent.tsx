"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import * as THREE from "three";
import { PHASES } from "@/lib/three/buildingConfig";
import { steelMaterial, unitBoxBottom } from "@/lib/three/materials";
import { clamp01, easeOutCubic, phase } from "@/lib/three/progress";

const MAST_HEIGHT = 16.5;

/*
  Минималистичный башенный кран: вырастает в начале стройки,
  медленно поворачивает стрелу и «демонтируется» на фазе фасада.
*/
export default function CraneAccent({
  progressRef,
}: {
  progressRef: RefObject<number>;
}) {
  const craneRef = useRef<THREE.Group>(null);
  const jibRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const p = clamp01(progressRef.current);
    const crane = craneRef.current;
    if (!crane) return;

    const up = easeOutCubic(phase(p, ...PHASES.craneUp));
    const out = 1 - easeOutCubic(phase(p, ...PHASES.craneOut));
    const scale = up * out;

    crane.visible = scale > 0.002;
    crane.scale.y = Math.max(scale, 0.0001);

    if (jibRef.current) {
      /* стрела медленно ведёт груз к башне по ходу стройки */
      jibRef.current.rotation.y = 0.9 - phase(p, 0.1, 0.66) * 1.5;
    }
  });

  return (
    <group ref={craneRef} position={[8.2, 0, -6.4]}>
      {/* мачта */}
      <mesh
        geometry={unitBoxBottom}
        material={steelMaterial}
        scale={[0.34, MAST_HEIGHT, 0.34]}
      />

      <group ref={jibRef} position={[0, MAST_HEIGHT - 0.4, 0]}>
        {/* стрела */}
        <mesh
          geometry={unitBoxBottom}
          material={steelMaterial}
          position={[3.9, 0, 0]}
          scale={[8.4, 0.24, 0.24]}
        />
        {/* противовес */}
        <mesh
          geometry={unitBoxBottom}
          material={steelMaterial}
          position={[-1.9, -0.3, 0]}
          scale={[1.4, 0.7, 0.7]}
        />
        {/* оголовок */}
        <mesh
          geometry={unitBoxBottom}
          material={steelMaterial}
          scale={[0.22, 1.6, 0.22]}
        />
        {/* трос с крюком */}
        <mesh
          geometry={unitBoxBottom}
          material={steelMaterial}
          position={[6.6, -3.2, 0]}
          scale={[0.03, 3.2, 0.03]}
        />
        <mesh
          geometry={unitBoxBottom}
          material={steelMaterial}
          position={[6.6, -3.5, 0]}
          scale={[0.3, 0.3, 0.3]}
        />
      </group>
    </group>
  );
}
