import { useState } from "react";
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
  const [message, setMessage] = useState("");
  const roomHints = collectedHints.filter((hint) => hint.roomId === room.id);

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

    if (normalizedAttempt === room.doorCode) {
      clearRoom(room.id);
      onClose();
      return;
    }

    setMessage("코드 불일치.");
  }

  return (
    <GameWindow id={`keypad-${room.id}`} type="keypad" eyebrow="출입문" title={room.subtitle} onClose={onClose}>
      <div className="door-modal">
        <div className="door-grid">
          <div className="keypad-display">
            <label>
              <span>해제 코드</span>
              <input
                inputMode="text"
                onChange={(event) => updateAttempt(event.target.value)}
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
            <span>수집된 단서</span>
            {roomHints.length ? (
              <ul>
                {roomHints.map((hint) => (
                  <li key={hint.id}>{hint.text}</li>
                ))}
              </ul>
            ) : (
              <p>아직 수집된 단서 없음.</p>
            )}
          </div>
        </div>
      </div>
    </GameWindow>
  );
}
