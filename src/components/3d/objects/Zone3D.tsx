import React from 'react';
import { Text } from '@react-three/drei';
import type { WarehouseObject } from '../../../types';

interface Props {
  obj: WarehouseObject;
  selected: boolean;
  onClick: () => void;
}

export const Zone3D: React.FC<Props> = React.memo(({ obj, selected, onClick }) => {
  const rotation = (obj.rotation * Math.PI) / 180;
  const hex = obj.color;
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  return (
    <group
      position={[obj.x, 0.005 + obj.z, obj.y]}
      rotation={[0, -rotation, 0]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[obj.width, obj.depth]} />
        <meshStandardMaterial
          color={[r, g, b]}
          opacity={0.3}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* Border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[obj.width, obj.depth]} />
        <meshStandardMaterial
          color={selected ? '#2196F3' : [r, g, b]}
          opacity={0.6}
          transparent
          wireframe
        />
      </mesh>

      {/* Label */}
      {obj.label && (
        <Text
          position={[0, 0.01, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={Math.min(obj.width, obj.depth) * 0.15}
          color="#333"
          anchorX="center"
          anchorY="middle"
        >
          {obj.label}
        </Text>
      )}
    </group>
  );
});
