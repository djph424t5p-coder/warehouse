"use client";

/*
  Тёплый закатный свет без внешних HDR (никаких сетевых environment-карт):
  key — тёплый низкий, rim — холодный контровой, hemisphere — мягкая заливка.
*/
export default function SceneLights() {
  return (
    <>
      <hemisphereLight args={["#42392c", "#0e0d0b", 0.85]} />
      <directionalLight
        position={[14, 16, 10]}
        intensity={2.1}
        color="#ffd9b0"
      />
      <directionalLight
        position={[-14, 7, -12]}
        intensity={0.6}
        color="#4f6068"
      />
    </>
  );
}
