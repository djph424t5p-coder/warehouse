export type ObjectType = 'wall' | 'rack' | 'pallet' | 'zone' | 'column' | 'door' | 'dock';

export interface WarehouseObject {
  id: string;
  type: ObjectType;
  x: number;
  y: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  rotation: number;
  color: string;
  label?: string;
  metadata?: Record<string, any>;
}

export type Tool = 'select' | 'wall' | 'rack' | 'pallet' | 'zone' | 'column' | 'door' | 'dock' | 'measure';

export type EditorMode = '2d' | '3d';

export interface ObjectDefaults {
  width: number;
  depth: number;
  height: number;
  z: number;
  color: string;
  label?: string;
  metadata?: Record<string, any>;
}
