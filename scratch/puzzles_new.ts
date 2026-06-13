import { cmassPuzzles, cmassPuzzlesById } from "./cmassPuzzles";
import type { Puzzle, ReferenceItem, RoomHint } from "./types";

function ref(label: string, description: string, codeSnippet?: string, bullets?: string[]): ReferenceItem {
  return { label, description, codeSnippet, bullets };
}

function hint(id: string, roomId: string, puzzleId: string, text: string): RoomHint {
  return { id, roomId, puzzleId, text, description: text, value: text };
}

export const puzzles: Puzzle[] = [

  // ══════════════════════════════════════════════════════════
  // ROOM 0 · 잠긴 서재
  // ══════════════════════════════════════════════════════════

  {
    id: "room-0-pattern-tiles",
    roomId: "room-0", objectId: "room-0-pattern-tiles",
    title: "변수 할당",
    situationText:
      "먼지 쌓인 타일 상자에 숫자가 깜빡이고 있다.\n" +
      "시스템을 깨우려면 입력된 숫자 데이터를 그대로 화면에 출력해야 한다.\n\n" +
      "[요구 사항]\n" +
      "1. 코드가 실행될 때 들어오는 입력값을 변수에 저장한다.\n" +
      "2. 그 변수에 담긴 값을 아무런 변형 없이 그대로 출력한다.",
    dataText: "7 3 5 8",
    testCases: [
      { inputCode: "data = 100", expectedOutput: 100 },
      { inputCode: "data = 42",  expectedOutput: 42  },
    ],
    requiredSyntax: [], bannedSyntax: [],
    referenceItems: [
      ref(
        "변수(Variable)란?",
        "변수는 데이터를 담아두는 상자입니다. 파이썬에서는 '=' 기호를 사용하여 변수에 값을 저장합니다.",
        "answer = data",
        [
          "수학의 '='는 '같다'는 뜻이지만, 프로그래밍에서는 '오른쪽 값을 왼쪽 변수에 저장하라'는 의미입니다.",
          "위 예시에서는 data라는 변수에 들어있는 값을 answer라는 새로운 변수에 복사합니다."
        ]
      ),
      ref(
        "화면에 출력하기 (print)",
        "저장된 값이나 계산 결과를 눈으로 확인하려면 print() 함수를 사용해야 합니다.",
        "print(answer)",
        [
          "괄호 안에 출력하고 싶은 변수 이름이나 숫자, 문자를 넣으면 됩니다."
        ]
      )
    ],
    rewardHint: hint("room-0-hint-tiles", "room-0", "room-0-pattern-tiles",
      "[코드 조각 획득] 변수는 값을 담는 그릇이다. 첫 번째 열쇠 파편: 8"),
    starterCode:
      "# 1) 테스트 시스템이 입력해주는 값을 data 변수로 받습니다.\n" +
      "data = int(input())\n\n" +
      "# [목표] 입력받은 data의 값을 그대로 출력하세요.\n" +
      "#  - print() 함수를 사용합니다.\n" +
      "\n",
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
      "수신 장치를 보정하려면 입력된 신호값에 10을 더해야 한다.\n\n" +
      "[요구 사항]\n" +
      "1. 입력된 숫자에 + 연산자를 사용하여 10을 더한다.\n" +
      "2. 더해진 결과값을 출력한다.",
    dataText: "data + 10 = ?",
    testCases: [
      { inputCode: "data = 5",  expectedOutput: 15 },
      { inputCode: "data = 20", expectedOutput: 30 },
    ],
    requiredSyntax: ["BinOp"], bannedSyntax: [],
    referenceItems: [
      ref(
        "파이썬의 사칙연산",
        "파이썬은 일반적인 계산기처럼 사칙연산을 수행할 수 있습니다.",
        "result = data + 10\nprint(result)",
        [
          "+ : 더하기",
          "- : 빼기",
          "* : 곱하기 (알파벳 x가 아닙니다!)",
          "/ : 나누기"
        ]
      ),
      ref(
        "계산과 동시에 출력하기",
        "변수에 굳이 저장하지 않고, print() 괄호 안에서 바로 계산할 수도 있습니다.",
        "print(data + 10)",
        []
      )
    ],
    rewardHint: hint("room-0-hint-crt-tv", "room-0", "room-0-tv-sequence",
      "[코드 조각 획득] 연산으로 신호를 보정했다. 두 번째 열쇠 파편: 5"),
    starterCode:
      "# 1) 테스트 시스템이 입력해주는 값을 data 변수로 받습니다.\n" +
      "data = int(input())\n\n" +
      "# [목표] data에 10을 더한 값을 출력하세요.\n" +
      "#  - 예) data가 5이면 출력은 15\n" +
      "\n",
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
      "잠금 장치는 전체 문자열이 아닌, 단 하나의 글자만 유효한 코드로 인식한다.\n\n" +
      "[요구 사항]\n" +
      "입력된 문자열 데이터에서 '첫 번째 글자'만 꺼내어 출력한다.",
    dataText: "SYSTEM",
    testCases: [
      { inputCode: "data = 'SYSTEM'", expectedOutput: "S" },
      { inputCode: "data = 'HELLO'",  expectedOutput: "H" },
    ],
    requiredSyntax: ["Subscript"], bannedSyntax: [],
    referenceItems: [
      ref(
        "인덱싱 (Indexing)",
        "문자열 안에 있는 여러 글자 중에서 특정 위치에 있는 글자 하나를 콕 집어서 가져오는 방법입니다.",
        "word = 'PYTHON'\nprint(word[0])  # 'P' 출력\nprint(word[2])  # 'T' 출력",
        [
          "대괄호 [ ] 안에 원하는 위치의 숫자를 넣습니다.",
          "주의: 파이썬은 숫자를 셀 때 1이 아니라 0부터 시작합니다! 첫 번째 글자는 인덱스 0입니다."
        ]
      ),
      ref(
        "음수 인덱스",
        "뒤에서부터 순서를 셀 수도 있습니다.",
        "print(word[-1])  # 'N' (마지막 글자)",
        []
      )
    ],
    rewardHint: hint("room-0-hint-terminal", "room-0", "room-0-desk-terminal",
      "[코드 조각 획득] 데이터의 시작은 항상 0이다. 세 번째 열쇠 파편: 2"),
    starterCode:
      "# 1) 테스트 시스템이 입력해주는 문자열을 data 변수로 받습니다.\n" +
      "data = input()\n\n" +
      "# [목표] data 문자열의 '첫 번째 글자'만 꺼내서 출력하세요.\n" +
      "#  - 인덱싱 [ ] 을 사용합니다. (파이썬 인덱스는 0부터 시작!)\n" +
      "\n",
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
      "인증 시스템은 전체 코드 중 앞부분의 일부만을 유효한 키로 인식한다.\n\n" +
      "[요구 사항]\n" +
      "입력된 문자열 데이터에서 '앞 3글자'만 잘라내어 출력한다.",
    dataText: "P Y T H O N",
    testCases: [
      { inputCode: "data = 'PYTHON'", expectedOutput: "PYT" },
      { inputCode: "data = 'ESCAPE'", expectedOutput: "ESC" },
    ],
    requiredSyntax: ["Slice"], bannedSyntax: [],
    referenceItems: [
      ref(
        "슬라이싱 (Slicing)",
        "문자열의 특정 구간을 한 번에 잘라내는 방법입니다. 인덱싱이 '하나'만 꺼낸다면, 슬라이싱은 '여러 개'를 꺼냅니다.",
        "word = 'ESCAPE'\nprint(word[0:3])  # 'ESC' 출력",
        [
          "대괄호 안에 [시작 위치 : 끝 위치] 를 적습니다.",
          "가장 헷갈리는 부분: '끝 위치'의 글자는 포함되지 않습니다! 즉, 0부터 2까지만 가져옵니다."
        ]
      ),
      ref(
        "생략하기",
        "처음부터 자르거나 끝까지 자를 때는 숫자를 생략할 수 있습니다.",
        "print(word[:3])  # 처음(0)부터 2까지 자름\nprint(word[2:])  # 2부터 끝까지 자름",
        []
      )
    ],
    rewardHint: hint("room-0-hint-ox", "room-0", "room-0-mini-ox-card",
      "[코드 조각 획득] 슬라이싱으로 코드를 잘라냈다. 네 번째 열쇠 파편: 2"),
    starterCode:
      "# 1) 테스트 시스템이 입력해주는 문자열을 data 변수로 받습니다.\n" +
      "data = input()\n\n" +
      "# [목표] data 문자열의 '앞 3글자'를 잘라내어 출력하세요.\n" +
      "#  - 슬라이싱 [시작:끝] 을 사용합니다. 끝 숫자의 글자는 포함되지 않음에 주의하세요.\n" +
      "\n",
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
      "숨겨진 자물쇠의 암호는 이름 문자열이 몇 글자로 이루어졌는지 세는 것이다.\n\n" +
      "[요구 사항]\n" +
      "입력된 문자열의 총 길이(글자 수)를 숫자로 구하여 출력한다.",
    dataText: "ALPHA BRAVO DELTA",
    testCases: [
      { inputCode: "data = 'PYTHON'", expectedOutput: 6 },
      { inputCode: "data = 'XYZ'",    expectedOutput: 3 },
    ],
    requiredSyntax: ["len"], bannedSyntax: [],
    referenceItems: [
      ref(
        "길이 구하기 (len)",
        "len() 함수는 length(길이)의 약자로, 문자열이나 리스트에 데이터가 총 몇 개 들어있는지 셉니다.",
        "length = len('ABC')\nprint(length)  # 3 출력",
        [
          "공백(띄어쓰기)이나 특수문자도 하나의 글자로 취급하여 길이에 포함됩니다."
        ]
      )
    ],
    rewardHint: hint("room-0-hint-names", "room-0", "room-0-name-tags",
      "[검증 단서] 네 자리 코드 합계 힌트 — 8+5+2+2 = 17"),
    starterCode:
      "# 1) 테스트 시스템이 입력해주는 문자열을 data 변수로 받습니다.\n" +
      "data = input()\n\n" +
      "# [목표] data의 길이(글자 수)를 숫자로 출력하세요.\n" +
      "#  - len() 함수를 사용합니다.\n" +
      "\n",
    imageUrl: "/assets/images/objects/room-0/name-tags-bundle.png",
    isRequired: true, requiredForDoor: true,
    doorCodePosition: 5, doorCodePiece: "✓", puzzleType: "code",
  },

  {
    id: "room-0-bookshelf-note",
    roomId: "room-0", objectId: "room-0-bookshelf-note",
    title: "문자열 반복",
    situationText:
      "책장 뒤에 꽂힌 쪽지에 암호화 공식이 적혀 있다.\n" +
      "암호 패턴은 원본 문자열을 여러 번 반복해서 하나의 긴 코드로 만드는 것이다.\n\n" +
      "[요구 사항]\n" +
      "입력된 문자열을 '3번' 반복하여 하나로 이어붙인 결과를 출력한다.",
    dataText: "파이썬에서 문자열을 n번 반복하려면:\n'문자열' * n\n예: 'AB' * 3 = 'ABABAB'",
    testCases: [
      { inputCode: "data = 'A'",    expectedOutput: "AAA"      },
      { inputCode: "data = 'AB'",   expectedOutput: "ABABAB"   },
      { inputCode: "data = 'XY'",   expectedOutput: "XYXYXY"   },
    ],
    requiredSyntax: ["BinOp"], bannedSyntax: [],
    referenceItems: [
      ref(
        "문자열과 곱하기 연산",
        "수학에서 2 * 3 은 2를 3번 더한다는 뜻이죠? 파이썬에서 문자열에 * 를 사용하면 문자열을 그 횟수만큼 반복해서 이어붙입니다.",
        "text = 'Ha'\nprint(text * 3)  # 'HaHaHa' 출력",
        [
          "문자열끼리 더하기(+)를 하면 'Ha' + 'Ha' 처럼 이어붙일 수 있지만, 여러 번 반복할 때는 곱하기(*)가 훨씬 편리합니다."
        ]
      )
    ],
    rewardHint: hint("room-0-hint-note", "room-0", "room-0-bookshelf-note",
      "[검증 단서] 세 번째와 네 번째 자리는 같은 숫자"),
    starterCode:
      "# 1) 테스트 시스템이 입력해주는 문자열을 data 변수로 받습니다.\n" +
      "data = input()\n\n" +
      "# [목표] data 문자열을 3번 반복한 결과를 출력하세요.\n" +
      "#  - 예) data가 'AB'이면 출력은 'ABABAB'\n" +
      "\n",
    imageUrl: "/assets/images/objects/room-0/bookshelf-note.png",
    isRequired: true, requiredForDoor: true,
    doorCodePosition: 6, doorCodePiece: "✓", puzzleType: "code",
  },

  // ══════════════════════════════════════════════════════════
  // ROOM 1 · 신호실
  // ══════════════════════════════════════════════════════════

  {
    id: "room-1-word-billboard",
    roomId: "room-1", objectId: "room-1-word-billboard",
    title: "대문자 정규화",
    situationText:
      "전광판에 대소문자가 섞인 코드들이 흐르고 있다.\n" +
      "보안 레이어는 모든 알파벳이 대문자인 코드만 통과시킨다.\n\n" +
      "[요구 사항]\n" +
      "입력된 문자열의 모든 알파벳을 대문자로 변경하여 출력한다.",
    dataText: "hello world python",
    testCases: [
      { inputCode: "data = 'hello'",  expectedOutput: "HELLO"  },
      { inputCode: "data = 'python'", expectedOutput: "PYTHON" },
      { inputCode: "data = 'signal'", expectedOutput: "SIGNAL" },
    ],
    requiredSyntax: ["upper"], bannedSyntax: [],
    referenceItems: [
      ref(
        "문자열 메서드 (Method)",
        "파이썬의 문자열에는 스스로를 변형시킬 수 있는 내장 기능들이 있습니다. 이를 '메서드'라고 부르며, 점(.)을 찍어 사용합니다.",
        "word = 'hello'\nresult = word.upper()\nprint(result)  # 'HELLO' 출력",
        [
          ".upper() : 모든 소문자를 대문자로 바꿉니다.",
          ".lower() : 모든 대문자를 소문자로 바꿉니다.",
          "주의: 문자열.upper() 와 같이 괄호를 반드시 적어야 실행됩니다."
        ]
      )
    ],
    rewardHint: hint("room-1-hint-word", "room-1", "room-1-word-billboard",
      "[코드 조각 획득] 신호가 정규화됐다. 첫 번째 열쇠 파편: 7"),
    starterCode:
      "# 1) 테스트 시스템이 입력해주는 문자열을 data 변수로 받습니다.\n" +
      "data = input()\n\n" +
      "# [목표] data 문자열을 모두 대문자로 바꿔서 출력하세요.\n" +
      "#  - 문자열 메서드인 .upper() 를 사용합니다.\n" +
      "\n",
    imageUrl: "/assets/images/objects/room-1/word-billboard.png",
    isRequired: true, requiredForDoor: true,
    doorCodePosition: 1, doorCodePiece: "7", puzzleType: "code",
  },

  {
    id: "room-1-ox-monitor",
    roomId: "room-1", objectId: "room-1-ox-monitor",
    title: "오류 신호 복구",
    situationText:
      "모니터가 손상되어 정상적인 'O' 신호가 전부 'X'로 잘못 출력되고 있다.\n" +
      "문자열 치환 기능을 사용하여 잘못된 신호를 원래대로 되돌려야 한다.\n\n" +
      "[요구 사항]\n" +
      "입력된 문자열 안에 있는 모든 'X' 문자를 'O' 문자로 교체하여 출력한다.",
    dataText: "X X O X\nO X O X\nX X X O",
    testCases: [
      { inputCode: "data = 'X O X'", expectedOutput: "O O O" },
      { inputCode: "data = 'X X X'", expectedOutput: "O O O" },
      { inputCode: "data = 'X O O'", expectedOutput: "O O O" },
    ],
    requiredSyntax: ["replace"], bannedSyntax: [],
    referenceItems: [
      ref(
        "글자 찾아 바꾸기 (.replace)",
        ".replace() 메서드는 문자열 안에서 '찾을 글자'를 '바꿀 내용'으로 모두 교체합니다.",
        "text = 'apple'\nnew_text = text.replace('p', 'b')\nprint(new_text)  # 'abble' 출력",
        [
          "사용법: 문자열.replace('찾을글자', '바꿀내용')",
          "인수를 넣는 순서가 중요합니다. 첫 번째가 찾을 대상, 두 번째가 새롭게 바뀔 결과입니다."
        ]
      )
    ],
    rewardHint: hint("room-1-hint-ox", "room-1", "room-1-ox-monitor",
      "[코드 조각 획득] 오염된 신호가 복구됐다. 두 번째 열쇠 파편: 4"),
    starterCode:
      "# 1) 테스트 시스템이 입력해주는 문자열을 data 변수로 받습니다.\n" +
      "data = input()\n\n" +
      "# [목표] data 안의 모든 'X' 문자를 'O' 로 변경하여 출력하세요.\n" +
      "#  - 문자열 메서드인 .replace() 를 사용합니다.\n" +
      "\n",
    imageUrl: "/assets/images/objects/room-1/ox-monitor.png",
    isRequired: true, requiredForDoor: true,
    doorCodePosition: 2, doorCodePiece: "4", puzzleType: "code",
  },

  {
    id: "room-1-number-panel",
    roomId: "room-1", objectId: "room-1-number-panel",
    title: "코드 분리",
    situationText:
      "패널에 띄어쓰기(공백)로 구분된 여러 개의 단어가 한 줄로 뭉쳐서 표시되어 있다.\n" +
      "시스템이 개별 단어를 인식할 수 있도록, 이 긴 문자열을 단어 단위의 리스트(배열)로 분리해야 한다.\n\n" +
      "[요구 사항]\n" +
      "입력된 문자열을 공백 기준으로 쪼개어 리스트 형태로 변환한 뒤 출력한다.",
    dataText: "ALPHA BRAVO CHARLIE DELTA",
    testCases: [
      { inputCode: "data = 'A B C'",    expectedOutput: ["A", "B", "C"]          },
      { inputCode: "data = 'X Y Z W'",  expectedOutput: ["X", "Y", "Z", "W"]     },
    ],
    requiredSyntax: ["split"], bannedSyntax: [],
    referenceItems: [
      ref(
        "문자열 쪼개기 (.split)",
        ".split() 메서드는 하나의 긴 문자열을 일정한 기준에 따라 여러 조각으로 나누어 '리스트'로 만들어줍니다.",
        "text = 'apple banana orange'\nwords = text.split()\nprint(words)  # ['apple', 'banana', 'orange']",
        [
          "괄호 안에 아무것도 넣지 않으면 기본적으로 띄어쓰기(공백)를 기준으로 쪼갭니다.",
          "만약 쉼표(,)로 쪼개고 싶다면 text.split(',') 처럼 괄호 안에 기준이 될 문자를 적어주면 됩니다."
        ]
      )
    ],
    rewardHint: hint("room-1-hint-num", "room-1", "room-1-number-panel",
      "[코드 조각 획득] 코드가 분리됐다. 세 번째 열쇠 파편: 7"),
    starterCode:
      "# 1) 테스트 시스템이 입력해주는 문자열을 data 변수로 받습니다.\n" +
      "data = input()\n\n" +
      "# [목표] data를 공백 기준으로 나누어 단어들이 담긴 리스트를 만들고 출력하세요.\n" +
      "#  - 문자열 메서드인 .split() 을 사용합니다.\n" +
      "\n",
    imageUrl: "/assets/images/objects/room-1/number-panel.png",
    isRequired: true, requiredForDoor: true,
    doorCodePosition: 3, doorCodePiece: "7", puzzleType: "code",
  },

  {
    id: "room-1-radio-signal",
    roomId: "room-1", objectId: "room-1-radio-signal",
    title: "신호 강도 판별",
    situationText:
      "라디오 수신기에 신호 강도 숫자가 잡혔다.\n" +
      "기준치 이상이면 통과, 미만이면 실패로 분기 처리하여 시스템에 결과를 알려야 한다.\n\n" +
      "[요구 사항]\n" +
      "입력된 숫자가 100 이상이면 'PASS'라는 문자를 출력하고, 100 미만이면 'FAIL'을 출력한다.",
    dataText: "085.7\n100.3\n112.9\n097.5",
    testCases: [
      { inputCode: "data = 100", expectedOutput: "PASS" },
      { inputCode: "data = 99",  expectedOutput: "FAIL" },
      { inputCode: "data = 50",  expectedOutput: "FAIL" },
    ],
    requiredSyntax: ["If"], bannedSyntax: [],
    referenceItems: [
      ref(
        "조건문 (if / else)",
        "상황에 따라 다른 코드를 실행하고 싶을 때 사용합니다. '만약 ~라면 A를 하고, 아니면 B를 해라'라는 구조입니다.",
        "if data >= 100:\n    print('PASS')\nelse:\n    print('FAIL')",
        [
          "파이썬에서는 if 문 끝에 반드시 콜론(:)을 찍어야 합니다.",
          "if 아래에 실행할 코드는 반드시 들여쓰기(스페이스바 4번 또는 Tab)를 해야 합니다.",
          ">= 기호는 '크거나 같다(이상)'를 의미합니다."
        ]
      )
    ],
    rewardHint: hint("room-1-hint-radio", "room-1", "room-1-radio-signal",
      "[코드 조각 획득] 신호 강도가 판별됐다. 네 번째 열쇠 파편: 9"),
    starterCode:
      "# 1) 테스트 시스템이 입력해주는 숫자를 data 변수로 받습니다.\n" +
      "data = int(input())\n\n" +
      "# [목표] data가 100 이상이면 'PASS', 아니면 'FAIL'을 출력하세요.\n" +
      "#  - if / else 구문과 비교 연산자(>=)를 사용합니다.\n" +
      "\n",
    imageUrl: "/assets/images/objects/room-1/radio-signal-device.png",
    isRequired: true, requiredForDoor: true,
    doorCodePosition: 4, doorCodePiece: "9", puzzleType: "code",
  },

  {
    id: "room-1-name-card",
    roomId: "room-1", objectId: "room-1-name-card",
    title: "짝수 판별",
    situationText:
      "명함 보드의 출입 번호 시스템은 특정 배수에 해당하는 번호만 허용한다.\n" +
      "수학적 연산을 활용하여 입력된 번호가 짝수인지 판별하라.\n\n" +
      "[요구 사항]\n" +
      "입력된 숫자가 짝수면 True를 출력하고, 홀수면 False를 출력한다.\n" +
      "(파이썬의 Boolean 값 True / False 를 직접 출력해야 함)",
    dataText: "2 4 5 7 8",
    testCases: [
      { inputCode: "data = 4",  expectedOutput: true  },
      { inputCode: "data = 5",  expectedOutput: false },
      { inputCode: "data = 10", expectedOutput: true  },
    ],
    requiredSyntax: [], bannedSyntax: [],
    referenceItems: [
      ref(
        "나머지 연산자 (%)",
        "파이썬에서 % 기호는 나눗셈의 '나머지'를 구하는 연산자입니다. 짝수/홀수 판별에 가장 많이 쓰입니다.",
        "print(7 % 2)  # 1 출력 (7을 2로 나누면 나머지가 1)\nprint(8 % 2)  # 0 출력 (짝수는 나머지가 0)",
        [
          "짝수는 항상 2로 나누어 떨어집니다. 즉, data % 2 의 결과가 0인지 확인하면 됩니다."
        ]
      ),
      ref(
        "비교 연산의 결과 (Boolean)",
        "파이썬에서 값을 비교하는 식 자체는 True(참) 또는 False(거짓)라는 값을 만들어냅니다.",
        "result = (data % 2 == 0)\nprint(result)",
        [
          "== 는 수학의 '같다'를 의미합니다. (변수 할당 = 와 다름에 주의!)"
        ]
      )
    ],
    rewardHint: hint("room-1-hint-name", "room-1", "room-1-name-card",
      "[검증 단서] 첫 번째 자리 = 세 번째 자리 (같은 숫자)"),
    starterCode:
      "# 1) 테스트 시스템이 입력해주는 숫자를 data 변수로 받습니다.\n" +
      "data = int(input())\n\n" +
      "# [목표] data가 짝수면 True, 홀수면 False를 출력하세요.\n" +
      "#  - 힌트: 짝수는 2로 나눈 나머지(%)가 0 입니다.\n" +
      "#  - 힌트: data % 2 == 0 의 결과 자체를 print() 에 넣을 수 있습니다.\n" +
      "\n",
    imageUrl: "/assets/images/objects/room-1/name-card-board.png",
    isRequired: true, requiredForDoor: true,
    doorCodePosition: 5, doorCodePiece: "✓", puzzleType: "code",
  },

  {
    id: "room-1-checksum-tablet",
    roomId: "room-1", objectId: "room-1-checksum-tablet",
    title: "범위 검증",
    situationText:
      "스트립에 기록된 데이터 중 유효한 범위에 속하는 값만 처리해야 한다.\n" +
      "정상 신호 범위는 '0보다 크고, 10보다 작은' 경우다.\n\n" +
      "[요구 사항]\n" +
      "입력된 숫자가 0 초과, 10 미만인 조건을 모두 만족하면 True, 아니면 False를 출력한다.",
    dataText: "5 1 5 - 1 A",
    testCases: [
      { inputCode: "data = 5",  expectedOutput: true  },
      { inputCode: "data = 10", expectedOutput: false },
      { inputCode: "data = 0",  expectedOutput: false },
    ],
    requiredSyntax: [], bannedSyntax: [],
    referenceItems: [
      ref(
        "논리 연산자 (and)",
        "두 가지 조건을 모두 만족해야 할 때 'and' 를 사용해 조건을 연결합니다.",
        "result = (data > 0) and (data < 10)\nprint(result)",
        [
          "A and B : A도 참이고 B도 참일 때만 최종적으로 True가 됩니다."
        ]
      ),
      ref(
        "연속 비교",
        "파이썬만의 아주 편리한 문법입니다. 수학 기호처럼 조건을 한 번에 이어서 쓸 수 있습니다.",
        "print(0 < data < 10)",
        []
      )
    ],
    rewardHint: hint("room-1-hint-noise", "room-1", "room-1-checksum-tablet",
      "[검증 단서] 네 자리 합계 = 27"),
    starterCode:
      "# 1) 테스트 시스템이 입력해주는 숫자를 data 변수로 받습니다.\n" +
      "data = int(input())\n\n" +
      "# [목표] data가 0보다 크고 동시에 10보다 작으면 True, 아니면 False를 출력하세요.\n" +
      "#  - 두 조건을 and 논리 연산자로 연결하세요.\n" +
      "\n",
    imageUrl: "/assets/images/objects/room-1/noise-strip.png",
    isRequired: true, requiredForDoor: true,
    doorCodePosition: 6, doorCodePiece: "✓", puzzleType: "code",
  },

  // ══════════════════════════════════════════════════════════
  // ROOM 2 · 기록실
  // ══════════════════════════════════════════════════════════

  {
    id: "room-2-file-cabinet",
    roomId: "room-2", objectId: "room-2-file-cabinet",
    title: "누적 합계",
    situationText:
      "파일 캐비닛에 접속 횟수 기록이 리스트로 저장되어 있다.\n" +
      "이전처럼 단일 데이터가 아니라, 수많은 숫자가 들어있는 목록 전체를 순회하며 작업해야 한다.\n\n" +
      "[요구 사항]\n" +
      "1. 입력으로 주어진 '숫자들이 담긴 리스트(data)'를 for문으로 처음부터 끝까지 순회한다.\n" +
      "2. 각 숫자를 하나씩 누적하여 모든 숫자의 총합을 구한다.\n" +
      "3. 최종 합계를 출력한다. (내장 함수 sum() 사용 금지)",
    dataText: "FILE_01 / 12 / success\nFILE_02 / 08 / success\nFILE_03 / 24 / success\nFILE_04 / 05 / error",
    testCases: [
      { inputCode: "data = [1, 2, 3]",   expectedOutput: 6  },
      { inputCode: "data = [10, 20, 30]", expectedOutput: 60 },
      { inputCode: "data = [5, 5]",       expectedOutput: 10 },
    ],
    requiredSyntax: ["For"], bannedSyntax: ["sum"],
    referenceItems: [
      ref(
        "for 반복문과 리스트",
        "리스트 안에 있는 데이터를 처음부터 끝까지 하나씩 꺼내어 반복적인 작업을 할 수 있습니다.",
        "for x in data:\n    print(x)",
        [
          "data 리스트에 [1, 2, 3] 이 있다면, 첫 바퀴엔 x가 1, 두 번째 바퀴엔 x가 2가 되는 식으로 반복됩니다."
        ]
      ),
      ref(
        "누적 변수 패턴",
        "여러 값을 더하려면 반복문 바깥에 값을 담을 빈 그릇(초기값 0)을 먼저 준비해야 합니다.",
        "total = 0\nfor x in data:\n    total = total + x\nprint(total)",
        [
          "total = total + x 는 '현재 total 값에 x를 더해서, 다시 total에 저장하라'는 뜻입니다."
        ]
      )
    ],
    rewardHint: hint("room-2-hint-file", "room-2", "room-2-file-cabinet",
      "[코드 조각 획득] 기록을 집계했다. 첫 번째 열쇠 파편: 3"),
    starterCode:
      "# 참고: 이번 문제부터는 시스템이 미리 리스트 형태의 data를 만들어 줍니다.\n" +
      "# 직접 input()을 작성할 필요가 없습니다. 바로 data 변수를 사용하세요.\n\n" +
      "# [목표] 리스트 data 안의 모든 숫자를 더한 총합을 출력하세요.\n" +
      "#  - for 반복문으로 직접 누적 변수에 값을 더해야 합니다. (sum() 함수 사용 금지)\n" +
      "#  - 힌트: 반복문 시작 전에 총합을 저장할 변수를 0으로 만들어두세요.\n" +
      "\n",
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
      "데이터 복원을 위해 리스트를 순회하면서 올바른 데이터만 걸러내야 한다.\n\n" +
      "[요구 사항]\n" +
      "1. 주어진 숫자 리스트(data)를 for문으로 순회한다.\n" +
      "2. 값이 0보다 큰(양수) 경우만 골라내어 새로운 빈 리스트에 추가한다.\n" +
      "3. 반복문이 끝나면 완성된 새 리스트를 통째로 출력한다. (내장 함수 filter() 사용 금지)",
    dataText: "TAG_A\nTAG_B\nTAG_C (손상)\nTAG_D\nTAG_E (손상)",
    testCases: [
      { inputCode: "data = [-1, 5, 0, 3]",  expectedOutput: [5, 3]    },
      { inputCode: "data = [1, -2, 3, -4]", expectedOutput: [1, 3]    },
      { inputCode: "data = [-5, -3, 7]",    expectedOutput: [7]       },
    ],
    requiredSyntax: ["For", "If"], bannedSyntax: ["filter"],
    referenceItems: [
      ref(
        "반복문과 조건문의 결합",
        "반복문을 돌면서 모든 항목을 처리하는 게 아니라, if문을 사용해 특정 조건을 만족하는 항목만 선별할 수 있습니다.",
        "for x in data:\n    if x > 0:\n        print(x)",
        [
          "들여쓰기(Indent)가 매우 중요합니다. if문은 for문 안으로, 실행할 코드는 다시 if문 안으로 들여써야 합니다."
        ]
      ),
      ref(
        "빈 리스트에 항목 추가하기 (.append)",
        "값을 걸러냈다면, 새 리스트에 차곡차곡 담아야 합니다.",
        "result = []          # 빈 리스트 준비\nresult.append(5)     # 리스트 끝에 5 추가\nprint(result)        # [5] 출력",
        []
      )
    ],
    rewardHint: hint("room-2-hint-tags", "room-2", "room-2-broken-tags",
      "[코드 조각 획득] 손상 데이터를 걸러냈다. 두 번째 열쇠 파편: 5"),
    starterCode:
      "# data는 여러 숫자가 담긴 리스트입니다.\n\n" +
      "# [목표] data 리스트에서 0보다 큰(양수) 값만 모아 새로운 리스트를 만들고 출력하세요.\n" +
      "#  - for 반복문과 if 조건문을 조합하여 사용하세요.\n" +
      "#  - 힌트: 반복문 바깥에 result = [] 형태의 빈 리스트를 만들고, 조건에 맞을 때만 .append() 하세요.\n" +
      "\n",
    imageUrl: "/assets/images/objects/room-2/broken-name-tags.png",
    isRequired: true, requiredForDoor: true,
    doorCodePosition: 2, doorCodePiece: "5", puzzleType: "code",
  },

  {
    id: "room-2-score-board",
    roomId: "room-2", objectId: "room-2-score-board",
    title: "최고 점수 탐색",
    situationText:
      "보안 데이터베이스에 여러 에이전트의 성과 정보가 '딕셔너리'들의 리스트 형태로 저장되어 있다.\n" +
      "각 에이전트의 데이터 중 'score'라는 이름표(키)에 해당하는 점수를 비교하여 가장 우수한 성적을 찾아야 한다.\n\n" +
      "[요구 사항]\n" +
      "1. 주어진 딕셔너리 리스트(data)를 순회하며 각 항목의 'score' 값에 접근한다.\n" +
      "2. 순회하면서 더 높은 점수를 만날 때마다 최고 점수 기록을 갱신한다.\n" +
      "3. 순회가 끝난 후 발견된 가장 높은 점수를 출력한다. (내장 함수 max() 사용 금지)",
    dataText: "SECURITY DB\nA001/에이전트 알파/88\nA002/에이전트 베타/72\nA003/에이전트 감마/95",
    testCases: [
      { inputCode: "data = [{'name': 'A', 'score': 60}, {'name': 'B', 'score': 90}]", expectedOutput: 90 },
      { inputCode: "data = [{'name': 'X', 'score': 45}, {'name': 'Y', 'score': 80}, {'name': 'Z', 'score': 60}]", expectedOutput: 80 },
      { inputCode: "data = [{'name': 'P', 'score': 100}]", expectedOutput: 100 },
    ],
    requiredSyntax: ["For", "Subscript", "If"], bannedSyntax: ["max"],
    referenceItems: [
      ref(
        "딕셔너리 (Dictionary) 접근하기",
        "딕셔너리는 '이름표: 데이터' 쌍으로 값을 저장하는 창고입니다. 인덱스 숫자 대신 이름표(문자열 키)를 사용해 값을 꺼냅니다.",
        "agent = {'name': 'A', 'score': 60}\nprint(agent['score'])  # 60 출력",
        [
          "리스트 안에 딕셔너리들이 들어있다면, for문으로 하나씩 꺼낸 뒤(item) item['score'] 형태로 접근합니다."
        ]
      ),
      ref(
        "최댓값 탐색 패턴",
        "반복문을 돌면서 값을 비교하여 최댓값을 찾는 프로그래밍의 흔한 패턴입니다.",
        "best = 0\nfor item in data:\n    if item['score'] > best:\n        best = item['score']",
        [
          "best 변수에 아주 작은 초기값을 넣어두고, 이보다 더 큰 값을 발견할 때마다 best 변수를 업데이트합니다."
        ]
      )
    ],
    rewardHint: hint("room-2-hint-score", "room-2", "room-2-score-board",
      "[코드 조각 획득] 최고 점수를 찾아냈다. 세 번째 열쇠 파편: 4"),
    starterCode:
      "# data는 {'name': '알파', 'score': 88} 같은 딕셔너리들이 모인 리스트입니다.\n\n" +
      "# [목표] data 리스트를 순회하며 가장 높은 'score' 값을 찾아 출력하세요.\n" +
      "#  - for, if 문과 딕셔너리 키 접근(item['score']) 방식을 조합하세요.\n" +
      "#  - 힌트: 최고 점수를 기록할 변수를 0으로 만들고 더 큰 값을 만날 때마다 갱신하세요.\n" +
      "\n",
    imageUrl: "/assets/images/objects/room-2/score-board.png",
    isRequired: true, requiredForDoor: true,
    doorCodePosition: 3, doorCodePiece: "4", puzzleType: "code",
  },

  {
    id: "room-2-timeline",
    roomId: "room-2", objectId: "room-2-timeline",
    title: "카운트다운",
    situationText:
      "비상 탈출 타임라인 기록이 역방향으로 생성되어야 한다.\n" +
      "시작 숫자부터 시작해 1이 될 때까지 숫자를 1씩 줄여가면서 리스트에 차례대로 담아야 한다.\n\n" +
      "[요구 사항]\n" +
      "1. 입력된 숫자(data)부터 시작한다.\n" +
      "2. while 반복문을 이용해 숫자를 1씩 감소시키며 계속 빈 리스트에 추가한다.\n" +
      "3. 숫자가 1까지 도달해 추가되면 반복을 멈추고 완성된 리스트를 출력한다.",
    dataText: "T-05 / 시스템 부팅\nT-04 / 인증 시작\nT-03 / 데이터 로드\nT-02 / 검증 진행\nT-01 / 잠금 해제",
    testCases: [
      { inputCode: "data = 3", expectedOutput: [3, 2, 1]       },
      { inputCode: "data = 5", expectedOutput: [5, 4, 3, 2, 1] },
    ],
    requiredSyntax: ["While"], bannedSyntax: [],
    referenceItems: [
      ref(
        "while 반복문",
        "for문이 리스트의 데이터 개수만큼 반복한다면, while문은 '조건이 참(True)인 동안 끝없이' 반복합니다.",
        "n = 3\nwhile n > 0:\n    print(n)\n    n = n - 1",
        [
          "조건이 언젠가는 거짓(False)이 되어 반복이 멈출 수 있도록, 반복문 내부에서 변수의 값을 변경해 주어야 합니다.",
          "위 예시에서는 매 반복마다 n을 1씩 빼기 때문에 n이 0이 되는 순간 반복문이 종료됩니다."
        ]
      )
    ],
    rewardHint: hint("room-2-hint-time", "room-2", "room-2-timeline",
      "[코드 조각 획득] 카운트다운 완료. 네 번째 열쇠 파편: 7"),
    starterCode:
      "# 1) 테스트 시스템이 시작 숫자를 data 변수에 줍니다.\n" +
      "data = int(input())\n\n" +
      "# [목표] data부터 1까지 1씩 줄어드는 숫자가 담긴 리스트를 만들어 출력하세요.\n" +
      "#  - while 반복문을 사용하세요.\n" +
      "#  - 예) data가 3이면 최종 출력은 [3, 2, 1]\n" +
      "\n",
    imageUrl: "/assets/images/objects/room-2/timeline-board.png",
    isRequired: true, requiredForDoor: true,
    doorCodePosition: 4, doorCodePiece: "7", puzzleType: "code",
  },

  {
    id: "room-2-access-log",
    roomId: "room-2", objectId: "room-2-access-log",
    title: "조건부 리스트 컴프리헨션",
    situationText:
      "접근 로그의 데이터에서 의미 없는 음수(0 이하)를 버리고, 유효한 양수 시간만 두 배로 스케일링해야 한다.\n" +
      "파이썬의 '리스트 컴프리헨션' 문법을 사용하면 빈 리스트 생성, for문, if문, append를 단 한 줄로 우아하게 작성할 수 있다.\n\n" +
      "[요구 사항]\n" +
      "리스트(data)에서 0보다 큰 값만 걸러낸 뒤, 그 값들에 2를 곱한 새로운 리스트를 만들어 출력한다.",
    dataText: "09:12 / AGENT_A / success\n09:15 / AGENT_B / fail\n09:18 / AGENT_C / success\n09:22 / AGENT_D / fail",
    testCases: [
      { inputCode: "data = [1, -2, 3, 0, 4]", expectedOutput: [2, 6, 8] },
      { inputCode: "data = [-5, 2, 7]",        expectedOutput: [4, 14]  },
    ],
    requiredSyntax: ["ListComp"], bannedSyntax: [],
    referenceItems: [
      ref(
        "리스트 컴프리헨션 (List Comprehension)",
        "리스트를 변형하고 필터링하는 파이썬만의 가장 강력하고 아름다운 문법입니다. 기존의 복잡한 4줄짜리 for/if 문을 단 한 줄의 대괄호 [ ] 안에 압축합니다.",
        "result = [x * 2 for x in data if x > 0]\nprint(result)",
        [
          "구조: [ 표현식  for 변수 in 리스트  if 조건 ]",
          "해석: data 리스트에서 x를 하나씩 꺼내는데, 만약 x가 0보다 크다면, x * 2를 한 결과를 새 리스트에 담아라."
        ]
      )
    ],
    rewardHint: hint("room-2-hint-log", "room-2", "room-2-access-log",
      "[검증 단서] 짝수 번째 자리(2번·4번) 합 = 12"),
    starterCode:
      "# data는 숫자가 섞인 리스트입니다.\n\n" +
      "# [목표] data 리스트에서 0보다 큰 값만 골라 2배로 만든 리스트를 출력하세요.\n" +
      "#  - 리스트 컴프리헨션 한 줄 문법을 사용하세요.\n" +
      "#  - 형태: [결과로_담을_값  for 변수 in 리스트  if 조건]\n" +
      "\n",
    imageUrl: "/assets/images/objects/room-2/access-log-table.png",
    isRequired: true, requiredForDoor: true,
    doorCodePosition: 5, doorCodePiece: "✓", puzzleType: "code",
  },

  {
    id: "room-2-checksum-ledger",
    roomId: "room-2", objectId: "room-2-checksum-ledger",
    title: "모음 제거",
    situationText:
      "보안 체크섬 생성을 위해 원본 문자열에서 모든 모음 알파벳(a, e, i, o, u)을 제거하고 자음만 남겨야 한다.\n" +
      "문자열도 리스트처럼 for문으로 글자를 하나씩 순회할 수 있다.\n\n" +
      "[요구 사항]\n" +
      "1. 입력된 문자열(data)의 각 글자를 for문으로 순회한다.\n" +
      "2. 글자가 'aeiou' 에 포함되지 않는 경우에만 빈 문자열 변수에 이어붙인다.\n" +
      "3. 순회가 끝난 후 모음이 제거된 완성된 문자열을 출력한다.",
    dataText: "CHECK_A / data / PASS\nCHECK_B / info / FAIL\nCHECK_C / code / PASS",
    testCases: [
      { inputCode: "data = 'apple'",  expectedOutput: "ppl"  },
      { inputCode: "data = 'python'", expectedOutput: "pythn" },
      { inputCode: "data = 'hello'",  expectedOutput: "hll"  },
    ],
    requiredSyntax: ["For"], bannedSyntax: [],
    referenceItems: [
      ref(
        "문자열 순회와 포함 여부 검사 (in)",
        "for문을 문자열에 사용하면 리스트처럼 글자를 하나씩 꺼내줍니다. in 연산자는 특정 글자가 문자열 묶음에 들어있는지 확인합니다.",
        "for char in 'hello':\n    if char not in 'aeiou':\n        print(char)",
        [
          "not in : 왼쪽에 있는 값이 오른쪽 모음에 포함되지 '않으면' True를 반환합니다."
        ]
      ),
      ref(
        "문자열 누적해서 이어붙이기",
        "빈 문자열('')로 변수를 시작하고 더하기(+) 연산자로 계속 글자를 붙여 나갈 수 있습니다.",
        "result = ''\nresult = result + 'a'\nresult = result + 'b'\nprint(result)  # 'ab' 출력",
        []
      )
    ],
    rewardHint: hint("room-2-hint-checksum", "room-2", "room-2-checksum-ledger",
      "[검증 단서] 네 자리 중 가장 작은 값은 첫 번째 자리 (3)"),
    starterCode:
      "# 1) 테스트 시스템이 문자열을 data 변수에 줍니다.\n" +
      "data = input()\n\n" +
      "# [목표] data 문자열에서 모음(a, e, i, o, u)을 모두 제거한 문자열을 조립해 출력하세요.\n" +
      "#  - for 반복문과 if (not in 연산자)를 사용하세요.\n" +
      "#  - 힌트: result = '' 처럼 빈 문자열을 만들고 통과한 글자만 result = result + 글자 형태로 붙입니다.\n" +
      "\n",
    imageUrl: "/assets/images/objects/room-2/archive-note.png",
    isRequired: true, requiredForDoor: true,
    doorCodePosition: 6, doorCodePiece: "✓", puzzleType: "code",
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
      "모든 데이터 무결성 검증을 완료하기 위해 입력된 문자열을 거꾸로 뒤집어 제출해야 한다.\n\n" +
      "[요구 사항]\n" +
      "파이썬의 슬라이싱 문법을 사용하여 입력된 문자열(data)을 좌우 반전시킨 뒤 출력한다.",
    dataText: "PYTHON",
    testCases: [
      { inputCode: "data = 'ABC'",    expectedOutput: "CBA"    },
      { inputCode: "data = 'HELLO'",  expectedOutput: "OLLEH"  },
      { inputCode: "data = 'PYTHON'", expectedOutput: "NOHTYP" },
    ],
    requiredSyntax: ["Slice"], bannedSyntax: [],
    referenceItems: [
      ref(
        "슬라이싱의 세 번째 인수 (Step)",
        "슬라이싱 [시작:끝] 뒤에 콜론(:)을 하나 더 붙여서 '건너뛰는 간격(Step)'을 지정할 수 있습니다.",
        "word = 'PYTHON'\nprint(word[::2])   # 'PTO' (처음부터 끝까지 2칸씩 건너뛰며 추출)\nprint(word[::-1])  # 'NOHTYP' (거꾸로 1칸씩 추출)",
        [
          "스텝 자리에 음수(-1)를 넣으면 오른쪽에서 왼쪽으로 거꾸로 읽어냅니다.",
          "시작과 끝을 모두 비워두면(::) '전체 문자열'을 의미하므로 [::-1] 은 '전체를 거꾸로 읽어라'라는 파이썬의 가장 우아한 문자열 뒤집기 기법이 됩니다."
        ]
      )
    ],
    rewardHint: hint("room-3-hint-1", "room-3", "room-3-validator",
      "[보너스] 역방향 슬라이싱 완료. [::-1] 은 파이썬만의 우아한 기법이다."),
    starterCode:
      "# 1) 테스트 시스템이 문자열을 data 변수에 줍니다.\n" +
      "data = input()\n\n" +
      "# [목표] data 문자열을 거꾸로 뒤집어서 출력하세요.\n" +
      "#  - 슬라이싱의 스텝(세 번째 값)에 -1을 사용합니다.\n" +
      "\n",
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

const CMASS_SET_ID = "cmass-python-textbook";

export function getPuzzleById(id: string, setId?: string): Puzzle | undefined {
  if (setId === CMASS_SET_ID) {
    return cmassPuzzlesById[id] ?? puzzlesById[id];
  }
  return puzzlesById[id];
}

export function getPuzzlesForRoomBySet(roomId: string, setId?: string): Puzzle[] {
  if (setId === CMASS_SET_ID) {
    const cm = cmassPuzzles.filter((p) => p.roomId === roomId);
    if (cm.length > 0) return cm;
  }
  return puzzles.filter((p) => p.roomId === roomId);
}

export function getMainPuzzlesForSet(roomIds: string[], setId?: string): Puzzle[] {
  return roomIds.flatMap((roomId) => getPuzzlesForRoomBySet(roomId, setId));
}
