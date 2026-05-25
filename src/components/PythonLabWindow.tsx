import { python } from "@codemirror/lang-python";
import { indentWithTab } from "@codemirror/commands";
import { indentOnInput } from "@codemirror/language";
import { keymap } from "@codemirror/view";
import { oneDark } from "@codemirror/theme-one-dark";
import CodeMirror from "@uiw/react-codemirror";
import { Play, RotateCcw, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Puzzle } from "../data/types";
import { pythonRunner } from "../lib/pythonRunner";
import { useGameStore } from "../store/gameStore";
import { GameWindow } from "./GameWindow";

declare global {
  interface Window {
    __setCodeEditor?: (value: string) => void;
  }
}

type PythonLabWindowProps = {
  puzzle: Puzzle;
  onClose: () => void;
};

export function PythonLabWindow({ puzzle, onClose }: PythonLabWindowProps): React.JSX.Element {
  const codeDraft = useGameStore((state) => state.codeDrafts[puzzle.id]);
  const saveCodeDraft = useGameStore((state) => state.saveCodeDraft);
  const [code, setCode] = useState(codeDraft ?? "");
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const setCodeRef = useRef(setCode);
  setCodeRef.current = setCode;

  useEffect(() => {
    const initialCode = codeDraft ?? puzzle.starterCode ?? "";
    setCode(initialCode);
    setStdout("");
    setStderr("");

    if (!codeDraft && initialCode) {
      saveCodeDraft(puzzle.id, initialCode);
    }
  }, [codeDraft, puzzle.id, puzzle.starterCode, saveCodeDraft]);

  useEffect(() => {
    window.__setCodeEditor = (value: string) => {
      setCodeRef.current(value);
      saveCodeDraft(puzzle.id, value);
    };
    return () => {
      window.__setCodeEditor = undefined;
    };
  }, [puzzle.id, saveCodeDraft]);

  function updateCode(value: string): void {
    setCode(value);
    saveCodeDraft(puzzle.id, value);
  }

  function loadExampleApproach(): void {
    if (!puzzle.starterCode) {
      return;
    }
    updateCode(puzzle.starterCode);
  }

  async function runCode(): Promise<void> {
    setIsRunning(true);
    setStdout("");
    setStderr("");

    const result = await pythonRunner.run(code, {
      puzzleId: puzzle.id,
      roomId: puzzle.roomId,
    });

    setStdout(result.stdout);
    setStderr(result.stderr ?? "");
    setIsRunning(false);
  }

  return (
    <GameWindow id={`python-${puzzle.id}`} type="python" eyebrow="Python" title={puzzle.title} onClose={onClose}>
      <div className="lab-window">
        <CodeMirror
          aria-label="Python 코드"
          className="code-editor"
          value={code}
          onChange={updateCode}
          theme={oneDark}
          extensions={[
            python(),
            indentOnInput(),
            keymap.of([indentWithTab]),
          ]}
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            indentOnInput: true,
          }}
        />
        <div className="lab-actions">
          <button className="primary-button sk-action-btn" disabled={isRunning} onClick={runCode} type="button" title="코드 실행 및 분석 (Run Analysis)">
            {isRunning ? <Loader2 className="spinner" size={20} /> : <Play size={20} />}
          </button>
          {puzzle.starterCode ? (
            <button className="ghost-button sk-action-btn" onClick={loadExampleApproach} type="button" title="예제 코드 불러오기 (Load Example)">
              <RotateCcw size={20} />
            </button>
          ) : null}
        </div>
        <div className="output-panel" aria-live="polite">
          <span>Signal Output</span>
          <pre>{stderr || stdout || ""}</pre>
        </div>
      </div>
    </GameWindow>
  );
}
