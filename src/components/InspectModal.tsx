import { useEffect, useState, useRef, useCallback } from "react";
import { CheckCircle2, Copy, TerminalSquare, BookOpen, XCircle, Loader2 } from "lucide-react";
import type { Puzzle, RoomObject } from "../data/types";
import { useGameStore } from "../store/gameStore";
import { GameWindow } from "./GameWindow";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { keymap, EditorView } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { oneDark } from "@codemirror/theme-one-dark";
import { pythonRunner } from "../lib/pythonRunner";
import { SoundEngine } from "../utils/SoundEngine";

type InspectModalProps = {
  object: RoomObject;
  puzzle: Puzzle;
  onClose: () => void;
  onOpenLab: (puzzle: Puzzle) => void;
  onOpenHelp: () => void;
  onHintAcquired?: (message: string) => void;
};

function normalizeAnswer(value: string): string {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function fallbackCopyText(text: string): void {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

/**
 * Renders children at a fixed internal width, then scales the whole block
 * to fit the container — like an image. Text never reflows.
 */
function ScaledSurface({ children, baseWidth = "auto" }: { children: React.ReactNode; baseWidth?: number | "auto" }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [size, setSize] = useState({ w: typeof baseWidth === "number" ? baseWidth : 460, h: 0 });

  const measure = useCallback(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const prevTransform = inner.style.transform;
    inner.style.transform = "none";
    const naturalWidth = inner.offsetWidth;
    const naturalHeight = inner.offsetHeight;
    
    const iw = baseWidth === "auto" ? Math.max(460, naturalWidth) : baseWidth;
    const ih = naturalHeight;
    
    inner.style.transform = prevTransform;

    const cw = container.clientWidth;
    const s = Math.min(cw / (iw || 1), 1);
    
    setScale(s);
    setSize({ w: iw, h: ih });
  }, [baseWidth]);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    if (innerRef.current) ro.observe(innerRef.current);
    return () => ro.disconnect();
  }, [measure]);

  return (
    <div ref={containerRef} className="scaled-surface-container" style={{ width: "100%", overflow: "hidden" }}>
      <div style={{ height: size.h * scale, position: "relative" }}>
        <div
          ref={innerRef}
          className="scaled-surface-inner"
          style={{
            width: baseWidth === "auto" ? "max-content" : baseWidth,
            minWidth: baseWidth === "auto" ? 460 : undefined,
            transformOrigin: "top left",
            transform: `scale(${scale})`,
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function renderClueSurface(puzzle: Puzzle, object: RoomObject): React.JSX.Element {
  // Room 0 surfaces
  if (puzzle.id === "room-0-tv-sequence") {
    const parts = puzzle.dataText.split(/\s+/).filter(Boolean);
    return (
      <div className="clue-surface tv-surface">
        <div className="tv-frame">
          {parts.map((part, index) => (
            <span className={part === "?" ? "tv-num tv-num-active" : "tv-num"} key={index}>
              {part}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (puzzle.id === "room-0-desk-terminal") {
    return (
      <div className="clue-surface terminal-surface">
        <div className="terminal-line">
          <span className="term-prompt">❯</span>
          <code>{puzzle.dataText}</code>
        </div>
      </div>
    );
  }

  if (puzzle.id === "room-0-mini-ox-card") {
    const chars = /\s/.test(puzzle.dataText) ? puzzle.dataText.split(/\s+/).filter(Boolean) : puzzle.dataText.split("");
    return (
      <div className="clue-surface mini-ox-surface">
        <div className="ox-row" style={{ gridTemplateColumns: `repeat(${chars.length}, 1fr)` }}>
          {chars.map((char, index) => (
            <span className={char === "X" ? "x-cell" : "o-cell"} key={index}>
              {char}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (puzzle.id === "room-0-name-tags") {
    const names = puzzle.dataText.split(/\s+/).filter(Boolean);
    return (
      <div className="clue-surface name-card-surface">
        {names.map((name, index) => (
          <span className={`name-token card-${(index % 9) + 1}`} key={index}>
            {name}
          </span>
        ))}
      </div>
    );
  }

  if (puzzle.id === "room-0-pattern-tiles") {
    const shapeIcon: Record<string, string> = { triangle: "▲", square: "■", circle: "●", "?": "?" };
    const tiles = puzzle.dataText.split(/\s+/).filter(Boolean);
    return (
      <div className="clue-surface tile-surface">
        {tiles.map((tile, index) => (
          <span className={`tile-token ${tile === "?" ? "tile-unknown" : ""}`} key={index}>
            <em>{shapeIcon[tile] ?? tile}</em>
            <small>{tile}</small>
          </span>
        ))}
      </div>
    );
  }

  if (puzzle.id === "room-0-bookshelf-note") {
    return (
      <div className="clue-surface note-surface">
        <p>{puzzle.dataText}</p>
      </div>
    );
  }

  // Room 2 surfaces
  if (puzzle.id === "room-2-file-cabinet") {
    const lines = puzzle.dataText.split(/\r?\n/).filter(Boolean);
    return (
      <div className="clue-surface file-log-surface">
        {lines.map((line, index) => {
          const parts = line.split("/").map((s) => s.trim());
          const isSuccess = line.includes("success");
          return (
            <div className={`log-row ${isSuccess ? "log-ok" : "log-err"}`} key={index}>
              <code>{parts[0]}</code>
              <span>{parts[1]}</span>
              <em>{parts[2]}</em>
            </div>
          );
        })}
      </div>
    );
  }

  if (puzzle.id === "room-2-broken-tags") {
    const tags = puzzle.dataText.split(/\r?\n/).filter(Boolean);
    return (
      <div className="clue-surface broken-tag-surface">
        {tags.map((tag, index) => (
          <span className={`broken-tag variant-${index % 4}`} key={index}>
            {tag}
          </span>
        ))}
      </div>
    );
  }

  if (puzzle.id === "room-2-score-board") {
    const lines = puzzle.dataText.split(/\r?\n/).filter(Boolean);
    const nameSection = lines.slice(1, 6);
    const scoreSection = lines.slice(7);
    return (
      <div className="clue-surface score-surface">
        <div className="score-block">
          <div className="score-header">NAMES</div>
          {nameSection.map((line, index) => {
            const [id, name] = line.split("/").map((s) => s.trim());
            return (
              <div className="score-row" key={index}>
                <code>{id}</code>
                <span>{name}</span>
              </div>
            );
          })}
        </div>
        <div className="score-block">
          <div className="score-header">SCORES</div>
          {scoreSection.map((line, index) => {
            const [id, score] = line.split("/").map((s) => s.trim());
            return (
              <div className="score-row" key={index}>
                <code>{id}</code>
                <strong>{score}</strong>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (puzzle.id === "room-2-access-log") {
    const lines = puzzle.dataText.split(/\r?\n/).filter(Boolean);
    return (
      <div className="clue-surface access-log-surface">
        {lines.map((line, index) => {
          const parts = line.split("/").map((s) => s.trim());
          const isSuccess = line.includes("success");
          const isFail = line.includes("fail");
          return (
            <div className={`access-row ${isSuccess ? "access-ok" : isFail ? "access-fail" : ""}`} key={index}>
              <code>{parts[0]}</code>
              <span>{parts.slice(1).join(" · ")}</span>
            </div>
          );
        })}
      </div>
    );
  }

  if (puzzle.id === "room-2-timeline") {
    const lines = puzzle.dataText.split(/\r?\n/).filter(Boolean);
    return (
      <div className="clue-surface timeline-surface">
        {lines.map((line, index) => {
          const [time, event] = line.split("/").map((s) => s.trim());
          return (
            <div className="timeline-row" key={index}>
              <span className="timeline-time">{time}</span>
              <span className="timeline-dot" />
              <span className="timeline-event">{event}</span>
            </div>
          );
        })}
      </div>
    );
  }

  if (puzzle.id === "room-2-checksum-ledger") {
    const lines = puzzle.dataText.split(/\r?\n/).filter(Boolean);
    return (
      <div className="clue-surface checksum-surface">
        {lines.map((line, index) => {
          const parts = line.split("/").map((s) => s.trim());
          const code = parts[0];
          const status = parts[2];
          return (
            <span className={status === "PASS" ? "log-pass" : "log-fail"} key={index}>
              <strong>{code}</strong>
              <em>{status}</em>
            </span>
          );
        })}
      </div>
    );
  }

  // Room 3 surfaces
  if (puzzle.id === "room-3-switch-panel") {
    const switchLabels = ["S1", "S2", "S3", "S4", "S5", "S6"];
    const conditions = puzzle.dataText.split(/\r?\n/).filter(Boolean).slice(1);
    return (
      <div className="clue-surface switch-surface">
        <div className="switch-row">
          {switchLabels.map((s) => (
            <span className="switch-item" key={s}>
              <span className="switch-toggle" />
              <strong>{s}</strong>
            </span>
          ))}
        </div>
        <div className="switch-conditions">
          {conditions.map((cond, index) => (
            <p key={index}>{cond}</p>
          ))}
        </div>
      </div>
    );
  }

  if (puzzle.id === "room-3-logic-gate") {
    const lines = puzzle.dataText.split(/\r?\n/).filter(Boolean);
    const tableLines = lines.slice(0, 5);
    const ruleLines = lines.slice(6);
    return (
      <div className="clue-surface gate-surface">
        {tableLines.map((line, index) => {
          const cells = line.split(/[\s|]+/).filter(Boolean);
          return (
            <div className={`gate-row ${index === 0 ? "gate-header-row" : ""}`} key={index}>
              {cells.map((cell, j) => (
                <span className={cell === "?" ? "gate-cell gate-unknown" : "gate-cell"} key={j}>
                  {cell}
                </span>
              ))}
            </div>
          );
        })}
        <div className="gate-rules">
          {ruleLines.map((rule, index) => (
            <code key={index}>{rule}</code>
          ))}
        </div>
      </div>
    );
  }

  if (puzzle.id === "room-3-candidate-codes") {
    const lines = puzzle.dataText.split(/\r?\n/).filter(Boolean);
    const codeLines = lines.slice(0, 2);
    const condLines = lines.slice(3);
    const codes = codeLines.flatMap((line) => line.split(/\s+/).filter(Boolean));
    return (
      <div className="clue-surface code-pin-surface">
        <div className="pin-grid">
          {codes.map((code, index) => (
            <span className="pin-code" key={index}>
              {code}
            </span>
          ))}
        </div>
        <div className="pin-conditions">
          {condLines.map((cond, index) => (
            <p key={index}>{cond}</p>
          ))}
        </div>
      </div>
    );
  }

  if (puzzle.id === "room-3-warning-lamp") {
    const lines = puzzle.dataText.split(/\r?\n/).filter(Boolean);
    const dataRows = lines.slice(1, 5);
    return (
      <div className="clue-surface lamp-surface">
        <div className="lamp-header-row">
          <span>A</span>
          <span>B</span>
          <span>C</span>
          <span className="lamp-label">LAMP</span>
        </div>
        {dataRows.map((row, index) => {
          const cells = row.split(/[\s|]+/).filter(Boolean);
          return (
            <div className="lamp-row" key={index}>
              {cells.slice(0, 3).map((val, j) => (
                <span className={`lamp-bit ${val === "1" ? "bit-on" : "bit-off"}`} key={j}>
                  {val}
                </span>
              ))}
              <span className="lamp-indicator">?</span>
            </div>
          );
        })}
      </div>
    );
  }

  if (puzzle.id === "room-3-experiment") {
    const lines = puzzle.dataText.split(/\r?\n/).filter(Boolean);
    return (
      <div className="clue-surface console-surface">
        {lines.map((line, index) => {
          const isSection = line.startsWith("후보") || line.startsWith("규칙");
          return (
            <div className={`console-line ${isSection ? "console-section" : ""}`} key={index}>
              {line}
            </div>
          );
        })}
      </div>
    );
  }

  if (puzzle.id === "room-3-power-meter") {
    const lines = puzzle.dataText.split(/\r?\n/).filter(Boolean);
    return (
      <div className="clue-surface meter-surface">
        {lines.map((line, index) => {
          const parts = line.split(/\s+/);
          const code = parts[0];
          const state = parts[1] ?? "";
          return (
            <div className={`meter-row state-${state}`} key={index}>
              <code>{code}</code>
              <span className="meter-state">{state}</span>
            </div>
          );
        })}
      </div>
    );
  }

  // Room 4 surfaces
  if (puzzle.id === "room-4-validator") {
    const lines = puzzle.dataText.split(/\r?\n/).filter(Boolean);
    return (
      <div className="clue-surface validator-surface">
        {lines.map((line, index) => {
          const isBug = line.includes('== "5"') || (line.includes("== 18") && line.includes("False"));
          return (
            <div className={`val-line ${isBug ? "val-bug" : ""}`} key={index}>
              <code>{line}</code>
            </div>
          );
        })}
      </div>
    );
  }

  if (puzzle.id === "room-4-test-log") {
    const lines = puzzle.dataText.split(/\r?\n/).filter(Boolean);
    return (
      <div className="clue-surface checksum-surface">
        {lines.map((line, index) => {
          const [code, status] = line.split(/\s+/);
          return (
            <span className={status === "PASS" ? "log-pass" : "log-fail"} key={index}>
              <strong>{code}</strong>
              <em>{status}</em>
            </span>
          );
        })}
      </div>
    );
  }

  if (puzzle.id === "room-4-candidate-dial") {
    const condLines = puzzle.dataText.split(/\r?\n/).filter(Boolean).slice(1);
    return (
      <div className="clue-surface dial-surface">
        <div className="dial-face">
          <span className="dial-ring" />
          <strong>1000~9999</strong>
        </div>
        <div className="dial-conditions">
          {condLines.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </div>
    );
  }

  if (puzzle.id === "room-4-error-server") {
    const lines = puzzle.dataText.split(/\r?\n/).filter(Boolean);
    return (
      <div className="clue-surface error-log-surface">
        {lines.map((line, index) => {
          const colonIdx = line.indexOf(":");
          const errorType = colonIdx >= 0 ? line.slice(0, colonIdx) : line;
          const errorMsg = colonIdx >= 0 ? line.slice(colonIdx + 1) : "";
          return (
            <div className="error-row" key={index}>
              <code className="error-type">{errorType}</code>
              {errorMsg ? <span className="error-msg">{errorMsg}</span> : null}
            </div>
          );
        })}
      </div>
    );
  }

  if (puzzle.id === "room-4-broken-crt") {
    const lines = puzzle.dataText.split(/\r?\n/).filter(Boolean).slice(1);
    return (
      <div className="clue-surface crt-surface">
        {lines.map((line, index) => {
          const [input, rest] = line.split("->").map((s) => s.trim());
          if (!rest) return null;
          const [expected, actual] = rest.split("/").map((s) => s.trim());
          return (
            <div className="crt-row" key={index}>
              <code className="crt-input">{input}</code>
              <span className="crt-arrow">→</span>
              <code className="crt-expected">{expected}</code>
              <span className="crt-slash">/</span>
              <code className="crt-actual">{actual}</code>
            </div>
          );
        })}
      </div>
    );
  }

  if (puzzle.id === "room-4-sum-analyzer") {
    const lines = puzzle.dataText.split(/\r?\n/).filter(Boolean);
    return (
      <div className="clue-surface checksum-surface">
        {lines.map((line, index) => {
          const [code, status] = line.split(/\s+/);
          return (
            <span className={status === "PASS" ? "log-pass" : "log-fail"} key={index}>
              <strong>{code}</strong>
              <em>{status}</em>
            </span>
          );
        })}
      </div>
    );
  }

  if (puzzle.id === "room-1-word-billboard") {
    const words = puzzle.dataText.split(/\s+/);
    return (
      <div className="clue-surface billboard-surface">
        <div className="slot-clue" aria-label="Five slot clue">
          <span />
          <span />
          <span className="active" />
          <span />
          <span />
        </div>
        <div className="word-grid">
          {words.map((word, index) => (
            <span className={`word-token drift-${index % 9}`} key={`${puzzle.id}-${index}-${word}`}>
              {word}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (puzzle.id === "room-1-ox-monitor") {
    const rows = puzzle.dataText.split(/\r?\n/).filter(Boolean);
    return (
      <div className="clue-surface ox-surface">
        <div className="ox-hint-card">
          <span><code>X X</code> → 꺼짐</span>
          <span><code>X</code>&nbsp;&nbsp; → 남음</span>
        </div>
        {rows.map((row, rowIndex) => (
          <div className="ox-line" key={`${puzzle.id}-${rowIndex}`}>
            <span className="ox-line-num">{String(rowIndex + 1).padStart(2, "0")}</span>
            <div className="ox-row" style={{ gridTemplateColumns: `repeat(${row.length}, minmax(7px, 1fr))` }}>
              {row.split("").map((cell, cellIndex) => (
                <span className={cell === "X" ? "x-cell" : "o-cell"} key={`${rowIndex}-${cellIndex}`}>
                  {cell}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (puzzle.id === "room-1-number-panel") {
    return (
      <div className="clue-surface number-surface">
        {puzzle.dataText.split(/\s+/).map((num, index) => (
          <span className={`number-token tile-${index % 8}`} key={`${puzzle.id}-${index}`}>
            {num}
          </span>
        ))}
      </div>
    );
  }

  if (puzzle.id === "room-1-name-card") {
    return (
      <div className="clue-surface name-card-surface">
        {puzzle.dataText.split(/\s+/).map((name, index) => (
          <span className={`name-token card-${index % 10}`} key={`${puzzle.id}-${index}`}>
            {name}
          </span>
        ))}
      </div>
    );
  }

  if (puzzle.id === "room-1-radio-signal") {
    const lines = puzzle.dataText.split(/\r?\n/).filter(Boolean);
    return (
      <div className="clue-surface radio-surface">
        <div className="radio-dial" />
        <div className="frequency-grid">
          {lines
            .filter((line) => /^\d/.test(line))
            .flatMap((line) => line.split(/\s+/))
            .map((freq, index) => (
              <span className={`freq-token pulse-${index % 7}`} key={`${puzzle.id}-${index}`}>
                {freq}
              </span>
            ))}
        </div>
      </div>
    );
  }

  if (puzzle.id === "room-1-checksum-tablet") {
    return (
      <div className="clue-surface noise-strip-surface">
        {puzzle.dataText.split("").map((char, index) => (
          <span className={/\d/.test(char) ? "noise-digit" : "noise-char"} key={`${puzzle.id}-${index}`}>
            {char}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="clue-surface generic-surface">
      <span className="surface-object-label">{object.title}</span>
      <pre>{puzzle.dataText}</pre>
    </div>
  );
}

export function InspectModal({
  object,
  puzzle,
  onClose,
  onOpenLab,
  onOpenHelp,
  onHintAcquired,
}: InspectModalProps): React.JSX.Element {
  const codeDrafts = useGameStore((state) => state.codeDrafts);
  const saveCodeDraft = useGameStore((state) => state.saveCodeDraft);
  
  const [code, setCode] = useState(() => codeDrafts[puzzle.id] ?? puzzle.starterCode ?? "");
  const [isShaking, setIsShaking] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const solvePuzzle = useGameStore((state) => state.solvePuzzle);
  const solvedPuzzleIds = useGameStore((state) => state.solvedPuzzleIds);
  const isSolved = solvedPuzzleIds.includes(puzzle.id);

  useEffect(() => {
    setCode(codeDrafts[puzzle.id] ?? puzzle.starterCode ?? "");
    
    setErrorMsg("");
  }, [puzzle.id, codeDrafts, puzzle.starterCode]);



  async function handleVerify(): Promise<void> {
    if (isChecking) return;
    setIsChecking(true);
    setErrorMsg("");
    SoundEngine.playProcessing();

    // 1.5초간 연산 딜레이를 주어 PROCESSING 사운드가 충분히 재생되도록 함
    await new Promise((r) => setTimeout(r, 1500));

    const result = await pythonRunner.run(code, {
      testCases: puzzle.testCases,
      requiredSyntax: puzzle.requiredSyntax,
      bannedSyntax: puzzle.bannedSyntax,
    });

    setIsChecking(false);

    if (result.success) {
      SoundEngine.playSuccess();
      solvePuzzle(puzzle);
      window.dispatchEvent(new CustomEvent("puzzle-solved-vfx"));
      onHintAcquired?.(puzzle.requiredForDoor ? "Door Code piece acquired!" : "Puzzle solved! Access Granted.");
    } else {
      SoundEngine.playError();
      setErrorMsg(result.stderr || "실패: 조건을 만족하지 못했습니다.");
      setIsShaking(true);
      window.setTimeout(() => setIsShaking(false), 360);
      onHintAcquired?.("코드 검증 실패.");
    }
  }

  return (
    <GameWindow id={`inspect-${puzzle.id}`} type="inspect" eyebrow="//SYS.INSPECT" title={object.title} onClose={onClose}>
      <div className={`inspect-modal ${isShaking ? "shake" : ""}`}>
        <div className="inspect-layout">
          {/* Main Visual/Data Area */}
          <div className="inspect-main-column">
            <span className="inspect-kicker">OBJ ID: {object.shortLabel}</span>
            <div className="inspect-header" style={{ border: "none", padding: 0, margin: 0 }}>
              <p className="situation-text">{puzzle.situationText}</p>
              {isSolved ? <span className="solved-badge">✓ ACCESSED</span> : null}
            </div>

            {/* Display Restrictions if any */}
            {(puzzle.requiredSyntax?.length || puzzle.bannedSyntax?.length) ? (
              <div style={{ marginTop: "10px", padding: "10px", background: "rgba(0,0,0,0.4)", border: "1px dashed var(--neon-cyan)", fontSize: "0.85rem" }}>
                <strong style={{ color: "var(--neon-cyan)" }}>! CONST</strong>
                {puzzle.requiredSyntax && puzzle.requiredSyntax.length > 0 && (
                  <div style={{ marginTop: "4px" }}>+ {puzzle.requiredSyntax.join(", ")}</div>
                )}
                {puzzle.bannedSyntax && puzzle.bannedSyntax.length > 0 && (
                  <div style={{ marginTop: "4px", color: "#ff6b6b" }}>- {puzzle.bannedSyntax.join(", ")}</div>
                )}
              </div>
            ) : null}

            <div className="inspect-surface" style={{ flex: 1, marginTop: "8px" }}>
              <ScaledSurface baseWidth="auto">
                {renderClueSurface(puzzle, object)}
              </ScaledSurface>
            </div>
          </div>

          {/* Console / Action Area */}
          <div className="inspect-side-column" style={{ display: "flex", flexDirection: "column" }}>
            <span className="inspect-kicker">/ TERMINAL</span>
            <div className="editor-container" style={{ flex: 1, minHeight: "200px", border: "1px solid var(--neon-cyan)", background: "#1e1e1e", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <CodeMirror
                value={code}
                onChange={(val) => {
                  setCode(val);
                  saveCodeDraft(puzzle.id, val);
                }}
                extensions={[python(), keymap.of([indentWithTab])]}
                theme={oneDark}
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: false,
                  dropCursor: false,
                  allowMultipleSelections: false,
                  indentOnInput: false,
                }}
                style={{ flex: 1, fontSize: "14px", overflowY: "auto" }}
              />
            </div>

            {errorMsg && (
              <div style={{ marginTop: "8px", padding: "8px", background: "rgba(255, 0, 0, 0.1)", borderLeft: "3px solid #ff6b6b", color: "#ff6b6b", fontSize: "0.85rem", whiteSpace: "pre-wrap" }}>
                {errorMsg}
              </div>
            )}

            <div className="action-grid modal-actions" style={{ display: "flex", flexDirection: "column", marginTop: "10px" }}>
              <button 
                className="primary-button sk-action-btn check-btn" 
                onClick={handleVerify} 
                type="button" 
                disabled={isChecking}
                title="Verify Code"
              >
                {isChecking ? <Loader2 size={18} className="spin" /> : <CheckCircle2 size={18} />}
              </button>
              
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button className="ghost-button sk-action-btn" onClick={onOpenHelp} type="button" title="Python Reference" style={{ flex: 1 }}>
                  <BookOpen size={16} /> REFERENCE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GameWindow>
  );
}
