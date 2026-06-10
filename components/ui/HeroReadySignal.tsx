"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/stores";

/*
  Временный сигнал готовности hero для прелоадера.
  TODO(M4): заменить — сигнал будет давать HeroCanvas (первый кадр сцены)
  либо HeroPoster (загрузка постера).
*/
export default function HeroReadySignal() {
  const setHeroReady = useAppStore((state) => state.setHeroReady);
  useEffect(() => setHeroReady(), [setHeroReady]);
  return null;
}
