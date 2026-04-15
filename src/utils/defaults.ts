import { v4 as uuidv4 } from 'uuid';
import type { ObjectType, WarehouseObject, ObjectDefaults } from '../types';

export const OBJECT_DEFAULTS: Record<ObjectType, ObjectDefaults> = {
  wall: {
    width: 0.2,
    depth: 5,
    height: 6,
    z: 0,
    color: '#888888',
  },
  rack: {
    width: 2.7,
    depth: 1.05,
    height: 5.5,
    z: 0,
    color: '#4488CC',
    metadata: { levels: 4, beamHeight: 0.15 },
  },
  pallet: {
    width: 1.2,
    depth: 0.8,
    height: 1.5,
    z: 0,
    color: '#CC8844',
  },
  zone: {
    width: 5,
    depth: 5,
    height: 0.01,
    z: 0,
    color: '#4488CC',
    label: 'Зона',
  },
  column: {
    width: 0.4,
    depth: 0.4,
    height: 8,
    z: 0,
    color: '#999999',
  },
  door: {
    width: 2,
    depth: 0.2,
    height: 3,
    z: 0,
    color: '#44AA44',
  },
  dock: {
    width: 3.5,
    depth: 1,
    height: 1.2,
    z: 0,
    color: '#AA4444',
  },
};

export function createObject(
  type: ObjectType,
  x: number,
  y: number,
  overrides?: Partial<WarehouseObject>
): WarehouseObject {
  const defaults = OBJECT_DEFAULTS[type];
  return {
    id: uuidv4(),
    type,
    x,
    y,
    z: defaults.z,
    width: defaults.width,
    depth: defaults.depth,
    height: defaults.height,
    rotation: 0,
    color: defaults.color,
    label: defaults.label,
    metadata: defaults.metadata ? { ...defaults.metadata } : undefined,
    ...overrides,
  };
}

export const TOOL_LABELS: Record<string, string> = {
  select: 'Выбрать',
  wall: 'Стена',
  rack: 'Стеллаж',
  pallet: 'Паллета',
  zone: 'Зона',
  column: 'Колонна',
  door: 'Дверь',
  dock: 'Док',
  measure: 'Измерение',
  path: 'Маршрут',
};

export const TOOL_ICONS: Record<string, string> = {
  select: '⊹',
  wall: '▬',
  rack: '▦',
  pallet: '▤',
  zone: '◻',
  column: '◼',
  door: '▯',
  dock: '▥',
  measure: '⤢',
  path: '⇝',
};
