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
        <div className="settings-modal">
          <div className="settings-content" style={{ width: "400px" }}>
            <h2 style={{ color: "#94ffc5" }}>SETTINGS</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" }}>
              <label style={{ fontSize: "1.2rem" }}>텍스트 속도 (Text Speed)</label>
              <select 
                value={textSpeed} 
                onChange={(e) => { SoundEngine.playClick(); setTextSpeed(e.target.value as any); }}
                style={{ padding: "8px", background: "#222", color: "#fff", border: "1px solid #444", fontSize: "1.1rem" }}
              >
                <option value="slow">느림 (Slow)</option>
                <option value="normal">보통 (Normal)</option>
                <option value="fast">빠름 (Fast)</option>
                <option value="instant">즉시 출력 (Instant)</option>
              </select>
            </div>

            <button className="title-btn" onClick={toggleFullscreen} type="button" style={{ textAlign: "center" }}>전체화면 전환 (FULLSCREEN)</button>
            
            <button className="title-btn" onClick={() => {
              resetProgress();
              alert("데이터가 초기화되었습니다.");
            }} type="button" style={{ textAlign: "center", color: "#ff6b6b" }}>데이터 초기화 (RESET DATA)</button>
            
            <button className="title-btn" onClick={() => setShowSettings(false)} type="button" style={{ textAlign: "center" }}>CLOSE</button>
          </div>
        </div>
      )}

      {showCredits && (
        <div className="settings-modal">
          <div className="settings-content">
            <h2 style={{ color: "#94ffc5" }}>CREDITS</h2>
            <p style={{ margin: "20px 0", fontSize: "1.2rem", lineHeight: "1.6" }}>
              2026-1 캡스톤 프로젝트<br />
              김민혁, 공원호 제작
            </p>
            <button className="title-btn" onClick={() => setShowCredits(false)} type="button" style={{ textAlign: "center" }}>CLOSE</button>
          </div>
        </div>
      )}

      {showStoryArchive && (
        <div className="settings-modal">
          <div className="story-archive-content">
            <h2 style={{ color: "#94ffc5" }}>STORY ARCHIVE</h2>
            <div className="story-log-container">
              {unlockedStories.length === 0 ? (
                <p className="no-story-msg">아직 해금된 스토리가 없습니다.</p>
              ) : (
                unlockedStories.map((id) => {
                  const seq = dialogues[id];
                  if (!seq) return null;
                  return (
                    <div key={id} className="story-log-item">
                      <h3 className="story-log-title">{seq.title}</h3>
                      <div className="story-log-lines">
                        {seq.lines.map((line, idx) => (
                          <div key={idx} className="story-log-line">
                            {line.speaker && <span className="story-speaker">{line.speaker}: </span>}
                            <span className="story-text">{line.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <button className="title-btn" onClick={() => setShowStoryArchive(false)} type="button" style={{ textAlign: "center" }}>CLOSE</button>
          </div>
        </div>
      )}
    </div>
  );
}
