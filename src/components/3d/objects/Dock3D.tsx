import React from 'react';
import { Edges } from '@react-three/drei';
import type { WarehouseObject } from '../../../types';

interface Props {
  obj: WarehouseObject;
  selected: boolean;
  onClick: () => void;
}

export const Dock3D: React.FC<Props> = React.memo(({ obj, selected, onClick }) => {
  const rotation = (obj.rotation * Math.PI) / 180;
  const stepHeight = obj.height / 2;

  return (
    <group
      position={[obj.x, obj.z, obj.y]}
      rotation={[0, -rotation, 0]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      {/* Lower step */}
      <mesh position={[0, stepHeight / 2, obj.depth * 0.15]} castShadow receiveShadow>
        <boxGeometry args={[obj.width, stepHeight, obj.depth * 0.7]} />
        <meshStandardMaterial color={obj.color} roughness={0.8} />
      </mesh>

      {/* Upper step */}
      <mesh position={[0, stepHeight + stepHeight / 2, -obj.depth * 0.15]} castShadow receiveShadow>
        <boxGeometry args={[obj.width, stepHeight, obj.depth * 0.7]} />
        <meshStandardMaterial color={obj.color} roughness={0.8} />
      </mesh>

      {selected && (
        <mesh position={[0, obj.height / 2, 0]}>
          <boxGeometry args={[obj.width, obj.height, obj.depth]} />
          <meshStandardMaterial visible={false} />
          <Edges color="#2196F3" lineWidth={2} />
        </mesh>
      )}
    </group>
  );
});
