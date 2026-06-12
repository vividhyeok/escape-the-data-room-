import {
  getDemoClassRecord,
  getDemoClassRecords,
  isDemoClassCode,
  SKIP_MARKER,
} from "../data/demoClassroom";
import {
  getTextbookProblemByPuzzleId,
  getTextbookProblems,
  getTextbookProblemsByIds,
  type TextbookProblem,
} from "../data/textbookProblemBank";
import { getSupabaseClient, isSupabaseConfigured } from "./supabaseClient";

// 수업 중 "활동 없음"으로 간주하는 기준 시간(분).
// 실제 수업에서는 진행 속도에 따라 조정할 수 있는 값입니다.
const STALE_ACTIVITY_MINUTES = 5;

// 학생이 문제를 직접 풀지 않고 '건너뛰기'로 완료했을 때 attempt 로그에 남기는 마커.
// success=true 로 기록(=게임 진행/완료에는 포함)하되, 이 마커로 '직접 풀이'와 구분한다.
// (원천 정의는 demoClassroom — 데모 데이터와 동일한 값을 쓰기 위해 재노출한다.)
export { SKIP_MARKER };

export const CURRENT_STUDENT_SESSION_KEY = "etdr.currentStudentSession";
export const LAST_CLASS_CODE_KEY = "etdr.lastClassCode";

export type ClassSession = {
  id: string;
  classCode: string;
  title: string;
  selectedProblemIds: string[];
  createdAt?: string;
};

export type StudentSession = {
  studentId: string;
  classCode: string;
  nickname: string;
};

export type AttemptLogInput = {
  classCode: string;
  studentId: string;
  nickname: string;
  puzzleId: string;
  success: boolean;
  errorMessage?: string;
  code?: string;
};

export type AttemptLog = {
  id: string;
  classCode: string;
  studentId: string | null;
  nickname: string | null;
  puzzleId: string;
  success: boolean;
  errorMessage: string | null;
  code: string | null;
  createdAt?: string;
};

export type ProblemAnalytics = {
  problem: TextbookProblem;
  puzzleId: string;
  attemptCount: number;
  failCount: number;
  successStudentCount: number; // 직접 풀어 성공한 학생 수 (스킵 제외)
  skippedStudentCount: number; // 건너뛰기로 통과한 학생 수
  unsolvedStudentCount: number;
  successRate: number; // 직접 풀이 기준 성공률
};

export type ConceptAnalytics = {
  concept: string;
  averageSuccessRate: number;
  failCount: number;
  level: "낮음" | "보통" | "높음";
};

// 수업 중 교사가 한눈에 읽는 학생 상태 라벨
export type StudentStatus =
  | "아직 시작 안 함"
  | "진행 중"
  | "순조로움"
  | "도움 필요"
  | "완료";

// 학생별 가로 진행 트래킹용 — 선택 문제 순서대로 각 문제의 상태
export type ProblemCellData = {
  puzzleId: string;
  title: string;
  concept: string;
  state: "solved" | "skipped" | "attempted" | "untouched";
};

export type StudentProgress = {
  studentId: string;
  nickname: string;
  solvedCount: number;
  selectedProblemCount: number;
  progressPercent: number;
  attemptCount: number;
  failCount: number; // 전체 실패 시도 수
  errorRate: number; // 오답률(%) = 실패 시도 / 전체 시도
  skippedCount: number; // 건너뛴 문제 수
  recentFailCount: number; // 마지막으로 시도한 문제에서 연속 실패한 횟수
  lastActivityAt: string | null;
  minutesSinceLastActivity: number | null;
  lastProblemTitle: string | null;
  lastProblemConcept: string | null;
  problemCells: ProblemCellData[]; // 선택 문제 순서대로의 진행 상태 및 문제 정보
  isFinished: boolean; // 선택 문제를 모두 해결했는지
  status: StudentStatus;
  needsHelp: boolean;
  helpReason: string | null;
};

// 교사 콘솔 "수업 기록" 목록에 보여줄 요약 정보
export type ClassRecordSummary = {
  classCode: string;
  title: string;
  createdAt: string | null;
  studentCount: number;
  problemCount: number;
  /** 평균 진행률(%) — 빠르게 계산 가능한 경우에만 채운다 */
  averageProgress: number | null;
  /** 이미 종료된(기록만 남은) 수업인지 */
  isEnded: boolean;
  endedAt: string | null;
};

export type ClassAnalytics = {
  classSession: ClassSession;
  /** 종료된 수업 기록이면 false — 실시간 모니터에서 자동 새로고침을 끈다 */
  isLive: boolean;
  /** 종료된 수업의 종료 시각 (마지막 활동 경과 시간의 기준) */
  endedAt: string | null;
  students: StudentSession[];
  attemptLogs: AttemptLog[];
  studentCount: number;
  selectedProblemCount: number;
  // 전체 진행 요약
  notStartedCount: number; // 아직 풀이 시도가 없는 학생 수
  solvedAnyCount: number; // 1개 이상 성공한 학생 수
  averageProgress: number; // 평균 진행률(%)
  overallSuccessRate: number; // 전체 시도 대비 성공 시도 비율(%)
  totalFailCount: number; // 전체 실패 시도 수
  // 결과 보기 게이팅
  finishedCount: number; // 문제집을 모두 마친 학생 수
  unfinishedStudents: StudentProgress[]; // 아직 마무리하지 않은 학생(미시작 포함)
  allFinished: boolean; // 참여 학생이 1명 이상이고 전원 마무리했는지
  // 세부 분석
  studentProgress: StudentProgress[];
  helpNeededStudents: StudentProgress[];
  problemStats: ProblemAnalytics[];
  conceptStats: ConceptAnalytics[];
  hardestConcept: string | null;
  hardestProblem: ProblemAnalytics | null;
  recommendations: string[];
  hasAttempts: boolean;
};

type ClassSessionRow = {
  id: string;
  class_code: string;
  title: string;
  selected_problem_ids: string[] | null;
  created_at?: string;
};

type StudentSessionRow = {
  id: string;
  class_code: string;
  nickname: string;
  created_at?: string;
};

type AttemptLogRow = {
  id: string;
  class_code: string;
  student_id: string | null;
  nickname: string | null;
  puzzle_id: string;
  success: boolean;
  error_message: string | null;
  code: string | null;
  created_at?: string;
};

function normalizeClassCode(classCode: string): string {
  return classCode.replace(/\D/g, "").slice(0, 6);
}

function toClassSession(row: ClassSessionRow): ClassSession {
  return {
    id: row.id,
    classCode: row.class_code,
    title: row.title,
    selectedProblemIds: row.selected_problem_ids ?? [],
    createdAt: row.created_at,
  };
}

function toStudentSession(row: StudentSessionRow): StudentSession {
  return {
    studentId: row.id,
    classCode: row.class_code,
    nickname: row.nickname,
  };
}

function toAttemptLog(row: AttemptLogRow): AttemptLog {
  return {
    id: row.id,
    classCode: row.class_code,
    studentId: row.student_id,
    nickname: row.nickname,
    puzzleId: row.puzzle_id,
    success: row.success,
    errorMessage: row.error_message,
    code: row.code,
    createdAt: row.created_at,
  };
}

function getStoredValue(key: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}

function setStoredValue(key: string, value: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, value);
}

function removeStoredValue(key: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
}

export function generateClassCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function createClassSession(input: {
  title: string;
  selectedProblemIds: string[];
}): Promise<ClassSession> {
  const client = getSupabaseClient();
  let lastError: unknown = null;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const classCode = generateClassCode();
    const { data, error } = await client
      .from("class_sessions")
      .insert({
        class_code: classCode,
        title: input.title.trim() || "파이썬 기초 복습 수업",
        selected_problem_ids: input.selectedProblemIds,
      })
      .select("id,class_code,title,selected_problem_ids,created_at")
      .single<ClassSessionRow>();

    if (!error && data) {
      return toClassSession(data);
    }

    lastError = error;
    if (error && error.code !== "23505") {
      break;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("수업 세션 생성에 실패했습니다.");
}

export async function getClassSessionByCode(classCode: string): Promise<ClassSession | null> {
  const client = getSupabaseClient();
  const normalizedCode = normalizeClassCode(classCode);

  const { data, error } = await client
    .from("class_sessions")
    .select("id,class_code,title,selected_problem_ids,created_at")
    .eq("class_code", normalizedCode)
    .maybeSingle<ClassSessionRow>();

  if (error) {
    throw error;
  }

  return data ? toClassSession(data) : null;
}

export async function joinClassSession(classCode: string, nickname: string): Promise<StudentSession> {
  const normalizedCode = normalizeClassCode(classCode);
  const cleanNickname = nickname.trim();

  // 종료된 지난 수업(기록 보관용)에는 새로 입장할 수 없다.
  if (isDemoClassCode(normalizedCode)) {
    throw new Error("이미 종료된 수업 코드입니다. 선생님께 새 수업 코드를 받아 주세요.");
  }

  const classSession = await getClassSessionByCode(normalizedCode);

  if (!classSession) {
    throw new Error("해당 수업 코드를 찾을 수 없습니다.");
  }

  const client = getSupabaseClient();
  const { data, error } = await client
    .from("student_sessions")
    .insert({
      class_code: normalizedCode,
      nickname: cleanNickname,
    })
    .select("id,class_code,nickname,created_at")
    .single<StudentSessionRow>();

  if (error || !data) {
    throw error ?? new Error("학생 세션 생성에 실패했습니다.");
  }

  return toStudentSession(data);
}

export function saveCurrentStudentSession(session: StudentSession): void {
  setStoredValue(CURRENT_STUDENT_SESSION_KEY, JSON.stringify(session));
}

export function getCurrentStudentSession(): StudentSession | null {
  const raw = getStoredValue(CURRENT_STUDENT_SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<StudentSession>;
    if (!parsed.studentId || !parsed.classCode || !parsed.nickname) {
      return null;
    }

    return {
      studentId: parsed.studentId,
      classCode: parsed.classCode,
      nickname: parsed.nickname,
    };
  } catch {
    return null;
  }
}

export function clearCurrentStudentSession(): void {
  removeStoredValue(CURRENT_STUDENT_SESSION_KEY);
}

export function saveLastClassCode(classCode: string): void {
  setStoredValue(LAST_CLASS_CODE_KEY, normalizeClassCode(classCode));
}

export function getLastClassCode(): string {
  return getStoredValue(LAST_CLASS_CODE_KEY) ?? "";
}

export async function recordAttempt(input: AttemptLogInput): Promise<void> {
  const client = getSupabaseClient();
  const { error } = await client.from("attempt_logs").insert({
    class_code: normalizeClassCode(input.classCode),
    student_id: input.studentId,
    nickname: input.nickname,
    puzzle_id: input.puzzleId,
    success: input.success,
    error_message: input.errorMessage ?? "",
    code: input.code ?? "",
  });

  if (error) {
    throw error;
  }
}

function getAttemptStudentKey(log: AttemptLog): string {
  return log.studentId || log.nickname || log.id;
}

function minutesSince(isoString: string | null, nowMs: number): number | null {
  if (!isoString) return null;
  const then = new Date(isoString).getTime();
  if (Number.isNaN(then)) return null;
  return Math.max(0, Math.round((nowMs - then) / 60000));
}

// 학생별 진행 상태를 계산합니다.
// - student_sessions 를 기준으로 학생 목록을 만들고
// - 각 학생의 attempt_logs 를 묶어 성공한 문제 수, 마지막 활동, 연속 실패 등을 계산합니다.
function buildStudentProgress(
  students: StudentSession[],
  attemptLogs: AttemptLog[],
  selectedProblems: TextbookProblem[],
  nowMs: number,
): StudentProgress[] {
  const selectedPuzzleIds = new Set(selectedProblems.map((p) => p.mappedPuzzleId));
  const selectedProblemCount = selectedProblems.length;

  return students.map((student) => {
    // 시간순으로 정렬된 이 학생의 시도 로그
    const logs = attemptLogs
      .filter((log) => getAttemptStudentKey(log) === student.studentId)
      .slice()
      .sort((a, b) => (a.createdAt ?? "").localeCompare(b.createdAt ?? ""));

    const attemptCount = logs.length;
    const failCount = logs.filter((log) => !log.success).length;
    const errorRate = attemptCount > 0 ? Math.round((failCount / attemptCount) * 100) : 0;
    const skippedCount = new Set(
      logs
        .filter((log) => log.success && (log.errorMessage ?? "").includes(SKIP_MARKER) && selectedPuzzleIds.has(log.puzzleId))
        .map((log) => log.puzzleId),
    ).size;

    // 선택된 문제 중 성공한 고유 퍼즐 수
    const solvedPuzzleIds = new Set(
      logs
        .filter((log) => log.success && selectedPuzzleIds.has(log.puzzleId))
        .map((log) => log.puzzleId),
    );
    // 시도는 했지만 아직 못 푼 퍼즐
    const attemptedPuzzleIds = new Set(
      logs.filter((log) => selectedPuzzleIds.has(log.puzzleId)).map((log) => log.puzzleId),
    );
    // 건너뛴 문제
    const skippedPuzzleIds = new Set(
      logs
        .filter((log) => log.success && (log.errorMessage ?? "").includes(SKIP_MARKER) && selectedPuzzleIds.has(log.puzzleId))
        .map((log) => log.puzzleId),
    );
    
    const solvedCount = solvedPuzzleIds.size;
    const progressPercent =
      selectedProblemCount > 0 ? Math.round((solvedCount / selectedProblemCount) * 100) : 0;

    // 선택 문제 순서대로의 셀 상태(가로 트래킹용)
    const problemCells: ProblemCellData[] = selectedProblems.map((problem) => {
      let state: ProblemCellData["state"] = "untouched";
      if (solvedPuzzleIds.has(problem.mappedPuzzleId)) {
        state = skippedPuzzleIds.has(problem.mappedPuzzleId) ? "skipped" : "solved";
      } else if (attemptedPuzzleIds.has(problem.mappedPuzzleId)) {
        state = "attempted";
      }
      return {
        puzzleId: problem.mappedPuzzleId,
        title: problem.title,
        concept: problem.concept,
        state,
      };
    });

    const isFinished = selectedProblemCount > 0 && solvedCount >= selectedProblemCount;

    const lastLog = logs[logs.length - 1] ?? null;
    const lastActivityAt = lastLog?.createdAt ?? null;
    const minutesSinceLastActivity = minutesSince(lastActivityAt, nowMs);
    const lastProblem = lastLog ? getTextbookProblemByPuzzleId(lastLog.puzzleId) : undefined;
    const lastProblemTitle = lastProblem?.title ?? null;
    const lastProblemConcept = lastProblem?.concept ?? null;

    // 마지막으로 시도한 문제에서의 연속 실패 횟수
    let recentFailCount = 0;
    if (lastLog && !lastLog.success) {
      for (let i = logs.length - 1; i >= 0; i -= 1) {
        const log = logs[i];
        if (log.puzzleId !== lastLog.puzzleId) break;
        if (log.success) break;
        recentFailCount += 1;
      }
    }

    const isStale =
      minutesSinceLastActivity !== null && minutesSinceLastActivity >= STALE_ACTIVITY_MINUTES;

    // 상태 라벨 판단 (위에서부터 우선순위)
    let status: StudentStatus;
    let helpReason: string | null = null;

    if (attemptCount === 0) {
      status = "아직 시작 안 함";
      helpReason = "입장 후 아직 풀이 시도가 없습니다.";
    } else if (isFinished) {
      status = "완료";
    } else if (recentFailCount >= 2) {
      status = "도움 필요";
      helpReason = `${lastProblemConcept ?? lastProblemTitle ?? "최근"} 문제에서 ${recentFailCount}회 연속 실패`;
    } else if (isStale && progressPercent < 50) {
      status = "도움 필요";
      helpReason = `${lastProblemTitle ?? "마지막 문제"} 시도 후 ${minutesSinceLastActivity}분간 활동이 없습니다.`;
    } else if (progressPercent >= 70) {
      status = "순조로움";
    } else {
      status = "진행 중";
    }

    const needsHelp = status === "도움 필요" || status === "아직 시작 안 함";

    return {
      studentId: student.studentId,
      nickname: student.nickname,
      solvedCount,
      selectedProblemCount,
      progressPercent,
      attemptCount,
      failCount,
      errorRate,
      skippedCount,
      recentFailCount,
      lastActivityAt,
      minutesSinceLastActivity,
      lastProblemTitle,
      lastProblemConcept,
      problemCells,
      isFinished,
      status,
      needsHelp,
      helpReason,
    };
  });
}

function buildRecommendations(problemStats: ProblemAnalytics[]): string[] {
  const weakProblems = problemStats
    .filter((stat) => stat.attemptCount > 0 && (stat.successRate < 80 || stat.failCount > 2))
    .sort((a, b) => {
      if (a.successRate !== b.successRate) return a.successRate - b.successRate;
      return b.failCount - a.failCount;
    })
    .slice(0, 3);

  return weakProblems.map((stat) => {
    const { problem } = stat;
    if (problem.concept === "for") {
      return "반복문 문제에서 실패 시도가 많습니다. 누적 변수 초기화와 for문의 실행 순서를 다시 설명하는 것이 좋습니다.";
    }
    if (problem.concept === "인덱싱") {
      return "문자열 인덱싱 문제의 성공률이 낮습니다. 인덱스가 0부터 시작한다는 점을 짚어 주세요.";
    }
    if (problem.concept === "if/else") {
      return "조건문 문제에서 오답이 많습니다. if/else 분기 구조와 비교 연산자 사용을 다시 확인해 주세요.";
    }
    if (problem.concept === "필터링") {
      return "리스트 필터링 문제에서 조건식과 append 위치를 헷갈릴 수 있습니다. 조건에 맞는 값만 새 리스트에 넣는 흐름을 다시 보여 주세요.";
    }
    return `${problem.concept} 개념에서 보완이 필요합니다. "${problem.title}" 풀이 과정을 짧게 다시 설명하는 것이 좋습니다.`;
  });
}

type AnalyticsContext = {
  classSession: ClassSession;
  students: StudentSession[];
  attemptLogs: AttemptLog[];
  isLive: boolean;
  endedAt: string | null;
  /** "마지막 활동 n분 전" 계산의 기준 시각 — 종료된 수업은 종료 시각으로 고정 */
  nowMs: number;
};

function computeClassAnalytics(context: AnalyticsContext): ClassAnalytics {
  const { classSession, students, attemptLogs, isLive, endedAt, nowMs } = context;
  const attemptStudentCount = new Set(attemptLogs.map(getAttemptStudentKey)).size;
  const studentCount = Math.max(students.length, attemptStudentCount);

  let selectedProblems = getTextbookProblemsByIds(classSession.selectedProblemIds);
  // 구버전 세션(과거 문제 id) 또는 매핑되지 않는 id가 저장된 경우 대비:
  // 하나도 해석되지 않으면 기본 문제집(전체 문항)으로 폴백해 트래킹이 0/0에 멈추지 않게 한다.
  if (selectedProblems.length === 0) {
    selectedProblems = getTextbookProblems();
  }

  const problemStats: ProblemAnalytics[] = selectedProblems.map((problem) => {
    const logsForPuzzle = attemptLogs.filter((log) => log.puzzleId === problem.mappedPuzzleId);
    // 직접 풀어 성공(스킵 제외)
    const genuineStudents = new Set(
      logsForPuzzle
        .filter((log) => log.success && !(log.errorMessage ?? "").includes(SKIP_MARKER))
        .map(getAttemptStudentKey),
    );
    // 건너뛰기로 통과 (직접 성공한 적이 없는 학생만 집계)
    const skippedStudents = new Set(
      logsForPuzzle
        .filter((log) => log.success && (log.errorMessage ?? "").includes(SKIP_MARKER))
        .map(getAttemptStudentKey),
    );
    skippedStudents.forEach((id) => {
      if (genuineStudents.has(id)) skippedStudents.delete(id);
    });

    const successStudentCount = genuineStudents.size;
    const skippedStudentCount = skippedStudents.size;
    const passedCount = successStudentCount + skippedStudentCount;
    const successRate = studentCount > 0 ? Math.round((successStudentCount / studentCount) * 100) : 0;

    return {
      problem,
      puzzleId: problem.mappedPuzzleId,
      attemptCount: logsForPuzzle.length,
      failCount: logsForPuzzle.filter((log) => !log.success).length,
      successStudentCount,
      skippedStudentCount,
      unsolvedStudentCount: Math.max(0, studentCount - passedCount),
      successRate,
    };
  });

  const conceptStats = Object.values(
    problemStats.reduce<Record<string, { concept: string; rates: number[]; failCount: number }>>((acc, stat) => {
      const current = acc[stat.problem.concept] ?? {
        concept: stat.problem.concept,
        rates: [],
        failCount: 0,
      };
      current.rates.push(stat.successRate);
      current.failCount += stat.failCount;
      acc[stat.problem.concept] = current;
      return acc;
    }, {}),
  ).map((concept) => {
    const averageSuccessRate = concept.rates.length
      ? Math.round(concept.rates.reduce((sum, rate) => sum + rate, 0) / concept.rates.length)
      : 0;
    const level: ConceptAnalytics["level"] =
      averageSuccessRate >= 80 && concept.failCount <= 2
        ? "낮음"
        : averageSuccessRate >= 50
          ? "보통"
          : "높음";

    return {
      concept: concept.concept,
      averageSuccessRate,
      failCount: concept.failCount,
      level,
    };
  });

  const studentProgress = buildStudentProgress(students, attemptLogs, selectedProblems, nowMs);

  const notStartedCount = studentProgress.filter((s) => s.attemptCount === 0).length;
  const solvedAnyCount = studentProgress.filter((s) => s.solvedCount > 0).length;
  const averageProgress = studentProgress.length
    ? Math.round(
        studentProgress.reduce((sum, s) => sum + s.progressPercent, 0) / studentProgress.length,
      )
    : 0;
  const totalFailCount = attemptLogs.filter((log) => !log.success).length;
  const overallSuccessRate = attemptLogs.length
    ? Math.round((attemptLogs.filter((log) => log.success).length / attemptLogs.length) * 100)
    : 0;

  const helpNeededStudents = studentProgress.filter((s) => s.needsHelp);

  // 결과 보기 게이팅: 참여 학생이 1명 이상이고 전원이 문제집을 마쳐야 결과가 열린다.
  const finishedCount = studentProgress.filter((s) => s.isFinished).length;
  const unfinishedStudents = studentProgress.filter((s) => !s.isFinished);
  const allFinished = studentProgress.length > 0 && unfinishedStudents.length === 0;

  // 가장 어려운 개념 = 평균 성공률이 가장 낮은(어려움이 가장 높은) 개념
  const hardestConcept = [...conceptStats]
    .filter((c) => c.failCount > 0 || c.averageSuccessRate < 100)
    .sort((a, b) => a.averageSuccessRate - b.averageSuccessRate || b.failCount - a.failCount)[0]?.concept ?? null;

  // 가장 어려운 문제 = 성공률이 낮고 실패가 많은 문제
  const hardestProblem = [...problemStats]
    .filter((p) => p.attemptCount > 0)
    .sort((a, b) => a.successRate - b.successRate || b.failCount - a.failCount)[0] ?? null;

  return {
    classSession,
    isLive,
    endedAt,
    students,
    attemptLogs,
    studentCount,
    selectedProblemCount: selectedProblems.length,
    notStartedCount,
    solvedAnyCount,
    averageProgress,
    overallSuccessRate,
    totalFailCount,
    finishedCount,
    unfinishedStudents,
    allFinished,
    studentProgress,
    helpNeededStudents,
    problemStats,
    conceptStats,
    hardestConcept,
    hardestProblem,
    recommendations: buildRecommendations(problemStats),
    hasAttempts: attemptLogs.length > 0,
  };
}

export async function getClassAnalytics(classCode: string): Promise<ClassAnalytics | null> {
  const normalizedCode = normalizeClassCode(classCode);

  // 종료된 지난 수업(데모 기록)은 로컬 데이터에서 즉시 계산한다.
  // "마지막 활동" 경과 시간은 수업 종료 시각 기준으로 고정되어, 언제 열어 봐도 같은 기록이 보인다.
  const demoRecord = getDemoClassRecord(normalizedCode);
  if (demoRecord) {
    return computeClassAnalytics({
      classSession: demoRecord.session,
      students: demoRecord.students,
      attemptLogs: demoRecord.attemptLogs,
      isLive: false,
      endedAt: demoRecord.endedAt,
      nowMs: new Date(demoRecord.endedAt).getTime(),
    });
  }

  const classSession = await getClassSessionByCode(normalizedCode);

  if (!classSession) {
    return null;
  }

  const client = getSupabaseClient();

  const [{ data: studentRows, error: studentError }, { data: attemptRows, error: attemptError }] =
    await Promise.all([
      client
        .from("student_sessions")
        .select("id,class_code,nickname,created_at")
        .eq("class_code", normalizedCode)
        .order("created_at", { ascending: true })
        .returns<StudentSessionRow[]>(),
      client
        .from("attempt_logs")
        .select("id,class_code,student_id,nickname,puzzle_id,success,error_message,code,created_at")
        .eq("class_code", normalizedCode)
        .order("created_at", { ascending: true })
        .returns<AttemptLogRow[]>(),
    ]);

  if (studentError) throw studentError;
  if (attemptError) throw attemptError;

  return computeClassAnalytics({
    classSession,
    students: (studentRows ?? []).map(toStudentSession),
    attemptLogs: (attemptRows ?? []).map(toAttemptLog),
    isLive: true,
    endedAt: null,
    nowMs: Date.now(),
  });
}

// ───────────────────────── 교사 콘솔: 수업 기록 목록 ─────────────────────────

function buildDemoSummaries(): ClassRecordSummary[] {
  return getDemoClassRecords().map((record) => {
    const problemCount = record.session.selectedProblemIds.length;
    const solvedByStudent = new Map<string, Set<string>>();
    record.students.forEach((s) => solvedByStudent.set(s.studentId, new Set()));
    record.attemptLogs.forEach((log) => {
      if (log.success && log.studentId) {
        solvedByStudent.get(log.studentId)?.add(log.puzzleId);
      }
    });
    const progressSum = [...solvedByStudent.values()].reduce(
      (sum, set) => sum + (problemCount > 0 ? set.size / problemCount : 0),
      0,
    );
    const averageProgress =
      record.students.length > 0 ? Math.round((progressSum / record.students.length) * 100) : 0;

    return {
      classCode: record.session.classCode,
      title: record.session.title,
      createdAt: record.session.createdAt ?? null,
      studentCount: record.students.length,
      problemCount,
      averageProgress,
      isEnded: true,
      endedAt: record.endedAt,
    };
  });
}

/**
 * 교사 콘솔의 "수업 기록" 목록.
 * 종료된 데모 수업 기록 + 이 도구로 새로 만든 실제 수업(Supabase)을 최신순으로 합쳐 돌려준다.
 * Supabase 가 설정되지 않은 환경(로컬 시연 등)에서는 데모 기록만 반환한다.
 */
export async function listClassRecords(): Promise<ClassRecordSummary[]> {
  const summaries: ClassRecordSummary[] = [...buildDemoSummaries()];

  if (isSupabaseConfigured) {
    try {
      const client = getSupabaseClient();
      const [{ data: sessionRows, error: sessionError }, { data: studentRows }] = await Promise.all([
        client
          .from("class_sessions")
          .select("id,class_code,title,selected_problem_ids,created_at")
          .order("created_at", { ascending: false })
          .limit(40)
          .returns<ClassSessionRow[]>(),
        client
          .from("student_sessions")
          .select("class_code")
          .returns<{ class_code: string }[]>(),
      ]);

      if (!sessionError && sessionRows) {
        const studentCountByCode = new Map<string, number>();
        (studentRows ?? []).forEach((row) => {
          studentCountByCode.set(row.class_code, (studentCountByCode.get(row.class_code) ?? 0) + 1);
        });

        sessionRows.forEach((row) => {
          if (isDemoClassCode(row.class_code)) return; // 코드 충돌 시 데모 기록 우선
          summaries.push({
            classCode: row.class_code,
            title: row.title,
            createdAt: row.created_at ?? null,
            studentCount: studentCountByCode.get(row.class_code) ?? 0,
            problemCount: row.selected_problem_ids?.length ?? 0,
            averageProgress: null,
            isEnded: false,
            endedAt: null,
          });
        });
      }
    } catch (error) {
      // 네트워크/설정 문제로 실제 수업 목록을 못 불러와도 데모 기록은 보여준다.
      console.warn("수업 목록을 불러오지 못했습니다.", error);
    }
  }

  return summaries.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
}
