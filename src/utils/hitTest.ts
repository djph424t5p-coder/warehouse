import type { WarehouseObject } from '../types';

export function pointInObject(
  px: number,
  py: number,
  obj: WarehouseObject
): boolean {
  const rad = (-obj.rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const dx = px - obj.x;
  const dy = py - obj.y;

  const localX = dx * cos - dy * sin;
  const localY = dx * sin + dy * cos;

  const hw = obj.width / 2;
  const hd = obj.depth / 2;

  return localX >= -hw && localX <= hw && localY >= -hd && localY <= hd;
}

export function objectsInRect(
  objects: WarehouseObject[],
  x1: number,
  y1: number,
  x2: number,
  y2: number
): string[] {
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);

  return objects
    .filter((obj) => {
      const hw = obj.width / 2;
      const hd = obj.depth / 2;
      return (
        obj.x - hw < maxX &&
        obj.x + hw > minX &&
        obj.y - hd < maxY &&
        obj.y + hd > minY
      );
    })
    .map((obj) => obj.id);
}

export type ResizeHandle =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right';

export function getResizeHandleAtPoint(
  px: number,
  py: number,
  obj: WarehouseObject,
  handleSize: number
): ResizeHandle | null {
  const rad = (-obj.rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const dx = px - obj.x;
  const dy = py - obj.y;

  const localX = dx * cos - dy * sin;
  const localY = dx * sin + dy * cos;

  const hw = obj.width / 2;
  const hd = obj.depth / 2;
  const hs = handleSize;

  const onLeft = Math.abs(localX + hw) < hs;
  const onRight = Math.abs(localX - hw) < hs;
  const onTop = Math.abs(localY + hd) < hs;
  const onBottom = Math.abs(localY - hd) < hs;

  if (onTop && onLeft) return 'top-left';
  if (onTop && onRight) return 'top-right';
  if (onBottom && onLeft) return 'bottom-left';
  if (onBottom && onRight) return 'bottom-right';
  if (onTop) return 'top';
  if (onBottom) return 'bottom';
  if (onLeft) return 'left';
  if (onRight) return 'right';

  return null;
}
