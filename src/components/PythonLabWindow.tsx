import { python } from "@codemirror/lang-python";
import { indentWithTab } from "@codemirror/commands";
import { indentOnInput } from "@codemirror/language";
import { keymap } from "@codemirror/view";
import { oneDark } from "@codemirror/theme-one-dark";
import { autocompletion, CompletionContext, CompletionResult } from "@codemirror/autocomplete";
import CodeMirror from "@uiw/react-codemirror";
import { Play, RotateCcw, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Puzzle } from "../data/types";
import { pythonRunner } from "../lib/pythonRunner";
import { useGameStore } from "../store/gameStore";
import { GameWindow } from "./GameWindow";
import { SoundEngine } from "../utils/SoundEngine";

function pythonCustomCompletions(context: CompletionContext): CompletionResult | null {
  const word = context.matchBefore(/\w*/);
  const dotWord = context.matchBefore(/\.\w*/);

  if (dotWord && dotWord.from !== dotWord.to) {
    return {
      from: dotWord.from + 1,
      options: [
        { label: "split", type: "function", apply: "split()", detail: "나누기", info: "문자열을 특정 기준으로 나눕니다. 예: split('/')" },
        { label: "replace", type: "function", apply: "replace('', '')", detail: "바꾸기", info: "문자열의 일부를 다른 문자로 교체합니다." },
        { label: "strip", type: "function", apply: "strip()", detail: "공백제거", info: "문자열 양 끝의 공백이나 줄바꿈을 제거합니다." },
        { label: "join", type: "function", apply: "join()", detail: "합치기", info: "리스트 요소들을 문자열로 결합합니다." },
      ]
    };
  }

  if (word && word.from !== word.to && !context.matchBefore(/['"]/)) {
    return {
      from: word.from,
      options: [
        { label: "data", type: "variable", detail: "기본변수", info: "현재 가공할 데이터가 담긴 변수입니다." },
        { label: "len", type: "function", apply: "len()", detail: "길이구하기", info: "리스트나 문자열의 길이(개수)를 반환합니다." },
        { label: "print", type: "function", apply: "print()", detail: "출력", info: "터미널에 값을 출력해 확인합니다." },
      ]
    };
  }

  return null;
}

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
  const isDemoMode = useGameStore((state) => state.isDemoMode);
  const [code, setCode] = useState(codeDraft ?? "");
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const setCodeRef = useRef(setCode);
  setCodeRef.current = setCode;

  useEffect(() => {
    const fallback = isDemoMode ? (puzzle.starterCode ?? "") : "";
    const initialCode = codeDraft ?? fallback;
    setCode(initialCode);
    setStdout("");
    setStderr("");

    if (!codeDraft && initialCode) {
      saveCodeDraft(puzzle.id, initialCode);
    }
  }, [codeDraft, isDemoMode, puzzle.id, puzzle.starterCode, saveCodeDraft]);

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
            autocompletion({ override: [pythonCustomCompletions] })
          ]}
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: false,
            indentOnInput: true,
          }}
        />
        <div className="lab-actions">
          <button className="primary-button sk-action-btn" disabled={isRunning} onClick={runCode} type="button" title="코드 실행 및 분석 (Run Analysis)">
            {isRunning ? <Loader2 className="spinner" size={20} /> : <Play size={20} />}
          </button>
          {isDemoMode && puzzle.starterCode ? (
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
