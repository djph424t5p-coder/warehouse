import { createObject } from './defaults';
import type { WarehouseObject } from '../types';

interface Template {
  name: string;
  description: string;
  objects: () => WarehouseObject[];
}

export const WAREHOUSE_TEMPLATES: Template[] = [
  {
    name: 'Малый склад',
    description: '20×15м, 4 стеллажа, 1 док',
    objects: () => {
      const objs: WarehouseObject[] = [];
      // Walls
      objs.push(createObject('wall', 10, 0, { depth: 20, rotation: -90 }));
      objs.push(createObject('wall', 10, 15, { depth: 20, rotation: -90 }));
      objs.push(createObject('wall', 0, 7.5, { depth: 15, rotation: 0 }));
      objs.push(createObject('wall', 20, 7.5, { depth: 15, rotation: 0 }));
      // Racks
      for (let i = 0; i < 4; i++) {
        objs.push(createObject('rack', 5 + i * 4, 6));
        objs.push(createObject('rack', 5 + i * 4, 10));
      }
      // Dock
      objs.push(createObject('dock', 20, 3));
      // Door
      objs.push(createObject('door', 0, 7.5));
      // Zones
      objs.push(createObject('zone', 17, 3, { label: 'Приёмка', width: 4, depth: 4, color: '#44CC44' }));
      objs.push(createObject('zone', 17, 12, { label: 'Отгрузка', width: 4, depth: 4, color: '#CC4444' }));
      return objs;
    },
  },
  {
    name: 'Средний склад',
    description: '40×25м, 12 стеллажей, 3 дока',
    objects: () => {
      const objs: WarehouseObject[] = [];
      // Walls
      objs.push(createObject('wall', 20, 0, { depth: 40, rotation: -90 }));
      objs.push(createObject('wall', 20, 25, { depth: 40, rotation: -90 }));
      objs.push(createObject('wall', 0, 12.5, { depth: 25, rotation: 0 }));
      objs.push(createObject('wall', 40, 12.5, { depth: 25, rotation: 0 }));
      // Columns
      for (let x = 10; x <= 30; x += 10) {
        for (let y = 8; y <= 17; y += 9) {
          objs.push(createObject('column', x, y));
        }
      }
      // Racks
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
          objs.push(createObject('rack', 6 + col * 8, 5 + row * 7));
        }
      }
      // Docks
      for (let i = 0; i < 3; i++) {
        objs.push(createObject('dock', 40, 5 + i * 8));
      }
      // Door
      objs.push(createObject('door', 0, 12.5));
      // Zones
      objs.push(createObject('zone', 35, 5, { label: 'Приёмка', width: 6, depth: 4, color: '#44CC44' }));
      objs.push(createObject('zone', 35, 20, { label: 'Отгрузка', width: 6, depth: 4, color: '#CC4444' }));
      objs.push(createObject('zone', 5, 20, { label: 'Хранение', width: 8, depth: 6, color: '#4444CC' }));
      return objs;
    },
  },
  {
    name: 'Большой склад',
    description: '60×40м, 30 стеллажей, 6 доков',
    objects: () => {
      const objs: WarehouseObject[] = [];
      // Walls
      objs.push(createObject('wall', 30, 0, { depth: 60, rotation: -90 }));
      objs.push(createObject('wall', 30, 40, { depth: 60, rotation: -90 }));
      objs.push(createObject('wall', 0, 20, { depth: 40, rotation: 0 }));
      objs.push(createObject('wall', 60, 20, { depth: 40, rotation: 0 }));
      // Columns
      for (let x = 12; x <= 48; x += 12) {
        for (let y = 10; y <= 30; y += 10) {
          objs.push(createObject('column', x, y));
        }
      }
      // Racks - 6 rows of 5
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 5; col++) {
          objs.push(createObject('rack', 7 + col * 9, 5 + row * 5.5));
        }
      }
      // Docks
      for (let i = 0; i < 6; i++) {
        objs.push(createObject('dock', 60, 4 + i * 6));
      }
      // Doors
      objs.push(createObject('door', 0, 10));
      objs.push(createObject('door', 0, 30));
      // Zones
      objs.push(createObject('zone', 53, 5, { label: 'Приёмка', width: 8, depth: 6, color: '#44CC44' }));
      objs.push(createObject('zone', 53, 35, { label: 'Отгрузка', width: 8, depth: 6, color: '#CC4444' }));
      objs.push(createObject('zone', 7, 35, { label: 'Комплектация', width: 10, depth: 6, color: '#CCCC44' }));
      return objs;
    },
  },
];
