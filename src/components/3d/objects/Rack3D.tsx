import React from 'react';
import { Edges } from '@react-three/drei';
import type { WarehouseObject } from '../../../types';

interface Props {
  obj: WarehouseObject;
  selected: boolean;
  onClick: () => void;
}

const POST_SIZE = 0.05;

export const Rack3D: React.FC<Props> = React.memo(({ obj, selected, onClick }) => {
  const levels = obj.metadata?.levels ?? 4;
  const beamHeight = obj.metadata?.beamHeight ?? 0.15;
  const rotation = (obj.rotation * Math.PI) / 180;
  const hw = obj.width / 2;
  const hd = obj.depth / 2;

  const posts: [number, number][] = [
    [-hw, -hd],
    [hw, -hd],
    [-hw, hd],
    [hw, hd],
  ];

  const levelHeight = obj.height / levels;

  return (
    <group
      position={[obj.x, obj.z, obj.y]}
      rotation={[0, -rotation, 0]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      {/* Vertical posts */}
      {posts.map(([px, pz], i) => (
        <mesh key={`post-${i}`} position={[px, obj.height / 2, pz]} castShadow>
          <boxGeometry args={[POST_SIZE, obj.height, POST_SIZE]} />
          <meshStandardMaterial color="#335588" />
        </mesh>
      ))}

      {/* Horizontal beams at each level */}
      {Array.from({ length: levels + 1 }, (_, i) => {
        const y = i * levelHeight;
        return (
          <group key={`level-${i}`}>
            {/* Front beam */}
            <mesh position={[0, y, -hd]} castShadow>
              <boxGeometry args={[obj.width, beamHeight, POST_SIZE]} />
              <meshStandardMaterial color={obj.color} />
            </mesh>
            {/* Back beam */}
            <mesh position={[0, y, hd]} castShadow>
              <boxGeometry args={[obj.width, beamHeight, POST_SIZE]} />
              <meshStandardMaterial color={obj.color} />
            </mesh>
            {/* Shelf surface (except top) */}
            {i < levels && i > 0 && (
              <mesh position={[0, y + beamHeight / 2, 0]} receiveShadow>
                <boxGeometry args={[obj.width - POST_SIZE * 2, 0.02, obj.depth - POST_SIZE * 2]} />
                <meshStandardMaterial color="#aabbcc" opacity={0.5} transparent />
              </mesh>
            )}
          </group>
        );
      })}

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
