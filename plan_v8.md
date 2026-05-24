# plan_v8

## 작성 기준

V7 완료 시점: Close 버튼 수정, Python Reference 창 전면 재설계(검색/아코디언), HUD 아이콘 버튼 전환 완료.

- `npm run build` 통과
- `npm run test:v1` 통과
- `npm run test:v2` 통과

## V8 목표

Room 0 Tutorial 완성 및 Room 2~4 플레이 QA, 발표 시연 최종 완성도 확보.

## 우선순위 1: Room 0 Tutorial 완성

- Room 0 전체 플레이 흐름 확인: CRT TV → Desk Terminal → Door Keypad `8` 입력 → Room Clear
- Room 0 Door Code가 `8`(한 자리)인데 DoorKeypad 입력이 정상 작동하는지 확인
- Room 0 Review Panel에서 `8` 추론 흐름이 자연스럽게 보이는지 확인
- 필요 시 Room 0 Review Panel의 `inference-callout` 문구 조정

## 우선순위 2: Inspect Window 레이아웃 개선

- `inspect-body` 좌측 symbol/label 영역과 우측 clue surface 영역의 높이 균형
- Clue Surface 콘텐츠가 적을 때 너무 좁게 보이는 문제 개선 (min-height 조정)
- 1280×720 노트북 화면에서 Inspect + Python Lab 창이 겹치지 않는지 확인

## 우선순위 3: Room 2~4 플레이 QA

- Room 2 (Records Room): 퍼즐 6개 전체 플레이, door code `3547` 입력 → clear
- Room 3 (Control Room): 퍼즐 6개 전체 플레이, door code `4026`
- Room 4 (Debug Room): 퍼즐 6개 전체 플레이, door code `1584`
- 각 방 Review Panel에서 inference callout과 힌트 개수가 올바르게 표시되는지 확인
- Clue Surface가 각 방 오브젝트 데이터를 올바르게 파싱·렌더링하는지 확인

## 우선순위 4: PythonLabWindow 개선

- 현재 Run Analysis 버튼이 mock output을 바로 출력함
- 코드를 실제로 실행하는 것처럼 보이도록 타이핑 애니메이션 또는 딜레이 효과 추가 검토
- Python Lab 창 상단에 현재 오브젝트 이름과 데이터 미리보기 표시 개선

## 우선순위 5: IMPLEMENTED_SCOPE.md 업데이트

- V7에서 추가된 Python Reference 창 내용 반영
- HUD 아이콘 버튼 구조 반영
- Close 버튼 수정 내용 반영
