import React from 'react';
import { useStore } from '../../store/useStore';
import { TOOL_LABELS } from '../../utils/defaults';
import { checkCollisions } from '../../utils/collision';
import type { WarehouseObject } from '../../types';

export const PropertiesPanel: React.FC = React.memo(() => {
  const selectedIds = useStore((s) => s.selectedIds);
  const objects = useStore((s) => s.objects);
  const updateObject = useStore((s) => s.updateObject);
  const lockObjects = useStore((s) => s.lockObjects);
  const unlockObjects = useStore((s) => s.unlockObjects);
  const layers = useStore((s) => s.layers);
  const showCollisions = useStore((s) => s.showCollisions);
  const [collapsed, setCollapsed] = React.useState(false);

  const selectedObjects = objects.filter((o) => selectedIds.includes(o.id));

  if (collapsed) {
    return (
      <div className="w-8 bg-gray-100 border-l border-gray-300 flex flex-col items-center pt-2 shrink-0">
        <button onClick={() => setCollapsed(false)} className="text-gray-600 hover:text-gray-900 text-sm">◀</button>
      </div>
    );
  }

  if (selectedObjects.length === 0) {
    return (
      <div className="w-60 bg-gray-100 border-l border-gray-300 flex flex-col shrink-0">
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-300">
          <span className="text-xs font-bold text-gray-600 uppercase">Свойства</span>
          <button onClick={() => setCollapsed(true)} className="text-gray-400 hover:text-gray-700 text-sm">▶</button>
        </div>
        <div className="p-3 text-xs text-gray-400 italic">Выберите объект</div>
      </div>
    );
  }

  const obj = selectedObjects[0];
  const multi = selectedObjects.length > 1;
  const collisions = showCollisions ? checkCollisions(obj, objects) : [];

  const handleChange = (field: string, value: string | number | boolean) => {
    if (multi) {
      selectedObjects.forEach((o) => updateObject(o.id, { [field]: value }));
    } else {
      updateObject(obj.id, { [field]: value });
    }
  };

  const handleNumberChange = (field: string, raw: string) => {
    const v = parseFloat(raw);
    if (!isNaN(v)) handleChange(field, v);
  };

  return (
    <div className="w-60 bg-gray-100 border-l border-gray-300 flex flex-col shrink-0 overflow-y-auto">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-300">
        <span className="text-xs font-bold text-gray-600 uppercase">Свойства</span>
        <button onClick={() => setCollapsed(true)} className="text-gray-400 hover:text-gray-700 text-sm">▶</button>
      </div>

      <div className="p-3 space-y-2">
        <div className="text-xs font-semibold text-gray-700">
          {multi
            ? `Выбрано: ${selectedObjects.length} объектов`
            : `${TOOL_LABELS[obj.type]} (${obj.id.slice(0, 8)})`}
        </div>

        {/* Distance between 2 objects */}
        {selectedObjects.length === 2 && (
          <DistanceInfo obj1={selectedObjects[0]} obj2={selectedObjects[1]} />
        )}

        {/* Lock controls */}
        <div className="flex gap-1">
          {selectedObjects.some((o) => !o.locked) && (
            <button
              onClick={() => lockObjects(selectedIds)}
              className="flex-1 text-xs px-2 py-1 bg-yellow-100 border border-yellow-300 rounded hover:bg-yellow-200"
            >Заблокировать</button>
          )}
          {selectedObjects.some((o) => o.locked) && (
            <button
              onClick={() => unlockObjects(selectedIds)}
              className="flex-1 text-xs px-2 py-1 bg-green-100 border border-green-300 rounded hover:bg-green-200"
            >Разблокировать</button>
          )}
        </div>

        {!multi && (
          <>
            <Field label="Тип" value={TOOL_LABELS[obj.type]} readOnly />
            <NumberField label="X (м)" value={obj.x} onChange={(v) => handleNumberChange('x', v)} />
            <NumberField label="Y (м)" value={obj.y} onChange={(v) => handleNumberChange('y', v)} />
            <NumberField label="Ширина (м)" value={obj.width} onChange={(v) => handleNumberChange('width', v)} />
            <NumberField label="Глубина (м)" value={obj.depth} onChange={(v) => handleNumberChange('depth', v)} />
            <NumberField label="Высота (м)" value={obj.height} onChange={(v) => handleNumberChange('height', v)} />
            <NumberField label="Поворот (°)" value={obj.rotation} onChange={(v) => handleNumberChange('rotation', v)} />
            <div>
              <label className="text-xs text-gray-500">Цвет</label>
              <input
                type="color"
                value={obj.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-full h-7 rounded border border-gray-300 cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Метка</label>
              <input
                type="text"
                value={obj.label || ''}
                onChange={(e) => handleChange('label', e.target.value)}
                className="w-full text-xs px-2 py-1 border border-gray-300 rounded bg-white"
                placeholder="Без метки"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Слой</label>
              <select
                value={obj.layer || 'default'}
                onChange={(e) => handleChange('layer', e.target.value)}
                className="w-full text-xs px-2 py-1 border border-gray-300 rounded bg-white"
              >
                {layers.map((l) => (
                  <option key={l.name} value={l.name}>{l.name}</option>
                ))}
              </select>
            </div>
            {obj.type === 'rack' && (
              <>
                <NumberField
                  label="Уровни"
                  value={obj.metadata?.levels ?? 4}
                  onChange={(v) => {
                    const val = parseInt(v);
                    if (!isNaN(val) && val > 0) {
                      updateObject(obj.id, { metadata: { ...obj.metadata, levels: val } });
                    }
                  }}
                />
                <RackSlotEditor obj={obj} updateObject={updateObject} />
              </>
            )}
            {showCollisions && collisions.length > 0 && (
              <div className="p-2 bg-red-50 border border-red-200 rounded">
                <div className="text-xs font-semibold text-red-600">Пересечения ({collisions.length})</div>
                {collisions.map((c) => (
                  <div key={c.id} className="text-xs text-red-500 truncate">
                    {c.label || `${TOOL_LABELS[c.type]} ${c.id.slice(0, 4)}`}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

function Field({ label, value, readOnly }: { label: string; value: string; readOnly?: boolean }) {
  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>
      <input type="text" value={value} readOnly={readOnly} className="w-full text-xs px-2 py-1 border border-gray-300 rounded bg-gray-50" />
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type="number" value={Math.round(value * 100) / 100} step={0.1}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-xs px-2 py-1 border border-gray-300 rounded bg-white"
      />
    </div>
  );
}

function RackSlotEditor({ obj, updateObject }: { obj: WarehouseObject; updateObject: (id: string, changes: Partial<WarehouseObject>) => void }) {
  const levels = obj.metadata?.levels ?? 4;
  const positionsPerLevel = 3;
  const slots: boolean[][] = obj.metadata?.slots ?? Array.from({ length: levels }, () => Array(positionsPerLevel).fill(false));

  const toggleSlot = (level: number, pos: number) => {
    const newSlots = slots.map((row, i) =>
      i === level ? row.map((v, j) => (j === pos ? !v : v)) : [...row]
    );
    // Ensure correct array size
    while (newSlots.length < levels) newSlots.push(Array(positionsPerLevel).fill(false));
    updateObject(obj.id, { metadata: { ...obj.metadata, slots: newSlots } });
  };

  const fillAll = () => {
    const newSlots = Array.from({ length: levels }, () => Array(positionsPerLevel).fill(true));
    updateObject(obj.id, { metadata: { ...obj.metadata, slots: newSlots } });
  };

  const clearAll = () => {
    const newSlots = Array.from({ length: levels }, () => Array(positionsPerLevel).fill(false));
    updateObject(obj.id, { metadata: { ...obj.metadata, slots: newSlots } });
  };

  const occupied = slots.flat().filter(Boolean).length;
  const total = levels * positionsPerLevel;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs text-gray-500">Паллеты ({occupied}/{total})</label>
        <div className="flex gap-1">
          <button onClick={fillAll} className="text-xs px-1 bg-green-100 border border-green-300 rounded hover:bg-green-200">Все</button>
          <button onClick={clearAll} className="text-xs px-1 bg-red-100 border border-red-300 rounded hover:bg-red-200">Очист</button>
        </div>
      </div>
      <div className="flex flex-col-reverse gap-0.5">
        {Array.from({ length: levels }, (_, levelIdx) => (
          <div key={levelIdx} className="flex gap-0.5 items-center">
            <span className="text-xs text-gray-400 w-4">{levelIdx + 1}</span>
            {Array.from({ length: positionsPerLevel }, (_, posIdx) => {
              const isOccupied = slots[levelIdx]?.[posIdx] ?? false;
              return (
                <button
                  key={posIdx}
                  onClick={() => toggleSlot(levelIdx, posIdx)}
                  className={`flex-1 h-5 rounded text-xs ${
                    isOccupied
                      ? 'bg-amber-500 border border-amber-600'
                      : 'bg-gray-200 border border-gray-300 hover:bg-gray-300'
                  }`}
                  title={`Уровень ${levelIdx + 1}, позиция ${posIdx + 1}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function DistanceInfo({ obj1, obj2 }: { obj1: WarehouseObject; obj2: WarehouseObject }) {
  const cDist = Math.sqrt((obj2.x - obj1.x) ** 2 + (obj2.y - obj1.y) ** 2);
  const hGap = Math.max(
    (obj2.x - obj2.width / 2) - (obj1.x + obj1.width / 2),
    (obj1.x - obj1.width / 2) - (obj2.x + obj2.width / 2)
  );
  const vGap = Math.max(
    (obj2.y - obj2.depth / 2) - (obj1.y + obj1.depth / 2),
    (obj1.y - obj1.depth / 2) - (obj2.y + obj2.depth / 2)
  );

  return (
    <div className="p-2 bg-orange-50 border border-orange-200 rounded text-xs space-y-0.5">
      <div className="font-semibold text-orange-700">Расстояние</div>
      <div>Центр↔Центр: <b>{cDist.toFixed(2)}м</b></div>
      {hGap > 0 && <div>Зазор X: <b>{hGap.toFixed(2)}м</b></div>}
      {vGap > 0 && <div>Зазор Y: <b>{vGap.toFixed(2)}м</b></div>}
    </div>
  );
}
