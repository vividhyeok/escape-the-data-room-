import { useState } from "react";
import { getPuzzlesForRoom } from "../data/puzzles";
import type { Room } from "../data/types";
import { useGameStore } from "../store/gameStore";
import { GameWindow } from "./GameWindow";

type DoorKeypadProps = {
  room: Room;
  onClose: () => void;
};

function normalizeCode(code: string): string {
  return code.trim().replace(/\s+/g, "").toUpperCase();
}

export function DoorKeypad({ room, onClose }: DoorKeypadProps): React.JSX.Element {
  const doorAttempt = useGameStore((state) => state.doorInputs[room.id] ?? "");
  const setDoorInput = useGameStore((state) => state.setDoorInput);
  const recordDoorAttempt = useGameStore((state) => state.recordDoorAttempt);
  const clearRoom = useGameStore((state) => state.clearRoom);
  const collectedHints = useGameStore((state) => state.collectedHints);
  const solvedPuzzleIds = useGameStore((state) => state.solvedPuzzleIds);
  const [message, setMessage] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [rejected, setRejected] = useState(false);
  const roomHints = collectedHints.filter((hint) => hint.roomId === room.id);
  const roomPuzzles = getPuzzlesForRoom(room.id);
  const requiredDoorPuzzles = roomPuzzles
    .filter((puzzle) => puzzle.requiredForDoor)
    .sort((a, b) => (a.doorCodePosition ?? 99) - (b.doorCodePosition ?? 99));
  const solvedRequiredDoorPuzzles = requiredDoorPuzzles.filter((puzzle) => solvedPuzzleIds.includes(puzzle.id));
  const hasRequiredDoorGate = requiredDoorPuzzles.length > 0;
  const requiredDoorReady = !hasRequiredDoorGate || solvedRequiredDoorPuzzles.length === requiredDoorPuzzles.length;

  if (room.id === "room-4") {
    return (
      <GameWindow id={`keypad-${room.id}`} type="keypad" eyebrow="Final Exit" title={room.subtitle} onClose={onClose}>
        <div className="door-modal">
          <div className="final-exit-panel">
            <strong>Review complete</strong>
            <p>놓친 선택 단서와 저장된 풀이를 확인한 뒤 최종 탈출을 마무리합니다.</p>
            <button
              className="primary-button"
              onClick={() => {
                clearRoom(room.id);
                onClose();
              }}
              type="button"
            >
              Final Exit
            </button>
          </div>
        </div>
      </GameWindow>
    );
  }

  if (room.id === "room-3") {
    return (
      <GameWindow id={`keypad-${room.id}`} type="keypad" eyebrow="Dangerous Stairs" title={room.subtitle} onClose={onClose}>
        <div className="door-modal">
          <div className="optional-exit-panel">
            <strong>여기서는 풀 만큼만 풀어도 된다.</strong>
            <p>
              아래층의 단서는 추가 도전용이다. 남은 퍼즐을 더 조사하거나, 지금까지 확인한 내용으로 탐색을 마무리할 수 있다.
            </p>
            <div className="door-pieces" aria-label="Optional challenge progress">
              {requiredDoorPuzzles.map((puzzle, index) => {
                const isSolved = solvedPuzzleIds.includes(puzzle.id);
                return (
                  <span className={isSolved ? "piece acquired" : "piece"} key={puzzle.id}>
                    {index + 1}: {isSolved ? puzzle.doorCodePiece ?? "?" : "?"}
                  </span>
                );
              })}
            </div>
            <button
              className="primary-button"
              onClick={() => {
                clearRoom(room.id);
                onClose();
              }}
              type="button"
            >
              이쯤에서 마무리
            </button>
          </div>
        </div>
      </GameWindow>
    );
  }

  function updateAttempt(value: string): void {
    setDoorInput(room.id, value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4));
    setMessage("");
  }

  function submitCode(): void {
    const normalizedAttempt = normalizeCode(doorAttempt);
    if (normalizedAttempt) {
      recordDoorAttempt(room.id, doorAttempt);
    }

    if (normalizedAttempt.length < 3) {
      setMessage("3~4자리(숫자/영문) 코드를 입력하세요.");
      return;
    }

    if (!requiredDoorReady) {
      setMessage("Door Code 조각을 모두 모은 뒤 입력하세요.");
      return;
    }

    if (normalizedAttempt === room.doorCode) {
      clearRoom(room.id);
      setUnlocked(true);
      window.setTimeout(() => onClose(), 1600);
      return;
    }

    setMessage("Code mismatch.");
    setRejected(true);
    window.setTimeout(() => setRejected(false), 500);
  }

  return (
    <GameWindow id={`keypad-${room.id}`} type="keypad" eyebrow="출입문" title={room.subtitle} onClose={onClose}>
      <div className={`door-modal ${unlocked ? "door-unlocked" : ""} ${rejected ? "door-rejected" : ""}`}>
        {unlocked && (
          <div className="door-access-granted" aria-live="assertive">
            <span className="access-icon">✓</span>
            <strong>ACCESS GRANTED</strong>
            <p>{room.subtitle} — 탈출 성공</p>
          </div>
        )}
        <div className="door-grid" style={unlocked ? { display: "none" } : undefined}>
          <div className="keypad-display">
            <label>
              <span>Door Code</span>
              <input
                inputMode="text"
                onChange={(event) => updateAttempt(event.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submitCode(); }}
                placeholder="0000 또는 ABCD"
                type="text"
                value={doorAttempt}
              />
            </label>
            <button className="primary-button" onClick={submitCode} type="button">
              입력
            </button>
            {message ? <p className="feedback">{message}</p> : null}
          </div>
          <div className="door-hints">
            <span>Collected Clues</span>
            {hasRequiredDoorGate ? (
              <div className="door-pieces" aria-label="Door Code pieces">
                {requiredDoorPuzzles.map((puzzle, index) => {
                  const isSolved = solvedPuzzleIds.includes(puzzle.id);
                  return (
                    <span className={isSolved ? "piece acquired" : "piece"} key={puzzle.id}>
                      {index + 1}: {isSolved ? puzzle.doorCodePiece ?? "?" : "?"}
                    </span>
                  );
                })}
              </div>
            ) : null}
            {roomHints.length ? (
              <ul>
                {roomHints.map((hint) => (
                  <li key={hint.id}>{hint.text}</li>
                ))}
              </ul>
            ) : (
              <p>No collected clues yet.</p>
            )}
          </div>
        </div>
      </div>
    </GameWindow>
  );
}
