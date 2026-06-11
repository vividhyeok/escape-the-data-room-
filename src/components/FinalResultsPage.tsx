import { ArrowLeft, BarChart3, BookOpen, Lightbulb, Users } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getClassAnalytics,
  getLastClassCode,
  saveLastClassCode,
  type ClassAnalytics,
  type ConceptAnalytics,
} from "../lib/classroomApi";

function rateClass(rate: number): string {
  if (rate >= 80) return "good";
  if (rate >= 50) return "warn";
  return "bad";
}

function conceptFillClass(level: ConceptAnalytics["level"]): string {
  switch (level) {
    case "낮음": return "high";
    case "보통": return "mid";
    case "높음": return "low";
  }
}

function conceptLevelLabel(level: ConceptAnalytics["level"]): string {
  switch (level) {
    case "낮음": return "양호";
    case "보통": return "보통";
    case "높음": return "보완 필요";
  }
}

function conceptLevelClass(level: ConceptAnalytics["level"]): string {
  switch (level) {
    case "낮음": return "fr-concept-level low";
    case "보통": return "fr-concept-level mid";
    case "높음": return "fr-concept-level high";
  }
}

export function FinalResultsPage(): React.JSX.Element {
  const [classCode, setClassCode] = useState(() => getLastClassCode());
  const [analytics, setAnalytics] = useState<ClassAnalytics | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadAnalytics = useCallback(
    async (targetCode = classCode): Promise<void> => {
      const code = targetCode.replace(/\D/g, "").slice(0, 6);
      setClassCode(code);
      if (code.length !== 6) {
        setMessage("6자리 수업 코드를 입력해 주세요.");
        setAnalytics(null);
        return;
      }
      setIsLoading(true);
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
      } catch (error) {
        console.warn(error);
        setAnalytics(null);
        setMessage(error instanceof Error ? error.message : "데이터를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
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

  return (
    <main className="fr">
      {/* ── 상단 바 ── */}
      <header className="fr-topbar">
        <a className="td-back" href="#/dashboard">
          <ArrowLeft size={14} /> 실시간 모니터
        </a>
        <h1>수업 최종 결과</h1>
        <div className="fr-topbar-right">
          <input
            className="td-code-input"
            inputMode="numeric"
            maxLength={6}
            onChange={(e) => setClassCode(e.currentTarget.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="코드"
            value={classCode}
          />
          <button className="td-btn" disabled={isLoading} onClick={() => void loadAnalytics()} type="button">
            {isLoading ? "불러오는 중…" : "결과 불러오기"}
          </button>
        </div>
      </header>

      {message ? <p className="td-message">{message}</p> : null}

      {analytics ? (
        <div className="fr-body">
          {/* ── 전체 성과 요약 ── */}
          <section className="fr-overview">
            <div className="fr-stat">
              <span className="fr-stat-label">참여 학생</span>
              <span className="fr-stat-value">{analytics.studentCount}</span>
              <span className="fr-stat-sub">명</span>
            </div>
            <div className="fr-stat highlight">
              <span className="fr-stat-label">평균 진행률</span>
              <span className="fr-stat-value">{analytics.averageProgress}%</span>
              <span className="fr-stat-sub">{analytics.selectedProblemCount}문제 기준</span>
            </div>
            <div className="fr-stat success">
              <span className="fr-stat-label">전체 정답률</span>
              <span className="fr-stat-value">{analytics.overallSuccessRate}%</span>
              <span className="fr-stat-sub">시도 대비 정답</span>
            </div>
            <div className={`fr-stat ${analytics.finishedCount === analytics.studentCount ? "success" : "warn"}`}>
              <span className="fr-stat-label">완료 학생</span>
              <span className="fr-stat-value">{analytics.finishedCount}/{analytics.studentCount}</span>
              <span className="fr-stat-sub">{analytics.allFinished ? "전원 완료" : `${analytics.unfinishedStudents.length}명 미완료`}</span>
            </div>
          </section>

          {/* ── 2컬럼: 개념별 성취도 + 추천 ── */}
          <div className="fr-grid">
            {/* 개념별 성취도 차트 */}
            <div className="fr-panel">
              <div className="fr-panel-head">
                <h2><BarChart3 size={16} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />개념별 성취도</h2>
              </div>
              <div className="fr-panel-body">
                {analytics.conceptStats.length > 0 ? (
                  <div className="fr-concept-chart">
                    {analytics.conceptStats.map((c) => (
                      <div className="fr-concept-row" key={c.concept}>
                        <div>
                          <span className="fr-concept-name">{c.concept}</span>
                          <span className={conceptLevelClass(c.level)}>{conceptLevelLabel(c.level)}</span>
                        </div>
                        <div className="fr-concept-bar">
                          <div
                            className={`fr-concept-fill ${conceptFillClass(c.level)}`}
                            style={{ width: `${Math.max(c.averageSuccessRate, 3)}%` }}
                          />
                        </div>
                        <span className="fr-concept-pct">{c.averageSuccessRate}%</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "#9099a5", textAlign: "center", padding: "20px 0" }}>아직 데이터가 없습니다.</p>
                )}
              </div>
            </div>

            {/* AI 보완 추천 */}
            <div className="fr-panel">
              <div className="fr-panel-head">
                <h2><Lightbulb size={16} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />보완 추천</h2>
              </div>
              <div className="fr-panel-body">
                {analytics.recommendations.length > 0 ? (
                  <div className="fr-recs">
                    {analytics.recommendations.map((rec, i) => (
                      <div className="fr-rec" key={i}>
                        <div className="fr-rec-icon">💡</div>
                        <span className="fr-rec-text">{rec}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "#9099a5", textAlign: "center", padding: "20px 0" }}>
                    전반적으로 양호합니다. 특별한 보완 사항이 없습니다.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── 문제별 분석 테이블 ── */}
          <div className="fr-panel">
            <div className="fr-panel-head">
              <h2><BookOpen size={16} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />문제별 분석</h2>
            </div>
            <div className="fr-panel-body" style={{ padding: 0 }}>
              <table className="fr-table">
                <thead>
                  <tr>
                    <th>문제</th>
                    <th>개념</th>
                    <th>성공률</th>
                    <th>실패 시도</th>
                    <th>성공</th>
                    <th>건너뛰기</th>
                    <th>미해결</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.problemStats.map((p) => (
                    <tr key={p.puzzleId}>
                      <td style={{ fontWeight: 600 }}>{p.problem.title}</td>
                      <td>{p.problem.concept}</td>
                      <td>
                        <span className={`fr-rate ${rateClass(p.successRate)}`}>
                          {p.successRate}%
                        </span>
                      </td>
                      <td>{p.failCount}</td>
                      <td>{p.successStudentCount}명</td>
                      <td>{p.skippedStudentCount}명</td>
                      <td>{p.unsolvedStudentCount}명</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── 학생별 최종 결과 ── */}
          <div className="fr-panel">
            <div className="fr-panel-head">
              <h2><Users size={16} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />학생별 최종 결과</h2>
            </div>
            <div className="fr-panel-body" style={{ padding: "0 0 8px" }}>
              <div className="fr-student-row header">
                <span>이름</span>
                <span>진행률</span>
                <span>정답률</span>
                <span>건너뛰기</span>
                <span>상태</span>
              </div>
              {analytics.studentProgress.map((s) => (
                <div className="fr-student-row" key={s.studentId}>
                  <span style={{ fontWeight: 700 }}>{s.nickname}</span>
                  <span>
                    <div className="fr-mini-bar" style={{ marginBottom: 6 }}>
                      <span style={{ width: `${s.progressPercent}%` }} />
                    </div>
                    <div className="td-cells">
                      {s.problemCells.map((c, i) => {
                        const stateLabel =
                          c.state === "solved" ? "정답" :
                          c.state === "skipped" ? "건너뛰기" :
                          c.state === "attempted" ? "시도 중" : "미시작";
                        return (
                          <i
                            className={`td-cell ${c.state}`}
                            key={i}
                            title={`${i + 1}. ${c.title} [${c.concept}] - ${stateLabel}`}
                            style={{ height: 16 }}
                          />
                        );
                      })}
                    </div>
                    <span style={{ fontSize: "0.82rem", color: "#5f6673", marginTop: 4, display: "block" }}>
                      {s.solvedCount}/{s.selectedProblemCount} ({s.progressPercent}%)
                    </span>
                  </span>
                  <span className={`fr-rate ${rateClass(s.attemptCount > 0 ? 100 - s.errorRate : 100)}`}>
                    {s.attemptCount > 0 ? `${100 - s.errorRate}%` : "—"}
                  </span>
                  <span>{s.skippedCount}문제</span>
                  <span>
                    <span className={
                      s.isFinished ? "td-badge td-badge-done"
                      : s.needsHelp ? "td-badge td-badge-bad"
                      : "td-badge td-badge-active"
                    }>
                      {s.status}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
