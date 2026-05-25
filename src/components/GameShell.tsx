import { useEffect, useRef, useState } from "react";
import { puzzlesById } from "../data/puzzles";
import { getRoomObjects, roomOrder, roomsById } from "../data/rooms";
import type { Puzzle as _Puzzle, RoomObject } from "../data/types";
import { useGameStore } from "../store/gameStore";
import { DoorKeypad } from "./DoorKeypad";
import { EndingWindow } from "./EndingWindow";
import { resetGameWindows, setDemoLayout } from "./GameWindow";
import { HelpModal } from "./HelpModal";
import { InspectModal } from "./InspectModal";
import { PythonLabWindow } from "./PythonLabWindow";
import { ReviewPanel } from "./ReviewPanel";
import { ReviewRoomWindow } from "./ReviewRoomWindow";
import { RoomView } from "./RoomView";

export function GameShell(): React.JSX.Element {
  const bootModeApplied = useRef(false);
  const [selectedObject, setSelectedObject] = useState<RoomObject | null>(null);
  const [reviewRoomObject, setReviewRoomObject] = useState<RoomObject | null>(null);
  const [labPuzzleId, setLabPuzzleId] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false);
  const [endingOpen, setEndingOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [transitioning, setTransitioning] = useState(false);
  const [devMode, setDevMode] = useState(false);

  const currentRoomId = useGameStore((state) => state.currentRoomId);
  const setCurrentRoom = useGameStore((state) => state.setCurrentRoom);
  const clearedRoomIds = useGameStore((state) => state.clearedRoomIds);
  const reviewRoomId = useGameStore((state) => state.reviewRoomId);
  const resetProgress = useGameStore((state) => state.resetProgress);
  const saveCodeDraft = useGameStore((state) => state.saveCodeDraft);

  const room = roomsById[currentRoomId] ?? roomsById["room-1"];
  const objects = getRoomObjects(room.id);
  const selectedPuzzle = selectedObject?.kind === "puzzle" ? puzzlesById[selectedObject.puzzleId] : undefined;
  const activeLabPuzzle = labPuzzleId ? puzzlesById[labPuzzleId] : undefined;

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

    if (shouldDev) setDevMode(true);

    if (shouldDemo) {
      activateDemoMode();
    } else if (shouldReset) {
      resetProgress();
      resetGameWindows();
      showToast("리셋 완료.");
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
      setEndingOpen(false);
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

  return (
    <div className="game-shell">
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
              <button className="nav-chip demo-chip" onClick={resetGameWindows} type="button">
                창 리셋
              </button>
            </nav>
          </details>
        )}
      </header>

      <div className="objective-strip hud-layer">
        <p>{room.description}</p>
      </div>

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
      {reviewRoomId ? <ReviewPanel onFinalExit={() => setEndingOpen(true)} room={roomsById[reviewRoomId]} /> : null}
      {reviewRoomObject ? (
        <ReviewRoomWindow
          object={reviewRoomObject}
          onClose={() => setReviewRoomObject(null)}
          onRevisitPuzzle={revisitPuzzle}
        />
      ) : null}
      {endingOpen ? <EndingWindow onClose={() => setEndingOpen(false)} /> : null}
      {toast ? <div className="game-toast">{toast}</div> : null}
      {transitioning ? <div className="room-transition-flash" aria-hidden="true" /> : null}
    </div>
  );
}
