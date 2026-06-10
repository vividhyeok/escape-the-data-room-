// 교과서형 파이썬 예제 DB (진단 문제 은행)
//
// 현재는 아래 정적 배열을 기본 데이터로 사용합니다.
// 다만 교사용 화면과 대시보드는 이 배열을 직접 import 하지 않고,
// 같은 파일에서 제공하는 조회 함수(getTextbookProblems / getTextbookProblemById ...)를
// 통해서만 문제 데이터를 읽습니다.
//
// 이렇게 분리해 두면, 나중에 Supabase의 problem_bank 테이블에서 문제를
// 읽어오도록 바꾸더라도 TeacherDemoPage / ResultDashboardPage 구조를
// 거의 그대로 유지할 수 있습니다. (정적 배열 → 비동기 조회로만 교체)

export type TextbookProblem = {
  id: string;
  title: string;
  unit: string;
  concept: string;
  difficulty: "하" | "중" | "상";
  description: string;
  mappedPuzzleId: string;

  // 향후 problem_bank 테이블 확장을 고려한 선택 필드
  curriculum?: string; // 예: 2022 개정 정보 교육과정
  gradeBand?: string; // 예: 중학교, 고등학교, 캠프 기초반
  lessonOrder?: number; // 교과서/수업 문법 순서
  estimatedMinutes?: number; // 예상 풀이 시간
  prerequisiteConcepts?: string[];
  diagnosisTarget?: string; // 어떤 오개념을 확인하는 문제인지
};

const STATIC_PROBLEM_BANK: TextbookProblem[] = [
  {
    id: "tb-001",
    title: "변수에 값 저장하기",
    unit: "파이썬 기초",
    concept: "변수",
    difficulty: "하",
    mappedPuzzleId: "room-0-pattern-tiles",
    description: "data 값을 answer 변수에 저장하는 기본 대입 문제입니다.",
    gradeBand: "캠프 기초반",
    lessonOrder: 1,
    estimatedMinutes: 2,
    diagnosisTarget: "변수 대입(=)의 의미를 이해하는지 확인합니다.",
  },
  {
    id: "tb-002",
    title: "문자열 첫 글자 가져오기",
    unit: "문자열",
    concept: "인덱싱",
    difficulty: "하",
    mappedPuzzleId: "room-0-desk-terminal",
    description: "문자열의 첫 번째 글자를 인덱스 0으로 가져오는 문제입니다.",
    gradeBand: "캠프 기초반",
    lessonOrder: 2,
    estimatedMinutes: 3,
    prerequisiteConcepts: ["변수"],
    diagnosisTarget: "인덱스가 0부터 시작한다는 점을 이해하는지 확인합니다.",
  },
  {
    id: "tb-003",
    title: "문자열 일부 자르기",
    unit: "문자열",
    concept: "슬라이싱",
    difficulty: "중",
    mappedPuzzleId: "room-0-mini-ox-card",
    description: "슬라이싱으로 문자열의 앞부분을 잘라내는 문제입니다.",
    gradeBand: "캠프 기초반",
    lessonOrder: 3,
    estimatedMinutes: 4,
    prerequisiteConcepts: ["인덱싱"],
    diagnosisTarget: "슬라이싱 범위(시작:끝)의 끝 인덱스가 포함되지 않음을 이해하는지 확인합니다.",
  },
  {
    id: "tb-004",
    title: "조건에 따라 PASS/FAIL 판단하기",
    unit: "조건문",
    concept: "if/else",
    difficulty: "중",
    mappedPuzzleId: "room-1-radio-signal",
    description: "조건에 따라 서로 다른 결과를 저장하는 조건문 문제입니다.",
    gradeBand: "캠프 기초반",
    lessonOrder: 4,
    estimatedMinutes: 4,
    prerequisiteConcepts: ["변수"],
    diagnosisTarget: "비교 연산자와 if/else 분기 흐름을 이해하는지 확인합니다.",
  },
  {
    id: "tb-005",
    title: "반복문으로 합계 구하기",
    unit: "반복문",
    concept: "for",
    difficulty: "중",
    mappedPuzzleId: "room-2-file-cabinet",
    description: "반복문을 사용해 여러 값의 합계를 구하는 문제입니다.",
    gradeBand: "캠프 기초반",
    lessonOrder: 5,
    estimatedMinutes: 5,
    prerequisiteConcepts: ["변수"],
    diagnosisTarget: "누적 변수 초기화(total = 0)와 for문의 실행 순서를 이해하는지 확인합니다.",
  },
  {
    id: "tb-006",
    title: "리스트에서 필요한 값만 고르기",
    unit: "리스트",
    concept: "필터링",
    difficulty: "상",
    mappedPuzzleId: "room-2-broken-tags",
    description: "리스트를 순회하며 조건에 맞는 값만 골라내는 문제입니다.",
    gradeBand: "캠프 기초반",
    lessonOrder: 6,
    estimatedMinutes: 6,
    prerequisiteConcepts: ["for", "if/else"],
    diagnosisTarget: "반복문 안에서 조건에 맞는 값만 새 리스트에 모으는 흐름을 이해하는지 확인합니다.",
  },
];

// 하위 호환을 위해 정적 배열도 그대로 export 합니다.
// (가능하면 새 코드는 아래 조회 함수를 사용하세요.)
export const textbookProblemBank: TextbookProblem[] = STATIC_PROBLEM_BANK;

// 수업 세트 빠른 선택 프리셋.
// 새 문제를 추가하지 않고, 기존 문제 은행 안에서 id 목록만 구성합니다.
export type ProblemSetPreset = {
  id: string;
  label: string;
  description: string;
  problemIds: string[];
};

export const PROBLEM_SET_PRESETS: ProblemSetPreset[] = [
  {
    id: "diagnostic-basic",
    label: "기본 진단 세트",
    description: "변수·문자열·조건·반복을 한 번에 훑는 기본 진단용 구성",
    problemIds: ["tb-001", "tb-002", "tb-004", "tb-005"],
  },
  {
    id: "string-basic",
    label: "문자열 기초 세트",
    description: "인덱싱과 슬라이싱 중심의 문자열 기초 구성",
    problemIds: ["tb-002", "tb-003"],
  },
  {
    id: "control-flow",
    label: "조건·반복 세트",
    description: "조건문과 반복문, 리스트 처리 중심 구성",
    problemIds: ["tb-004", "tb-005", "tb-006"],
  },
];

/**
 * 문제 은행 전체를 반환합니다.
 * 지금은 정적 배열을 그대로 돌려주지만, 나중에 Supabase problem_bank
 * 테이블 조회로 바꿔도 호출부 시그니처는 유지할 수 있습니다.
 */
export function getTextbookProblems(): TextbookProblem[] {
  return STATIC_PROBLEM_BANK;
}

export function getTextbookProblemById(id: string): TextbookProblem | undefined {
  return STATIC_PROBLEM_BANK.find((problem) => problem.id === id);
}

/** mappedPuzzleId(내부 퍼즐 id)로 교과서 문제를 역조회합니다. */
export function getTextbookProblemByPuzzleId(puzzleId: string): TextbookProblem | undefined {
  return STATIC_PROBLEM_BANK.find((problem) => problem.mappedPuzzleId === puzzleId);
}

/** 선택된 문제 id 목록을 실제 문제 객체 배열로 변환합니다(순서 유지, 미존재 id 제거). */
export function getTextbookProblemsByIds(ids: string[]): TextbookProblem[] {
  return ids
    .map((id) => getTextbookProblemById(id))
    .filter((problem): problem is TextbookProblem => Boolean(problem));
}

/** 문제 묶음의 예상 활동 시간(분) 합계. estimatedMinutes가 없으면 3분으로 가정합니다. */
export function estimateMinutesForProblems(problems: TextbookProblem[]): number {
  return problems.reduce((sum, problem) => sum + (problem.estimatedMinutes ?? 3), 0);
}
