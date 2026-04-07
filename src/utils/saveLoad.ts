import type { WarehouseObject } from '../types';

export function exportToJSON(objects: WarehouseObject[]) {
  const data = JSON.stringify(objects, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'warehouse.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function importFromJSON(file: File): Promise<WarehouseObject[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (Array.isArray(data)) {
          resolve(data as WarehouseObject[]);
        } else {
          reject(new Error('Invalid format'));
        }
      } catch {
        reject(new Error('Invalid JSON'));
      }
    };
    reader.onerror = () => reject(new Error('Read error'));
    reader.readAsText(file);
  });
}

const STORAGE_KEY = 'warehouse-objects';

export function saveToLocalStorage(objects: WarehouseObject[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(objects));
  } catch {
    // Storage full or unavailable
  }
}

export function loadFromLocalStorage(): WarehouseObject[] | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Invalid data
  }
  return null;
}
