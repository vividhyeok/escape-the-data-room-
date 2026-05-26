import type { Puzzle, ReferenceItem, RoomHint } from "./types";

function ref(label: string, description: string): ReferenceItem {
  return { label, description };
}

function hint(id: string, roomId: string, puzzleId: string, text: string): RoomHint {
  return { id, roomId, puzzleId, text, description: text, value: text };
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

const room1NumberPanelData = `13 48 77 91 35 20 57 83
64 101 29 75 39 94 118 27
55 70 33 86 121 17 62 99
41 58 73 105 111 25 69 87`;

const room1NameCardData = `MIRA:8 ZOE:3 AXEL:0 FAYE:5 RINA:2 NORA:6
JONAS:4 MIRA:8 KAI:1 AXEL:0 EDEN:9
FAYE:5 LEO:7 SORA:4 RINA:2 YUNA:6
DANA:1 REED:3 OMAR:9 LINA:7`;

const room1RadioSignalData = `3:822 8:441 5:230 1:522 7:413
6:252 9:845 4:132 2:211 0:569
5:846 8:409 1:697 7:768 2:985`;

const room1NoiseStripData = `A2X7Q4M8`;

export const puzzles: Puzzle[] = [
  {
    id: "room-0-tv-sequence",
    roomId: "room-0",
    title: "CRT TV",
    objectId: "room-0-tv-sequence",
    situationText: "낡은 TV에 센서 수치들이 쏟아진다. 이 중 가장 높은 값 하나를 건져낸 후—그 수를 4번 이어 적어라.",
    dataText: "[3, 2, 5, 1, 4, 6, 2, 5, 7, 1, 3, 2, 4, 6, 5, 1, 2, 4, 7, 3, 5, 2, 1, 6, 4, 3, 5, 2, 7, 1, 4, 6, 8, 2, 5, 3, 1, 4, 7, 2, 5, 6, 1, 3, 4, 2, 5, 1, 6, 3]",
    expectedAnswer: "8888",
    mockOutput: "8\n8888",
    referenceItems: [
      ref("max(list)", "리스트 안에서 가장 큰 값 찾기"),
      ref("min(list)", "리스트 안에서 가장 작은 값 찾기"),
      ref("str(number)", "숫자를 문자열로 바꾸기")
    ],
    rewardHint: hint("room-0-hint-crt-tv", "room-0", "room-0-tv-sequence", "첫째 자리는 8이다."),
    starterCode: `sensors = [3, 2, 5, 1, 4, 6, 2, 5, 7, 1, 3, 2, 4, 6, 5, 1, 2, 4, 7, 3, 5, 2, 1, 6, 4, 3, 5, 2, 7, 1, 4, 6, 8, 2, 5, 3, 1, 4, 7, 2, 5, 6, 1, 3, 4, 2, 5, 1, 6, 3]

# 최댓값을 찾아 출력하세요
highest = max(sensors)
print(highest)
print(str(highest) * 4)
`,
    isRequired: true,
    requiredForDoor: true,
    doorCodePiece: "8",
    doorCodePosition: 1,
    targetConcepts: ["max", "list", "str", "print"],
    usefulConcepts: ["finding_maximum", "aggregation"],
    puzzleType: "tutorial_max_value",
    expectedStrategyDescription: "리스트 내의 숫자 중 가장 큰 값을 max() 함수로 찾는다.",
  },
  {
    id: "room-0-desk-terminal",
    roomId: "room-0",
    title: "데스크 터미널",
    objectId: "room-0-desk-terminal",
    situationText: "터미널 화면에 슬래시로 구분된 문자열이 깜빡인다. 세 번째 조각의 숫자를 읽어 4번 이어 적어라.",
    dataText: "SYSTEM / ONLINE / 7 / NORMAL",
    expectedAnswer: "7777",
    mockOutput: "7\n7777",
    referenceItems: [
      ref('data.split("/")', "슬래시 기준으로 문자열 나누기"),
      ref("parts[2]", "세 번째 항목 가져오기 (인덱스는 0부터 시작)"),
      ref("part.strip()", "앞뒤 공백 제거하기"),
    ],
    rewardHint: hint("room-0-hint-desk-terminal", "room-0", "room-0-desk-terminal", "숨겨진 단서 확인: 인덱스 2번 항목을 추출했다."),
    starterCode: "data = \"SYSTEM / ONLINE / 7 / NORMAL\"\\n\\nparts = data.split(\"/\")\\nvalue = parts[2].strip()\\n\\nprint(value)\\nprint(str(value) * 4)\\n",
    isRequired: false,
    isHidden: true,
    requiredForDoor: false,
    targetConcepts: ["split", "indexing", "strip"],
    usefulConcepts: ["string_parsing"],
    puzzleType: "tutorial_split_indexing",
    expectedStrategyDescription: "문자열을 특정 기호로 나누고 인덱스로 접근해 값을 얻는다.",
  },
  {
    id: "room-0-mini-ox-card",
    roomId: "room-0",
    title: "OX 카드",
    objectId: "room-0-mini-ox-card",
    situationText: "빛바랜 출입 카드. 수치들 중 30 이상만 유효 신호로 인정된다는 메모가 보인다. 유효한 것의 수를 세어—그 숫자를 4번 이어 적어라.",
    dataText: "[12, 15, 22, 18, 29, 14, 19, 21, 25, 28, 11, 17, 24, 26, 13, 20, 27, 23, 16, 29, 31, 12, 15, 22, 18, 35, 14, 19, 21, 42, 28, 11, 17, 50, 26, 13, 20, 65, 23, 16]",
    expectedAnswer: "5555",
    mockOutput: "5\n5555",
    referenceItems: [
      ref("for x in list:", "리스트의 요소를 하나씩 확인하기"),
      ref("if x >= 30:", "값이 30 이상인지 조건 검사하기"),
      ref("count += 1", "개수 누적해서 세기")
    ],
    rewardHint: hint("room-0-hint-mini-ox", "room-0", "room-0-mini-ox-card", "둘째 자리는 5다."),
    starterCode: `data = [12, 15, 22, 18, 29, 14, 19, 21, 25, 28, 11, 17, 24, 26, 13, 20, 27, 23, 16, 29, 31, 12, 15, 22, 18, 35, 14, 19, 21, 42, 28, 11, 17, 50, 26, 13, 20, 65, 23, 16]
count = 0

for x in data:
    if x >= 30:
        count += 1

print(count)
print(str(count) * 4)
`,
    isRequired: true,
    requiredForDoor: true,
    doorCodePiece: "5",
    doorCodePosition: 2,
    targetConcepts: ["for", "if", "comparison_operator", "counting"],
    usefulConcepts: ["filtering", "counting_with_conditions"],
    puzzleType: "tutorial_conditional_counting",
    expectedStrategyDescription: "반복문과 조건문을 사용하여 특정 조건을 만족하는 데이터의 개수를 센다.",
  },
  {
    id: "room-0-name-tags",
    roomId: "room-0",
    title: "명찰 묶음",
    objectId: "room-0-name-tags",
    situationText: "묶음 명찰들 속에 'cat'이 숨어 있다. 정확히 몇 번 등장하는지 세어—그 수를 4번 이어 적어라.",
    dataText: "['bat', 'rat', 'mat', 'pat', 'bat', 'rat', 'mat', 'pat', 'bat', 'cat', 'rat', 'mat', 'pat', 'bat', 'rat', 'mat', 'pat', 'bat', 'rat', 'mat', 'pat', 'bat', 'rat', 'cat', 'mat', 'pat', 'bat', 'rat', 'mat', 'pat', 'bat', 'rat', 'mat', 'pat']",
    expectedAnswer: "2222",
    mockOutput: "2\n2222",
    referenceItems: [
      ref("dict = {}", "비어 있는 딕셔너리 만들기"),
      ref("dict[key] = value", "딕셔너리에 키와 값 저장하기"),
      ref("if key in dict:", "딕셔너리에 키가 존재하는지 확인하기")
    ],
    rewardHint: hint("room-0-hint-name-tags", "room-0", "room-0-name-tags", "셋째 자리는 2다."),
    starterCode: `labels = ['bat', 'rat', 'mat', 'pat', 'bat', 'rat', 'mat', 'pat', 'bat', 'cat', 'rat', 'mat', 'pat', 'bat', 'rat', 'mat', 'pat', 'bat', 'rat', 'mat', 'pat', 'bat', 'rat', 'cat', 'mat', 'pat', 'bat', 'rat', 'mat', 'pat', 'bat', 'rat', 'mat', 'pat']
counts = {}

for label in labels:
    if label in counts:
        counts[label] += 1
    else:
        counts[label] = 1

print(counts["cat"])
print(str(counts["cat"]) * 4)
`,
    isRequired: true,
    requiredForDoor: true,
    doorCodePiece: "2",
    doorCodePosition: 3,
    targetConcepts: ["dict", "for", "if", "frequency_counting"],
    usefulConcepts: ["dictionary_frequency", "data_aggregation"],
    puzzleType: "tutorial_frequency_count",
    expectedStrategyDescription: "딕셔너리를 활용해 각 데이터의 출현 빈도수를 계산한다.",
  },
  {
    id: "room-0-pattern-tiles",
    roomId: "room-0",
    title: "패턴 타일 박스",
    objectId: "room-0-pattern-tiles",
    situationText: "타일 뒷면에 긴 숫자 열이 빼곡하다. '38번째 값'이라는 메모가 흐릿하게 보인다. 그 위치의 숫자를 찾아—4번 이어 적어라.",
    dataText: "[4, 1, 3, 6, 9, 2, 5, 7, 1, 3, 2, 4, 6, 5, 1, 2, 4, 7, 3, 5, 2, 1, 6, 4, 3, 5, 2, 7, 1, 4, 6, 2, 5, 3, 1, 4, 7, 2, 8, 1, 3, 4, 2, 5, 1, 6, 3]",
    expectedAnswer: "8888",
    mockOutput: "8\n8888",
    referenceItems: [
      ref("list[index]", "리스트에서 특정 인덱스의 값 가져오기"),
      ref("list[0]", "첫 번째 항목 가져오기")
    ],
    rewardHint: hint("room-0-hint-pattern-tiles", "room-0", "room-0-pattern-tiles", "넷째 자리는 8이다."),
    starterCode: `series = [4, 1, 3, 6, 9, 2, 5, 7, 1, 3, 2, 4, 6, 5, 1, 2, 4, 7, 3, 5, 2, 1, 6, 4, 3, 5, 2, 7, 1, 4, 6, 2, 5, 3, 1, 4, 7, 2, 8, 1, 3, 4, 2, 5, 1, 6, 3]

# 인덱스 38번 값을 찾아 출력하세요
value = series[38]

print(value)
print(str(value) * 4)
`,
    isRequired: true,
    requiredForDoor: true,
    doorCodePiece: "8",
    doorCodePosition: 4,
    targetConcepts: ["indexing", "list"],
    usefulConcepts: ["position_lookup"],
    puzzleType: "tutorial_indexing",
    expectedStrategyDescription: "리스트의 인덱싱 기능을 활용해 특정 위치의 데이터를 추출한다.",
  },
  {
    id: "room-0-bookshelf-note",
    roomId: "room-0",
    title: "책장 쪽지",
    objectId: "room-0-bookshelf-note",
    situationText: "책장 틈에서 쪽지가 나왔다—이름, 번호, 판정이 한 줄씩. PASS 판정을 받은 항목의 번호를 그대로 입력하라.",
    dataText: `MIRA / 2301 / WAIT
JONAS / 4410 / PASS
AXEL / 1220 / WAIT`,
    expectedAnswer: "4410",
    mockOutput: "4410",
    referenceItems: [ref("data.splitlines()", "여러 줄 데이터를 줄 단위로 나누기"), ref('line.split("/")', "슬래시 기준으로 한 줄 나누기"), ref("part.strip()", "앞뒤 공백 제거하기")],
    rewardHint: hint("room-0-hint-bookshelf-note", "room-0", "room-0-bookshelf-note", "줄 데이터는 먼저 줄 단위로 나누면 다루기 쉽다."),
    starterCode: `data = """MIRA / 2301 / WAIT\nJONAS / 4410 / PASS\nAXEL / 1220 / WAIT"""\n\nfor line in data.splitlines():\n    name, code, state = [part.strip() for part in line.split("/")]\n    if state == "PASS":\n        print(code)\n`,
    isRequired: false,
    requiredForDoor: false,
    targetConcepts: ["splitlines", "split", "strip", "for", "if"],
    usefulConcepts: ["line_parsing", "delimiter_parsing"],
    puzzleType: "tutorial_line_parsing",
    expectedStrategyDescription: "여러 줄 기록을 줄 단위로 나눈 뒤 각 줄을 구분자로 다시 나눠 조건에 맞는 값을 읽는다.",
  },
  {
    id: "room-1-word-billboard",
    roomId: "room-1",
    title: "단어 전광판",
    objectId: "room-1-word-billboard",
    situationText: "전광판을 가득 채운 단어들. 다섯 글자 단어의 가운데 글자만 이어 보면—의미 있는 무언가가 드러난다. 그걸 숫자로 해석해 입력하라.",
    dataText: room1WordBillboardData,
    expectedAnswer: "6719",
    mockOutput: "SIXSEVENONENINE",
    referenceItems: [
      ref("text.split()", "문자열을 단어 단위로 나누기"),
      ref("len(word)", "단어 길이 확인하기"),
      ref("word[2]", "세 번째 글자 가져오기"),
      ref("for word in words", "단어를 하나씩 확인하기"),
    ],
    rewardHint: hint("room-1-hint-word-billboard", "room-1", "room-1-word-billboard", "Door Code 1번째 조각: 7"),
    starterCode: `text = """${room1WordBillboardData}"""

words = text.split()

result = ""
for word in words:
    if len(word) == 5:
        result += word[2]

print(result)
`,
    isRequired: true,
    requiredForDoor: true,
    doorCodePiece: "7",
    doorCodePosition: 1,
    targetConcepts: ["split", "len", "indexing", "for", "if"],
    usefulConcepts: ["string_processing", "filtering"],
    puzzleType: "filtering",
    expectedStrategyDescription: "많은 단어 중 길이 조건에 맞는 항목을 고르고 특정 위치의 문자를 추출한다.",
  },
  {
    id: "room-1-ox-monitor",
    roomId: "room-1",
    title: "OX 모니터",
    objectId: "room-1-ox-monitor",
    situationText: "O와 X가 흐르는 모니터. X가 홀수 개인 줄만 골라—그 X의 수를 위에서부터 차례로 이으면 코드가 된다.",
    dataText: room1OxMonitorData,
    expectedAnswer: "1937",
    mockOutput: "1937",
    referenceItems: [
      ref("splitlines()", "여러 줄 문자열 나누기"),
      ref('row.count("X")', "X 개수 세기"),
      ref("% 2", "홀수/짝수 판별하기"),
      ref("enumerate(rows, 1)", "줄 번호를 1부터 함께 세기"),
      ref("str(number)", "숫자를 코드 조각으로 바꾸기"),
    ],
    rewardHint: hint("room-1-hint-ox-monitor", "room-1", "room-1-ox-monitor", "Door Code 2번째 조각: 4"),
    starterCode: `data = """${room1OxMonitorData}"""

rows = data.strip().splitlines()

code = ""
for row in rows:
    x_count = row.count("X")
    if x_count % 2 == 1:
        code += str(x_count)

print(code)
`,
    isRequired: true,
    requiredForDoor: true,
    doorCodePiece: "4",
    doorCodePosition: 2,
    targetConcepts: ["splitlines", "count", "modulo", "enumerate"],
    usefulConcepts: ["line_processing", "signal_counting"],
    puzzleType: "counting",
    expectedStrategyDescription: "여러 줄의 X 신호 개수를 세고 홀수 조건을 만족하는 줄의 값을 이어 읽는다.",
  },
  {
    id: "room-1-number-panel",
    roomId: "room-1",
    title: "숫자 패널",
    objectId: "room-1-number-panel",
    situationText: "패널의 숫자 대부분은 잡음이다. 50 미만이면서 4의 배수인 것만 골라—순서대로 이어 붙이면 코드가 된다.",
    dataText: room1NumberPanelData,
    expectedAnswer: "4820",
    mockOutput: "4820",
    referenceItems: [
      ref("int(x)", "문자열을 숫자로 바꾸기"),
      ref("n % 4 == 0", "4의 배수 확인"),
      ref("append()", "결과 리스트에 추가하기"),
      ref("for x in nums", "숫자를 하나씩 확인하기"),
    ],
    rewardHint: hint("room-1-hint-number-panel", "room-1", "room-1-number-panel", "Door Code 3번째 조각: 7"),
    starterCode: `data = """${room1NumberPanelData}"""

nums = data.split()

result = ""
for x in nums:
    n = int(x)
    if n < 50 and n % 4 == 0:
        result += str(n)

print(result)
`,
    isRequired: true,
    requiredForDoor: true,
    doorCodePiece: "7",
    doorCodePosition: 3,
    targetConcepts: ["int", "modulo", "for", "if", "filtering"],
    usefulConcepts: ["numeric_filtering"],
    puzzleType: "filtering",
    expectedStrategyDescription: "숫자 후보를 정수로 바꾸고 조건에 맞는 신호만 남겨 이어 붙인다.",
  },
  {
    id: "room-1-name-card",
    roomId: "room-1",
    title: "명함 보드",
    objectId: "room-1-name-card",
    situationText: "명함들 사이에 중복이 보인다. 두 번 이상 나온 이름의 숫자 태그를 처음 발견된 순서대로 이으면—코드가 나온다.",
    dataText: room1NameCardData,
    expectedAnswer: "8052",
    mockOutput: "8052",
    referenceItems: [
      ref("token.split(':')", "이름과 숫자 태그 나누기"),
      ref("set(names)", "중복 없는 이름 목록 만들기"),
      ref("names.count(name)", "특정 이름이 몇 번 나오는지 세기"),
      ref("if names.count(name) >= 2", "반복 이름 확인"),
    ],
    rewardHint: hint("room-1-hint-name-card", "room-1", "room-1-name-card", "Door Code 4번째 조각: 9"),
    starterCode: `data = """${room1NameCardData}"""

cards = data.split()
names = []
digits = {}

for card in cards:
    name, digit = card.split(":")
    names.append(name)
    if name not in digits:
        digits[name] = digit

code = ""
used = []
for name in names:
    if name in used:
        continue
    if names.count(name) >= 2:
        code += digits[name]
        used.append(name)

print(code)
`,
    isRequired: true,
    requiredForDoor: true,
    doorCodePiece: "9",
    doorCodePosition: 4,
    targetConcepts: ["split", "set", "count", "for", "if"],
    usefulConcepts: ["duplicate_detection"],
    puzzleType: "deduplication",
    expectedStrategyDescription: "이름과 숫자 태그를 분리하고 반복 등장한 이름의 태그만 처음 발견된 순서대로 이어 읽는다.",
  },
  {
    id: "room-1-radio-signal",
    roomId: "room-1",
    title: "라디오 장치",
    objectId: "room-1-radio-signal",
    situationText: "라디오에서 신호가 흘러나온다. 채널마다 주파수가 찍혀 있는데—3의 배수이고 끝자리가 2인 주파수의 채널 번호만 이으면 코드가 된다.",
    dataText: room1RadioSignalData,
    expectedAnswer: "3164",
    mockOutput: "3164",
    referenceItems: [
      ref('token.split(":")', "채널 번호와 주파수 나누기"),
      ref('str(n).endswith("2")', "끝자리가 2인지 확인"),
      ref("n % 3 == 0", "3의 배수 확인"),
      ref("int(x)", "문자열을 숫자로 바꾸기"),
      ref("for / if", "조건에 맞는 값만 고르기"),
    ],
    rewardHint: hint("room-1-hint-radio-signal", "room-1", "room-1-radio-signal", "숨겨진 단서 확인: 주파수 필터를 사용했다."),
    starterCode: `data = """${room1RadioSignalData}"""

tokens = data.split()

code = ""
for token in tokens:
    channel, freq_text = token.split(":")
    freq = int(freq_text)
    if freq % 3 == 0 and str(freq).endswith("2"):
        code += channel

print(code)
`,
    isRequired: false,
    isHidden: true,
    requiredForDoor: false,
    targetConcepts: ["int", "str", "endswith", "modulo", "filtering"],
    usefulConcepts: ["numeric_filtering"],
    puzzleType: "hidden_filtering",
    expectedStrategyDescription: "채널과 주파수를 분리하고 두 조건을 동시에 만족하는 주파수의 채널 번호만 이어 읽는다.",
  },
  {
    id: "room-1-checksum-tablet",
    roomId: "room-1",
    title: "노이즈 스트립",
    objectId: "room-1-checksum-tablet",
    situationText: "문자와 숫자가 뒤섞인 스트립. 숫자만 걸러내 이으면—숨겨진 코드가 드러난다.",
    dataText: room1NoiseStripData,
    expectedAnswer: "2748",
    mockOutput: "2748",
    referenceItems: [
      ref("for ch in text", "문자를 하나씩 확인하기"),
      ref("ch.isdigit()", "숫자인 문자만 확인하기"),
      ref("result += ch", "필요한 문자만 이어 붙이기"),
    ],
    rewardHint: hint("room-1-hint-checksum-tablet", "room-1", "room-1-checksum-tablet", "숨겨진 단서 확인: 노이즈에서 숫자만 추출했다."),
    starterCode: `data = "${room1NoiseStripData}"

code = ""
for ch in data:
    if ch.isdigit():
        code += ch

print(code)
`,
    isRequired: false,
    isHidden: true,
    requiredForDoor: false,
    targetConcepts: ["for", "isdigit", "string_processing"],
    usefulConcepts: ["pattern_extraction"],
    puzzleType: "hidden_pattern",
    expectedStrategyDescription: "문자열에서 숫자 문자만 골라 숨겨진 코드를 만든다.",
  },
  {
    id: "room-2-file-cabinet",
    roomId: "room-2",
    title: "파일 캐비닛",
    objectId: "room-2-file-cabinet",
    situationText: "로그 묶음에 중복 기록이 섞여 있다. 완전히 같은 줄을 걷어내고 나면—실제로 다른 기록의 수를 4번 이어 적어라.",
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
    expectedAnswer: "6666",
    mockOutput: "6\n6666",
    referenceItems: [ref("splitlines()", "여러 줄 문자열 나누기"), ref("set(records)", "중복 제거하기"), ref("len()", "개수 확인하기")],
    rewardHint: hint("room-2-hint-file-cabinet", "room-2", "room-2-file-cabinet", "Door Code 1번째 조각: 3"),
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

count = len(unique)
print(count)
print(str(count) * 4)
`,
    isRequired: true,
    requiredForDoor: true,
    doorCodePiece: "3",
    doorCodePosition: 1,
    targetConcepts: ["splitlines", "set", "len"],
    usefulConcepts: ["deduplication", "record_processing"],
    puzzleType: "deduplication",
    expectedStrategyDescription: "중복 기록을 제거해 실제로 다른 기록만 남긴다.",
  },
  {
    id: "room-2-broken-tags",
    roomId: "room-2",
    title: "손상된 명찰",
    objectId: "room-2-broken-tags",
    situationText: "명찰들의 표기가 제각각이다—대소문자, 구분자 모두 다르다. 형식을 통일해 중복을 걷어내면 실제 인원 수가 나온다—그 수를 4번 이어 적어라.",
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
    expectedAnswer: "4444",
    mockOutput: "4\n4444",
    referenceItems: [
      ref("lower()", "소문자로 통일하기"),
      ref("replace()", "문자 바꾸기"),
      ref("set()", "중복 제거하기"),
      ref("strip()", "앞뒤 공백 제거하기"),
    ],
    rewardHint: hint("room-2-hint-broken-tags", "room-2", "room-2-broken-tags", "Door Code 2번째 조각: 5"),
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

count = len(set(cleaned))
print(count)
print(str(count) * 4)
`,
    isRequired: true,
    requiredForDoor: true,
    doorCodePiece: "5",
    doorCodePosition: 2,
    targetConcepts: ["lower", "replace", "strip", "set"],
    usefulConcepts: ["normalization", "deduplication"],
    puzzleType: "normalization",
    expectedStrategyDescription: "표기가 다른 이름을 같은 형식으로 맞춘 뒤 실제 고유 인원을 확인한다.",
  },
  {
    id: "room-2-score-board",
    roomId: "room-2",
    title: "점수 보드",
    objectId: "room-2-score-board",
    situationText: "이름 목록과 점수 목록이 따로 적혀 있다. ID로 연결해 최고 점수자를 찾으면—그 점수를 2번 이어 적어라.",
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
    expectedAnswer: "9595",
    mockOutput: "JONAS 95\n9595",
    referenceItems: [
      ref("dict", "ID와 이름 연결하기"),
      ref('split("/")', "구분자로 나누기"),
      ref("int(score)", "점수를 숫자로 바꾸기"),
      ref(">", "값 비교하기"),
    ],
    rewardHint: hint("room-2-hint-score-board", "room-2", "room-2-score-board", "Door Code 3번째 조각: 4"),
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
print(str(best_score) * 2)
`,
    isRequired: true,
    requiredForDoor: true,
    doorCodePiece: "4",
    doorCodePosition: 3,
    targetConcepts: ["dict", "split", "int", "comparison"],
    usefulConcepts: ["id_matching", "record_join"],
    puzzleType: "matching",
    expectedStrategyDescription: "ID를 기준으로 이름과 점수 기록을 연결하고 가장 높은 점수의 대상을 찾는다.",
  },
  {
    id: "room-2-access-log",
    roomId: "room-2",
    title: "접근 로그",
    objectId: "room-2-access-log",
    situationText: "시스템 로그가 화면을 채운다. success 기록 중 가장 마지막 항목의 타임스탬프를 찾아—숫자만 이어 적어라.",
    dataText: `11:52 / CAMERA / noise
12:01 / ADMIN / login / success
12:03 / GUEST / access / fail
12:05 / DOOR / opened / success
12:08 / FILE / removed / success
12:10 / ADMIN / logout / success
12:12 / SYSTEM / sync / fail`,
    expectedAnswer: "1210",
    mockOutput: "12:10 / ADMIN / logout / success\n1210",
    referenceItems: [
      ref('"success" in line', "문자열 포함 여부 확인하기"),
      ref("last_success = line", "변수 갱신하기"),
      ref("splitlines()", "줄 단위로 나누기"),
    ],
    rewardHint: hint("room-2-hint-access-log", "room-2", "room-2-access-log", "숨겨진 단서 확인: 마지막 성공 로그를 찾았다."),
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
print(last_success.split("/")[0].strip().replace(":", ""))
`,
    isRequired: false,
    isHidden: true,
    requiredForDoor: false,
    targetConcepts: ["splitlines", "in", "variable_update"],
    usefulConcepts: ["log_search"],
    puzzleType: "hidden_log_search",
    expectedStrategyDescription: "여러 로그에서 조건에 맞는 마지막 기록을 추적한다.",
  },
  {
    id: "room-2-timeline",
    roomId: "room-2",
    title: "타임라인 보드",
    objectId: "room-2-timeline",
    situationText: "사건들이 시간 순서 없이 뒤섞여 있다. 정렬해 가장 마지막 사건을 찾으면—그 시각의 숫자를 이어 적어라.",
    dataText: `12:05 / door opened
11:58 / power off
12:01 / admin login
12:03 / warning signal
12:08 / file removed
11:52 / camera noise
12:10 / admin logout`,
    expectedAnswer: "1210",
    mockOutput: "1210",
    referenceItems: [ref("sorted()", "정렬하기"), ref("events[-1]", "마지막 항목 가져오기"), ref("시간 문자열 정렬", "HH:MM 형식은 문자열 정렬로도 순서를 맞출 수 있음")],
    rewardHint: hint("room-2-hint-timeline", "room-2", "room-2-timeline", "Door Code 4번째 조각: 7"),
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

last_time = events[-1].split("/")[0].strip().replace(":", "")
print(last_time)
`,
    isRequired: true,
    requiredForDoor: true,
    doorCodePiece: "7",
    doorCodePosition: 4,
    targetConcepts: ["sorted", "indexing", "splitlines"],
    usefulConcepts: ["timeline_sorting"],
    puzzleType: "sorting",
    expectedStrategyDescription: "시간 형식 기록을 정렬해 가장 마지막 사건을 확인한다.",
  },
  {
    id: "room-2-checksum-ledger",
    roomId: "room-2",
    title: "아카이브 쪽지",
    objectId: "room-2-checksum-ledger",
    situationText: "PASS와 FAIL이 적힌 코드 목록. PASS를 받은 코드의 각 자리를 더하면—그 합을 2번 이어 적어라.",
    dataText: `3547 / digit sum / PASS
3546 / digit sum / FAIL
2547 / digit sum / FAIL
3557 / digit sum / FAIL`,
    expectedAnswer: "1919",
    mockOutput: "19\n1919",
    referenceItems: [
      ref("line.split('/')", "슬래시 구분자로 나누기"),
      ref("sum(int(x) for x in code)", "자리수 합 구하기"),
      ref('status == "PASS"', "통과 기록 확인하기"),
    ],
    rewardHint: hint("room-2-hint-checksum-ledger", "room-2", "room-2-checksum-ledger", "숨겨진 단서 확인: 기록 조각의 합계를 확인했다."),
    starterCode: `data = """3547 / digit sum / PASS
3546 / digit sum / FAIL
2547 / digit sum / FAIL
3557 / digit sum / FAIL"""

for line in data.strip().splitlines():
    code, _, status = [x.strip() for x in line.split("/")]
    if status == "PASS":
        total = sum(int(x) for x in code)
        print(total)
        print(str(total) * 2)
`,
    isRequired: false,
    isHidden: true,
    requiredForDoor: false,
    targetConcepts: ["split", "sum", "int", "status_filtering"],
    usefulConcepts: ["record_summary"],
    puzzleType: "hidden_summary",
    expectedStrategyDescription: "상태가 표시된 기록에서 통과한 항목만 골라 요약 값을 계산한다.",
  },
  {
    id: "room-3-switch-panel",
    roomId: "room-3",
    title: "스위치 패널",
    objectId: "room-3-switch-panel",
    situationText: "6개 스위치, 각각 켜거나 끈다. 적힌 조건을 모두 만족하는 조합이 몇 가지인지 세어—그 수를 4번 이어 적어라.",
    dataText: `S1 S2 S3 S4 S5 S6
각 스위치는 0 또는 1
켜진 스위치는 3개
S2는 켜져 있다
S5는 꺼져 있다`,
    expectedAnswer: "6666",
    mockOutput: "6\n6666",
    referenceItems: [
      ref("for 중첩", "여러 스위치 조합을 모두 확인하기"),
      ref("sum(switches)", "켜진 스위치 개수 세기"),
      ref("continue", "조건에 맞지 않으면 건너뛰기"),
      ref("list", "상태를 리스트로 표현하기"),
    ],
    rewardHint: hint("room-3-hint-switch-panel", "room-3", "room-3-switch-panel", "Door Code 4번째 조각: 6"),
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

                        count += 1
                        valid.append(switches)

print(count)
print(valid)
print(str(count) * 4)
`,
    isRequired: true,
    requiredForDoor: true,
    doorCodePiece: "6",
    doorCodePosition: 4,
    targetConcepts: ["nested_loop", "sum", "continue"],
    usefulConcepts: ["candidate_generation", "condition_filtering"],
    puzzleType: "candidate_generation",
    expectedStrategyDescription: "가능한 스위치 조합을 만들고 여러 조건을 만족하는 후보만 남긴다.",
  },
  {
    id: "room-3-logic-gate",
    roomId: "room-3",
    title: "논리 게이트 보드",
    objectId: "room-3-logic-gate",
    situationText: "네 개의 입력 조합, 출력란은 비어 있다. 규칙대로 각 OUT을 채우고 위에서부터 이으면—코드가 된다.",
    dataText: `A B C D | OUT
0 0 0 1 | ?
0 1 1 0 | ?
1 0 1 1 | ?
1 1 0 0 | ?

규칙:
G1 = A와 B 중 하나만 1이면 1, 아니면 0
G2 = C와 D가 모두 1이면 1, 아니면 0
OUT = G1 또는 G2 중 하나라도 1이면 1, 아니면 0`,
    expectedAnswer: "0110",
    mockOutput: "0\n1\n1\n0",
    referenceItems: [ref("^", "둘 중 하나만 1일 때 1"), ref("&", "둘 다 1일 때 1"), ref("|", "하나 이상 1일 때 1"), ref("for", "여러 행에 같은 규칙 적용하기")],
    rewardHint: hint("room-3-hint-logic-gate", "room-3", "room-3-logic-gate", "Door Code 1번째 조각: 4"),
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
    isRequired: true,
    requiredForDoor: true,
    doorCodePiece: "4",
    doorCodePosition: 1,
    targetConcepts: ["boolean_logic", "bitwise_operators", "for"],
    usefulConcepts: ["logic_evaluation"],
    puzzleType: "logic",
    expectedStrategyDescription: "각 행의 입력값에 논리 규칙을 적용해 출력값을 계산한다.",
  },
  {
    id: "room-3-candidate-codes",
    roomId: "room-3",
    title: "후보 코드 보드",
    objectId: "room-3-candidate-codes",
    situationText: "후보 코드들이 나열되어 있다. 네 조건을 모두 통과하는 것은 하나뿐—그게 해제 코드다.",
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
    rewardHint: hint("room-3-hint-candidate-codes", "room-3", "room-3-candidate-codes", "Door Code 2번째 조각: 0"),
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
    isRequired: true,
    requiredForDoor: true,
    doorCodePiece: "0",
    doorCodePosition: 2,
    targetConcepts: ["string_indexing", "int", "sum", "filtering"],
    usefulConcepts: ["candidate_filtering"],
    puzzleType: "candidate_filtering",
    expectedStrategyDescription: "후보 코드 목록에서 여러 조건을 모두 만족하는 코드만 남긴다.",
  },
  {
    id: "room-3-warning-lamp",
    roomId: "room-3",
    title: "경고 램프 보드",
    objectId: "room-3-warning-lamp",
    situationText: "네 가지 상태와 조건식 하나. 각 상태에서 경고등이 켜지면 1, 꺼지면 0—위에서부터 이으면 코드가 된다.",
    dataText: `A B C | LAMP
1 0 1 | ?
1 1 0 | ?
0 1 1 | ?
0 0 1 | ?

조건 암시:
A가 켜져 있고, B 또는 C 중 하나 이상이 켜져 있으면 경고등이 켜진다.`,
    expectedAnswer: "1100",
    mockOutput: "1\n1\n0\n0",
    referenceItems: [ref("and", "그리고"), ref("or", "또는"), ref("( )", "괄호로 조건 묶기"), ref("int(lamp)", "bool 결과를 숫자로 바꾸기")],
    rewardHint: hint("room-3-hint-warning-lamp", "room-3", "room-3-warning-lamp", "숨겨진 단서 확인: 경고 램프 조건식을 해석했다."),
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
    isRequired: false,
    isHidden: true,
    requiredForDoor: false,
    targetConcepts: ["and", "or", "boolean"],
    usefulConcepts: ["condition_expression"],
    puzzleType: "hidden_condition",
    expectedStrategyDescription: "조건식을 읽고 각 경우에 경고등이 켜지는지 판단한다.",
  },
  {
    id: "room-3-experiment",
    roomId: "room-3",
    title: "실험 콘솔",
    objectId: "room-3-experiment",
    situationText: "후보 코드들에 세 규칙을 적용한다. 모두 통과한 것들 중—처음으로 살아남은 코드를 입력하라.",
    dataText: `후보:
4026 4726 4926 4028 4126 9026

규칙:
길이는 4
두 번째 숫자는 0
마지막 숫자는 6`,
    expectedAnswer: "4026",
    mockOutput: "4026\n9026",
    referenceItems: [ref("def", "함수 만들기"), ref("return", "결과 반환하기"), ref("if", "조건을 함수로 묶기"), ref("for", "여러 후보에 같은 규칙 적용하기")],
    rewardHint: hint("room-3-hint-experiment", "room-3", "room-3-experiment", "Door Code 3번째 조각: 2"),
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
    isRequired: true,
    requiredForDoor: true,
    doorCodePiece: "2",
    doorCodePosition: 3,
    targetConcepts: ["def", "return", "validation", "for"],
    usefulConcepts: ["function_based_validation"],
    puzzleType: "validation",
    expectedStrategyDescription: "검증 함수를 만들어 후보 코드가 조건을 만족하는지 반복해서 확인한다.",
  },
  {
    id: "room-3-power-meter",
    roomId: "room-3",
    title: "후보 다이얼",
    objectId: "room-3-power-meter",
    situationText: "상태가 표시된 후보 코드들. stable인 코드의 자리 숫자를 모두 더하면—그 합을 2번 이어 적어라.",
    dataText: `4026 stable
4726 overload
3026 low
9026 overload`,
    expectedAnswer: "1212",
    mockOutput: "12\n1212",
    referenceItems: [
      ref("code in line", "줄에서 코드 분리하기"),
      ref("sum()", "합계 구하기"),
      ref("int(digit)", "문자 숫자를 정수로 바꾸기"),
    ],
    rewardHint: hint("room-3-hint-power-meter", "room-3", "room-3-power-meter", "숨겨진 단서 확인: 후보의 자리 합을 비교했다."),
    starterCode: `data = """4026 stable
4726 overload
3026 low
9026 overload"""

for line in data.strip().splitlines():
    code, state = line.split()
    if state == "stable":
        total = sum(int(digit) for digit in code)
        print(total)
        print(str(total) * 2)
`,
    isRequired: false,
    isHidden: true,
    requiredForDoor: false,
    targetConcepts: ["sum", "int", "string_iteration"],
    usefulConcepts: ["numeric_summary"],
    puzzleType: "hidden_candidate_check",
    expectedStrategyDescription: "후보 코드의 각 자리 숫자를 합산해 상태와 비교한다.",
  },
  {
    id: "room-4-validator",
    roomId: "room-4",
    title: "손상된 검증기",
    objectId: "room-4-validator",
    situationText: "검증기가 각 코드에 PASS/FAIL을 찍어 뒀다. 세 규칙으로 직접 확인해 잘못 판정된 것들을 찾아내면—그 수를 4번 이어 적어라.",
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
    expectedAnswer: "2222",
    mockOutput: "Wrong conditions: 2\n2222",
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
print(str(wrong) * 4)
`,
  },
  {
    id: "room-4-test-log",
    roomId: "room-4",
    title: "테스트 로그",
    objectId: "room-4-test-log",
    situationText: "테스트 결과 목록. PASS를 받은 코드를 골라내면—그게 잠금 해제 코드다.",
    dataText: `1484 FAIL
1584 PASS
1684 FAIL
1594 FAIL
2584 FAIL`,
    expectedAnswer: "1584",
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
    situationText: "1000부터 하나씩 올라가며 세 조건을 동시에 만족하는 첫 번째 숫자를 찾아내면—그게 코드다.",
    dataText: `조건:
두 번째 숫자는 5
마지막 숫자는 짝수
각 자리 합은 18`,
    expectedAnswer: "1548",
    mockOutput: "1548",
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
    situationText: "오류 코드 세 개와 원인 설명. 각 코드에 맞는 원인을 연결해 확인하고—오류의 총 수를 4번 이어 적어라.",
    dataText: `E01: 없는 위치 접근
E02: 형식 불일치
E03: 알 수 없는 이름`,
    expectedAnswer: "3333",
    mockOutput: "E01 -> 없는 위치 접근\nE02 -> 형식 불일치\nE03 -> 알 수 없는 이름\n3333",
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

print(str(len(errors)) * 4)
`,
  },
  {
    id: "room-4-broken-crt",
    roomId: "room-4",
    title: "손상된 CRT",
    objectId: "room-4-broken-crt",
    situationText: "입력, 기대 출력, 실제 출력이 나란히 있다. 기대와 실제가 다른 항목의 수를 세어—그 수를 4번 이어 적어라.",
    dataText: `입력 -> 기대 출력 / 실제 출력
AB12 -> 12AB / AB12
CD34 -> 34CD / CD34
EF56 -> 56EF / EF56`,
    expectedAnswer: "3333",
    mockOutput: "AB12 문자와 숫자의 위치를 바꾸지 않았다\nCD34 문자와 숫자의 위치를 바꾸지 않았다\nEF56 문자와 숫자의 위치를 바꾸지 않았다\n3333",
    referenceItems: [ref("a, b, c = item", "한 줄에 여러 값 받기"), ref("code[2:4]", "문자열 일부 잘라내기"), ref("expected != actual", "기대와 실제가 다른지 비교하기"), ref("!=", "서로 다름 확인하기")],
    rewardHint: hint("room-4-hint-broken-crt", "room-4", "room-4-broken-crt", "코드는 4자리다."),
    starterCode: `pairs = [
    ("AB12", "12AB", "AB12"),
    ("CD34", "34CD", "CD34"),
    ("EF56", "56EF", "EF56"),
]

count = 0
for original, expected, actual in pairs:
    if expected != actual:
        print(original, "문자와 숫자의 위치를 바꾸지 않았다")
        count += 1

print(str(count) * 4)
`,
  },
  {
    id: "room-4-sum-analyzer",
    roomId: "room-4",
    title: "합계 분석기",
    objectId: "room-4-sum-analyzer",
    situationText: "PASS를 받은 코드의 각 자리를 모두 더하면—그 합을 2번 이어 적어라.",
    dataText: `1584 PASS
1484 FAIL
1594 FAIL
2584 FAIL`,
    expectedAnswer: "1818",
    mockOutput: "18\n1818",
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
        total = sum(int(digit) for digit in code)
        print(total)
        print(str(total) * 2)
`,
  },
];

export const puzzlesById = Object.fromEntries(puzzles.map((puzzle) => [puzzle.id, puzzle])) as Record<string, Puzzle>;

export function getPuzzlesForRoom(roomId: string): Puzzle[] {
  return puzzles.filter((puzzle) => puzzle.roomId === roomId);
}
