import React from 'react';
import { useStore } from '../../store/useStore';
import { TOOL_LABELS } from '../../utils/defaults';
import { checkCollisions } from '../../utils/collision';

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

        {/* Lock controls */}
        <div className="flex gap-1">
          {selectedObjects.some((o) => !o.locked) && (
            <button
              onClick={() => lockObjects(selectedIds)}
              className="flex-1 text-xs px-2 py-1 bg-yellow-100 border border-yellow-300 rounded hover:bg-yellow-200"
            >🔒 Заблокировать</button>
          )}
          {selectedObjects.some((o) => o.locked) && (
            <button
              onClick={() => unlockObjects(selectedIds)}
              className="flex-1 text-xs px-2 py-1 bg-green-100 border border-green-300 rounded hover:bg-green-200"
            >🔓 Разблокировать</button>
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
