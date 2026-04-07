export function screenToWorld(
  sx: number,
  sy: number,
  offset: { x: number; y: number },
  zoom: number
): { x: number; y: number } {
  return {
    x: (sx - offset.x) / zoom,
    y: (sy - offset.y) / zoom,
  };
}

export function worldToScreen(
  wx: number,
  wy: number,
  offset: { x: number; y: number },
  zoom: number
): { x: number; y: number } {
  return {
    x: wx * zoom + offset.x,
    y: wy * zoom + offset.y,
  };
}
