import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { TOOL_LABELS, TOOL_ICONS } from '../../utils/defaults';
import type { Tool, ObjectType } from '../../types';

const TOOLS_2D: Tool[] = ['select', 'wall', 'rack', 'pallet', 'zone', 'column', 'door', 'dock', 'measure', 'path'];
const TOOLS_3D: Tool[] = ['select', 'rack', 'pallet', 'zone', 'column', 'door', 'dock'];

const TOOL_SHORTCUTS: Record<string, string> = {
  select: '1', wall: '2', rack: '3', pallet: '4', zone: '5', column: '6', door: '7', dock: '8', measure: '9', path: '0',
};

const TYPE_LABELS: Record<ObjectType, string> = {
  wall: 'Стены', rack: 'Стеллажи', pallet: 'Паллеты', zone: 'Зоны',
  column: 'Колонны', door: 'Двери', dock: 'Доки',
};

export const LeftSidebar: React.FC = React.memo(() => {
  const [collapsed, setCollapsed] = useState(false);
  const mode = useStore((s) => s.mode);
  const tool = useStore((s) => s.tool);
  const setTool = useStore((s) => s.setTool);
  const objects = useStore((s) => s.objects);
  const selectedIds = useStore((s) => s.selectedIds);
  const setSelectedIds = useStore((s) => s.setSelectedIds);
  const snapToGrid = useStore((s) => s.snapToGrid);
  const toggleSnap = useStore((s) => s.toggleSnap);
  const gridSize = useStore((s) => s.gridSize);
  const setGridSize = useStore((s) => s.setGridSize);
  const layers = useStore((s) => s.layers);
  const activeLayer = useStore((s) => s.activeLayer);
  const setActiveLayer = useStore((s) => s.setActiveLayer);
  const toggleLayerVisibility = useStore((s) => s.toggleLayerVisibility);
  const addLayer = useStore((s) => s.addLayer);
  const removeLayer = useStore((s) => s.removeLayer);
  const alignObjects = useStore((s) => s.alignObjects);
  const distributeObjects = useStore((s) => s.distributeObjects);

  const [layerInput, setLayerInput] = useState('');

  if (collapsed) {
    return (
      <div className="w-8 bg-gray-100 border-r border-gray-300 flex flex-col items-center pt-2 shrink-0">
        <button onClick={() => setCollapsed(false)} className="text-gray-600 hover:text-gray-900 text-sm">▶</button>
      </div>
    );
  }

  const visibleLayers = new Set(layers.filter((l) => l.visible).map((l) => l.name));
  const visibleObjects = objects.filter((o) => visibleLayers.has(o.layer || 'default'));

  const grouped = visibleObjects.reduce<Record<string, typeof objects>>((acc, obj) => {
    if (!acc[obj.type]) acc[obj.type] = [];
    acc[obj.type].push(obj);
    return acc;
  }, {});

  const activeTools = mode === '2d' ? TOOLS_2D : TOOLS_3D;

  return (
    <div className="w-56 bg-gray-100 border-r border-gray-300 flex flex-col shrink-0 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-300">
        <span className="text-xs font-bold text-gray-600 uppercase">Панель</span>
        <button onClick={() => setCollapsed(true)} className="text-gray-400 hover:text-gray-700 text-sm">◀</button>
      </div>

      {/* Tools */}
      <div className="p-2 border-b border-gray-300">
        <div className="text-xs text-gray-500 mb-1 font-semibold">Инструменты</div>
        <div className="grid grid-cols-3 gap-1">
          {activeTools.map((t) => (
            <button
              key={t}
              onClick={() => setTool(t)}
              className={`flex flex-col items-center p-1.5 rounded text-xs ${
                tool === t
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
              title={`${TOOL_LABELS[t]} (${TOOL_SHORTCUTS[t]})`}
            >
              <span className="text-base leading-none">{TOOL_ICONS[t]}</span>
              <span className="mt-0.5 truncate w-full text-center" style={{ fontSize: '10px' }}>
                {TOOL_LABELS[t]}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-2 flex items-center gap-2">
          <label className="flex items-center gap-1 text-xs text-gray-600">
            <input type="checkbox" checked={snapToGrid} onChange={toggleSnap} className="w-3 h-3" />
            Сетка
          </label>
          <select
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
            className="text-xs border border-gray-300 rounded px-1 py-0.5 bg-white"
          >
            <option value={0.5}>0.5м</option>
            <option value={1}>1м</option>
            <option value={2}>2м</option>
          </select>
        </div>
      </div>

      {/* Alignment tools */}
      {selectedIds.length >= 2 && (
        <div className="p-2 border-b border-gray-300">
          <div className="text-xs text-gray-500 mb-1 font-semibold">Выравнивание</div>
          <div className="grid grid-cols-4 gap-1">
            {([
              ['left', '⫷'], ['right', '⫸'], ['top', '⫯'], ['bottom', '⫰'],
              ['center-h', '⫿'], ['center-v', '⫾'],
            ] as const).map(([align, icon]) => (
              <button
                key={align}
                onClick={() => alignObjects(selectedIds, align)}
                className="px-1 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-200"
                title={`Выровнять: ${align}`}
              >
                {icon}
              </button>
            ))}
            <button
              onClick={() => distributeObjects(selectedIds, 'horizontal')}
              className="px-1 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-200"
              title="Распределить по горизонтали"
            >⋯</button>
            <button
              onClick={() => distributeObjects(selectedIds, 'vertical')}
              className="px-1 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-200"
              title="Распределить по вертикали"
            >⋮</button>
          </div>
        </div>
      )}

      {/* Layers */}
      <div className="p-2 border-b border-gray-300">
        <div className="text-xs text-gray-500 mb-1 font-semibold">Слои</div>
        {layers.map((layer) => (
          <div key={layer.name} className={`flex items-center gap-1 text-xs px-1 py-0.5 rounded ${
            activeLayer === layer.name ? 'bg-blue-100' : ''
          }`}>
            <button
              onClick={() => toggleLayerVisibility(layer.name)}
              className="w-4 text-center"
              title={layer.visible ? 'Скрыть' : 'Показать'}
            >
              {layer.visible ? '👁' : '—'}
            </button>
            <button
              onClick={() => setActiveLayer(layer.name)}
              className="flex-1 text-left truncate hover:text-blue-600"
            >
              {layer.name}
            </button>
            {layer.name !== 'default' && (
              <button onClick={() => removeLayer(layer.name)} className="text-red-400 hover:text-red-600">×</button>
            )}
          </div>
        ))}
        <div className="flex gap-1 mt-1">
          <input
            type="text"
            value={layerInput}
            onChange={(e) => setLayerInput(e.target.value)}
            placeholder="Новый слой"
            className="flex-1 text-xs px-1 py-0.5 border border-gray-300 rounded"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && layerInput.trim()) {
                addLayer(layerInput.trim());
                setLayerInput('');
              }
            }}
          />
          <button
            onClick={() => { if (layerInput.trim()) { addLayer(layerInput.trim()); setLayerInput(''); } }}
            className="text-xs px-1 bg-blue-500 text-white rounded"
          >+</button>
        </div>
      </div>

      {/* Object tree */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="text-xs text-gray-500 mb-1 font-semibold">Объекты</div>
        {Object.entries(grouped).map(([type, objs]) => (
          <div key={type} className="mb-2">
            <div className="text-xs font-semibold text-gray-600 mb-0.5">
              {TYPE_LABELS[type as ObjectType] || type} ({objs.length})
            </div>
            {objs.map((obj) => (
              <button
                key={obj.id}
                onClick={() => setSelectedIds([obj.id])}
                className={`w-full text-left text-xs px-2 py-0.5 rounded hover:bg-blue-100 truncate block ${
                  selectedIds.includes(obj.id) ? 'bg-blue-100 font-semibold' : ''
                }`}
                style={{ borderLeft: `3px solid ${obj.color}` }}
              >
                {obj.locked ? '🔒 ' : ''}{obj.label || `${TOOL_LABELS[obj.type]} ${obj.id.slice(0, 4)}`}
              </button>
            ))}
          </div>
        ))}
        {visibleObjects.length === 0 && (
          <div className="text-xs text-gray-400 italic">Нет объектов</div>
        )}
      </div>
    </div>
  );
});
