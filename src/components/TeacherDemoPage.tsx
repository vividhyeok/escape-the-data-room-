import { BookOpen, CheckCircle2, Copy, Loader2, Play, TerminalSquare } from "lucide-react";
import { useMemo, useState } from "react";
import { textbookProblemBank } from "../data/textbookProblemBank";
import {
  createClassSession,
  saveLastClassCode,
  type ClassSession,
} from "../lib/classroomApi";

const STUDENT_JOIN_URL = "https://escapethedataroom.vercel.app/#/join";

export function TeacherDemoPage(): React.JSX.Element {
  const defaultSelected = useMemo(() => textbookProblemBank.map((problem) => problem.id), []);
  const [title, setTitle] = useState("파이썬 기초 복습 수업");
  const [selectedProblemIds, setSelectedProblemIds] = useState<string[]>(defaultSelected);
  const [createdSession, setCreatedSession] = useState<ClassSession | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState("");

  const selectedCount = selectedProblemIds.length;

  function toggleProblem(problemId: string): void {
    setSelectedProblemIds((current) =>
      current.includes(problemId)
        ? current.filter((id) => id !== problemId)
        : [...current, problemId],
    );
  }

  async function handleCreateClass(): Promise<void> {
    if (selectedProblemIds.length === 0) {
      setMessage("최소 1개 이상의 문제를 선택해 주세요.");
      return;
    }

    setIsCreating(true);
    setMessage("");

    try {
      const session = await createClassSession({
        title: title.trim() || "파이썬 기초 복습 수업",
        selectedProblemIds,
      });
      saveLastClassCode(session.classCode);
      setCreatedSession(session);
      setMessage("수업 세션이 생성되었습니다.");
    } catch (error) {
      console.warn(error);
      setMessage(error instanceof Error ? error.message : "수업 세션 생성에 실패했습니다.");
    } finally {
      setIsCreating(false);
    }
  }

  async function copyClassCode(): Promise<void> {
    if (!createdSession) return;
    try {
      await navigator.clipboard.writeText(createdSession.classCode);
      setMessage("클래스 코드를 복사했습니다.");
    } catch {
      setMessage(createdSession.classCode);
    }
  }

  return (
    <main className="classroom-page">
      <div className="classroom-scanlines" aria-hidden="true" />
      <header className="classroom-header">
        <a className="classroom-link" href="#/">데이터 룸</a>
        <div>
          <span className="classroom-kicker">// TEACHER CONSOLE</span>
          <h1>교사용 수업 세션 생성</h1>
        </div>
        <nav className="classroom-header-actions" aria-label="교사용 화면 이동">
          <a className="classroom-button compact" href="#/dashboard">
            <TerminalSquare size={16} />
            대시보드
          </a>
          <a className="classroom-button compact" href="#/join">
            <Play size={16} />
            학생 화면
          </a>
        </nav>
      </header>

      <section className="classroom-panel teacher-controls">
        <label className="classroom-field">
          <span>수업 제목</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.currentTarget.value)}
            placeholder="파이썬 기초 복습 수업"
          />
        </label>
        <div className="session-status">
          <span>선택된 문제</span>
          <strong>{selectedCount}</strong>
        </div>
        <button
          className="classroom-button primary"
          disabled={isCreating || selectedCount === 0}
          onClick={handleCreateClass}
          type="button"
        >
          {isCreating ? <Loader2 className="spin" size={18} /> : <CheckCircle2 size={18} />}
          수업 생성
        </button>
      </section>

      {message ? <p className="classroom-message">{message}</p> : null}

      {createdSession ? (
        <section className="classroom-panel generated-session" aria-live="polite">
          <span className="classroom-kicker">CLASS CODE ISSUED</span>
          <div className="class-code-display">{createdSession.classCode}</div>
          <p>
            학생은 같은 도메인에서 학생 입장 화면으로 접속한 뒤, 아래 6자리 코드를 입력하면 됩니다.
          </p>
          <code>{STUDENT_JOIN_URL}</code>
          <div className="classroom-actions-row">
            <button className="classroom-button" onClick={copyClassCode} type="button">
              <Copy size={16} />
              코드 복사
            </button>
            <a className="classroom-button primary" href="#/dashboard">
              분석 대시보드
            </a>
            <a className="classroom-button" href="#/join">
              학생 입장 화면
            </a>
          </div>
        </section>
      ) : null}

      <section className="classroom-panel">
        <div className="panel-title-row">
          <div>
            <span className="classroom-kicker">// STATIC PROBLEM BANK</span>
            <h2>문제 은행</h2>
          </div>
          <BookOpen size={22} />
        </div>
        <p className="classroom-muted">
          현재 시연 버전에서는 정적 문제 은행을 사용합니다. 실제 운영 단계에서는 교과서/단원별 문제 DB로 확장할 수 있습니다.
        </p>
        <div className="problem-list">
          {textbookProblemBank.map((problem) => {
            const checked = selectedProblemIds.includes(problem.id);
            return (
              <label className={`problem-row ${checked ? "selected" : ""}`} key={problem.id}>
                <input
                  checked={checked}
                  onChange={() => toggleProblem(problem.id)}
                  type="checkbox"
                />
                <span className="problem-body">
                  <span className="problem-title">{problem.title}</span>
                  <span className="problem-meta">
                    {problem.unit} · {problem.concept} · 난이도 {problem.difficulty}
                  </span>
                  <span className="problem-description">{problem.description}</span>
                </span>
                <code>{problem.mappedPuzzleId}</code>
              </label>
            );
          })}
        </div>
      </section>
    </main>
  );
}
