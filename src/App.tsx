import { useEffect } from 'react';
import { Header } from './components/ui/Header';
import { LeftSidebar } from './components/ui/LeftSidebar';
import { PropertiesPanel } from './components/ui/PropertiesPanel';
import { Footer } from './components/ui/Footer';
import { Canvas2D } from './components/2d/Canvas2D';
import { Scene3D } from './components/3d/Scene3D';
import { useStore } from './store/useStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function App() {
  const mode = useStore((s) => s.mode);
  useKeyboardShortcuts();

  // Load from share link on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const state = params.get('state');
    if (state) {
      try {
        const data = JSON.parse(decodeURIComponent(atob(state)));
        if (Array.isArray(data)) {
          useStore.getState().loadState(data);
          window.history.replaceState({}, '', window.location.pathname);
        }
      } catch {
        // Invalid share link, ignore
      }
    }
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        {mode === '2d' ? <Canvas2D /> : <Scene3D />}
        <PropertiesPanel />
      </div>
      <Footer />
    </div>
  );
}

export default App;
