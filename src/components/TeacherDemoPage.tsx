import { BookOpen, CheckCircle2, Copy, ExternalLink, Loader2, Users } from "lucide-react";
import { useMemo, useState } from "react";
import {
  estimateMinutesForProblems,
  getTextbookProblems,
  getTextbookProblemsByIds,
  PROBLEM_SET_PRESETS,
} from "../data/textbookProblemBank";
import {
  createClassSession,
  saveLastClassCode,
  type ClassSession,
} from "../lib/classroomApi";

const STUDENT_JOIN_URL = "https://escapethedataroom.vercel.app/#/join";

// 대상/상황 안내 칩 (정보 전달용 고정 라벨)
const CLASS_CONTEXT_TAGS = ["SW/AI 캠프", "비교과 파이썬 기초반", "수업 초반 진단 활동"];

export function TeacherDemoPage(): React.JSX.Element {
  const problems = useMemo(() => getTextbookProblems(), []);
  const allProblemIds = useMemo(() => problems.map((problem) => problem.id), [problems]);

  const [title, setTitle] = useState("파이썬 기초 복습 수업");
  const [selectedProblemIds, setSelectedProblemIds] = useState<string[]>(allProblemIds);
  const [createdSession, setCreatedSession] = useState<ClassSession | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState("");

  const selectedCount = selectedProblemIds.length;
  const estimatedMinutes = useMemo(
    () => estimateMinutesForProblems(getTextbookProblemsByIds(selectedProblemIds)),
    [selectedProblemIds],
  );

  function toggleProblem(problemId: string): void {
    setSelectedProblemIds((current) =>
      current.includes(problemId)
        ? current.filter((id) => id !== problemId)
        : [...current, problemId],
    );
  }

  function applyPreset(problemIds: string[]): void {
    // 프리셋은 selectedProblemIds 만 교체합니다(문제 데이터는 건드리지 않음).
    setSelectedProblemIds(problemIds.filter((id) => allProblemIds.includes(id)));
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
          <span className="classroom-kicker">// 수업 진단 활동 구성</span>
          <h1>교사용 수업 구성</h1>
          <p className="classroom-subtitle">SW/AI 캠프 초반 진단용 파이썬 방탈출 활동</p>
        </div>
        <nav className="classroom-header-actions" aria-label="교사용 화면 이동">
          <a className="classroom-button compact" href="#/dashboard">
            진행 현황 보기
          </a>
          <a className="classroom-button compact" href="#/join">
            학생 입장 화면
          </a>
        </nav>
      </header>

      <p className="classroom-intro">
        교과서형 파이썬 예제 DB에서 수업에 사용할 문제 세트를 선택하면, 학생들이 클래스 코드로 접속해
        방탈출형 복습 활동을 진행합니다. 교사는 진행 상황과 풀이 로그를 통해 어떤 개념을 짧게 보완
        설명할지 판단할 수 있습니다.
      </p>

      {/* 섹션 1. 수업 정보 */}
      <section className="classroom-panel">
        <div className="panel-title-row">
          <div>
            <span className="classroom-kicker">// 1. 수업 정보</span>
            <h2>수업 정보</h2>
          </div>
        </div>

        <label className="classroom-field">
          <span>수업 제목</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.currentTarget.value)}
            placeholder="파이썬 기초 복습 수업"
          />
        </label>

        <div className="info-grid">
          <div className="info-cell">
            <span>대상 / 상황</span>
            <div className="context-chips">
              {CLASS_CONTEXT_TAGS.map((tag) => (
                <em key={tag}>{tag}</em>
              ))}
            </div>
          </div>
          <div className="info-cell">
            <span>예상 소요 시간</span>
            <strong>15~20분</strong>
          </div>
          <div className="info-cell wide">
            <span>활동 목적</span>
            <strong>전체 문법 강의 전, 학생들이 실제로 막히는 개념을 빠르게 확인</strong>
          </div>
        </div>
      </section>

      {/* 섹션 2. 문제 세트 빠른 선택 */}
      <section className="classroom-panel">
        <div className="panel-title-row">
          <div>
            <span className="classroom-kicker">// 2. 문제 세트 빠른 선택</span>
            <h2>문제 세트 빠른 선택</h2>
          </div>
        </div>
        <div className="preset-row">
          {PROBLEM_SET_PRESETS.map((preset) => (
            <button
              className="classroom-button compact"
              key={preset.id}
              onClick={() => applyPreset(preset.problemIds)}
              title={preset.description}
              type="button"
            >
              {preset.label}
            </button>
          ))}
          <button
            className="classroom-button compact"
            onClick={() => applyPreset(allProblemIds)}
            type="button"
          >
            전체 선택
          </button>
          <button
            className="classroom-button compact"
            onClick={() => setSelectedProblemIds([])}
            type="button"
          >
            선택 해제
          </button>
        </div>
      </section>

      {/* 섹션 3. 교과서형 파이썬 예제 DB */}
      <section className="classroom-panel">
        <div className="panel-title-row">
          <div>
            <span className="classroom-kicker">// 3. 교과서형 파이썬 예제 DB</span>
            <h2>교과서형 파이썬 예제 DB</h2>
          </div>
          <BookOpen size={22} />
        </div>
        <p className="classroom-muted">
          단원별 파이썬 기초 예제를 진단 문제로 사용합니다. 선택한 문제가 수업용 문제 세트로 구성됩니다.
        </p>
        <div className="problem-list">
          {problems.map((problem) => {
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
                  <span className="problem-description">
                    {problem.diagnosisTarget ?? problem.description}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </section>

      {/* 섹션 4. 수업 생성 */}
      <section className="classroom-panel teacher-create">
        <div className="panel-title-row">
          <div>
            <span className="classroom-kicker">// 4. 수업 생성</span>
            <h2>수업 생성</h2>
          </div>
        </div>

        <div className="create-summary">
          <div className="info-cell">
            <span>선택된 문제</span>
            <strong>{selectedCount}문제</strong>
          </div>
          <div className="info-cell">
            <span>예상 활동 시간</span>
            <strong>약 {estimatedMinutes}분</strong>
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
        </div>

        {message ? <p className="classroom-message">{message}</p> : null}

        {createdSession ? (
          <div className="generated-session" aria-live="polite">
            <span className="classroom-kicker">// 생성된 클래스 코드</span>
            <div className="class-code-display">{createdSession.classCode}</div>
            <p>학생은 학생 입장 화면에서 아래 6자리 코드를 입력하면 활동에 참여합니다.</p>
            <code>{STUDENT_JOIN_URL}</code>
            <div className="classroom-actions-row">
              <button className="classroom-button" onClick={copyClassCode} type="button">
                <Copy size={16} />
                코드 복사
              </button>
              <a className="classroom-button" href="#/join">
                <Users size={16} />
                학생 입장 화면 열기
              </a>
              <a className="classroom-button primary" href="#/dashboard">
                <ExternalLink size={16} />
                실시간 진행 보기
              </a>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
