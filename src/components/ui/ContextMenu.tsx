import React, { useEffect } from 'react';
import { useStore } from '../../store/useStore';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = React.memo(({ x, y, onClose }) => {
  const selectedIds = useStore((s) => s.selectedIds);
  const duplicateObjects = useStore((s) => s.duplicateObjects);
  const deleteObjects = useStore((s) => s.deleteObjects);
  const rotateObjects = useStore((s) => s.rotateObjects);

  useEffect(() => {
    const handler = () => onClose();
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [onClose]);

  if (selectedIds.length === 0) return null;

  return (
    <div
      className="fixed bg-white border border-gray-300 rounded shadow-lg py-1 z-[100] min-w-[160px]"
      style={{ left: x, top: y }}
    >
      <button
        className="w-full text-left px-3 py-1.5 text-sm hover:bg-blue-50 text-gray-700"
        onClick={(e) => {
          e.stopPropagation();
          duplicateObjects(selectedIds);
          onClose();
        }}
      >
        Дублировать
      </button>
      <button
        className="w-full text-left px-3 py-1.5 text-sm hover:bg-blue-50 text-gray-700"
        onClick={(e) => {
          e.stopPropagation();
          rotateObjects(selectedIds, 90);
          onClose();
        }}
      >
        Повернуть на 90°
      </button>
      <hr className="my-1 border-gray-200" />
      <button
        className="w-full text-left px-3 py-1.5 text-sm hover:bg-red-50 text-red-600"
        onClick={(e) => {
          e.stopPropagation();
          deleteObjects(selectedIds);
          onClose();
        }}
      >
        Удалить
      </button>
    </div>
  );
});
