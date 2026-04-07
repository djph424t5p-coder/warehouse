export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

export function snapPosition(
  x: number,
  y: number,
  gridSize: number,
  enabled: boolean
): { x: number; y: number } {
  if (!enabled) return { x, y };
  return {
    x: snapToGrid(x, gridSize),
    y: snapToGrid(y, gridSize),
  };
}
