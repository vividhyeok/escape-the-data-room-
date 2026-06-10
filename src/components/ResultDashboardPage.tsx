import { AlertTriangle, BarChart3, Home, Loader2, Lock, RefreshCw, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getClassAnalytics,
  getLastClassCode,
  saveLastClassCode,
  type ClassAnalytics,
  type StudentProgress,
  type StudentStatus,
} from "../lib/classroomApi";

const STUDENT_JOIN_URL = "https://escapethedataroom.vercel.app/#/join";

// 수업 중 모니터링용 자동 새로고침 간격(ms). WebSocket/Realtime 없이 단순 polling 입니다.
const POLL_INTERVAL_MS = 8000;

type SortKey = "progress-desc" | "progress-asc" | "error-desc" | "error-asc";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "progress-desc", label: "진행 빠른순" },
  { key: "progress-asc", label: "진행 느린순" },
  { key: "error-desc", label: "오답률 높은순" },
  { key: "error-asc", label: "오답률 낮은순" },
];

function formatPercent(value: number): string {
  return `${Math.max(0, Math.min(100, value))}%`;
}

function statusSlug(status: StudentStatus): string {
  switch (status) {
    case "아직 시작 안 함": return "idle";
    case "도움 필요": return "help";
    case "순조로움": return "good";
    case "완료": return "done";
    default: return "active";
  }
}

function formatLastActivity(student: StudentProgress): string {
  if (student.minutesSinceLastActivity === null) return "—";
  if (student.minutesSinceLastActivity <= 0) return "방금";
  return `${student.minutesSinceLastActivity}분 전`;
}

function sortStudents(students: StudentProgress[], key: SortKey): StudentProgress[] {
  const list = [...students];
  switch (key) {
    case "progress-desc":
      return list.sort((a, b) => b.progressPercent - a.progressPercent || a.errorRate - b.errorRate);
    case "progress-asc":
      return list.sort((a, b) => a.progressPercent - b.progressPercent || b.errorRate - a.errorRate);
    case "error-desc":
      return list.sort((a, b) => b.errorRate - a.errorRate || a.progressPercent - b.progressPercent);
    case "error-asc":
      return list.sort((a, b) => a.errorRate - b.errorRate || b.progressPercent - a.progressPercent);
    default:
      return list;
  }
}

export function ResultDashboardPage(): React.JSX.Element {
  const [classCode, setClassCode] = useState(() => getLastClassCode());
  const [analytics, setAnalytics] = useState<ClassAnalytics | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("progress-desc");
  const [forceShowResults, setForceShowResults] = useState(false);

  const loadAnalytics = useCallback(
    async (targetCode = classCode, silent = false): Promise<void> => {
      const normalizedCode = targetCode.replace(/\D/g, "").slice(0, 6);
      setClassCode(normalizedCode);

      if (normalizedCode.length !== 6) {
        setMessage("6자리 수업 코드를 입력해 주세요.");
        setAnalytics(null);
        return;
      }

      if (!silent) setIsLoading(true);
      setMessage("");

      try {
        const result = await getClassAnalytics(normalizedCode);
        if (!result) {
          setAnalytics(null);
          setMessage("해당 수업 코드를 찾을 수 없습니다.");
          return;
        }
        saveLastClassCode(normalizedCode);
        setAnalytics(result);
        setLastUpdated(new Date());
      } catch (error) {
        console.warn(error);
        if (!silent) {
          setAnalytics(null);
          setMessage(error instanceof Error ? error.message : "대시보드 데이터를 불러오지 못했습니다.");
        }
      } finally {
        if (!silent) setIsLoading(false);
      }
    },
    [classCode],
  );

  const didInitialLoad = useRef(false);
  useEffect(() => {
    if (didInitialLoad.current) return;
    if (classCode.length === 6) {
      didInitialLoad.current = true;
      void loadAnalytics(classCode);
    }
  }, [classCode, loadAnalytics]);

  useEffect(() => {
    if (!autoRefresh) return;
    if (classCode.length !== 6) return;
    const timer = window.setInterval(() => {
      void loadAnalytics(classCode, true);
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [autoRefresh, classCode, loadAnalytics]);

  const sortedStudents = useMemo(
    () => (analytics ? sortStudents(analytics.studentProgress, sortKey) : []),
    [analytics, sortKey],
  );

  const resultsUnlocked = Boolean(analytics && (analytics.allFinished || forceShowResults));

  return (
    <main className="classroom-page dashboard-page page-enter">
      <div className="classroom-scanlines" aria-hidden="true" />
      <header className="classroom-header">
        <a className="classroom-link" href="#/">데이터 룸</a>
        <div>
          <span className="classroom-kicker">// 수업 진행 모니터</span>
          <h1>수업 진행 현황</h1>
          <p className="classroom-subtitle">수업 중 개입과 수업 후 보완 설명을 돕는 화면</p>
        </div>
        <nav className="classroom-header-actions" aria-label="대시보드 이동">
          <a className="classroom-button compact" href="#/teacher">교사용 화면으로</a>
          <a className="classroom-button compact" href="#/join">학생 입장 화면</a>
        </nav>
      </header>

      <section className="classroom-panel dashboard-query page-enter-item" style={{ ["--i" as string]: 0 }}>
        <label className="classroom-field inline">
          <span>클래스 코드</span>
          <input
            inputMode="numeric"
            maxLength={6}
            onChange={(event) => setClassCode(event.currentTarget.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            value={classCode}
          />
        </label>
        <button className="classroom-button primary" disabled={isLoading} onClick={() => void loadAnalytics()} type="button">
          {isLoading ? <Loader2 className="spin" size={18} /> : <RefreshCw size={18} />}
          새로고침
        </button>
        <label className="auto-refresh-toggle">
          <input checked={autoRefresh} onChange={(event) => setAutoRefresh(event.currentTarget.checked)} type="checkbox" />
          <span>자동 새로고침 ({POLL_INTERVAL_MS / 1000}초)</span>
        </label>
        {lastUpdated ? <span className="last-updated">갱신 {lastUpdated.toLocaleTimeString("ko-KR")}</span> : null}
      </section>

      {message ? <p className="classroom-message error">{message}</p> : null}

      {analytics ? (
        <>
          {/* 요약 카드 (간결하게) */}
          <section className="dashboard-summary slim page-enter-item" style={{ ["--i" as string]: 1 }}>
            <div className="summary-cell">
              <span>참여 학생</span>
              <strong>{analytics.studentCount}명</strong>
            </div>
            <div className="summary-cell">
              <span>평균 진행률</span>
              <strong>{analytics.averageProgress}%</strong>
            </div>
            <div className="summary-cell">
              <span>완료</span>
              <strong>{analytics.finishedCount}/{analytics.studentCount}</strong>
            </div>
            <div className={`summary-cell ${analytics.helpNeededStudents.length > 0 ? "alert" : ""}`}>
              <span>도움 필요</span>
              <strong>{analytics.helpNeededStudents.length}명</strong>
            </div>
          </section>

          {/* 지금 도와주면 좋은 학생 */}
          {analytics.helpNeededStudents.length > 0 ? (
            <section className="classroom-panel help-panel page-enter-item" style={{ ["--i" as string]: 2 }}>
              <div className="panel-title-row">
                <div>
                  <span className="classroom-kicker">// 개입 추천</span>
                  <h2>지금 도와주면 좋은 학생</h2>
                </div>
                <AlertTriangle size={22} color="#ffb454" />
              </div>
              <ul className="help-list">
                {analytics.helpNeededStudents.map((student) => (
                  <li key={student.studentId}>
                    <strong>{student.nickname}</strong>
                    <span>{student.helpReason ?? "도움이 필요할 수 있습니다."}</span>
                    <em className={`status-badge status-${statusSlug(student.status)}`}>{student.status}</em>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* 실시간 진행 현황 — 학생별 가로 트래킹 테이블 (핵심) */}
          <section className="classroom-panel page-enter-item" style={{ ["--i" as string]: 3 }}>
            <div className="panel-title-row">
              <div>
                <span className="classroom-kicker">// 실시간 진행 현황</span>
                <h2>학생별 진행 트래킹</h2>
              </div>
              <Users size={22} />
            </div>

            <div className="track-toolbar">
              <div className="sort-group" role="group" aria-label="정렬 기준">
                {SORT_OPTIONS.map((option) => (
                  <button
                    className={`sort-chip ${sortKey === option.key ? "active" : ""}`}
                    key={option.key}
                    onClick={() => setSortKey(option.key)}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="track-legend" aria-hidden="true">
                <span><i className="cell-dot solved" /> 해결</span>
                <span><i className="cell-dot attempted" /> 시도</span>
                <span><i className="cell-dot untouched" /> 미시작</span>
              </div>
            </div>

            {sortedStudents.length === 0 ? (
              <p className="classroom-muted">아직 입장한 학생이 없습니다.</p>
            ) : (
              <div className="track-table">
                {sortedStudents.map((student) => (
                  <div className="track-row" key={student.studentId}>
                    <div className="track-name">
                      <strong>{student.nickname}</strong>
                      <em className={`status-badge status-${statusSlug(student.status)}`}>{student.status}</em>
                    </div>
                    <div className="track-cells" aria-label={`${student.solvedCount}/${student.selectedProblemCount} 해결`}>
                      {student.problemCells.map((cell, idx) => (
                        <i className={`track-cell ${cell}`} key={idx} />
                      ))}
                    </div>
                    <div className="track-stats">
                      <span className="track-progress">{student.solvedCount}/{student.selectedProblemCount}</span>
                      <span className="track-error">오답률 {student.errorRate}%</span>
                      <span className="track-time">{formatLastActivity(student)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 수업 결과 분석 — 전원 마무리 후 활성화 */}
          <section className="classroom-panel page-enter-item" style={{ ["--i" as string]: 4 }}>
            <div className="panel-title-row">
              <div>
                <span className="classroom-kicker">// 수업 결과 분석</span>
                <h2>수업 결과 분석</h2>
              </div>
              {resultsUnlocked ? <BarChart3 size={22} /> : <Lock size={22} color="#8fa6b0" />}
            </div>

            {!resultsUnlocked ? (
              <div className="results-locked">
                {analytics.studentCount === 0 ? (
                  <p>아직 입장한 학생이 없습니다. 학생이 코드로 입장하면 진행 현황이 표시됩니다.</p>
                ) : (
                  <>
                    <p className="locked-line">
                      <strong>{analytics.unfinishedStudents.map((s) => s.nickname).join(", ")}</strong>{" "}
                      학생이 아직 마무리하지 않았습니다.
                    </p>
                    <p className="classroom-muted">
                      해당 학생들이 문제집을 모두 마치면 결과 보기가 자동으로 활성화됩니다.
                      ({analytics.finishedCount}/{analytics.studentCount} 완료)
                    </p>
                  </>
                )}
                <div className="classroom-actions-row">
                  <button className="classroom-button" disabled type="button">
                    <Lock size={16} /> 결과 보기 (대기 중)
                  </button>
                  {analytics.studentCount > 0 ? (
                    <button className="classroom-button subtle" onClick={() => setForceShowResults(true)} type="button">
                      그래도 지금 결과 보기
                    </button>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="results-body">
                {!analytics.allFinished ? (
                  <p className="classroom-message">
                    아직 전원이 마무리하지 않았지만, 현재까지의 풀이 로그를 기준으로 결과를 표시합니다.
                  </p>
                ) : null}

                {/* 문제별 성공률/실패 */}
                <h3 className="results-subtitle">문제별 성공률 / 실패</h3>
                <div className="analytics-list">
                  {analytics.problemStats.map((stat) => (
                    <article className="analytics-row" key={stat.problem.id}>
                      <div>
                        <strong>{stat.problem.title}</strong>
                        <span>{stat.problem.unit} · {stat.problem.concept} · 난이도 {stat.problem.difficulty}</span>
                      </div>
                      <div className="bar-meter" aria-label={`${stat.successRate}% 성공률`}>
                        <span style={{ width: formatPercent(stat.successRate) }} />
                      </div>
                      <dl>
                        <div><dt>성공률</dt><dd>{stat.successRate}%</dd></div>
                        <div><dt>실패</dt><dd>{stat.failCount}</dd></div>
                        <div><dt>미해결</dt><dd>{stat.unsolvedStudentCount}</dd></div>
                      </dl>
                    </article>
                  ))}
                </div>

                <div className="dashboard-two-col results-two-col">
                  <div className="results-col">
                    <span className="classroom-kicker">// 개념별 어려움</span>
                    <div className="concept-list">
                      {analytics.conceptStats.map((concept) => (
                        <div className={`concept-row level-${concept.level}`} key={concept.concept}>
                          <strong>{concept.concept}</strong>
                          <span>성공률 {concept.averageSuccessRate}% · 실패 {concept.failCount}회</span>
                          <em>어려움 {concept.level}</em>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="results-col">
                    <span className="classroom-kicker">// 수업 후 설명 추천</span>
                    {analytics.recommendations.length > 0 ? (
                      <ul className="recommendation-list">
                        {analytics.recommendations.map((recommendation, index) => (
                          <li key={`${recommendation}-${index}`}>{recommendation}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="classroom-muted">
                        현재 로그 기준으로 두드러진 취약 개념은 없습니다.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>

          {!analytics.hasAttempts ? (
            <section className="classroom-panel empty-dashboard page-enter-item" style={{ ["--i" as string]: 5 }}>
              <Users size={24} />
              <p>아직 학생 풀이 기록이 없습니다. 학생이 코드로 입장해 문제를 풀면 이곳에 진행이 표시됩니다.</p>
              <code>{STUDENT_JOIN_URL}</code>
            </section>
          ) : null}
        </>
      ) : null}
    </main>
  );
}
