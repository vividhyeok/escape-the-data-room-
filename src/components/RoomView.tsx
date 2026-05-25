import { useState } from "react";
import type { Room, RoomObject, ViewId } from "../data/types";
import { useGameStore } from "../store/gameStore";
import { HotspotObject } from "./HotspotObject";

type RoomViewProps = {
  room: Room;
  objects: RoomObject[];
  onObjectAction: (object: RoomObject) => void;
};

// translateX moves the 300%-wide track so the correct third is visible.
// rotateY gives a subtle "turning head" depth cue without full 3D panels.
const VIEW_TRANSFORM: Record<ViewId, string> = {
  left:   "translateX(0%)       rotateY(8deg)",
  center: "translateX(-33.33%)  rotateY(0deg)",
  right:  "translateX(-66.67%)  rotateY(-8deg)",
};

export function RoomView({ room, objects, onObjectAction }: RoomViewProps): React.JSX.Element {
  const currentViewId = useGameStore((state) => state.currentViewId);
  const setCurrentView = useGameStore((state) => state.setCurrentView);
  const currentView = room.views.find((v) => v.id === currentViewId) ?? room.views[0];
  const currentIndex = room.views.findIndex((v) => v.id === currentView.id);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const visibleObjects = objects.filter((o) => o.viewId === currentView.id);

  const [bgReady, setBgReady] = useState(false);
  const showBg = Boolean(room.backgroundImage) && bgReady;
  const trackTransform = VIEW_TRANSFORM[currentView.id as ViewId] ?? VIEW_TRANSFORM.center;

  function shiftView(delta: number): void {
    const nextIndex = (safeIndex + delta + room.views.length) % room.views.length;
    setCurrentView(room.views[nextIndex].id);
  }

  return (
    <section className="room-area game-scene-layer" aria-label={`${room.title} 인터랙티브 룸`}>
      <div className={`room-stage tone-${currentView.placeholderTone}${showBg ? " has-bg" : ""}`}>

        {/* CSS backdrop — visible until real image loads or if no image */}
        {!showBg && (
          <div className="room-backdrop" aria-hidden="true">
            <div className="backdrop-grid" />
            <div className="backdrop-console console-a" />
            <div className="backdrop-console console-b" />
            <div className="backdrop-doorline" />
          </div>
        )}

        {/* Wide panorama track — single 4608px image panned left/center/right */}
        {room.backgroundImage && (
          <div aria-hidden="true" className="room-bg-wrapper">
            <div className="room-bg-track" style={{ transform: trackTransform }}>
              <img
                alt=""
                src={room.backgroundImage}
                onLoad={() => setBgReady(true)}
                onError={() => setBgReady(false)}
              />
            </div>
          </div>
        )}

        {/* Hotspot layer — 2D overlay, always on top */}
        <div className="hotspot-layer">
          {visibleObjects.map((object) => (
            <HotspotObject key={object.id} object={object} onSelect={onObjectAction} />
          ))}
        </div>

        <div className="view-label">
          <span>{currentView.title}</span>
        </div>
      </div>

      <button className="view-edge view-edge-left" onClick={() => shiftView(-1)} type="button" aria-label="왼쪽 보기">
        ◀
      </button>
      <button className="view-edge view-edge-right" onClick={() => shiftView(1)} type="button" aria-label="오른쪽 보기">
        ▶
      </button>

      <div className="view-switcher" aria-label="현재 뷰 표시">
        <div className="view-indicator" aria-hidden="true">
          {room.views.map((view, index) => (
            <span className={index === safeIndex ? "active" : ""} key={`${view.id}-indicator`} />
          ))}
        </div>
      </div>
    </section>
  );
}
