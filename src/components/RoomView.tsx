import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture, Html } from "@react-three/drei";
import { Suspense, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import type { Room, RoomObject } from "../data/types";
import { useGameStore } from "../store/gameStore";
import { HotspotObject } from "./HotspotObject";
import { rooms } from "../data/rooms"; // Import rooms to list them in the editor

type RoomViewProps = {
  room: Room;
  objects: RoomObject[];
  onObjectAction: (object: RoomObject) => void;
};

function RoomCylinder({ panoramaImage, objects, onObjectAction, isEditMode }: { panoramaImage: string, objects: RoomObject[], onObjectAction: (o: RoomObject) => void, isEditMode: boolean }) {
  const texture = useTexture(panoramaImage);
  
  const material = useMemo(() => {
    const mat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.x = -1;
    return mat;
  }, [texture]);

  return (
    <group>
      <mesh material={material}>
        {/* args: radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded */}
        <cylinderGeometry args={[50, 50, 75, 64, 1, true]} />
      </mesh>
      
      {objects.map(obj => {
        const theta = (obj.x / 100 - 0.5) * (Math.PI * 1.5);
        const px = 49.8 * Math.sin(theta);
        const pz = -49.8 * Math.cos(theta);
        const py = -((obj.y / 100) * 75 - 37.5);
        const rotation: [number, number, number] = [0, -theta, 0];

        return (
          <Html 
            key={obj.id} 
            position={[px, py, pz]} 
            rotation={rotation}
            transform 
            occlude={!isEditMode}
            zIndexRange={[100, 0]}
          >
            <div className={`hotspot-layer ${isEditMode ? 'edit-mode' : ''}`} style={{ position: 'relative', width: 0, height: 0, pointerEvents: 'none' }}>
               <div style={{ position: 'absolute', transform: 'translate(-50%, -50%)', pointerEvents: 'auto' }}>
                 <HotspotObject object={obj} onSelect={onObjectAction} />
               </div>
            </div>
          </Html>
        );
      })}
    </group>
  );
}

export function RoomView({ room, objects, onObjectAction }: RoomViewProps): React.JSX.Element {
  const currentViewId = useGameStore((state) => state.currentViewId);
  const currentView = room.views.find((v) => v.id === currentViewId) ?? room.views[0];

  const [isEditMode, setIsEditMode] = useState(false);
  const [localObjects, setLocalObjects] = useState(objects);
  const [selectedObjId, setSelectedObjId] = useState<string | null>(null);

  useEffect(() => {
    setLocalObjects(objects);
  }, [objects]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e') {
        setIsEditMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUpdate = (id: string, field: keyof RoomObject, value: number) => {
    setLocalObjects(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const copyToClipboard = () => {
    const json = JSON.stringify(localObjects.map(o => ({ id: o.id, x: o.x, y: o.y, scale: o.scale, rotation: o.rotation })), null, 2);
    navigator.clipboard.writeText(json);
    alert("복사 완료!");
  };

  const setCurrentRoom = useGameStore(state => state.setCurrentRoom);

  return (
    <section className="room-area game-scene-layer" aria-label={`${room.title} 인터랙티브 룸`} style={{ background: '#000' }}>
      <div className={`room-stage tone-${currentView.placeholderTone}`} style={{ width: '100%', height: '100%', background: '#000' }}>
        {room.panoramaImage ? (
          <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }} gl={{ antialias: true }}>
            <color attach="background" args={["#000"]} />
            <Suspense fallback={null}>
              <RoomCylinder panoramaImage={room.panoramaImage} objects={localObjects} onObjectAction={isEditMode ? (o) => setSelectedObjId(o.id) : onObjectAction} isEditMode={isEditMode} />
            </Suspense>
            <OrbitControls 
              enableZoom={false} 
              enablePan={false} 
              enableDamping 
              dampingFactor={0.02}
              rotateSpeed={-0.15} 
              minPolarAngle={Math.PI / 2 - 0.25}
              maxPolarAngle={Math.PI / 2 + 0.3}
              minAzimuthAngle={-Math.PI / 1.6}
              maxAzimuthAngle={Math.PI / 1.6}
            />
          </Canvas>
        ) : (
          <div className="room-backdrop" aria-hidden="true">
            <div className="backdrop-grid" />
            <div className="backdrop-text">{currentView.id.toUpperCase()}</div>
          </div>
        )}
      </div>

      {isEditMode && (
        <div style={{ position: 'absolute', top: 100, right: 20, background: 'rgba(0,0,0,0.8)', padding: 20, borderRadius: 8, color: 'white', zIndex: 1000, minWidth: 300, border: '1px solid #7af3ff' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#7af3ff' }}>Edit Mode (Ctrl+Shift+E)</h3>
          
          <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
            {rooms.map(r => (
              <button 
                key={r.id} 
                onClick={() => { setSelectedObjId(null); setCurrentRoom(r.id); }}
                style={{ flex: 1, padding: '5px', background: room.id === r.id ? '#7af3ff' : '#333', color: room.id === r.id ? '#000' : '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                {r.id.replace('room-', 'R')}
              </button>
            ))}
          </div>

          <p style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: 15 }}>오브젝트를 클릭하여 선택하세요.</p>
          
          <select 
            value={selectedObjId || ""} 
            onChange={(e) => setSelectedObjId(e.target.value)}
            style={{ width: '100%', padding: '5px', marginBottom: '15px', background: '#333', color: 'white', border: '1px solid #555' }}
          >
            <option value="">-- 오브젝트 선택 --</option>
            {localObjects.map(o => (
              <option key={o.id} value={o.id}>{o.id}</option>
            ))}
          </select>

          {selectedObjId && (() => {
            const obj = localObjects.find(o => o.id === selectedObjId);
            if (!obj) return null;
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label>X: {obj.x.toFixed(1)}<br/>
                  <input type="range" min="0" max="100" step="0.1" value={obj.x} onChange={(e) => handleUpdate(obj.id, 'x', parseFloat(e.target.value))} style={{ width: '100%' }} />
                </label>
                <label>Y: {obj.y.toFixed(1)}<br/>
                  <input type="range" min="0" max="100" step="0.1" value={obj.y} onChange={(e) => handleUpdate(obj.id, 'y', parseFloat(e.target.value))} style={{ width: '100%' }} />
                </label>
                <label>Scale: {obj.scale ?? 1}<br/>
                  <input type="range" min="0.1" max="5" step="0.1" value={obj.scale ?? 1} onChange={(e) => handleUpdate(obj.id, 'scale', parseFloat(e.target.value))} style={{ width: '100%' }} />
                </label>
                <label>Rotation: {obj.rotation ?? 0}&deg;<br/>
                  <input type="range" min="-180" max="180" step="1" value={obj.rotation ?? 0} onChange={(e) => handleUpdate(obj.id, 'rotation', parseFloat(e.target.value))} style={{ width: '100%' }} />
                </label>
              </div>
            );
          })()}
          
          <button onClick={copyToClipboard} style={{ marginTop: '20px', width: '100%', padding: '10px', background: '#7af3ff', color: 'black', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
            데이터 복사 (Copy JSON)
          </button>
        </div>
      )}
    </section>
  );
}
