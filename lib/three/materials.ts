import * as THREE from "three";

/*
  Общие материалы сцены (≤6 уникальных — бюджет производительности).
  Создаются один раз на модуль, шарятся всеми мешами.
*/

export const concreteMaterial = new THREE.MeshStandardMaterial({
  color: "#5a554b",
  roughness: 0.92,
});

export const concreteDarkMaterial = new THREE.MeshStandardMaterial({
  color: "#454039",
  roughness: 0.95,
});

/* Бронзовое стекло фасада — единственный transparent-материал корпуса */
export const glassMaterial = new THREE.MeshStandardMaterial({
  color: "#1c2722",
  roughness: 0.16,
  metalness: 0.78,
  transparent: true,
  opacity: 0,
  depthWrite: false,
});

export const brassMaterial = new THREE.MeshStandardMaterial({
  color: "#b8975c",
  roughness: 0.32,
  metalness: 1,
});

export const steelMaterial = new THREE.MeshStandardMaterial({
  color: "#6f675c",
  roughness: 0.55,
  metalness: 0.7,
});

export const groundMaterial = new THREE.MeshStandardMaterial({
  color: "#14120f",
  roughness: 1,
});

/* Юнит-бокс с нижним пивотом: все коробки сцены — его масштабированные копии */
export const unitBoxBottom = new THREE.BoxGeometry(1, 1, 1);
unitBoxBottom.translate(0, 0.5, 0);

/*
  Окна: HDR-шейдер. Цвет > 1.0 не тонмапится (кастомный шейдер без
  tonemapping-чанка) и ловится Bloom по luminanceThreshold.
  uLitProgress 0→1 «зажигает» окна в детерминированно-случайном порядке.
*/
export const windowsMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uLitProgress: { value: 0 },
    uColor: { value: new THREE.Color("#ffc98a") },
  },
  vertexShader: /* glsl */ `
    attribute float aSeed;
    varying float vSeed;

    void main() {
      vSeed = aSeed;
      gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float uLitProgress;
    uniform vec3 uColor;
    varying float vSeed;

    void main() {
      if (vSeed > uLitProgress) discard;
      /* стабильная вариация яркости между окнами, в HDR-диапазоне */
      float intensity = 1.35 + 1.5 * fract(vSeed * 7.31);
      gl_FragColor = vec4(uColor * intensity, 1.0);
    }
  `,
});
