// 씨마스 교과서 문제집을 "인게임에서 직접 풀 수 있는 퍼즐"로 변환한 모듈.
//
// - 각 교과서 문항(CMASS_PROBLEM_BANK)을 게임 본편의 방 오브젝트 슬롯(mappedPuzzleId)에 1:1로 얹는다.
// - 채점 방식: 교과서 예제처럼 "예상 출력이 그대로 나오도록 코드를 작성" → 출력 문자열이 정확히 일치하면 정답.
//   (입력값이 고정되어 있어 input() 없이 출력만 맞추면 된다. eval 은 사용 금지.)
// - 퍼즐 id 는 슬롯 id(=오브젝트 puzzleId)와 동일하게 두어, 시도 로그/분석이 문제집과 무관하게 동작한다.

import { CMASS_PROBLEM_BANK, type TextbookProblem } from "./textbookProblemBank";
import type { Puzzle, RoomHint } from "./types";

function roomIdFromSlot(slotId: string): string {
  const parts = slotId.split("-");
  return `${parts[0]}-${parts[1]}`; // "room-0-pattern-tiles" -> "room-0"
}

function toRewardHint(problem: TextbookProblem): RoomHint {
  const roomId = roomIdFromSlot(problem.mappedPuzzleId);
  const text = `[코드 조각 획득] ${problem.title} 해결 — 잠금이 하나 풀렸다.`;
  return {
    id: `${problem.id}-hint`,
    roomId,
    puzzleId: problem.mappedPuzzleId,
    text,
    description: text,
    value: `${problem.concept} 개념을 확인했습니다.`,
  };
}

function toPuzzle(problem: TextbookProblem): Puzzle {
  const roomId = roomIdFromSlot(problem.mappedPuzzleId);
  const expected = problem.sampleOutput ?? "";

  const situationText =
    `${problem.description}\n` +
    `아래 '예상 출력'이 그대로 나오도록 코드를 직접 작성하라.\n` +
    `(출력 문자열이 정확히 일치하면 정답으로 인정된다.)`;

  const starterCode =
    `# [목표] ${problem.title}\n` +
    `#  - 아래 '예상 출력'이 그대로 나오도록 코드를 작성하세요.\n` +
    (problem.sampleInput ? `#  - 입력값: ${problem.sampleInput}\n` : "") +
    `\n`;

  return {
    id: problem.mappedPuzzleId,
    roomId,
    objectId: problem.mappedPuzzleId,
    title: problem.title,
    situationText,
    dataText: "",
    // 입력 없이 고정 출력만 맞추는 채점 (inputCode 비움)
    testCases: [{ inputCode: "", expectedOutput: expected }],
    requiredSyntax: [],
    bannedSyntax: [],
    referenceItems: [],
    rewardHint: toRewardHint(problem),
    starterCode,
    isRequired: true,
    requiredForDoor: true,
    puzzleType: "code",
  };
}

export const cmassPuzzles: Puzzle[] = CMASS_PROBLEM_BANK.map(toPuzzle);

export const cmassPuzzlesById: Record<string, Puzzle> = Object.fromEntries(
  cmassPuzzles.map((puzzle) => [puzzle.id, puzzle]),
);

// 시연 모드용 정답 코드 (교과서 예제 코드 그대로). 슬롯 id → 코드
export const CMASS_DEMO_SOLUTIONS: Record<string, string> = Object.fromEntries(
  CMASS_PROBLEM_BANK.filter((p) => p.sampleCode).map((p) => [p.mappedPuzzleId, `${p.sampleCode}\n`]),
);
