import { getPuzzlesForRoom } from "../data/puzzles";
import { roomOrder } from "../data/rooms";
import { useGameStore } from "../store/gameStore";
import { GameWindow } from "./GameWindow";

type EndingWindowProps = {
  onClose: () => void;
};

const countedRooms = roomOrder.filter((roomId) => roomId !== "room-0" && roomId !== "room-3");

export function EndingWindow({ onClose }: EndingWindowProps): React.JSX.Element {
  const solvedPuzzleIds = useGameStore((state) => state.solvedPuzzleIds);
  const codeDrafts = useGameStore((state) => state.codeDrafts);

  const puzzles = countedRooms.flatMap((roomId) => getPuzzlesForRoom(roomId));
  const requiredPuzzles = puzzles.filter((puzzle) => puzzle.isRequired);
  const hiddenPuzzles = puzzles.filter((puzzle) => puzzle.isHidden);
  const solvedRequired = requiredPuzzles.filter((puzzle) => solvedPuzzleIds.includes(puzzle.id));
  const solvedHidden = hiddenPuzzles.filter((puzzle) => solvedPuzzleIds.includes(puzzle.id));
  const usedConcepts = Array.from(
    new Set(
      puzzles
        .filter((puzzle) => solvedPuzzleIds.includes(puzzle.id))
        .flatMap((puzzle) => puzzle.targetConcepts ?? []),
    ),
  );
  const draftCount = Object.values(codeDrafts).filter((draft) => draft.trim()).length;

  return (
    <GameWindow id="ending-window" type="review" eyebrow="Ending" title="Escape Complete" onClose={onClose}>
      <div className="ending-window">
        <div className="ending-scene" aria-hidden="true">
          <span className="ending-door-glow" />
          <span className="ending-stairs-shadow" />
        </div>
        <section className="ending-copy">
          <h2>출구가 열렸다.</h2>
          <p>
            밖의 빛이 들어오고, 뒤쪽 계단 아래에서는 아직 정리되지 않은 신호가 낮게 울린다.
            오늘은 여기서 나가도 충분하다.
          </p>
        </section>
        <div className="ending-stats">
          <span>필수 단서 <strong>{solvedRequired.length}/{requiredPuzzles.length}</strong></span>
          <span>숨겨진 단서 <strong>{solvedHidden.length}/{hiddenPuzzles.length}</strong></span>
          <span>저장된 draft <strong>{draftCount}</strong></span>
          <span>사용한 도구 <strong>{usedConcepts.length}</strong></span>
        </div>
        <div className="concept-chip-list ending-tools">
          {usedConcepts.length ? usedConcepts.map((concept) => <span key={concept}>{concept}</span>) : <p>기록된 Python 도구가 없습니다.</p>}
        </div>
        <div className="modal-actions">
          <button className="primary-button" onClick={onClose} type="button">
            엔딩 닫기
          </button>
        </div>
      </div>
    </GameWindow>
  );
}
