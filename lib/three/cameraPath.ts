import * as THREE from "three";

/*
  Путь камеры: от уровня котлована — вверх и в облёт,
  к финальной композиции с готовой башней.
*/
const POSITIONS = [
  new THREE.Vector3(11, 1.8, 14),
  new THREE.Vector3(14.5, 6.5, 15),
  new THREE.Vector3(12.5, 12.5, 18.5),
  new THREE.Vector3(16, 15.5, 23),
];

const LOOKS = [
  new THREE.Vector3(0, 1.6, 0),
  new THREE.Vector3(0, 5.5, 0),
  new THREE.Vector3(0, 8.5, 0),
  new THREE.Vector3(0, 9.6, 0),
];

export const cameraCurve = new THREE.CatmullRomCurve3(
  POSITIONS,
  false,
  "catmullrom",
  0.5,
);

/* Линейная интерполяция точки взгляда между опорными кадрами */
export function sampleLook(t: number, out: THREE.Vector3) {
  const scaled = Math.min(Math.max(t, 0), 1) * (LOOKS.length - 1);
  const index = Math.min(Math.floor(scaled), LOOKS.length - 2);
  return out.lerpVectors(LOOKS[index], LOOKS[index + 1], scaled - index);
}
