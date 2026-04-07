import React from 'react';
import { Edges } from '@react-three/drei';
import type { WarehouseObject } from '../../../types';

interface Props {
  obj: WarehouseObject;
  selected: boolean;
  onClick: () => void;
}

export const Wall3D: React.FC<Props> = React.memo(({ obj, selected, onClick }) => {
  const rotation = (obj.rotation * Math.PI) / 180;
  return (
    <mesh
      position={[obj.x, obj.height / 2 + obj.z, obj.y]}
      rotation={[0, -rotation, 0]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[obj.width, obj.height, obj.depth]} />
      <meshStandardMaterial color={obj.color} roughness={0.9} />
      {selected && <Edges color="#2196F3" lineWidth={2} />}
    </mesh>
  );
});
