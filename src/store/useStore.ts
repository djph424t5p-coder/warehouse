import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { WarehouseObject, Tool, EditorMode } from '../types';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/saveLoad';

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

  // Actions
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

  saveSnapshot: () => {
    const { objects, history } = get();
    const newHistory = [...history, objects.map((o) => ({ ...o }))];
    if (newHistory.length > MAX_HISTORY) newHistory.shift();
    set({ history: newHistory, future: [] });
  },

  addObject: (obj) => {
    get().saveSnapshot();
    const newObjects = [...get().objects, obj];
    set({ objects: newObjects });
    debouncedSave(newObjects);
  },

  updateObject: (id, changes) => {
    get().saveSnapshot();
    const newObjects = get().objects.map((o) =>
      o.id === id ? { ...o, ...changes } : o
    );
    set({ objects: newObjects });
    debouncedSave(newObjects);
  },

  updateObjects: (updates) => {
    get().saveSnapshot();
    const updateMap = new Map(updates.map((u) => [u.id, u.changes]));
    const newObjects = get().objects.map((o) => {
      const changes = updateMap.get(o.id);
      return changes ? { ...o, ...changes } : o;
    });
    set({ objects: newObjects });
    debouncedSave(newObjects);
  },

  deleteObjects: (ids) => {
    get().saveSnapshot();
    const idSet = new Set(ids);
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
      .map((o) => ({ ...o, id: uuidv4(), x: o.x + 1, y: o.y + 1 }));
    const newObjects = [...get().objects, ...dupes];
    set({
      objects: newObjects,
      selectedIds: dupes.map((d) => d.id),
    });
    debouncedSave(newObjects);
  },

  rotateObjects: (ids, degrees) => {
    get().saveSnapshot();
    const idSet = new Set(ids);
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

  undo: () => {
    const { history, objects, future } = get();
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    const newObjects = prev;
    set({
      history: newHistory,
      future: [objects, ...future],
      objects: newObjects,
    });
    debouncedSave(newObjects);
  },

  redo: () => {
    const { future, objects, history } = get();
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    set({
      future: newFuture,
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
    set({ objects: [], selectedIds: [] });
    debouncedSave([]);
  },
}));
