import type { CSSProperties } from "react";
import type { RoomObject } from "../data/types";
import { useGameStore } from "../store/gameStore";

type HotspotObjectProps = {
  object: RoomObject;
  onSelect: (object: RoomObject) => void;
};

export function HotspotObject({ object, onSelect }: HotspotObjectProps): React.JSX.Element {
  const solvedPuzzleIds = useGameStore((state) => state.solvedPuzzleIds);
  const isSolved = object.kind === "puzzle" && solvedPuzzleIds.includes(object.puzzleId);
  const style = { left: `${object.x}%`, top: `${object.y}%` } satisfies CSSProperties;

  return (
    <button
      className={`hotspot ${object.kind === "door" ? "door" : ""} ${isSolved ? "solved" : ""}`}
      onClick={() => onSelect(object)}
      style={style}
      type="button"
    >
      <span className="hotspot-icon">{object.placeholderIcon ?? "?"}</span>
      <span className="hotspot-label">{object.title}</span>
      <span className="hotspot-status">{isSolved ? "해제됨" : object.kind === "door" ? "잠김" : "조사"}</span>
    </button>
  );
}
