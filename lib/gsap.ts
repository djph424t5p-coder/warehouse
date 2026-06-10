import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/*
  Единая точка регистрации плагинов GSAP.
  Импортировать gsap только отсюда — никогда напрямую из "gsap".
*/
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/* Фирменный ease: cubic-bezier(0.16,1,0.3,1) ≈ expo.out */
export const EASE_LUXE = "expo.out";

export { gsap, ScrollTrigger, SplitText };
