import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useStore } from '../../store/useStore';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = React.memo(({ x, y, onClose }) => {
  const selectedIds = useStore((s) => s.selectedIds);
  const objects = useStore((s) => s.objects);
  const duplicateObjects = useStore((s) => s.duplicateObjects);
  const deleteObjects = useStore((s) => s.deleteObjects);
  const rotateObjects = useStore((s) => s.rotateObjects);
  const lockObjects = useStore((s) => s.lockObjects);
  const unlockObjects = useStore((s) => s.unlockObjects);
  const addAnnotation = useStore((s) => s.addAnnotation);
  const generateAisles = useStore((s) => s.generateAisles);

  useEffect(() => {
    const handler = () => onClose();
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [onClose]);

  if (selectedIds.length === 0) return null;

  const selectedObjects = objects.filter((o) => selectedIds.includes(o.id));
  const anyLocked = selectedObjects.some((o) => o.locked);
  const allRacks = selectedObjects.every((o) => o.type === 'rack');

  return (
    <div
      className="fixed bg-white border border-gray-300 rounded shadow-lg py-1 z-[100] min-w-[180px]"
      style={{ left: x, top: y }}
    >
      <button
        className="w-full text-left px-3 py-1.5 text-sm hover:bg-blue-50 text-gray-700"
        onClick={(e) => { e.stopPropagation(); duplicateObjects(selectedIds); onClose(); }}
      >Дублировать <span className="text-gray-400 text-xs ml-2">Ctrl+D</span></button>

      <button
        className="w-full text-left px-3 py-1.5 text-sm hover:bg-blue-50 text-gray-700"
        onClick={(e) => { e.stopPropagation(); rotateObjects(selectedIds, 90); onClose(); }}
      >Повернуть на 90° <span className="text-gray-400 text-xs ml-2">R</span></button>

      <hr className="my-1 border-gray-200" />

      {anyLocked ? (
        <button
          className="w-full text-left px-3 py-1.5 text-sm hover:bg-blue-50 text-gray-700"
          onClick={(e) => { e.stopPropagation(); unlockObjects(selectedIds); onClose(); }}
        >🔓 Разблокировать <span className="text-gray-400 text-xs ml-2">Ctrl+L</span></button>
      ) : (
        <button
          className="w-full text-left px-3 py-1.5 text-sm hover:bg-blue-50 text-gray-700"
          onClick={(e) => { e.stopPropagation(); lockObjects(selectedIds); onClose(); }}
        >🔒 Заблокировать <span className="text-gray-400 text-xs ml-2">Ctrl+L</span></button>
      )}

      <button
        className="w-full text-left px-3 py-1.5 text-sm hover:bg-blue-50 text-gray-700"
        onClick={(e) => {
          e.stopPropagation();
          const text = prompt('Текст аннотации:');
          if (text) {
            const obj = selectedObjects[0];
            addAnnotation({ id: uuidv4(), x: obj.x, y: obj.y, text, color: '#ff6600' });
          }
          onClose();
        }}
      >📝 Добавить аннотацию</button>

      {allRacks && selectedIds.length >= 2 && (
        <button
          className="w-full text-left px-3 py-1.5 text-sm hover:bg-blue-50 text-gray-700"
          onClick={(e) => { e.stopPropagation(); generateAisles(selectedIds, 3); onClose(); }}
        >🔀 Создать проходы</button>
      )}

      <hr className="my-1 border-gray-200" />

      <button
        className="w-full text-left px-3 py-1.5 text-sm hover:bg-red-50 text-red-600"
        onClick={(e) => { e.stopPropagation(); deleteObjects(selectedIds); onClose(); }}
      >Удалить <span className="text-gray-400 text-xs ml-2">Del</span></button>
    </div>
  );
});
