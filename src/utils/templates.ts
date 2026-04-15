import { createObject } from './defaults';
import type { WarehouseObject } from '../types';

interface Template {
  name: string;
  description: string;
  objects: () => WarehouseObject[];
}

// Helper: create a pair of back-to-back racks (common in real warehouses)
function rackPair(cx: number, cy: number, rackWidth: number): WarehouseObject[] {
  const gap = 0.1; // gap between back-to-back racks
  const depth = 1.05;
  return [
    createObject('rack', cx, cy - depth / 2 - gap / 2, { width: rackWidth }),
    createObject('rack', cx, cy + depth / 2 + gap / 2, { width: rackWidth }),
  ];
}

export const WAREHOUSE_TEMPLATES: Template[] = [
  {
    name: 'Малый склад',
    description: '24×16м, 2 ряда стеллажей, 1 док',
    objects: () => {
      const objs: WarehouseObject[] = [];
      const W = 24, H = 16;

      // Walls
      objs.push(createObject('wall', W / 2, 0, { depth: W, rotation: -90 }));
      objs.push(createObject('wall', W / 2, H, { depth: W, rotation: -90 }));
      objs.push(createObject('wall', 0, H / 2, { depth: H, rotation: 0 }));
      objs.push(createObject('wall', W, H / 2, { depth: H, rotation: 0 }));

      // 2 rows of rack pairs, each 10m long
      objs.push(...rackPair(8, 5, 10));
      objs.push(...rackPair(8, 10, 10));

      // Dock + Door
      objs.push(createObject('dock', W, 3));
      objs.push(createObject('door', 0, H / 2));

      // Zones
      objs.push(createObject('zone', 20, 3, { label: 'Приёмка', width: 5, depth: 4, color: '#44CC44' }));
      objs.push(createObject('zone', 20, 13, { label: 'Отгрузка', width: 5, depth: 4, color: '#CC4444' }));

      return objs;
    },
  },
  {
    name: 'Средний склад',
    description: '48×30м, 4 ряда стеллажей, 3 дока',
    objects: () => {
      const objs: WarehouseObject[] = [];
      const W = 48, H = 30;

      // Walls
      objs.push(createObject('wall', W / 2, 0, { depth: W, rotation: -90 }));
      objs.push(createObject('wall', W / 2, H, { depth: W, rotation: -90 }));
      objs.push(createObject('wall', 0, H / 2, { depth: H, rotation: 0 }));
      objs.push(createObject('wall', W, H / 2, { depth: H, rotation: 0 }));

      // Columns (structural grid 12m)
      for (let x = 12; x < W; x += 12) {
        for (let y = 10; y <= 20; y += 10) {
          objs.push(createObject('column', x, y));
        }
      }

      // 4 rows of rack pairs, each 20m long, with 3m aisles between pairs
      const rackLen = 20;
      const rackCenterX = 14;
      const startY = 5;
      const pairSpacing = 5.2; // depth of pair (2×1.05+0.1) + aisle width (3m)

      for (let row = 0; row < 4; row++) {
        objs.push(...rackPair(rackCenterX, startY + row * pairSpacing, rackLen));
      }

      // Docks
      for (let i = 0; i < 3; i++) {
        objs.push(createObject('dock', W, 5 + i * 10));
      }

      // Door
      objs.push(createObject('door', 0, H / 2));

      // Zones
      objs.push(createObject('zone', 40, 4, { label: 'Приёмка', width: 10, depth: 5, color: '#44CC44' }));
      objs.push(createObject('zone', 40, 26, { label: 'Отгрузка', width: 10, depth: 5, color: '#CC4444' }));
      objs.push(createObject('zone', 6, 26, { label: 'Хранение', width: 8, depth: 5, color: '#4444CC' }));

      return objs;
    },
  },
  {
    name: 'Большой склад',
    description: '72×48м, 8 рядов стеллажей, 6 доков',
    objects: () => {
      const objs: WarehouseObject[] = [];
      const W = 72, H = 48;

      // Walls
      objs.push(createObject('wall', W / 2, 0, { depth: W, rotation: -90 }));
      objs.push(createObject('wall', W / 2, H, { depth: W, rotation: -90 }));
      objs.push(createObject('wall', 0, H / 2, { depth: H, rotation: 0 }));
      objs.push(createObject('wall', W, H / 2, { depth: H, rotation: 0 }));

      // Columns (structural grid 12m)
      for (let x = 12; x < W; x += 12) {
        for (let y = 12; y <= 36; y += 12) {
          objs.push(createObject('column', x, y));
        }
      }

      // 8 rows of rack pairs, each 30m long
      const rackLen = 30;
      const rackCenterX = 20;
      const startY = 5;
      const pairSpacing = 5.2;

      for (let row = 0; row < 8; row++) {
        objs.push(...rackPair(rackCenterX, startY + row * pairSpacing, rackLen));
      }

      // Docks along right wall
      for (let i = 0; i < 6; i++) {
        objs.push(createObject('dock', W, 5 + i * 7));
      }

      // Doors
      objs.push(createObject('door', 0, 12));
      objs.push(createObject('door', 0, 36));

      // Zones
      objs.push(createObject('zone', 60, 5, { label: 'Приёмка', width: 14, depth: 7, color: '#44CC44' }));
      objs.push(createObject('zone', 60, 42, { label: 'Отгрузка', width: 14, depth: 7, color: '#CC4444' }));
      objs.push(createObject('zone', 8, 42, { label: 'Комплектация', width: 12, depth: 7, color: '#CCCC44' }));
      objs.push(createObject('zone', 50, 24, { label: 'Буферная зона', width: 10, depth: 6, color: '#44AACC' }));

      return objs;
    },
  },
];
