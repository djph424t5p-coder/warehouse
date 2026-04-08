import React, { useRef } from 'react';
import { useStore } from '../../store/useStore';
import { exportToJSON, importFromJSON } from '../../utils/saveLoad';

export const Header: React.FC = React.memo(() => {
  const mode = useStore((s) => s.mode);
  const setMode = useStore((s) => s.setMode);
  const objects = useStore((s) => s.objects);
  const loadState = useStore((s) => s.loadState);
  const clearAll = useStore((s) => s.clearAll);
  const fileRef = useRef<HTMLInputElement>(null);

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

  return (
    <header className="h-12 bg-gray-800 text-white flex items-center px-4 gap-4 shrink-0 z-50">
      <h1 className="text-lg font-bold whitespace-nowrap">Конструктор Склада</h1>

      <div className="flex gap-1 ml-4">
        <button
          onClick={() => setMode('2d')}
          className={`px-3 py-1 rounded text-sm ${
            mode === '2d' ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'
          }`}
        >
          2D
        </button>
        <button
          onClick={() => {
            setMode('3d');
            const tool = useStore.getState().tool;
            if (tool === 'wall' || tool === 'measure') {
              useStore.getState().setTool('select');
            }
          }}
          className={`px-3 py-1 rounded text-sm ${
            mode === '3d' ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'
          }`}
        >
          3D
        </button>
      </div>

      <div className="flex gap-2 ml-auto">
        <button
          onClick={() => exportToJSON(objects)}
          className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-sm"
        >
          Сохранить JSON
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-sm"
        >
          Загрузить JSON
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleImport}
        />
        <button
          onClick={() => {
            if (confirm('Очистить все объекты?')) clearAll();
          }}
          className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm"
        >
          Очистить
        </button>
      </div>
    </header>
  );
});
