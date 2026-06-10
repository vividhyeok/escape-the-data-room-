import { BarChart3, Home, Loader2, RefreshCw, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  getClassAnalytics,
  getLastClassCode,
  saveLastClassCode,
  type ClassAnalytics,
} from "../lib/classroomApi";

const STUDENT_JOIN_URL = "https://escapethedataroom.vercel.app/#/join";

function formatPercent(value: number): string {
  return `${Math.max(0, Math.min(100, value))}%`;
}

export function ResultDashboardPage(): React.JSX.Element {
  const [classCode, setClassCode] = useState(() => getLastClassCode());
  const [analytics, setAnalytics] = useState<ClassAnalytics | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadAnalytics = useCallback(async (targetCode = classCode): Promise<void> => {
    const normalizedCode = targetCode.replace(/\D/g, "").slice(0, 6);
    setClassCode(normalizedCode);

    if (normalizedCode.length !== 6) {
      setMessage("6자리 수업 코드를 입력해 주세요.");
      setAnalytics(null);
      return;
    }

    setIsLoading(true);
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
    } catch (error) {
      console.warn(error);
      setAnalytics(null);
      setMessage(error instanceof Error ? error.message : "대시보드 데이터를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [classCode]);

  useEffect(() => {
    if (classCode.length === 6) {
      void loadAnalytics(classCode);
    }
  }, [classCode, loadAnalytics]);

  return (
    <main className="classroom-page dashboard-page">
      <div className="classroom-scanlines" aria-hidden="true" />
      <header className="classroom-header">
        <a className="classroom-link" href="#/">데이터 룸</a>
        <div>
          <span className="classroom-kicker">// ANALYTICS DASHBOARD</span>
          <h1>분석 대시보드</h1>
        </div>
        <nav className="classroom-header-actions" aria-label="대시보드 이동">
          <a className="classroom-button compact" href="#/teacher">
            교사용 화면
          </a>
          <a className="classroom-button compact" href="#/join">
            학생 입장
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
          다시 조회
        </button>
        <a className="classroom-button" href="#/">
          <Home size={18} />
          랜딩
        </a>
      </section>

      {message ? <p className="classroom-message error">{message}</p> : null}

      {analytics ? (
        <>
          <section className="dashboard-summary">
            <div className="summary-cell">
              <span>클래스 코드</span>
              <strong>{analytics.classSession.classCode}</strong>
            </div>
            <div className="summary-cell wide">
              <span>수업 제목</span>
              <strong>{analytics.classSession.title}</strong>
            </div>
            <div className="summary-cell">
              <span>참여 학생</span>
              <strong>{analytics.studentCount}</strong>
            </div>
            <div className="summary-cell">
              <span>선택 문제</span>
              <strong>{analytics.selectedProblemCount}</strong>
            </div>
          </section>

          {!analytics.hasAttempts ? (
            <section className="classroom-panel empty-dashboard">
              <Users size={24} />
              <p>아직 학생 풀이 기록이 없습니다. 학생이 게임에서 문제를 풀면 이곳에 결과가 표시됩니다.</p>
              <code>{STUDENT_JOIN_URL}</code>
            </section>
          ) : null}

          <section className="classroom-panel">
            <div className="panel-title-row">
              <div>
                <span className="classroom-kicker">// PROBLEM RESULTS</span>
                <h2>문제별 풀이 로그</h2>
              </div>
              <BarChart3 size={22} />
            </div>
            <div className="analytics-list">
              {analytics.problemStats.map((stat) => (
                <article className="analytics-row" key={stat.problem.id}>
                  <div>
                    <strong>{stat.problem.title}</strong>
                    <span>{stat.problem.unit} · {stat.problem.concept} · {stat.puzzleId}</span>
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
                      <dt>총 시도</dt>
                      <dd>{stat.attemptCount}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </section>

          <section className="dashboard-two-col">
            <div className="classroom-panel">
              <span className="classroom-kicker">// CONCEPT DIFFICULTY</span>
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
              <span className="classroom-kicker">// EXPLANATION POINTS</span>
              <h2>설명 추천</h2>
              {analytics.recommendations.length > 0 ? (
                <ul className="recommendation-list">
                  {analytics.recommendations.map((recommendation, index) => (
                    <li key={`${recommendation}-${index}`}>{recommendation}</li>
                  ))}
                </ul>
              ) : (
                <p className="classroom-muted">
                  현재 로그 기준으로 두드러진 취약 개념은 없습니다. 추가 풀이 기록이 쌓이면 추천 포인트가 더 명확해집니다.
                </p>
              )}
              <a className="classroom-link-block" href="#/join">
                학생 입장 화면: {STUDENT_JOIN_URL}
              </a>
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
}
