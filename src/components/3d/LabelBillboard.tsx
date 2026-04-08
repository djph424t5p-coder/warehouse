import React from 'react';
import { Billboard, Text } from '@react-three/drei';

interface Props {
  text: string;
  position: [number, number, number];
}

export const LabelBillboard: React.FC<Props> = React.memo(({ text, position }) => {
  return (
    <Billboard position={position} follow lockX={false} lockY={false} lockZ={false}>
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[text.length * 0.15 + 0.3, 0.35]} />
        <meshBasicMaterial color="#000000" opacity={0.6} transparent />
      </mesh>
      <Text
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </Billboard>
  );
});
