import { useState, useEffect } from "react";
import { useGameStore } from "../store/gameStore";
import { SoundEngine } from "../utils/SoundEngine";

export function CreditsScreen(): React.JSX.Element {
  const setGameState = useGameStore((state) => state.setGameState);
  const setCurrentRoom = useGameStore((state) => state.setCurrentRoom);
  const clearedRoomIds = useGameStore((state) => state.clearedRoomIds);
  const resetProgress = useGameStore((state) => state.resetProgress);

  const [showPrompt, setShowPrompt] = useState(false);
  
  const hasFinishedRoom3 = clearedRoomIds.includes("room-3");

  useEffect(() => {
    SoundEngine.playBGM('/assets/audio/successor.mp3');
    // Show prompt to continue after 12 seconds
    const timer = setTimeout(() => setShowPrompt(true), 30000);
    return () => clearTimeout(timer);
  }, []);

  const handleSkip = () => {
    setShowPrompt(true);
  };

  const handleReturn = () => {
    SoundEngine.playClick();
    SoundEngine.playBGM('/assets/audio/main-banner.mp3');
    resetProgress();
    setGameState("TITLE");
  };

  const handleContinue = () => {
    setGameState("PLAYING");
    setCurrentRoom("room-3");
    useGameStore.getState().setDialogue("enter-room-3");
  };

  return (
    <div className="cyber-credits-bg">
      {!showPrompt && (
        <button className="credits-skip" onClick={handleSkip} type="button" style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}>SKIP</button>
      )}
      <div className={`cyber-credits-scroll ${showPrompt ? "paused" : ""}`}>
        <h1>[ THE CODE ROOM ]</h1>
        <p>Directed by</p>
        <p>2026-1 캡스톤 프로젝트</p>
        <p>김민혁, 공원호</p>
        <br/><br/>
        <p>Programming & VFX</p>
        <p>Antigravity</p>
        <br/><br/>
        <p>Art & UI</p>
        <p>DALL-E 3 & CSS</p>
        <br/><br/>
        <p>Thank you for playing!</p>
      </div>

      {showPrompt && (
        <div className="credits-btn-container fade-in">
          {!hasFinishedRoom3 && (
            <button className="title-btn" onClick={handleContinue} onMouseEnter={() => SoundEngine.playHover()} type="button">
              숨겨진 단서 보관실로 가기 (Room 3)
            </button>
          )}
          <button className="title-btn" onClick={handleReturn} onMouseEnter={() => SoundEngine.playHover()} type="button">
            메인 타이틀로
          </button>
        </div>
      )}
    </div>
  );
}
