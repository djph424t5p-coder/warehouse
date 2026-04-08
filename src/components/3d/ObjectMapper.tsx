import React from 'react';
import { useStore } from '../../store/useStore';
import { Wall3D } from './objects/Wall3D';
import { Rack3D } from './objects/Rack3D';
import { Pallet3D } from './objects/Pallet3D';
import { Zone3D } from './objects/Zone3D';
import { Column3D } from './objects/Column3D';
import { Door3D } from './objects/Door3D';
import { Dock3D } from './objects/Dock3D';
import { DimensionLines } from './DimensionLines';
import { LabelBillboard } from './LabelBillboard';
import type { WarehouseObject } from '../../types';

const COMPONENT_MAP: Record<string, React.FC<{ obj: WarehouseObject; selected: boolean; onClick: () => void }>> = {
  wall: Wall3D,
  rack: Rack3D,
  pallet: Pallet3D,
  zone: Zone3D,
  column: Column3D,
  door: Door3D,
  dock: Dock3D,
};

export const ObjectMapper: React.FC = React.memo(() => {
  const objects = useStore((s) => s.objects);
  const selectedIds = useStore((s) => s.selectedIds);
  const setSelectedIds = useStore((s) => s.setSelectedIds);
  const layers = useStore((s) => s.layers);

  const visibleLayers = new Set(layers.filter((l) => l.visible).map((l) => l.name));
  const visibleObjects = objects.filter((o) => visibleLayers.has(o.layer || 'default'));
  const selectedObjects = visibleObjects.filter((o) => selectedIds.includes(o.id));

  return (
    <>
      {visibleObjects.map((obj) => {
        const Component = COMPONENT_MAP[obj.type];
        if (!Component) return null;
        const isSelected = selectedIds.includes(obj.id);
        return (
          <React.Fragment key={obj.id}>
            <Component
              obj={obj}
              selected={isSelected}
              onClick={() => setSelectedIds([obj.id])}
            />
            {obj.label && obj.type !== 'zone' && (
              <LabelBillboard
                text={obj.label}
                position={[obj.x, obj.height + 0.5, obj.y]}
              />
            )}
          </React.Fragment>
        );
      })}

      {selectedObjects.map((obj) => (
        <DimensionLines key={`dim-${obj.id}`} obj={obj} />
      ))}
    </>
  );
});
