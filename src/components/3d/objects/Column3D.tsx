import React from 'react';
import { Edges } from '@react-three/drei';
import type { WarehouseObject } from '../../../types';

interface Props {
  obj: WarehouseObject;
  selected: boolean;
  onClick: () => void;
}

export const Column3D: React.FC<Props> = React.memo(({ obj, selected, onClick }) => {
  return (
    <mesh
      position={[obj.x, obj.height / 2 + obj.z, obj.y]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      castShadow
    >
      <boxGeometry args={[obj.width, obj.height, obj.depth]} />
      <meshStandardMaterial color={obj.color} roughness={0.7} />
      {selected && <Edges color="#2196F3" lineWidth={2} />}
    </mesh>
  );
});
