# test_result_v8

## 테스트 일시

2026-05-24

## 변경 범위

### 한글화 (전체)
- `rooms.ts`: 방 부제목, 설명, 뷰 이름, 오브젝트 타이틀/설명 전부 한국어 적용
  - 뷰: "Left View" → "왼쪽", "Center View" → "정면", "Right View" → "오른쪽"
  - 방 부제목: "Signal Room" → "신호실" 등
  - 오브젝트 타이틀: "Word Billboard" → "단어 전광판" 등 전체 Korean 적용
- `puzzles.ts`: 퍼즐 타이틀 한글화 (rooms.ts 오브젝트 타이틀과 통일)
- `HotspotObject.tsx`: "Solved" → "해제됨", "Locked" → "잠김", "Inspect" → "조사"
- `DoorKeypad.tsx`, `NotebookPanel.tsx`, `PythonLabWindow.tsx`, `ReviewPanel.tsx`, `InspectModal.tsx`, `GameShell.tsx`, `RoomView.tsx`: 모든 UI 레이블·버튼·메시지 한글화

### 장식/과설명 UI 제거
- GameShell: `<span className="project-kicker">Escape the Data Room!</span>` 제거
- GameShell: 방 subtitle 위 최상위 h1만 남김 (top-bar에서 subtitle을 p 태그로 간소화)
- GameShell: objective-strip에서 `<span>Objective</span>` 레이블 제거, 설명 문장만 표시
- PythonLabWindow: `lab-note` div (긴 설명 블록) 완전 제거
- PythonLabWindow: "Saved draft" 레이블 제거, 출력 빈 상태 placeholder 텍스트 제거
- ReviewPanel: `.conditions-note` 제거 (inference-callout에서 이미 설명함)
- RoomView: 뷰 description 제거 (제목만 표시)

### Inspect Modal 클루 흐름 변경
- 정답 입력 시: 인라인 success-strip + 힌트 텍스트 완전 제거
- 정답 → 토스트 팝업 "단서가 키패드에 추가되었습니다!"
- 오답 → 토스트 팝업 "코드 불일치 — 다시 확인하세요." + 흔들림 애니메이션
- 인라인 `feedback` state 완전 제거 (팝업 시스템으로 통합)
- `inspect-visual` aside에서 `object.description`과 `shortLabel` 제거
- `isSolved` 상태는 해제됨 뱃지 (`.solved-badge`)로만 표시
- Enter 키로 코드 확인 가능 (`onKeyDown` 추가)

### CSS 개선
- `inspect-visual` 크기 축소: min-height 260px → 140px, 아이콘 92px → 56px
- `.solved-badge` 스타일 추가 (초록 뱃지)
- `.game-window-reference .game-window-body`: overflow hidden + flex column으로 Python Reference 스크롤 고정 (검색바 고정, 카테고리만 스크롤)
- `.help-modal`: height 100% 제거 → flex: 1; min-height: 0 로 변경

### smoke_test.mjs 업데이트
- 모든 영어 문자열을 한국어로 교체
- `clickText("실행")` → `clickSelector(".lab-actions .primary-button")` (모호성 해결)
- `clickText("Return to Room")` → `clickSelector(".review-modal .ghost-button")` (안정성 개선)
- 전체 오브젝트 이름, 방 제목 한국어로 갱신

## 실행한 명령

```bash
npm run build
npm run test:v1
npm run test:v2
```

## 결과

- `npm run build`: 통과
- `npm run test:v1`: 통과 (43 PASS)
- `npm run test:v2`: 통과 (44 PASS)

## 확인된 핵심 플로우

- 정답 입력 시 인라인 힌트 텍스트 없음 → 팝업 "단서가 키패드에 추가되었습니다!"
- 오답 입력 시 팝업 "코드 불일치 — 다시 확인하세요." + 흔들림
- Door Keypad 창에서 수집된 단서 확인
- Python Reference 창: 검색바 고정, 카테고리 리스트만 스크롤
- 모든 오브젝트 이름과 UI 한국어로 표시
