import type { WarehouseObject } from '../types';

export function computeStats(objects: WarehouseObject[]) {
  if (objects.length === 0) {
    return { area: 0, rackSlots: 0, palletPositions: 0, boundingBox: { width: 0, depth: 0 } };
  }

  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let rackSlots = 0;
  let palletPositions = 0;

  for (const obj of objects) {
    const hw = obj.width / 2;
    const hd = obj.depth / 2;
    minX = Math.min(minX, obj.x - hw);
    maxX = Math.max(maxX, obj.x + hw);
    minY = Math.min(minY, obj.y - hd);
    maxY = Math.max(maxY, obj.y + hd);

    if (obj.type === 'rack') {
      const levels = obj.metadata?.levels ?? 4;
      rackSlots += levels * 3;
    }
    if (obj.type === 'pallet') {
      palletPositions++;
    }
  }

  const width = maxX - minX;
  const depth = maxY - minY;

  return {
    area: Math.round(width * depth * 100) / 100,
    rackSlots,
    palletPositions,
    boundingBox: {
      width: Math.round(width * 100) / 100,
      depth: Math.round(depth * 100) / 100,
    },
  };
}
