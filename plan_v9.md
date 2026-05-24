# plan_v9

## 작성 기준

V8 완료 시점: 전체 한글화, 장식 UI 제거, 클루 팝업 시스템, Python Reference 스크롤 고정 완료.

- `npm run build` 통과
- `npm run test:v1` 통과 (43 PASS)
- `npm run test:v2` 통과 (44 PASS)

## V9 목표

Room 0 Tutorial 완성, Inspect 레이아웃 최종 조정, Room 2~4 QA.

## 우선순위 1: Room 0 Tutorial 완성

- Room 0 전체 플레이 확인: CRT TV → 데스크 터미널 → 출입문 키패드 `8` → 방 클리어
- 한 자리 Door Code `8` 입력이 정상 처리되는지 확인
- Review Panel에서 `8` 추론 흐름 자연스러운지 확인

## 우선순위 2: Inspect Window 레이아웃 조정

- 좌측 inspect-visual과 우측 clue surface의 높이 균형 재확인
- 1280×720 화면 기준 Inspect + Python Lab 창이 겹치지 않는지 확인
- 클루가 복잡한 Room 3/4 오브젝트에서 clue surface가 스크롤 가능한지 확인

## 우선순위 3: Room 2~4 플레이 QA

- Room 2: 퍼즐 6개 클루 수집 → Door Code `3547`
- Room 3: 퍼즐 6개 클루 수집 → Door Code `4026`
- Room 4: 퍼즐 6개 클루 수집 → Door Code `1584`
- 각 방 Review Panel에서 힌트 개수와 추론 callout 확인

## 우선순위 4: 발표 시연 최종 체크

- Demo Mode (`?mode=demo`) 로드 후 Inspect + Python 창 나란히 배치 확인
- 모든 토스트 팝업이 한국어로 표시되는지 확인
- 창 닫기 버튼 정상 동작 재확인

## 우선순위 5: IMPLEMENTED_SCOPE.md 업데이트

- V7/V8 변경사항 반영: Python Reference, 한글화, 클루 팝업 시스템
