import { getPuzzlesForRoom } from "../data/puzzles";
import { roomObjects, roomOrder, roomsById } from "../data/rooms";
import type { Puzzle, RoomObject } from "../data/types";
import { useGameStore } from "../store/gameStore";
import { GameWindow } from "./GameWindow";

type ReviewRoomWindowProps = {
  object: RoomObject;
  onClose: () => void;
  onRevisitPuzzle: (object: RoomObject) => void;
};

const mainRoomIds = roomOrder.filter((roomId) => roomId !== "room-0" && roomId !== "room-4");

function getMainPuzzles(): Puzzle[] {
  return mainRoomIds.flatMap((roomId) => getPuzzlesForRoom(roomId));
}

function findRoomObjectForPuzzle(puzzle: Puzzle): RoomObject | undefined {
  return roomObjects.find((object) => object.puzzleId === puzzle.id);
}

export function ReviewRoomWindow({ object, onClose, onRevisitPuzzle }: ReviewRoomWindowProps): React.JSX.Element {
  const solvedPuzzleIds = useGameStore((state) => state.solvedPuzzleIds);
  const collectedHints = useGameStore((state) => state.collectedHints);
  const codeDrafts = useGameStore((state) => state.codeDrafts);
  const mainPuzzles = getMainPuzzles();
  const hiddenPuzzles = mainPuzzles.filter((puzzle) => puzzle.isHidden);
  const missedHiddenPuzzles = hiddenPuzzles.filter((puzzle) => !solvedPuzzleIds.includes(puzzle.id));
  const solvedRequiredPuzzles = mainPuzzles.filter((puzzle) => puzzle.isRequired && solvedPuzzleIds.includes(puzzle.id));
  const solvedPuzzles = mainPuzzles.filter((puzzle) => solvedPuzzleIds.includes(puzzle.id));
  const usedConcepts = solvedPuzzles.flatMap((puzzle) => puzzle.targetConcepts ?? []);
  const uniqueConcepts = Array.from(new Set(usedConcepts));
  const hiddenSolvedCount = hiddenPuzzles.length - missedHiddenPuzzles.length;

  function renderMissedClues(): React.JSX.Element {
    return (
      <section className="review-room-panel">
        <h3>Missed Hidden Clues</h3>
        {missedHiddenPuzzles.length ? (
          <ul className="review-room-list">
            {missedHiddenPuzzles.map((puzzle) => {
              const targetObject = findRoomObjectForPuzzle(puzzle);
              const room = roomsById[puzzle.roomId];
              return (
                <li key={puzzle.id}>
                  <div>
                    <strong>{puzzle.title}</strong>
                    <span>{room.title} · {puzzle.expectedStrategyDescription}</span>
                  </div>
                  {targetObject ? (
                    <button className="secondary-button" onClick={() => onRevisitPuzzle(targetObject)} type="button">
                      다시 풀기
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>놓친 숨겨진 단서가 없습니다.</p>
        )}
      </section>
    );
  }

  function renderSolvedRoute(): React.JSX.Element {
    return (
      <section className="review-room-panel">
        <h3>Solved Route</h3>
        <ul className="review-room-list">
          {solvedRequiredPuzzles.map((puzzle) => (
            <li key={puzzle.id}>
              <div>
                <strong>{puzzle.title}</strong>
                <span>{roomsById[puzzle.roomId].title} · Door piece {puzzle.doorCodePosition}: {puzzle.doorCodePiece}</span>
              </div>
            </li>
          ))}
        </ul>
        {!solvedRequiredPuzzles.length ? <p>아직 해결한 필수 퍼즐이 없습니다.</p> : null}
      </section>
    );
  }

  function renderStyleSummary(): React.JSX.Element {
    return (
      <section className="review-room-panel">
        <h3>Play Style Summary</h3>
        <div className="style-summary-grid">
          <span>해결한 필수 단서 <strong>{solvedRequiredPuzzles.length}</strong></span>
          <span>확인한 숨겨진 단서 <strong>{hiddenSolvedCount}</strong></span>
          <span>사용한 Python 도구 <strong>{uniqueConcepts.length}</strong></span>
        </div>
        <div className="concept-chip-list">
          {uniqueConcepts.length ? uniqueConcepts.map((concept) => <span key={concept}>{concept}</span>) : <p>아직 기록된 도구가 없습니다.</p>}
        </div>
      </section>
    );
  }

  function renderDraftArchive(): React.JSX.Element {
    const draftedPuzzles = solvedPuzzles.filter((puzzle) => codeDrafts[puzzle.id]);
    return (
      <section className="review-room-panel">
        <h3>Saved Draft Archive</h3>
        {draftedPuzzles.length ? (
          <div className="draft-list">
            {draftedPuzzles.map((puzzle) => (
              <details key={puzzle.id}>
                <summary>{roomsById[puzzle.roomId].title} · {puzzle.title}</summary>
                <pre>{codeDrafts[puzzle.id]}</pre>
              </details>
            ))}
          </div>
        ) : (
          <p>저장된 코드 draft가 없습니다.</p>
        )}
      </section>
    );
  }

  function renderFinalReview(): React.JSX.Element {
    return (
      <section className="review-room-panel">
        <h3>Final Review</h3>
        <ul className="review-room-list compact">
          {mainRoomIds.map((roomId) => {
            const roomPuzzles = getPuzzlesForRoom(roomId);
            const required = roomPuzzles.filter((puzzle) => puzzle.isRequired);
            const solvedRequired = required.filter((puzzle) => solvedPuzzleIds.includes(puzzle.id));
            const hidden = roomPuzzles.filter((puzzle) => puzzle.isHidden);
            const solvedHidden = hidden.filter((puzzle) => solvedPuzzleIds.includes(puzzle.id));
            return (
              <li key={roomId}>
                <div>
                  <strong>{roomsById[roomId].title}</strong>
                  <span>필수 {solvedRequired.length}/{required.length} · 숨겨진 단서 {solvedHidden.length}/{hidden.length}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    );
  }

  function renderContent(): React.JSX.Element {
    switch (object.id) {
      case "room-4-validator":
      case "room-4-broken-crt":
        return renderMissedClues();
      case "room-4-test-log":
        return renderSolvedRoute();
      case "room-4-candidate-dial":
        return renderStyleSummary();
      case "room-4-error-server":
        return renderDraftArchive();
      case "room-4-sum-analyzer":
      default:
        return renderFinalReview();
    }
  }

  return (
    <GameWindow id={`review-room-${object.id}`} type="review" eyebrow="Review" title={object.title} onClose={onClose}>
      <div className="review-room-window">{renderContent()}</div>
    </GameWindow>
  );
}
