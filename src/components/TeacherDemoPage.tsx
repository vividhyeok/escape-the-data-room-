import { BookOpen, CheckCircle2, Copy, ExternalLink, Layers, Loader2, Users } from "lucide-react";
import { useMemo, useState } from "react";
import {
  estimateMinutesForProblems,
  getProblemSets,
  getTextbookProblemsByIds,
  type ProblemSet,
} from "../data/textbookProblemBank";
import {
  createClassSession,
  saveLastClassCode,
  type ClassSession,
} from "../lib/classroomApi";

const STUDENT_JOIN_URL = "https://escapethedataroom.vercel.app/#/join";

const CLASS_CONTEXT_TAGS = ["SW/AI 캠프", "비교과 파이썬 기초반", "수업 초반 진단 활동"];

export function TeacherDemoPage(): React.JSX.Element {
  const problemSets = useMemo(() => getProblemSets(), []);
  const [title, setTitle] = useState("파이썬 기초 복습 수업");
  const [selectedSetId, setSelectedSetId] = useState<string>(problemSets[0]?.id ?? "");
  const [createdSession, setCreatedSession] = useState<ClassSession | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState("");

  const selectedSet: ProblemSet | undefined = useMemo(
    () => problemSets.find((set) => set.id === selectedSetId),
    [problemSets, selectedSetId],
  );

  const selectedProblems = useMemo(
    () => getTextbookProblemsByIds(selectedSet?.problemIds ?? []),
    [selectedSet],
  );
  const problemCount = selectedProblems.length;
  const estimatedMinutes = useMemo(
    () => estimateMinutesForProblems(selectedProblems),
    [selectedProblems],
  );

  async function handleCreateClass(): Promise<void> {
    if (!selectedSet || selectedSet.problemIds.length === 0) {
      setMessage("문제집을 선택해 주세요.");
      return;
    }

    setIsCreating(true);
    setMessage("");

    try {
      const session = await createClassSession({
        title: title.trim() || "파이썬 기초 복습 수업",
        selectedProblemIds: selectedSet.problemIds,
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
    <main className="classroom-page page-enter">
      <div className="classroom-scanlines" aria-hidden="true" />
      <header className="classroom-header">
        <a className="classroom-link" href="#/">데이터 룸</a>
        <div>
          <span className="classroom-kicker">// 수업 진단 활동 구성</span>
          <h1>교사용 수업 구성</h1>
          <p className="classroom-subtitle">SW/AI 캠프 초반 진단용 파이썬 방탈출 활동</p>
        </div>
        <nav className="classroom-header-actions" aria-label="교사용 화면 이동">
          <a className="classroom-button compact" href="#/dashboard">진행 현황 보기</a>
          <a className="classroom-button compact" href="#/join">학생 입장 화면</a>
        </nav>
      </header>

      <p className="classroom-intro page-enter-item" style={{ ["--i" as string]: 0 }}>
        문제집을 선택하면 학생들이 클래스 코드로 접속해 방탈출형 복습 활동을 진행합니다. 교사는 진행 상황과
        풀이 로그를 통해 어떤 개념을 짧게 보완 설명할지 판단할 수 있습니다.
      </p>

      {/* 섹션 1. 수업 정보 */}
      <section className="classroom-panel page-enter-item" style={{ ["--i" as string]: 1 }}>
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
            <span>권장 활동 시간</span>
            <strong>15~20분 (초반 진단)</strong>
          </div>
          <div className="info-cell wide">
            <span>활동 목적</span>
            <strong>전체 문법 강의 전, 학생들이 실제로 막히는 개념을 빠르게 확인</strong>
          </div>
        </div>
      </section>

      {/* 섹션 2. 문제집 선택 */}
      <section className="classroom-panel page-enter-item" style={{ ["--i" as string]: 2 }}>
        <div className="panel-title-row">
          <div>
            <span className="classroom-kicker">// 2. 문제집 선택</span>
            <h2>문제집 선택</h2>
          </div>
          <Layers size={22} />
        </div>
        <p className="classroom-muted">
          수업에 사용할 문제집을 한 개 선택합니다. 선택한 문제집의 문항이 학생들의 방탈출 활동으로 그대로
          제공됩니다.
        </p>

        <div className="set-list">
          {problemSets.map((set) => {
            const selected = set.id === selectedSetId;
            const setProblems = getTextbookProblemsByIds(set.problemIds);
            return (
              <button
                className={`set-card ${selected ? "selected" : ""}`}
                key={set.id}
                onClick={() => setSelectedSetId(set.id)}
                type="button"
                aria-pressed={selected}
              >
                <span className="set-card-check" aria-hidden="true">{selected ? "●" : "○"}</span>
                <span className="set-card-body">
                  <strong>{set.title}</strong>
                  <span className="set-card-desc">{set.description}</span>
                  <span className="set-card-meta">
                    {setProblems.length}문항 · {set.gradeBand ?? "기초"} · 전체 풀이 약{" "}
                    {estimateMinutesForProblems(setProblems)}분
                  </span>
                </span>
              </button>
            );
          })}
          {/* 추가 문제집은 추후 제공 — 현재는 비어 있음 */}
          <div className="set-card empty" aria-disabled="true">
            <span className="set-card-check" aria-hidden="true">＋</span>
            <span className="set-card-body">
              <strong>추가 문제집 준비 중</strong>
              <span className="set-card-desc">단원별·교육과정별 문제집이 이곳에 추가될 예정입니다.</span>
            </span>
          </div>
        </div>

        {selectedSet ? (
          <details className="set-preview">
            <summary>선택한 문제집 미리보기 ({problemCount}문항)</summary>
            <ol className="set-preview-list">
              {selectedProblems.map((problem) => (
                <li key={problem.id}>
                  <span className="preview-title">{problem.title}</span>
                  <span className="preview-meta">
                    {problem.unit} · {problem.concept} · 난이도 {problem.difficulty}
                  </span>
                </li>
              ))}
            </ol>
          </details>
        ) : null}
      </section>

      {/* 섹션 3. 수업 생성 */}
      <section className="classroom-panel teacher-create page-enter-item" style={{ ["--i" as string]: 3 }}>
        <div className="panel-title-row">
          <div>
            <span className="classroom-kicker">// 3. 수업 생성</span>
            <h2>수업 생성</h2>
          </div>
          <BookOpen size={22} />
        </div>

        <div className="create-summary">
          <div className="info-cell">
            <span>선택한 문제집</span>
            <strong>{selectedSet?.title ?? "—"}</strong>
          </div>
          <div className="info-cell">
            <span>문항 수</span>
            <strong>{problemCount}문항 · 전체 풀이 약 {estimatedMinutes}분</strong>
          </div>
          <button
            className="classroom-button primary"
            disabled={isCreating || problemCount === 0}
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
