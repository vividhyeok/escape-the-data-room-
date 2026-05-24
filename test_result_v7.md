# test_result_v7

## 테스트 일시

2026-05-24

## 변경 범위

- Close 버튼 수정 (V6 작업, GameWindow.tsx)
  - 타이틀바 `onPointerDown={startDrag}` → `setPointerCapture` 가 클릭 이벤트를 흡수하던 문제
  - Close 버튼에 `onPointerDown={(e) => e.stopPropagation()}` 추가로 해결
- Python Reference 창 전면 재설계 (HelpModal.tsx)
  - puzzle prop 제거 → props: `{ onClose }` 만 남김
  - 기존 puzzle-specific 힌트 창에서 범용 Python 문법 참조로 교체
  - 13개 카테고리, 80+ 항목: 기본문법, 형변환, 문자열, 리스트, 딕셔너리, 집합, 조건문, 반복문, 함수, 내장함수, 연산자, 튜플
  - 검색바: keyword/code/desc/tags 전체 필터링
  - 아코디언: 카테고리 헤더 클릭으로 개폐
  - 고정 id `"python-reference"` (창 위치 저장 연동)
- GameShell.tsx 수정
  - `helpPuzzleId: string|null` → `helpOpen: boolean` 으로 단순화
  - `openHelp(puzzle: Puzzle)` → `openHelp(): void`
  - HelpModal JSX: `{helpOpen ? <HelpModal onClose={() => setHelpOpen(false)} /> : null}`
  - HUD 버튼 아이콘 디자인 전환
    - 5개 버튼에 `.hud-btn` + `.hud-icon` + `.hud-label` 구조 적용
    - `Inventory` 버튼 제거 (Notebook과 중복)
    - `Hints X/N` → Door Keypad 연결로 변경
    - `참조` 버튼 추가 → Python Reference 창 열기
- InspectModal.tsx 수정
  - `onOpenHelp: (puzzle: Puzzle) => void` → `onOpenHelp: () => void`
  - 버튼 핸들러: `onOpenHelp(puzzle)` → `onOpenHelp()`
- global.css 추가
  - Python Reference 패널 CSS: `.help-modal`, `.ref-search-bar`, `.ref-search-input`, `.ref-search-clear`, `.ref-categories`, `.ref-category`, `.ref-cat-header`, `.ref-cat-icon`, `.ref-cat-title`, `.ref-cat-count`, `.ref-cat-chevron`, `.ref-items`, `.ref-item`, `.ref-item-header`, `.ref-keyword`, `.ref-code`, `.ref-desc`
  - HUD 아이콘 버튼 CSS: `.hud-btn`, `.hud-icon`, `.hud-label`

## 실행한 명령

```bash
npm run build
npm run test:v1
npm run test:v2
```

## 결과

- `npm run build`: 통과
- `npm run test:v1`: 통과
- `npm run test:v2`: 통과

## 확인된 핵심 플로우

- Python Reference 창: HUD `참조(⊕)` 버튼 또는 Inspect Window의 `? Reference` 버튼으로 열림
- 검색창에 키워드 입력 시 일치하는 항목만 표시 (카테고리별 필터링)
- 아코디언: 카테고리 클릭으로 펼침/접힘, 검색 중에는 모두 펼쳐짐
- HUD 버튼이 아이콘+레이블 구조로 변경: ◧ 노트북 / ◈ 힌트 / ⟩_ Python / ⊕ 참조 / ≡ 메뉴
- `◈` 힌트 버튼은 Door Keypad 창으로 연결
- Close 버튼이 포인터 캡처 문제 없이 정상 동작
