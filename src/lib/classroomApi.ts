import {
  getDemoClassRecord,
  getDemoClassRecords,
  isDemoClassCode,
  SKIP_MARKER,
} from "../data/demoClassroom";
import {
  getProblemSetIdForProblemIds,
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
// 교사가 수업 기록 목록에서 삭제(숨김)한 수업 코드 목록.
// 데모 수업은 코드 자체가 정적이라 진짜 삭제가 불가능하므로 여기에 기록해 목록에서 가린다.
// (브라우저 데이터 초기화 시 데모 기록은 다시 복원된다 — 논문/시연용 데이터 보존)
export const DELETED_CLASS_CODES_KEY = "etdr.deletedClassCodes";

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
  /** 이 수업이 사용하는 문제집 세트 id (게임이 어떤 문제를 띄울지 결정) */
  problemSetId?: string;
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

// 개념별 성취 수준 — 학생들이 이 개념을 얼마나 이해했는지를 정답률로 직접 분류한다.
//  high: 잘 이해함 / mid: 추가 연습 권장 / low: 집중 보완 필요
export type ConceptAttainment = "high" | "mid" | "low";

export type ConceptAnalytics = {
  concept: string;
  averageSuccessRate: number;
  failCount: number;
  problemCount: number; // 이 개념을 다루는 문제 수
  attainment: ConceptAttainment;
};

// 다음 수업 설계를 돕는 "집중 보완 개념" — 어려워한 개념 + 왜 + 무엇을 다시 설명할지
export type TeachingFocus = {
  concept: string;
  averageSuccessRate: number;
  attainment: ConceptAttainment;
  failCount: number;
  unsolvedStudentCount: number; // 이 개념의 대표 문제를 끝내 못 푼 학생 수
  reason: string; // 학생들이 주로 어디서 막혔는지(흔한 오개념)
  action: string; // 다음 수업에서 짚어 줄 구체적 행동
  exampleProblemTitle: string | null; // 대표(가장 어려웠던) 문제
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
  hardestProblem: ProblemAnalytics | null;
  // 다음 수업 설계 가이드
  headline: string; // 한 줄 총평
  teachingFocus: TeachingFocus[]; // 집중 보완이 필요한 개념 (심각도순, 최대 4개)
  strongConcepts: string[]; // 이미 잘 이해한 개념
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

function getDeletedClassCodes(): Set<string> {
  const raw = getStoredValue(DELETED_CLASS_CODES_KEY);
  if (!raw) return new Set();
  try {
    const parsed = JSON.parse(raw) as unknown;
    return new Set(Array.isArray(parsed) ? parsed.map(String) : []);
  } catch {
    return new Set();
  }
}

function addDeletedClassCode(code: string): void {
  const set = getDeletedClassCodes();
  set.add(code);
  setStoredValue(DELETED_CLASS_CODES_KEY, JSON.stringify([...set]));
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

  const session = toStudentSession(data);
  // 이 수업이 어떤 문제집을 쓰는지 함께 저장해, 게임이 해당 문제를 띄우게 한다.
  session.problemSetId = getProblemSetIdForProblemIds(classSession.selectedProblemIds);
  return session;
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
      problemSetId: parsed.problemSetId,
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

// 정답률을 성취 수준으로 변환 (개념·문제 공통 기준)
function toAttainment(rate: number): ConceptAttainment {
  if (rate >= 80) return "high";
  if (rate >= 50) return "mid";
  return "low";
}

// 개념별로 "학생들이 주로 어디서 막히는지(reason)" + "다음 수업에서 무엇을 짚어 줄지(action)".
// 진단 결과를 곧바로 다음 수업 행동으로 옮길 수 있도록 구체적으로 작성한다.
const CONCEPT_TEACHING: Record<string, { reason: string; action: string }> = {
  "변수": {
    reason: "= 을 '같다'로 오해해 값을 저장하지 못하는 경우가 보입니다.",
    action: "= 가 오른쪽 값을 왼쪽 변수에 '저장'하는 것임을 한 번 더 짚어 주세요.",
  },
  "연산": {
    reason: "숫자와 문자열을 섞어 연산하다 타입 오류를 내는 경우가 있습니다.",
    action: "+ 가 숫자끼리는 덧셈, 문자열끼리는 이어붙이기임을 예시로 비교해 주세요.",
  },
  "인덱싱": {
    reason: "인덱스를 1부터 세어 첫 글자를 놓치는 학생이 많습니다.",
    action: "인덱스가 0부터 시작한다는 점을 한 문자열로 직접 세어 보여 주세요.",
  },
  "슬라이싱": {
    reason: "슬라이싱의 끝 인덱스가 포함되지 않는 점에서 자주 막힙니다.",
    action: "data[:3] 이 0·1·2번째까지(3번째 제외)임을 칸으로 그려 설명해 주세요.",
  },
  "내장함수 len": {
    reason: "len(data) 대신 data.len() 형태로 호출하는 실수가 보입니다.",
    action: "len() 은 값을 괄호 안에 넣어 호출하는 내장함수임을 짚어 주세요.",
  },
  "문자열 연산": {
    reason: "문자열 * 정수(반복)와 + (이어붙이기)를 헷갈리는 경우가 있습니다.",
    action: "'A' * 3 과 'A' + 'A' + 'A' 가 같은 결과임을 나란히 보여 주세요.",
  },
  "문자열 메서드(upper)": {
    reason: ".upper() 의 괄호를 빠뜨리거나 메서드 호출 형식을 어려워합니다.",
    action: "값.메서드() 형태(점 + 괄호)로 호출한다는 규칙을 다시 정리해 주세요.",
  },
  "문자열 메서드(replace)": {
    reason: "replace(찾을값, 바꿀값) 의 인자 순서를 바꿔 쓰는 경우가 많습니다.",
    action: "replace 는 '무엇을→무엇으로' 순서임을 예시로 고정해 주세요.",
  },
  "문자열 메서드(split)": {
    reason: "split() 의 결과가 리스트라는 점을 인지하지 못하는 경우가 있습니다.",
    action: "split() 이 문자열을 잘라 리스트로 돌려준다는 점을 출력으로 확인시켜 주세요.",
  },
  "if/else": {
    reason: "비교 연산자(>=, ==)나 if/else 들여쓰기에서 자주 막힙니다.",
    action: "조건 → 참일 때 / 거짓일 때의 분기 흐름을 순서도로 다시 설명해 주세요.",
  },
  "나머지 연산·비교": {
    reason: "% 연산과 == 비교를 결합해 짝수를 판별하는 데서 막힙니다.",
    action: "data % 2 == 0 한 줄을 단계별로 분해해 의미를 짚어 주세요.",
  },
  "논리 연산": {
    reason: "and/or 로 두 조건을 묶는 부분에서 실수가 많습니다.",
    action: "and 는 '둘 다 참', or 는 '하나만 참'임을 표로 정리해 주세요.",
  },
  "for": {
    reason: "누적 변수 초기화(total = 0)를 빠뜨리거나 for 실행 순서를 어려워합니다.",
    action: "반복 전에 변수를 0으로 두고, 한 항목씩 더해 가는 과정을 단계별로 보여 주세요.",
  },
  "for+if 필터링": {
    reason: "빈 리스트 준비와 조건부 append 위치에서 자주 막힙니다.",
    action: "빈 리스트 → 반복 → 조건 통과 시에만 append 흐름을 다시 시연해 주세요.",
  },
  "for+딕셔너리": {
    reason: "딕셔너리 키 접근(item['score'])과 최댓값 갱신 패턴을 어려워합니다.",
    action: "최댓값 변수를 두고 더 큰 값을 만나면 갱신하는 패턴을 짚어 주세요.",
  },
  "while": {
    reason: "while 종료 조건과 변수 감소 시점을 헷갈려 무한 반복에 빠지기 쉽습니다.",
    action: "조건이 거짓이 되는 순간 멈춘다는 점과 감소 위치를 함께 설명해 주세요.",
  },
  "컴프리헨션": {
    reason: "[식 for x in ... if 조건] 구조 자체를 처음 접해 어려워합니다.",
    action: "먼저 for+if 로 푼 코드를 컴프리헨션 한 줄로 바꾸는 과정을 보여 주세요.",
  },
  "for+조건": {
    reason: "문자열을 순회하며 조건에 맞는 글자만 누적하는 흐름에서 막힙니다.",
    action: "글자를 하나씩 확인해 조건에 맞을 때만 이어붙이는 과정을 시연해 주세요.",
  },
};

function teachingFor(concept: string): { reason: string; action: string } {
  return (
    CONCEPT_TEACHING[concept] ?? {
      reason: "여러 학생이 이 개념의 문제에서 정답에 이르지 못했습니다.",
      action: `${concept} 개념의 풀이 과정을 다음 수업에서 짧게 다시 짚어 주세요.`,
    }
  );
}

// 집중 보완이 필요한 개념을 심각도순으로 추린다.
function buildTeachingFocus(
  conceptStats: ConceptAnalytics[],
  problemStats: ProblemAnalytics[],
): TeachingFocus[] {
  return conceptStats
    .filter((c) => c.attainment !== "high" || c.failCount > 3)
    .sort((a, b) => a.averageSuccessRate - b.averageSuccessRate || b.failCount - a.failCount)
    .slice(0, 4)
    .map((concept) => {
      // 이 개념을 다루는 문제 중 가장 어려웠던 문제를 대표로 사용
      const conceptProblems = problemStats
        .filter((p) => p.problem.concept === concept.concept)
        .sort((a, b) => a.successRate - b.successRate || b.failCount - a.failCount);
      const hardest = conceptProblems[0];
      const { reason, action } = teachingFor(concept.concept);
      return {
        concept: concept.concept,
        averageSuccessRate: concept.averageSuccessRate,
        attainment: concept.attainment,
        failCount: concept.failCount,
        unsolvedStudentCount: hardest?.unsolvedStudentCount ?? 0,
        reason,
        action,
        exampleProblemTitle: hardest?.problem.title ?? null,
      };
    });
}

// 교사가 가장 먼저 읽는 한 줄 총평.
function buildHeadline(
  teachingFocus: TeachingFocus[],
  strongConcepts: string[],
  hasAttempts: boolean,
): string {
  if (!hasAttempts) {
    return "아직 제출된 풀이가 없습니다. 학생들이 활동을 시작하면 분석이 채워집니다.";
  }
  if (teachingFocus.length === 0) {
    return "전반적으로 고르게 이해하고 있습니다. 다음 단원으로 진도를 이어가도 좋습니다.";
  }
  const lowOrMid = teachingFocus.filter((f) => f.attainment !== "high").map((f) => f.concept);
  const names = (lowOrMid.length > 0 ? lowOrMid : teachingFocus.map((f) => f.concept)).slice(0, 2);
  const concepts = names.join(" · ");
  const strongTail =
    strongConcepts.length > 0 ? ` ${strongConcepts.slice(0, 2).join(" · ")} 개념은 잘 이해하고 있습니다.` : "";
  return `학생 다수가 ${concepts} 개념에서 막혔습니다. 다음 수업 도입부에서 이 부분을 먼저 짚어 주세요.${strongTail}`;
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

  const conceptStats: ConceptAnalytics[] = Object.values(
    problemStats.reduce<Record<string, { concept: string; rates: number[]; failCount: number; problemCount: number }>>((acc, stat) => {
      const current = acc[stat.problem.concept] ?? {
        concept: stat.problem.concept,
        rates: [],
        failCount: 0,
        problemCount: 0,
      };
      current.rates.push(stat.successRate);
      current.failCount += stat.failCount;
      current.problemCount += 1;
      acc[stat.problem.concept] = current;
      return acc;
    }, {}),
  ).map((concept) => {
    const averageSuccessRate = concept.rates.length
      ? Math.round(concept.rates.reduce((sum, rate) => sum + rate, 0) / concept.rates.length)
      : 0;

    return {
      concept: concept.concept,
      averageSuccessRate,
      failCount: concept.failCount,
      problemCount: concept.problemCount,
      // 성취 수준은 정답률로 직접 분류 (차트 색/배지가 정답률과 일치하도록)
      attainment: toAttainment(averageSuccessRate),
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

  // 가장 어려운 문제 = 성공률이 낮고 실패가 많은 문제
  const hardestProblem = [...problemStats]
    .filter((p) => p.attemptCount > 0)
    .sort((a, b) => a.successRate - b.successRate || b.failCount - a.failCount)[0] ?? null;

  const hasAttempts = attemptLogs.length > 0;
  // 다음 수업 가이드: 집중 보완 개념 / 이미 잘 이해한 개념 / 한 줄 총평
  const teachingFocus = hasAttempts ? buildTeachingFocus(conceptStats, problemStats) : [];
  const focusConceptNames = new Set(teachingFocus.map((f) => f.concept));
  const strongConcepts = hasAttempts
    ? [...conceptStats]
        .filter((c) => c.attainment === "high" && !focusConceptNames.has(c.concept))
        .sort((a, b) => b.averageSuccessRate - a.averageSuccessRate)
        .map((c) => c.concept)
    : [];
  const headline = buildHeadline(teachingFocus, strongConcepts, hasAttempts);

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
    hardestProblem,
    headline,
    teachingFocus,
    strongConcepts,
    hasAttempts,
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

  const deleted = getDeletedClassCodes();
  return summaries
    .filter((summary) => !deleted.has(summary.classCode))
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
}

/**
 * 수업 기록을 삭제(목록에서 제거)한다.
 * - 실제 수업(Supabase)이면 attempt_logs → student_sessions → class_sessions 순으로 정리한다(베스트 에포트).
 * - 데모 수업이면 정적 데이터라 DB 정리는 생략하고, 목록에서만 숨긴다.
 * 어느 경우든 localStorage 의 삭제 목록에 기록해 즉시·영구적으로 목록에서 사라지게 한다.
 */
export async function deleteClassRecord(classCode: string): Promise<void> {
  const code = normalizeClassCode(classCode);

  if (!isDemoClassCode(code) && isSupabaseConfigured) {
    try {
      const client = getSupabaseClient();
      // attempt_logs 는 class_code 가 FK 가 아니므로 명시적으로 먼저 삭제한다.
      await client.from("attempt_logs").delete().eq("class_code", code);
      // student_sessions 는 class_sessions 삭제 시 CASCADE 되지만, 안전하게 먼저 정리한다.
      await client.from("student_sessions").delete().eq("class_code", code);
      await client.from("class_sessions").delete().eq("class_code", code);
    } catch (error) {
      console.warn("수업 삭제 중 DB 정리에 실패했습니다.", error);
    }
  }

  addDeletedClassCode(code);
}
