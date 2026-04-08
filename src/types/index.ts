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
  locked?: boolean;
  layer?: string;
}

export type Tool = 'select' | 'wall' | 'rack' | 'pallet' | 'zone' | 'column' | 'door' | 'dock' | 'measure' | 'path';

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

export interface Annotation {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
}

export interface WalkthroughCamera {
  x: number;
  y: number;
  z: number;
  rotationY: number;
  pitch: number;
}
