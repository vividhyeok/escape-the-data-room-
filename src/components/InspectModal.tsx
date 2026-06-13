import { useState } from "react";
import { BookOpen, CheckCircle2, FastForward, Loader2, RotateCcw } from "lucide-react";
import type { Puzzle, RoomObject } from "../data/types";
import { useGameStore } from "../store/gameStore";
import { GameWindow } from "./GameWindow";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { oneDark } from "@codemirror/theme-one-dark";
import { autocompletion, completionKeymap } from "@codemirror/autocomplete";
import { pythonRunner } from "../lib/pythonRunner";
import { getCurrentStudentSession, recordAttempt, SKIP_MARKER } from "../lib/classroomApi";
import { SoundEngine } from "../utils/SoundEngine";

type InspectModalProps = {
  object: RoomObject;
  puzzle: Puzzle;
  onClose: () => void;
  onOpenLab: (puzzle: Puzzle) => void;
  onOpenHelp: () => void;
  onHintAcquired?: (message: string) => void;
};

// 스킵 버튼이 열리는 실패 횟수(이 만큼 틀리면 건너뛰기 가능)
const SKIP_THRESHOLD = 3;

// 값을 파이썬 리터럴 형태의 문자열로 (리스트/딕셔너리 내부 표시용)
function pyLiteral(value: unknown): string {
  if (typeof value === "string") return `'${value}'`;
  if (typeof value === "boolean") return value ? "True" : "False";
  if (value === null) return "None";
  if (Array.isArray(value)) return `[${value.map(pyLiteral).join(", ")}]`;
  if (typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => `'${k}': ${pyLiteral(v)}`)
      .join(", ")}}`;
  }
  return String(value);
}

// print() 로 출력했을 때 화면에 보이는 형태 (문자열은 따옴표 없이)
function printedForm(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "boolean") return value ? "True" : "False";
  if (value === null) return "None";
  if (Array.isArray(value)) return `[${value.map(pyLiteral).join(", ")}]`;
  if (typeof value === "object") return pyLiteral(value);
  return String(value);
}

// 테스트 케이스의 입력 코드("data = 5")에서 값("5")만 추출 — 변수명은 숨긴다
function inputValue(inputCode: string): string {
  return inputCode.replace(/^\s*data\s*=\s*/, "").trim();
}

const SYNTAX_LABELS: Record<string, string> = {
  Assign: "변수 대입 ( = )",
  BinOp: "사칙연산 ( +, -, *, / )",
  Subscript: "인덱싱 / 딕셔너리 접근 [ ]",
  Slice: "슬라이싱 [ : ]",
  For: "for 반복문",
  While: "while 반복문",
  If: "if / else 조건문",
  ListComp: "리스트 컴프리헨션",
  FunctionDef: "함수 정의 ( def )",
  Return: "return 문",
  upper: ".upper() 대문자 변환",
  lower: ".lower() 소문자 변환",
  replace: ".replace() 문자 치환",
  split: ".split() 문자열 분리",
  strip: ".strip() 공백 제거",
  join: ".join() 이어 붙이기",
  append: ".append() 항목 추가",
  len: "len() 길이 구하기",
  sum: "sum() 합계 함수",
  print: "print() 출력 함수",
  filter: "filter() 필터 함수",
  max: "max() 최댓값 함수",
};

export function InspectModal({
  object,
  puzzle,
  onClose,
  onOpenHelp,
  onHintAcquired,
}: InspectModalProps): React.JSX.Element {
  const codeDrafts = useGameStore((state) => state.codeDrafts);
  const saveCodeDraft = useGameStore((state) => state.saveCodeDraft);
  const solvePuzzle = useGameStore((state) => state.solvePuzzle);
  const recordPuzzleFail = useGameStore((state) => state.recordPuzzleFail);
  const skipPuzzle = useGameStore((state) => state.skipPuzzle);
  const solvedPuzzleIds = useGameStore((state) => state.solvedPuzzleIds);
  const skippedPuzzleIds = useGameStore((state) => state.skippedPuzzleIds);
  const isDemoMode = useGameStore((state) => state.isDemoMode);
  const failCount = useGameStore((state) => state.puzzleFailCounts[puzzle.id] ?? 0);

  const isSolved = solvedPuzzleIds.includes(puzzle.id);
  const isSkipped = skippedPuzzleIds.includes(puzzle.id);
  const skipAvailable = !isSolved && failCount >= SKIP_THRESHOLD;

  const [code, setCode] = useState(() => codeDrafts[puzzle.id] ?? puzzle.starterCode ?? "");
  const [isShaking, setIsShaking] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 교사용 데이터 저장 (#/play 에서 학생 세션이 있을 때만)
  function logAttempt(success: boolean, errorMessage: string, attemptCode: string): void {
    if (window.location.hash !== "#/play") return;
    const session = getCurrentStudentSession();
    if (!session) return;
    void recordAttempt({
      classCode: session.classCode,
      studentId: session.studentId,
      nickname: session.nickname,
      puzzleId: puzzle.id,
      success,
      errorMessage,
      code: attemptCode,
    }).catch((error) => console.warn("attempt log 저장 실패", error));
  }

  async function handleVerify(): Promise<void> {
    if (isChecking) return;
    setIsChecking(true);
    setErrorMsg("");

    const result = await pythonRunner.run(code, {
      testCases: puzzle.testCases,
      requiredSyntax: puzzle.requiredSyntax,
      bannedSyntax: puzzle.bannedSyntax,
    });

    setIsChecking(false);
    logAttempt(result.success, result.stderr || "", code);

    if (result.success) {
      SoundEngine.playSuccess();
      solvePuzzle(puzzle);
      window.dispatchEvent(new CustomEvent("puzzle-solved-vfx"));
      onHintAcquired?.("코드 조각 획득! 잠금이 해제되었습니다.");
    } else {
      SoundEngine.playError();
      recordPuzzleFail(puzzle.id);
      setErrorMsg(result.stderr || "실패: 조건을 만족하지 못했습니다.");
      setIsShaking(true);
      window.setTimeout(() => setIsShaking(false), 360);
    }
  }

  function handleSkip(): void {
    if (isSolved) return;
    skipPuzzle(puzzle);
    SoundEngine.playGlitch();
    window.dispatchEvent(new CustomEvent("puzzle-solved-vfx"));
    // 스킵은 완료로 집계하되, 마커로 '직접 풀지 않음'을 구분할 수 있게 기록
    logAttempt(true, SKIP_MARKER, code);
    onHintAcquired?.("문제를 건너뛰고 코드 조각을 받았습니다.");
  }

  function resetToStarter(): void {
    const starter = puzzle.starterCode ?? "";
    setCode(starter);
    saveCodeDraft(puzzle.id, starter);
    setErrorMsg("");
  }

  const statusLabel = isSolved ? (isSkipped ? "⚑ 건너뜀" : "✓ 해결됨") : "○ 미해결";
  const statusClass = isSolved ? (isSkipped ? "badge-skipped" : "badge-solved") : "badge-locked";

  return (
    <GameWindow id={`inspect-${puzzle.id}`} type="inspect" eyebrow="//SYS.INSPECT" title={object.title} onClose={onClose}>
      <div className={`inspect-modal code-focus ${isShaking ? "shake" : ""}`}>
        <div className="inspect-layout">
          {/* 문제 설명 + 데이터 (그래픽 없음) */}
          <div className="inspect-brief">
            <div className="brief-head">
              <span className="inspect-kicker">{puzzle.title}</span>
              <span className={`solved-badge ${statusClass}`}>{statusLabel}</span>
            </div>

            <p className="situation-text">{puzzle.situationText}</p>

            {(puzzle.requiredSyntax?.length || puzzle.bannedSyntax?.length) ? (
              <div className="syntax-rules">
                {puzzle.requiredSyntax && puzzle.requiredSyntax.length > 0 && (
                  <div className="rule-line">
                    <span className="rule-tag use">반드시 사용</span>
                    <span>{puzzle.requiredSyntax.map((s) => SYNTAX_LABELS[s] ?? s).join(" · ")}</span>
                  </div>
                )}
                {puzzle.bannedSyntax && puzzle.bannedSyntax.length > 0 && (
                  <div className="rule-line">
                    <span className="rule-tag ban">사용 금지</span>
                    <span className="ban-text">{puzzle.bannedSyntax.map((s) => SYNTAX_LABELS[s] ?? s).join(" · ")}</span>
                  </div>
                )}
              </div>
            ) : null}

            <div className="io-examples">
              <div className="io-head">
                <span className="io-col">입력</span>
                <span className="io-col">출력</span>
              </div>
              {(puzzle.testCases ?? []).slice(0, 3).map((tc, index) => (
                <div className="io-row" key={index}>
                  <code className="io-in">{inputValue(tc.inputCode)}</code>
                  <span className="io-arrow">→</span>
                  <code className="io-out">{printedForm(tc.expectedOutput)}</code>
                </div>
              ))}
              <p className="io-note">
                왼쪽 <b>입력</b>이 <b>input()</b> 으로 주어집니다. 오른쪽 <b>출력</b>이 나오도록
                <b>print()</b> 로 출력하면 자동 채점됩니다.
              </p>
            </div>
          </div>

          {/* 코드 작성 영역 (크게) */}
          <div className="inspect-editor-col">
            <div className="editor-col-head">
              <span className="inspect-kicker">/ PYTHON</span>
              {isDemoMode ? <span className="editor-demo-badge">시연: 정답 미리 입력됨</span> : null}
            </div>
            <div
              className="editor-container big-editor"
              onKeyDownCapture={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                  e.preventDefault();
                  void handleVerify();
                }
              }}
            >
              <CodeMirror
                value={code}
                onChange={(val) => {
                  setCode(val);
                  saveCodeDraft(puzzle.id, val);
                }}
                extensions={[python(), keymap.of([indentWithTab, ...completionKeymap]), autocompletion({ activateOnTyping: true })]}
                theme={oneDark}
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: false,
                  dropCursor: false,
                  allowMultipleSelections: false,
                  indentOnInput: true,
                  bracketMatching: true,
                  closeBrackets: true,
                  highlightActiveLine: true,
                }}
                style={{ flex: 1, fontSize: "16px", height: "100%" }}
              />
            </div>

            {errorMsg ? (
              <div className="inspect-error-panel">
                <span className="inspect-error-label">⚠ 결과</span>
                <pre className="inspect-error-body">{errorMsg}</pre>
              </div>
            ) : null}

            <div className="editor-actions">
              <button className="primary-button run-btn" onClick={handleVerify} type="button" disabled={isChecking}>
                {isChecking ? <Loader2 size={18} className="spin" /> : <CheckCircle2 size={18} />}
                <span>{isChecking ? "실행 중…" : "코드 실행 / 검증 (Ctrl+Enter)"}</span>
              </button>

              <div className="editor-subactions">
                <button className="ghost-button" onClick={onOpenHelp} type="button" title="파이썬 레퍼런스 보기">
                  <BookOpen size={16} /> 레퍼런스
                </button>
                <button className="ghost-button" onClick={resetToStarter} type="button" title="처음 상태로 초기화">
                  <RotateCcw size={16} /> 초기화
                </button>
              </div>

              {/* 스킵: 일정 횟수 이상 실패하면 활성화 */}
              {!isSolved ? (
                skipAvailable ? (
                  <button className="skip-button active" onClick={handleSkip} type="button">
                    <FastForward size={16} /> 이 문제 건너뛰기 (조각 획득)
                  </button>
                ) : (
                  <p className="skip-hint">
                    {failCount > 0
                      ? `${SKIP_THRESHOLD - failCount}번 더 시도하면 '건너뛰기'가 열립니다.`
                      : "막히면 여러 번 시도해 보세요. 계속 막히면 건너뛰기가 열립니다."}
                  </p>
                )
              ) : isSkipped ? (
                <p className="skip-hint done">이 문제는 건너뛰어 조각을 받았습니다.</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </GameWindow>
  );
}
