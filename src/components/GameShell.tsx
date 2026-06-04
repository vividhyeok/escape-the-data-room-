import { useEffect, useRef, useState } from "react";
import { puzzlesById } from "../data/puzzles";
import { getRoomObjects, roomOrder, roomsById } from "../data/rooms";
import type { Puzzle as _Puzzle, RoomObject } from "../data/types";
import { Maximize, Volume2, VolumeX } from "lucide-react";
import { useGameStore } from "../store/gameStore";
import { DoorKeypad } from "./DoorKeypad";
import { resetGameWindows, setDemoLayout } from "./GameWindow";
import { HelpModal } from "./HelpModal";
import { InspectModal } from "./InspectModal";
import { PythonLabWindow } from "./PythonLabWindow";
import { ReviewPanel } from "./ReviewPanel";
import { ReviewRoomWindow } from "./ReviewRoomWindow";
import { RoomView } from "./RoomView";
import { TitleScreen } from "./TitleScreen";
import { CreditsScreen } from "./CreditsScreen";
import { DialogueOverlay } from "./DialogueOverlay";
import { SoundEngine } from "../utils/SoundEngine";

const GAME_BGM_URL = "/assets/audio/black-circuit.mp3";

export function GameShell(): React.JSX.Element {
  const bootModeApplied = useRef(false);
  const [selectedObject, setSelectedObject] = useState<RoomObject | null>(null);
  const [reviewRoomObject, setReviewRoomObject] = useState<RoomObject | null>(null);
  const [labPuzzleId, setLabPuzzleId] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [transitioning, setTransitioning] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [introStage, setIntroStage] = useState<"closed" | "opening" | "done">("done");

  const currentRoomId = useGameStore((state) => state.currentRoomId);
  const setCurrentRoom = useGameStore((state) => state.setCurrentRoom);
  const gameState = useGameStore((state) => state.gameState);
  const setGameState = useGameStore((state) => state.setGameState);
  const currentDialogueId = useGameStore((state) => state.currentDialogueId);
  const clearedRoomIds = useGameStore((state) => state.clearedRoomIds);
  const reviewRoomId = useGameStore((state) => state.reviewRoomId);
  const resetProgress = useGameStore((state) => state.resetProgress);
  const saveCodeDraft = useGameStore((state) => state.saveCodeDraft);
  const isMuted = useGameStore((state) => state.isMuted);
  const setIsMuted = useGameStore((state) => state.setIsMuted);
  const bgmVolume = useGameStore((state) => state.bgmVolume);
  const setBgmVolume = useGameStore((state) => state.setBgmVolume);
  const activeDoorId = selectedObject?.kind === "door" ? selectedObject.id : null;

  const room = roomsById[currentRoomId] ?? roomsById["room-1"];
  const objects = getRoomObjects(room.id);
  const selectedPuzzle = selectedObject?.kind === "puzzle" ? puzzlesById[selectedObject.puzzleId] : undefined;
  const activeLabPuzzle = labPuzzleId ? puzzlesById[labPuzzleId] : undefined;
  const collectedHints = useGameStore((state) => state.collectedHints);

  // Full-screen tension mechanics
  const [lastActiveTime, setLastActiveTime] = useState(Date.now());
  const [isTense, setIsTense] = useState(false);

  // Idle detection — 15 seconds without interaction triggers tension
  useEffect(() => {
    if (gameState !== "PLAYING") return;
    const interval = setInterval(() => {
      const idle = Date.now() - lastActiveTime > 15000;
      setIsTense(idle);
    }, 1000);
    return () => clearInterval(interval);
  }, [lastActiveTime, gameState]);

  // Breathing + heartbeat audio when tense
  useEffect(() => {
    let heartbeatInterval: number | undefined;
    if (isTense) {
      SoundEngine.playBreathing(true);
      SoundEngine.playHeartbeat();
      heartbeatInterval = window.setInterval(() => {
        SoundEngine.playHeartbeat();
      }, 1200);
    } else {
      SoundEngine.stopBreathing();
    }
    return () => {
      clearInterval(heartbeatInterval);
      SoundEngine.stopBreathing();
    };
  }, [isTense]);

  // Reset idle timer on any user interaction
  useEffect(() => {
    if (gameState !== "PLAYING") return;
    const reset = () => setLastActiveTime(Date.now());
    window.addEventListener("mousemove", reset);
    window.addEventListener("keydown", reset);
    window.addEventListener("mousedown", reset);
    return () => {
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("keydown", reset);
      window.removeEventListener("mousedown", reset);
    };
  }, [gameState]);

  // Trigger tension burst on wrong answer
  function triggerTensionBurst() {
    SoundEngine.playBreathing(false);
    SoundEngine.playHeartbeat();
    setIsTense(true);
    setTimeout(() => setIsTense(false), 3000);
  }

  useEffect(() => {
    if (bootModeApplied.current) {
      return;
    }

    bootModeApplied.current = true;

    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    const shouldReset = mode === "test" || params.get("reset") === "1";
    const shouldDemo = mode === "demo" || params.get("demo") === "1";
    const shouldDev = params.get("dev") === "1";
    const forcedRoom = params.get("room");

    if (shouldDev) setDevMode(true);

    if (shouldDemo) {
      activateDemoMode();
    } else if (shouldReset) {
      resetProgress();
      resetGameWindows();
      showToast("리셋 완료.");
    }
    
    if (forcedRoom) {
      useGameStore.setState({ currentRoomId: forcedRoom });
    }

    if (mode || params.has("demo") || params.has("reset")) {
      params.delete("mode");
      params.delete("demo");
      params.delete("reset");
      const query = params.toString();
      const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
      window.history.replaceState(null, "", nextUrl);
    }
  }, []);

  const prevDialogueIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (gameState === "PLAYING" && currentRoomId === "room-0" && currentDialogueId === "intro") {
      setIntroStage("closed");
    }
  }, [gameState, currentRoomId, currentDialogueId]);

  useEffect(() => {
    if (currentDialogueId) {
      prevDialogueIdRef.current = currentDialogueId;
    } else if (prevDialogueIdRef.current) {
      const finishedId = prevDialogueIdRef.current;
      prevDialogueIdRef.current = null;
      
      if (finishedId === "intro") {
        setIntroStage("opening");
        setTimeout(() => {
          setIntroStage("done");
          useGameStore.getState().setDialogue("tutorial-1");
        }, 2500);
      } else if (finishedId === "escape-success" || finishedId === "true-ending") {
        setGameState("CREDITS");
      }
    }
  }, [currentDialogueId, setGameState]);

  useEffect(() => {
    if (currentRoomId !== "room-0") return;
    const unlocked = useGameStore.getState().unlockedStories;

    // Trigger tutorial-2 when Help (Reference) is opened
    if (helpOpen && !unlocked.includes("tutorial-2")) {
      useGameStore.getState().setDialogue("tutorial-2");
    }
    // Trigger tutorial-3 when Door keypad is clicked
    if (activeDoorId === "door-room-0" && !unlocked.includes("tutorial-3")) {
      useGameStore.getState().setDialogue("tutorial-3");
    }
    // Trigger tutorial-4 when Python Lab is opened
    if (activeLabPuzzle && !unlocked.includes("tutorial-4")) {
      useGameStore.getState().setDialogue("tutorial-4");
    }
  }, [helpOpen, activeDoorId, activeLabPuzzle, currentRoomId]);

  useEffect(() => {
    if (gameState !== "PLAYING") return;
    SoundEngine.init();
    SoundEngine.playBGM(GAME_BGM_URL);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "PLAYING") return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || (active as HTMLElement).isContentEditable)) {
        return; // Ignore shortcuts when typing
      }
      if (e.key === "Escape") {
        SoundEngine.playClick();
        setIsPaused((prev) => !prev);
      }
      if (e.key.toLowerCase() === "i") {
        e.preventDefault();
        SoundEngine.playGlitch();
        setShowInventory((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  const clearedRoomsCount = clearedRoomIds.length;
  const collectedHintsCount = collectedHints.length;
  const initialMount = useRef(true);

  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }
    if (gameState === "PLAYING") {
      showToast("[ 시스템 저장 완료... ]");
    }
  }, [clearedRoomsCount, collectedHintsCount]);

  const handleReturnToTitle = () => {
    setIsPaused(false);
    SoundEngine.playBGM('/assets/audio/main-banner.mp3');
    useGameStore.getState().setGameState("TITLE");
  };

  function handleObjectAction(roomObject: RoomObject): void {
    if (roomObject.kind === "door") {
      setDoorOpen(true);
      return;
    }

    if (roomObject.roomId === "room-3") {
      setReviewRoomObject(roomObject);
      return;
    }

    setSelectedObject(roomObject);
  }

  function openLab(puzzle: _Puzzle): void {
    setLabPuzzleId(puzzle.id);
  }

  function openHelp(): void {
    setHelpOpen(true);
  }

  function changeRoom(roomId: string): void {
    if (roomId === currentRoomId) return;
    setTransitioning(true);
    window.setTimeout(() => {
      setCurrentRoom(roomId);
      setSelectedObject(null);
      setReviewRoomObject(null);
      setDoorOpen(false);
      setTransitioning(false);
    }, 210);
  }

  function revisitPuzzle(roomObject: RoomObject): void {
    setCurrentRoom(roomObject.roomId);
    useGameStore.getState().setCurrentView(roomObject.viewId);
    setReviewRoomObject(null);
    setDoorOpen(false);
    setSelectedObject(roomObject);
  }

  function showToast(message: string): void {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  function activateDemoMode(): void {
    const wordPuzzle = puzzlesById["room-1-word-billboard"];
    const wordObject = getRoomObjects("room-1").find((roomObject) => roomObject.puzzleId === wordPuzzle.id) ?? null;

    resetProgress();
    useGameStore.getState().setDemoMode(true);
    setCurrentRoom("room-1");
    saveCodeDraft(wordPuzzle.id, wordPuzzle.starterCode ?? "");
    setSelectedObject(wordObject);
    setLabPuzzleId(wordPuzzle.id);
    setDoorOpen(false);
    resetGameWindows();
    setDemoLayout();
    showToast("데모 모드 로드됨.");
  }

  function toggleFullscreen() {
    SoundEngine.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  function toggleMute() {
    SoundEngine.playClick();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    setTimeout(() => {
      SoundEngine.updateBGMVolume();
    }, 0);
  }

  if (gameState === "TITLE") return <TitleScreen />;
  if (gameState === "CREDITS") return <CreditsScreen />;

  return (
    <div className={`game-shell ${isTense ? "tension-active" : ""}`}>
      <div className="vignette-flicker" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />
      
      {introStage !== "done" && (
        <>
          <div className={`eye-lid top ${introStage === "opening" ? "opening" : ""}`} />
          <div className={`eye-lid bottom ${introStage === "opening" ? "opening" : ""}`} />
        </>
      )}

      <RoomView room={room} objects={objects} onObjectAction={handleObjectAction} />

      <header className="top-bar hud-layer">
        <div className="title-block">
          <h1>{room.title}</h1>
          <p>{room.subtitle}</p>
        </div>
        {devMode && (
          <details className="dev-room-panel">
            <summary>Dev</summary>
            <nav className="room-nav" aria-label="방 이동">
              {roomOrder.map((roomId) => {
                const navRoom = roomsById[roomId];
                const isActive = room.id === roomId;
                const isCleared = clearedRoomIds.includes(roomId);
                return (
                  <button
                    className={`nav-chip ${isActive ? "active" : ""} ${isCleared ? "cleared" : ""}`}
                    key={roomId}
                    onClick={() => changeRoom(roomId)}
                    type="button"
                  >
                    {navRoom.title.replace("Room ", "R")}
                  </button>
                );
              })}
              <button className="nav-chip demo-chip" onClick={activateDemoMode} type="button">
                데모
              </button>
              <button className="nav-chip demo-chip" onClick={() => useGameStore.getState().clearRoom(currentRoomId)} type="button">
                방 클리어
              </button>
              <button className="nav-chip demo-chip" onClick={resetGameWindows} type="button">
                창 리셋
              </button>
            </nav>
          </details>
        )}
        <div style={{ marginLeft: "auto", display: "flex", gap: "10px", paddingRight: "20px" }}>
          <button 
            className="title-btn" 
            style={{ minWidth: "40px", padding: "5px", background: "rgba(0,0,0,0.5)", border: "1px solid var(--neon-cyan)" }}
            onClick={toggleMute} 
            title="Mute Audio"
          >
            {isMuted ? <VolumeX size={20} color="var(--neon-cyan)" /> : <Volume2 size={20} color="var(--neon-cyan)" />}
          </button>
          <button 
            className="title-btn" 
            style={{ minWidth: "40px", padding: "5px", background: "rgba(0,0,0,0.5)", border: "1px solid var(--neon-cyan)" }}
            onClick={toggleFullscreen} 
            title="Toggle Fullscreen"
          >
            <Maximize size={20} color="var(--neon-cyan)" />
          </button>
        </div>
      </header>

      {selectedObject && selectedPuzzle ? (
        <InspectModal
          object={selectedObject}
          onClose={() => setSelectedObject(null)}
          onOpenHelp={openHelp}
          onOpenLab={openLab}
          onHintAcquired={showToast}
          puzzle={selectedPuzzle}
        />
      ) : null}

      {activeLabPuzzle ? <PythonLabWindow onClose={() => setLabPuzzleId(null)} puzzle={activeLabPuzzle} /> : null}
      {helpOpen ? <HelpModal onClose={() => setHelpOpen(false)} /> : null}
      {doorOpen ? <DoorKeypad onClose={() => setDoorOpen(false)} room={room} /> : null}
      {reviewRoomId ? <ReviewPanel onFinalExit={() => {}} room={roomsById[reviewRoomId]} /> : null}
      {reviewRoomObject ? (
        <ReviewRoomWindow
          object={reviewRoomObject}
          onClose={() => setReviewRoomObject(null)}
          onRevisitPuzzle={revisitPuzzle}
        />
      ) : null}
      <DialogueOverlay />
      {toast ? <div className="game-toast">{toast}</div> : null}
      {transitioning ? <div className="room-transition-flash" aria-hidden="true" /> : null}

      {isPaused && (
        <div className="cyber-modal-overlay">
          <div className="cyber-modal" style={{ maxWidth: "400px" }}>
            <div className="cyber-modal-header">
              <span>SYSTEM.PAUSED</span>
              <button className="cyber-modal-close" onClick={() => setIsPaused(false)} type="button">✕</button>
            </div>
            <div className="cyber-modal-content" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" }}>
                <label htmlFor="pause-bgm-volume" style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                  BGM VOLUME: {Math.round(bgmVolume * 100)}%
                </label>
                <input
                  id="pause-bgm-volume"
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={bgmVolume}
                  onChange={(e) => {
                    setBgmVolume(Number(e.currentTarget.value));
                    SoundEngine.updateBGMVolume();
                  }}
                  className="cyber-slider"
                />
              </div>
              <button className="cyber-switch-btn" onClick={() => setIsPaused(false)} type="button">RESUME</button>
              <button className="cyber-switch-btn" onClick={handleReturnToTitle} type="button">RETURN TO TITLE</button>
            </div>
          </div>
        </div>
      )}

      {showInventory && (
        <div className="cyber-modal-overlay">
          <div className="cyber-modal" style={{ maxWidth: "800px" }}>
            <div className="cyber-modal-header">
              <span>SYSTEM.INVENTORY.ACCESS</span>
              <button className="cyber-modal-close" onClick={() => setShowInventory(false)} type="button">✕</button>
            </div>
            <div className="cyber-modal-content">
              {collectedHints.length === 0 ? (
                <p style={{ textAlign: "center", fontStyle: "italic", opacity: 0.5 }}>NO DATA FOUND.</p>
              ) : (
                <ul className="cyber-list">
                  {collectedHints.map((hint, idx) => (
                    <li key={idx} className="cyber-list-item">
                      <span className="cyber-item-id">DATA_{String(idx).padStart(3, '0')}</span>
                      <span className="cyber-item-title">{hint.description}</span>
                      <span className="cyber-item-desc">{hint.value}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
