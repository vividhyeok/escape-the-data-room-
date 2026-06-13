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

  // 교과서형 문제 미리보기용(예제 코드/입출력). 교사 화면에서 그대로 보여준다.
  sampleCode?: string;
  sampleInput?: string;
  sampleOutput?: string;
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

// ---- 씨마스 고등학교 프로그래밍(파이썬) 교과서 예제 18문항 ----
//
// 교사 화면에서 "교과서 기반 문제집"으로 선택할 수 있는 세트.
// 각 문항은 게임 본편의 플레이 가능한 18개 퍼즐과 단원 순서대로 1:1 매핑되어,
// 이 세트로 수업을 만들면 학생 활동·모니터링·결과 리포트가 그대로 동작한다.
// sampleCode/sampleOutput 은 교과서 예제를 그대로 보여 주기 위한 미리보기 필드다.

const CMASS_CURRICULUM = "씨마스 프로그래밍(파이썬)";

const CMASS_PROBLEM_BANK: TextbookProblem[] = [
  {
    id: "cmass-01", mappedPuzzleId: "room-0-pattern-tiles",
    title: "문자열 덧셈과 정수 덧셈 비교", unit: "자료형과 연산", concept: "자료형·연산", difficulty: "하",
    curriculum: CMASS_CURRICULUM, lessonOrder: 1, estimatedMinutes: 1,
    description: "같은 + 연산이 문자열에서는 이어붙이기, 정수에서는 덧셈이 됨을 비교합니다.",
    sampleCode: "a = '5'\nb = '7'\nprint(a + b)\na = 5\nb = 7\nprint(a + b)",
    sampleOutput: "57\n12",
  },
  {
    id: "cmass-02", mappedPuzzleId: "room-0-tv-sequence",
    title: "서식 출력", unit: "입출력", concept: "서식 출력(%)", difficulty: "하",
    curriculum: CMASS_CURRICULUM, lessonOrder: 2, estimatedMinutes: 1,
    description: "% 서식 지정자를 사용해 계산 결과를 형식에 맞춰 출력합니다.",
    sampleCode: 'print("3 + 4 = %d" % (3 + 4))',
    sampleOutput: "3 + 4 = 7",
  },
  {
    id: "cmass-03", mappedPuzzleId: "room-0-desk-terminal",
    title: "변수와 print 함수", unit: "변수와 입출력", concept: "변수·출력", difficulty: "하",
    curriculum: CMASS_CURRICULUM, lessonOrder: 3, estimatedMinutes: 1,
    description: "여러 변수를 print 의 인자로 함께 넘겨 한 문장으로 출력합니다.",
    sampleCode: "name = 'Tom'\nage = 20\nprint('제 이름은', name, '이고 나이는', age, '세입니다.')",
    sampleOutput: "제 이름은 Tom 이고 나이는 20 세입니다.",
  },
  {
    id: "cmass-04", mappedPuzzleId: "room-0-mini-ox-card",
    title: "성취도 판정", unit: "조건문", concept: "if/elif/else", difficulty: "중",
    curriculum: CMASS_CURRICULUM, lessonOrder: 4, estimatedMinutes: 2,
    description: "점수 구간에 따라 A·B·C 등급을 if/elif/else 로 판정합니다.",
    sampleCode: "score = 85\nif score >= 90:\n    grade = 'A'\nelif score >= 80:\n    grade = 'B'\nelse:\n    grade = 'C'\nprint(grade)",
    sampleOutput: "B",
  },
  {
    id: "cmass-05", mappedPuzzleId: "room-0-name-tags",
    title: "성인 판별", unit: "조건문", concept: "if/else", difficulty: "하",
    curriculum: CMASS_CURRICULUM, lessonOrder: 5, estimatedMinutes: 1,
    description: "나이를 기준으로 성인/미성년자를 if/else 로 분기합니다.",
    sampleCode: 'age = 17\nif age >= 18:\n    print("성인")\nelse:\n    print("미성년자")',
    sampleOutput: "미성년자",
  },
  {
    id: "cmass-06", mappedPuzzleId: "room-0-bookshelf-note",
    title: "거스름돈 계산", unit: "반복문", concept: "for·몫/나머지", difficulty: "중",
    curriculum: CMASS_CURRICULUM, lessonOrder: 6, estimatedMinutes: 3,
    description: "큰 단위 화폐부터 몫(//)과 나머지(%)로 거스름돈 장수를 구합니다.",
    sampleCode: "amount = 88000\nfor bill in [50000, 10000, 5000, 1000]:\n    count = amount // bill\n    amount %= bill\n    print(count)",
    sampleOutput: "1\n3\n1\n3",
  },
  {
    id: "cmass-07", mappedPuzzleId: "room-1-word-billboard",
    title: "1부터 5까지 합", unit: "반복문", concept: "for·range·누적", difficulty: "중",
    curriculum: CMASS_CURRICULUM, lessonOrder: 7, estimatedMinutes: 2,
    description: "range 와 누적 변수로 1부터 5까지의 합을 구합니다.",
    sampleCode: "total = 0\nfor i in range(1, 6):\n    total += i\nprint(total)",
    sampleOutput: "15",
  },
  {
    id: "cmass-08", mappedPuzzleId: "room-1-ox-monitor",
    title: "별표 출력", unit: "반복문", concept: "for·문자열 반복", difficulty: "중",
    curriculum: CMASS_CURRICULUM, lessonOrder: 8, estimatedMinutes: 2,
    description: "반복 회차에 따라 별(*)의 개수를 늘려 가며 출력합니다.",
    sampleCode: "for i in range(3):\n    print('*' * (i + 1))",
    sampleOutput: "*\n**\n***",
  },
  {
    id: "cmass-09", mappedPuzzleId: "room-1-number-panel",
    title: "중복 없는 단어 추출", unit: "집합과 리스트", concept: "set·정렬·split", difficulty: "중",
    curriculum: CMASS_CURRICULUM, lessonOrder: 9, estimatedMinutes: 3,
    description: "문장을 split 한 뒤 set 으로 중복을 제거하고 정렬합니다.",
    sampleCode: 'sentence = "hi hi there"\nwords = sentence.split()\nunique_words = sorted(set(words))\nprint(unique_words)',
    sampleOutput: "['hi', 'there']",
  },
  {
    id: "cmass-10", mappedPuzzleId: "room-1-radio-signal",
    title: "집합 연산", unit: "집합", concept: "집합 연산(합·교·차)", difficulty: "중",
    curriculum: CMASS_CURRICULUM, lessonOrder: 10, estimatedMinutes: 3,
    description: "두 집합의 합집합·교집합·차집합을 |, &, - 로 계산합니다.",
    sampleCode: "set1 = {1, 2, 3}\nset2 = {2, 3, 4}\nprint(set1 | set2)\nprint(set1 & set2)\nprint(set1 - set2)",
    sampleOutput: "{1, 2, 3, 4}\n{2, 3}\n{1}",
  },
  {
    id: "cmass-11", mappedPuzzleId: "room-1-name-card",
    title: "소수 판별", unit: "반복문과 조건", concept: "for·if·break", difficulty: "상",
    curriculum: CMASS_CURRICULUM, lessonOrder: 11, estimatedMinutes: 4,
    description: "2부터 √n 까지 나눠 보며 약수가 있으면 break 로 소수 여부를 판정합니다.",
    sampleCode: 'num = 9\nis_prime = True\nfor i in range(2, int(num ** 0.5) + 1):\n    if num % i == 0:\n        is_prime = False\n        break\nif num > 1 and is_prime:\n    print("소수입니다.")\nelse:\n    print("소수가 아닙니다.")',
    sampleOutput: "소수가 아닙니다.",
  },
  {
    id: "cmass-12", mappedPuzzleId: "room-1-checksum-tablet",
    title: "가위바위보 승패", unit: "조건문", concept: "논리 연산·분기", difficulty: "상",
    curriculum: CMASS_CURRICULUM, lessonOrder: 12, estimatedMinutes: 4,
    description: "and/or 와 다중 조건으로 가위바위보 승패를 판정합니다.",
    sampleCode: "user = '가위'\ncomputer = '보'\nif user == computer:\n    result = \"비김\"\nelif (user == '가위' and computer == '보') or \\\n     (user == '바위' and computer == '가위') or \\\n     (user == '보' and computer == '바위'):\n    result = \"사용자 승리\"\nelse:\n    result = \"컴퓨터 승리\"\nprint(result)",
    sampleOutput: "사용자 승리",
  },
  {
    id: "cmass-13", mappedPuzzleId: "room-2-file-cabinet",
    title: "매개변수 없는 넓이 함수", unit: "함수", concept: "함수 정의", difficulty: "중",
    curriculum: CMASS_CURRICULUM, lessonOrder: 13, estimatedMinutes: 2,
    description: "매개변수 없이 정의한 함수를 호출해 정사각형 넓이를 출력합니다.",
    sampleCode: "def square_area():\n    side = 5\n    print(side * side)\n\nsquare_area()",
    sampleOutput: "25",
  },
  {
    id: "cmass-14", mappedPuzzleId: "room-2-broken-tags",
    title: "매개변수 있는 넓이 함수", unit: "함수", concept: "매개변수", difficulty: "중",
    curriculum: CMASS_CURRICULUM, lessonOrder: 14, estimatedMinutes: 3,
    description: "매개변수로 한 변의 길이를 받아 넓이를 출력하는 함수를 사용합니다.",
    sampleCode: "def square_area(side):\n    print(side * side)\n\nside = 7\nsquare_area(side)",
    sampleInput: "7", sampleOutput: "49",
  },
  {
    id: "cmass-15", mappedPuzzleId: "room-2-score-board",
    title: "두 수를 더하는 함수", unit: "함수", concept: "반환값(return)", difficulty: "중",
    curriculum: CMASS_CURRICULUM, lessonOrder: 15, estimatedMinutes: 3,
    description: "return 으로 값을 돌려주는 함수를 정의하고 결과를 출력합니다.",
    sampleCode: "def add(a, b):\n    return a + b\n\na = 2\nb = 3\nprint(add(a, b))",
    sampleInput: "2, 3", sampleOutput: "5",
  },
  {
    id: "cmass-16", mappedPuzzleId: "room-2-timeline",
    title: "이름을 입력받아 출력", unit: "입출력", concept: "입력·출력", difficulty: "하",
    curriculum: CMASS_CURRICULUM, lessonOrder: 16, estimatedMinutes: 1,
    description: "입력받은 이름을 그대로 출력합니다.",
    sampleCode: 'name = "학생"\nprint(name)',
    sampleInput: "학생", sampleOutput: "학생",
  },
  {
    id: "cmass-17", mappedPuzzleId: "room-2-access-log",
    title: "람다 함수로 두 수 더하기", unit: "함수", concept: "람다", difficulty: "상",
    curriculum: CMASS_CURRICULUM, lessonOrder: 17, estimatedMinutes: 3,
    description: "lambda 로 두 수를 더하는 익명 함수를 만들어 호출합니다.",
    sampleCode: "add2 = lambda x, y: x + y\nprint(add2(3, 4))",
    sampleOutput: "7",
  },
  {
    id: "cmass-18", mappedPuzzleId: "room-2-checksum-ledger",
    title: "람다 함수로 인사말 만들기", unit: "함수", concept: "람다·문자열", difficulty: "상",
    curriculum: CMASS_CURRICULUM, lessonOrder: 18, estimatedMinutes: 3,
    description: "lambda 와 문자열 결합으로 인사말을 만들어 출력합니다.",
    sampleCode: "greeting = lambda name: '안녕하세요, ' + name + '! 좋은 아침입니다.'\nprint(greeting(\"사용자\"))",
    sampleInput: "사용자", sampleOutput: "안녕하세요, 사용자! 좋은 아침입니다.",
  },
];

// 모든 문제(게임 기본 + 교과서)를 합친 조회용 뱅크
const ALL_PROBLEMS: TextbookProblem[] = [...STATIC_PROBLEM_BANK, ...CMASS_PROBLEM_BANK];

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
  /** 'game' = 게임 본편 연동 / 'textbook' = 교과서 기반 */
  source?: "game" | "textbook";
  /** 출처 교육과정 표기 (교과서 세트) */
  curriculum?: string;
};

export const PROBLEM_SETS: ProblemSet[] = [
  {
    id: "tcr-foundation",
    title: "파이썬 기초 방탈출 문제집",
    description: "변수·문자열·조건·반복까지, 캠프 초반 진단용 기본 문제집 (게임 본편 전체)",
    gradeBand: "캠프 기초반",
    source: "game",
    problemIds: STATIC_PROBLEM_BANK.map((problem) => problem.id),
  },
  {
    id: "cmass-python-textbook",
    title: "씨마스 고등학교 프로그래밍(파이썬)",
    description: "씨마스 「프로그래밍」 교과서 예제 18문항 — 자료형·조건·반복·집합·함수·람다까지 단원 순서대로",
    gradeBand: "고등 교과",
    source: "textbook",
    curriculum: CMASS_CURRICULUM,
    problemIds: CMASS_PROBLEM_BANK.map((problem) => problem.id),
  },
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

// 기본(게임 본편) 문제집. 선택 문제가 비었을 때의 폴백으로 쓰인다.
export function getTextbookProblems(): TextbookProblem[] {
  return STATIC_PROBLEM_BANK;
}

// id 로 조회할 때는 게임 + 교과서 전체에서 찾는다.
export function getTextbookProblemById(id: string): TextbookProblem | undefined {
  return ALL_PROBLEMS.find((problem) => problem.id === id);
}

// 퍼즐 id → 문제. 게임 기본 문제집을 우선 매칭한다(부가 라벨용).
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
