import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { WarehouseObject, Tool, EditorMode, Annotation } from '../types';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/saveLoad';
import { findPath, type PathPoint } from '../utils/pathfinding';

const MAX_HISTORY = 50;

interface MeasurePoint {
  x: number;
  y: number;
}

interface WarehouseState {
  objects: WarehouseObject[];
  selectedIds: string[];
  tool: Tool;
  mode: EditorMode;
  gridSize: number;
  snapToGrid: boolean;
  history: WarehouseObject[][];
  future: WarehouseObject[][];
  cursorPos: { x: number; y: number };
  measurePoints: MeasurePoint[];
  clipboard: WarehouseObject[];
  annotations: Annotation[];
  layers: { name: string; visible: boolean }[];
  activeLayer: string;
  walkthrough: boolean;
  showCollisions: boolean;
  pathPoints: MeasurePoint[];
  computedPath: PathPoint[] | null;
  showStats: boolean;

  addObject: (obj: WarehouseObject) => void;
  updateObject: (id: string, changes: Partial<WarehouseObject>) => void;
  updateObjects: (updates: { id: string; changes: Partial<WarehouseObject> }[]) => void;
  deleteObjects: (ids: string[]) => void;
  duplicateObjects: (ids: string[]) => void;
  rotateObjects: (ids: string[], degrees: number) => void;

  setSelectedIds: (ids: string[]) => void;
  toggleSelection: (id: string) => void;
  clearSelection: () => void;

  setTool: (tool: Tool) => void;
  setMode: (mode: EditorMode) => void;
  setGridSize: (size: number) => void;
  toggleSnap: () => void;
  setCursorPos: (pos: { x: number; y: number }) => void;

  addMeasurePoint: (point: MeasurePoint) => void;
  clearMeasurePoints: () => void;

  copyToClipboard: () => void;
  pasteFromClipboard: (offsetX?: number, offsetY?: number) => void;

  lockObjects: (ids: string[]) => void;
  unlockObjects: (ids: string[]) => void;

  addAnnotation: (annotation: Annotation) => void;
  deleteAnnotation: (id: string) => void;
  updateAnnotation: (id: string, changes: Partial<Annotation>) => void;

  addLayer: (name: string) => void;
  removeLayer: (name: string) => void;
  toggleLayerVisibility: (name: string) => void;
  setActiveLayer: (name: string) => void;

  setWalkthrough: (on: boolean) => void;
  setShowCollisions: (on: boolean) => void;
  setShowStats: (on: boolean) => void;

  addPathPoint: (point: MeasurePoint) => void;
  clearPath: () => void;

  alignObjects: (ids: string[], alignment: 'left' | 'right' | 'top' | 'bottom' | 'center-h' | 'center-v') => void;
  distributeObjects: (ids: string[], axis: 'horizontal' | 'vertical') => void;

  generateAisles: (rackIds: string[], aisleWidth: number) => void;

  undo: () => void;
  redo: () => void;
  saveSnapshot: () => void;

  loadState: (objects: WarehouseObject[]) => void;
  clearAll: () => void;
}

const initialObjects = loadFromLocalStorage() || [];

let saveTimeout: ReturnType<typeof setTimeout> | null = null;
function debouncedSave(objects: WarehouseObject[]) {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => saveToLocalStorage(objects), 500);
}

export const useStore = create<WarehouseState>((set, get) => ({
  objects: initialObjects,
  selectedIds: [],
  tool: 'select',
  mode: '2d',
  gridSize: 1,
  snapToGrid: true,
  history: [],
  future: [],
  cursorPos: { x: 0, y: 0 },
  measurePoints: [],
  clipboard: [],
  annotations: [],
  layers: [{ name: 'default', visible: true }],
  activeLayer: 'default',
  walkthrough: false,
  showCollisions: false,
  pathPoints: [],
  computedPath: null,
  showStats: false,

  saveSnapshot: () => {
    const { objects, history } = get();
    const newHistory = [...history, objects.map((o) => ({ ...o }))];
    if (newHistory.length > MAX_HISTORY) newHistory.shift();
    set({ history: newHistory, future: [] });
  },

  addObject: (obj) => {
    get().saveSnapshot();
    const withLayer = { ...obj, layer: obj.layer || get().activeLayer };
    const newObjects = [...get().objects, withLayer];
    set({ objects: newObjects });
    debouncedSave(newObjects);
  },

  updateObject: (id, changes) => {
    const obj = get().objects.find((o) => o.id === id);
    if (obj?.locked) return;
    get().saveSnapshot();
    const newObjects = get().objects.map((o) =>
      o.id === id ? { ...o, ...changes } : o
    );
    set({ objects: newObjects });
    debouncedSave(newObjects);
  },

  updateObjects: (updates) => {
    get().saveSnapshot();
    const lockedIds = new Set(get().objects.filter((o) => o.locked).map((o) => o.id));
    const updateMap = new Map(updates.filter((u) => !lockedIds.has(u.id)).map((u) => [u.id, u.changes]));
    const newObjects = get().objects.map((o) => {
      const changes = updateMap.get(o.id);
      return changes ? { ...o, ...changes } : o;
    });
    set({ objects: newObjects });
    debouncedSave(newObjects);
  },

  deleteObjects: (ids) => {
    const lockedIds = new Set(get().objects.filter((o) => o.locked).map((o) => o.id));
    const toDelete = ids.filter((id) => !lockedIds.has(id));
    if (toDelete.length === 0) return;
    get().saveSnapshot();
    const idSet = new Set(toDelete);
    const newObjects = get().objects.filter((o) => !idSet.has(o.id));
    set({
      objects: newObjects,
      selectedIds: get().selectedIds.filter((id) => !idSet.has(id)),
    });
    debouncedSave(newObjects);
  },

  duplicateObjects: (ids) => {
    get().saveSnapshot();
    const idSet = new Set(ids);
    const dupes = get()
      .objects.filter((o) => idSet.has(o.id))
      .map((o) => ({ ...o, id: uuidv4(), x: o.x + 1, y: o.y + 1, locked: false }));
    const newObjects = [...get().objects, ...dupes];
    set({
      objects: newObjects,
      selectedIds: dupes.map((d) => d.id),
    });
    debouncedSave(newObjects);
  },

  rotateObjects: (ids, degrees) => {
    const lockedIds = new Set(get().objects.filter((o) => o.locked).map((o) => o.id));
    const toRotate = ids.filter((id) => !lockedIds.has(id));
    if (toRotate.length === 0) return;
    get().saveSnapshot();
    const idSet = new Set(toRotate);
    const newObjects = get().objects.map((o) =>
      idSet.has(o.id) ? { ...o, rotation: (o.rotation + degrees) % 360 } : o
    );
    set({ objects: newObjects });
    debouncedSave(newObjects);
  },

  setSelectedIds: (ids) => set({ selectedIds: ids }),
  toggleSelection: (id) => {
    const { selectedIds } = get();
    if (selectedIds.includes(id)) {
      set({ selectedIds: selectedIds.filter((sid) => sid !== id) });
    } else {
      set({ selectedIds: [...selectedIds, id] });
    }
  },
  clearSelection: () => set({ selectedIds: [] }),

  setTool: (tool) => set({ tool, measurePoints: [] }),
  setMode: (mode) => set({ mode }),
  setGridSize: (gridSize) => set({ gridSize }),
  toggleSnap: () => set({ snapToGrid: !get().snapToGrid }),
  setCursorPos: (cursorPos) => set({ cursorPos }),

  addMeasurePoint: (point) => {
    const { measurePoints } = get();
    if (measurePoints.length >= 2) {
      set({ measurePoints: [point] });
    } else {
      set({ measurePoints: [...measurePoints, point] });
    }
  },
  clearMeasurePoints: () => set({ measurePoints: [] }),

  copyToClipboard: () => {
    const { objects, selectedIds } = get();
    const selected = objects.filter((o) => selectedIds.includes(o.id));
    set({ clipboard: selected.map((o) => ({ ...o })) });
  },

  pasteFromClipboard: (offsetX = 2, offsetY = 2) => {
    const { clipboard } = get();
    if (clipboard.length === 0) return;
    get().saveSnapshot();
    const pasted = clipboard.map((o) => ({
      ...o,
      id: uuidv4(),
      x: o.x + offsetX,
      y: o.y + offsetY,
      locked: false,
    }));
    const newObjects = [...get().objects, ...pasted];
    set({
      objects: newObjects,
      selectedIds: pasted.map((p) => p.id),
    });
    debouncedSave(newObjects);
  },

  lockObjects: (ids) => {
    const idSet = new Set(ids);
    const newObjects = get().objects.map((o) =>
      idSet.has(o.id) ? { ...o, locked: true } : o
    );
    set({ objects: newObjects });
    debouncedSave(newObjects);
  },

  unlockObjects: (ids) => {
    const idSet = new Set(ids);
    const newObjects = get().objects.map((o) =>
      idSet.has(o.id) ? { ...o, locked: false } : o
    );
    set({ objects: newObjects });
    debouncedSave(newObjects);
  },

  addAnnotation: (annotation) => {
    set({ annotations: [...get().annotations, annotation] });
  },
  deleteAnnotation: (id) => {
    set({ annotations: get().annotations.filter((a) => a.id !== id) });
  },
  updateAnnotation: (id, changes) => {
    set({
      annotations: get().annotations.map((a) =>
        a.id === id ? { ...a, ...changes } : a
      ),
    });
  },

  addLayer: (name) => {
    if (get().layers.find((l) => l.name === name)) return;
    set({ layers: [...get().layers, { name, visible: true }] });
  },
  removeLayer: (name) => {
    if (name === 'default') return;
    set({ layers: get().layers.filter((l) => l.name !== name) });
    // Move objects from removed layer to default
    const newObjects = get().objects.map((o) =>
      o.layer === name ? { ...o, layer: 'default' } : o
    );
    set({ objects: newObjects });
    if (get().activeLayer === name) set({ activeLayer: 'default' });
  },
  toggleLayerVisibility: (name) => {
    set({
      layers: get().layers.map((l) =>
        l.name === name ? { ...l, visible: !l.visible } : l
      ),
    });
  },
  setActiveLayer: (name) => set({ activeLayer: name }),

  setWalkthrough: (on) => set({ walkthrough: on }),
  setShowCollisions: (on) => set({ showCollisions: on }),
  setShowStats: (on) => set({ showStats: on }),

  addPathPoint: (point) => {
    const { pathPoints, objects } = get();
    if (pathPoints.length >= 2) {
      set({ pathPoints: [point], computedPath: null });
    } else if (pathPoints.length === 1) {
      const newPoints = [...pathPoints, point];
      const path = findPath(pathPoints[0].x, pathPoints[0].y, point.x, point.y, objects);
      set({ pathPoints: newPoints, computedPath: path });
    } else {
      set({ pathPoints: [point], computedPath: null });
    }
  },
  clearPath: () => set({ pathPoints: [], computedPath: null }),

  alignObjects: (ids, alignment) => {
    const objs = get().objects.filter((o) => ids.includes(o.id) && !o.locked);
    if (objs.length < 2) return;
    get().saveSnapshot();

    let target: number;
    switch (alignment) {
      case 'left':
        target = Math.min(...objs.map((o) => o.x - o.width / 2));
        break;
      case 'right':
        target = Math.max(...objs.map((o) => o.x + o.width / 2));
        break;
      case 'top':
        target = Math.min(...objs.map((o) => o.y - o.depth / 2));
        break;
      case 'bottom':
        target = Math.max(...objs.map((o) => o.y + o.depth / 2));
        break;
      case 'center-h':
        target = objs.reduce((s, o) => s + o.x, 0) / objs.length;
        break;
      case 'center-v':
        target = objs.reduce((s, o) => s + o.y, 0) / objs.length;
        break;
    }

    const idSet = new Set(ids);
    const newObjects = get().objects.map((o) => {
      if (!idSet.has(o.id) || o.locked) return o;
      switch (alignment) {
        case 'left': return { ...o, x: target + o.width / 2 };
        case 'right': return { ...o, x: target - o.width / 2 };
        case 'top': return { ...o, y: target + o.depth / 2 };
        case 'bottom': return { ...o, y: target - o.depth / 2 };
        case 'center-h': return { ...o, x: target };
        case 'center-v': return { ...o, y: target };
      }
    });
    set({ objects: newObjects });
    debouncedSave(newObjects);
  },

  distributeObjects: (ids, axis) => {
    const objs = get().objects.filter((o) => ids.includes(o.id) && !o.locked);
    if (objs.length < 3) return;
    get().saveSnapshot();

    const sorted = [...objs].sort((a, b) => axis === 'horizontal' ? a.x - b.x : a.y - b.y);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const total = axis === 'horizontal' ? last.x - first.x : last.y - first.y;
    const step = total / (sorted.length - 1);

    const posMap = new Map<string, number>();
    sorted.forEach((o, i) => {
      posMap.set(o.id, (axis === 'horizontal' ? first.x : first.y) + i * step);
    });

    const newObjects = get().objects.map((o) => {
      const pos = posMap.get(o.id);
      if (pos === undefined) return o;
      return axis === 'horizontal' ? { ...o, x: pos } : { ...o, y: pos };
    });
    set({ objects: newObjects });
    debouncedSave(newObjects);
  },

  generateAisles: (rackIds, aisleWidth) => {
    const racks = get().objects.filter((o) => rackIds.includes(o.id) && o.type === 'rack');
    if (racks.length < 2) return;
    get().saveSnapshot();

    const sorted = [...racks].sort((a, b) => a.y - b.y);
    const aisles: WarehouseObject[] = [];

    for (let i = 0; i < sorted.length - 1; i++) {
      const r1 = sorted[i];
      const r2 = sorted[i + 1];
      const gap = (r2.y - r2.depth / 2) - (r1.y + r1.depth / 2);
      if (gap > 0.5) {
        const cx = (r1.x + r2.x) / 2;
        const cy = (r1.y + r1.depth / 2 + r2.y - r2.depth / 2) / 2;
        const width = Math.max(r1.width, r2.width) + 1;
        aisles.push({
          id: uuidv4(),
          type: 'zone',
          x: cx,
          y: cy,
          z: 0,
          width,
          depth: Math.min(gap, aisleWidth),
          height: 0.01,
          rotation: 0,
          color: '#FFaa00',
          label: `Проход ${i + 1}`,
          layer: get().activeLayer,
        });
      }
    }

    const newObjects = [...get().objects, ...aisles];
    set({ objects: newObjects });
    debouncedSave(newObjects);
  },

  undo: () => {
    const { history, objects, future } = get();
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    set({
      history: history.slice(0, -1),
      future: [objects, ...future],
      objects: prev,
    });
    debouncedSave(prev);
  },

  redo: () => {
    const { future, objects, history } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({
      future: future.slice(1),
      history: [...history, objects],
      objects: next,
    });
    debouncedSave(next);
  },

  loadState: (objects) => {
    set({ objects, selectedIds: [], history: [], future: [] });
    debouncedSave(objects);
  },

  clearAll: () => {
    get().saveSnapshot();
    set({ objects: [], selectedIds: [], annotations: [] });
    debouncedSave([]);
  },
}));
