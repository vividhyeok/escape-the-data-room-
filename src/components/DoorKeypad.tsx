import { useEffect, useRef, useState } from "react";
import { getPuzzlesForRoom } from "../data/puzzles";
import type { Room } from "../data/types";
import { useGameStore } from "../store/gameStore";
import { GameWindow } from "./GameWindow";
import { SoundEngine } from "../utils/SoundEngine";

type DoorKeypadProps = {
  room: Room;
  onClose: () => void;
};

export function DoorKeypad({ room, onClose }: DoorKeypadProps): React.JSX.Element {
  const clearRoom = useGameStore((state) => state.clearRoom);
  const solvedPuzzleIds = useGameStore((state) => state.solvedPuzzleIds);
  const isDemoMode = useGameStore((state) => state.isDemoMode);
  const [unlocking, setUnlocking] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [scramble, setScramble] = useState(0);

  // 이 방의 퍼즐 = 조각. 각 문제를 풀면 1조각씩 모인다.
  const roomPieces = getPuzzlesForRoom(room.id).filter((p) => p.requiredForDoor && !p.isHidden);
  const totalPieces = roomPieces.length;
  const collectedPieces = roomPieces.filter((p) => solvedPuzzleIds.includes(p.id)).length;
  const allCollected = totalPieces > 0 && collectedPieces >= totalPieces;
  const codeDigits = room.doorCode.split("");
  const codeLength = codeDigits.length;

  // 조각을 모을수록 코드가 한 자리씩 '해독'된다(progressive decryption).
  // 마지막 한 자리는 모든 조각을 모아야만 풀린다.
  const ratio = totalPieces > 0 ? collectedPieces / totalPieces : 0;
  const unlockedDigitCount = allCollected
    ? codeLength
    : Math.min(codeLength - 1, Math.floor(ratio * codeLength));

  const hasLockedDigits = unlockedDigitCount < codeLength;

  // 아직 해독되지 않은 자리는 숫자가 계속 돌아가는 연출
  useEffect(() => {
    if (!hasLockedDigits || unlocked) return;
    const timer = window.setInterval(() => setScramble((s) => s + 1), 90);
    return () => window.clearInterval(timer);
  }, [hasLockedDigits, unlocked]);

  // 모든 조각을 처음 모은 순간 '해독 완료' 사운드 1회
  const revealPlayed = useRef(false);
  useEffect(() => {
    if (allCollected && !revealPlayed.current) {
      revealPlayed.current = true;
      SoundEngine.playGlitch();
      window.setTimeout(() => SoundEngine.playSuccess(), 300);
    }
  }, [allCollected]);

  // Room 3 (검토실)은 최종 탈출 연출
  if (room.id === "room-3") {
    return (
      <GameWindow id={`keypad-${room.id}`} type="keypad" eyebrow="//SYS.EXIT" title={room.subtitle} onClose={onClose}>
        <div className="door-modal">
          <div className="final-exit-panel">
            <strong>최종 검토 완료</strong>
            <p>지나온 방의 풀이를 모두 확인했습니다. 마지막 문을 열어 탈출을 마무리하세요.</p>
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

  function handleUnlock(): void {
    // 시연 모드에서는 조각을 다 모으지 않아도 바로 열 수 있다.
    if ((!allCollected && !isDemoMode) || unlocking) return;
    setUnlocking(true);
    SoundEngine.playGlitch();
    // 짧은 '해독 시퀀스' 후 잠금 해제
    window.setTimeout(() => {
      SoundEngine.playDoorOpen();
      clearRoom(room.id);
      setUnlocked(true);
      window.setTimeout(() => onClose(), 1700);
    }, 850);
  }

  function digitChar(index: number): string {
    if (index < unlockedDigitCount) return codeDigits[index];
    // 잠긴 자리는 매 틱마다 무작위 숫자
    return String((scramble * 7 + index * 3) % 10);
  }

  return (
    <GameWindow id={`keypad-${room.id}`} type="keypad" eyebrow="//SYS.DOOR" title={room.subtitle} onClose={onClose}>
      <div className={`door-modal ${unlocked ? "door-unlocked" : ""}`}>
        {unlocked && (
          <div className="door-access-granted" aria-live="assertive">
            <span className="access-icon">✓</span>
            <strong>ACCESS GRANTED</strong>
            <p>{room.subtitle} — 탈출 성공</p>
          </div>
        )}

        <div className="door-grid-v2" style={unlocked ? { display: "none" } : undefined}>
          {/* 조각으로 해독되는 4자리 코드 */}
          <div className="code-reveal">
            <span className="code-reveal-label">
              {allCollected
                ? "코드 해독 완료 — 잠금을 해제하세요"
                : `잠금 코드 해독 중… (${unlockedDigitCount}/${codeLength} 자리)`}
            </span>
            <div className={`code-digits ${unlocking ? "decrypting" : ""}`}>
              {codeDigits.map((_, index) => {
                const isDecoded = index < unlockedDigitCount;
                return (
                  <span
                    className={`code-digit ${isDecoded ? "decoded" : "locked"}`}
                    key={index}
                    style={{ ["--d" as string]: index }}
                  >
                    {digitChar(index)}
                  </span>
                );
              })}
            </div>
          </div>

          {/* 조각 진행 (각 문제 = 1조각) */}
          <div className="piece-tracker" aria-label={`코드 조각 ${collectedPieces}/${totalPieces}`}>
            <div className="piece-tracker-head">
              <span>코드 조각</span>
              <strong>{collectedPieces} / {totalPieces}</strong>
            </div>
            <div className="piece-dots">
              {roomPieces.map((piece, index) => (
                <span
                  className={`piece-dot ${solvedPuzzleIds.includes(piece.id) ? "filled" : ""}`}
                  key={piece.id}
                  title={`조각 ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* 잠금 해제 */}
          <button
            className={`door-unlock-btn ${allCollected ? "ready" : ""}`}
            onClick={handleUnlock}
            type="button"
            disabled={!allCollected || unlocking}
          >
            {unlocking ? "해제 중…" : allCollected ? "🔓 잠금 해제" : `조각을 모으세요 (${collectedPieces}/${totalPieces})`}
          </button>

          {/* 시연 모드: 조각 수와 무관하게 바로 열기 */}
          {isDemoMode && !allCollected ? (
            <button
              className="door-demo-btn"
              onClick={handleUnlock}
              type="button"
              disabled={unlocking}
            >
              🎬 시연: 바로 열기
            </button>
          ) : null}
        </div>
      </div>
    </GameWindow>
  );
}
