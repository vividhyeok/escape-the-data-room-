import { getPuzzlesForRoom } from "../data/puzzles";
import { roomOrder, roomsById } from "../data/rooms";
import type { Room } from "../data/types";
import { useGameStore } from "../store/gameStore";
import { GameWindow } from "./GameWindow";

type ReviewPanelProps = {
  room: Room;
  onFinalExit?: () => void;
};

export function ReviewPanel({ room, onFinalExit }: ReviewPanelProps): React.JSX.Element {
  const solvedPuzzleIds = useGameStore((state) => state.solvedPuzzleIds);
  const collectedHints = useGameStore((state) => state.collectedHints);
  const codeDrafts = useGameStore((state) => state.codeDrafts);
  const roomPuzzles = getPuzzlesForRoom(room.id);
  const solvedPuzzles = roomPuzzles.filter((puzzle) => solvedPuzzleIds.includes(puzzle.id));
  const requiredPuzzles = roomPuzzles
    .filter((puzzle) => puzzle.isRequired)
    .sort((a, b) => (a.doorCodePosition ?? 99) - (b.doorCodePosition ?? 99));
  const hiddenPuzzles = roomPuzzles.filter((puzzle) => puzzle.isHidden);
  const solvedRequiredPuzzles = requiredPuzzles.filter((puzzle) => solvedPuzzleIds.includes(puzzle.id));
  const missedHiddenPuzzles = hiddenPuzzles.filter((puzzle) => !solvedPuzzleIds.includes(puzzle.id));
  const roomHints = collectedHints.filter((hint) => hint.roomId === room.id);
  const currentIndex = roomOrder.indexOf(room.id as (typeof roomOrder)[number]);
  const nextRoomId = roomOrder[currentIndex + 1];
  const nextRoom = nextRoomId ? roomsById[nextRoomId] : undefined;
  const setCurrentRoom = useGameStore((state) => state.setCurrentRoom);
  const closeReview = useGameStore((state) => state.closeReview);
  const isExitBranchRoom = room.id === "room-2";
  const dangerousRoom = roomsById["room-3"];
  const isDangerousRoom = room.id === "room-3";

  function goNext(): void {
    if (isExitBranchRoom && onFinalExit) {
      closeReview();
      useGameStore.getState().setDialogue("escape-success");
      return;
    }

    if (isDangerousRoom && onFinalExit) {
      closeReview();
      useGameStore.getState().setDialogue("true-ending");
      return;
    }

    if (nextRoom) {
      setCurrentRoom(nextRoom.id);
      useGameStore.getState().setDialogue(`enter-${nextRoom.id}`);
      return;
    }

    closeReview();
  }

  return (
    <GameWindow id={`review-${room.id}`} type="review" eyebrow="방 클리어" title={room.subtitle} onClose={closeReview}>
      <div className="review-modal">
        <div className="inference-callout">
          <strong>
            {isExitBranchRoom
              ? "출구가 열렸고, 아래로 내려가는 어두운 계단이 보인다."
              : isDangerousRoom
                ? "계단 아래의 신호를 충분히 확인했다."
                : "필수 단서로 Door Code를 완성했다."}
          </strong>
          <p>
            {isExitBranchRoom
              ? "여기서 나가도 된다. 시간이 남거나 강사가 심화 진행을 안내하면 위험한 계단으로 내려가 Control Room에 도전할 수 있다."
              : isDangerousRoom
                ? "더 풀고 싶은 선택 단서가 남아 있으면 방으로 돌아가도 되고, 여기서 탐색을 마무리해도 된다."
              : "필수 퍼즐은 방의 핵심 Python 활용 범주를 경험하도록 설계되어 있고, 숨겨진 선택 단서는 Room 4에서 다시 확인할 수 있다."}
            {requiredPuzzles.length > 0 ? (
              <span className="hint-fraction"> ({solvedRequiredPuzzles.length}/{requiredPuzzles.length}개 필수 단서 해결)</span>
            ) : null}
          </p>
        </div>

        <div className="review-grid">
          <section>
            <h3>Required Route</h3>
            {requiredPuzzles.length ? (
              <ul>
                {requiredPuzzles.map((puzzle) => (
                  <li key={puzzle.id}>
                    {solvedPuzzleIds.includes(puzzle.id) ? "완료" : "미완료"} · {puzzle.title}
                    {puzzle.doorCodePiece ? ` · Door piece ${puzzle.doorCodePiece}` : ""}
                  </li>
                ))}
              </ul>
            ) : (
              <p>필수 단서 없음.</p>
            )}
          </section>
          <section>
            <h3>Missed Hidden Clues</h3>
            {missedHiddenPuzzles.length ? (
              <ul>
                {missedHiddenPuzzles.map((puzzle) => (
                  <li key={puzzle.id}>{puzzle.title}</li>
                ))}
              </ul>
            ) : (
              <p>놓친 숨겨진 단서 없음.</p>
            )}
          </section>
          <section className="review-conditions-section">
            <h3>Door Code Pieces</h3>
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
            <h3>Saved Drafts</h3>
            <div className="draft-list">
              {solvedPuzzles.map((puzzle) => (
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
            {isExitBranchRoom ? "밖으로 나간다" : isDangerousRoom ? "탐색을 마무리한다" : nextRoom ? `다음: ${nextRoom.subtitle}` : "완료"}
          </button>
          <button className="ghost-button" onClick={closeReview} type="button">
            방으로 돌아가기
          </button>
        </div>
      </div>
    </GameWindow>
  );
}
