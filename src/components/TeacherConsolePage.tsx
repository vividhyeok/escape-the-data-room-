import {
  Activity,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Copy,
  Eye,
  GraduationCap,
  History,
  Loader2,
  LogOut,
  Plus,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  estimateMinutesForProblems,
  getProblemSets,
  getTextbookProblemsByIds,
  type ProblemSet,
} from "../data/textbookProblemBank";
import {
  createClassSession,
  deleteClassRecord,
  listClassRecords,
  saveLastClassCode,
  type ClassRecordSummary,
  type ClassSession,
} from "../lib/classroomApi";
import { getTeacherAccount, logoutTeacher } from "../lib/teacherAuth";

const STUDENT_JOIN_URL = "https://escapethedataroom.vercel.app/#/join";

type ConsoleTab = "records" | "create";

function formatClassDate(iso: string | null): string {
  if (!iso) return "날짜 정보 없음";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "날짜 정보 없음";
  const day = date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
  const time = date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  return `${day} ${time}`;
}

function openMonitor(classCode: string): void {
  saveLastClassCode(classCode);
  window.location.hash = "#/dashboard";
}

function openReport(classCode: string): void {
  saveLastClassCode(classCode);
  window.location.hash = "#/results";
}

// ───────────────────────── 수업 기록 탭 ─────────────────────────

function ClassRecordList(): React.JSX.Element {
  const [records, setRecords] = useState<ClassRecordSummary[] | null>(null);
  const [loadError, setLoadError] = useState("");
  // 삭제 확인 중인 수업 코드 / 삭제 진행 중인 수업 코드
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [deletingCode, setDeletingCode] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listClassRecords()
      .then((result) => {
        if (!cancelled) setRecords(result);
      })
      .catch((error) => {
        console.warn(error);
        if (!cancelled) {
          setRecords([]);
          setLoadError("수업 목록을 불러오는 중 문제가 발생했습니다.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDelete(classCode: string): Promise<void> {
    setDeletingCode(classCode);
    try {
      await deleteClassRecord(classCode);
      setRecords((prev) => (prev ? prev.filter((r) => r.classCode !== classCode) : prev));
    } catch (error) {
      console.warn(error);
      setLoadError("수업 삭제 중 문제가 발생했습니다.");
    } finally {
      setDeletingCode(null);
      setPendingDelete(null);
    }
  }

  if (records === null) {
    return (
      <div className="edu-loading">
        <Loader2 className="spin" size={20} />
        수업 기록을 불러오는 중…
      </div>
    );
  }

  return (
    <section aria-label="수업 기록 목록">
      <div className="edu-section-head">
        <div>
          <h2>수업 기록</h2>
          <p>지금까지 운영한 수업입니다. 수업을 선택해 진행 현황과 결과 리포트를 다시 확인할 수 있습니다.</p>
        </div>
      </div>

      {loadError ? <p className="edu-form-error">{loadError}</p> : null}

      {records.length === 0 ? (
        <div className="edu-empty">
          <ClipboardList size={28} />
          <strong>아직 운영한 수업이 없습니다</strong>
          <span>"새 수업 만들기"에서 첫 수업을 시작해 보세요.</span>
        </div>
      ) : (
        <ul className="edu-record-list">
          {records.map((record) => {
            const confirming = pendingDelete === record.classCode;
            const isDeleting = deletingCode === record.classCode;
            return (
              <li className="edu-record" key={record.classCode}>
                <div className="edu-record-main">
                  <div className="edu-record-title-row">
                    <strong className="edu-record-title">{record.title}</strong>
                    <span className={`edu-chip ${record.isEnded ? "done" : "live"}`}>
                      {record.isEnded ? "종료됨" : "진행 가능"}
                    </span>
                  </div>
                  <div className="edu-record-meta">
                    <span>{formatClassDate(record.createdAt)}</span>
                    <span className="edu-record-code">코드 {record.classCode}</span>
                    <span>
                      <Users size={13} aria-hidden="true" /> 학생 {record.studentCount}명
                    </span>
                    <span>{record.problemCount}문제</span>
                  </div>
                </div>

                <div className="edu-record-progress">
                  {record.averageProgress !== null ? (
                    <>
                      <div className="edu-mini-bar" aria-hidden="true">
                        <span style={{ width: `${record.averageProgress}%` }} />
                      </div>
                      <span className="edu-mini-bar-label">평균 진행률 {record.averageProgress}%</span>
                    </>
                  ) : (
                    <span className="edu-mini-bar-label muted">진행률은 모니터에서 확인</span>
                  )}
                </div>

                {confirming ? (
                  <div className="edu-record-actions edu-record-confirm">
                    <span className="edu-confirm-text">이 수업 기록을 삭제할까요?</span>
                    <button
                      className="edu-btn danger"
                      disabled={isDeleting}
                      onClick={() => void handleDelete(record.classCode)}
                      type="button"
                    >
                      {isDeleting ? <Loader2 className="spin" size={15} /> : <Trash2 size={15} />}
                      삭제
                    </button>
                    <button
                      className="edu-btn"
                      disabled={isDeleting}
                      onClick={() => setPendingDelete(null)}
                      type="button"
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <div className="edu-record-actions">
                    <button className="edu-btn" onClick={() => openMonitor(record.classCode)} type="button">
                      <Activity size={15} />
                      진행 현황
                    </button>
                    <button className="edu-btn primary" onClick={() => openReport(record.classCode)} type="button">
                      <BarChart3 size={15} />
                      결과 리포트
                    </button>
                    <button
                      className="edu-icon-btn"
                      aria-label="수업 기록 삭제"
                      title="수업 기록 삭제"
                      onClick={() => setPendingDelete(record.classCode)}
                      type="button"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

// ───────────────────────── 새 수업 만들기 탭 ─────────────────────────

function CreateClassPanel({ onCreated }: { onCreated: () => void }): React.JSX.Element {
  const problemSets = useMemo(() => getProblemSets(), []);
  const [detailSet, setDetailSet] = useState<ProblemSet | null>(null);
  const [title, setTitle] = useState("파이썬 기초 복습 수업");
  const [selectedSetId, setSelectedSetId] = useState<string>(problemSets[0]?.id ?? "");
  const [createdSession, setCreatedSession] = useState<ClassSession | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

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
      onCreated();
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
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setMessage(`수업 코드: ${createdSession.classCode}`);
    }
  }

  if (createdSession) {
    return (
      <section className="edu-created" aria-live="polite">
        <div className="edu-created-badge">
          <CheckCircle2 size={18} />
          수업이 만들어졌습니다
        </div>
        <h2>{createdSession.title}</h2>
        <p>학생들에게 아래 6자리 수업 코드를 알려 주세요. 학생은 입장 화면에서 코드와 닉네임만 입력하면 됩니다.</p>

        <div className="edu-code-display" aria-label={`수업 코드 ${createdSession.classCode}`}>
          {createdSession.classCode.split("").map((digit, i) => (
            <span key={i}>{digit}</span>
          ))}
        </div>

        <p className="edu-join-url">
          학생 접속 주소 · <code>{STUDENT_JOIN_URL}</code>
        </p>

        <div className="edu-actions-row">
          <button className="edu-btn" onClick={copyClassCode} type="button">
            <Copy size={15} />
            {copied ? "복사됨!" : "코드 복사"}
          </button>
          <a className="edu-btn" href="#/join">
            <Users size={15} />
            학생 입장 화면
          </a>
          <button className="edu-btn primary" onClick={() => openMonitor(createdSession.classCode)} type="button">
            <Activity size={15} />
            실시간 진행 현황 열기
          </button>
        </div>

        <button
          className="edu-link-btn"
          onClick={() => {
            setCreatedSession(null);
            setMessage("");
          }}
          type="button"
        >
          <Plus size={14} />
          다른 수업 만들기
        </button>
      </section>
    );
  }

  return (
    <section aria-label="새 수업 만들기">
      <div className="edu-section-head">
        <div>
          <h2>새 수업 만들기</h2>
          <p>문제집을 고르고 수업을 만들면 6자리 수업 코드가 발급됩니다. 권장 활동 시간은 15~20분입니다.</p>
        </div>
      </div>

      <div className="edu-create-grid">
        <div className="edu-panel">
          <span className="edu-step">1단계</span>
          <h3>수업 정보</h3>
          <label className="edu-input-group">
            <span>수업 제목</span>
            <input
              onChange={(event) => setTitle(event.currentTarget.value)}
              placeholder="예: 1학년 3반 파이썬 기초 진단"
              value={title}
            />
          </label>
          <p className="edu-field-hint">수업 기록 목록에 이 제목으로 저장됩니다.</p>
        </div>

        <div className="edu-panel">
          <span className="edu-step">2단계</span>
          <h3>문제집 선택</h3>
          <div className="edu-set-list" role="radiogroup" aria-label="문제집 선택">
            {problemSets.map((set) => {
              const selected = set.id === selectedSetId;
              const setProblems = getTextbookProblemsByIds(set.problemIds);
              return (
                <div className={`edu-set-card ${selected ? "selected" : ""}`} key={set.id}>
                  <button
                    aria-checked={selected}
                    className="edu-set-select"
                    onClick={() => setSelectedSetId(set.id)}
                    role="radio"
                    type="button"
                  >
                    <span className="edu-set-radio" aria-hidden="true" />
                    <span className="edu-set-body">
                      <span className="edu-set-title-row">
                        <strong>{set.title}</strong>
                        <em className={`edu-set-tag ${set.source === "textbook" ? "textbook" : "game"}`}>
                          {set.source === "textbook" ? "교과서" : "게임 연동"}
                        </em>
                      </span>
                      <span className="edu-set-desc">{set.description}</span>
                      <span className="edu-set-meta">
                        {setProblems.length}문제 · {set.gradeBand ?? "기초"} · 전체 풀이 약{" "}
                        {estimateMinutesForProblems(setProblems)}분
                      </span>
                    </span>
                  </button>
                  <button className="edu-set-detail-btn" onClick={() => setDetailSet(set)} type="button">
                    <Eye size={14} />
                    문제 자세히 보기
                  </button>
                </div>
              );
            })}

            <p className="edu-set-soon-label">다른 교과서 기반 문제집도 순차적으로 추가됩니다</p>
          </div>
        </div>

        <div className="edu-panel edu-create-summary">
          <span className="edu-step">3단계</span>
          <h3>수업 코드 발급</h3>
          <dl className="edu-summary-list">
            <div>
              <dt>수업 제목</dt>
              <dd>{title.trim() || "파이썬 기초 복습 수업"}</dd>
            </div>
            <div>
              <dt>문제집</dt>
              <dd>{selectedSet?.title ?? "—"}</dd>
            </div>
            <div>
              <dt>구성</dt>
              <dd>{problemCount}문제 · 전체 풀이 약 {estimatedMinutes}분</dd>
            </div>
          </dl>
          <button
            className="edu-btn primary block"
            disabled={isCreating || problemCount === 0}
            onClick={handleCreateClass}
            type="button"
          >
            {isCreating ? <Loader2 className="spin" size={17} /> : <BookOpen size={17} />}
            수업 만들고 코드 발급받기
          </button>
          {message ? <p className="edu-form-error">{message}</p> : null}
        </div>
      </div>

      {detailSet ? (
        <ProblemSetDetailModal set={detailSet} onClose={() => setDetailSet(null)} />
      ) : null}
    </section>
  );
}

// ───────────────────────── 문제 자세히 보기 모달 ─────────────────────────

function ProblemSetDetailModal({ set, onClose }: { set: ProblemSet; onClose: () => void }): React.JSX.Element {
  const problems = useMemo(() => getTextbookProblemsByIds(set.problemIds), [set]);
  const isTextbook = set.source === "textbook";

  return (
    <div className="edu-modal-overlay" onClick={onClose}>
      <div className="edu-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="edu-modal-head">
          <div>
            <span className="edu-modal-kicker">
              {isTextbook ? "교과서 문제집" : "게임 연동 문제집"} · {problems.length}문제
            </span>
            <h2>{set.title}</h2>
            {set.curriculum ? <p className="edu-modal-sub">{set.curriculum}</p> : null}
          </div>
          <button className="edu-icon-btn" onClick={onClose} aria-label="닫기" type="button">
            <X size={18} />
          </button>
        </div>

        <div className="edu-modal-body">
          {isTextbook ? (
            <ol className="edu-detail-list">
              {problems.map((problem, i) => (
                <li className="edu-detail-item" key={problem.id}>
                  <div className="edu-detail-head">
                    <span className="edu-detail-title">{i + 1}. {problem.title}</span>
                    <span className="edu-detail-meta">{problem.unit} · {problem.concept} · 난이도 {problem.difficulty}</span>
                  </div>
                  <p className="edu-detail-desc">{problem.description}</p>
                  {problem.sampleCode ? <pre className="edu-detail-code">{problem.sampleCode}</pre> : null}
                  <div className="edu-detail-io">
                    {problem.sampleInput
                      ? <span>입력 <code>{problem.sampleInput}</code></span>
                      : <span className="muted">입력 없음</span>}
                    <span>출력 <code>{problem.sampleOutput}</code></span>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <ol className="edu-detail-list">
              {problems.map((problem, i) => (
                <li className="edu-detail-item compact" key={problem.id}>
                  <div className="edu-detail-head">
                    <span className="edu-detail-title">{i + 1}. {problem.title}</span>
                    <span className="edu-detail-meta">{problem.unit} · {problem.concept} · 난이도 {problem.difficulty}</span>
                  </div>
                  <p className="edu-detail-desc">{problem.description}</p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── 콘솔 본체 ─────────────────────────

type TeacherConsolePageProps = {
  onLogout: () => void;
};

export function TeacherConsolePage({ onLogout }: TeacherConsolePageProps): React.JSX.Element {
  const [tab, setTab] = useState<ConsoleTab>("records");
  // 수업 생성 직후 기록 탭으로 돌아왔을 때 목록을 새로 읽도록 key 를 올린다.
  const [recordsVersion, setRecordsVersion] = useState(0);
  const account = getTeacherAccount();

  function handleLogout(): void {
    logoutTeacher();
    onLogout();
  }

  return (
    <main className="edu edu-console">
      <header className="edu-topbar">
        <a className="edu-brand" href="#/">
          <span className="edu-logo-mark" aria-hidden="true">
            <GraduationCap size={18} />
          </span>
          <span className="edu-brand-text">
            <strong>코드룸 교사용 콘솔</strong>
            <span>게임 기반 파이썬 진단 도구</span>
          </span>
        </a>

        <nav className="edu-tabs" aria-label="콘솔 메뉴">
          <button
            className={tab === "records" ? "on" : ""}
            onClick={() => setTab("records")}
            type="button"
          >
            <History size={15} />
            수업 기록
          </button>
          <button
            className={tab === "create" ? "on" : ""}
            onClick={() => setTab("create")}
            type="button"
          >
            <Plus size={15} />
            새 수업 만들기
          </button>
        </nav>

        <div className="edu-topbar-right">
          {account ? <span className="edu-teacher-name">{account.displayName}</span> : null}
          <button className="edu-btn subtle" onClick={handleLogout} type="button">
            <LogOut size={15} />
            로그아웃
          </button>
        </div>
      </header>

      <div className="edu-body">
        {tab === "records" ? (
          <ClassRecordList key={recordsVersion} />
        ) : (
          <CreateClassPanel onCreated={() => setRecordsVersion((v) => v + 1)} />
        )}
      </div>
    </main>
  );
}
