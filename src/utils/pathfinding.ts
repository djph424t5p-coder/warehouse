import type { WarehouseObject } from '../types';

interface Cell {
  x: number;
  y: number;
  g: number;
  h: number;
  f: number;
  parent: Cell | null;
}

const CELL_SIZE = 0.5; // resolution in meters

export interface PathPoint {
  x: number;
  y: number;
}

export function findPath(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  objects: WarehouseObject[]
): PathPoint[] | null {
  // Build obstacle set
  const obstacles = new Set<string>();
  const solidObjects = objects.filter((o) => o.type !== 'zone');

  for (const obj of solidObjects) {
    const minX = obj.x - obj.width / 2;
    const maxX = obj.x + obj.width / 2;
    const minY = obj.y - obj.depth / 2;
    const maxY = obj.y + obj.depth / 2;

    for (let x = Math.floor(minX / CELL_SIZE); x <= Math.ceil(maxX / CELL_SIZE); x++) {
      for (let y = Math.floor(minY / CELL_SIZE); y <= Math.ceil(maxY / CELL_SIZE); y++) {
        obstacles.add(`${x},${y}`);
      }
    }
  }

  const startCellX = Math.round(startX / CELL_SIZE);
  const startCellY = Math.round(startY / CELL_SIZE);
  const endCellX = Math.round(endX / CELL_SIZE);
  const endCellY = Math.round(endY / CELL_SIZE);

  const key = (x: number, y: number) => `${x},${y}`;

  const openSet = new Map<string, Cell>();
  const closedSet = new Set<string>();

  const startCell: Cell = {
    x: startCellX, y: startCellY,
    g: 0, h: heuristic(startCellX, startCellY, endCellX, endCellY),
    f: 0, parent: null,
  };
  startCell.f = startCell.g + startCell.h;
  openSet.set(key(startCellX, startCellY), startCell);

  const MAX_ITERATIONS = 20000;
  let iterations = 0;

  const dirs = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [1, -1], [-1, 1], [-1, -1],
  ];
  const costs = [1, 1, 1, 1, 1.414, 1.414, 1.414, 1.414];

  while (openSet.size > 0 && iterations < MAX_ITERATIONS) {
    iterations++;

    // Find lowest f in open set
    let current: Cell | null = null;
    for (const cell of openSet.values()) {
      if (!current || cell.f < current.f) current = cell;
    }
    if (!current) break;

    if (current.x === endCellX && current.y === endCellY) {
      return reconstructPath(current);
    }

    openSet.delete(key(current.x, current.y));
    closedSet.add(key(current.x, current.y));

    for (let i = 0; i < dirs.length; i++) {
      const nx = current.x + dirs[i][0];
      const ny = current.y + dirs[i][1];
      const nk = key(nx, ny);

      if (closedSet.has(nk) || obstacles.has(nk)) continue;

      // For diagonal movement, check that both cardinal neighbors are passable
      if (i >= 4) {
        if (obstacles.has(key(current.x + dirs[i][0], current.y)) ||
            obstacles.has(key(current.x, current.y + dirs[i][1]))) continue;
      }

      const g = current.g + costs[i];
      const existing = openSet.get(nk);

      if (!existing || g < existing.g) {
        const cell: Cell = {
          x: nx, y: ny, g,
          h: heuristic(nx, ny, endCellX, endCellY),
          f: g + heuristic(nx, ny, endCellX, endCellY),
          parent: current,
        };
        openSet.set(nk, cell);
      }
    }
  }

  return null; // No path found
}

function heuristic(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function reconstructPath(cell: Cell): PathPoint[] {
  const path: PathPoint[] = [];
  let current: Cell | null = cell;
  while (current) {
    path.unshift({ x: current.x * CELL_SIZE, y: current.y * CELL_SIZE });
    current = current.parent;
  }
  // Simplify path (remove collinear points)
  return simplifyPath(path);
}

function simplifyPath(path: PathPoint[]): PathPoint[] {
  if (path.length <= 2) return path;
  const result = [path[0]];
  for (let i = 1; i < path.length - 1; i++) {
    const prev = result[result.length - 1];
    const next = path[i + 1];
    const dx1 = path[i].x - prev.x;
    const dy1 = path[i].y - prev.y;
    const dx2 = next.x - path[i].x;
    const dy2 = next.y - path[i].y;
    if (Math.abs(dx1 * dy2 - dy1 * dx2) > 0.001) {
      result.push(path[i]);
    }
  }
  result.push(path[path.length - 1]);
  return result;
}
