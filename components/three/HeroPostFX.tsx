"use client";

import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";

/*
  Постобработка hero-сцены: Bloom ловит только HDR-окна
  (threshold > 1), Vignette даёт киношную рамку. DoF намеренно
  не используется — главная fps-ловушка.
*/
export default function HeroPostFX() {
  return (
    <EffectComposer>
      <Bloom mipmapBlur luminanceThreshold={1.05} intensity={1.2} />
      <Vignette eskil={false} offset={0.22} darkness={0.72} />
    </EffectComposer>
  );
}
