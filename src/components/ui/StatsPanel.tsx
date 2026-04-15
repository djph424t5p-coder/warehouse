import React from 'react';
import { useStore } from '../../store/useStore';
import { computeStats } from '../../utils/stats';
import type { ObjectType } from '../../types';

const TYPE_LABELS: Record<ObjectType, string> = {
  wall: 'Стены', rack: 'Стеллажи', pallet: 'Паллеты', zone: 'Зоны',
  column: 'Колонны', door: 'Двери', dock: 'Доки',
};

export const StatsPanel: React.FC = React.memo(() => {
  const objects = useStore((s) => s.objects);
  const showStats = useStore((s) => s.showStats);
  const setShowStats = useStore((s) => s.setShowStats);

  if (!showStats) return null;

  const stats = computeStats(objects);

  // Count by type
  const countByType: Record<string, number> = {};
  for (const obj of objects) {
    countByType[obj.type] = (countByType[obj.type] || 0) + 1;
  }

  // Rack capacity details
  const racks = objects.filter((o) => o.type === 'rack');
  const totalSlots = racks.reduce((sum, r) => sum + (r.metadata?.levels ?? 4) * 3, 0);
  const occupiedSlots = racks.reduce((sum, r) => {
    const slots: boolean[][] = r.metadata?.slots ?? [];
    return sum + slots.flat().filter(Boolean).length;
  }, 0);
  const utilization = totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0;

  // Floor utilization (non-zone objects area vs bounding box)
  const solidArea = objects
    .filter((o) => o.type !== 'zone')
    .reduce((sum, o) => sum + o.width * o.depth, 0);
  const floorUtil = stats.area > 0 ? Math.round((solidArea / stats.area) * 100) : 0;

  // Zone info
  const zones = objects.filter((o) => o.type === 'zone');
  const zoneArea = zones.reduce((sum, z) => sum + z.width * z.depth, 0);

  const maxCount = Math.max(...Object.values(countByType), 1);

  return (
    <div className="fixed right-64 top-14 w-72 bg-white border border-gray-300 rounded-lg shadow-xl z-50 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
        <span className="text-sm font-bold text-gray-700">Статистика склада</span>
        <button onClick={() => setShowStats(false)} className="text-gray-400 hover:text-gray-700">✕</button>
      </div>

      <div className="p-3 space-y-3 max-h-[70vh] overflow-y-auto">
        {/* Overview */}
        <Section title="Общие параметры">
          <StatRow label="Размеры" value={`${stats.boundingBox.width} × ${stats.boundingBox.depth} м`} />
          <StatRow label="Площадь" value={`${stats.area} м²`} />
          <StatRow label="Всего объектов" value={`${objects.length}`} />
          <StatRow label="Зоны" value={`${zones.length} (${Math.round(zoneArea)} м²)`} />
        </Section>

        {/* Capacity */}
        <Section title="Ёмкость">
          <StatRow label="Стеллажей" value={`${racks.length}`} />
          <StatRow label="Всего паллетомест" value={`${totalSlots}`} />
          <StatRow label="Занято паллетомест" value={`${occupiedSlots}`} />
          <ProgressBar label="Загрузка стеллажей" value={utilization} color="bg-blue-500" />
        </Section>

        {/* Floor utilization */}
        <Section title="Утилизация площади">
          <StatRow label="Занято объектами" value={`${Math.round(solidArea)} м²`} />
          <ProgressBar label="Заполненность" value={floorUtil} color="bg-green-500" />
        </Section>

        {/* Object counts chart */}
        <Section title="Объекты по типам">
          {Object.entries(countByType).map(([type, count]) => (
            <div key={type} className="flex items-center gap-2 text-xs">
              <span className="w-20 text-gray-600 truncate">{TYPE_LABELS[type as ObjectType] || type}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-blue-400 rounded-full transition-all"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <span className="w-6 text-right font-semibold text-gray-700">{count}</span>
            </div>
          ))}
        </Section>
      </div>
    </div>
  );
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-bold text-gray-500 uppercase mb-1">{title}</div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-gray-700">{value}</span>
    </div>
  );
}

function ProgressBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-0.5">
        <span className="text-gray-500">{label}</span>
        <span className="font-semibold text-gray-700">{value}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
