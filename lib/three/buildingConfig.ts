/* Геометрия процедурной башни — все размеры в юнитах сцены */

export const BUILDING = {
  /* этажи */
  floors: 14,
  floorsLow: 10,
  floorHeight: 1.0,
  width: 7,
  depth: 7,
  slabThickness: 0.16,
  slabOverhang: 0.15,

  /* основание */
  baseHeight: 0.5,
  baseWidth: 8,
  pitSize: 9.6,

  /* фасад и ядро */
  facadeInset: 0.15,
  coreSize: 2.4,

  /* окна */
  windowCols: 8,
  windowWidth: 0.46,
  windowHeight: 0.58,

  /* корона */
  parapetHeight: 0.5,
  spireHeight: 2.4,

  seed: 20260610,
} as const;

export const TOWER_HEIGHT =
  BUILDING.baseHeight + BUILDING.floors * BUILDING.floorHeight;

/* Раскадровка стройки по глобальному прогрессу скролла */
export const PHASES = {
  pit: [0.0, 0.06],
  base: [0.03, 0.12],
  craneUp: [0.04, 0.14],
  floors: [0.1, 0.72],
  facade: [0.68, 0.88],
  craneOut: [0.66, 0.8],
  crown: [0.84, 0.96],
  windows: [0.86, 1.0],
} as const;
