import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { ObjectMapper } from './ObjectMapper';
import { GroundPlane } from './GroundPlane';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';

const keysPressed = new Set<string>();

function WalkthroughControls() {
  const { camera } = useThree();
  const yaw = useRef(0);
  const pitch = useRef(0);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      camera.position.set(5, 1.7, 5);
      yaw.current = Math.PI;
      pitch.current = 0;
      camera.quaternion.setFromEuler(new THREE.Euler(pitch.current, yaw.current, 0, 'YXZ'));
      initialized.current = true;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'q', 'e'].includes(key)) {
        e.preventDefault();
        e.stopPropagation();
        keysPressed.add(key);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysPressed.delete(e.key.toLowerCase());
    };

    // Use capture phase to intercept WASD before the keyboard shortcuts hook
    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('keyup', onKeyUp, true);
    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('keyup', onKeyUp, true);
      keysPressed.clear();
    };
  }, [camera]);

  // Mouse look via left-click drag on the canvas
  useEffect(() => {
    const canvas = document.querySelector('.walkthrough-canvas canvas') as HTMLElement | null;
    if (!canvas) return;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isDragging.current = true;
        lastMouse.current = { x: e.clientX, y: e.clientY };
        canvas.style.cursor = 'grabbing';
      }
    };
    const onMouseUp = () => {
      isDragging.current = false;
      canvas.style.cursor = 'grab';
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      yaw.current -= dx * 0.003;
      pitch.current -= dy * 0.003;
      pitch.current = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, pitch.current));
    };

    canvas.style.cursor = 'grab';
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  useFrame((_, delta) => {
    // Apply mouse look
    camera.quaternion.setFromEuler(new THREE.Euler(pitch.current, yaw.current, 0, 'YXZ'));

    // Movement
    const speed = 6 * delta;
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    if (keysPressed.has('w')) camera.position.addScaledVector(forward, speed);
    if (keysPressed.has('s')) camera.position.addScaledVector(forward, -speed);
    if (keysPressed.has('a')) camera.position.addScaledVector(right, -speed);
    if (keysPressed.has('d')) camera.position.addScaledVector(right, speed);
    if (keysPressed.has('q')) camera.position.y -= speed * 0.5;
    if (keysPressed.has('e')) camera.position.y += speed * 0.5;

    camera.position.y = Math.max(0.5, camera.position.y);
  });

  return null;
}

export const Scene3D: React.FC = () => {
  const clearSelection = useStore((s) => s.clearSelection);
  const walkthrough = useStore((s) => s.walkthrough);

  return (
    <div className={`flex-1 bg-gray-200 relative ${walkthrough ? 'walkthrough-canvas' : ''}`}>
      {walkthrough && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-black/70 text-white px-4 py-1.5 rounded text-xs pointer-events-none">
          WASD — движение, мышь (зажать ЛКМ) — обзор, Q/E — вверх/вниз, Escape — выход
        </div>
      )}
      <Canvas
        shadows
        camera={{ position: [20, 15, 20], fov: 50, near: 0.1, far: 500 }}
        onPointerMissed={() => { if (!walkthrough) clearSelection(); }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[30, 40, 20]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={100}
            shadow-camera-left={-50}
            shadow-camera-right={50}
            shadow-camera-top={50}
            shadow-camera-bottom={-50}
          />
          <hemisphereLight args={['#b1e1ff', '#b97a20', 0.3]} />

          <GroundPlane />

          <Grid
            args={[200, 200]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#c0c0c0"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#a0a0a0"
            fadeDistance={100}
            position={[0, 0.001, 0]}
          />

          <ObjectMapper />

          {walkthrough ? (
            <WalkthroughControls />
          ) : (
            <OrbitControls
              makeDefault
              maxPolarAngle={Math.PI / 2 - 0.05}
              minDistance={2}
              maxDistance={150}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};
