import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { ObjectMapper } from './ObjectMapper';
import { GroundPlane } from './GroundPlane';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';

function WalkthroughControls() {
  const { camera, gl } = useThree();
  const keys = useRef(new Set<string>());
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const isLocked = useRef(false);

  useEffect(() => {
    camera.position.set(5, 1.7, 5);
    euler.current.setFromQuaternion(camera.quaternion);

    const onKeyDown = (e: KeyboardEvent) => keys.current.add(e.key.toLowerCase());
    const onKeyUp = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());

    const onMouseMove = (e: MouseEvent) => {
      if (!isLocked.current) return;
      euler.current.y -= e.movementX * 0.002;
      euler.current.x -= e.movementY * 0.002;
      euler.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.current.x));
      camera.quaternion.setFromEuler(euler.current);
    };

    const onClick = () => {
      gl.domElement.requestPointerLock();
    };
    const onLockChange = () => {
      isLocked.current = document.pointerLockElement === gl.domElement;
    };

    gl.domElement.addEventListener('click', onClick);
    document.addEventListener('pointerlockchange', onLockChange);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('mousemove', onMouseMove);

    return () => {
      gl.domElement.removeEventListener('click', onClick);
      document.removeEventListener('pointerlockchange', onLockChange);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mousemove', onMouseMove);
      if (document.pointerLockElement) document.exitPointerLock();
    };
  }, [camera, gl]);

  useFrame((_, delta) => {
    const speed = 5 * delta;
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    dir.y = 0;
    dir.normalize();
    const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0));

    if (keys.current.has('w')) camera.position.addScaledVector(dir, speed);
    if (keys.current.has('s')) camera.position.addScaledVector(dir, -speed);
    if (keys.current.has('a')) camera.position.addScaledVector(right, -speed);
    if (keys.current.has('d')) camera.position.addScaledVector(right, speed);
    camera.position.y = 1.7;
  });

  return null;
}

export const Scene3D: React.FC = () => {
  const clearSelection = useStore((s) => s.clearSelection);
  const walkthrough = useStore((s) => s.walkthrough);

  return (
    <div className="flex-1 bg-gray-200 relative">
      {walkthrough && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-black/60 text-white px-3 py-1 rounded text-xs">
          Кликните для захвата мыши. WASD — движение. Escape — выход.
        </div>
      )}
      <Canvas
        shadows
        camera={{ position: [20, 15, 20], fov: 50, near: 0.1, far: 500 }}
        onPointerMissed={() => clearSelection()}
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
