# ETDR — 오브젝트 배치 & 이미지 생성 가이드

## 1. 오브젝트 좌표 시스템

### 좌표 (x, y)
`rooms.ts` 의 오브젝트 좌표는 **배경 이미지 기준 퍼센트(%)** 입니다.

```
(0, 0) ──────────────── (100, 0)
   │    배경 이미지       │
   │    가로×세로         │
(0, 100) ─────────── (100, 100)
```

- `x = 50, y = 50` → 화면 정가운데
- `x = 0, y = 50`  → 왼쪽 끝 중간
- `x = 90, y = 80` → 오른쪽 아래

> 배경 이미지는 3D 파노라마로 원기둥처럼 말려 있어서,  
> 실제로는 x 100 은 x 0 과 이어집니다.  
> 문 오브젝트는 x=80~95 사이에 두는 게 자연스럽습니다.

---

### scale (크기)
`scale` 값이 클수록 오브젝트가 커집니다.

| scale 값 | 의미            |
|----------|-----------------|
| 0.7 ~ 0.9 | 작은 소품 (쪽지, 카드) |
| 1.0 ~ 1.3 | 기본 크기 (패널, 명찰) |
| 1.5 ~ 2.0 | 중간 크기 (모니터, 패드) |
| 2.0 ~ 3.0 | 큰 오브젝트 (TV, 캐비닛) |

---

### viewId (보이는 각도)
각 방은 세 방향을 바라볼 수 있습니다.

| viewId   | 설명                        |
|----------|-----------------------------|
| `"left"`   | 왼쪽 벽면                   |
| `"center"` | 정면 (기본값, 문이 여기 있음) |
| `"right"`  | 오른쪽 벽면                  |
| `"bottom"` | 아래쪽 (바닥이나 낮은 위치)   |

---

## 2. 오브젝트 추가하는 방법

### 2-1. `src/data/rooms.ts` 에서 object() 함수 사용

```typescript
object(
  "room-1-my-object",      // ID: 방ID-설명 형태로 고유하게
  "room-1",                // 어느 방인지
  "left",                  // 어느 각도에서 보이는지 (viewId)
  "내 오브젝트",            // 화면에 표시될 이름
  "OBJ",                   // 짧은 레이블 (2~4글자)
  "오브젝트 설명 한 줄.",   // 마우스 오버 설명
  "room-1-my-puzzle",      // 연결된 퍼즐 ID
  "ICON",                  // fallback 아이콘 텍스트
  45,                      // x 좌표 (0~100)
  60,                      // y 좌표 (0~100)
  1.4,                     // scale 크기 배율
  "puzzle",                // kind: "puzzle" or "door"
  `${OBJ}/room-1/my-object.png`  // 이미지 경로
)
```

### 2-2. `src/data/puzzles.ts` 에서 퍼즐 추가

```typescript
{
  id: "room-1-my-puzzle",           // rooms.ts 의 puzzleId 와 일치해야 함
  roomId: "room-1",
  objectId: "room-1-my-object",     // rooms.ts 의 오브젝트 ID
  title: "퍼즐 제목",
  situationText: "상황 설명 텍스트.\n줄바꿈도 가능합니다.",
  dataText: "화면에 표시될 데이터",  // 각 렌더러에 맞게 설정
  testCases: [
    { inputCode: "data = 'test'", expectedOutput: "TEST" }
  ],
  requiredSyntax: ["upper"],   // 필수 문법 AST 노드명
  bannedSyntax: [],            // 금지 문법
  referenceItems: [
    ref("data.upper()", "대문자로 변환합니다.")
  ],
  rewardHint: hint("my-hint-id", "room-1", "room-1-my-puzzle", "힌트 텍스트"),
  starterCode: "# 스타터 코드\nanswer = data.___()\n",
  imageUrl: "/assets/images/objects/room-1/my-object.png",
  isRequired: true,
  requiredForDoor: true,
  doorCodePosition: 1,     // 1~4
  doorCodePiece: "7",      // 문 코드의 한 자리
  puzzleType: "code",
},
```

---

## 3. dataText 포맷 — 렌더러별 규칙

각 퍼즐 ID마다 특정 렌더러가 연결되어 있습니다.  
아래 규칙에 맞게 `dataText` 를 작성해야 시각적으로 예쁘게 나옵니다.

### room-0-tv-sequence (TV 화면)
공백으로 구분된 토큰을 각각 번호칸에 표시합니다.  
`"?"` 는 강조 표시됩니다.
```
dataText: "data + 10 = ?"
→ TV에: [data] [+] [10] [=] [?]
```

### room-0-desk-terminal (터미널 화면)
한 줄을 `❯ 내용` 형태로 표시합니다.
```
dataText: "SYSTEM"
→ 터미널: ❯ SYSTEM_
```

### room-0-mini-ox-card (OX 카드)
공백이 있으면 공백 기준으로 분리, 없으면 글자별로 분리합니다.  
`X` 는 빨간 X셀, 나머지는 초록 O셀로 표시됩니다.
```
dataText: "P Y T H O N"   → 각 글자가 셀 하나씩
dataText: "OX XO"          → 공백 기준으로 분리
```

### room-0-name-tags (명찰)
공백으로 구분된 각 단어를 명찰 카드로 표시합니다.
```
dataText: "ALPHA BRAVO DELTA"
→ [ALPHA] [BRAVO] [DELTA] 명찰 3개
```

### room-0-pattern-tiles (타일 박스)
공백으로 구분된 각 값을 타일로 표시합니다.
```
dataText: "7 3 5 8"
→ 4개의 타일
```

### room-0-bookshelf-note (쪽지)
dataText 내용 그대로 단락으로 표시합니다.  
`\n` 으로 줄바꿈합니다.
```
dataText: "첫 줄\n둘째 줄"
```

### room-1-word-billboard (전광판)
공백으로 구분된 각 단어를 플로팅 워드 토큰으로 표시합니다.
```
dataText: "hello world python"
→ [hello] [world] [python] 3개의 떠다니는 단어
```

### room-1-ox-monitor (OX 모니터)
줄바꿈으로 구분된 행의 각 글자를 OX 그리드로 표시합니다.
```
dataText: "X X O X\nO X O X"
→ 2행 OX 그리드
```

### room-1-number-panel (숫자 패널)
공백으로 구분된 값을 숫자 토큰으로 표시합니다.
```
dataText: "ALPHA BRAVO CHARLIE"
→ 3개의 숫자 토큰
```

### room-1-radio-signal (라디오)
줄바꿈으로 구분된 각 줄 중 숫자로 시작하는 값을 주파수 토큰으로 표시합니다.
```
dataText: "085.7\n100.3\n112.9"
→ 3개의 주파수 토큰
```

### room-2-file-cabinet (파일 로그)
`ID / 값 / 상태` 형태의 행들을 로그 행으로 표시합니다.  
`success` 포함 행은 초록, 아니면 빨간색입니다.
```
dataText: "FILE_01 / 12 / success\nFILE_02 / -3 / error"
```

### room-2-broken-tags (손상된 명찰)
줄바꿈으로 구분된 각 행을 손상된 태그로 표시합니다.
```
dataText: "TAG_A\nTAG_B\nTAG_C (손상)"
```

### room-2-score-board (점수 보드)
복잡한 형태입니다. 정확히 아래 구조를 따라야 합니다:
```
첫 번째 줄: 헤더 (무시됨)
2~6번째 줄: ID/이름  (슬래시 구분)
7번째 줄: 빈 줄
8번째 줄~: ID/점수  (슬래시 구분)
```
예시:
```
SECURITY DB
A001/에이전트 알파
A002/에이전트 베타

A001/88
A002/72
```

### room-2-timeline (타임라인)
`시간 / 이벤트` 형태의 행들을 타임라인으로 표시합니다.
```
dataText: "T-05 / 시스템 부팅\nT-04 / 인증 시작"
```

### room-2-access-log (접근 로그)
`시간 / 사용자 / 상태` 형태.  
`success` 포함이면 초록, `fail` 포함이면 빨간색입니다.
```
dataText: "09:12 / AGENT_A / success\n09:15 / AGENT_B / fail"
```

### room-2-checksum-ledger (체크섬)
`ID / 내용 / PASS 또는 FAIL` 형태입니다.
```
dataText: "CHECK_A / data / PASS\nCHECK_B / info / FAIL"
```

---

## 4. 필수 문법 목록 (requiredSyntax)

아래 값들을 `requiredSyntax` 배열에 넣으면 해당 문법을 사용해야만 통과합니다.

| 값           | 설명                              |
|--------------|-----------------------------------|
| `"Assign"`   | 변수 대입문 (`answer = ...`)      |
| `"BinOp"`    | 이항 연산 (`+`, `-`, `*`, `/`, `%`) |
| `"Subscript"`| 인덱싱 또는 딕셔너리 접근 (`data[0]`, `data['key']`) |
| `"Slice"`    | 슬라이싱 (`data[0:3]`, `data[::-1]`) |
| `"len"`      | len() 함수                        |
| `"upper"`    | .upper() 메서드                   |
| `"lower"`    | .lower() 메서드                   |
| `"replace"`  | .replace() 메서드                 |
| `"split"`    | .split() 메서드                   |
| `"strip"`    | .strip() 메서드                   |
| `"join"`     | .join() 메서드                    |
| `"append"`   | .append() 메서드                  |
| `"If"`       | if/else 조건문                    |
| `"For"`      | for 반복문                        |
| `"While"`    | while 반복문                      |
| `"ListComp"` | 리스트 컴프리헨션 (`[x for x in ...]`) |
| `"FunctionDef"` | 함수 정의 (`def ...`)          |
| `"Return"`   | return 문                         |
| `"sum"`      | sum() 함수                        |
| `"print"`    | print() 함수                      |

---

## 5. 이미지 생성 스크립트 사용법

### 설치
```bash
cd C:\Users\user\Desktop\ETDR
npm install   # sharp 등 의존성 설치
```

### 명령어

```bash
# 누락된 이미지만 생성 (기존 이미지 유지)
node scripts/generate_assets.mjs

# 생성 전 기존 이미지 백업 (→ public/assets/images/_backup/)
node scripts/generate_assets.mjs --backup

# 모든 이미지 강제 재생성
node scripts/generate_assets.mjs --force

# 특정 방만 생성
node scripts/generate_assets.mjs --room=1

# 배경만 / 오브젝트만 생성
node scripts/generate_assets.mjs --only=bg
node scripts/generate_assets.mjs --only=obj

# 생성할 목록만 확인 (실제 API 호출 없음)
node scripts/generate_assets.mjs --dry-run

# 백업 후 강제 전체 재생성
node scripts/generate_assets.mjs --backup --force
```

### 이미지 규격
| 종류       | 크기        | 배경    | 모델        |
|------------|-------------|---------|-------------|
| 파노라마 배경 | 1536×1024  | 불투명  | gpt-image-1 |
| 오브젝트 스프라이트 | 1024×1024 | 투명 PNG | gpt-image-1 |

---

## 6. 새 오브젝트 이미지 프롬프트 작성 팁

```
단일 오브젝트만, 정면에서 바라본 평면 뷰,
투명 배경, 게임 스프라이트 스타일,
텍스트/숫자/글자 없음, 사람 없음,
[분위기 묘사], [색상 팔레트]
```

예시 (라디오):
```
"Compact vintage radio device with dial and antenna, faint violet glow,
transparent background, flat orthographic sprite, no text, no numbers"
```

### 방별 분위기 키워드
| 방    | 주색상  | 분위기 키워드                      |
|-------|---------|-------------------------------------|
| Room 0 | 앰버, 갈색 | warm amber, wooden study, dusty, academic |
| Room 1 | 청록, 청색 | dark teal, concrete, signal, radio, cyan glow |
| Room 2 | 세이지 그린 | muted green, archive, metal filing, records |
| Room 3 | 인디고, 보라 | deep indigo, purple, control room, violet rim light |

---

## 7. 문 코드 참고

| 방    | 문 코드 | 퍼즐별 조각 (위치 1~4)         |
|-------|---------|-------------------------------|
| Room 0 | `8522` | 8 (tiles), 5 (tv), 2 (terminal), 2 (ox-card) |
| Room 1 | `7479` | 7 (billboard), 4 (ox-monitor), 7 (number-panel), 9 (radio) |
| Room 2 | `3547` | 3 (file-cabinet), 5 (broken-tags), 4 (score-board), 7 (timeline) |
| Room 3 | `1584` | 복습 방, 별도 입력 방식        |
