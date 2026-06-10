"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { BUILDING } from "@/lib/three/buildingConfig";
import { windowsMaterial } from "@/lib/three/materials";
import { mulberry32 } from "@/lib/three/progress";

/*
  Все окна башни — один InstancedMesh (1 draw call).
  Позиции и сиды детерминированы (mulberry32) — никакого Math.random().
*/
export default function WindowsInstanced({ floors }: { floors: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const { matrices, seeds, count, geometry } = useMemo(() => {
    const rand = mulberry32(BUILDING.seed);
    const dummy = new THREE.Object3D();
    const matrices: THREE.Matrix4[] = [];
    const seedValues: number[] = [];

    const facadeHalf = (BUILDING.width - BUILDING.facadeInset * 2) / 2;
    const offset = facadeHalf + 0.04;
    const spanHalf = facadeHalf - 0.75;
    const step = (spanHalf * 2) / (BUILDING.windowCols - 1);

    /* face: [rotY, axis] — 4 стороны башни */
    const faces: Array<{ rotY: number; x: number; z: number }> = [
      { rotY: 0, x: 0, z: offset },
      { rotY: Math.PI, x: 0, z: -offset },
      { rotY: Math.PI / 2, x: offset, z: 0 },
      { rotY: -Math.PI / 2, x: -offset, z: 0 },
    ];

    for (let floor = 0; floor < floors; floor += 1) {
      const y =
        BUILDING.baseHeight +
        floor * BUILDING.floorHeight +
        BUILDING.floorHeight * 0.52;

      for (const face of faces) {
        for (let col = 0; col < BUILDING.windowCols; col += 1) {
          const along = -spanHalf + col * step;
          dummy.position.set(
            face.z === 0 ? face.x : along,
            y,
            face.x === 0 ? face.z : along,
          );
          dummy.rotation.set(0, face.rotY, 0);
          dummy.updateMatrix();
          matrices.push(dummy.matrix.clone());
          seedValues.push(rand());
        }
      }
    }

    const geometry = new THREE.PlaneGeometry(
      BUILDING.windowWidth,
      BUILDING.windowHeight,
    );

    return {
      matrices,
      seeds: new Float32Array(seedValues),
      count: matrices.length,
      geometry,
    };
  }, [floors]);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    matrices.forEach((matrix, index) => mesh.setMatrixAt(index, matrix));
    mesh.instanceMatrix.needsUpdate = true;
    mesh.geometry.setAttribute(
      "aSeed",
      new THREE.InstancedBufferAttribute(seeds, 1),
    );
  }, [matrices, seeds]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, windowsMaterial, count]}
      frustumCulled={false}
    />
  );
}
