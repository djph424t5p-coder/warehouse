import { create } from "zustand";
import { createStore } from "zustand/vanilla";

/*
  Мост ScrollTrigger → R3F: vanilla-store, который пишется в onUpdate
  и читается через getState() внутри useFrame — ноль React-ре-рендеров.
*/
export const scrollStore = createStore<{
  heroProgress: number;
  heroActive: boolean;
}>(() => ({
  heroProgress: 0,
  heroActive: true,
}));

export type AppPhase = "loading" | "revealing" | "ready";

type AppState = {
  /* loading → revealing (занавес уходит) → ready */
  phase: AppPhase;
  heroReady: boolean;
  setPhase: (phase: AppPhase) => void;
  setHeroReady: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  phase: "loading",
  heroReady: false,
  setPhase: (phase) => set({ phase }),
  setHeroReady: () => set({ heroReady: true }),
}));
