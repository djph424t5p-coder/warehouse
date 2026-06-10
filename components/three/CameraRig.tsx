"use client";

import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { cameraCurve, sampleLook } from "@/lib/three/cameraPath";
import { clamp01 } from "@/lib/three/progress";

const targetPosition = new THREE.Vector3();
const targetLook = new THREE.Vector3();

/*
  Камера движется по сплайну (от котлована вверх и в облёт) с демпфированием —
  оно съедает ступеньки scrub'а. Плюс лёгкий mouse-параллакс на десктопе.
*/
export default function CameraRig({
  progressRef,
}: {
  progressRef: RefObject<number>;
}) {
  const pointer = useRef({ x: 0, y: 0 });
  const currentLook = useRef(new THREE.Vector3(0, 1.6, 0));

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ camera }, delta) => {
    const t = clamp01(progressRef.current);

    cameraCurve.getPoint(t, targetPosition);
    targetPosition.x += pointer.current.x * 0.55;
    targetPosition.y += -pointer.current.y * 0.3;

    easing.damp3(camera.position, targetPosition, 0.16, delta);

    sampleLook(t, targetLook);
    easing.damp3(currentLook.current, targetLook, 0.16, delta);
    camera.lookAt(currentLook.current);
  });

  return null;
}
