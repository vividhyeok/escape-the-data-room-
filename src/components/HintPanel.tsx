import type { Room } from "../data/types";
import { useGameStore } from "../store/gameStore";

type HintPanelProps = {
  room: Room;
  puzzleCount: number;
};

export function HintPanel({ room, puzzleCount }: HintPanelProps): React.JSX.Element {
  const collectedHints = useGameStore((state) => state.collectedHints);
  const solvedPuzzleIds = useGameStore((state) => state.solvedPuzzleIds);
  const roomHints = collectedHints.filter((hint) => hint.roomId === room.id);
  const solvedInRoom = solvedPuzzleIds.filter((id) => id.startsWith(room.id)).length;

  return (
    <aside className="hint-panel" aria-label="Inventory and collected hints">
      <div>
        <span className="panel-eyebrow">Inventory</span>
        <h2>Signal Hints</h2>
      </div>
      <div className="progress-readout">
        <span>{solvedInRoom}</span>
        <p>of {puzzleCount} puzzles solved</p>
      </div>
      <ul className="hint-list">
        {roomHints.map((hint) => (
          <li key={hint.id}>{hint.text}</li>
        ))}
      </ul>
      {!roomHints.length ? <p className="empty-note">No conditions collected in this room.</p> : null}
    </aside>
  );
}

