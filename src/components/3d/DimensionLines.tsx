import React from 'react';
import { Text, Line } from '@react-three/drei';
import type { WarehouseObject } from '../../types';

interface Props {
  obj: WarehouseObject;
}

export const DimensionLines: React.FC<Props> = React.memo(({ obj }) => {
  const rotation = (obj.rotation * Math.PI) / 180;
  const hw = obj.width / 2;
  const hd = obj.depth / 2;
  const offset = 0.3;

  return (
    <group position={[obj.x, obj.z, obj.y]} rotation={[0, -rotation, 0]}>
      {/* Width dimension (along X) */}
      <Line
        points={[[-hw, 0, -hd - offset], [hw, 0, -hd - offset]]}
        color="#ff4444"
        lineWidth={1.5}
      />
      <Line points={[[-hw, 0, -hd - offset * 0.5], [-hw, 0, -hd - offset * 1.5]]} color="#ff4444" lineWidth={1} />
      <Line points={[[hw, 0, -hd - offset * 0.5], [hw, 0, -hd - offset * 1.5]]} color="#ff4444" lineWidth={1} />
      <Text
        position={[0, 0.1, -hd - offset - 0.2]}
        fontSize={0.2}
        color="#ff4444"
        anchorX="center"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {obj.width.toFixed(1)}м
      </Text>

      {/* Depth dimension (along Z) */}
      <Line
        points={[[hw + offset, 0, -hd], [hw + offset, 0, hd]]}
        color="#4444ff"
        lineWidth={1.5}
      />
      <Line points={[[hw + offset * 0.5, 0, -hd], [hw + offset * 1.5, 0, -hd]]} color="#4444ff" lineWidth={1} />
      <Line points={[[hw + offset * 0.5, 0, hd], [hw + offset * 1.5, 0, hd]]} color="#4444ff" lineWidth={1} />
      <Text
        position={[hw + offset + 0.2, 0.1, 0]}
        fontSize={0.2}
        color="#4444ff"
        anchorX="center"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {obj.depth.toFixed(1)}м
      </Text>

      {/* Height dimension (along Y) */}
      <Line
        points={[[-hw - offset, 0, hd], [-hw - offset, obj.height, hd]]}
        color="#44aa44"
        lineWidth={1.5}
      />
      <Line points={[[-hw - offset * 0.5, 0, hd], [-hw - offset * 1.5, 0, hd]]} color="#44aa44" lineWidth={1} />
      <Line points={[[-hw - offset * 0.5, obj.height, hd], [-hw - offset * 1.5, obj.height, hd]]} color="#44aa44" lineWidth={1} />
      <Text
        position={[-hw - offset - 0.2, obj.height / 2, hd]}
        fontSize={0.2}
        color="#44aa44"
        anchorX="center"
      >
        {obj.height.toFixed(1)}м
      </Text>
    </group>
  );
});
