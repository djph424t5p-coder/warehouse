import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { ObjectMapper } from './ObjectMapper';
import { GroundPlane } from './GroundPlane';
import { useStore } from '../../store/useStore';

export const Scene3D: React.FC = () => {
  const clearSelection = useStore((s) => s.clearSelection);

  return (
    <div className="flex-1 bg-gray-200">
      <Canvas
        shadows
        camera={{ position: [20, 15, 20], fov: 50, near: 0.1, far: 500 }}
        onPointerMissed={() => clearSelection()}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
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

          {/* Ground with click-to-place */}
          <GroundPlane />

          {/* Grid */}
          <Grid
            args={[200, 200]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#c0c0c0"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#a0a0a0"
            fadeDistance={100}
            position={[0, 0, 0]}
          />

          {/* Objects */}
          <ObjectMapper />

          {/* Controls */}
          <OrbitControls
            makeDefault
            maxPolarAngle={Math.PI / 2 - 0.05}
            minDistance={2}
            maxDistance={150}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
