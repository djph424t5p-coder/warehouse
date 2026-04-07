import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useStore } from '../../store/useStore';
import { screenToWorld } from '../../utils/coordinates';
import { snapPosition } from '../../utils/snap';
import { pointInObject, objectsInRect, getResizeHandleAtPoint, type ResizeHandle } from '../../utils/hitTest';
import { createObject } from '../../utils/defaults';
import { ContextMenu } from '../ui/ContextMenu';
import type { ObjectType, WarehouseObject } from '../../types';

const MIN_ZOOM = 5;
const MAX_ZOOM = 200;

interface DragState {
  type: 'none' | 'pan' | 'move' | 'select-box' | 'wall-draw' | 'resize';
  startScreen: { x: number; y: number };
  startWorld: { x: number; y: number };
  origPositions?: { id: string; x: number; y: number }[];
  shiftConstrain?: 'x' | 'y' | null;
  resizeHandle?: ResizeHandle;
  resizeObj?: WarehouseObject;
}

export const Canvas2D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 400, y: 300 });
  const [zoom, setZoom] = useState(40); // pixels per meter
  const dragRef = useRef<DragState>({ type: 'none', startScreen: { x: 0, y: 0 }, startWorld: { x: 0, y: 0 } });
  const [selectionBox, setSelectionBox] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const [wallPreview, setWallPreview] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const objects = useStore((s) => s.objects);
  const selectedIds = useStore((s) => s.selectedIds);
  const _tool = useStore((s) => s.tool);
  const gridSize = useStore((s) => s.gridSize);
  const _snap = useStore((s) => s.snapToGrid);
  const measurePoints = useStore((s) => s.measurePoints);

  // _tool and _snap trigger re-renders when changed (used in callbacks via getState)
  void _tool;
  void _snap;

  const toWorld = useCallback(
    (sx: number, sy: number) => screenToWorld(sx, sy, offset, zoom),
    [offset, zoom]
  );

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;

    // Clear
    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.save();
    const gridPx = gridSize * zoom;
    const majorEvery = gridSize <= 0.5 ? 10 : gridSize <= 1 ? 5 : 5;

    if (gridPx > 4) {
      const startWx = Math.floor(-offset.x / zoom / gridSize) * gridSize;
      const endWx = Math.ceil((w - offset.x) / zoom / gridSize) * gridSize;
      const startWy = Math.floor(-offset.y / zoom / gridSize) * gridSize;
      const endWy = Math.ceil((h - offset.y) / zoom / gridSize) * gridSize;

      for (let wx = startWx; wx <= endWx; wx += gridSize) {
        const sx = wx * zoom + offset.x;
        const isMajor = Math.abs(Math.round(wx / gridSize)) % majorEvery === 0;
        ctx.strokeStyle = isMajor ? '#d0d0d0' : '#e8e8e8';
        ctx.lineWidth = isMajor ? 1 : 0.5;
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, h);
        ctx.stroke();
      }
      for (let wy = startWy; wy <= endWy; wy += gridSize) {
        const sy = wy * zoom + offset.y;
        const isMajor = Math.abs(Math.round(wy / gridSize)) % majorEvery === 0;
        ctx.strokeStyle = isMajor ? '#d0d0d0' : '#e8e8e8';
        ctx.lineWidth = isMajor ? 1 : 0.5;
        ctx.beginPath();
        ctx.moveTo(0, sy);
        ctx.lineTo(w, sy);
        ctx.stroke();
      }
    }

    // Origin axes
    ctx.strokeStyle = '#ff000044';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(offset.x, 0);
    ctx.lineTo(offset.x, h);
    ctx.stroke();
    ctx.strokeStyle = '#0000ff44';
    ctx.beginPath();
    ctx.moveTo(0, offset.y);
    ctx.lineTo(w, offset.y);
    ctx.stroke();
    ctx.restore();

    // Objects
    const selectedSet = new Set(selectedIds);

    // Draw zones first (below everything)
    const zones = objects.filter((o) => o.type === 'zone');
    const nonZones = objects.filter((o) => o.type !== 'zone');

    for (const obj of zones) {
      drawObject(ctx, obj, offset, zoom, selectedSet.has(obj.id));
    }
    for (const obj of nonZones) {
      drawObject(ctx, obj, offset, zoom, selectedSet.has(obj.id));
    }

    // Selection box
    if (selectionBox) {
      const { x1, y1, x2, y2 } = selectionBox;
      const sx1 = x1 * zoom + offset.x;
      const sy1 = y1 * zoom + offset.y;
      const sw = (x2 - x1) * zoom;
      const sh = (y2 - y1) * zoom;
      ctx.fillStyle = 'rgba(66, 133, 244, 0.1)';
      ctx.strokeStyle = 'rgba(66, 133, 244, 0.6)';
      ctx.lineWidth = 1;
      ctx.fillRect(sx1, sy1, sw, sh);
      ctx.strokeRect(sx1, sy1, sw, sh);
    }

    // Wall preview
    if (wallPreview) {
      const { x1, y1, x2, y2 } = wallPreview;
      const sx1 = x1 * zoom + offset.x;
      const sy1 = y1 * zoom + offset.y;
      const sx2 = x2 * zoom + offset.x;
      const sy2 = y2 * zoom + offset.y;
      ctx.strokeStyle = '#888888aa';
      ctx.lineWidth = 0.2 * zoom;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.lineTo(sx2, sy2);
      ctx.stroke();
    }

    // Measure points & line
    if (measurePoints.length > 0) {
      for (const mp of measurePoints) {
        const sx = mp.x * zoom + offset.x;
        const sy = mp.y * zoom + offset.y;
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.arc(sx, sy, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      if (measurePoints.length === 2) {
        const [p1, p2] = measurePoints;
        const sx1 = p1.x * zoom + offset.x;
        const sy1 = p1.y * zoom + offset.y;
        const sx2 = p2.x * zoom + offset.x;
        const sy2 = p2.y * zoom + offset.y;
        ctx.strokeStyle = '#ff4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(sx1, sy1);
        ctx.lineTo(sx2, sy2);
        ctx.stroke();
        ctx.setLineDash([]);

        const dist = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
        const mx = (sx1 + sx2) / 2;
        const my = (sy1 + sy2) / 2;
        ctx.fillStyle = '#ff4444';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${dist.toFixed(2)}м`, mx, my - 8);
      }
    }
  }, [objects, selectedIds, offset, zoom, gridSize, selectionBox, wallPreview, measurePoints]);

  // Resize canvas on window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
      }
      // Trigger a redraw via a no-op state change
      setOffset((o) => ({ ...o }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom * factor));

      setOffset({
        x: mx - (mx - offset.x) * (newZoom / zoom),
        y: my - (my - offset.y) * (newZoom / zoom),
      });
      setZoom(newZoom);
    },
    [zoom, offset]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 2) return; // right-click handled by contextmenu
      setContextMenu(null);

      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const world = toWorld(sx, sy);

      const store = useStore.getState();

      if (store.tool === 'measure') {
        const snapped = snapPosition(world.x, world.y, store.gridSize, store.snapToGrid);
        store.addMeasurePoint(snapped);
        return;
      }

      if (store.tool === 'wall') {
        const snapped = snapPosition(world.x, world.y, store.gridSize, store.snapToGrid);
        dragRef.current = {
          type: 'wall-draw',
          startScreen: { x: sx, y: sy },
          startWorld: snapped,
        };
        setWallPreview({ x1: snapped.x, y1: snapped.y, x2: snapped.x, y2: snapped.y });
        return;
      }

      // Placement tools
      if (store.tool !== 'select') {
        const snapped = snapPosition(world.x, world.y, store.gridSize, store.snapToGrid);
        const obj = createObject(store.tool as ObjectType, snapped.x, snapped.y);
        store.addObject(obj);
        store.setSelectedIds([obj.id]);
        return;
      }

      // Select tool
      // Check for resize handles on selected objects
      for (const id of store.selectedIds) {
        const obj = store.objects.find((o) => o.id === id);
        if (obj) {
          const handleSizeWorld = 6 / zoom;
          const handle = getResizeHandleAtPoint(world.x, world.y, obj, handleSizeWorld);
          if (handle) {
            dragRef.current = {
              type: 'resize',
              startScreen: { x: sx, y: sy },
              startWorld: world,
              resizeHandle: handle,
              resizeObj: { ...obj },
            };
            return;
          }
        }
      }

      // Check for hit on object
      const hitObj = [...store.objects].reverse().find((o) => pointInObject(world.x, world.y, o));

      if (hitObj) {
        if (e.shiftKey) {
          store.toggleSelection(hitObj.id);
        } else if (!store.selectedIds.includes(hitObj.id)) {
          store.setSelectedIds([hitObj.id]);
        }
        // Start move
        const currentSelected = e.shiftKey
          ? useStore.getState().selectedIds
          : store.selectedIds.includes(hitObj.id)
          ? store.selectedIds
          : [hitObj.id];
        const origPositions = store.objects
          .filter((o) => currentSelected.includes(o.id))
          .map((o) => ({ id: o.id, x: o.x, y: o.y }));

        dragRef.current = {
          type: 'move',
          startScreen: { x: sx, y: sy },
          startWorld: world,
          origPositions,
          shiftConstrain: null,
        };
      } else {
        // Start selection box
        if (!e.shiftKey) store.clearSelection();
        dragRef.current = {
          type: 'select-box',
          startScreen: { x: sx, y: sy },
          startWorld: world,
        };
      }
    },
    [toWorld, zoom]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const world = toWorld(sx, sy);

      useStore.getState().setCursorPos({ x: Math.round(world.x * 10) / 10, y: Math.round(world.y * 10) / 10 });

      const drag = dragRef.current;

      if (drag.type === 'pan') {
        setOffset({
          x: offset.x + (sx - drag.startScreen.x),
          y: offset.y + (sy - drag.startScreen.y),
        });
        drag.startScreen = { x: sx, y: sy };
        return;
      }

      if (drag.type === 'move' && drag.origPositions) {
        const store = useStore.getState();
        let dx = world.x - drag.startWorld.x;
        let dy = world.y - drag.startWorld.y;

        if (e.shiftKey) {
          if (!drag.shiftConstrain) {
            if (Math.abs(dx) > Math.abs(dy)) drag.shiftConstrain = 'x';
            else if (Math.abs(dy) > Math.abs(dx)) drag.shiftConstrain = 'y';
          }
          if (drag.shiftConstrain === 'x') dy = 0;
          if (drag.shiftConstrain === 'y') dx = 0;
        } else {
          drag.shiftConstrain = null;
        }

        const updates = drag.origPositions.map((op) => {
          const newPos = snapPosition(op.x + dx, op.y + dy, store.gridSize, store.snapToGrid);
          return { id: op.id, changes: { x: newPos.x, y: newPos.y } };
        });

        // Direct update without snapshot to avoid spamming history
        const updateMap = new Map(updates.map((u) => [u.id, u.changes]));
        const newObjects = store.objects.map((o) => {
          const changes = updateMap.get(o.id);
          return changes ? { ...o, ...changes } : o;
        });
        useStore.setState({ objects: newObjects });
        return;
      }

      if (drag.type === 'resize' && drag.resizeObj && drag.resizeHandle) {
        const store = useStore.getState();
        const obj = drag.resizeObj;
        const rad = (-obj.rotation * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        const dwx = world.x - drag.startWorld.x;
        const dwy = world.y - drag.startWorld.y;
        const localDx = dwx * cos - dwy * sin;
        const localDy = dwx * sin + dwy * cos;

        let newWidth = obj.width;
        let newDepth = obj.depth;
        let newX = obj.x;
        let newY = obj.y;

        const h = drag.resizeHandle;
        if (h.includes('right')) {
          newWidth = Math.max(0.1, obj.width + localDx);
          const shift = (newWidth - obj.width) / 2;
          newX += shift * Math.cos(-rad);
          newY -= shift * Math.sin(-rad);
        }
        if (h.includes('left')) {
          newWidth = Math.max(0.1, obj.width - localDx);
          const shift = (newWidth - obj.width) / 2;
          newX -= shift * Math.cos(-rad);
          newY += shift * Math.sin(-rad);
        }
        if (h.includes('bottom')) {
          newDepth = Math.max(0.1, obj.depth + localDy);
          const shift = (newDepth - obj.depth) / 2;
          newX += shift * Math.sin(rad);
          newY += shift * Math.cos(rad);
        }
        if (h.includes('top')) {
          newDepth = Math.max(0.1, obj.depth - localDy);
          const shift = (newDepth - obj.depth) / 2;
          newX -= shift * Math.sin(rad);
          newY -= shift * Math.cos(rad);
        }

        const snapped = snapPosition(newX, newY, store.gridSize, store.snapToGrid);
        const newObjects = store.objects.map((o) =>
          o.id === obj.id
            ? { ...o, x: snapped.x, y: snapped.y, width: Math.round(newWidth * 10) / 10, depth: Math.round(newDepth * 10) / 10 }
            : o
        );
        useStore.setState({ objects: newObjects });
        return;
      }

      if (drag.type === 'select-box') {
        setSelectionBox({
          x1: drag.startWorld.x,
          y1: drag.startWorld.y,
          x2: world.x,
          y2: world.y,
        });
        return;
      }

      if (drag.type === 'wall-draw') {
        const snapped = snapPosition(world.x, world.y, useStore.getState().gridSize, useStore.getState().snapToGrid);
        setWallPreview({
          x1: drag.startWorld.x,
          y1: drag.startWorld.y,
          x2: snapped.x,
          y2: snapped.y,
        });
        return;
      }
    },
    [toWorld, offset, zoom]
  );

  const handleMouseUp = useCallback(() => {
    const drag = dragRef.current;

    if (drag.type === 'move' && drag.origPositions) {
      // Save a single snapshot for the entire move
      const store = useStore.getState();
      // We need to push a manual snapshot with the original state
      const history = [...store.history, store.objects.map((o) => {
        const orig = drag.origPositions!.find((op) => op.id === o.id);
        return orig ? { ...o, x: orig.x, y: orig.y } : o;
      })];
      if (history.length > 50) history.shift();
      useStore.setState({ history, future: [] });
    }

    if (drag.type === 'resize' && drag.resizeObj) {
      const store = useStore.getState();
      const history = [...store.history, store.objects.map((o) =>
        o.id === drag.resizeObj!.id ? { ...drag.resizeObj! } : o
      )];
      if (history.length > 50) history.shift();
      useStore.setState({ history, future: [] });
    }

    if (drag.type === 'select-box' && selectionBox) {
      const store = useStore.getState();
      const ids = objectsInRect(
        store.objects,
        selectionBox.x1,
        selectionBox.y1,
        selectionBox.x2,
        selectionBox.y2
      );
      store.setSelectedIds(ids);
      setSelectionBox(null);
    }

    if (drag.type === 'wall-draw' && wallPreview) {
      const { x1, y1, x2, y2 } = wallPreview;
      const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      if (len > 0.1) {
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
        const wall = createObject('wall', cx, cy, {
          depth: Math.round(len * 10) / 10,
          rotation: angle,
        });
        const store = useStore.getState();
        store.addObject(wall);
        store.setSelectedIds([wall.id]);
      }
      setWallPreview(null);
    }

    dragRef.current = { type: 'none', startScreen: { x: 0, y: 0 }, startWorld: { x: 0, y: 0 } };
  }, [selectionBox, wallPreview]);

  const handleMiddleDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 1) {
        e.preventDefault();
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        dragRef.current = {
          type: 'pan',
          startScreen: { x: e.clientX - rect.left, y: e.clientY - rect.top },
          startWorld: { x: 0, y: 0 },
        };
      }
    },
    []
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const world = toWorld(e.clientX - rect.left, e.clientY - rect.top);
      const store = useStore.getState();

      const hitObj = [...store.objects].reverse().find((o) => pointInObject(world.x, world.y, o));
      if (hitObj) {
        if (!store.selectedIds.includes(hitObj.id)) {
          store.setSelectedIds([hitObj.id]);
        }
        setContextMenu({ x: e.clientX, y: e.clientY });
      }
    },
    [toWorld]
  );

  return (
    <div ref={containerRef} className="flex-1 relative overflow-hidden cursor-crosshair">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        onWheel={handleWheel}
        onMouseDown={(e) => {
          if (e.button === 1) handleMiddleDown(e);
          else handleMouseDown(e);
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={handleContextMenu}
      />
      {contextMenu && (
        <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={() => setContextMenu(null)} />
      )}
    </div>
  );
};

function drawObject(
  ctx: CanvasRenderingContext2D,
  obj: WarehouseObject,
  offset: { x: number; y: number },
  zoom: number,
  selected: boolean
) {
  const cx = obj.x * zoom + offset.x;
  const cy = obj.y * zoom + offset.y;
  const w = obj.width * zoom;
  const d = obj.depth * zoom;
  const rad = (obj.rotation * Math.PI) / 180;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rad);

  // Fill
  if (obj.type === 'zone') {
    const hex = obj.color;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.3)`;
  } else {
    ctx.fillStyle = obj.color;
  }
  ctx.fillRect(-w / 2, -d / 2, w, d);

  // Stroke
  ctx.strokeStyle = selected ? '#2196F3' : '#00000044';
  ctx.lineWidth = selected ? 2 : 1;
  ctx.strokeRect(-w / 2, -d / 2, w, d);

  // Label
  if (obj.label || obj.type === 'zone') {
    const label = obj.label || '';
    ctx.fillStyle = '#333';
    ctx.font = `${Math.max(10, Math.min(14, w * 0.2))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 0, 0, w - 4);
  }

  // Type indicator for non-zone objects without label
  if (!obj.label && obj.type !== 'zone') {
    const short = obj.type.charAt(0).toUpperCase();
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.max(8, Math.min(12, w * 0.25))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(short, 0, 0);
  }

  // Resize handles for selected
  if (selected) {
    const hs = 5;
    ctx.fillStyle = '#2196F3';
    // Corners
    ctx.fillRect(-w / 2 - hs, -d / 2 - hs, hs * 2, hs * 2);
    ctx.fillRect(w / 2 - hs, -d / 2 - hs, hs * 2, hs * 2);
    ctx.fillRect(-w / 2 - hs, d / 2 - hs, hs * 2, hs * 2);
    ctx.fillRect(w / 2 - hs, d / 2 - hs, hs * 2, hs * 2);
    // Edge midpoints
    ctx.fillRect(-hs, -d / 2 - hs, hs * 2, hs * 2);
    ctx.fillRect(-hs, d / 2 - hs, hs * 2, hs * 2);
    ctx.fillRect(-w / 2 - hs, -hs, hs * 2, hs * 2);
    ctx.fillRect(w / 2 - hs, -hs, hs * 2, hs * 2);
  }

  ctx.restore();
}
