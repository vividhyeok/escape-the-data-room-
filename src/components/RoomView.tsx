import type { Room, RoomObject } from "../data/types";
import { useGameStore } from "../store/gameStore";
import { HotspotObject } from "./HotspotObject";

type RoomViewProps = {
  room: Room;
  objects: RoomObject[];
  onObjectAction: (object: RoomObject) => void;
};

export function RoomView({ room, objects, onObjectAction }: RoomViewProps): React.JSX.Element {
  const currentViewId = useGameStore((state) => state.currentViewId);
  const setCurrentView = useGameStore((state) => state.setCurrentView);
  const currentView = room.views.find((view) => view.id === currentViewId) ?? room.views[0];
  const currentIndex = room.views.findIndex((view) => view.id === currentView.id);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const visibleObjects = objects.filter((object) => object.viewId === currentView.id);

  function shiftView(delta: number): void {
    const nextIndex = (safeIndex + delta + room.views.length) % room.views.length;
    setCurrentView(room.views[nextIndex].id);
  }

  return (
    <section className="room-area game-scene-layer" aria-label={`${room.title} 인터랙티브 룸`}>
      <div className={`room-stage tone-${currentView.placeholderTone}`} key={currentView.id}>
        <div className="room-backdrop" aria-hidden="true">
          <div className="backdrop-grid" />
          <div className="backdrop-console console-a" />
          <div className="backdrop-console console-b" />
          <div className="backdrop-doorline" />
        </div>
        <div className="view-label">
          <span>{currentView.title}</span>
        </div>
        {visibleObjects.map((object) => (
          <HotspotObject key={object.id} object={object} onSelect={onObjectAction} />
        ))}
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
