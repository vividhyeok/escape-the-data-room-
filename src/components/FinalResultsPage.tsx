import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Compass,
  Lightbulb,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getClassAnalytics,
  getLastClassCode,
  saveLastClassCode,
  type ClassAnalytics,
  type ConceptAttainment,
} from "../lib/classroomApi";

// 정답률 → 색상 등급 (문제/학생 공통)
function rateClass(rate: number): string {
  if (rate >= 80) return "good";
  if (rate >= 50) return "warn";
  return "bad";
}

// 성취 수준 → 시각 스타일/문구 (개념 차트·가이드 공통)
function attainmentFill(a: ConceptAttainment): string {
  return a === "high" ? "high" : a === "mid" ? "mid" : "low";
}

function attainmentLabel(a: ConceptAttainment): string {
  return a === "high" ? "잘 이해함" : a === "mid" ? "추가 연습" : "집중 보완";
}

function attainmentBadgeClass(a: ConceptAttainment): string {
  return `fr-concept-level ${a === "high" ? "good" : a === "mid" ? "mid" : "bad"}`;
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
        <div className="fr-topbar-left">
          <a className="td-back" href="#/teacher">
            <ArrowLeft size={14} /> 수업 목록
          </a>
          <a className="td-back" href="#/dashboard">진행 현황</a>
          <h1>결과 리포트</h1>
          {analytics ? (
            <span className="td-class-title">
              {analytics.classSession.title}
              {!analytics.isLive ? " · 종료된 수업" : ""}
            </span>
          ) : null}
        </div>
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

          {/* ── 다음 수업 가이드 (핵심) ── */}
          <section className="fr-guide">
            <div className="fr-guide-head">
              <Compass size={18} />
              <h2>다음 수업 가이드</h2>
            </div>
            <p className="fr-guide-headline">{analytics.headline}</p>

            {analytics.teachingFocus.length > 0 ? (
              <>
                <div className="fr-guide-subhead">
                  <Lightbulb size={15} />
                  학생들이 어려워한 개념과 다음 수업에서 짚어 줄 점
                </div>
                <div className="fr-focus-list">
                  {analytics.teachingFocus.map((f) => (
                    <article className={`fr-focus-card ${attainmentFill(f.attainment)}`} key={f.concept}>
                      <div className="fr-focus-top">
                        <span className="fr-focus-concept">{f.concept}</span>
                        <span className={`fr-focus-rate ${attainmentFill(f.attainment)}`}>
                          정답률 {f.averageSuccessRate}% · {attainmentLabel(f.attainment)}
                        </span>
                      </div>
                      <p className="fr-focus-reason">{f.reason}</p>
                      <div className="fr-focus-action">
                        <ArrowRight size={15} />
                        <span>{f.action}</span>
                      </div>
                      {f.exampleProblemTitle ? (
                        <span className="fr-focus-example">
                          대표 문제 「{f.exampleProblemTitle}」 · 미해결 {f.unsolvedStudentCount}명
                        </span>
                      ) : null}
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <p className="fr-guide-empty">
                <CheckCircle2 size={16} /> 집중 보완이 필요한 개념이 없습니다. 다음 단원으로 진도를 이어가도 좋습니다.
              </p>
            )}

            {analytics.strongConcepts.length > 0 ? (
              <div className="fr-strong">
                <span className="fr-strong-label">
                  <CheckCircle2 size={14} /> 이미 잘 이해한 개념
                </span>
                <div className="fr-strong-chips">
                  {analytics.strongConcepts.map((c) => (
                    <em key={c}>{c}</em>
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          {/* ── 개념별 성취도 ── */}
          <div className="fr-panel">
            <div className="fr-panel-head">
              <h2><BarChart3 size={16} className="fr-head-icon" />개념별 성취도</h2>
              <span className="fr-panel-note">정답률이 낮을수록 학생들이 더 어려워한 개념입니다</span>
            </div>
            <div className="fr-panel-body">
              {analytics.conceptStats.length > 0 ? (
                <div className="fr-concept-chart">
                  {analytics.conceptStats.map((c) => (
                    <div className="fr-concept-row" key={c.concept}>
                      <div className="fr-concept-label">
                        <span className="fr-concept-name">{c.concept}</span>
                        <span className={attainmentBadgeClass(c.attainment)}>{attainmentLabel(c.attainment)}</span>
                      </div>
                      <div className="fr-concept-bar">
                        <div
                          className={`fr-concept-fill ${attainmentFill(c.attainment)}`}
                          style={{ width: `${Math.max(c.averageSuccessRate, 3)}%` }}
                        />
                      </div>
                      <span className="fr-concept-pct">{c.averageSuccessRate}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="fr-empty-note">아직 데이터가 없습니다.</p>
              )}
            </div>
          </div>

          {/* ── 문제별 분석 ── */}
          <div className="fr-panel">
            <div className="fr-panel-head">
              <h2><BookOpen size={16} className="fr-head-icon" />문제별 분석</h2>
            </div>
            <div className="fr-panel-body fr-panel-body--flush">
              <table className="fr-table">
                <thead>
                  <tr>
                    <th>문제</th>
                    <th>개념</th>
                    <th>정답률</th>
                    <th>실패 시도</th>
                    <th>해결</th>
                    <th>건너뜀</th>
                    <th>미해결</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.problemStats.map((p) => (
                    <tr key={p.puzzleId}>
                      <td className="fr-cell-title">{p.problem.title}</td>
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

          {/* ── 학생별 결과 ── */}
          <div className="fr-panel">
            <div className="fr-panel-head">
              <h2><Users size={16} className="fr-head-icon" />학생별 결과</h2>
            </div>
            <div className="fr-panel-body fr-panel-body--flush">
              <div className="fr-student-row header">
                <span>이름</span>
                <span>진행률</span>
                <span>정답률</span>
                <span>건너뜀</span>
                <span>상태</span>
              </div>
              {analytics.studentProgress.map((s) => (
                <div className="fr-student-row" key={s.studentId}>
                  <span className="fr-student-name">{s.nickname}</span>
                  <span className="fr-student-progress">
                    <div className="fr-mini-bar">
                      <span style={{ width: `${s.progressPercent}%` }} />
                    </div>
                    <div className="td-cells">
                      {s.problemCells.map((c, i) => {
                        const stateLabel =
                          c.state === "solved" ? "해결" :
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
                    <span className="fr-student-frac">
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
