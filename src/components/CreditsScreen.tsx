import { useMemo, useState, useEffect } from "react";
import { puzzles } from "../data/puzzles";
import { getTextbookProblemByPuzzleId } from "../data/textbookProblemBank";
import { useGameStore } from "../store/gameStore";
import { SoundEngine } from "../utils/SoundEngine";

const MAIN_ROOMS = ["room-0", "room-1", "room-2"];

type Grade = "S" | "A" | "B" | "C";

function gradeFor(genuine: number, total: number, skipped: number): { grade: Grade; line: string } {
  if (total > 0 && genuine === total && skipped === 0) {
    return { grade: "S", line: "한 문제도 건너뛰지 않고 모두 직접 해결했습니다. 완벽합니다!" };
  }
  const ratio = total > 0 ? genuine / total : 0;
  if (ratio >= 0.8) return { grade: "A", line: "대부분의 문제를 직접 해결했습니다. 훌륭해요!" };
  if (ratio >= 0.5) return { grade: "B", line: "절반 이상을 스스로 풀어냈습니다. 잘했어요!" };
  return { grade: "C", line: "끝까지 탈출에 성공했습니다. 막힌 개념은 함께 복습해 봐요!" };
}

export function CreditsScreen(): React.JSX.Element {
  const setGameState = useGameStore((state) => state.setGameState);
  const setCurrentRoom = useGameStore((state) => state.setCurrentRoom);
  const clearedRoomIds = useGameStore((state) => state.clearedRoomIds);
  const solvedPuzzleIds = useGameStore((state) => state.solvedPuzzleIds);
  const skippedPuzzleIds = useGameStore((state) => state.skippedPuzzleIds);
  const puzzleFailCounts = useGameStore((state) => state.puzzleFailCounts);
  const resetProgress = useGameStore((state) => state.resetProgress);

  const [showCredits, setShowCredits] = useState(false);

  const hasFinishedRoom3 = clearedRoomIds.includes("room-3");

  const stats = useMemo(() => {
    const mainPuzzles = puzzles.filter(
      (p) => MAIN_ROOMS.includes(p.roomId) && p.requiredForDoor && !p.isHidden,
    );
    const total = mainPuzzles.length;
    const solvedMain = mainPuzzles.filter((p) => solvedPuzzleIds.includes(p.id));
    const skipped = solvedMain.filter((p) => skippedPuzzleIds.includes(p.id)).length;
    const genuine = solvedMain.length - skipped;
    const concepts = new Set(
      solvedMain
        .map((p) => getTextbookProblemByPuzzleId(p.id)?.concept)
        .filter(Boolean) as string[],
    );
    const totalTries = Object.values(puzzleFailCounts).reduce((a, b) => a + b, 0) + solvedMain.length;
    return {
      total,
      solved: solvedMain.length,
      genuine,
      skipped,
      conceptCount: concepts.size,
      totalTries,
      roomsCleared: MAIN_ROOMS.filter((r) => clearedRoomIds.includes(r)).length,
    };
  }, [solvedPuzzleIds, skippedPuzzleIds, puzzleFailCounts, clearedRoomIds]);

  const { grade, line } = gradeFor(stats.genuine, stats.total, stats.skipped);

  useEffect(() => {
    SoundEngine.playBGM("/assets/audio/successor.mp3");
    SoundEngine.playSuccess();
  }, []);

  const handleReturn = () => {
    SoundEngine.playClick();
    SoundEngine.playBGM("/assets/audio/main-banner.mp3");
    resetProgress();
    setGameState("TITLE");
  };

  const handleContinue = () => {
    SoundEngine.playClick();
    setGameState("PLAYING");
    setCurrentRoom("room-3");
    useGameStore.getState().setDialogue("enter-room-3");
  };

  if (showCredits) {
    return (
      <div className="cyber-credits-bg">
        <button className="credits-skip" onClick={() => setShowCredits(false)} type="button" style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}>
          ← 결과로
        </button>
        <div className="cyber-credits-scroll">
          <h1>[ THE CODE ROOM ]</h1>
          <p>2026-1 캡스톤 프로젝트</p>
          <p>2ntp — 김민혁, 공원호</p>
          <br /><br />
          <p>Game & UI</p>
          <p>CSS · Web Audio · Pyodide</p>
          <br /><br />
          <p>Thank you for playing!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="victory-screen">
      <div className="victory-scanlines" aria-hidden="true" />
      <div className="victory-confetti" aria-hidden="true">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} style={{ ["--n" as string]: i }} />
        ))}
      </div>

      <div className="victory-inner">
        <span className="victory-kicker">// SYSTEM.ESCAPE.COMPLETE</span>
        <h1 className="victory-title" data-text="ESCAPED">ESCAPED</h1>
        <p className="victory-sub">THE CODE ROOM — 데이터 룸을 탈출했습니다</p>

        <div className={`grade-block grade-${grade}`}>
          <div className="grade-badge">{grade}</div>
          <p className="grade-line">{line}</p>
        </div>

        <div className="victory-stats">
          <div className="vstat">
            <span>해결한 문제</span>
            <strong>{stats.solved}/{stats.total}</strong>
          </div>
          <div className="vstat good">
            <span>직접 푼 문제</span>
            <strong>{stats.genuine}</strong>
          </div>
          <div className="vstat warn">
            <span>건너뛴 문제</span>
            <strong>{stats.skipped}</strong>
          </div>
          <div className="vstat">
            <span>다룬 개념</span>
            <strong>{stats.conceptCount}</strong>
          </div>
          <div className="vstat">
            <span>탈출한 방</span>
            <strong>{stats.roomsCleared}/3</strong>
          </div>
          <div className="vstat">
            <span>총 시도</span>
            <strong>{stats.totalTries}</strong>
          </div>
        </div>

        <div className="victory-actions">
          {!hasFinishedRoom3 && (
            <button className="title-btn" onClick={handleContinue} onMouseEnter={() => SoundEngine.playHover()} type="button">
              숨겨진 단서 보관실 (Room 3)
            </button>
          )}
          <button className="title-btn primary-glow" onClick={handleReturn} onMouseEnter={() => SoundEngine.playHover()} type="button">
            메인 타이틀로
          </button>
          <button className="title-btn" onClick={() => { SoundEngine.playClick(); setShowCredits(true); }} onMouseEnter={() => SoundEngine.playHover()} type="button">
            크레딧 보기
          </button>
        </div>
      </div>
    </div>
  );
}
