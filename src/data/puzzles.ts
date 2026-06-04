import type { Puzzle, ReferenceItem, RoomHint } from "./types";

function ref(label: string, description: string): ReferenceItem {
  return { label, description };
}

function hint(id: string, roomId: string, puzzleId: string, text: string): RoomHint {
  return { id, roomId, puzzleId, text, description: text, value: text };
}

export const puzzles: Puzzle[] = [
  {
    id: "room-0-var-math",
    roomId: "room-0",
    title: "접근 권한 계산기 (변수와 연산)",
    objectId: "room-0-var-math",
    situationText: "기본 시스템 비밀번호는 숫자 1234입니다. 이 비밀번호에 99를 더한 값을 최종 비밀번호로 입력해야 방을 나갈 수 있습니다.",
    scenarioImageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
    dataText: "BASE_PASSWORD = 1234\nADDITIONAL_CODE = 99",
    expectedAnswer: "1333",
    referenceItems: [
      ref("a = 10", "변수에 값을 저장합니다."),
      ref("c = a + b", "변수끼리 연산할 수 있습니다."),
      ref("print(c)", "값을 화면에 출력합니다.")
    ],
    rewardHint: hint("room-0-hint", "room-0", "room-0-var-math", "다음 방으로 갈 수 있습니다."),
    starterCode: `password = 1234\ncode = 99\n\n# 아래에 두 변수를 더해서 출력하는 코드를 작성하세요.\n`,
    requiredSyntax: ["print", "+"],
    timeoutHint: "비밀번호와 코드를 더해서 print() 로 출력해보세요.",
    isRequired: true,
    requiredForDoor: true,
    doorCodePiece: "1333",
    doorCodePosition: 1,
    targetConcepts: ["variables", "addition"],
    puzzleType: "syntax_variables"
  },
  {
    id: "room-1-if-else",
    roomId: "room-1",
    title: "보안 검문소 (조건문)",
    objectId: "room-1-if-else",
    situationText: "앞에 보안 게이트가 가로막고 있습니다. 주어진 접근 레벨(level)이 5 이상이면 'PASS'를 출력하고, 미만이면 'FAIL'을 출력해야 합니다. 현재 당신의 레벨은 7입니다. 결과값을 찾아 입력하세요.",
    scenarioImageUrl: "https://images.unsplash.com/photo-1614064641913-6b1e604f3db6?auto=format&fit=crop&q=80&w=800",
    dataText: "level = 7",
    expectedAnswer: "PASS",
    referenceItems: [
      ref("if a >= 5:", "조건이 참일 때 실행됩니다."),
      ref("else:", "조건이 거짓일 때 실행됩니다."),
    ],
    rewardHint: hint("room-1-hint", "room-1", "room-1-if-else", "보안망을 무사히 통과했습니다."),
    starterCode: `level = 7\n\n# if 문을 이용해 level이 5 이상인지 확인하세요.\n`,
    requiredSyntax: ["if", "print"],
    timeoutHint: "if level >= 5: 형식으로 조건을 만들어보세요.",
    isRequired: true,
    requiredForDoor: true,
    doorCodePiece: "PASS",
    doorCodePosition: 1,
    targetConcepts: ["if", "else", "comparison"],
    puzzleType: "syntax_conditionals"
  },
  {
    id: "room-2-for-loop",
    roomId: "room-2",
    title: "통신 로그 분석 (반복문)",
    objectId: "room-2-for-loop",
    situationText: "서버가 과부하로 멈췄습니다! 수천 개의 통신 로그 중 'ERROR'라는 단어가 정확히 몇 번 발생했는지 찾아야 시스템을 복구할 수 있습니다. 횟수를 알아내 입력하세요.",
    scenarioImageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800",
    dataText: "['OK', 'OK', 'ERROR', 'OK', 'ERROR', 'ERROR', 'OK', 'OK', 'ERROR']",
    expectedAnswer: "4",
    referenceItems: [
      ref("for item in list:", "리스트의 각 항목을 하나씩 꺼내 반복합니다."),
      ref("count += 1", "개수를 1 증가시킵니다.")
    ],
    rewardHint: hint("room-2-hint", "room-2", "room-2-for-loop", "시스템 오류 횟수를 알아냈습니다."),
    starterCode: `logs = ['OK', 'OK', 'ERROR', 'OK', 'ERROR', 'ERROR', 'OK', 'OK', 'ERROR']\nerror_count = 0\n\n# for문과 if문을 조합해 ERROR 횟수를 구하세요.\n`,
    requiredSyntax: ["for", "if", "print"],
    timeoutHint: "for log in logs: 안에서 if log == 'ERROR': 를 사용해보세요.",
    isRequired: true,
    requiredForDoor: true,
    doorCodePiece: "4",
    doorCodePosition: 1,
    targetConcepts: ["for", "if", "counting"],
    puzzleType: "syntax_loops"
  },
  {
    id: "room-3-list-filter",
    roomId: "room-3",
    title: "출입자 명부 색인 (리스트)",
    objectId: "room-3-list-filter",
    situationText: "용의자 명단이 들어있는 배열이 있습니다. 데이터 중 나이가 30 이상인 사람의 숫자만 걸러내어, 그 수가 총 몇 명인지 찾아야 합니다.",
    scenarioImageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800",
    dataText: "[25, 31, 18, 45, 29, 30, 19, 52]",
    expectedAnswer: "4",
    referenceItems: [
      ref("len(list)", "리스트의 길이를 구합니다."),
      ref("list.append(x)", "리스트에 새로운 값을 추가합니다.")
    ],
    rewardHint: hint("room-3-hint", "room-3", "room-3-list-filter", "용의자의 범위를 좁혔습니다."),
    starterCode: `ages = [25, 31, 18, 45, 29, 30, 19, 52]\nsuspects = []\n\n# ages를 반복하며 30 이상인 값만 suspects 리스트에 넣으세요.\n# 마지막에 suspects의 길이를 출력하세요.\n`,
    requiredSyntax: ["for", "append", "len"],
    timeoutHint: "ages 배열을 for문으로 돌면서 append()를 사용해보세요.",
    isRequired: true,
    requiredForDoor: true,
    doorCodePiece: "4",
    doorCodePosition: 1,
    targetConcepts: ["list", "append", "len"],
    puzzleType: "syntax_lists"
  },
  {
    id: "room-4-dict-cipher",
    roomId: "room-4",
    title: "고대 암호 해독 (딕셔너리)",
    objectId: "room-4-dict-cipher",
    situationText: "암호화된 문자열 'A B C C'를 발견했습니다. 암호 해독 사전(Dictionary)을 이용하여 이 문자가 원래 어떤 숫자인지 번역해서 이어서 입력하세요.",
    scenarioImageUrl: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=800",
    dataText: "Cipher: ['A', 'B', 'C', 'C']\nDictionary: {'A':'7', 'B':'2', 'C':'9'}",
    expectedAnswer: "7299",
    referenceItems: [
      ref("dict['key']", "딕셔너리에서 key에 해당하는 값을 가져옵니다."),
      ref("result += value", "문자열을 이어 붙입니다.")
    ],
    rewardHint: hint("room-4-hint", "room-4", "room-4-dict-cipher", "모든 암호를 풀고 탈출에 성공했습니다!"),
    starterCode: `cipher = ['A', 'B', 'C', 'C']\ndecode_dict = {'A':'7', 'B':'2', 'C':'9'}\n\nresult = ""\n# cipher 리스트를 반복하면서, 딕셔너리를 활용해 result 문자열을 완성하세요.\n`,
    requiredSyntax: ["for", "print"],
    timeoutHint: "for code in cipher: 안에서 decode_dict[code] 로 값을 찾아보세요.",
    isRequired: true,
    requiredForDoor: true,
    doorCodePiece: "7299",
    doorCodePosition: 1,
    targetConcepts: ["dictionary", "string_concatenation"],
    puzzleType: "syntax_dictionary"
  }
];

export const puzzlesById: Record<string, Puzzle> = puzzles.reduce((acc, puzzle) => {
  acc[puzzle.id] = puzzle;
  return acc;
}, {} as Record<string, Puzzle>);

export function getPuzzlesForRoom(roomId: string): Puzzle[] {
  return puzzles.filter(p => p.roomId === roomId);
}
