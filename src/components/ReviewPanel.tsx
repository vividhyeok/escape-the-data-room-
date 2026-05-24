import { getPuzzlesForRoom } from "../data/puzzles";
import { roomOrder, roomsById } from "../data/rooms";
import type { Room } from "../data/types";
import { useGameStore } from "../store/gameStore";
import { GameWindow } from "./GameWindow";

type ReviewPanelProps = {
  room: Room;
};

export function ReviewPanel({ room }: ReviewPanelProps): React.JSX.Element {
  const solvedPuzzleIds = useGameStore((state) => state.solvedPuzzleIds);
  const collectedHints = useGameStore((state) => state.collectedHints);
  const codeDrafts = useGameStore((state) => state.codeDrafts);
  const setCurrentRoom = useGameStore((state) => state.setCurrentRoom);
  const closeReview = useGameStore((state) => state.closeReview);

  const roomPuzzles = getPuzzlesForRoom(room.id);
  const solvedPuzzles = roomPuzzles.filter((puzzle) => solvedPuzzleIds.includes(puzzle.id));
  const unsolvedPuzzles = roomPuzzles.filter((puzzle) => !solvedPuzzleIds.includes(puzzle.id));
  const roomHints = collectedHints.filter((hint) => hint.roomId === room.id);
  const currentIndex = roomOrder.indexOf(room.id as (typeof roomOrder)[number]);
  const nextRoomId = roomOrder[currentIndex + 1];
  const nextRoom = nextRoomId ? roomsById[nextRoomId] : undefined;

  function goNext(): void {
    if (nextRoom) {
      setCurrentRoom(nextRoom.id);
      return;
    }

    closeReview();
  }

  return (
    <GameWindow id={`review-${room.id}`} type="review" eyebrow="방 클리어" title={room.subtitle} onClose={closeReview}>
      <div className="review-modal">
        <div className="inference-callout">
          <strong>모든 오브젝트를 해제하지 않아도 Door Code를 추론할 수 있다.</strong>
          <p>
            수집한 단서를 조합하면 각 자리를 좁힐 수 있고, 모든 조건을 동시에 만족하는 유일한 값이 Door Code다.
            {roomHints.length > 0 && roomPuzzles.length > 0 ? (
              <span className="hint-fraction"> ({roomHints.length}/{roomPuzzles.length}개 조건 획득)</span>
            ) : null}
          </p>
        </div>

        <div className="review-grid">
          <section>
            <h3>획득한 단서</h3>
            {solvedPuzzles.length ? (
              <ul>
                {solvedPuzzles.map((puzzle) => (
                  <li key={puzzle.id}>{puzzle.title}</li>
                ))}
              </ul>
            ) : (
              <p>획득한 단서 없음.</p>
            )}
          </section>
          <section>
            <h3>미해제 오브젝트</h3>
            {unsolvedPuzzles.length ? (
              <ul>
                {unsolvedPuzzles.map((puzzle) => (
                  <li key={puzzle.id}>{puzzle.title}</li>
                ))}
              </ul>
            ) : (
              <p>모든 오브젝트 해제됨.</p>
            )}
          </section>
          <section className="review-conditions-section">
            <h3>Door Code 단서</h3>
            {roomHints.length ? (
              <ul className="conditions-list">
                {roomHints.map((hint) => (
                  <li key={hint.id}>{hint.text}</li>
                ))}
              </ul>
            ) : (
              <p>수집된 단서 없음.</p>
            )}
          </section>
          <section>
            <h3>저장된 코드</h3>
            <div className="draft-list">
              {roomPuzzles.map((puzzle) => (
                <details key={puzzle.id}>
                  <summary>{puzzle.title}</summary>
                  <pre>{codeDrafts[puzzle.id] || "저장된 코드 없음."}</pre>
                </details>
              ))}
            </div>
          </section>
        </div>

        <div className="modal-actions">
          <button className="primary-button" onClick={goNext} type="button">
            {nextRoom ? `다음: ${nextRoom.subtitle}` : "완료"}
          </button>
          <button className="ghost-button" onClick={closeReview} type="button">
            방으로 돌아가기
          </button>
        </div>
      </div>
    </GameWindow>
  );
}
