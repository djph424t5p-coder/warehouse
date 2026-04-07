import React from 'react';
import { Edges } from '@react-three/drei';
import type { WarehouseObject } from '../../../types';

interface Props {
  obj: WarehouseObject;
  selected: boolean;
  onClick: () => void;
}

export const Door3D: React.FC<Props> = React.memo(({ obj, selected, onClick }) => {
  const rotation = (obj.rotation * Math.PI) / 180;
  const frameThickness = 0.08;

  return (
    <group
      position={[obj.x, obj.z, obj.y]}
      rotation={[0, -rotation, 0]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      {/* Door panel */}
      <mesh position={[0, obj.height / 2, 0]} castShadow>
        <boxGeometry args={[obj.width, obj.height, obj.depth]} />
        <meshStandardMaterial color={obj.color} opacity={0.7} transparent />
      </mesh>

      {/* Frame - top */}
      <mesh position={[0, obj.height, 0]}>
        <boxGeometry args={[obj.width + frameThickness * 2, frameThickness, obj.depth + frameThickness]} />
        <meshStandardMaterial color="#336633" />
      </mesh>
      {/* Frame - left */}
      <mesh position={[-obj.width / 2 - frameThickness / 2, obj.height / 2, 0]}>
        <boxGeometry args={[frameThickness, obj.height, obj.depth + frameThickness]} />
        <meshStandardMaterial color="#336633" />
      </mesh>
      {/* Frame - right */}
      <mesh position={[obj.width / 2 + frameThickness / 2, obj.height / 2, 0]}>
        <boxGeometry args={[frameThickness, obj.height, obj.depth + frameThickness]} />
        <meshStandardMaterial color="#336633" />
      </mesh>

      {selected && (
        <mesh position={[0, obj.height / 2, 0]}>
          <boxGeometry args={[obj.width + frameThickness * 2, obj.height + frameThickness, obj.depth + frameThickness]} />
          <meshStandardMaterial visible={false} />
          <Edges color="#2196F3" lineWidth={2} />
        </mesh>
      )}
    </group>
  );
});
