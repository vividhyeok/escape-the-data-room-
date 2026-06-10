import { textbookProblemBank, type TextbookProblem } from "../data/textbookProblemBank";
import { getSupabaseClient } from "./supabaseClient";

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
  successStudentCount: number;
  successRate: number;
};

export type ConceptAnalytics = {
  concept: string;
  averageSuccessRate: number;
  failCount: number;
  level: "낮음" | "보통" | "높음";
};

export type ClassAnalytics = {
  classSession: ClassSession;
  students: StudentSession[];
  attemptLogs: AttemptLog[];
  studentCount: number;
  selectedProblemCount: number;
  problemStats: ProblemAnalytics[];
  conceptStats: ConceptAnalytics[];
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

export async function getClassAnalytics(classCode: string): Promise<ClassAnalytics | null> {
  const normalizedCode = normalizeClassCode(classCode);
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

  const students = (studentRows ?? []).map(toStudentSession);
  const attemptLogs = (attemptRows ?? []).map(toAttemptLog);
  const attemptStudentCount = new Set(attemptLogs.map(getAttemptStudentKey)).size;
  const studentCount = Math.max(students.length, attemptStudentCount);

  const selectedProblems = classSession.selectedProblemIds
    .map((problemId) => textbookProblemBank.find((problem) => problem.id === problemId))
    .filter((problem): problem is TextbookProblem => Boolean(problem));

  const problemStats = selectedProblems.map((problem) => {
    const logsForPuzzle = attemptLogs.filter((log) => log.puzzleId === problem.mappedPuzzleId);
    const successfulStudents = new Set(
      logsForPuzzle
        .filter((log) => log.success)
        .map(getAttemptStudentKey),
    );
    const successStudentCount = successfulStudents.size;
    const successRate = studentCount > 0 ? Math.round((successStudentCount / studentCount) * 100) : 0;

    return {
      problem,
      puzzleId: problem.mappedPuzzleId,
      attemptCount: logsForPuzzle.length,
      failCount: logsForPuzzle.filter((log) => !log.success).length,
      successStudentCount,
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

  return {
    classSession,
    students,
    attemptLogs,
    studentCount,
    selectedProblemCount: selectedProblems.length,
    problemStats,
    conceptStats,
    recommendations: buildRecommendations(problemStats),
    hasAttempts: attemptLogs.length > 0,
  };
}
