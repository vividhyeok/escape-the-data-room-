import { useState, useEffect } from "react";
import { useGameStore } from "../store/gameStore";
import { dialogues } from "../data/story";
import { SoundEngine } from "../utils/SoundEngine";

export function TitleScreen(): React.JSX.Element {
  const setGameState = useGameStore((state) => state.setGameState);
  const setDialogue = useGameStore((state) => state.setDialogue);
  const resetProgress = useGameStore((state) => state.resetProgress);
  const unlockedStories = useGameStore((state) => state.unlockedStories);
  const currentRoomId = useGameStore((state) => state.currentRoomId);
  const clearedRoomIds = useGameStore((state) => state.clearedRoomIds);
  const textSpeed = useGameStore((state) => state.textSpeed);
  const setTextSpeed = useGameStore((state) => state.setTextSpeed);

  const [showSettings, setShowSettings] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [showStoryArchive, setShowStoryArchive] = useState(false);

  useEffect(() => {
    const initAudio = () => {
      SoundEngine.init();
      SoundEngine.playBGM('/assets/audio/main-banner.mp3');
    };
    window.addEventListener("click", initAudio, { once: true });
    return () => window.removeEventListener("click", initAudio);
  }, []);

  const hasSaveData = clearedRoomIds.length > 0 || currentRoomId !== "room-0";

  const handleStart = () => {
    SoundEngine.playClick();
    SoundEngine.stopBGM();
    setGameState("PLAYING");
    setDialogue("intro");
  };

  const handleContinue = () => {
    SoundEngine.playClick();
    SoundEngine.stopBGM();
    setGameState("PLAYING");
  };

  const handleNewGame = () => {
    SoundEngine.playClick();
    SoundEngine.stopBGM();
    resetProgress();
    setGameState("PLAYING");
    setDialogue("intro");
  };

  const toggleFullscreen = () => {
    SoundEngine.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="title-screen crt-glitch">
      <div className="title-content">
        <h1 className="game-logo flicker">ESCAPE<br/>THE DATA ROOM</h1>
        <div className="title-menu">
          {hasSaveData ? (
            <>
              <button className="title-btn" onClick={handleContinue} onMouseEnter={() => SoundEngine.playHover()} type="button">CONTINUE</button>
              <button className="title-btn" onClick={handleNewGame} onMouseEnter={() => SoundEngine.playHover()} type="button">NEW GAME</button>
            </>
          ) : (
            <button className="title-btn" onClick={handleStart} onMouseEnter={() => SoundEngine.playHover()} type="button">START</button>
          )}
          <button className="title-btn" onClick={() => { SoundEngine.playClick(); setShowStoryArchive(true); }} onMouseEnter={() => SoundEngine.playHover()} type="button">STORY ARCHIVE</button>
          <button className="title-btn" onClick={() => { SoundEngine.playClick(); setShowSettings(true); }} onMouseEnter={() => SoundEngine.playHover()} type="button">SETTINGS</button>
          <button className="title-btn" onClick={() => { SoundEngine.playClick(); setShowCredits(true); }} onMouseEnter={() => SoundEngine.playHover()} type="button">CREDITS</button>
        </div>
      </div>

      {showSettings && (
        <div className="cyber-modal-overlay">
          <div className="cyber-modal" style={{ width: "500px" }}>
            <div className="cyber-modal-header">
              <span>SYSTEM.SETTINGS</span>
              <button className="cyber-modal-close" onClick={() => setShowSettings(false)} type="button">✕</button>
            </div>
            <div className="cyber-modal-content" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" }}>
                <label style={{ fontSize: "1.2rem", fontWeight: "bold" }}>TEXT OUTPUT SPEED</label>
                <div className="cyber-btn-group">
                  {["slow", "normal", "fast", "instant"].map(speed => (
                    <button 
                      key={speed}
                      className={`cyber-switch-btn ${textSpeed === speed ? "active" : ""}`}
                      onClick={() => { SoundEngine.playClick(); setTextSpeed(speed as any); }}
                      type="button"
                    >
                      {speed.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <button className="cyber-switch-btn" onClick={toggleFullscreen} type="button">TOGGLE FULLSCREEN</button>
              <button className="cyber-switch-btn" onClick={() => {
                resetProgress();
                alert("데이터가 초기화되었습니다.");
              }} type="button" style={{ color: "#ff6b6b", borderColor: "#ff6b6b" }}>RESET ALL DATA</button>
            </div>
          </div>
        </div>
      )}

      {showCredits && (
        <div className="cyber-modal-overlay">
          <div className="cyber-modal" style={{ width: "400px", textAlign: "center" }}>
            <div className="cyber-modal-header">
              <span>SYSTEM.CREDITS</span>
              <button className="cyber-modal-close" onClick={() => setShowCredits(false)} type="button">✕</button>
            </div>
            <div className="cyber-modal-content">
              <p style={{ margin: "20px 0", fontSize: "1.2rem", lineHeight: "1.6" }}>
                2026-1 캡스톤 프로젝트<br /><br />
                김민혁, 공원호 제작
              </p>
            </div>
          </div>
        </div>
      )}

      {showStoryArchive && (
        <div className="cyber-modal-overlay">
          <div className="cyber-modal" style={{ maxWidth: "800px" }}>
            <div className="cyber-modal-header">
              <span>SYSTEM.ARCHIVE.STORY</span>
              <button className="cyber-modal-close" onClick={() => setShowStoryArchive(false)} type="button">✕</button>
            </div>
            <div className="cyber-modal-content" style={{ maxHeight: "60vh", overflowY: "auto" }}>
              {unlockedStories.length === 0 ? (
                <p style={{ textAlign: "center", fontStyle: "italic", opacity: 0.5 }}>NO STORY DATA FOUND.</p>
              ) : (
                <ul className="cyber-list">
                  {unlockedStories.map((id) => {
                    const seq = dialogues[id];
                    if (!seq) return null;
                    return (
                      <li key={id} className="cyber-list-item">
                        <span className="cyber-item-title">{seq.title}</span>
                        <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
                          {seq.lines.map((line, idx) => (
                            <div key={idx} style={{ fontSize: "1rem", opacity: 0.9 }}>
                              {line.speaker && <span style={{ color: "#fff", fontWeight: "bold" }}>[{line.speaker}] </span>}
                              <span>{line.text}</span>
                            </div>
                          ))}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
