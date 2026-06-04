import type { Puzzle, ReferenceItem, RoomHint } from "./types";

function ref(label: string, description: string): ReferenceItem {
  return { label, description };
}

function hint(id: string, roomId: string, puzzleId: string, text: string): RoomHint {
  return { id, roomId, puzzleId, text, description: text, value: text };
}

export const puzzles: Puzzle[] = [

  // ══════════════════════════════════════════════════════════
  // ROOM 0 · 잠긴 서재
  // 주제: 파이썬 기초 — 변수 할당, 사칙연산, 인덱싱, 슬라이싱
  // 문: 8522
  // ══════════════════════════════════════════════════════════

  {
    id: "room-0-pattern-tiles",
    roomId: "room-0", objectId: "room-0-pattern-tiles",
    title: "변수 할당",
    situationText:
      "먼지 쌓인 타일 상자에 숫자가 깜빡이고 있다.\n" +
      "시스템을 깨우려면 data의 값을 그대로 answer라는 변수에 저장해야 한다.\n" +
      "파이썬에서 = 기호는 오른쪽 값을 왼쪽 변수에 대입한다는 의미다.",
    dataText: "7 3 5 8",
    testCases: [
      { inputCode: "data = 100", expectedOutput: 100 },
      { inputCode: "data = 42",  expectedOutput: 42  },
    ],
    requiredSyntax: ["Assign"], bannedSyntax: [],
    referenceItems: [
      ref("answer = data", "data 변수의 값을 answer에 복사합니다."),
      ref("= 연산자", "파이썬에서 = 는 수학의 같다가 아닌 '저장'을 의미합니다."),
    ],
    rewardHint: hint("room-0-hint-tiles", "room-0", "room-0-pattern-tiles",
      "[코드 조각 획득] 변수는 값을 담는 그릇이다. 첫 번째 열쇠 파편: 8"),
    starterCode:
      "# data 변수에는 시스템이 자동으로 숫자를 넣어 줍니다.\n" +
      "# data의 값을 그대로 answer에 저장해 보세요.\n" +
      "\n" +
      "answer = ___  # ___ 를 data로 바꿔 보세요\n",
    imageUrl: "/assets/images/objects/room-0/pattern-tile-box.png",
    isRequired: true, requiredForDoor: true,
    doorCodePosition: 1, doorCodePiece: "8", puzzleType: "code",
  },

  {
    id: "room-0-tv-sequence",
    roomId: "room-0", objectId: "room-0-tv-sequence",
    title: "사칙연산 · 더하기",
    situationText:
      "낡은 CRT TV 화면에 신호값이 깜빡이고 있다.\n" +
      "수신 장치를 보정하려면 data에 10을 더한 값이 필요하다.\n" +
      "파이썬에서 + 연산자로 두 숫자를 더할 수 있다.",
    dataText: "data + 10 = ?",
    testCases: [
      { inputCode: "data = 5",  expectedOutput: 15 },
      { inputCode: "data = 20", expectedOutput: 30 },
    ],
    requiredSyntax: ["BinOp"], bannedSyntax: [],
    referenceItems: [
      ref("answer = data + 10", "data에 숫자를 더합니다."),
      ref("+ - * /", "파이썬의 기본 사칙연산 기호들입니다."),
    ],
    rewardHint: hint("room-0-hint-crt-tv", "room-0", "room-0-tv-sequence",
      "[코드 조각 획득] 연산으로 신호를 보정했다. 두 번째 열쇠 파편: 5"),
    starterCode:
      "# data에 10을 더한 결과를 answer에 저장하세요.\n" +
      "\n" +
      "answer = data + ___  # ___ 를 숫자로 채우세요\n",
    imageUrl: "/assets/images/objects/room-0/crt-tv.png",
    isRequired: true, requiredForDoor: true,
    doorCodePosition: 2, doorCodePiece: "5", puzzleType: "code",
  },

  {
    id: "room-0-desk-terminal",
    roomId: "room-0", objectId: "room-0-desk-terminal",
    title: "문자열 인덱싱",
    situationText:
      "터미널 화면에 접근 코드 문자열이 표시되어 있다.\n" +
      "잠금 장치는 이 문자열의 첫 번째 글자(인덱스 0)만 인식한다.\n" +
      "파이썬에서 문자열[0] 은 첫 번째 글자를 꺼내는 방법이다.",
    dataText: "SYSTEM",
    testCases: [
      { inputCode: "data = 'SYSTEM'", expectedOutput: "S" },
      { inputCode: "data = 'HELLO'",  expectedOutput: "H" },
    ],
    requiredSyntax: ["Subscript"], bannedSyntax: [],
    referenceItems: [
      ref("data[0]", "인덱스 0 → 첫 번째 글자."),
      ref("data[-1]", "인덱스 -1 → 마지막 글자."),
      ref("인덱스는 0부터 시작", "파이썬에서 첫 번째 위치는 1이 아닌 0입니다."),
    ],
    rewardHint: hint("room-0-hint-terminal", "room-0", "room-0-desk-terminal",
      "[코드 조각 획득] 데이터의 시작은 항상 0이다. 세 번째 열쇠 파편: 2"),
    starterCode:
      "# data 는 문자열 변수입니다.\n" +
      "# 대괄호 [ ] 와 인덱스 번호로 특정 글자를 꺼낼 수 있습니다.\n" +
      "\n" +
      "answer = data[___]  # 첫 번째 글자의 인덱스 번호는?\n",
    imageUrl: "/assets/images/objects/room-0/desk-terminal.png",
    isRequired: true, requiredForDoor: true,
    doorCodePosition: 3, doorCodePiece: "2", puzzleType: "code",
  },

  {
    id: "room-0-mini-ox-card",
    roomId: "room-0", objectId: "room-0-mini-ox-card",
    title: "문자열 슬라이싱",
    situationText:
      "카드에 암호 코드가 한 줄로 적혀 있다.\n" +
      "인증 시스템은 앞 3글자만을 유효한 키로 인식한다.\n" +
      "파이썬의 슬라이싱 data[시작:끝] 으로 원하는 구간만 잘라낼 수 있다.",
    dataText: "P Y T H O N",
    testCases: [
      { inputCode: "data = 'PYTHON'", expectedOutput: "PYT" },
      { inputCode: "data = 'ESCAPE'", expectedOutput: "ESC" },
    ],
    requiredSyntax: ["Slice"], bannedSyntax: [],
    referenceItems: [
      ref("data[0:3]", "인덱스 0부터 2까지(3 미포함) 3글자를 가져옵니다."),
      ref("data[:3]", "시작을 생략하면 처음부터 자릅니다."),
      ref("[시작:끝]", "끝 인덱스의 글자는 포함되지 않습니다."),
    ],
    rewardHint: hint("room-0-hint-ox", "room-0", "room-0-mini-ox-card",
      "[코드 조각 획득] 슬라이싱으로 코드를 잘라냈다. 네 번째 열쇠 파편: 2"),
    starterCode:
      "# 슬라이싱으로 data의 앞 3글자를 잘라내세요.\n" +
      "# data[시작:끝] 형태로 작성합니다.\n" +
      "\n" +
      "answer = data[___:___]  # 앞 3글자를 가져오려면?\n",
    imageUrl: "/assets/images/objects/room-0/mini-ox-card.png",
    isRequired: true, requiredForDoor: true,
    doorCodePosition: 4, doorCodePiece: "2", puzzleType: "code",
  },

  {
    id: "room-0-name-tags",
    roomId: "room-0", objectId: "room-0-name-tags",
    title: "길이 구하기",
    situationText:
      "서랍 속 명찰에 이름들이 적혀 있다.\n" +
      "숨겨진 자물쇠의 암호는 문자열의 글자 수다.\n" +
      "len() 함수는 문자열이나 리스트의 길이(개수)를 반환한다.",
    dataText: "ALPHA BRAVO DELTA",
    testCases: [
      { inputCode: "data = 'PYTHON'", expectedOutput: 6 },
      { inputCode: "data = 'XYZ'",    expectedOutput: 3 },
    ],
    requiredSyntax: ["len"], bannedSyntax: [],
    referenceItems: [
      ref("len(data)", "data의 글자 수(길이)를 반환합니다."),
      ref("len('ABC') == 3", "3글자이므로 3을 반환합니다."),
    ],
    rewardHint: hint("room-0-hint-names", "room-0", "room-0-name-tags",
      "[보너스 단서] len()으로 길이를 셀 수 있다. 글자 수 = 힘이다."),
    starterCode:
      "# len() 함수로 data의 글자 수를 구하세요.\n" +
      "\n" +
      "answer = len(___)  # 괄호 안에 무엇을 넣어야 할까요?\n",
    imageUrl: "/assets/images/objects/room-0/name-tags-bundle.png",
    isRequired: false, requiredForDoor: false, isHidden: true, puzzleType: "code",
  },

  {
    id: "room-0-bookshelf-note",
    roomId: "room-0", objectId: "room-0-bookshelf-note",
    title: "문자열 반복",
    situationText:
      "책장 뒤에 꽂힌 쪽지에 암호화 공식이 적혀 있다.\n" +
      "암호 패턴은 시드 문자열을 3번 반복한 것이다.\n" +
      "파이썬에서 문자열 * 숫자 로 반복 문자열을 만들 수 있다.",
    dataText: "파이썬에서 문자열을 n번 반복하려면:\n'문자열' * n\n예: 'AB' * 3 = 'ABABAB'",
    testCases: [
      { inputCode: "data = 'A'",    expectedOutput: "AAA"      },
      { inputCode: "data = 'AB'",   expectedOutput: "ABABAB"   },
      { inputCode: "data = 'XY'",   expectedOutput: "XYXYXY"   },
    ],
    requiredSyntax: ["BinOp"], bannedSyntax: [],
    referenceItems: [
      ref("data * 3", "data 문자열을 3번 반복합니다."),
      ref("'Ha' * 3 == 'HaHaHa'", "문자열에 * 연산자를 사용합니다."),
    ],
    rewardHint: hint("room-0-hint-note", "room-0", "room-0-bookshelf-note",
      "[보너스 단서] 반복은 곱셈이다. 문자열에도 * 를 쓸 수 있다."),
    starterCode:
      "# data 문자열을 3번 반복한 결과를 answer에 저장하세요.\n" +
      "\n" +
      "answer = data * ___  # 몇 번 반복할까요?\n",
    imageUrl: "/assets/images/objects/room-0/bookshelf-note.png",
    isRequired: false, requiredForDoor: false, isHidden: true, puzzleType: "code",
  },


  // ══════════════════════════════════════════════════════════
  // ROOM 1 · 신호실
  // 주제: 문자열 메서드 (upper, replace, split) & 조건문 (if/else)
  // 문: 7479
  // ══════════════════════════════════════════════════════════

  {
    id: "room-1-word-billboard",
    roomId: "room-1", objectId: "room-1-word-billboard",
    title: "대문자 정규화",
    situationText:
      "전광판에 소문자 코드가 흐르고 있다.\n" +
      "보안 레이어는 대문자 코드만 통과시킨다.\n" +
      ".upper() 메서드를 사용해 data 문자열을 모두 대문자로 바꾸어라.",
    dataText: "hello world python",
    testCases: [
      { inputCode: "data = 'hello'",  expectedOutput: "HELLO"  },
      { inputCode: "data = 'python'", expectedOutput: "PYTHON" },
      { inputCode: "data = 'signal'", expectedOutput: "SIGNAL" },
    ],
    requiredSyntax: ["upper"], bannedSyntax: [],
    referenceItems: [
      ref("data.upper()", "문자열을 모두 대문자로 변환합니다."),
      ref("data.lower()", "참고: 모두 소문자로 변환합니다."),
    ],
    rewardHint: hint("room-1-hint-word", "room-1", "room-1-word-billboard",
      "[코드 조각 획득] 신호가 정규화됐다. 첫 번째 열쇠 파편: 7"),
    starterCode:
      "# .upper() 메서드를 사용해 대문자로 변환하세요.\n" +
      "# 사용법: 문자열.upper()\n" +
      "\n" +
      "answer = data.___()  # ___ 자리에 메서드 이름을 입력하세요\n",
    imageUrl: "/assets/images/objects/room-1/word-billboard.png",
    isRequired: true, requiredForDoor: true,
    doorCodePosition: 1, doorCodePiece: "7", puzzleType: "code",
  },

  {
    id: "room-1-ox-monitor",
    roomId: "room-1", objectId: "room-1-ox-monitor",
    title: "오류 신호 복구",
    situationText:
      "모니터가 손상되어 'O' 신호가 전부 'X'로 잘못 출력되고 있다.\n" +
      ".replace() 메서드로 'X'를 'O'로 바꾸어 원래 신호를 복구하라.\n" +
      "사용법: 문자열.replace('바꿀 것', '바꿀 내용')",
    dataText: "X X O X\nO X O X\nX X X O",
    testCases: [
      { inputCode: "data = 'X O X'", expectedOutput: "O O O" },
      { inputCode: "data = 'X X X'", expectedOutput: "O O O" },
      { inputCode: "data = 'X O O'", expectedOutput: "O O O" },
    ],
    requiredSyntax: ["replace"], bannedSyntax: [],
    referenceItems: [
      ref("data.replace('X', 'O')", "'X'를 모두 'O'로 교체합니다."),
      ref("replace(찾을것, 바꿀것)", "첫 번째 인수를 두 번째로 모두 바꿉니다."),
    ],
    rewardHint: hint("room-1-hint-ox", "room-1", "room-1-ox-monitor",
      "[코드 조각 획득] 오염된 신호가 복구됐다. 두 번째 열쇠 파편: 4"),
    starterCode:
      "# .replace() 메서드로 'X'를 'O'로 바꾸세요.\n" +
      "\n" +
      "answer = data.replace(___, ___)  # ('바꿀것', '바꿀내용') 형태\n",
    imageUrl: "/assets/images/objects/room-1/ox-monitor.png",
    isRequired: true, requiredForDoor: true,
    doorCodePosition: 2, doorCodePiece: "4", puzzleType: "code",
  },

  {
    id: "room-1-number-panel",
    roomId: "room-1", objectId: "room-1-number-panel",
    title: "코드 분리",
    situationText:
      "패널에 공백으로 구분된 여러 개의 코드가 한 줄로 표시되어 있다.\n" +
      ".split() 메서드로 문자열을 공백 기준으로 분리하면 리스트가 된다.\n" +
      "분리된 리스트를 answer에 저장하라.",
    dataText: "ALPHA BRAVO CHARLIE DELTA",
    testCases: [
      { inputCode: "data = 'A B C'",    expectedOutput: ["A", "B", "C"]          },
      { inputCode: "data = 'X Y Z W'",  expectedOutput: ["X", "Y", "Z", "W"]     },
    ],
    requiredSyntax: ["split"], bannedSyntax: [],
    referenceItems: [
      ref("data.split()", "공백을 기준으로 나눠 리스트를 반환합니다."),
      ref("data.split(',')", "쉼표 기준으로 나눌 때는 구분자를 지정합니다."),
    ],
    rewardHint: hint("room-1-hint-num", "room-1", "room-1-number-panel",
      "[코드 조각 획득] 코드가 분리됐다. 세 번째 열쇠 파편: 7"),
    starterCode:
      "# .split() 메서드로 data를 공백 기준으로 나누세요.\n" +
      "# 결과는 리스트(목록) 형태입니다.\n" +
      "\n" +
      "answer = data.___()  # 공백으로 나누는 메서드는?\n",
    imageUrl: "/assets/images/objects/room-1/number-panel.png",
    isRequired: true, requiredForDoor: true,
    doorCodePosition: 3, doorCodePiece: "7", puzzleType: "code",
  },

  {
    id: "room-1-radio-signal",
    roomId: "room-1", objectId: "room-1-radio-signal",
    title: "신호 강도 판별",
    situationText:
      "라디오 수신기에 신호 강도값이 잡혔다.\n" +
      "100 이상이면 수신 성공('PASS'), 미만이면 수신 실패('FAIL')로 판정한다.\n" +
      "if/else 조건문으로 두 경우를 나누어 answer에 저장하라.",
    dataText: "085.7\n100.3\n112.9\n097.5",
    testCases: [
      { inputCode: "data = 100", expectedOutput: "PASS" },
      { inputCode: "data = 99",  expectedOutput: "FAIL" },
      { inputCode: "data = 50",  expectedOutput: "FAIL" },
    ],
    requiredSyntax: ["If"], bannedSyntax: [],
    referenceItems: [
      ref("if 조건:", "조건이 참이면 if 블록을 실행합니다."),
      ref("else:", "조건이 거짓이면 else 블록을 실행합니다."),
      ref(">= 연산자", "'이상' 조건에 사용합니다. 예: data >= 100"),
    ],
    rewardHint: hint("room-1-hint-radio", "room-1", "room-1-radio-signal",
      "[코드 조각 획득] 신호 강도가 판별됐다. 네 번째 열쇠 파편: 9"),
    starterCode:
      "# if/else 로 data의 크기에 따라 다른 값을 저장하세요.\n" +
      "\n" +
      "if data >= ___:       # 조건: data가 얼마 이상이면?\n" +
      "    answer = 'PASS'\n" +
      "else:\n" +
      "    answer = 'FAIL'\n",
    imageUrl: "/assets/images/objects/room-1/radio-signal-device.png",
    isRequired: true, requiredForDoor: true,
    doorCodePosition: 4, doorCodePiece: "9", puzzleType: "code",
  },

  {
    id: "room-1-name-card",
    roomId: "room-1", objectId: "room-1-name-card",
    title: "짝수 판별",
    situationText:
      "명함 보드의 출입 번호 시스템은 짝수 번호만 허용한다.\n" +
      "% 연산자(나머지)를 이용해 data가 짝수면 True, 홀수면 False를 저장하라.\n" +
      "짝수는 2로 나눴을 때 나머지가 0이다.",
    dataText: "2 4 5 7 8",
    testCases: [
      { inputCode: "data = 4",  expectedOutput: true  },
      { inputCode: "data = 5",  expectedOutput: false },
      { inputCode: "data = 10", expectedOutput: true  },
    ],
    requiredSyntax: [], bannedSyntax: [],
    referenceItems: [
      ref("data % 2 == 0", "나머지가 0이면 짝수입니다."),
      ref("% 연산자", "나머지를 구합니다. 예: 7 % 2 == 1"),
    ],
    rewardHint: hint("room-1-hint-name", "room-1", "room-1-name-card",
      "[보너스 단서] 나머지 연산 % 로 짝수를 판별했다."),
    starterCode:
      "# data가 짝수면 True, 홀수면 False를 저장하세요.\n" +
      "# 힌트: 짝수는 2로 나눈 나머지가 0입니다.\n" +
      "\n" +
      "if data % 2 == ___:\n" +
      "    answer = True\n" +
      "else:\n" +
      "    answer = False\n",
    imageUrl: "/assets/images/objects/room-1/name-card-board.png",
    isRequired: false, requiredForDoor: false, isHidden: true, puzzleType: "code",
  },

  {
    id: "room-1-checksum-tablet",
    roomId: "room-1", objectId: "room-1-checksum-tablet",
    title: "범위 검증",
    situationText:
      "스트립에 기록된 유효 범위는 0 초과, 10 미만이다.\n" +
      "두 조건을 동시에 확인하려면 and 논리 연산자를 사용한다.\n" +
      "data가 유효 범위 안이면 True, 아니면 False를 answer에 저장하라.",
    dataText: "5 1 5 - 1 A",
    testCases: [
      { inputCode: "data = 5",  expectedOutput: true  },
      { inputCode: "data = 10", expectedOutput: false },
      { inputCode: "data = 0",  expectedOutput: false },
    ],
    requiredSyntax: [], bannedSyntax: [],
    referenceItems: [
      ref("and 연산자", "두 조건이 모두 참일 때만 True입니다."),
      ref("0 < data < 10", "파이썬은 이런 연속 비교도 허용합니다."),
    ],
    rewardHint: hint("room-1-hint-noise", "room-1", "room-1-checksum-tablet",
      "[보너스 단서] and 로 두 조건을 동시에 검사했다."),
    starterCode:
      "# 두 조건을 and 로 연결하세요.\n" +
      "# 조건1: data가 0보다 크다  조건2: data가 10보다 작다\n" +
      "\n" +
      "answer = data > ___ and data < ___\n",
    imageUrl: "/assets/images/objects/room-1/noise-strip.png",
    isRequired: false, requiredForDoor: false, isHidden: true, puzzleType: "code",
  },


  // ══════════════════════════════════════════════════════════
  // ROOM 2 · 기록실
  // 주제: 리스트 반복문 (for/while), 딕셔너리
  // 문: 3547
  // ══════════════════════════════════════════════════════════

  {
    id: "room-2-file-cabinet",
    roomId: "room-2", objectId: "room-2-file-cabinet",
    title: "누적 합계",
    situationText:
      "파일 캐비닛에 접속 횟수 기록이 리스트로 저장되어 있다.\n" +
      "for 반복문으로 리스트를 순회하며 모든 숫자를 더한 총합을 구하라.\n" +
      "누적 변수를 만들고 각 항목을 하나씩 더해나가는 것이 핵심이다. (sum() 사용 금지)",
    dataText: "FILE_01 / 12 / success\nFILE_02 / 08 / success\nFILE_03 / 24 / success\nFILE_04 / 05 / error",
    testCases: [
      { inputCode: "data = [1, 2, 3]",   expectedOutput: 6  },
      { inputCode: "data = [10, 20, 30]", expectedOutput: 60 },
      { inputCode: "data = [5, 5]",       expectedOutput: 10 },
    ],
    requiredSyntax: ["For"], bannedSyntax: ["sum"],
    referenceItems: [
      ref("for x in data:", "data 리스트를 한 항목씩 순서대로 꺼냅니다."),
      ref("total = 0", "누적할 변수를 먼저 0으로 초기화합니다."),
      ref("total = total + x", "반복할 때마다 total에 x를 더합니다."),
    ],
    rewardHint: hint("room-2-hint-file", "room-2", "room-2-file-cabinet",
      "[코드 조각 획득] 기록을 집계했다. 첫 번째 열쇠 파편: 3"),
    starterCode:
      "# for문으로 리스트를 순회하며 합계를 구하세요.\n" +
      "# sum() 함수는 사용할 수 없습니다!\n" +
      "\n" +
      "total = 0           # 누적 변수 초기화\n" +
      "for x in data:\n" +
      "    total = total + ___   # 각 항목을 더하세요\n" +
      "\n" +
      "answer = total\n",
    imageUrl: "/assets/images/objects/room-2/file-cabinet.png",
    isRequired: true, requiredForDoor: true,
    doorCodePosition: 1, doorCodePiece: "3", puzzleType: "code",
  },

  {
    id: "room-2-broken-tags",
    roomId: "room-2", objectId: "room-2-broken-tags",
    title: "양수 필터링",
    situationText:
      "손상된 명찰 데이터에 음수(잘못된 값)가 섞여 있다.\n" +
      "for문과 if문을 조합해 0보다 큰 값만 골라 새 리스트로 만들어라.\n" +
      "빈 리스트에 .append() 로 원소를 하나씩 추가한다.",
    dataText: "TAG_A\nTAG_B\nTAG_C (손상)\nTAG_D\nTAG_E (손상)",
    testCases: [
      { inputCode: "data = [-1, 5, 0, 3]",  expectedOutput: [5, 3]    },
      { inputCode: "data = [1, -2, 3, -4]", expectedOutput: [1, 3]    },
      { inputCode: "data = [-5, -3, 7]",    expectedOutput: [7]       },
    ],
    requiredSyntax: ["For", "If"], bannedSyntax: ["filter"],
    referenceItems: [
      ref("result = []", "빈 리스트를 만들어 시작합니다."),
      ref("result.append(x)", "리스트에 x를 추가합니다."),
      ref("if x > 0:", "0보다 큰 수만 통과시킵니다."),
    ],
    rewardHint: hint("room-2-hint-tags", "room-2", "room-2-broken-tags",
      "[코드 조각 획득] 손상 데이터를 걸러냈다. 두 번째 열쇠 파편: 5"),
    starterCode:
      "# 빈 리스트를 만들고, 양수만 append 하세요.\n" +
      "\n" +
      "result = []          # 결과를 담을 빈 리스트\n" +
      "for x in data:\n" +
      "    if x > ___:      # 조건: 0보다 크면\n" +
      "        result.append(___)\n" +
      "\n" +
      "answer = result\n",
    imageUrl: "/assets/images/objects/room-2/broken-name-tags.png",
    isRequired: true, requiredForDoor: true,
    doorCodePosition: 2, doorCodePiece: "5", puzzleType: "code",
  },

  {
    id: "room-2-score-board",
    roomId: "room-2", objectId: "room-2-score-board",
    title: "딕셔너리 접근",
    situationText:
      "보안 데이터베이스에 사용자 정보가 딕셔너리 형태로 저장되어 있다.\n" +
      "딕셔너리는 '키: 값' 쌍으로 이루어진 자료구조다.\n" +
      "data['score'] 처럼 키를 사용해 원하는 값을 꺼내어 answer에 저장하라.",
    dataText: "SECURITY DB\nA001/에이전트 알파\nA002/에이전트 베타\nA003/에이전트 감마\nA004/에이전트 델타\nA005/에이전트 엡실론\n\nA001/88\nA002/72\nA003/95\nA004/61\nA005/87",
    testCases: [
      { inputCode: "data = {'score': 88}",  expectedOutput: 88  },
      { inputCode: "data = {'score': 42}",  expectedOutput: 42  },
      { inputCode: "data = {'score': 100}", expectedOutput: 100 },
    ],
    requiredSyntax: ["Subscript"], bannedSyntax: [],
    referenceItems: [
      ref("data['score']", "'score' 키에 해당하는 값을 가져옵니다."),
      ref("dict['키']", "딕셔너리에서 특정 키의 값을 꺼냅니다."),
      ref("data.get('score')", "키가 없을 때도 안전하게 가져오는 방법입니다."),
    ],
    rewardHint: hint("room-2-hint-score", "room-2", "room-2-score-board",
      "[코드 조각 획득] 데이터베이스를 해독했다. 세 번째 열쇠 파편: 4"),
    starterCode:
      "# 딕셔너리에서 'score' 키의 값을 꺼내세요.\n" +
      "# data = {'name': '...', 'score': 숫자} 형태입니다.\n" +
      "\n" +
      "answer = data[___]  # 어떤 키의 값이 필요한가요?\n",
    imageUrl: "/assets/images/objects/room-2/score-board.png",
    isRequired: true, requiredForDoor: true,
    doorCodePosition: 3, doorCodePiece: "4", puzzleType: "code",
  },

  {
    id: "room-2-timeline",
    roomId: "room-2", objectId: "room-2-timeline",
    title: "카운트다운",
    situationText:
      "비상 탈출 타임라인이 역방향으로 기록되어야 한다.\n" +
      "while 반복문을 사용하여 data부터 시작해 1씩 감소하며 1까지의 숫자를 리스트로 만들어라.\n" +
      "while 조건이 거짓이 되는 순간 반복이 멈춘다.",
    dataText: "T-05 / 시스템 부팅\nT-04 / 인증 시작\nT-03 / 데이터 로드\nT-02 / 검증 진행\nT-01 / 잠금 해제",
    testCases: [
      { inputCode: "data = 3", expectedOutput: [3, 2, 1]       },
      { inputCode: "data = 5", expectedOutput: [5, 4, 3, 2, 1] },
    ],
    requiredSyntax: ["While"], bannedSyntax: [],
    referenceItems: [
      ref("while n > 0:", "n이 0보다 클 동안 반복합니다."),
      ref("n = n - 1", "매 반복마다 n을 1씩 줄입니다."),
      ref("result.append(n)", "현재 n 값을 리스트에 추가합니다."),
    ],
    rewardHint: hint("room-2-hint-time", "room-2", "room-2-timeline",
      "[코드 조각 획득] 카운트다운 완료. 네 번째 열쇠 파편: 7"),
    starterCode:
      "# while문으로 data에서 1까지 감소하는 리스트를 만드세요.\n" +
      "\n" +
      "result = []\n" +
      "n = data\n" +
      "while n > ___:        # n이 얼마보다 클 때 반복?\n" +
      "    result.append(n)\n" +
      "    n = n - ___       # n을 얼마나 줄여야 할까요?\n" +
      "\n" +
      "answer = result\n",
    imageUrl: "/assets/images/objects/room-2/timeline-board.png",
    isRequired: true, requiredForDoor: true,
    doorCodePosition: 4, doorCodePiece: "7", puzzleType: "code",
  },

  {
    id: "room-2-access-log",
    roomId: "room-2", objectId: "room-2-access-log",
    title: "리스트 컴프리헨션",
    situationText:
      "접근 기록의 처리 시간 데이터를 모두 2배로 스케일링해야 한다.\n" +
      "리스트 컴프리헨션은 for문을 한 줄로 압축해 새 리스트를 만드는 방법이다.\n" +
      "[x * 2 for x in data] 형태로 작성하라.",
    dataText: "09:12 / AGENT_A / success\n09:15 / AGENT_B / fail\n09:18 / AGENT_C / success\n09:22 / AGENT_D / fail",
    testCases: [
      { inputCode: "data = [1, 2, 3]", expectedOutput: [2, 4, 6]  },
      { inputCode: "data = [5, 10]",   expectedOutput: [10, 20]   },
    ],
    requiredSyntax: ["ListComp"], bannedSyntax: [],
    referenceItems: [
      ref("[x * 2 for x in data]", "data의 각 원소를 2배로 만든 리스트."),
      ref("[표현식 for 변수 in 리스트]", "리스트 컴프리헨션 기본 형태."),
    ],
    rewardHint: hint("room-2-hint-log", "room-2", "room-2-access-log",
      "[보너스 단서] 컴프리헨션으로 한 줄에 처리했다."),
    starterCode:
      "# 리스트 컴프리헨션으로 data의 모든 원소를 2배로 만드세요.\n" +
      "# 형태: [표현식 for 변수 in 리스트]\n" +
      "\n" +
      "answer = [x * ___ for x in data]  # 2배는 * 얼마?\n",
    imageUrl: "/assets/images/objects/room-2/access-log-table.png",
    isRequired: false, requiredForDoor: false, isHidden: true, puzzleType: "code",
  },

  {
    id: "room-2-checksum-ledger",
    roomId: "room-2", objectId: "room-2-checksum-ledger",
    title: "모음 제거",
    situationText:
      "체크섬 계산을 위해 문자열에서 모음(a, e, i, o, u)을 모두 제거해야 한다.\n" +
      "for문으로 글자를 하나씩 확인하고, 모음이 아닌 것만 골라 이어붙여라.\n" +
      "in 연산자로 특정 문자가 리스트(또는 문자열) 안에 있는지 확인할 수 있다.",
    dataText: "CHECK_A / data / PASS\nCHECK_B / info / FAIL\nCHECK_C / code / PASS",
    testCases: [
      { inputCode: "data = 'apple'",  expectedOutput: "ppl"  },
      { inputCode: "data = 'python'", expectedOutput: "pythn" },
      { inputCode: "data = 'hello'",  expectedOutput: "hll"  },
    ],
    requiredSyntax: ["For"], bannedSyntax: [],
    referenceItems: [
      ref("if char not in 'aeiou':", "모음이 아닌 글자만 통과시킵니다."),
      ref("result = result + char", "문자열끼리 + 로 이어붙입니다."),
      ref("in 연산자", "'a' in 'aeiou' → True (포함 여부 확인)."),
    ],
    rewardHint: hint("room-2-hint-checksum", "room-2", "room-2-checksum-ledger",
      "[보너스 단서] not in 으로 제외 조건을 만들었다."),
    starterCode:
      "# 모음이 아닌 글자만 모아 새 문자열을 만드세요.\n" +
      "\n" +
      "result = ''\n" +
      "for char in data:\n" +
      "    if char not in ___:  # 모음 목록 문자열은?\n" +
      "        result = result + char\n" +
      "\n" +
      "answer = result\n",
    imageUrl: "/assets/images/objects/room-2/archive-note.png",
    isRequired: false, requiredForDoor: false, isHidden: true, puzzleType: "code",
  },


  // ══════════════════════════════════════════════════════════
  // ROOM 3 · 종합 검토실 (리뷰 방)
  // ══════════════════════════════════════════════════════════

  {
    id: "room-3-validator",
    roomId: "room-3", objectId: "room-3-validator",
    title: "역방향 슬라이싱",
    situationText:
      "최종 검토 콘솔에 문자열이 표시되어 있다.\n" +
      "슬라이싱의 세 번째 인수 (스텝)를 -1로 설정하면 문자열을 뒤집을 수 있다.\n" +
      "data[::-1] 로 뒤집힌 문자열을 answer에 저장하라.",
    dataText: "PYTHON",
    testCases: [
      { inputCode: "data = 'ABC'",    expectedOutput: "CBA"    },
      { inputCode: "data = 'HELLO'",  expectedOutput: "OLLEH"  },
      { inputCode: "data = 'PYTHON'", expectedOutput: "NOHTYP" },
    ],
    requiredSyntax: ["Slice"], bannedSyntax: [],
    referenceItems: [
      ref("data[::-1]", "스텝 -1로 역방향 슬라이싱 → 뒤집기."),
      ref("[시작:끝:스텝]", "슬라이싱의 세 번째 인수는 방향과 간격."),
    ],
    rewardHint: hint("room-3-hint-1", "room-3", "room-3-validator",
      "[보너스] 역방향 슬라이싱 완료. [::-1] 은 파이썬만의 우아한 기법이다."),
    starterCode:
      "# 역방향 슬라이싱으로 data를 뒤집으세요.\n" +
      "# 힌트: [::-1] 의 의미는 '끝에서 처음으로, 한 칸씩'\n" +
      "\n" +
      "answer = data[___]  # 역방향 슬라이싱 표현식은?\n",
    imageUrl: "/assets/images/objects/room-3/finish-console.png",
    isRequired: false, requiredForDoor: false, isHidden: true, puzzleType: "code",
  },
];

export function getPuzzlesForRoom(roomId: string): Puzzle[] {
  return puzzles.filter((p) => p.roomId === roomId);
}

export const puzzlesById = Object.fromEntries(
  puzzles.map((p) => [p.id, p])
) as Record<string, Puzzle>;
