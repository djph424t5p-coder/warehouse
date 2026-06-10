/* Математика фаз стройки: глобальный прогресс скролла → локальные анимации */

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/* Вырезает из глобального прогресса p отрезок [a, b] как локальный 0..1 */
export const phase = (p: number, a: number, b: number) =>
  clamp01((p - a) / (b - a));

/*
  Перехлёстный стаггер: элемент i из n получает собственное окно
  длиной windowSize внутри фазы — этажи собираются с наложением.
*/
export function staggered(
  p: number,
  index: number,
  count: number,
  windowSize = 0.28,
) {
  const start = (index / Math.max(count - 1, 1)) * (1 - windowSize);
  return clamp01((p - start) / windowSize);
}

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/* Мягкий overshoot для «посадки» плит */
export function easeOutBack(t: number) {
  const c1 = 1.2;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

/* Детерминированный PRNG — одинаковые «случайные» окна на сервере и клиенте */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
