import { useEffect, useState, useRef, useCallback } from "react";
import { CheckCircle2, BookOpen, Play, Loader2 } from "lucide-react";
import type { Puzzle, RoomObject } from "../data/types";
import { useGameStore } from "../store/gameStore";
import { GameWindow } from "./GameWindow";
import { pythonRunner } from "../lib/pythonRunner";
import { SoundEngine } from "../utils/SoundEngine";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";

type InspectModalProps = {
  object: RoomObject;
  puzzle: Puzzle;
  onClose: () => void;
  onOpenHelp: () => void;
  onHintAcquired?: (message: string) => void;
};

function normalizeAnswer(value: string): string {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function InspectModal({
  object,
  puzzle,
  onClose,
  onOpenHelp,
  onHintAcquired,
}: InspectModalProps): React.JSX.Element {
  const [answer, setAnswer] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const solvePuzzle = useGameStore((state) => state.solvePuzzle);
  const solvedPuzzleIds = useGameStore((state) => state.solvedPuzzleIds);
  const isSolved = solvedPuzzleIds.includes(puzzle.id);
  
  const codeDraft = useGameStore((state) => state.codeDrafts[puzzle.id]);
  const saveCodeDraft = useGameStore((state) => state.saveCodeDraft);
  const [code, setCode] = useState(codeDraft ?? puzzle.starterCode ?? "");
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSuccessAnim, setIsSuccessAnim] = useState(false);

  // Tension Mechanics
  const [lastActive, setLastActive] = useState(Date.now());
  const [isTense, setIsTense] = useState(false);
  
  // Heartbeat loop for idle tension
  useEffect(() => {
    let heartbeatInterval: number | undefined;
    if (isTense) {
      // Play immediately when it becomes tense, then every 1.2 seconds
      SoundEngine.playHeartbeat();
      heartbeatInterval = window.setInterval(() => {
        SoundEngine.playHeartbeat();
      }, 1200);
    }
    return () => clearInterval(heartbeatInterval);
  }, [isTense]);

  // Idle checker
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastActive > 15000) { // 15 seconds idle
        setIsTense(true);
      } else {
        setIsTense(false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lastActive]);

  useEffect(() => {
    setAnswer("");
    setStdout("");
    setStderr("");
  }, [puzzle.id]);

  function handleCodeChange(value: string) {
    setCode(value);
    saveCodeDraft(puzzle.id, value);
    setLastActive(Date.now()); // Reset tension timer
  }

  async function runCode(): Promise<void> {
    setIsRunning(true);
    setStdout("");
    setStderr("");
    setLastActive(Date.now());

    // Basic syntax check (강제성)
    if (puzzle.requiredSyntax && puzzle.requiredSyntax.length > 0) {
      const missing = puzzle.requiredSyntax.filter(s => !code.includes(s));
      if (missing.length > 0) {
        setStderr(`Security Protocol: Required keyword(s) missing -> ${missing.join(", ")}\n코드에 위 키워드를 반드시 포함해야 합니다.`);
        setIsRunning(false);
        return;
      }
    }

    const result = await pythonRunner.run(code, {
      puzzleId: puzzle.id,
      roomId: puzzle.roomId,
    });

    setStdout(result.stdout);
    setStderr(result.stderr ?? "");
    setIsRunning(false);
  }

  function checkAnswer(): void {
    setLastActive(Date.now());
    const normalized = normalizeAnswer(answer);
    if (normalized.length === 0) {
      onHintAcquired?.("값을 입력하세요.");
      triggerShake();
      return;
    }

    if (normalized === normalizeAnswer(puzzle.expectedAnswer)) {
      SoundEngine.playSuccess();
      setIsSuccessAnim(true);
      window.setTimeout(() => {
        solvePuzzle(puzzle);
        onHintAcquired?.(puzzle.requiredForDoor ? "Door Code piece acquired!" : "Hidden clue recorded.");
      }, 1500);
      return;
    }

    SoundEngine.playHeartbeat();
    setIsTense(true);
    onHintAcquired?.("Code mismatch — 다시 확인하세요.");
    triggerShake();
  }

  function triggerShake() {
    setIsShaking(true);
    window.setTimeout(() => setIsShaking(false), 360);
  }

  return (
    <GameWindow id={`inspect-${puzzle.id}`} type="inspect" eyebrow="조사" title={object.title} onClose={onClose}>
      <div className={`inspect-modal ${isShaking ? "shake" : ""} ${isTense ? "tension-active" : ""} ${isSuccessAnim ? "success-anim" : ""}`} onMouseMove={() => setLastActive(Date.now())}>
        
        {isSuccessAnim && (
          <div className="success-overlay">
            <h1>CLEARED</h1>
          </div>
        )}

        <div className="inspect-header" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p className="situation-text">{puzzle.situationText}</p>
          {puzzle.scenarioImageUrl && (
            <div className="scenario-image-container" style={{ width: '100%', height: '180px', overflow: 'hidden', borderRadius: '8px', border: '1px solid #333' }}>
              <img src={puzzle.scenarioImageUrl} alt="Scenario" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          {isSolved ? <span className="solved-badge">✓ 해제됨</span> : null}
        </div>

        <div className="inspect-surface" style={{ padding: 0, display: 'flex', flexDirection: 'column', flex: 1 }}>
           <div className="lab-window" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <CodeMirror
              className="code-editor"
              value={code}
              onChange={handleCodeChange}
              theme={oneDark}
              extensions={[python()]}
              style={{ flex: 1, minHeight: '150px', overflowY: 'auto', fontSize: '14px' }}
            />
            <div className="lab-actions" style={{ padding: '8px', borderTop: '1px solid #333', background: '#1e1e1e', display: 'flex', gap: '8px' }}>
              <button className="primary-button sk-action-btn" disabled={isRunning} onClick={runCode} type="button" title="코드 실행 (Run Code)" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                {isRunning ? <Loader2 className="spinner" size={16} /> : <Play size={16} />}
                <span>실행</span>
              </button>
            </div>
            {(stdout || stderr) && (
              <div className="output-panel" style={{ padding: '8px', background: '#000', borderTop: '1px solid #333', minHeight: '60px', maxHeight: '100px', overflowY: 'auto' }}>
                <pre style={{ margin: 0, color: stderr ? '#ff5555' : '#aaffaa', fontSize: '13px', whiteSpace: 'pre-wrap' }}>
                  {stderr || stdout}
                </pre>
              </div>
            )}
          </div>
        </div>

        <div className="inspect-footer" style={{ marginTop: '12px' }}>
          <label className="answer-row">
            <span>Result</span>
            <input
              className="unlock-input"
              onChange={(event) => {
                setAnswer(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""));
                setLastActive(Date.now());
              }}
              onKeyDown={(event) => { if (event.key === "Enter") checkAnswer(); }}
              placeholder="정답 입력"
              type="text"
              value={answer}
            />
          </label>
          <div className="modal-actions">
            <button className="primary-button sk-action-btn" onClick={checkAnswer} type="button" title="입력한 정답을 확인합니다">
              <CheckCircle2 size={24} />
            </button>
            <button className="ghost-button sk-action-btn" onClick={onOpenHelp} type="button" title="파이썬 문법 사전 보기">
              <BookOpen size={24} />
            </button>
          </div>
        </div>
      </div>
    </GameWindow>
  );
}
