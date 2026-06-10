// 교과서형 파이썬 예제 DB (진단 문제 은행) + 문제집(ProblemSet)
//
// 중요: 여기의 문제(TextbookProblem)는 게임 본편의 퍼즐과 1:1로 대응한다.
//  - mappedPuzzleId === 실제 게임 퍼즐 id (예: "room-0-pattern-tiles")
//  - id 도 동일하게 두어, 교사 화면의 문제 수/종류가 게임 내 문제와 정확히 일치한다.
//
// 교사 화면은 "문제 단위"가 아니라 "문제집(ProblemSet) 단위"로 선택한다.
// 현재는 게임 본편 전체를 담은 기본 문제집 하나만 제공한다.
//
// 정적 배열을 어댑터 함수(getTextbookProblems 등)로 감싸 두었기 때문에,
// 나중에 Supabase problem_bank 테이블 조회로 바꿔도 화면 구조는 유지된다.

export type TextbookProblem = {
  id: string;
  title: string;
  unit: string;
  concept: string;
  difficulty: "하" | "중" | "상";
  description: string;
  mappedPuzzleId: string;

  // 향후 problem_bank 테이블 확장을 고려한 선택 필드
  curriculum?: string;
  gradeBand?: string;
  lessonOrder?: number;
  estimatedMinutes?: number;
  prerequisiteConcepts?: string[];
  diagnosisTarget?: string;
};

// 게임 본편 퍼즐과 1:1로 매핑된 진단 문제 (Room 0~2, 총 18문항)
const STATIC_PROBLEM_BANK: TextbookProblem[] = [
  // Room 0 — 잠긴 서재 (기초)
  {
    id: "room-0-pattern-tiles", mappedPuzzleId: "room-0-pattern-tiles",
    title: "변수에 값 저장하기", unit: "파이썬 기초", concept: "변수", difficulty: "하",
    lessonOrder: 1, estimatedMinutes: 1,
    description: "data 값을 answer 변수에 그대로 저장합니다.",
    diagnosisTarget: "대입(=)의 의미를 이해하는지 확인합니다.",
  },
  {
    id: "room-0-tv-sequence", mappedPuzzleId: "room-0-tv-sequence",
    title: "숫자 더하기", unit: "파이썬 기초", concept: "연산", difficulty: "하",
    lessonOrder: 2, estimatedMinutes: 1,
    description: "data에 숫자를 더한 값을 구합니다.",
    diagnosisTarget: "산술 연산자(+) 사용을 확인합니다.",
  },
  {
    id: "room-0-desk-terminal", mappedPuzzleId: "room-0-desk-terminal",
    title: "문자열 첫 글자 가져오기", unit: "문자열", concept: "인덱싱", difficulty: "하",
    lessonOrder: 3, estimatedMinutes: 2, prerequisiteConcepts: ["변수"],
    description: "문자열의 첫 글자를 인덱스 0으로 가져옵니다.",
    diagnosisTarget: "인덱스가 0부터 시작함을 이해하는지 확인합니다.",
  },
  {
    id: "room-0-mini-ox-card", mappedPuzzleId: "room-0-mini-ox-card",
    title: "문자열 앞부분 자르기", unit: "문자열", concept: "슬라이싱", difficulty: "중",
    lessonOrder: 4, estimatedMinutes: 2, prerequisiteConcepts: ["인덱싱"],
    description: "슬라이싱으로 문자열의 앞부분을 잘라냅니다.",
    diagnosisTarget: "슬라이싱 범위(시작:끝)의 끝이 포함되지 않음을 이해하는지 확인합니다.",
  },
  {
    id: "room-0-name-tags", mappedPuzzleId: "room-0-name-tags",
    title: "길이 구하기", unit: "파이썬 기초", concept: "내장함수 len", difficulty: "하",
    lessonOrder: 5, estimatedMinutes: 1,
    description: "len()으로 데이터의 길이를 구합니다.",
    diagnosisTarget: "len() 내장함수 사용을 확인합니다.",
  },
  {
    id: "room-0-bookshelf-note", mappedPuzzleId: "room-0-bookshelf-note",
    title: "문자열 반복하기", unit: "문자열", concept: "문자열 연산", difficulty: "하",
    lessonOrder: 6, estimatedMinutes: 1,
    description: "* 연산으로 문자열을 여러 번 반복합니다.",
    diagnosisTarget: "문자열 * 정수 연산의 의미를 이해하는지 확인합니다.",
  },

  // Room 1 — 신호실 (문자열 메서드 · 조건문)
  {
    id: "room-1-word-billboard", mappedPuzzleId: "room-1-word-billboard",
    title: "대문자로 바꾸기", unit: "문자열", concept: "문자열 메서드(upper)", difficulty: "중",
    lessonOrder: 7, estimatedMinutes: 2,
    description: "upper() 메서드로 문자열을 대문자로 바꿉니다.",
    diagnosisTarget: "메서드 호출(.upper()) 형식을 이해하는지 확인합니다.",
  },
  {
    id: "room-1-ox-monitor", mappedPuzzleId: "room-1-ox-monitor",
    title: "잘못된 글자 바꾸기", unit: "문자열", concept: "문자열 메서드(replace)", difficulty: "중",
    lessonOrder: 8, estimatedMinutes: 2,
    description: "replace()로 특정 글자를 다른 글자로 교체합니다.",
    diagnosisTarget: "replace(찾을값, 바꿀값) 인자 순서를 이해하는지 확인합니다.",
  },
  {
    id: "room-1-number-panel", mappedPuzzleId: "room-1-number-panel",
    title: "공백으로 나누기", unit: "문자열", concept: "문자열 메서드(split)", difficulty: "중",
    lessonOrder: 9, estimatedMinutes: 2,
    description: "split()으로 문자열을 나눠 리스트로 만듭니다.",
    diagnosisTarget: "split()의 반환값이 리스트임을 이해하는지 확인합니다.",
  },
  {
    id: "room-1-radio-signal", mappedPuzzleId: "room-1-radio-signal",
    title: "조건에 따라 판별하기", unit: "조건문", concept: "if/else", difficulty: "중",
    lessonOrder: 10, estimatedMinutes: 3, prerequisiteConcepts: ["변수", "연산"],
    description: "조건에 따라 PASS/FAIL을 저장합니다.",
    diagnosisTarget: "비교 연산자와 if/else 분기 흐름을 이해하는지 확인합니다.",
  },
  {
    id: "room-1-name-card", mappedPuzzleId: "room-1-name-card",
    title: "짝수 판별하기", unit: "조건문", concept: "나머지 연산·비교", difficulty: "중",
    lessonOrder: 11, estimatedMinutes: 2, prerequisiteConcepts: ["연산"],
    description: "나머지 연산(%)으로 짝수 여부를 판별합니다.",
    diagnosisTarget: "% 연산과 == 비교의 결합을 이해하는지 확인합니다.",
  },
  {
    id: "room-1-checksum-tablet", mappedPuzzleId: "room-1-checksum-tablet",
    title: "범위 안인지 검사하기", unit: "조건문", concept: "논리 연산", difficulty: "상",
    lessonOrder: 12, estimatedMinutes: 3, prerequisiteConcepts: ["if/else"],
    description: "and로 값이 특정 범위 안에 있는지 검사합니다.",
    diagnosisTarget: "and/or 논리 연산의 결합을 이해하는지 확인합니다.",
  },

  // Room 2 — 기록실 (반복문 · 리스트 · 딕셔너리)
  {
    id: "room-2-file-cabinet", mappedPuzzleId: "room-2-file-cabinet",
    title: "반복문으로 합계 구하기", unit: "반복문", concept: "for", difficulty: "중",
    lessonOrder: 13, estimatedMinutes: 3, prerequisiteConcepts: ["변수"],
    description: "for문으로 여러 값의 합계를 구합니다.",
    diagnosisTarget: "누적 변수 초기화(total = 0)와 for 실행 순서를 이해하는지 확인합니다.",
  },
  {
    id: "room-2-broken-tags", mappedPuzzleId: "room-2-broken-tags",
    title: "조건에 맞는 값만 고르기", unit: "반복문", concept: "for+if 필터링", difficulty: "상",
    lessonOrder: 14, estimatedMinutes: 3, prerequisiteConcepts: ["for", "if/else"],
    description: "반복하며 조건에 맞는 값만 새 리스트에 모읍니다.",
    diagnosisTarget: "반복문 안에서 조건부 append 흐름을 이해하는지 확인합니다.",
  },
  {
    id: "room-2-score-board", mappedPuzzleId: "room-2-score-board",
    title: "최고값 찾기", unit: "반복문", concept: "for+딕셔너리", difficulty: "상",
    lessonOrder: 15, estimatedMinutes: 4, prerequisiteConcepts: ["for"],
    description: "반복하며 가장 큰 점수를 찾습니다.",
    diagnosisTarget: "최댓값 갱신 패턴과 딕셔너리 접근을 이해하는지 확인합니다.",
  },
  {
    id: "room-2-timeline", mappedPuzzleId: "room-2-timeline",
    title: "while로 카운트다운", unit: "반복문", concept: "while", difficulty: "중",
    lessonOrder: 16, estimatedMinutes: 3, prerequisiteConcepts: ["for"],
    description: "while문으로 값을 줄여가며 리스트를 만듭니다.",
    diagnosisTarget: "while 종료 조건과 변수 감소를 이해하는지 확인합니다.",
  },
  {
    id: "room-2-access-log", mappedPuzzleId: "room-2-access-log",
    title: "리스트 컴프리헨션", unit: "리스트", concept: "컴프리헨션", difficulty: "상",
    lessonOrder: 17, estimatedMinutes: 4, prerequisiteConcepts: ["for+if 필터링"],
    description: "리스트 컴프리헨션으로 조건에 맞는 값을 변환합니다.",
    diagnosisTarget: "[식 for x in ... if 조건] 구조를 이해하는지 확인합니다.",
  },
  {
    id: "room-2-checksum-ledger", mappedPuzzleId: "room-2-checksum-ledger",
    title: "특정 글자 제거하기", unit: "문자열", concept: "for+조건", difficulty: "상",
    lessonOrder: 18, estimatedMinutes: 3, prerequisiteConcepts: ["for", "if/else"],
    description: "반복하며 특정 글자를 제외한 문자열을 만듭니다.",
    diagnosisTarget: "문자열 순회와 누적 결합을 이해하는지 확인합니다.",
  },
];

// 하위 호환용 (가능하면 아래 조회 함수를 사용)
export const textbookProblemBank: TextbookProblem[] = STATIC_PROBLEM_BANK;

// ---- 문제집(ProblemSet) ----
// 교사 화면은 문제 단위가 아니라 문제집 단위로 선택한다.

export type ProblemSet = {
  id: string;
  title: string;
  description: string;
  gradeBand?: string;
  problemIds: string[];
};

export const PROBLEM_SETS: ProblemSet[] = [
  {
    id: "tcr-foundation",
    title: "파이썬 기초 방탈출 문제집",
    description: "변수·문자열·조건·반복까지, 캠프 초반 진단용 기본 문제집 (게임 본편 전체)",
    gradeBand: "캠프 기초반",
    problemIds: STATIC_PROBLEM_BANK.map((problem) => problem.id),
  },
  // 추가 문제집은 추후 problem_bank 테이블에서 불러올 예정 (현재는 비어 있음)
];

export function getProblemSets(): ProblemSet[] {
  return PROBLEM_SETS;
}

export function getDefaultProblemSet(): ProblemSet {
  return PROBLEM_SETS[0];
}

export function getProblemSetById(id: string): ProblemSet | undefined {
  return PROBLEM_SETS.find((set) => set.id === id);
}

// ---- 문제 조회 어댑터 ----

export function getTextbookProblems(): TextbookProblem[] {
  return STATIC_PROBLEM_BANK;
}

export function getTextbookProblemById(id: string): TextbookProblem | undefined {
  return STATIC_PROBLEM_BANK.find((problem) => problem.id === id);
}

export function getTextbookProblemByPuzzleId(puzzleId: string): TextbookProblem | undefined {
  return STATIC_PROBLEM_BANK.find((problem) => problem.mappedPuzzleId === puzzleId);
}

export function getTextbookProblemsByIds(ids: string[]): TextbookProblem[] {
  return ids
    .map((id) => getTextbookProblemById(id))
    .filter((problem): problem is TextbookProblem => Boolean(problem));
}

export function estimateMinutesForProblems(problems: TextbookProblem[]): number {
  return problems.reduce((sum, problem) => sum + (problem.estimatedMinutes ?? 2), 0);
}
