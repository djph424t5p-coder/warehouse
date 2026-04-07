import React from 'react';
import { Edges } from '@react-three/drei';
import type { WarehouseObject } from '../../../types';

interface Props {
  obj: WarehouseObject;
  selected: boolean;
  onClick: () => void;
}

export const Pallet3D: React.FC<Props> = React.memo(({ obj, selected, onClick }) => {
  const rotation = (obj.rotation * Math.PI) / 180;
  const baseHeight = 0.15;
  const goodsHeight = obj.height - baseHeight;

  return (
    <group
      position={[obj.x, obj.z, obj.y]}
      rotation={[0, -rotation, 0]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      {/* Pallet base */}
      <mesh position={[0, baseHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[obj.width, baseHeight, obj.depth]} />
        <meshStandardMaterial color="#aa8855" roughness={0.8} />
      </mesh>

      {/* Goods on top */}
      {goodsHeight > 0 && (
        <mesh position={[0, baseHeight + goodsHeight / 2, 0]} castShadow>
          <boxGeometry args={[obj.width * 0.9, goodsHeight, obj.depth * 0.9]} />
          <meshStandardMaterial color={obj.color} roughness={0.6} />
        </mesh>
      )}

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
