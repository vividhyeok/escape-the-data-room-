export type TextbookProblem = {
  id: string;
  title: string;
  unit: string;
  concept: string;
  difficulty: "하" | "중" | "상";
  mappedPuzzleId: string;
  description: string;
};

export const textbookProblemBank: TextbookProblem[] = [
  {
    id: "tb-001",
    title: "변수에 값 저장하기",
    unit: "파이썬 기초",
    concept: "변수",
    difficulty: "하",
    mappedPuzzleId: "room-0-pattern-tiles",
    description: "data 값을 answer 변수에 저장하는 기본 대입 문제입니다.",
  },
  {
    id: "tb-002",
    title: "문자열 첫 글자 가져오기",
    unit: "문자열",
    concept: "인덱싱",
    difficulty: "하",
    mappedPuzzleId: "room-0-desk-terminal",
    description: "문자열의 첫 번째 글자를 인덱스 0으로 가져오는 문제입니다.",
  },
  {
    id: "tb-003",
    title: "문자열 일부 자르기",
    unit: "문자열",
    concept: "슬라이싱",
    difficulty: "중",
    mappedPuzzleId: "room-0-mini-ox-card",
    description: "슬라이싱으로 문자열의 앞부분을 잘라내는 문제입니다.",
  },
  {
    id: "tb-004",
    title: "조건에 따라 PASS/FAIL 판단하기",
    unit: "조건문",
    concept: "if/else",
    difficulty: "중",
    mappedPuzzleId: "room-1-radio-signal",
    description: "조건에 따라 서로 다른 결과를 저장하는 조건문 문제입니다.",
  },
  {
    id: "tb-005",
    title: "반복문으로 합계 구하기",
    unit: "반복문",
    concept: "for",
    difficulty: "중",
    mappedPuzzleId: "room-2-file-cabinet",
    description: "반복문을 사용해 여러 값의 합계를 구하는 문제입니다.",
  },
  {
    id: "tb-006",
    title: "리스트에서 필요한 값만 고르기",
    unit: "리스트",
    concept: "필터링",
    difficulty: "상",
    mappedPuzzleId: "room-2-broken-tags",
    description: "리스트를 순회하며 조건에 맞는 값만 골라내는 문제입니다.",
  },
];
