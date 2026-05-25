import type { CSSProperties } from "react";
import { useState } from "react";
import { puzzlesById } from "../data/puzzles";
import type { RoomObject } from "../data/types";
import { useGameStore } from "../store/gameStore";

type HotspotObjectProps = {
  object: RoomObject;
  onSelect: (object: RoomObject) => void;
};

export function HotspotObject({ object, onSelect }: HotspotObjectProps): React.JSX.Element {
  const solvedPuzzleIds = useGameStore((state) => state.solvedPuzzleIds);
  const puzzle = puzzlesById[object.puzzleId];
  const isSolved = object.kind === "puzzle" && solvedPuzzleIds.includes(object.puzzleId);
  const isHiddenClue = object.kind === "puzzle" && Boolean(puzzle?.isHidden);
  const style = { left: `${object.x}%`, top: `${object.y}%` } satisfies CSSProperties;

  const [spriteReady, setSpriteReady] = useState(false);
  const showSprite = Boolean(object.assetImage) && spriteReady;

  return (
    <button
      className={`hotspot ${object.kind === "door" ? "door" : ""} ${isSolved ? "solved" : ""} ${isHiddenClue ? "hidden-clue" : ""} ${showSprite ? "has-sprite" : ""}`}
      onClick={() => onSelect(object)}
      style={style}
      type="button"
    >
      {object.assetImage && (
        <img
          alt=""
          className="hotspot-image"
          src={object.assetImage}
          onLoad={() => setSpriteReady(true)}
          onError={() => setSpriteReady(false)}
          style={spriteReady ? undefined : { display: "none" }}
        />
      )}
      {!showSprite && (
        <span className="hotspot-icon">{object.placeholderIcon ?? "?"}</span>
      )}
      <span className="hotspot-label">{object.title}</span>
      <span className="hotspot-status">{isSolved ? "해제됨" : object.kind === "door" ? "잠김" : isHiddenClue ? "숨겨진 단서" : "조사"}</span>
    </button>
  );
}
