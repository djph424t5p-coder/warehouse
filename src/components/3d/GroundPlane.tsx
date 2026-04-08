import React, { useCallback } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { useStore } from '../../store/useStore';
import { createObject } from '../../utils/defaults';
import { snapPosition } from '../../utils/snap';
import type { ObjectType } from '../../types';

export const GroundPlane: React.FC = React.memo(() => {
  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    const store = useStore.getState();
    if (store.tool === 'select' || store.tool === 'measure' || store.tool === 'wall') {
      store.clearSelection();
      return;
    }

    e.stopPropagation();
    const point = e.point;
    // Three.js: x = world X, z = world Y (2D), y = up
    const snapped = snapPosition(point.x, point.z, store.gridSize, store.snapToGrid);
    const obj = createObject(store.tool as ObjectType, snapped.x, snapped.y);
    store.addObject(obj);
    store.setSelectedIds([obj.id]);
  }, []);

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.01, 0]}
      receiveShadow
      onClick={handleClick}
    >
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial color="#e0e0e0" />
    </mesh>
  );
});
