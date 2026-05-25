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
  const scale = object.scale || 1;
  const style = { 
    left: `${object.x}%`, 
    top: `${object.y}%`, 
    transform: `translate(-50%, -50%) scale(${scale})` 
  } satisfies CSSProperties;

  const [spriteReady, setSpriteReady] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const showSprite = Boolean(object.assetImage) && spriteReady;

  return (
    <button
      className={`hotspot ${object.kind === "door" ? "door" : ""} ${isSolved ? "solved" : ""} ${isHiddenClue ? "hidden-clue" : ""} ${showSprite ? "has-sprite" : ""}`}
      onClick={() => onSelect(object)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
          style={{
            display: spriteReady ? "block" : "none",
            transform: object.rotation ? `rotate(${object.rotation}deg)` : undefined
          }}
        />
      )}
      {!showSprite && (
        <span className="hotspot-icon">{object.placeholderIcon ?? "?"}</span>
      )}
      
      {isHovered && (
        <div 
          className="hotspot-tooltip" 
          style={{ 
            transform: `translateX(-50%) scale(${1 / scale})`,
            transformOrigin: 'top center',
            // Adjust bottom position so it remains a constant visual distance
            bottom: `calc(${-(object.assetImage ? 20 : 60) * scale}px - 40px)` 
          }}
        >
          {object.title}
        </div>
      )}
    </button>
  );
}
