# plan_v10

## 작성 기준

V9 완료 시점: 전체 situationText 재작성 (30개), 하단 HUD 탭바 제거, puzzles.ts 퍼즐 설명 명확화 완료.

- `npm run build` 통과
- `npm run test:v1` 통과 (45 PASS)
- `npm run test:v2` 통과 (45 PASS)

---

## 지금까지 완성된 흐름 요약

### 구조

- **React + TypeScript + Vite** SPA
- **Zustand** 상태 관리: 방 이동, 풀린 퍼즐, 수집된 단서, 코드 드래프트 → `localStorage` 자동 저장
- **GameWindow 시스템**: 드래그/리사이즈 가능한 플로팅 창 (`inspect`, `python`, `reference`, `door`)
- 5개 방 (Room 0~4), 각 방 3개 뷰 (왼쪽/정면/오른쪽), 방당 6개 퍼즐 오브젝트
- **토스트 팝업**: 정답 → "단서가 키패드에 추가되었습니다!" / 오답 → "코드 불일치 — 다시 확인하세요."

### 퍼즐 흐름

1. 오브젝트 클릭 → Inspect 창 열림
2. Inspect 창: situationText (무엇을 구해야 하는지) + 데이터 표면 + 코드 입력칸
3. Python 실행 버튼 → Python Lab 창 열림 (코드 작성 + 실행 + 자동 저장)
4. 정답 입력 → 토스트 팝업 + rewardHint가 Door Keypad 창에 추가됨
5. 6개 퍼즐 단서 수집 후 Door Keypad에서 출입문 코드 입력 → 방 클리어
6. Review Panel: 방 완료 요약 + 다음 방 이동

### 완성된 UI 상태

- 전체 한글화 완료
- 장식/과설명 UI 제거 완료
- Inspect 창: inspect-header / inspect-surface / inspect-footer 3단 레이아웃
- Python Reference 스크롤 고정 (검색바 고정, 카테고리만 스크롤)
- 하단 HUD 탭바 제거 완료 (Python Lab · Reference · Door Keypad는 창 내 버튼으로만 접근)
- Room 0 튜토리얼 방 구현 완료 (단문 퍼즐 6개, 한 자리 출입 코드 "8")

---

## V10 목표: 게임성 개선

아래는 실제로 플레이어 입장에서 플레이했을 때 느껴지는 문제점과 그에 대한 보완 방안이다.

---

## 우선순위 1: 플레이어 진입 경험 개선 (Room 0 온보딩)

### 문제

- 게임을 처음 시작하면 어떤 방부터 해야 하는지, 무엇을 해야 하는지 화면만으로 알기 어렵다.
- Room 0("잠긴 서재")이 튜토리얼 방이지만, 다른 방과 시각적으로 구분되지 않는다.
- Room 0의 퍼즐들이 아무 설명 없이 그냥 열린다.

### 보완 방안

1. **첫 진입 시 Room 0로 강제 시작**: `currentRoomId` 기본값을 `"room-0"`으로 변경 (현재 `"room-1"`). `src/store/gameStore.ts`의 초기 상태 확인 후 수정.

2. **Room 0 온보딩 메시지**: Room 0 진입 시 한 번만 보이는 안내 팝업 또는 objective-strip에 "이 방에서 기본 조작을 익힐 수 있습니다." 같은 별도 안내 추가.
   - 구현 위치: `GameShell.tsx`의 `objective-strip` 또는 별도 `WelcomeOverlay` 컴포넌트
   - 조건: `localStorage`에 `etdr-onboarded` 키 없을 때만 표시

3. **Room 0 특이 케이스 확인**: 출입 코드가 "8" (한 자리)인 것이 DoorKeypad에서 정상 처리되는지 실제 플레이로 확인.

---

## 우선순위 2: 풀린 퍼즐 상태 시각화

### 문제

- 오브젝트를 풀면 Inspect 창 안에서만 "해제됨" 배지가 보인다.
- 방을 돌아다닐 때 어느 오브젝트를 풀었는지 핫스팟 레벨에서 구분이 안 된다.
- Door Keypad를 열지 않으면 단서가 몇 개 모였는지 알 수 없다.

### 보완 방안

1. **해결된 핫스팟 시각 구분**: `HotspotObject.tsx`에서 `isSolved` 상태일 때 핫스팟에 별도 CSS 클래스(`hotspot--solved`) 부여 → global.css에서 opacity 낮추기 또는 체크 표시 추가.
   - 참조: `src/components/HotspotObject.tsx`의 `isSolved` 로직

2. **방 진행도 표시**: `top-bar`의 방 제목 옆에 `X/6` 형태로 현재 방의 수집 단서 수 표시.
   - 구현 위치: `GameShell.tsx`의 `title-block`
   - 필요 데이터: `collectedHints.filter(h => h.roomId === room.id).length` (이전에 제거한 로직 재활용)

---

## 우선순위 3: Door Keypad 접근성 개선

### 문제

- Door Keypad는 방 오른쪽 뷰에 있는 "출입문 키패드" 핫스팟을 클릭해야만 열린다.
- 왼쪽 또는 정면 뷰에서 단서를 모은 뒤 오른쪽 뷰로 이동해야 한다는 것이 불명확하다.
- 단서 6개를 다 모아도 플레이어가 어디서 코드를 입력해야 하는지 헤맬 수 있다.

### 보완 방안

1. **단서 수집 완료 시 안내 토스트**: 6번째 단서 수집 시 "모든 단서를 수집했습니다. 출입문 키패드로 이동하세요!" 토스트 표시.
   - 구현 위치: `GameShell.tsx`의 `showToast` 호출 조건 추가 (hint 수집 후 `roomHintCount === roomPuzzles.length` 체크)

2. **힌트 수집 진행도를 top-bar에 표시** (위 우선순위 2와 연동): 6/6이 되면 강조 스타일 적용.

---

## 우선순위 4: Python Lab 창과 Inspect 창 연계

### 문제

- Python Lab을 열면 Inspect 창의 데이터가 안 보인다 (두 창이 겹치거나 Inspect를 닫아야 한다).
- 플레이어가 데이터를 보면서 코드를 작성하려면 창을 수동으로 배치해야 한다.
- 처음 Python Lab 창이 열릴 때 기본 위치가 Inspect 창과 겹친다.

### 보완 방안

1. **Python Lab 기본 배치 개선**: Python Lab 창이 열릴 때 Inspect 창 오른쪽 또는 아래쪽에 자동 배치.
   - 구현 위치: `GameWindow.tsx`의 초기 position 계산 로직
   - `type === "python"` 창의 기본 x 좌표를 inspect 창 오른쪽으로 오프셋

2. **데모 레이아웃 정비**: `?mode=demo` 시 Inspect + Python Lab 창이 나란히 보이도록 `setDemoLayout()`의 좌표값 재확인.

---

## 우선순위 5: Room 2~4 플레이 QA

### 문제

- Room 2~4를 실제로 플레이해서 검증한 적 없다.
- 각 퍼즐의 situationText가 의미 있게 작동하는지, 모든 단서가 Door Keypad에 모이는지 확인 필요.

### 확인 항목

- Room 2: 퍼즐 6개 단서 수집 → Door Code `3547` 입력 → 방 클리어
- Room 3: 퍼즐 6개 단서 수집 → Door Code `4026` 입력 → 방 클리어
- Room 4: 퍼즐 6개 단서 수집 → Door Code `1584` 입력 → 방 클리어
- 각 방 Review Panel에서 미해결 퍼즐 목록과 추론 callout 확인

---

## 우선순위 6: 게임 완료 화면

### 문제

- Room 4를 클리어해도 명확한 "게임 완료" 화면이 없다 (현재 Review Panel에서 "완료" 버튼만 있음).
- 발표 시연 시 마지막 방 클리어 순간이 인상적이지 않다.

### 보완 방안

1. **완료 오버레이**: Room 4 클리어 후 ReviewPanel에서 "모든 방을 탈출했습니다!" 같은 완료 메시지와 함께 전체 통계(총 퍼즐 수, 클리어 시간 등) 표시.
   - `ReviewPanel.tsx`에서 `isLastRoom` 조건 분기
   - `roomOrder`에서 마지막 방 여부 판단: `roomOrder[roomOrder.length - 1] === room.id`

---

## 우선순위 7: CSS 잔여 정리

### 문제

- 하단 HUD 제거 후 `.bottom-hud`, `.hud-btn`, `.hud-icon`, `.hud-label` CSS 클래스들이 global.css에 잔류.
- `game-shell`의 `grid-template-rows`에 HUD 높이가 포함되어 있을 수 있음.

### 보완 방안

- `global.css`에서 `.bottom-hud`, `.hud-btn`, `.hud-icon`, `.hud-label` 관련 스타일 블록 제거
- `.game-shell` 레이아웃에서 HUD 행 제거 확인

---

## 우선순위 8: IMPLEMENTED_SCOPE.md 업데이트

- V8/V9 변경사항 반영:
  - 전체 한글화
  - 클루 팝업 시스템 (toasts)
  - Inspect 창 레이아웃 재구성 (3단: header / surface / footer)
  - 하단 HUD 탭바 제거
  - Python Reference 스크롤 고정
  - 30개 퍼즐 situationText 명확화

---

## 파일 참조 (에이전트용)

| 목적 | 파일 경로 |
|---|---|
| 방 이동 / 초기 방 설정 | `src/store/gameStore.ts` |
| 오브젝트 핫스팟 | `src/components/HotspotObject.tsx` |
| 메인 쉘 / HUD | `src/components/GameShell.tsx` |
| Inspect 창 | `src/components/InspectModal.tsx` |
| 출입문 키패드 | `src/components/DoorKeypad.tsx` |
| Python Lab 창 | `src/components/PythonLabWindow.tsx` |
| 방 클리어 패널 | `src/components/ReviewPanel.tsx` |
| 창 위치/크기 | `src/components/GameWindow.tsx` |
| 전역 스타일 | `src/styles/global.css` |
| 퍼즐 데이터 | `src/data/puzzles.ts` |
| 방/오브젝트 데이터 | `src/data/rooms.ts` |
| 스모크 테스트 | `scripts/smoke_test.mjs` |

## 테스트 명령

```
npm run build       # TypeScript 빌드 + Vite 번들
npm run test:v1     # 스모크 테스트 (45 PASS 기준)
npm run test:v2     # 동일 스모크 테스트 재실행
```
