import { getPuzzlesForRoom } from "../data/puzzles";
import { roomOrder, roomsById } from "../data/rooms";
import { getTextbookProblemByPuzzleId } from "../data/textbookProblemBank";
import type { Room } from "../data/types";
import { useGameStore } from "../store/gameStore";
import { GameWindow } from "./GameWindow";

type ReviewPanelProps = {
  room: Room;
  onFinalExit?: () => void;
};

export function ReviewPanel({ room, onFinalExit }: ReviewPanelProps): React.JSX.Element {
  const solvedPuzzleIds = useGameStore((state) => state.solvedPuzzleIds);
  const skippedPuzzleIds = useGameStore((state) => state.skippedPuzzleIds);
  const codeDrafts = useGameStore((state) => state.codeDrafts);
  const setCurrentRoom = useGameStore((state) => state.setCurrentRoom);
  const closeReview = useGameStore((state) => state.closeReview);

  const roomPuzzles = getPuzzlesForRoom(room.id);
  const requiredPuzzles = roomPuzzles
    .filter((puzzle) => puzzle.requiredForDoor && !puzzle.isHidden)
    .sort((a, b) => (a.doorCodePosition ?? 99) - (b.doorCodePosition ?? 99));
  const solvedRequired = requiredPuzzles.filter((p) => solvedPuzzleIds.includes(p.id));
  const skippedCount = requiredPuzzles.filter((p) => skippedPuzzleIds.includes(p.id)).length;
  const genuineCount = solvedRequired.length - skippedCount;

  const concepts = Array.from(
    new Set(
      solvedRequired
        .map((p) => getTextbookProblemByPuzzleId(p.id)?.concept)
        .filter(Boolean) as string[],
    ),
  );

  const codeDigits = room.doorCode.split("");

  const currentIndex = roomOrder.indexOf(room.id as (typeof roomOrder)[number]);
  const nextRoomId = roomOrder[currentIndex + 1];
  const nextRoom = nextRoomId ? roomsById[nextRoomId] : undefined;
  const isExitBranchRoom = room.id === "room-2";
  const isDangerousRoom = room.id === "room-3";

  const solvedDrafts = solvedRequired.filter((p) => (codeDrafts[p.id] || "").trim());

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

  const nextLabel = isExitBranchRoom
    ? "밖으로 나간다 →"
    : isDangerousRoom
      ? "탐색을 마무리한다"
      : nextRoom
        ? `다음 방으로 →`
        : "완료";

  return (
    <GameWindow id={`review-${room.id}`} type="review" eyebrow="ROOM CLEAR" title={room.subtitle} onClose={closeReview}>
      <div className="room-clear">
        <div className="rc-confetti" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} style={{ ["--n" as string]: i }} />
          ))}
        </div>

        <div className="rc-hero">
          <span className="rc-badge">ROOM CLEAR</span>
          <h2>{room.title} · {room.subtitle}</h2>
          <p>코드 조각 {solvedRequired.length}/{requiredPuzzles.length} 완성 — 문이 열렸다</p>
        </div>

        {/* 획득한 도어 코드 */}
        <div className="rc-code">
          <span className="rc-code-label">획득한 도어 코드</span>
          <div className="code-digits revealed compact">
            {codeDigits.map((d, i) => (
              <span className="code-digit decoded" key={i} style={{ ["--d" as string]: i }}>{d}</span>
            ))}
          </div>
        </div>

        {/* 풀이 요약 */}
        <div className="rc-stats">
          <div className="rc-stat good"><strong>{genuineCount}</strong><span>직접 해결</span></div>
          {skippedCount > 0 ? <div className="rc-stat warn"><strong>{skippedCount}</strong><span>건너뜀</span></div> : null}
          <div className="rc-stat"><strong>{concepts.length}</strong><span>다룬 개념</span></div>
        </div>

        {/* 다룬 개념 */}
        {concepts.length > 0 ? (
          <div className="rc-concepts">
            <div className="concept-chip-list">
              {concepts.map((c) => <span key={c}>{c}</span>)}
            </div>
          </div>
        ) : null}

        <div className="rc-actions">
          <button className="primary-button rc-next" onClick={goNext} type="button">{nextLabel}</button>
          <button className="ghost-button" onClick={closeReview} type="button">방으로 돌아가기</button>
        </div>

        {/* 작성한 코드 (접어둠) */}
        {solvedDrafts.length > 0 ? (
          <details className="rc-drafts">
            <summary>내가 작성한 코드 다시 보기 ({solvedDrafts.length})</summary>
            <div className="draft-list">
              {solvedDrafts.map((p) => (
                <details key={p.id}>
                  <summary>{p.title}</summary>
                  <pre>{codeDrafts[p.id]}</pre>
                </details>
              ))}
            </div>
          </details>
        ) : null}
      </div>
    </GameWindow>
  );
}
