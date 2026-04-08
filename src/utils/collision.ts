import type { WarehouseObject } from '../types';

export function checkCollisions(
  obj: WarehouseObject,
  allObjects: WarehouseObject[]
): WarehouseObject[] {
  if (obj.type === 'zone') return []; // zones don't collide
  return allObjects.filter((other) => {
    if (other.id === obj.id) return false;
    if (other.type === 'zone') return false;
    return aabbOverlap(obj, other);
  });
}

function aabbOverlap(a: WarehouseObject, b: WarehouseObject): boolean {
  const aMinX = a.x - a.width / 2;
  const aMaxX = a.x + a.width / 2;
  const aMinY = a.y - a.depth / 2;
  const aMaxY = a.y + a.depth / 2;

  const bMinX = b.x - b.width / 2;
  const bMaxX = b.x + b.width / 2;
  const bMinY = b.y - b.depth / 2;
  const bMaxY = b.y + b.depth / 2;

  return aMinX < bMaxX && aMaxX > bMinX && aMinY < bMaxY && aMaxY > bMinY;
}

export function getAllCollisions(objects: WarehouseObject[]): Set<string> {
  const colliding = new Set<string>();
  const nonZones = objects.filter((o) => o.type !== 'zone');
  for (let i = 0; i < nonZones.length; i++) {
    for (let j = i + 1; j < nonZones.length; j++) {
      if (aabbOverlap(nonZones[i], nonZones[j])) {
        colliding.add(nonZones[i].id);
        colliding.add(nonZones[j].id);
      }
    }
  }
  return colliding;
}
