import React from 'react';
import { useStore } from '../../store/useStore';
import { computeStats } from '../../utils/stats';

export const Footer: React.FC = React.memo(() => {
  const cursorPos = useStore((s) => s.cursorPos);
  const objects = useStore((s) => s.objects);
  const history = useStore((s) => s.history);
  const future = useStore((s) => s.future);
  const stats = React.useMemo(() => computeStats(objects), [objects]);

  return (
    <footer className="h-7 bg-gray-800 text-gray-300 flex items-center px-4 gap-6 text-xs shrink-0 z-50">
      <span>
        Курсор: {cursorPos.x.toFixed(1)}м, {cursorPos.y.toFixed(1)}м
      </span>
      <span>Объектов: {objects.length}</span>
      <span>
        Склад: {stats.boundingBox.width}×{stats.boundingBox.depth}м
      </span>
      <span>Площадь: {stats.area}м²</span>
      <span>Паллетомест: {stats.rackSlots}</span>
      <span>Паллет: {stats.palletPositions}</span>
      <span className="ml-auto text-gray-500">
        Undo: {history.length} | Redo: {future.length}
      </span>
    </footer>
  );
});
