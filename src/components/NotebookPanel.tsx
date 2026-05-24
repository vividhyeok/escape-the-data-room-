import { getPuzzlesForRoom } from "../data/puzzles";
import type { Room } from "../data/types";
import { useGameStore } from "../store/gameStore";
import { GameWindow } from "./GameWindow";

type NotebookPanelProps = {
  room: Room;
  onClose: () => void;
};

export function NotebookPanel({ room, onClose }: NotebookPanelProps): React.JSX.Element {
  const solvedPuzzleIds = useGameStore((state) => state.solvedPuzzleIds);
  const collectedHints = useGameStore((state) => state.collectedHints);
  const codeDrafts = useGameStore((state) => state.codeDrafts);
  const roomPuzzles = getPuzzlesForRoom(room.id);
  const roomHints = collectedHints.filter((hint) => hint.roomId === room.id);

  return (
    <GameWindow id={`notebook-${room.id}`} type="notebook" eyebrow="노트북" title={room.subtitle} onClose={onClose}>
      <div className="notebook-panel">
        <div className="notebook-grid">
          <section>
            <h3>획득한 단서</h3>
            {roomHints.length ? (
              <ul>
                {roomHints.map((hint) => (
                  <li key={hint.id}>{hint.text}</li>
                ))}
              </ul>
            ) : (
              <p>수집된 단서 없음.</p>
            )}
          </section>

          <section>
            <h3>오브젝트 현황</h3>
            <ul className="status-list">
              {roomPuzzles.map((puzzle) => (
                <li className={solvedPuzzleIds.includes(puzzle.id) ? "solved" : ""} key={puzzle.id}>
                  <span>{puzzle.title}</span>
                  <strong>{solvedPuzzleIds.includes(puzzle.id) ? "해제됨" : "잠김"}</strong>
                </li>
              ))}
            </ul>
          </section>

          <section className="notebook-drafts">
            <h3>저장된 코드</h3>
            {roomPuzzles.map((puzzle) => (
              <details key={puzzle.id}>
                <summary>{puzzle.title}</summary>
                <pre>{codeDrafts[puzzle.id] || "저장된 코드 없음."}</pre>
              </details>
            ))}
          </section>
        </div>
      </div>
    </GameWindow>
  );
}
