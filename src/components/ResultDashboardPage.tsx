import { AlertTriangle, CheckCircle, Clock, RefreshCw, Users } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getClassAnalytics,
  getLastClassCode,
  saveLastClassCode,
  type ClassAnalytics,
  type StudentProgress,
  type StudentStatus,
} from "../lib/classroomApi";

// 실시간 모니터 자동 새로고침 간격(ms)
const POLL_INTERVAL_MS = 8000;

type SortKey = "roster" | "behind" | "help";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "help", label: "도움 필요 먼저" },
  { key: "behind", label: "진행 낮은순" },
  { key: "roster", label: "입장순" },
];

function badgeClass(status: StudentStatus): string {
  switch (status) {
    case "아직 시작 안 함": return "td-badge td-badge-idle";
    case "도움 필요": return "td-badge td-badge-bad";
    case "순조로움": return "td-badge td-badge-good";
    case "완료": return "td-badge td-badge-done";
    default: return "td-badge td-badge-active";
  }
}

function lastActivityText(s: StudentProgress, isEnded: boolean): string {
  if (s.minutesSinceLastActivity === null) return "—";
  if (isEnded) {
    // 종료된 수업 기록: 수업 종료 시각 기준의 마지막 활동
    if (s.minutesSinceLastActivity <= 0) return "종료 직전";
    return `종료 ${s.minutesSinceLastActivity}분 전`;
  }
  if (s.minutesSinceLastActivity <= 0) return "방금";
  return `${s.minutesSinceLastActivity}분 전`;
}

const STATUS_ORDER: Record<StudentStatus, number> = {
  "도움 필요": 0,
  "진행 중": 1,
  "순조로움": 2,
  "아직 시작 안 함": 3,
  "완료": 4,
};

function sortStudents(list: StudentProgress[], key: SortKey): StudentProgress[] {
  const arr = [...list];
  if (key === "behind") return arr.sort((a, b) => a.progressPercent - b.progressPercent);
  if (key === "help") {
    return arr.sort(
      (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || a.progressPercent - b.progressPercent,
    );
  }
  return arr; // roster: 입장순 유지
}

export function ResultDashboardPage(): React.JSX.Element {
  const [classCode, setClassCode] = useState(() => getLastClassCode());
  const [analytics, setAnalytics] = useState<ClassAnalytics | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("help");

  const loadAnalytics = useCallback(
    async (targetCode = classCode, silent = false): Promise<void> => {
      const code = targetCode.replace(/\D/g, "").slice(0, 6);
      setClassCode(code);
      if (code.length !== 6) {
        if (!silent) setMessage("6자리 수업 코드를 입력해 주세요.");
        setAnalytics(null);
        return;
      }
      if (!silent) setIsLoading(true);
      setMessage("");
      try {
        const result = await getClassAnalytics(code);
        if (!result) {
          setAnalytics(null);
          setMessage("해당 수업 코드를 찾을 수 없습니다.");
          return;
        }
        saveLastClassCode(code);
        setAnalytics(result);
        setLastUpdated(new Date());
      } catch (error) {
        console.warn(error);
        if (!silent) {
          setAnalytics(null);
          setMessage(error instanceof Error ? error.message : "데이터를 불러오지 못했습니다.");
        }
      } finally {
        if (!silent) setIsLoading(false);
      }
    },
    [classCode],
  );

  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    if (classCode.length === 6) {
      didInit.current = true;
      void loadAnalytics(classCode);
    }
  }, [classCode, loadAnalytics]);

  // 종료된 수업 기록은 더 이상 바뀌지 않으므로 자동 새로고침을 멈춘다.
  const isEnded = analytics !== null && !analytics.isLive;

  useEffect(() => {
    if (!autoRefresh || isEnded || classCode.length !== 6) return;
    const timer = window.setInterval(() => void loadAnalytics(classCode, true), POLL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [autoRefresh, isEnded, classCode, loadAnalytics]);

  // 진행이 늘어난 학생을 잠깐 강조
  const prevSolved = useRef<Map<string, number>>(new Map());
  const [pulsed, setPulsed] = useState<Set<string>>(new Set());
  useEffect(() => {
    if (!analytics) return;
    const next = new Set<string>();
    analytics.studentProgress.forEach((s) => {
      const before = prevSolved.current.get(s.studentId);
      if (before !== undefined && s.solvedCount > before) next.add(s.studentId);
      prevSolved.current.set(s.studentId, s.solvedCount);
    });
    if (next.size > 0) {
      setPulsed(next);
      const t = window.setTimeout(() => setPulsed(new Set()), 1500);
      return () => window.clearTimeout(t);
    }
  }, [analytics]);

  const rows = analytics ? sortStudents(analytics.studentProgress, sortKey) : [];

  return (
    <main className="td">
      {/* ── 상단 바 ── */}
      <header className="td-topbar">
        <div className="td-topbar-left">
          <a className="td-back" href="#/teacher">← 수업 목록</a>
          <h1>진행 현황</h1>
          {isEnded ? (
            <span className="td-ended-chip">종료된 수업</span>
          ) : autoRefresh ? (
            <span className="td-live-dot">실시간</span>
          ) : null}
          {analytics ? <span className="td-class-title">{analytics.classSession.title}</span> : null}
        </div>

        <div className="td-topbar-right">
          <input
            className="td-code-input"
            inputMode="numeric"
            maxLength={6}
            onChange={(e) => setClassCode(e.currentTarget.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="코드"
            value={classCode}
          />
          <button className="td-btn" disabled={isLoading} onClick={() => void loadAnalytics()} type="button">
            <RefreshCw size={14} />
            {isLoading ? "불러오는 중…" : "새로고침"}
          </button>
          {!isEnded ? (
            <label className="td-switch">
              <input checked={autoRefresh} onChange={(e) => setAutoRefresh(e.currentTarget.checked)} type="checkbox" />
              자동
            </label>
          ) : null}
          <a className="td-btn primary" href="#/results">
            결과 리포트 →
          </a>
        </div>
      </header>

      {message ? <p className="td-message">{message}</p> : null}

      {analytics ? (
        <div className="td-body">
          {/* ── 요약 카드 ── */}
          <section className="td-summary">
            <div className="td-card">
              <div className="td-card-icon blue"><Users size={18} /></div>
              <span className="td-card-label">참여 학생</span>
              <span className="td-card-value">{analytics.studentCount}</span>
            </div>
            <div className="td-card warn">
              <div className="td-card-icon red"><AlertTriangle size={18} /></div>
              <span className="td-card-label">도움 필요</span>
              <span className="td-card-value">{analytics.helpNeededStudents.length}</span>
            </div>
            <div className="td-card idle">
              <div className="td-card-icon gray"><Clock size={18} /></div>
              <span className="td-card-label">미시작</span>
              <span className="td-card-value">{analytics.notStartedCount}</span>
            </div>
            <div className="td-card done">
              <div className="td-card-icon green"><CheckCircle size={18} /></div>
              <span className="td-card-label">완료</span>
              <span className="td-card-value">{analytics.finishedCount}</span>
            </div>
          </section>

          {/* ── 평균 진행률 ── */}
          <div className="td-progress-wrap">
            <span className="td-progress-label">반 전체 진행률</span>
            <div className="td-progress-bar">
              <div className="td-progress-fill" style={{ width: `${analytics.averageProgress}%` }} />
            </div>
            <span className="td-progress-pct">{analytics.averageProgress}%</span>
            {isEnded && analytics.endedAt ? (
              <span className="td-progress-updated">
                {new Date(analytics.endedAt).toLocaleString("ko-KR", {
                  month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
                })}{" "}
                종료
              </span>
            ) : lastUpdated ? (
              <span className="td-progress-updated">갱신 {lastUpdated.toLocaleTimeString("ko-KR")}</span>
            ) : null}
          </div>

          {/* ── 도움 필요 알림 ── */}
          {analytics.helpNeededStudents.length > 0 ? (
            <section className="td-help-alert">
              <h2>
                <AlertTriangle size={16} />
                {isEnded
                  ? `수업 중 도움이 필요했던 학생 (${analytics.helpNeededStudents.length}명)`
                  : `지금 도움이 필요한 학생 (${analytics.helpNeededStudents.length}명)`}
              </h2>
              {analytics.helpNeededStudents.map((s) => (
                <div className="td-help-row" key={s.studentId}>
                  <span className="td-help-name">{s.nickname}</span>
                  <span className="td-help-reason">{s.helpReason ?? "도움이 필요할 수 있습니다."}</span>
                  <span className={badgeClass(s.status)}>{s.status}</span>
                </div>
              ))}
            </section>
          ) : null}

          {/* ── 학생별 진행 ── */}
          <section className="td-section">
            <div className="td-section-head">
              <h2>학생별 진행 ({analytics.studentCount}명)</h2>
              <div className="td-seg">
                {SORT_OPTIONS.map((o) => (
                  <button
                    className={sortKey === o.key ? "on" : ""}
                    key={o.key}
                    onClick={() => setSortKey(o.key)}
                    type="button"
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {rows.length === 0 ? (
              <p className="td-empty">아직 입장한 학생이 없습니다. 학생이 코드로 들어오면 여기에 표시됩니다.</p>
            ) : (
              <div className="td-roster">
                {rows.map((s) => (
                  <div className={`td-student ${pulsed.has(s.studentId) ? "pulse" : ""}`} key={s.studentId}>
                    <div className="td-student-info">
                      <span className="td-student-name">{s.nickname}</span>
                      <span className={badgeClass(s.status)}>{s.status}</span>
                    </div>
                    <div className="td-track">
                      <div className="td-cells">
                        {s.problemCells.map((c, i) => {
                          const stateLabel =
                            c.state === "solved" ? "정답" :
                            c.state === "skipped" ? "건너뜀" :
                            c.state === "attempted" ? "시도 중" : "미시작";
                          return (
                            <i
                              className={`td-cell ${c.state}`}
                              key={i}
                              title={`${i + 1}. ${c.title} [${c.concept}] - ${stateLabel}`}
                            />
                          );
                        })}
                      </div>
                      <div className="td-track-meta">
                        <span>{s.progressPercent}% 완료</span>
                        {s.lastProblemTitle ? <span>최근: {s.lastProblemTitle}</span> : null}
                      </div>
                    </div>
                    <div className="td-student-meta">
                      <span className="td-student-frac">{s.solvedCount}/{s.selectedProblemCount}</span>
                      <span className="td-student-time">{lastActivityText(s, isEnded)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="td-legend">
              <span><i className="solved" /> 해결</span>
              <span><i className="skipped" /> 건너뜀</span>
              <span><i className="attempted" /> 시도 중</span>
              <span><i className="untouched" /> 미시작</span>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
