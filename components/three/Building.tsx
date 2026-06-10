"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import WindowsInstanced from "@/components/three/WindowsInstanced";
import { BUILDING, PHASES } from "@/lib/three/buildingConfig";
import {
  brassMaterial,
  concreteDarkMaterial,
  concreteMaterial,
  glassMaterial,
  unitBoxBottom,
  windowsMaterial,
} from "@/lib/three/materials";
import {
  clamp01,
  easeOutBack,
  easeOutCubic,
  phase,
  staggered,
} from "@/lib/three/progress";

type FloorRefs = {
  group: THREE.Group | null;
  slab: THREE.Mesh | null;
  columns: (THREE.Mesh | null)[];
};

type BuildingProps = {
  progressRef: RefObject<number>;
  floors: number;
  /* static = финальное состояние без анимации (сцена S3) */
  animated?: boolean;
};

const FLOOR_DROP = 2.2;

/*
  Процедурная башня. Этажи собираются по скроллу: колонны опережают плиту,
  плита «садится» с лёгким overshoot, затем фасад, корона и свет в окнах.
*/
export default function Building({
  progressRef,
  floors,
  animated = true,
}: BuildingProps) {
  const floorRefs = useRef<FloorRefs[]>(
    Array.from({ length: floors }, () => ({
      group: null,
      slab: null,
      columns: [null, null, null, null],
    })),
  );
  const pitRef = useRef<THREE.Group>(null);
  const baseRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const facadeRef = useRef<THREE.Mesh>(null);
  const crownRef = useRef<THREE.Group>(null);
  const spireRef = useRef<THREE.Mesh>(null);

  const spireGeometry = useMemo(() => {
    const geometry = new THREE.CylinderGeometry(
      0.05,
      0.09,
      BUILDING.spireHeight,
      8,
    );
    geometry.translate(0, BUILDING.spireHeight / 2, 0);
    return geometry;
  }, []);

  const dims = useMemo(() => {
    const slabW = BUILDING.width + BUILDING.slabOverhang;
    const slabD = BUILDING.depth + BUILDING.slabOverhang;
    const columnOffsetX = BUILDING.width / 2 - 0.35;
    const columnOffsetZ = BUILDING.depth / 2 - 0.35;
    const facadeW = BUILDING.width - BUILDING.facadeInset * 2;
    const towerTop = BUILDING.baseHeight + floors * BUILDING.floorHeight;
    return {
      slabW,
      slabD,
      facadeW,
      towerTop,
      columns: [
        [columnOffsetX, columnOffsetZ],
        [-columnOffsetX, columnOffsetZ],
        [columnOffsetX, -columnOffsetZ],
        [-columnOffsetX, -columnOffsetZ],
      ] as const,
    };
  }, [floors]);

  useFrame(() => {
    const p = animated ? clamp01(progressRef.current) : 1;

    /* котлован и плита-основание */
    if (pitRef.current) {
      const t = easeOutCubic(phase(p, ...PHASES.pit));
      pitRef.current.scale.y = Math.max(t, 0.0001);
      pitRef.current.visible = t > 0.001;
    }
    if (baseRef.current) {
      const t = easeOutCubic(phase(p, ...PHASES.base));
      baseRef.current.scale.set(
        BUILDING.baseWidth * Math.max(t, 0.0001),
        BUILDING.baseHeight,
        BUILDING.baseWidth * Math.max(t, 0.0001),
      );
      baseRef.current.visible = t > 0.001;
    }

    /* этажи с перехлёстным стаггером; ядро растёт чуть впереди */
    const floorsPhase = phase(p, ...PHASES.floors);

    if (coreRef.current) {
      const t = clamp01(floorsPhase * 1.12);
      coreRef.current.scale.set(
        BUILDING.coreSize,
        floors * BUILDING.floorHeight * Math.max(t, 0.0001),
        BUILDING.coreSize,
      );
      coreRef.current.visible = t > 0.001;
    }

    for (let i = 0; i < floors; i += 1) {
      const refs = floorRefs.current[i];
      if (!refs.group) continue;

      const t = staggered(floorsPhase, i, floors);
      refs.group.visible = t > 0.001;
      if (!refs.group.visible) continue;

      const drop = (1 - easeOutCubic(t)) * FLOOR_DROP;
      refs.group.position.y =
        BUILDING.baseHeight + i * BUILDING.floorHeight + drop;

      const slabT = easeOutBack(clamp01(t * 1.15));
      refs.slab?.scale.set(
        dims.slabW * Math.max(0.55 + 0.45 * slabT, 0.0001),
        BUILDING.slabThickness,
        dims.slabD * Math.max(0.55 + 0.45 * slabT, 0.0001),
      );

      const columnT = clamp01(t * 1.5);
      for (const column of refs.columns) {
        column?.scale.set(
          0.32,
          (BUILDING.floorHeight - BUILDING.slabThickness) *
            Math.max(columnT, 0.0001),
          0.32,
        );
      }
    }

    /* фасад закрывает каркас */
    const facadeT = phase(p, ...PHASES.facade);
    if (facadeRef.current) {
      glassMaterial.opacity = 0.86 * facadeT;
      facadeRef.current.visible = facadeT > 0.01;
    }

    /* корона и шпиль */
    if (crownRef.current) {
      const t = easeOutCubic(phase(p, ...PHASES.crown));
      crownRef.current.scale.y = Math.max(t, 0.0001);
      crownRef.current.visible = t > 0.001;
    }
    if (spireRef.current) {
      const t = easeOutCubic(phase(p, 0.9, 0.98));
      spireRef.current.scale.y = Math.max(t, 0.0001);
      spireRef.current.visible = t > 0.001;
    }

    /* окна зажигаются */
    windowsMaterial.uniforms.uLitProgress.value = phase(p, ...PHASES.windows);
  });

  const half = BUILDING.pitSize / 2;

  return (
    <group>
      {/* контур котлована */}
      <group ref={pitRef}>
        {[
          [0, half, BUILDING.pitSize + 0.3, 0.22],
          [0, -half, BUILDING.pitSize + 0.3, 0.22],
          [half, 0, 0.22, BUILDING.pitSize + 0.3],
          [-half, 0, 0.22, BUILDING.pitSize + 0.3],
        ].map(([x, z, w, d], index) => (
          <mesh
            key={index}
            geometry={unitBoxBottom}
            material={concreteDarkMaterial}
            position={[x, 0, z]}
            scale={[w, 0.42, d]}
          />
        ))}
      </group>

      {/* плита-основание */}
      <mesh ref={baseRef} geometry={unitBoxBottom} material={concreteMaterial} />

      {/* монолитное ядро */}
      <mesh
        ref={coreRef}
        geometry={unitBoxBottom}
        material={concreteDarkMaterial}
        position={[0, BUILDING.baseHeight, 0]}
      />

      {/* этажи: плита + 4 угловые колонны */}
      {Array.from({ length: floors }, (_, i) => (
        <group
          key={i}
          ref={(node) => {
            floorRefs.current[i].group = node;
          }}
          position={[0, BUILDING.baseHeight + i * BUILDING.floorHeight, 0]}
        >
          <mesh
            ref={(node) => {
              floorRefs.current[i].slab = node;
            }}
            geometry={unitBoxBottom}
            material={concreteMaterial}
            position={[0, BUILDING.floorHeight - BUILDING.slabThickness, 0]}
          />
          {dims.columns.map(([x, z], j) => (
            <mesh
              key={j}
              ref={(node) => {
                floorRefs.current[i].columns[j] = node;
              }}
              geometry={unitBoxBottom}
              material={concreteDarkMaterial}
              position={[x, 0, z]}
            />
          ))}
        </group>
      ))}

      {/* фасад: бронзовое стекло во всю высоту */}
      <mesh
        ref={facadeRef}
        geometry={unitBoxBottom}
        material={glassMaterial}
        position={[0, BUILDING.baseHeight, 0]}
        scale={[dims.facadeW, floors * BUILDING.floorHeight, dims.facadeW]}
        visible={false}
      />

      {/* окна — один InstancedMesh */}
      <WindowsInstanced floors={floors} />

      {/* корона: латунный парапет */}
      <group ref={crownRef} position={[0, dims.towerTop, 0]}>
        {[
          [0, dims.slabD / 2, dims.slabW + 0.1, 0.12],
          [0, -dims.slabD / 2, dims.slabW + 0.1, 0.12],
          [dims.slabW / 2, 0, 0.12, dims.slabD + 0.1],
          [-dims.slabW / 2, 0, 0.12, dims.slabD + 0.1],
        ].map(([x, z, w, d], index) => (
          <mesh
            key={index}
            geometry={unitBoxBottom}
            material={brassMaterial}
            position={[x, 0, z]}
            scale={[w, BUILDING.parapetHeight, d]}
          />
        ))}
      </group>

      {/* шпиль */}
      <mesh
        ref={spireRef}
        geometry={spireGeometry}
        material={brassMaterial}
        position={[0, dims.towerTop, 0]}
      />
    </group>
  );
}
