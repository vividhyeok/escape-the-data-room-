import type { Puzzle, ReferenceItem, RoomHint } from "./types";

function ref(label: string, description: string): ReferenceItem {
  return { label, description };
}

function hint(id: string, roomId: string, puzzleId: string, text: string): RoomHint {
  return { id, roomId, puzzleId, text, description: text, value: text };
}

export const puzzles: Puzzle[] = [
  // ==========================================
  // ROOM 0: 파이썬 기초 (변수, 인덱싱, 슬라이싱, 길이)
  // ==========================================
  {
    id: "room-0-pattern-tiles", roomId: "room-0", objectId: "room-0-pattern-tiles",
    title: "튜토리얼: 첫 할당",
    situationText: "가장 기본적인 파이썬 문법은 변수에 값을 할당하는 것이다. data 변수에 있는 값을 answer 변수에 그대로 저장하라.",
    dataText: "100",
    testCases: [
      { inputCode: "data = 100", expectedOutput: 100 },
      { inputCode: "data = 42", expectedOutput: 42 }
    ],
    requiredSyntax: ["Assign"], bannedSyntax: [],
    referenceItems: [ref("answer = ...", "answer 변수에 값을 할당합니다.")],
    rewardHint: hint("room-0-hint-tiles", "room-0", "room-0-pattern-tiles", "할당은 파이썬의 기본이다."),
    starterCode: "# data 변수가 시스템에 의해 이미 주어져 있습니다.\n# data의 값을 그대로 answer에 할당하세요.\n",
    isRequired: true, requiredForDoor: true, doorCodePosition: 1, doorCodePiece: "8", puzzleType: "code"
  },
  {
    id: "room-0-tv-sequence", roomId: "room-0", objectId: "room-0-tv-sequence",
    title: "튜토리얼: 연산",
    situationText: "파이썬에서는 사칙연산이 가능하다. 주어진 data 숫자에 10을 더하여 answer에 할당하라.",
    dataText: "A B C D E", // InspectModal의 TV 화면용 더미 워드
    testCases: [
      { inputCode: "data = 5", expectedOutput: 15 },
      { inputCode: "data = 10", expectedOutput: 20 }
    ],
    requiredSyntax: ["BinOp"], bannedSyntax: [],
    referenceItems: [ref("+ 연산자", "두 숫자를 더합니다.")],
    rewardHint: hint("room-0-hint-crt-tv", "room-0", "room-0-tv-sequence", "문이 열릴지도 모른다..."),
    starterCode: "# data 변수가 시스템에 의해 주어집니다. (숫자)\n# data에 10을 더한 값을 answer에 저장하세요.\n",
    isRequired: true, requiredForDoor: true, doorCodePosition: 2, doorCodePiece: "5", puzzleType: "code"
  },
  {
    id: "room-0-desk-terminal", roomId: "room-0", objectId: "room-0-desk-terminal",
    title: "문자열 인덱싱",
    situationText: "터미널에 문자열이 주어진다. 파이썬의 인덱싱(Indexing)을 사용해 첫 번째 글자를 가져와라.",
    dataText: "SYSTEM",
    testCases: [
      { inputCode: "data = 'SYSTEM'", expectedOutput: "S" },
      { inputCode: "data = 'HELLO'", expectedOutput: "H" }
    ],
    requiredSyntax: ["Subscript"], bannedSyntax: [],
    referenceItems: [ref("문자열[0]", "첫 번째 글자를 가져옵니다.")],
    rewardHint: hint("room-0-hint-terminal", "room-0", "room-0-desk-terminal", "데이터의 시작은 늘 0이다."),
    starterCode: "# data 변수(문자열)의 첫 번째 글자를 answer에 저장하세요.\n",
    isRequired: true, requiredForDoor: true, doorCodePosition: 3, doorCodePiece: "2", puzzleType: "code"
  },
  {
    id: "room-0-mini-ox-card", roomId: "room-0", objectId: "room-0-mini-ox-card",
    title: "문자열 슬라이싱",
    situationText: "파이썬의 슬라이싱(Slicing)을 사용해 앞에서부터 3글자만 잘라내라.",
    dataText: "PYTHON",
    testCases: [
      { inputCode: "data = 'PYTHON'", expectedOutput: "PYT" },
      { inputCode: "data = 'ESCAPE'", expectedOutput: "ESC" }
    ],
    requiredSyntax: ["Slice"], bannedSyntax: [],
    referenceItems: [ref("문자열[0:3]", "앞에서 3글자를 자릅니다.")],
    rewardHint: hint("room-0-hint-ox", "room-0", "room-0-mini-ox-card", "슬라이싱 [시작:끝]"),
    starterCode: "# data 변수의 앞에서 3글자를 잘라 answer에 저장하세요.\n",
    isRequired: true, requiredForDoor: true, doorCodePosition: 4, doorCodePiece: "2", puzzleType: "code"
  },
  {
    id: "room-0-name-tags", roomId: "room-0", objectId: "room-0-name-tags",
    title: "길이 구하기 (선택)",
    situationText: "문자열의 길이를 구하여라.",
    dataText: "len()",
    testCases: [
      { inputCode: "data = 'PYTHON'", expectedOutput: 6 },
      { inputCode: "data = 'XYZ'", expectedOutput: 3 }
    ],
    requiredSyntax: ["len"], bannedSyntax: [], referenceItems: [],
    rewardHint: hint("room-0-hint-names", "room-0", "room-0-name-tags", "len() 함수"),
    starterCode: "# data 변수의 길이를 구해 answer에 저장하세요.\n",
    isRequired: false, requiredForDoor: false, isHidden: true, puzzleType: "code"
  },
  {
    id: "room-0-bookshelf-note", roomId: "room-0", objectId: "room-0-bookshelf-note",
    title: "문자열 반복 (선택)",
    situationText: "주어진 문자열을 3번 반복하여라.",
    dataText: "* 연산자",
    testCases: [
      { inputCode: "data = 'A'", expectedOutput: 'AAA' }
    ],
    requiredSyntax: ["BinOp"], bannedSyntax: [], referenceItems: [],
    rewardHint: hint("room-0-hint-note", "room-0", "room-0-bookshelf-note", "문자열 곱셈"),
    starterCode: "# data 변수를 3번 반복한 문자열을 answer에 저장하세요.\n",
    isRequired: false, requiredForDoor: false, isHidden: true, puzzleType: "code"
  },

  // ==========================================
  // ROOM 1: 문자열 메서드 & 조건문
  // ==========================================
  {
    id: "room-1-word-billboard", roomId: "room-1", objectId: "room-1-word-billboard",
    title: "대문자 변환",
    situationText: "문자열을 모두 대문자로 변환하라.",
    dataText: "lower case words",
    testCases: [
      { inputCode: "data = 'hello'", expectedOutput: 'HELLO' },
      { inputCode: "data = 'python'", expectedOutput: 'PYTHON' }
    ],
    requiredSyntax: ["upper"], bannedSyntax: [],
    referenceItems: [ref("문자열.upper()", "대문자로 변환")],
    rewardHint: hint("room-1-hint-word", "room-1", "room-1-word-billboard", "upper()"),
    starterCode: "# data 변수의 문자열을 대문자로 바꾸어 answer에 저장하세요.\n",
    isRequired: true, requiredForDoor: true, doorCodePosition: 1, doorCodePiece: "7", puzzleType: "code"
  },
  {
    id: "room-1-ox-monitor", roomId: "room-1", objectId: "room-1-ox-monitor",
    title: "문자열 교체",
    situationText: "data 문자열에서 'X'를 'O'로 모두 교체하라.",
    dataText: "X X O\nO X X",
    testCases: [
      { inputCode: "data = 'X O X'", expectedOutput: 'O O O' },
      { inputCode: "data = 'X X'", expectedOutput: 'O O' }
    ],
    requiredSyntax: ["replace"], bannedSyntax: [],
    referenceItems: [ref("문자열.replace('A','B')", "A를 B로 교체")],
    rewardHint: hint("room-1-hint-ox", "room-1", "room-1-ox-monitor", "replace()"),
    starterCode: "# data 문자열의 'X'를 'O'로 바꾼 결과를 answer에 저장하세요.\n",
    isRequired: true, requiredForDoor: true, doorCodePosition: 2, doorCodePiece: "4", puzzleType: "code"
  },
  {
    id: "room-1-number-panel", roomId: "room-1", objectId: "room-1-number-panel",
    title: "문자열 분리",
    situationText: "공백으로 구분된 data를 리스트로 분리해라.",
    dataText: "10 20 30",
    testCases: [
      { inputCode: "data = 'A B C'", expectedOutput: ['A', 'B', 'C'] }
    ],
    requiredSyntax: ["split"], bannedSyntax: [],
    referenceItems: [ref("문자열.split()", "공백 기준으로 리스트 분리")],
    rewardHint: hint("room-1-hint-num", "room-1", "room-1-number-panel", "split()"),
    starterCode: "# data 문자열을 공백으로 쪼개서 리스트 형태로 answer에 저장하세요.\n",
    isRequired: true, requiredForDoor: true, doorCodePosition: 3, doorCodePiece: "7", puzzleType: "code"
  },
  {
    id: "room-1-radio-signal", roomId: "room-1", objectId: "room-1-radio-signal",
    title: "조건문 기초",
    situationText: "data가 100 이상이면 'PASS', 아니면 'FAIL'을 저장하라.",
    dataText: "99\n101",
    testCases: [
      { inputCode: "data = 100", expectedOutput: 'PASS' },
      { inputCode: "data = 50", expectedOutput: 'FAIL' }
    ],
    requiredSyntax: ["If", "IfExp"], bannedSyntax: [],
    referenceItems: [ref("if 조건:", "조건문")],
    rewardHint: hint("room-1-hint-radio", "room-1", "room-1-radio-signal", "if ~ else ~"),
    starterCode: "# data가 100 이상이면 answer = 'PASS', 아니면 answer = 'FAIL'이 되도록 하세요.\n",
    isRequired: true, requiredForDoor: true, doorCodePosition: 4, doorCodePiece: "9", puzzleType: "code"
  },
  {
    id: "room-1-name-card", roomId: "room-1", objectId: "room-1-name-card",
    title: "조건문 (선택)",
    situationText: "data가 짝수면 True, 홀수면 False.",
    dataText: "2 4 5",
    testCases: [
      { inputCode: "data = 4", expectedOutput: true },
      { inputCode: "data = 5", expectedOutput: false }
    ],
    requiredSyntax: [], bannedSyntax: [], referenceItems: [],
    rewardHint: hint("room-1-hint-name", "room-1", "room-1-name-card", "나머지 연산자 %"),
    starterCode: "# data가 짝수면 answer = True, 홀수면 False를 저장하세요.\n",
    isRequired: false, requiredForDoor: false, isHidden: true, puzzleType: "code"
  },
  {
    id: "room-1-checksum-tablet", roomId: "room-1", objectId: "room-1-checksum-tablet",
    title: "논리 연산 (선택)",
    situationText: "data가 0보다 크고 10보다 작으면 True, 아니면 False.",
    dataText: "515-1",
    testCases: [
      { inputCode: "data = 5", expectedOutput: true },
      { inputCode: "data = 15", expectedOutput: false }
    ],
    requiredSyntax: [], bannedSyntax: [], referenceItems: [],
    rewardHint: hint("room-1-hint-noise", "room-1", "room-1-checksum-tablet", "and 연산자"),
    starterCode: "# data가 0보다 크고 10보다 작으면 answer = True, 아니면 False를 저장하세요.\n",
    isRequired: false, requiredForDoor: false, isHidden: true, puzzleType: "code"
  },

  // ==========================================
  // ROOM 2: 리스트와 반복문
  // ==========================================
  {
    id: "room-2-file-cabinet", roomId: "room-2", objectId: "room-2-file-cabinet",
    title: "리스트 원소 합",
    situationText: "data에 숫자들이 들어있는 리스트가 주어진다. 모든 숫자의 합을 구하라. (sum() 함수는 금지됨. for문 사용)",
    dataText: "[10, 20, 30]",
    testCases: [
      { inputCode: "data = [1, 2, 3]", expectedOutput: 6 },
      { inputCode: "data = [10, 20]", expectedOutput: 30 }
    ],
    requiredSyntax: ["For"], bannedSyntax: ["sum"],
    referenceItems: [ref("for x in list:", "반복문")],
    rewardHint: hint("room-2-hint-file", "room-2", "room-2-file-cabinet", "누적 변수 활용"),
    starterCode: "# for문을 이용해 data 리스트의 모든 숫자를 더한 값을 answer에 저장하세요.\n",
    isRequired: true, requiredForDoor: true, doorCodePosition: 1, doorCodePiece: "3", puzzleType: "code"
  },
  {
    id: "room-2-broken-tags", roomId: "room-2", objectId: "room-2-broken-tags",
    title: "리스트 필터링",
    situationText: "data 리스트에서 0보다 큰 숫자만 골라 새로운 리스트로 만들어라.",
    dataText: "[-1, 5, 0, 3]",
    testCases: [
      { inputCode: "data = [-1, 5, 0, 3]", expectedOutput: [5, 3] },
      { inputCode: "data = [1, -2, 3]", expectedOutput: [1, 3] }
    ],
    requiredSyntax: ["For", "If"], bannedSyntax: ["filter"],
    referenceItems: [ref("list.append(x)", "리스트에 원소 추가")],
    rewardHint: hint("room-2-hint-tags", "room-2", "room-2-broken-tags", "append() 메서드"),
    starterCode: "# for문과 if문을 사용하여 data 리스트 중 양수만 담긴 새 리스트를 answer에 저장하세요.\n",
    isRequired: true, requiredForDoor: true, doorCodePosition: 2, doorCodePiece: "5", puzzleType: "code"
  },
  {
    id: "room-2-score-board", roomId: "room-2", objectId: "room-2-score-board",
    title: "딕셔너리 접근",
    situationText: "data는 딕셔너리다. 'score'라는 키의 값을 가져와라.",
    dataText: "{'score': 100}",
    testCases: [
      { inputCode: "data = {'score': 88}", expectedOutput: 88 }
    ],
    requiredSyntax: ["Subscript"], bannedSyntax: [],
    referenceItems: [ref("dict['key']", "딕셔너리 값 접근")],
    rewardHint: hint("room-2-hint-score", "room-2", "room-2-score-board", "딕셔너리 기초"),
    starterCode: "# data 딕셔너리에서 'score' 키에 해당하는 값을 answer에 저장하세요.\n",
    isRequired: true, requiredForDoor: true, doorCodePosition: 3, doorCodePiece: "4", puzzleType: "code"
  },
  {
    id: "room-2-access-log", roomId: "room-2", objectId: "room-2-access-log",
    title: "리스트 내포 (선택)",
    situationText: "리스트 컴프리헨션을 사용해 data의 모든 숫자를 2배로 만들어라.",
    dataText: "[1, 2, 3]",
    testCases: [
      { inputCode: "data = [1, 2, 3]", expectedOutput: [2, 4, 6] }
    ],
    requiredSyntax: ["ListComp"], bannedSyntax: [],
    referenceItems: [ref("[x*2 for x in list]", "리스트 컴프리헨션")],
    rewardHint: hint("room-2-hint-log", "room-2", "room-2-access-log", "List Comprehension"),
    starterCode: "# 리스트 컴프리헨션을 사용하여 data 안의 숫자들을 2배로 만든 리스트를 answer에 저장하세요.\n",
    isRequired: false, requiredForDoor: false, isHidden: true, puzzleType: "code"
  },
  {
    id: "room-2-timeline", roomId: "room-2", objectId: "room-2-timeline",
    title: "while 반복문",
    situationText: "data 숫자부터 1씩 빼서 0이 되기 전까지의 숫자를 리스트에 담아라. (while문 사용)",
    dataText: "3",
    testCases: [
      { inputCode: "data = 3", expectedOutput: [3, 2, 1] },
      { inputCode: "data = 5", expectedOutput: [5, 4, 3, 2, 1] }
    ],
    requiredSyntax: ["While"], bannedSyntax: [],
    referenceItems: [ref("while 조건:", "조건이 참일 동안 반복")],
    rewardHint: hint("room-2-hint-time", "room-2", "room-2-timeline", "while 반복"),
    starterCode: "# while문을 사용해 data, data-1 ... 1 까지의 숫자를 담은 리스트를 answer에 저장하세요.\n",
    isRequired: true, requiredForDoor: true, doorCodePosition: 4, doorCodePiece: "7", puzzleType: "code"
  },
  {
    id: "room-2-checksum-ledger", roomId: "room-2", objectId: "room-2-checksum-ledger",
    title: "반복문과 문자열 (선택)",
    situationText: "data 문자열에서 모음(a,e,i,o,u)을 모두 제거하라.",
    dataText: "apple",
    testCases: [
      { inputCode: "data = 'apple'", expectedOutput: 'ppl' }
    ],
    requiredSyntax: ["For"], bannedSyntax: [],
    referenceItems: [], rewardHint: hint("room-2-hint-checksum", "room-2", "room-2-checksum-ledger", "in 문자열"),
    starterCode: "# 반복문을 이용해 모음을 제외한 글자들만 합친 문자열을 answer에 저장하세요.\n",
    isRequired: false, requiredForDoor: false, isHidden: true, puzzleType: "code"
  },

  // ==========================================
  // ROOM 3 (리뷰 방) : 최종 종합 평가
  // ==========================================
  {
    id: "room-3-validator", roomId: "room-3", objectId: "room-3-validator",
    title: "Review: 기초 점검",
    situationText: "문자열을 뒤집어라. (슬라이싱 사용)",
    dataText: "PYTHON",
    testCases: [
      { inputCode: "data = 'ABC'", expectedOutput: 'CBA' }
    ],
    requiredSyntax: ["Slice"], bannedSyntax: [],
    referenceItems: [], rewardHint: hint("room-3-hint-1", "room-3", "room-3-validator", "[::-1]"),
    starterCode: "# 슬라이싱을 이용해 data 문자열을 뒤집어서 answer에 저장하세요.\n",
    isRequired: false, requiredForDoor: false, isHidden: true, puzzleType: "code"
  },
  // 다른 Room 3 객체들은 puzzleType이 code가 아님 (리뷰용)
];

export function getPuzzlesForRoom(roomId: string): Puzzle[] {
  return puzzles.filter((p) => p.roomId === roomId);
}

export const puzzlesById = Object.fromEntries(puzzles.map((p) => [p.id, p])) as Record<string, Puzzle>;
