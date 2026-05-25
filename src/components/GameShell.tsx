import { useEffect, useRef, useState } from "react";
import { puzzlesById } from "../data/puzzles";
import { getRoomObjects, roomOrder, roomsById } from "../data/rooms";
import type { Puzzle as _Puzzle, RoomObject } from "../data/types";
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

  const room = roomsById[currentRoomId] ?? roomsById["room-1"];
  const objects = getRoomObjects(room.id);
  const selectedPuzzle = selectedObject?.kind === "puzzle" ? puzzlesById[selectedObject.puzzleId] : undefined;
  const activeLabPuzzle = labPuzzleId ? puzzlesById[labPuzzleId] : undefined;
  const collectedHints = useGameStore((state) => state.collectedHints);

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
          useGameStore.getState().setDialogue("tutorial");
        }, 2500);
      } else if (finishedId === "escape-success" || finishedId === "true-ending") {
        setGameState("CREDITS");
      }
    }
  }, [currentDialogueId, setGameState]);

  useEffect(() => {
    if (gameState !== "PLAYING") return;
    const handleKeyDown = (e: KeyboardEvent) => {
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
    useGameStore.getState().setGameState("TITLE");
  };

  function handleObjectAction(roomObject: RoomObject): void {
    if (roomObject.kind === "door") {
      setDoorOpen(true);
      return;
    }

    if (roomObject.roomId === "room-4") {
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
    setCurrentRoom("room-1");
    saveCodeDraft(wordPuzzle.id, wordPuzzle.starterCode ?? "");
    setSelectedObject(wordObject);
    setLabPuzzleId(wordPuzzle.id);
    setDoorOpen(false);
    resetGameWindows();
    setDemoLayout();
    showToast("데모 모드 로드됨.");
  }

  if (gameState === "TITLE") return <TitleScreen />;
  if (gameState === "CREDITS") return <CreditsScreen />;

  return (
    <div className="game-shell">
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
