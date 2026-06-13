import { CMASS_DEMO_SOLUTIONS } from "./cmassPuzzles";

// 시연(데모) 모드용 정답 코드 모음.
//
// 교수님께 설명하며 시연할 때, 각 문제의 코드 에디터에 정답이 미리 입력된 채로 열리도록
// 퍼즐 id → 완성 코드(실행하면 바로 통과) 매핑을 둔다.
// 게임 본편 채점기(pyodideWorker)가 그대로 통과시키는, 실제로 동작하는 코드다.
//
// 입력 규칙(채점기와 동일):
//  - 숫자 입력: data = int(input())
//  - 문자열 입력: data = input()
//  - 리스트/딕셔너리: data 가 미리 주어지므로 input() 없이 바로 사용
// (eval 은 사용하지 않는다.)

export const DEMO_CODE_DRAFTS: Record<string, string> = {
  // Room 0 — 숫자/문자열 입력
  "room-0-pattern-tiles":   "data = int(input())\nprint(data)\n",
  "room-0-tv-sequence":     "data = int(input())\nprint(data + 10)\n",
  "room-0-desk-terminal":   "data = input()\nprint(data[0])\n",
  "room-0-mini-ox-card":    "data = input()\nprint(data[:3])\n",
  "room-0-name-tags":       "data = input()\nprint(len(data))\n",
  "room-0-bookshelf-note":  "data = input()\nprint(data * 3)\n",

  // Room 1 — 문자열 메서드 / 조건문
  "room-1-word-billboard":  "data = input()\nprint(data.upper())\n",
  "room-1-ox-monitor":      "data = input()\nprint(data.replace('X', 'O'))\n",
  "room-1-number-panel":    "data = input()\nprint(data.split())\n",
  "room-1-radio-signal":    "data = int(input())\nif data >= 100:\n    print('PASS')\nelse:\n    print('FAIL')\n",
  "room-1-name-card":       "data = int(input())\nprint(data % 2 == 0)\n",
  "room-1-checksum-tablet": "data = int(input())\nprint(data > 0 and data < 10)\n",

  // Room 2 — 반복문 (리스트/딕셔너리는 data 가 미리 주어짐)
  "room-2-file-cabinet":    "total = 0\nfor x in data:\n    total = total + x\nprint(total)\n",
  "room-2-broken-tags":     "result = []\nfor x in data:\n    if x > 0:\n        result.append(x)\nprint(result)\n",
  "room-2-score-board":     "best = 0\nfor item in data:\n    if item['score'] > best:\n        best = item['score']\nprint(best)\n",
  "room-2-timeline":        "data = int(input())\nresult = []\nwhile data > 0:\n    result.append(data)\n    data = data - 1\nprint(result)\n",
  "room-2-access-log":      "print([x * 2 for x in data if x > 0])\n",
  "room-2-checksum-ledger": "data = input()\nresult = ''\nfor char in data:\n    if char not in 'aeiou':\n        result = result + char\nprint(result)\n",

  // Room 3 — 보너스
  "room-3-validator":       "data = input()\nprint(data[::-1])\n",
};

// 문제집(세트)에 맞는 시연용 정답 코드 맵을 돌려준다.
// 교과서 세트는 교과서 예제 코드를, 기본 세트는 방탈출 정답 코드를 미리 채운다.
export function getDemoSolutionsForSet(setId?: string): Record<string, string> {
  if (setId === "cmass-python-textbook") {
    // 교과서 슬롯에 없는 방(room-3 등)은 기본 정답으로 폴백
    return { ...DEMO_CODE_DRAFTS, ...CMASS_DEMO_SOLUTIONS };
  }
  return DEMO_CODE_DRAFTS;
}
