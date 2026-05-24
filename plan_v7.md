# plan_v7

## 작성 기준

이 계획은 V6 Clue Surface 확장 및 Demo Mode layout, Review Panel 교육적 설명 강화가 완료된 뒤 작성했다.

- `npm run build`
- `npm run test:v1`
- `npm run test:v2`

## V7 목표

발표 시연 완성도를 높이고 Room 1 이외 방들의 플레이 품질을 끌어올린다. 특히 Room 0 Tutorial 완성과 UI 세부 다듬기에 집중한다.

## 우선순위 1: Room 0 Tutorial 완성

- Room 0 Door Code가 `8`(한 자리)인데 Keypad 입력란이 4자리 기준으로 잘리지 않는지 확인
- Room 0 플레이 흐름 전체 확인: CRT TV → Desk Terminal → Door Keypad `8` 입력 → Room Clear
- Room 0 Review Panel에서 힌트 조합으로 `8` 추론 흐름이 자연스럽게 보이는지 확인
- Bookshelf Note expectedAnswer가 `2468`인데 Door Code `8`과 연결이 자연스럽지 않으면 퍼즐 설명 조정

## 우선순위 2: Inspect Window 레이아웃 개선

- 현재 inspect-body가 `grid-template-columns: minmax(180px, 250px) minmax(0, 1fr)` 구조
- 좌측 symbol/label 영역과 우측 clue surface 영역의 높이 균형 개선
- Clue Surface가 너무 작게 보이면 min-height 조정
- 작은 노트북 화면(1280x720)에서 inspect + python lab이 겹치지 않는지 확인

## 우선순위 3: HUD Bottom 버튼 정리

- `Notebook`, `Hints X/6`, `Inventory` 세 버튼이 모두 `setNotebookOpen(true)`를 호출함
- Notebook은 현재 room의 퍼즐 목록과 draft 코드를 보여줌
- `Hints X/6` 버튼은 Door Keypad로 연결하거나 Notebook의 hints 탭으로 연결하는 것이 더 자연스러움
- `Inventory` 버튼은 수집한 힌트와 아이템을 보여주는 역할로 분리 가능
- 세 버튼 중복을 정리하고 각 버튼의 역할을 명확하게 구분

## 우선순위 4: Room 2~4 플레이 QA

- Room 2 (Records Room) 퍼즐 6개 전체 플레이: unlock code 입력 → hint 획득 → door code `3547` 입력 → clear
- Room 3 (Control Room) 퍼즐 6개 전체 플레이: door code `4026`
- Room 4 (Debug Room) 퍼즐 6개 전체 플레이: door code `1584`
- 각 방 Review Panel에서 inference callout과 힌트 개수가 올바르게 표시되는지 확인

## 우선순위 5: IMPLEMENTED_SCOPE.md 업데이트

- V6에서 추가된 Clue Surface 목록 반영
- Demo Mode layout preset 반영
- Review Panel 교육적 설명 반영
