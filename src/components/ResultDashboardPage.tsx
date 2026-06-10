import { AlertTriangle, BarChart3, Home, Loader2, RefreshCw, Users } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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

function formatPercent(value: number): string {
  return `${Math.max(0, Math.min(100, value))}%`;
}

// 상태 라벨 → CSS class 용 slug (한글 클래스명 회피)
function statusSlug(status: StudentStatus): string {
  switch (status) {
    case "아직 시작 안 함":
      return "idle";
    case "도움 필요":
      return "help";
    case "순조로움":
      return "good";
    case "완료":
      return "done";
    default:
      return "active";
  }
}

function formatLastActivity(student: StudentProgress): string {
  if (student.minutesSinceLastActivity === null) return "—";
  if (student.minutesSinceLastActivity <= 0) return "방금";
  return `${student.minutesSinceLastActivity}분 전`;
}

export function ResultDashboardPage(): React.JSX.Element {
  const [classCode, setClassCode] = useState(() => getLastClassCode());
  const [analytics, setAnalytics] = useState<ClassAnalytics | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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

  // 최초 진입 시 저장된 코드가 있으면 1회 조회
  const didInitialLoad = useRef(false);
  useEffect(() => {
    if (didInitialLoad.current) return;
    if (classCode.length === 6) {
      didInitialLoad.current = true;
      void loadAnalytics(classCode);
    }
  }, [classCode, loadAnalytics]);

  // 자동 새로고침(polling) — 유효한 코드가 있고 토글이 켜진 동안만
  useEffect(() => {
    if (!autoRefresh) return;
    if (classCode.length !== 6) return;
    const timer = window.setInterval(() => {
      void loadAnalytics(classCode, true);
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [autoRefresh, classCode, loadAnalytics]);

  return (
    <main className="classroom-page dashboard-page">
      <div className="classroom-scanlines" aria-hidden="true" />
      <header className="classroom-header">
        <a className="classroom-link" href="#/">데이터 룸</a>
        <div>
          <span className="classroom-kicker">// 수업 진행 모니터</span>
          <h1>수업 진행 현황</h1>
          <p className="classroom-subtitle">수업 중 개입과 수업 후 보완 설명을 돕는 화면</p>
        </div>
        <nav className="classroom-header-actions" aria-label="대시보드 이동">
          <a className="classroom-button compact" href="#/teacher">
            교사용 화면으로
          </a>
          <a className="classroom-button compact" href="#/join">
            학생 입장 화면
          </a>
        </nav>
      </header>

      <section className="classroom-panel dashboard-query">
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
          <input
            checked={autoRefresh}
            onChange={(event) => setAutoRefresh(event.currentTarget.checked)}
            type="checkbox"
          />
          <span>자동 새로고침 ({POLL_INTERVAL_MS / 1000}초)</span>
        </label>
        {lastUpdated ? (
          <span className="last-updated">갱신 {lastUpdated.toLocaleTimeString("ko-KR")}</span>
        ) : null}
      </section>

      {message ? <p className="classroom-message error">{message}</p> : null}

      {analytics ? (
        <>
          {/* 요약 카드 */}
          <section className="dashboard-summary">
            <div className="summary-cell">
              <span>참여 학생</span>
              <strong>{analytics.studentCount}명</strong>
            </div>
            <div className="summary-cell">
              <span>평균 진행률</span>
              <strong>{analytics.averageProgress}%</strong>
            </div>
            <div className={`summary-cell ${analytics.helpNeededStudents.length > 0 ? "alert" : ""}`}>
              <span>도움 필요 학생</span>
              <strong>{analytics.helpNeededStudents.length}명</strong>
            </div>
            <div className="summary-cell wide">
              <span>가장 어려운 개념</span>
              <strong>{analytics.hardestConcept ?? "—"}</strong>
            </div>
          </section>

          {/* 전체 진행 요약 수치 */}
          <section className="classroom-panel">
            <div className="progress-stat-row">
              <div className="stat-cell">
                <span>참여 학생</span>
                <strong>{analytics.studentCount}</strong>
              </div>
              <div className="stat-cell">
                <span>아직 시작 안 함</span>
                <strong>{analytics.notStartedCount}</strong>
              </div>
              <div className="stat-cell">
                <span>1개 이상 성공</span>
                <strong>{analytics.solvedAnyCount}</strong>
              </div>
              <div className="stat-cell">
                <span>전체 성공률</span>
                <strong>{analytics.overallSuccessRate}%</strong>
              </div>
              <div className="stat-cell">
                <span>전체 실패 시도</span>
                <strong>{analytics.totalFailCount}</strong>
              </div>
              <div className="stat-cell">
                <span>선택 문제</span>
                <strong>{analytics.selectedProblemCount}</strong>
              </div>
            </div>
          </section>

          {!analytics.hasAttempts ? (
            <section className="classroom-panel empty-dashboard">
              <Users size={24} />
              <p>아직 학생 풀이 기록이 없습니다. 학생이 코드로 입장해 문제를 풀면 이곳에 진행 현황이 표시됩니다.</p>
              <code>{STUDENT_JOIN_URL}</code>
            </section>
          ) : null}

          {/* 지금 도와주면 좋은 학생 */}
          {analytics.helpNeededStudents.length > 0 ? (
            <section className="classroom-panel help-panel">
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

          {/* 학생별 진행 현황 */}
          <section className="classroom-panel">
            <div className="panel-title-row">
              <div>
                <span className="classroom-kicker">// 학생별 진행</span>
                <h2>학생별 진행 현황</h2>
              </div>
              <Users size={22} />
            </div>
            {analytics.studentProgress.length === 0 ? (
              <p className="classroom-muted">아직 입장한 학생이 없습니다.</p>
            ) : (
              <div className="student-table" role="table">
                <div className="student-row head" role="row">
                  <span role="columnheader">닉네임</span>
                  <span role="columnheader">진행</span>
                  <span role="columnheader">마지막 활동</span>
                  <span role="columnheader">마지막 시도 문제</span>
                  <span role="columnheader">최근 실패</span>
                  <span role="columnheader">상태</span>
                </div>
                {analytics.studentProgress.map((student) => (
                  <div className="student-row" role="row" key={student.studentId}>
                    <span role="cell" className="student-name">{student.nickname}</span>
                    <span role="cell" className="student-progress">
                      <span className="mini-bar">
                        <span style={{ width: formatPercent(student.progressPercent) }} />
                      </span>
                      <em>
                        {student.solvedCount}/{student.selectedProblemCount}
                      </em>
                    </span>
                    <span role="cell">{formatLastActivity(student)}</span>
                    <span role="cell">{student.lastProblemTitle ?? "—"}</span>
                    <span role="cell">{student.recentFailCount > 0 ? `${student.recentFailCount}회` : "—"}</span>
                    <span role="cell">
                      <em className={`status-badge status-${statusSlug(student.status)}`}>{student.status}</em>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 문제별 성공률/실패율 */}
          <section className="classroom-panel">
            <div className="panel-title-row">
              <div>
                <span className="classroom-kicker">// 문제별 결과</span>
                <h2>문제별 성공률 / 실패</h2>
              </div>
              <BarChart3 size={22} />
            </div>
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
                    <div>
                      <dt>성공률</dt>
                      <dd>{stat.successRate}%</dd>
                    </div>
                    <div>
                      <dt>실패</dt>
                      <dd>{stat.failCount}</dd>
                    </div>
                    <div>
                      <dt>미해결</dt>
                      <dd>{stat.unsolvedStudentCount}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </section>

          {/* 개념별 어려움 + 수업 후 설명 추천 */}
          <section className="dashboard-two-col">
            <div className="classroom-panel">
              <span className="classroom-kicker">// 개념별 어려움</span>
              <h2>개념별 어려움</h2>
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

            <div className="classroom-panel">
              <span className="classroom-kicker">// 수업 후 설명 추천</span>
              <h2>수업 후 보완 설명 추천</h2>
              {analytics.recommendations.length > 0 ? (
                <ul className="recommendation-list">
                  {analytics.recommendations.map((recommendation, index) => (
                    <li key={`${recommendation}-${index}`}>{recommendation}</li>
                  ))}
                </ul>
              ) : (
                <p className="classroom-muted">
                  현재 로그 기준으로 두드러진 취약 개념은 없습니다. 풀이 기록이 더 쌓이면 보완 설명
                  포인트가 명확해집니다.
                </p>
              )}
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
}
