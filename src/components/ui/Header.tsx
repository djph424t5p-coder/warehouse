import React, { useRef } from 'react';
import { useStore } from '../../store/useStore';
import { exportToJSON, importFromJSON } from '../../utils/saveLoad';
import { WAREHOUSE_TEMPLATES } from '../../utils/templates';

export const Header: React.FC = React.memo(() => {
  const mode = useStore((s) => s.mode);
  const setMode = useStore((s) => s.setMode);
  const objects = useStore((s) => s.objects);
  const loadState = useStore((s) => s.loadState);
  const clearAll = useStore((s) => s.clearAll);
  const showCollisions = useStore((s) => s.showCollisions);
  const setShowCollisions = useStore((s) => s.setShowCollisions);
  const walkthrough = useStore((s) => s.walkthrough);
  const setWalkthrough = useStore((s) => s.setWalkthrough);
  const fileRef = useRef<HTMLInputElement>(null);
  const [showTemplates, setShowTemplates] = React.useState(false);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await importFromJSON(file);
      loadState(data);
    } catch {
      alert('Ошибка загрузки файла');
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleScreenshot = () => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement | null;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'warehouse-screenshot.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleShareLink = () => {
    const data = JSON.stringify(objects);
    const compressed = btoa(encodeURIComponent(data));
    const url = `${window.location.origin}${window.location.pathname}?state=${compressed}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('Ссылка скопирована в буфер обмена');
    }).catch(() => {
      prompt('Скопируйте ссылку:', url);
    });
  };

  return (
    <header className="h-12 bg-gray-800 text-white flex items-center px-4 gap-3 shrink-0 z-50">
      <h1 className="text-lg font-bold whitespace-nowrap">Конструктор Склада</h1>

      <div className="flex gap-1 ml-3">
        <button
          onClick={() => setMode('2d')}
          className={`px-3 py-1 rounded text-sm ${mode === '2d' ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'}`}
        >2D</button>
        <button
          onClick={() => {
            setMode('3d');
            const tool = useStore.getState().tool;
            if (tool === 'wall' || tool === 'measure' || tool === 'path') useStore.getState().setTool('select');
          }}
          className={`px-3 py-1 rounded text-sm ${mode === '3d' ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'}`}
        >3D</button>
        {mode === '3d' && (
          <button
            onClick={() => setWalkthrough(!walkthrough)}
            className={`px-3 py-1 rounded text-sm ${walkthrough ? 'bg-purple-600' : 'bg-gray-600 hover:bg-gray-500'}`}
            title="Режим от первого лица (WASD)"
          >🚶</button>
        )}
      </div>

      <button
        onClick={() => useStore.getState().setShowStats(!useStore.getState().showStats)}
        className="px-2 py-1 rounded text-sm bg-gray-600 hover:bg-gray-500"
        title="Статистика склада"
      >📊</button>

      <button
        onClick={() => setShowCollisions(!showCollisions)}
        className={`px-2 py-1 rounded text-sm ${showCollisions ? 'bg-red-600' : 'bg-gray-600 hover:bg-gray-500'}`}
        title="Показать пересечения объектов"
      >Коллизии</button>

      <div className="flex gap-2 ml-auto">
        <div className="relative">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded text-sm"
          >Шаблоны</button>
          {showTemplates && (
            <div className="absolute top-full left-0 mt-1 bg-white rounded shadow-lg border border-gray-300 z-50 min-w-[180px]">
              {WAREHOUSE_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.name}
                  onClick={() => {
                    if (objects.length > 0 && !confirm(`Загрузить шаблон "${tmpl.name}"? Текущие объекты будут заменены.`)) return;
                    loadState(tmpl.objects());
                    setShowTemplates(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50"
                >
                  {tmpl.name}
                  <span className="text-xs text-gray-400 block">{tmpl.description}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button onClick={handleScreenshot} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded text-sm">📷 PNG</button>
        <button onClick={handleShareLink} className="px-3 py-1 bg-teal-600 hover:bg-teal-500 rounded text-sm">🔗 Поделиться</button>
        <button onClick={() => exportToJSON(objects)} className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-sm">💾 JSON</button>
        <button onClick={() => fileRef.current?.click()} className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-sm">📂 Загрузить</button>
        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
        <button
          onClick={() => { if (confirm('Очистить все объекты?')) clearAll(); }}
          className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm"
        >🗑 Очистить</button>
      </div>
    </header>
  );
});
