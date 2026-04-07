import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import type { Tool } from '../types';

const TOOL_KEYS: Record<string, Tool> = {
  '1': 'select',
  '2': 'wall',
  '3': 'rack',
  '4': 'pallet',
  '5': 'zone',
  '6': 'column',
  '7': 'door',
  '8': 'dock',
  '9': 'measure',
};

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }

      const store = useStore.getState();

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (store.selectedIds.length > 0) {
          e.preventDefault();
          store.deleteObjects(store.selectedIds);
        }
        return;
      }

      if (e.key === 'd' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (store.selectedIds.length > 0) {
          store.duplicateObjects(store.selectedIds);
        }
        return;
      }

      if (e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        store.redo();
        return;
      }

      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        store.undo();
        return;
      }

      if (e.key === 'r' && !e.ctrlKey && !e.metaKey) {
        if (store.selectedIds.length > 0) {
          e.preventDefault();
          store.rotateObjects(store.selectedIds, 90);
        }
        return;
      }

      if (e.key === 'Escape') {
        store.clearSelection();
        store.setTool('select');
        return;
      }

      const toolKey = TOOL_KEYS[e.key];
      if (toolKey) {
        store.setTool(toolKey);
        return;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}
