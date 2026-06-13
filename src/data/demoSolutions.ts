// 시연(데모) 모드용 정답 코드 모음.
//
// 교수님께 설명하며 시연할 때, 각 문제의 코드 에디터에 정답이 미리 입력된 채로 열리도록
// 퍼즐 id → 완성 코드(실행하면 바로 통과) 매핑을 둔다.
// 게임 본편 채점기(pyodideWorker)가 그대로 통과시키는, 실제로 동작하는 코드다.

const DEMO_INPUT = "data = eval(input())\n";

export const DEMO_CODE_DRAFTS: Record<string, string> = {
  "room-0-pattern-tiles":   DEMO_INPUT + "print(data)\n",
  "room-0-tv-sequence":     DEMO_INPUT + "print(data + 10)\n",
  "room-0-desk-terminal":   DEMO_INPUT + "print(data[0])\n",
  "room-0-mini-ox-card":    DEMO_INPUT + "print(data[:3])\n",
  "room-0-name-tags":       DEMO_INPUT + "print(len(data))\n",
  "room-0-bookshelf-note":  DEMO_INPUT + "print(data * 3)\n",
  "room-1-word-billboard":  DEMO_INPUT + "print(data.upper())\n",
  "room-1-ox-monitor":      DEMO_INPUT + "print(data.replace('X', 'O'))\n",
  "room-1-number-panel":    DEMO_INPUT + "print(data.split())\n",
  "room-1-radio-signal":    DEMO_INPUT + "if data >= 100:\n    print('PASS')\nelse:\n    print('FAIL')\n",
  "room-1-name-card":       DEMO_INPUT + "print(data % 2 == 0)\n",
  "room-1-checksum-tablet": DEMO_INPUT + "print(data > 0 and data < 10)\n",
  "room-2-file-cabinet":    DEMO_INPUT + "total = 0\nfor x in data:\n    total = total + x\nprint(total)\n",
  "room-2-broken-tags":     DEMO_INPUT + "result = []\nfor x in data:\n    if x > 0:\n        result.append(x)\nprint(result)\n",
  "room-2-score-board":     DEMO_INPUT + "best = 0\nfor item in data:\n    if item['score'] > best:\n        best = item['score']\nprint(best)\n",
  "room-2-timeline":        DEMO_INPUT + "result = []\nn = data\nwhile n > 0:\n    result.append(n)\n    n = n - 1\nprint(result)\n",
  "room-2-access-log":      DEMO_INPUT + "print([x * 2 for x in data if x > 0])\n",
  "room-2-checksum-ledger": DEMO_INPUT + "result = ''\nfor char in data:\n    if char not in 'aeiou':\n        result = result + char\nprint(result)\n",
  "room-3-validator":       DEMO_INPUT + "print(data[::-1])\n",
};
