import type { Puzzle, ReferenceItem, RoomHint } from "./types";

function ref(label: string, description: string): ReferenceItem {
  return { label, description };
}

function hint(id: string, roomId: string, puzzleId: string, text: string): RoomHint {
  return { id, roomId, puzzleId, text };
}

const room1WordBillboardData = `MONITOR DOOR ARCHIVE ROUTER BASIC WINDOW SIGNAL DESK CONSOLE
LAMP CAMERA SYSTEM BRICK PRINTER GATEWAY SERVER LOCKER FOLDER BOXER CIRCUIT
UPDATE MEMORY SCREEN TERMINAL SENSOR BRIDGE CIPHER BACKUP
LASER STATIC MODULE ACCESS RECORD KEYBOARD DEVICE PROTOCOL OUTPUT PORT
EVENT TABLET MIRROR ENGINE STREAM CONTROL WIRE BUS NODE PACKET
RIVER SCANNER SIGNALS ROUTERS SWITCH DISPLAY COMMAND STORAGE BROWSER FILE
CREAM SHELTER CHAMBER OBJECT REPORT LASERS VAULTS ALARMS ERRORS BUFFER
HONEY POWERED BROKEN DARK HIDDEN NOTICE CATALOG RANDOM MARKER STRING STONE
MACHINE PROJECT NETWORK SUNNY ROCKET STABLE TARGET THEME CRYSTAL
MONEY DRIVER SCRIPT BUTTON PAINT SOCKET BORDER LUNAR TUNNEL EXPORT IMPORT THERE`;

const room1OxMonitorData = `XOOOOOOOOOOOOOOOOOOO
XXOOOOOOOOOOOOOOOOOO
XXXXXXXXXOOOOOOOOOOO
XXXXOOOOOOOOOOOOOOOO
XXXOOOOOOOOOOOOOOOOO
XXXXXXOOOOOOOOOOOOOO
XXXXXXXOOOOOOOOOOOOO
OOOOOOOOOOOOOOOOOOOO
XXOOOOOOOOOOOOOOOOOO
OOOOOOOOOOOOOOOOOOOO
XXXXOOOOOOOOOOOOOOOO
OOOOOOOOOOOOOOOOOOOO
XXOOOOOOOOOOOOOOOOOO
OOOOOOOOOOOOOOOOOOOO
XXXXXXOOOOOOOOOOOOOO
OOOOOOOOOOOOOOOOOOOO
XXOOOOOOOOOOOOOOOOOO
OOOOOOOOOOOOOOOOOOOO
XXXXOOOOOOOOOOOOOOOO
OOOOOOOOOOOOOOOOOOOO`;

const room1NumberPanelData = `80 122 19 21 39 121 190 72 51
70 138 48 20 23 132 188 62 143 193
164 33 80 67 15 127 41 194 130
144 75 190 74 113 33 27 108 06 191
49 161 94 114 88 78 72 47 93 193 174
68 99 62 39 118 85 26 152 109 142
45 166 18 199 56 136 191 184 177 63
150 148 26 192 141 154 148 122 88 74 141`;

const room1NameCardData = `MIRA ZOE AXEL FAYE RINA NORA JONAS REED LEO MINA SORA KAI
DANA IRIS AXEL NORA TEO FAYE YUNA EDEN KAI LEO JUNE SORA
KIAN MIRA DANA REED OMAR YUNA TEO JONAS RHEA SENA LINA ARIA
IVAN FAYE ENZO NORA MIRA AXEL SORA KAI LEO DANA REED YUNA
TEO JONAS NOEL CORA ELI FINN GIA HUGO ISLA JACE LARA MAX
OPAL PAX QUIN ROAN TARA ULI VERA WREN XENA YURI ZARA NICO`;

const room1RadioSignalData = `516 338 822 174 441 230 413 174 413
446 534 522 489 316 358 464 194
477 211 398 252 512 240 328 674 845 378
569 846 132 354 282 828 986 696 231
873 882 822 930 409 252 956 769 865
675 684 612 347 531 298 705 697 768
346 601 942 560 975 598 441 554 593
616 599 462 414 115 985 260 991 692`;

const room1ChecksumTabletData = `7479 PASS
7379 FAIL
7469 FAIL
7471 FAIL
8479 FAIL
4079 FAIL
7429 FAIL
7478 FAIL
6479 FAIL
7449 FAIL
7470 FAIL
7079 FAIL
7475 FAIL
1479 FAIL
7472 FAIL
7979 FAIL
7489 FAIL
7409 FAIL
9479 FAIL
7419 FAIL`;

export const puzzles: Puzzle[] = [
  {
    id: "room-0-tv-sequence",
    roomId: "room-0",
    title: "CRT TV",
    objectId: "room-0-tv-sequence",
    situationText: "화면 숫자들이 일정한 규칙으로 이어진다. 다음 숫자를 구한 뒤 그 숫자를 4번 반복한 값이 해제 코드다.",
    dataText: "2 4 6 ?",
    expectedAnswer: "8888",
    mockOutput: "8888",
    referenceItems: [
      ref("nums[-1]", "리스트의 마지막 값 가져오기"),
      ref("+ 2", "일정한 차이를 더하기"),
      ref("print()", "결과 출력하기"),
    ],
    rewardHint: hint("room-0-hint-crt-tv", "room-0", "room-0-tv-sequence", "첫째 자리는 8이다."),
    starterCode: `nums = [2, 4, 6]\nnext_num = nums[-1] + 2\nprint(str(next_num) * 4)\n`,
  },
  {
    id: "room-0-desk-terminal",
    roomId: "room-0",
    title: "데스크 터미널",
    objectId: "room-0-desk-terminal",
    situationText: "단말기에 코드 한 줄이 남아 있다. 그 코드를 실행했을 때 출력되는 4글자 텍스트가 해제 코드다.",
    dataText: 'print("ECHO")',
    expectedAnswer: "ECHO",
    mockOutput: "ECHO",
    referenceItems: [ref("print()", "화면에 결과 출력하기"), ref('"ECHO"', "문자열은 따옴표로 감싸기")],
    rewardHint: hint("room-0-hint-desk-terminal", "room-0", "room-0-desk-terminal", "탈출 코드는 숫자 4자리다."),
    starterCode: `print("ECHO")\n`,
  },
  {
    id: "room-0-mini-ox-card",
    roomId: "room-0",
    title: "OX 카드",
    objectId: "room-0-mini-ox-card",
    situationText: "카드에 O와 X가 늘어서 있다. X의 총 개수를 센 다음 그 숫자를 4번 반복한 값이 해제 코드다.",
    dataText: "OOXOXOXXOX",
    expectedAnswer: "5555",
    mockOutput: "5555",
    referenceItems: [ref('.count("X")', "문자열 안의 X 개수 세기"), ref("signal = ...", "변수에 문자열 저장하기")],
    rewardHint: hint("room-0-hint-mini-ox", "room-0", "room-0-mini-ox-card", "둘째 자리는 5다."),
    starterCode: `signal = "OOXOXOXXOX"\ncount = signal.count("X")\nprint(str(count) * 4)\n`,
  },
  {
    id: "room-0-name-tags",
    roomId: "room-0",
    title: "명찰 묶음",
    objectId: "room-0-name-tags",
    situationText: "이름표 중 두 번 이상 등장한 이름의 수를 센 다음 그 숫자를 4번 반복한 값이 해제 코드다.",
    dataText: "MIRA JONAS AXEL MIRA NORA AXEL",
    expectedAnswer: "2222",
    mockOutput: "['AXEL', 'MIRA']\n2222",
    referenceItems: [
      ref("set(names)", "중복을 제거한 이름 목록 만들기"),
      ref("names.count(name)", "특정 이름이 몇 번 나오는지 세기"),
      ref("len()", "개수 확인하기"),
    ],
    rewardHint: hint("room-0-hint-name-tags", "room-0", "room-0-name-tags", "셋째 자리는 2다."),
    starterCode: `names = ["MIRA", "JONAS", "AXEL", "MIRA", "NORA", "AXEL"]\n\nrepeated = []\nfor name in set(names):\n    if names.count(name) >= 2:\n        repeated.append(name)\n\nprint(sorted(repeated))\ncount = len(repeated)\nprint(str(count) * 4)\n`,
  },
  {
    id: "room-0-pattern-tiles",
    roomId: "room-0",
    title: "패턴 타일 박스",
    objectId: "room-0-pattern-tiles",
    situationText: "도형이 같은 순서로 반복된다. 빈칸에 오는 도형의 약어를 입력하라.\n약어: triangle=TRI, square=SQU, circle=CIRC",
    dataText: "triangle square circle triangle square ?",
    expectedAnswer: "CIRC",
    mockOutput: "CIRC",
    referenceItems: [ref("%", "나머지 구하기"), ref("len(pattern)", "반복 길이 구하기"), ref("pattern[index]", "리스트 인덱싱")],
    rewardHint: hint("room-0-hint-pattern-tiles", "room-0", "room-0-pattern-tiles", "넷째 자리는 8이다."),
    starterCode: `pattern = ["triangle", "square", "circle"]\nshape = pattern[5 % len(pattern)]\nabbr = {"triangle": "TRI", "square": "SQU", "circle": "CIRC"}\nprint(abbr[shape])\n`,
  },
  {
    id: "room-0-bookshelf-note",
    roomId: "room-0",
    title: "책장 쪽지",
    objectId: "room-0-bookshelf-note",
    situationText: "쪽지의 두 조건을 동시에 만족하는 한 자리 숫자를 찾은 뒤 그 숫자를 4번 반복한 값이 해제 코드다.",
    dataText: "한 자리 숫자 중에서 짝수이고, 6보다 큰 값",
    expectedAnswer: "8888",
    mockOutput: "8888",
    referenceItems: [ref("range(10)", "0부터 9까지 확인하기"), ref("n % 2 == 0", "짝수 확인하기"), ref("if", "조건 확인하기")],
    rewardHint: hint("room-0-hint-bookshelf-note", "room-0", "room-0-bookshelf-note", "첫째 자리는 8이다."),
    starterCode: `for n in range(10):\n    if n % 2 == 0 and n > 6:\n        print(str(n) * 4)\n`,
  },
  {
    id: "room-1-word-billboard",
    roomId: "room-1",
    title: "단어 전광판",
    objectId: "room-1-word-billboard",
    situationText: "전광판에 단어들이 빼곡히 나열되어 있다. 옆 표시기는 다섯 칸짜리이고, 가운데 칸만 깜빡인다. 표시기가 가리키는 단어들에서 빛나는 자리의 글자만 이어 읽어라.",
    dataText: room1WordBillboardData,
    expectedAnswer: "6719",
    mockOutput: "SIXSEVENONENINE",
    referenceItems: [
      ref("text.split()", "문자열을 단어 단위로 나누기"),
      ref("len(word)", "단어 길이 확인하기"),
      ref("word[2]", "세 번째 글자 가져오기"),
      ref("for word in words", "단어를 하나씩 확인하기"),
    ],
    rewardHint: hint("room-1-hint-word-billboard", "room-1", "room-1-word-billboard", "CD - AB = 5다."),
    starterCode: `text = """${room1WordBillboardData}"""

words = text.split()

result = ""
for word in words:
    if len(word) == 5:
        result += word[2]

print(result)
`,
  },
  {
    id: "room-1-ox-monitor",
    roomId: "room-1",
    title: "OX 모니터",
    objectId: "room-1-ox-monitor",
    situationText: "각 줄에서 X의 개수를 세어라.\nX의 개수가 홀수인 줄에 대해, 그 줄의 X 개수만 위에서부터 이어 읽어라.",
    dataText: room1OxMonitorData,
    expectedAnswer: "1937",
    mockOutput: "1937",
    referenceItems: [
      ref("splitlines()", "여러 줄 문자열 나누기"),
      ref('row.count("X")', "X 개수 세기"),
      ref("% 2", "홀수/짝수 판별하기"),
      ref("for row in rows", "줄을 하나씩 확인하기"),
    ],
    rewardHint: hint("room-1-hint-ox-monitor", "room-1", "room-1-ox-monitor", "마지막 숫자는 9다."),
    starterCode: `data = """${room1OxMonitorData}"""

rows = data.strip().splitlines()

code = ""
for row in rows:
    x_count = row.count("X")
    if x_count % 2 == 1:
        code += str(x_count)

print(code)
`,
  },
  {
    id: "room-1-number-panel",
    roomId: "room-1",
    title: "숫자 패널",
    objectId: "room-1-number-panel",
    situationText: "패널의 숫자 중 4로 나누어 떨어지는 것만 골라라.",
    dataText: room1NumberPanelData,
    expectedAnswer: "4820",
    mockOutput: "[80, 72, 48, 20, 132, 188, 164, 80, 144, 108, 88, 72, 68, 152, 56, 136, 184, 148, 192, 148, 88]",
    referenceItems: [
      ref("int(x)", "문자열을 숫자로 바꾸기"),
      ref("n % 4 == 0", "4의 배수 확인"),
      ref("append()", "결과 리스트에 추가하기"),
      ref("for x in nums", "숫자를 하나씩 확인하기"),
    ],
    rewardHint: hint("room-1-hint-number-panel", "room-1", "room-1-number-panel", "첫 번째 숫자는 7이다."),
    starterCode: `data = """${room1NumberPanelData}"""

nums = data.split()

result = []
for x in nums:
    n = int(x)
    if n % 4 == 0:
        result.append(n)

print(result)
`,
  },
  {
    id: "room-1-name-card",
    roomId: "room-1",
    title: "명함 보드",
    objectId: "room-1-name-card",
    situationText: "보드의 이름 중 두 번 이상 등장한 이름의 수를 세면 해제 코드를 알 수 있다.",
    dataText: room1NameCardData,
    expectedAnswer: "8052",
    mockOutput: "['AXEL', 'DANA', 'FAYE', 'JONAS', 'KAI', 'LEO', 'MIRA', 'NORA', 'REED', 'SORA', 'TEO', 'YUNA']\n12",
    referenceItems: [
      ref("set(names)", "중복 없는 이름 목록 만들기"),
      ref("names.count(name)", "특정 이름이 몇 번 나오는지 세기"),
      ref("if names.count(name) >= 2", "반복 이름 확인"),
      ref("len(repeated)", "반복 이름 개수 확인"),
    ],
    rewardHint: hint("room-1-hint-name-card", "room-1", "room-1-name-card", "각 자리 숫자의 합은 27이다."),
    starterCode: `data = """${room1NameCardData}"""

names = data.split()

repeated = []
for name in set(names):
    if names.count(name) >= 2:
        repeated.append(name)

print(sorted(repeated))
print(len(repeated))
`,
  },
  {
    id: "room-1-radio-signal",
    roomId: "room-1",
    title: "라디오 장치",
    objectId: "room-1-radio-signal",
    situationText: "목록의 숫자 중 3의 배수이고 끝자리가 2인 것만 골라라.",
    dataText: room1RadioSignalData,
    expectedAnswer: "3164",
    mockOutput: "[822, 522, 252, 132, 282, 882, 822, 252, 612, 942, 462]",
    referenceItems: [
      ref('str(n).endswith("2")', "끝자리가 2인지 확인"),
      ref("n % 3 == 0", "3의 배수 확인"),
      ref("int(x)", "문자열을 숫자로 바꾸기"),
      ref("for / if", "조건에 맞는 값만 고르기"),
    ],
    rewardHint: hint("room-1-hint-radio-signal", "room-1", "room-1-radio-signal", "코드는 홀수다."),
    starterCode: `data = """${room1RadioSignalData}"""

nums = [int(x) for x in data.split()]

result = []
for n in nums:
    if n % 3 == 0 and str(n).endswith("2"):
        result.append(n)

print(result)
`,
  },
  {
    id: "room-1-checksum-tablet",
    roomId: "room-1",
    title: "체크섬 태블릿",
    objectId: "room-1-checksum-tablet",
    situationText: "PASS 판정을 받은 코드의 두 번째 자리 숫자가 해제 코드와 관련된 단서다.",
    dataText: room1ChecksumTabletData,
    expectedAnswer: "2748",
    mockOutput: "4",
    referenceItems: [
      ref("splitlines()", "줄 단위로 나누기"),
      ref("line.split()", "코드와 결과 나누기"),
      ref("code[1]", "두 번째 숫자 가져오기"),
      ref('result == "PASS"', "통과한 코드만 확인하기"),
    ],
    rewardHint: hint("room-1-hint-checksum-tablet", "room-1", "room-1-checksum-tablet", "두 번째 숫자는 4다."),
    starterCode: `data = """${room1ChecksumTabletData}"""

for line in data.strip().splitlines():
    code, result = line.split()
    if result == "PASS":
        print(code[1])
`,
  },
  {
    id: "room-2-file-cabinet",
    roomId: "room-2",
    title: "파일 캐비닛",
    objectId: "room-2-file-cabinet",
    situationText: "파일 목록에 완전히 동일한 기록이 여럿 포함되어 있다. 각기 다른 기록의 수를 세어라.",
    dataText: `A104 / login / success
A117 / scan / fail
A104 / login / success
A221 / access / success
A117 / scan / fail
A305 / logout / success
A400 / sync / fail
A221 / access / success
A510 / backup / success
A400 / sync / fail`,
    expectedAnswer: "4106",
    mockOutput: "6",
    referenceItems: [ref("splitlines()", "여러 줄 문자열 나누기"), ref("set(records)", "중복 제거하기"), ref("len()", "개수 확인하기")],
    rewardHint: hint("room-2-hint-file-cabinet", "room-2", "room-2-file-cabinet", "첫 번째 숫자는 3이다."),
    starterCode: `data = """A104 / login / success
A117 / scan / fail
A104 / login / success
A221 / access / success
A117 / scan / fail
A305 / logout / success
A400 / sync / fail
A221 / access / success
A510 / backup / success
A400 / sync / fail"""

records = data.strip().splitlines()
unique = set(records)

print(len(unique))
`,
  },
  {
    id: "room-2-broken-tags",
    roomId: "room-2",
    title: "손상된 명찰",
    objectId: "room-2-broken-tags",
    situationText: "명찰의 표기가 제각각이지만 같은 사람의 이름일 수 있다. 실제 몇 명인지 파악하면 해제 코드가 된다.",
    dataText: `kim-minhyuk
Kim Minhyuk
KIM_MINHYUK
lee-seoyeon
Lee Seoyeon
park-jihoon
PARK JIHOON
choi-yuna
CHOI_YUNA
choi-yuna`,
    expectedAnswer: "5204",
    mockOutput: "4",
    referenceItems: [
      ref("lower()", "소문자로 통일하기"),
      ref("replace()", "문자 바꾸기"),
      ref("set()", "중복 제거하기"),
      ref("strip()", "앞뒤 공백 제거하기"),
    ],
    rewardHint: hint("room-2-hint-broken-tags", "room-2", "room-2-broken-tags", "두 번째 숫자는 5다."),
    starterCode: `data = """kim-minhyuk
Kim Minhyuk
KIM_MINHYUK
lee-seoyeon
Lee Seoyeon
park-jihoon
PARK JIHOON
choi-yuna
CHOI_YUNA
choi-yuna"""

names = data.strip().splitlines()

cleaned = []
for name in names:
    name = name.lower()
    name = name.replace("-", " ")
    name = name.replace("_", " ")
    cleaned.append(name)

print(set(cleaned))
print(len(set(cleaned)))
`,
  },
  {
    id: "room-2-score-board",
    roomId: "room-2",
    title: "점수 보드",
    objectId: "room-2-score-board",
    situationText: "이름 목록과 점수 목록이 분리되어 있고 두 목록은 ID를 공유한다. ID를 단서로 가장 높은 점수의 주인공 이름을 찾아라.",
    dataText: `NAMES
P01 / MIRA
P02 / JONAS
P03 / FAYE
P04 / AXEL
P05 / NORA

SCORES
P03 / 87
P01 / 92
P05 / 78
P02 / 95
P04 / 81`,
    expectedAnswer: "9421",
    mockOutput: "JONAS 95",
    referenceItems: [
      ref("dict", "ID와 이름 연결하기"),
      ref('split("/")', "구분자로 나누기"),
      ref("int(score)", "점수를 숫자로 바꾸기"),
      ref(">", "값 비교하기"),
    ],
    rewardHint: hint("room-2-hint-score-board", "room-2", "room-2-score-board", "세 번째 숫자는 4다."),
    starterCode: `names_text = """P01 / MIRA
P02 / JONAS
P03 / FAYE
P04 / AXEL
P05 / NORA"""

scores_text = """P03 / 87
P01 / 92
P05 / 78
P02 / 95
P04 / 81"""

name_by_id = {}

for line in names_text.strip().splitlines():
    pid, name = [x.strip() for x in line.split("/")]
    name_by_id[pid] = name

best_name = ""
best_score = -1

for line in scores_text.strip().splitlines():
    pid, score = [x.strip() for x in line.split("/")]
    score = int(score)

    if score > best_score:
        best_score = score
        best_name = name_by_id[pid]

print(best_name, best_score)
`,
  },
  {
    id: "room-2-access-log",
    roomId: "room-2",
    title: "접근 로그",
    objectId: "room-2-access-log",
    situationText: "로그에서 success로 기록된 항목 중 가장 마지막 항목의 사용자가 해제 코드와 관련된다.",
    dataText: `11:52 / CAMERA / noise
12:01 / ADMIN / login / success
12:03 / GUEST / access / fail
12:05 / DOOR / opened / success
12:08 / FILE / removed / success
12:10 / ADMIN / logout / success
12:12 / SYSTEM / sync / fail`,
    expectedAnswer: "7710",
    mockOutput: "ADMIN logout 12:10",
    referenceItems: [
      ref('"success" in line', "문자열 포함 여부 확인하기"),
      ref("last_success = line", "변수 갱신하기"),
      ref("splitlines()", "줄 단위로 나누기"),
    ],
    rewardHint: hint("room-2-hint-access-log", "room-2", "room-2-access-log", "마지막 숫자는 7이다."),
    starterCode: `data = """11:52 / CAMERA / noise
12:01 / ADMIN / login / success
12:03 / GUEST / access / fail
12:05 / DOOR / opened / success
12:08 / FILE / removed / success
12:10 / ADMIN / logout / success
12:12 / SYSTEM / sync / fail"""

last_success = ""

for line in data.strip().splitlines():
    if "success" in line:
        last_success = line

print(last_success)
`,
  },
  {
    id: "room-2-timeline",
    roomId: "room-2",
    title: "타임라인 보드",
    objectId: "room-2-timeline",
    situationText: "사건 기록이 시간 순서 없이 섞여 있다. 시간을 기준으로 가장 나중에 일어난 사건을 찾아라.",
    dataText: `12:05 / door opened
11:58 / power off
12:01 / admin login
12:03 / warning signal
12:08 / file removed
11:52 / camera noise
12:10 / admin logout`,
    expectedAnswer: "8305",
    mockOutput: "12:10 / admin logout",
    referenceItems: [ref("sorted()", "정렬하기"), ref("events[-1]", "마지막 항목 가져오기"), ref("시간 문자열 정렬", "HH:MM 형식은 문자열 정렬로도 순서를 맞출 수 있음")],
    rewardHint: hint("room-2-hint-timeline", "room-2", "room-2-timeline", "코드는 홀수다."),
    starterCode: `data = """12:05 / door opened
11:58 / power off
12:01 / admin login
12:03 / warning signal
12:08 / file removed
11:52 / camera noise
12:10 / admin logout"""

events = data.strip().splitlines()
events = sorted(events)

for event in events:
    print(event)

print("last:", events[-1])
`,
  },
  {
    id: "room-2-checksum-ledger",
    roomId: "room-2",
    title: "체크섬 장부",
    objectId: "room-2-checksum-ledger",
    situationText: "PASS 판정된 코드의 각 자리 숫자를 모두 더한 값이 해제 코드와 관련된 단서다.",
    dataText: `3547 / digit sum / PASS
3546 / digit sum / FAIL
2547 / digit sum / FAIL
3557 / digit sum / FAIL`,
    expectedAnswer: "6251",
    mockOutput: "19",
    referenceItems: [
      ref("line.split('/')", "슬래시 구분자로 나누기"),
      ref("sum(int(x) for x in code)", "자리수 합 구하기"),
      ref('status == "PASS"', "통과 기록 확인하기"),
    ],
    rewardHint: hint("room-2-hint-checksum-ledger", "room-2", "room-2-checksum-ledger", "각 자리 숫자의 합은 19다."),
    starterCode: `data = """3547 / digit sum / PASS
3546 / digit sum / FAIL
2547 / digit sum / FAIL
3557 / digit sum / FAIL"""

for line in data.strip().splitlines():
    code, _, status = [x.strip() for x in line.split("/")]
    if status == "PASS":
        print(sum(int(x) for x in code))
`,
  },
  {
    id: "room-3-switch-panel",
    roomId: "room-3",
    title: "스위치 패널",
    objectId: "room-3-switch-panel",
    situationText: "6개 스위치에 0 또는 1이 배정된다. 아래 조건을 모두 만족하는 배정이 몇 가지인지 세어라.",
    dataText: `S1 S2 S3 S4 S5 S6
각 스위치는 0 또는 1
켜진 스위치는 3개
S2는 켜져 있다
S5는 꺼져 있다
S1과 S6은 다르다`,
    expectedAnswer: "6060",
    mockOutput: "6",
    referenceItems: [
      ref("for 중첩", "여러 스위치 조합을 모두 확인하기"),
      ref("sum(switches)", "켜진 스위치 개수 세기"),
      ref("continue", "조건에 맞지 않으면 건너뛰기"),
      ref("list", "상태를 리스트로 표현하기"),
    ],
    rewardHint: hint("room-3-hint-switch-panel", "room-3", "room-3-switch-panel", "마지막 숫자는 6이다."),
    starterCode: `count = 0
valid = []

for s1 in [0, 1]:
    for s2 in [0, 1]:
        for s3 in [0, 1]:
            for s4 in [0, 1]:
                for s5 in [0, 1]:
                    for s6 in [0, 1]:
                        switches = [s1, s2, s3, s4, s5, s6]

                        if sum(switches) != 3:
                            continue
                        if s2 != 1:
                            continue
                        if s5 != 0:
                            continue
                        if s1 == s6:
                            continue

                        count += 1
                        valid.append(switches)

print(count)
print(valid)
`,
  },
  {
    id: "room-3-logic-gate",
    roomId: "room-3",
    title: "논리 게이트 보드",
    objectId: "room-3-logic-gate",
    situationText: "표의 각 행에 규칙을 적용해 OUT 값을 채워라. 채운 OUT 값을 위에서부터 이어 읽으면 해제 코드가 된다.",
    dataText: `A B C D | OUT
0 0 0 1 | ?
0 1 1 0 | ?
1 0 1 1 | ?
1 1 0 0 | ?

규칙:
G1 = A와 B 중 하나만 1이면 1, 아니면 0
G2 = C와 D가 모두 1이면 1, 아니면 0
OUT = G1 또는 G2 중 하나라도 1이면 1, 아니면 0`,
    expectedAnswer: "1101",
    mockOutput: "0\n1\n1\n0",
    referenceItems: [ref("^", "둘 중 하나만 1일 때 1"), ref("&", "둘 다 1일 때 1"), ref("|", "하나 이상 1일 때 1"), ref("for", "여러 행에 같은 규칙 적용하기")],
    rewardHint: hint("room-3-hint-logic-gate", "room-3", "room-3-logic-gate", "첫 번째 숫자는 4다."),
    starterCode: `cases = [
    (0, 0, 0, 1),
    (0, 1, 1, 0),
    (1, 0, 1, 1),
    (1, 1, 0, 0),
]

for a, b, c, d in cases:
    g1 = a ^ b
    g2 = c & d
    out = g1 | g2
    print(out)
`,
  },
  {
    id: "room-3-candidate-codes",
    roomId: "room-3",
    title: "후보 코드 보드",
    objectId: "room-3-candidate-codes",
    situationText: "네 조건을 모두 만족하는 코드가 해제 코드다.",
    dataText: `4026 4726 4926 4028 4126 9026
4006 3026 4426 4016 4022 4024

조건:
두 번째 숫자는 0
마지막 숫자는 6
각 자리 합은 12
첫 번째 숫자는 짝수`,
    expectedAnswer: "4026",
    mockOutput: "4026",
    referenceItems: [
      ref("code[1]", "문자열 인덱싱"),
      ref("sum(digits)", "자리수 합"),
      ref("continue", "조건 불일치 시 건너뛰기"),
      ref("int()", "문자 숫자를 정수로 바꾸기"),
    ],
    rewardHint: hint("room-3-hint-candidate-codes", "room-3", "room-3-candidate-codes", "두 번째 숫자는 0이다."),
    starterCode: `data = """4026 4726 4926 4028 4126 9026
4006 3026 4426 4016 4022 4024"""

candidates = data.split()

for code in candidates:
    digits = [int(x) for x in code]

    if code[1] != "0":
        continue
    if code[-1] != "6":
        continue
    if sum(digits) != 12:
        continue
    if int(code[0]) % 2 != 0:
        continue

    print(code)
`,
  },
  {
    id: "room-3-warning-lamp",
    roomId: "room-3",
    title: "경고 램프 보드",
    objectId: "room-3-warning-lamp",
    situationText: "조건에 따라 각 경우에 경고등이 켜지는지 판단하라. 켜지면 1, 꺼지면 0으로 기록해서 위에서부터 이어 읽으면 해제 코드가 된다.",
    dataText: `A B C | LAMP
1 0 1 | ?
1 1 0 | ?
0 1 1 | ?
0 0 1 | ?

조건 암시:
A가 켜져 있고, B 또는 C 중 하나 이상이 켜져 있으면 경고등이 켜진다.`,
    expectedAnswer: "2408",
    mockOutput: "1\n1\n0\n0",
    referenceItems: [ref("and", "그리고"), ref("or", "또는"), ref("( )", "괄호로 조건 묶기"), ref("int(lamp)", "bool 결과를 숫자로 바꾸기")],
    rewardHint: hint("room-3-hint-warning-lamp", "room-3", "room-3-warning-lamp", "첫 번째 숫자는 짝수다."),
    starterCode: `cases = [
    (1, 0, 1),
    (1, 1, 0),
    (0, 1, 1),
    (0, 0, 1),
]

for a, b, c in cases:
    lamp = a == 1 and (b == 1 or c == 1)
    print(int(lamp))
`,
  },
  {
    id: "room-3-experiment",
    roomId: "room-3",
    title: "실험 콘솔",
    objectId: "room-3-experiment",
    situationText: "후보 코드들 중 세 규칙을 모두 만족하는 코드만 살아남는다. 살아남은 코드의 수가 해제 코드와 관련된 단서다.",
    dataText: `후보:
4026 4726 4926 4028 4126 9026

규칙:
길이는 4
두 번째 숫자는 0
마지막 숫자는 6`,
    expectedAnswer: "7022",
    mockOutput: "4026\n9026",
    referenceItems: [ref("def", "함수 만들기"), ref("return", "결과 반환하기"), ref("if", "조건을 함수로 묶기"), ref("for", "여러 후보에 같은 규칙 적용하기")],
    rewardHint: hint("room-3-hint-experiment", "room-3", "room-3-experiment", "세 번째 숫자는 2다."),
    starterCode: `candidates = "4026 4726 4926 4028 4126 9026".split()

def valid(code):
    if len(code) != 4:
        return False
    if code[1] != "0":
        return False
    if code[-1] != "6":
        return False
    return True

for code in candidates:
    if valid(code):
        print(code)
`,
  },
  {
    id: "room-3-power-meter",
    roomId: "room-3",
    title: "전력 측정기",
    objectId: "room-3-power-meter",
    situationText: "stable로 표시된 코드의 자리 숫자를 모두 더한 값이 해제 코드와 관련된 단서다.",
    dataText: `4026 stable
4726 overload
3026 low
9026 overload`,
    expectedAnswer: "5188",
    mockOutput: "12",
    referenceItems: [
      ref("code in line", "줄에서 코드 분리하기"),
      ref("sum()", "합계 구하기"),
      ref("int(digit)", "문자 숫자를 정수로 바꾸기"),
    ],
    rewardHint: hint("room-3-hint-power-meter", "room-3", "room-3-power-meter", "각 자리 숫자의 합은 12다."),
    starterCode: `data = """4026 stable
4726 overload
3026 low
9026 overload"""

for line in data.strip().splitlines():
    code, state = line.split()
    if state == "stable":
        print(sum(int(digit) for digit in code))
`,
  },
  {
    id: "room-4-validator",
    roomId: "room-4",
    title: "손상된 검증기",
    objectId: "room-4-validator",
    situationText: "검증기가 각 코드에 PASS 또는 FAIL을 기록했다. 세 규칙을 직접 확인했을 때 잘못 기록된 항목의 수를 세어라.",
    dataText: `규칙:
두 번째 자리는 5
마지막 자리는 짝수
각 자리 합은 18

기록:
1584 PASS
1594 PASS
3564 PASS
2584 PASS
9540 PASS`,
    expectedAnswer: "2062",
    mockOutput: "Wrong conditions: 2",
    referenceItems: [
      ref("code[1]", "두 번째 자리 확인하기"),
      ref("int(code[-1]) % 2 == 0", "짝수 확인하기"),
      ref("sum(int(d) for d in code)", "자리 합 구하기"),
      ref("wrong += 1", "개수 세기"),
    ],
    rewardHint: hint("room-4-hint-validator", "room-4", "room-4-validator", "두 번째 숫자는 5다."),
    starterCode: `data = """1584 PASS
1594 PASS
3564 PASS
2584 PASS
9540 PASS"""

wrong = 0
for line in data.strip().splitlines():
    code, status = line.split()
    d2 = code[1]
    last = int(code[-1])
    total = sum(int(d) for d in code)

    should_pass = (d2 == "5") and (last % 2 == 0) and (total == 18)

    if (should_pass and status == "FAIL") or (not should_pass and status == "PASS"):
        wrong += 1

print("Wrong conditions:", wrong)
`,
  },
  {
    id: "room-4-test-log",
    roomId: "room-4",
    title: "테스트 로그",
    objectId: "room-4-test-log",
    situationText: "테스트 결과에서 PASS로 기록된 코드를 찾으면 해제 코드와 관련된 단서를 얻는다.",
    dataText: `1484 FAIL
1584 PASS
1684 FAIL
1594 FAIL
2584 FAIL`,
    expectedAnswer: "1111",
    mockOutput: "1584",
    referenceItems: [ref("splitlines()", "줄 단위 나누기"), ref("split()", "공백 기준 나누기"), ref('result == "PASS"', "조건 확인하기")],
    rewardHint: hint("room-4-hint-test-log", "room-4", "room-4-test-log", "첫 번째 숫자는 1이다."),
    starterCode: `data = """1484 FAIL
1584 PASS
1684 FAIL
1594 FAIL
2584 FAIL"""

for line in data.strip().splitlines():
    code, result = line.split()
    if result == "PASS":
        print(code)
`,
  },
  {
    id: "room-4-candidate-dial",
    roomId: "room-4",
    title: "후보 다이얼",
    objectId: "room-4-candidate-dial",
    situationText: "1000부터 9999 사이에서 세 조건을 처음으로 만족하는 숫자를 찾아야 한다. 그 숫자가 해제 코드와 관련된다.",
    dataText: `조건:
두 번째 숫자는 5
마지막 숫자는 짝수
각 자리 합은 18`,
    expectedAnswer: "9500",
    mockOutput: "1584",
    referenceItems: [
      ref("while", "조건이 참인 동안 반복하기"),
      ref("break", "반복 종료하기"),
      ref("str(n)", "숫자를 문자열로 바꾸기"),
      ref("for digit in code", "자리수 합 계산하기"),
    ],
    rewardHint: hint("room-4-hint-candidate-dial", "room-4", "room-4-candidate-dial", "마지막 숫자는 4다."),
    starterCode: `n = 1000

while n < 10000:
    code = str(n)

    if code[1] == "5" and int(code[-1]) % 2 == 0:
        total = 0
        for digit in code:
            total += int(digit)

        if total == 18:
            print(code)
            break

    n += 1
`,
  },
  {
    id: "room-4-error-server",
    roomId: "room-4",
    title: "에러 로그 서버",
    objectId: "room-4-error-server",
    situationText: "서버 로그에 오류 코드와 원인이 섞여 있다. 각 오류 코드에 알맞은 원인을 연결해서 출력하라.",
    dataText: `E01: 없는 위치 접근
E02: 형식 불일치
E03: 알 수 없는 이름`,
    expectedAnswer: "3840",
    mockOutput: "E01 -> 없는 위치 접근\nE02 -> 형식 불일치\nE03 -> 알 수 없는 이름",
    referenceItems: [
      ref("if / elif", "여러 조건 차례로 확인하기"),
      ref('error == "E01"', "코드가 같은지 비교하기"),
      ref("for error in errors", "오류 목록 반복하기"),
    ],
    rewardHint: hint("room-4-hint-error-server", "room-4", "room-4-error-server", "세 번째 숫자는 8이다."),
    starterCode: `errors = ["E01", "E02", "E03"]

for error in errors:
    if error == "E01":
        print(error, "-> 없는 위치 접근")
    elif error == "E02":
        print(error, "-> 형식 불일치")
    elif error == "E03":
        print(error, "-> 알 수 없는 이름")
`,
  },
  {
    id: "room-4-broken-crt",
    roomId: "room-4",
    title: "손상된 CRT",
    objectId: "room-4-broken-crt",
    situationText: "입력, 기대 출력, 실제 출력이 함께 표시된다. 기대와 실제가 다른 원인을 파악하면 해제 코드를 구성할 수 있다.",
    dataText: `입력 -> 기대 출력 / 실제 출력
AB12 -> 12AB / AB12
CD34 -> 34CD / CD34
EF56 -> 56EF / EF56`,
    expectedAnswer: "6408",
    mockOutput: "문자와 숫자의 위치를 바꾸지 않았다",
    referenceItems: [ref("a, b, c = item", "한 줄에 여러 값 받기"), ref("code[2:4]", "문자열 일부 잘라내기"), ref("expected != actual", "기대와 실제가 다른지 비교하기"), ref("!=", "서로 다름 확인하기")],
    rewardHint: hint("room-4-hint-broken-crt", "room-4", "room-4-broken-crt", "코드는 4자리다."),
    starterCode: `pairs = [
    ("AB12", "12AB", "AB12"),
    ("CD34", "34CD", "CD34"),
    ("EF56", "56EF", "EF56"),
]

for original, expected, actual in pairs:
    if expected != actual:
        print(original, "문자와 숫자의 위치를 바꾸지 않았다")
`,
  },
  {
    id: "room-4-sum-analyzer",
    roomId: "room-4",
    title: "합계 분석기",
    objectId: "room-4-sum-analyzer",
    situationText: "PASS로 기록된 코드의 자리 숫자를 모두 더한 값이 해제 코드와 관련된 단서다.",
    dataText: `1584 PASS
1484 FAIL
1594 FAIL
2584 FAIL`,
    expectedAnswer: "7302",
    mockOutput: "18",
    referenceItems: [
      ref("splitlines()", "줄 단위로 나누기"),
      ref("sum(int(digit) for digit in code)", "자리수 합 계산하기"),
      ref('result == "PASS"', "통과한 코드만 확인하기"),
    ],
    rewardHint: hint("room-4-hint-sum-analyzer", "room-4", "room-4-sum-analyzer", "각 자리 숫자의 합은 18이다."),
    starterCode: `data = """1584 PASS
1484 FAIL
1594 FAIL
2584 FAIL"""

for line in data.strip().splitlines():
    code, result = line.split()
    if result == "PASS":
        print(sum(int(digit) for digit in code))
`,
  },
];

export const puzzlesById = Object.fromEntries(puzzles.map((puzzle) => [puzzle.id, puzzle])) as Record<string, Puzzle>;

export function getPuzzlesForRoom(roomId: string): Puzzle[] {
  return puzzles.filter((puzzle) => puzzle.roomId === roomId);
}
