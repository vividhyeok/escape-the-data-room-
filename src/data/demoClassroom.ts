// 시연·논문용 수업 기록 (로컬 데모 데이터)
//
// 실제 수업에서 쌓이는 것과 동일한 스키마(class_sessions / student_sessions / attempt_logs)로
// "이미 진행을 마친 지난 수업" 기록을 결정적으로(seed 고정) 생성한다.
//  - 시도 로그의 code / error_message 는 실제 채점기(pyodideWorker)가 남기는 형식 그대로 작성했다.
//  - 새로 만드는 실제 수업(Supabase)과는 코드만 겹치지 않으면 완전히 독립적이다.
//  - classroomApi 의 조회 함수가 데모 코드를 만나면 이 모듈에서 데이터를 돌려준다.

import type { AttemptLog, ClassSession, StudentSession } from "../lib/classroomApi";
import { getTextbookProblems } from "./textbookProblemBank";

// 건너뛰기 마커의 원천 정의 (classroomApi 가 re-export 한다 — 순환 import 방지)
export const SKIP_MARKER = "__SKIPPED__";

export type DemoClassRecord = {
  session: ClassSession;
  students: StudentSession[];
  attemptLogs: AttemptLog[];
  /** 수업 종료 시각 — 기록 화면의 "마지막 활동" 기준 시각으로 사용 */
  endedAt: string;
};

// ───────────────────────── 결정적 난수 ─────────────────────────

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickInt(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

/** uuid v4 모양의 결정적 id (실제 DB 행처럼 보이도록) */
function seededUuid(rng: () => number): string {
  const hex = (n: number) =>
    Array.from({ length: n }, () => "0123456789abcdef"[Math.floor(rng() * 16)]).join("");
  return `${hex(8)}-${hex(4)}-4${hex(3)}-${"89ab"[Math.floor(rng() * 4)]}${hex(3)}-${hex(12)}`;
}

// ───────────────────────── 문제별 코드/오답 은행 ─────────────────────────
// 실제 학생 제출처럼 보이도록, 퍼즐별 정답 코드와 "흔한 오답 + 그때 채점기가 내는 메시지"를 둔다.

const HEADER = "data = eval(input())   # 입력을 받습니다 (이 줄은 그대로 두세요)\n\n";

type WrongAttempt = { code: string; err: string };
type CodeEntry = { ok: string; bad: WrongAttempt[] };

function runtimeError(line: number, lastLine: string): string {
  return `실행 에러:\nTraceback (most recent call last):\n  File "<exec>", line ${line}, in <module>\n${lastLine}`;
}

function wrongOutput(input: string, expected: string, actual: string): string {
  return `출력이 예시와 다릅니다.\n  입력: ${input}\n  기대 출력: ${expected}\n  실제 출력: ${actual}`;
}

const CODE_BANK: Record<string, CodeEntry> = {
  "room-0-pattern-tiles": {
    ok: HEADER + "print(data)\n",
    bad: [
      { code: HEADER + "print(answer)\n", err: runtimeError(3, "NameError: name 'answer' is not defined") },
      { code: HEADER + "data\n", err: "출력이 없습니다. print() 로 결과를 출력해 주세요." },
    ],
  },
  "room-0-tv-sequence": {
    ok: HEADER + "print(data + 10)\n",
    bad: [
      { code: HEADER + "print(data)\n", err: wrongOutput("5", "15", "5") },
      { code: HEADER + "print(data + '10')\n", err: runtimeError(3, "TypeError: unsupported operand type(s) for +: 'int' and 'str'") },
    ],
  },
  "room-0-desk-terminal": {
    ok: HEADER + "print(data[0])\n",
    bad: [
      { code: HEADER + "print(data[1])\n", err: wrongOutput("'SYSTEM'", "S", "Y") },
      { code: HEADER + "print(data(0))\n", err: runtimeError(3, "TypeError: 'str' object is not callable") },
    ],
  },
  "room-0-mini-ox-card": {
    ok: HEADER + "print(data[:3])\n",
    bad: [
      { code: HEADER + "print(data[0:2])\n", err: wrongOutput("'PYTHON'", "PYT", "PY") },
      { code: HEADER + "print(data[1:3])\n", err: wrongOutput("'PYTHON'", "PYT", "YT") },
    ],
  },
  "room-0-name-tags": {
    ok: HEADER + "print(len(data))\n",
    bad: [
      { code: HEADER + "print(data.len())\n", err: runtimeError(3, "AttributeError: 'str' object has no attribute 'len'") },
      { code: HEADER + "print(len(data) + 1)\n", err: wrongOutput("'PYTHON'", "6", "7") },
    ],
  },
  "room-0-bookshelf-note": {
    ok: HEADER + "print(data * 3)\n",
    bad: [
      { code: HEADER + "print(data + 3)\n", err: runtimeError(3, "TypeError: can only concatenate str (not \"int\") to str") },
      { code: HEADER + "print(data * 2)\n", err: wrongOutput("'A'", "AAA", "AA") },
    ],
  },
  "room-1-word-billboard": {
    ok: HEADER + "print(data.upper())\n",
    bad: [
      { code: HEADER + "print(upper(data))\n", err: runtimeError(3, "NameError: name 'upper' is not defined") },
      { code: HEADER + "print(data.upper)\n", err: wrongOutput("'hello'", "HELLO", "<built-in method upper of str object at 0x14e3d20>") },
    ],
  },
  "room-1-ox-monitor": {
    ok: HEADER + "print(data.replace('X', 'O'))\n",
    bad: [
      { code: HEADER + "data.replace('X', 'O')\nprint(data)\n", err: wrongOutput("'X O X'", "O O O", "X O X") },
      { code: HEADER + "print(data.replace('O', 'X'))\n", err: wrongOutput("'X O X'", "O O O", "X X X") },
    ],
  },
  "room-1-number-panel": {
    ok: HEADER + "print(data.split())\n",
    bad: [
      { code: HEADER + "print(data.split(','))\n", err: wrongOutput("'A B C'", "['A', 'B', 'C']", "['A B C']") },
      { code: HEADER + "print(split(data))\n", err: runtimeError(3, "NameError: name 'split' is not defined") },
    ],
  },
  "room-1-radio-signal": {
    ok: HEADER + "if data >= 100:\n    print('PASS')\nelse:\n    print('FAIL')\n",
    bad: [
      { code: HEADER + "if data > 100:\n    print('PASS')\nelse:\n    print('FAIL')\n", err: wrongOutput("100", "PASS", "FAIL") },
      { code: HEADER + "if data >= 100\n    print('PASS')\nelse:\n    print('FAIL')\n", err: "문법 오류 (Syntax Error): expected ':' (<unknown>, line 3)" },
      { code: HEADER + "if data >= 100:\nprint('PASS')\nelse:\nprint('FAIL')\n", err: "문법 오류 (Syntax Error): expected an indented block after 'if' statement on line 3 (<unknown>, line 4)" },
    ],
  },
  "room-1-name-card": {
    ok: HEADER + "print(data % 2 == 0)\n",
    bad: [
      { code: HEADER + "print(data % 2)\n", err: wrongOutput("4", "True", "0") },
      { code: HEADER + "print(data / 2 == 0)\n", err: wrongOutput("4", "True", "False") },
    ],
  },
  "room-1-checksum-tablet": {
    ok: HEADER + "print(data > 0 and data < 10)\n",
    bad: [
      { code: HEADER + "print(data > 0 or data < 10)\n", err: wrongOutput("10", "False", "True") },
      { code: HEADER + "print(data > 0 and data < 10\n", err: "문법 오류 (Syntax Error): '(' was never closed (<unknown>, line 3)" },
      { code: HEADER + "print(0 < data < 10 == True)\n", err: wrongOutput("5", "True", "False") },
    ],
  },
  "room-2-file-cabinet": {
    ok: HEADER + "total = 0\nfor x in data:\n    total = total + x\nprint(total)\n",
    bad: [
      { code: HEADER + "for x in data:\n    total = total + x\nprint(total)\n", err: runtimeError(4, "NameError: name 'total' is not defined") },
      { code: HEADER + "total = 0\nfor x in data:\n    total = x\nprint(total)\n", err: wrongOutput("[1, 2, 3]", "6", "3") },
      { code: HEADER + "print(sum(data))\n", err: "금지된 문법 사용: 'sum' 은(는) 사용할 수 없습니다." },
    ],
  },
  "room-2-broken-tags": {
    ok: HEADER + "result = []\nfor x in data:\n    if x > 0:\n        result.append(x)\nprint(result)\n",
    bad: [
      { code: HEADER + "result = []\nfor x in data:\n    result.append(x)\nprint(result)\n", err: "필수 문법 누락: 'If' 를 사용해야 합니다." },
      { code: HEADER + "for x in data:\n    if x > 0:\n        result.append(x)\nprint(result)\n", err: runtimeError(5, "NameError: name 'result' is not defined") },
      { code: HEADER + "result = []\nfor x in data:\n    if x >= 0:\n        result.append(x)\nprint(result)\n", err: wrongOutput("[-1, 5, 0, 3]", "[5, 3]", "[5, 0, 3]") },
    ],
  },
  "room-2-score-board": {
    ok: HEADER + "best = 0\nfor item in data:\n    if item['score'] > best:\n        best = item['score']\nprint(best)\n",
    bad: [
      { code: HEADER + "best = 0\nfor item in data:\n    if item[score] > best:\n        best = item[score]\nprint(best)\n", err: runtimeError(5, "NameError: name 'score' is not defined") },
      { code: HEADER + "best = 0\nfor item in data:\n    if item.score > best:\n        best = item.score\nprint(best)\n", err: runtimeError(5, "AttributeError: 'dict' object has no attribute 'score'") },
      { code: HEADER + "print(max(data))\n", err: "금지된 문법 사용: 'max' 은(는) 사용할 수 없습니다." },
    ],
  },
  "room-2-timeline": {
    ok: HEADER + "result = []\nwhile data > 0:\n    result.append(data)\n    data = data - 1\nprint(result)\n",
    bad: [
      { code: HEADER + "result = []\nwhile data > 0:\n    data = data - 1\n    result.append(data)\nprint(result)\n", err: wrongOutput("3", "[3, 2, 1]", "[2, 1, 0]") },
      { code: HEADER + "while data > 0:\n    result.append(data)\n    data = data - 1\nprint(result)\n", err: runtimeError(4, "NameError: name 'result' is not defined") },
    ],
  },
  "room-2-access-log": {
    ok: HEADER + "print([x * 2 for x in data if x > 0])\n",
    bad: [
      { code: HEADER + "print([x for x in data if x > 0])\n", err: wrongOutput("[1, -2, 3, 0, 4]", "[2, 6, 8]", "[1, 3, 4]") },
      { code: HEADER + "print([x * 2 for x in data])\n", err: wrongOutput("[1, -2, 3, 0, 4]", "[2, 6, 8]", "[2, -4, 6, 0, 8]") },
      { code: HEADER + "result = []\nfor x in data:\n    if x > 0:\n        result.append(x * 2)\nprint(result)\n", err: "필수 문법 누락: 'ListComp' 를 사용해야 합니다." },
    ],
  },
  "room-2-checksum-ledger": {
    ok: HEADER + "result = ''\nfor ch in data:\n    if ch not in 'aeiou':\n        result = result + ch\nprint(result)\n",
    bad: [
      { code: HEADER + "result = ''\nfor ch in data:\n    if ch in 'aeiou':\n        result = result + ch\nprint(result)\n", err: wrongOutput("'apple'", "ppl", "ae") },
      { code: HEADER + "for ch in data:\n    if ch not in 'aeiou':\n        result = result + ch\nprint(result)\n", err: runtimeError(5, "NameError: name 'result' is not defined") },
    ],
  },
};

// ───────────────────────── 학생 프로필 → 로그 생성 ─────────────────────────

type StudentSpec = {
  nickname: string;
  /** 통과(정답+건너뛰기)한 문제 수: 0~18 */
  reach: number;
  /** 건너뛰기로 통과한 문제 인덱스 */
  skips?: number[];
  /** 특정 문제에서 추가로 더 실패한 횟수 (문제 인덱스 → 횟수) */
  extraFails?: Record<number, number>;
  /** 마지막(미해결) 문제에서 남긴 연속 실패 횟수 — "도움 필요" 상태 연출 */
  stuckFails?: number;
  /** 수업 시작 후 입장 시각(분) */
  joinOffsetMin?: number;
  /** 풀이 속도 배수 (작을수록 빠름) */
  pace?: number;
};

type ClassSpec = {
  classCode: string;
  title: string;
  /** 수업(코드 발급) 시각 ISO */
  createdAt: string;
  /** 학생 활동 시작/종료 (createdAt 기준 분 단위 오프셋) */
  startOffsetMin: number;
  durationMin: number;
  seed: number;
  students: StudentSpec[];
};

const DIFFICULTY_THINK_SEC: Record<"하" | "중" | "상", [number, number]> = {
  하: [45, 90],
  중: [75, 160],
  상: [110, 240],
};

function baseFailCount(rng: () => number, difficulty: "하" | "중" | "상", skill: number): number {
  // skill: 0(약함)~1(강함). 난이도가 높고 skill 이 낮을수록 실패가 잦다.
  const roll = rng();
  const hard = difficulty === "상" ? 0.32 : difficulty === "중" ? 0.18 : 0.08;
  const p = Math.max(0.02, hard + (1 - skill) * 0.25);
  if (roll < 1 - p) return 0;
  if (roll < 1 - p / 3) return 1;
  if (roll < 1 - p / 8) return 2;
  return 3;
}

function buildClassRecord(spec: ClassSpec): DemoClassRecord {
  const rng = mulberry32(spec.seed);
  const problems = getTextbookProblems(); // lessonOrder 순서와 동일
  const problemIds = problems.map((p) => p.id);

  const createdAtMs = new Date(spec.createdAt).getTime();
  const startMs = createdAtMs + spec.startOffsetMin * 60000;
  const sessionSec = spec.durationMin * 60;
  const endedAtMs = startMs + sessionSec * 1000;

  const session: ClassSession = {
    id: seededUuid(rng),
    classCode: spec.classCode,
    title: spec.title,
    selectedProblemIds: problemIds,
    createdAt: new Date(createdAtMs).toISOString(),
  };

  const students: StudentSession[] = [];
  const attemptLogs: AttemptLog[] = [];

  spec.students.forEach((s, studentIndex) => {
    const studentRng = mulberry32(spec.seed * 7919 + studentIndex * 104729 + 13);
    const studentId = seededUuid(studentRng);
    const joinOffsetSec = (s.joinOffsetMin ?? pickInt(studentRng, 0, 3)) * 60 + pickInt(studentRng, 0, 50);

    students.push({
      studentId,
      classCode: spec.classCode,
      nickname: s.nickname,
    });
    // student_sessions.created_at 은 toStudentSession 매핑에서 쓰진 않지만,
    // 입장순 정렬(order by created_at)을 흉내내기 위해 push 순서를 입장 순서로 유지한다.

    const skill = Math.min(1, s.reach / problems.length + 0.1);
    const pace = s.pace ?? 1 + (1 - skill) * 0.4;
    const skipSet = new Set(s.skips ?? []);

    // 1) 상대 시간(초)으로 시도 이벤트를 만들고
    type RawEvent = { offsetSec: number; puzzleId: string; success: boolean; err: string; code: string };
    const events: RawEvent[] = [];
    let t = joinOffsetSec + pickInt(studentRng, 50, 140); // 입장 후 첫 문제까지 탐색 시간

    const pushAttempts = (problemIndex: number, opts: { solve: boolean; skip?: boolean; forcedFails?: number; trailingFailsOnly?: number }) => {
      const problem = problems[problemIndex];
      const bank = CODE_BANK[problem.id];
      const [minThink, maxThink] = DIFFICULTY_THINK_SEC[problem.difficulty];

      if (opts.trailingFailsOnly !== undefined) {
        for (let f = 0; f < opts.trailingFailsOnly; f += 1) {
          t += Math.round(pickInt(studentRng, minThink, maxThink) * pace);
          const bad = bank.bad[(f + studentIndex) % bank.bad.length];
          events.push({ offsetSec: t, puzzleId: problem.mappedPuzzleId, success: false, err: bad.err, code: bad.code });
        }
        return;
      }

      const fails = opts.forcedFails ?? baseFailCount(studentRng, problem.difficulty, skill);
      const failTotal = opts.skip ? Math.max(fails, 3) : fails; // 건너뛰기는 3회 이상 실패 후에만 열린다
      for (let f = 0; f < failTotal; f += 1) {
        t += Math.round(pickInt(studentRng, minThink, maxThink) * pace);
        const bad = bank.bad[(f + studentIndex) % bank.bad.length];
        events.push({ offsetSec: t, puzzleId: problem.mappedPuzzleId, success: false, err: bad.err, code: bad.code });
      }

      t += Math.round(pickInt(studentRng, minThink, maxThink) * pace);
      if (opts.skip) {
        const lastBad = bank.bad[(failTotal + studentIndex - 1) % bank.bad.length];
        events.push({ offsetSec: t, puzzleId: problem.mappedPuzzleId, success: true, err: SKIP_MARKER, code: lastBad.code });
      } else if (opts.solve) {
        events.push({ offsetSec: t, puzzleId: problem.mappedPuzzleId, success: true, err: "", code: bank.ok });
      }
    };

    for (let i = 0; i < Math.min(s.reach, problems.length); i += 1) {
      pushAttempts(i, {
        solve: true,
        skip: skipSet.has(i),
        forcedFails: s.extraFails?.[i],
      });
    }

    if (s.stuckFails && s.reach < problems.length) {
      pushAttempts(s.reach, { solve: false, trailingFailsOnly: s.stuckFails });
    }

    // 2) 수업 시간 안에 들어오도록 전체 타임라인을 비율 보정한다 (순서 보존)
    const lastOffset = events.length > 0 ? events[events.length - 1].offsetSec : 0;
    const budget = sessionSec - pickInt(studentRng, 120, 600); // 종료 2~10분 전 마무리
    const scale = lastOffset > budget ? budget / lastOffset : 1;

    events.forEach((event) => {
      attemptLogs.push({
        id: seededUuid(studentRng),
        classCode: spec.classCode,
        studentId,
        nickname: s.nickname,
        puzzleId: event.puzzleId,
        success: event.success,
        errorMessage: event.err,
        code: event.code,
        createdAt: new Date(startMs + Math.round(event.offsetSec * scale) * 1000).toISOString(),
      });
    });
  });

  attemptLogs.sort((a, b) => (a.createdAt ?? "").localeCompare(b.createdAt ?? ""));

  return {
    session,
    students,
    attemptLogs,
    endedAt: new Date(endedAtMs).toISOString(),
  };
}

// ───────────────────────── 시연용 수업 3개 ─────────────────────────
// 가장 최근 수업(493817)이 20명 정원의 메인 시연 수업이다.

const DEMO_CLASS_SPECS: ClassSpec[] = [
  {
    classCode: "493817",
    title: "SW캠프 1일차 · 파이썬 기초 진단 (A반)",
    createdAt: "2026-06-09T00:58:00.000Z", // KST 09:58 코드 발급
    startOffsetMin: 7, // 10:05 활동 시작
    durationMin: 42, // 10:47 종료
    seed: 20260609,
    students: [
      { nickname: "서연", reach: 18, pace: 0.72, joinOffsetMin: 0 },
      { nickname: "도윤", reach: 18, pace: 0.8, extraFails: { 11: 2, 13: 1 }, joinOffsetMin: 1 },
      { nickname: "유나", reach: 18, pace: 0.85, extraFails: { 9: 1, 16: 2 }, joinOffsetMin: 0 },
      { nickname: "민준", reach: 18, pace: 0.9, skips: [13, 16], extraFails: { 11: 2 }, joinOffsetMin: 2 },
      { nickname: "채원", reach: 18, pace: 0.95, skips: [16], extraFails: { 14: 1 }, joinOffsetMin: 1 },
      { nickname: "하은", reach: 16, pace: 1.0, extraFails: { 12: 1 }, joinOffsetMin: 0 },
      { nickname: "시우", reach: 15, pace: 1.0, skips: [11], stuckFails: 1, joinOffsetMin: 3 },
      { nickname: "수아", reach: 15, pace: 1.05, extraFails: { 8: 1 }, joinOffsetMin: 1 },
      { nickname: "지우", reach: 13, pace: 1.1, stuckFails: 1, extraFails: { 12: 2 }, joinOffsetMin: 0 },
      { nickname: "준호", reach: 12, pace: 1.1, stuckFails: 1, joinOffsetMin: 2 },
      { nickname: "현우", reach: 12, pace: 1.15, stuckFails: 3, extraFails: { 9: 2 }, joinOffsetMin: 1 },
      { nickname: "가은", reach: 11, pace: 1.15, stuckFails: 1, joinOffsetMin: 0 },
      { nickname: "지호", reach: 9, pace: 1.2, stuckFails: 2, extraFails: { 7: 1 }, joinOffsetMin: 4 },
      { nickname: "다은", reach: 9, pace: 1.3, joinOffsetMin: 2 },
      { nickname: "승민", reach: 8, pace: 1.25, stuckFails: 2, extraFails: { 3: 2 }, joinOffsetMin: 1 },
      { nickname: "소율", reach: 7, pace: 1.35, stuckFails: 1, joinOffsetMin: 3 },
      { nickname: "예린", reach: 6, pace: 1.3, stuckFails: 3, extraFails: { 3: 2 }, joinOffsetMin: 2 },
      { nickname: "태윤", reach: 5, pace: 1.4, stuckFails: 2, joinOffsetMin: 5 },
      { nickname: "건우", reach: 4, pace: 1.45, stuckFails: 3, extraFails: { 1: 1, 2: 2 }, joinOffsetMin: 3 },
      { nickname: "민재", reach: 0, joinOffsetMin: 11 }, // 입장만 하고 시작하지 않음
    ],
  },
  {
    classCode: "275064",
    title: "방과후 파이썬반 · 4주차 복습 활동",
    createdAt: "2026-05-27T05:55:00.000Z", // KST 14:55
    startOffsetMin: 6,
    durationMin: 45,
    seed: 20260527,
    students: [
      { nickname: "윤서", reach: 18, pace: 0.75 },
      { nickname: "이안", reach: 18, pace: 0.85, extraFails: { 13: 1 } },
      { nickname: "하린", reach: 17, pace: 0.9, skips: [11] },
      { nickname: "주원", reach: 16, pace: 0.95, extraFails: { 12: 2 } },
      { nickname: "서진", reach: 15, pace: 1.0, stuckFails: 1 },
      { nickname: "나윤", reach: 14, pace: 1.05, skips: [9], stuckFails: 2 },
      { nickname: "은우", reach: 12, pace: 1.1, stuckFails: 2, extraFails: { 9: 2 } },
      { nickname: "시아", reach: 11, pace: 1.15, stuckFails: 1 },
      { nickname: "로운", reach: 10, pace: 1.2, extraFails: { 6: 1 } },
      { nickname: "다온", reach: 9, pace: 1.25, stuckFails: 2 },
      { nickname: "예준", reach: 7, pace: 1.3, stuckFails: 3, extraFails: { 2: 1 } },
      { nickname: "세아", reach: 3, pace: 1.4, stuckFails: 2, joinOffsetMin: 9 },
    ],
  },
  {
    classCode: "618390",
    title: "정보 동아리 체험 수업 · 코드룸 시범 운영",
    createdAt: "2026-05-13T06:28:00.000Z", // KST 15:28
    startOffsetMin: 5,
    durationMin: 40,
    seed: 20260513,
    students: [
      { nickname: "지민", reach: 18, pace: 0.8 },
      { nickname: "태오", reach: 16, pace: 0.95, extraFails: { 11: 1 } },
      { nickname: "라온", reach: 14, pace: 1.0, skips: [13] },
      { nickname: "윤아", reach: 12, pace: 1.1, stuckFails: 1 },
      { nickname: "건", reach: 11, pace: 1.1, stuckFails: 2 },
      { nickname: "소민", reach: 9, pace: 1.2, extraFails: { 7: 2 } },
      { nickname: "후", reach: 8, pace: 1.25, stuckFails: 2 },
      { nickname: "아린", reach: 6, pace: 1.3, stuckFails: 1 },
      { nickname: "도하", reach: 5, pace: 1.35, stuckFails: 3, extraFails: { 1: 1 } },
    ],
  },
];

// ───────────────────────── 조회 API ─────────────────────────

let cachedRecords: Map<string, DemoClassRecord> | null = null;

function getRecordMap(): Map<string, DemoClassRecord> {
  if (!cachedRecords) {
    cachedRecords = new Map(
      DEMO_CLASS_SPECS.map((spec) => [spec.classCode, buildClassRecord(spec)]),
    );
  }
  return cachedRecords;
}

export function isDemoClassCode(classCode: string): boolean {
  return getRecordMap().has(classCode);
}

export function getDemoClassRecord(classCode: string): DemoClassRecord | undefined {
  return getRecordMap().get(classCode);
}

/** 최신 수업이 앞에 오도록 정렬해 반환 */
export function getDemoClassRecords(): DemoClassRecord[] {
  return [...getRecordMap().values()].sort((a, b) =>
    (b.session.createdAt ?? "").localeCompare(a.session.createdAt ?? ""),
  );
}
