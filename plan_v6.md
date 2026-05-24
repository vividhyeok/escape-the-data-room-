# plan_v6

## 작성 기준

이 계획은 V5 Window Manager 구현 후 다음 검증이 통과한 뒤 작성했다.

- `npm run build`
- `npm run test:v1`
- `npm run test:v2`

## V6 목표

창 시스템이 들어간 상태에서 발표 시연 안정성을 높인다. 특히 Demo Mode와 Review Panel을 발표 흐름에 맞게 정리한다.

## 우선순위 1: Window QA

- 16:9 발표 화면에서 Inspect + Python Lab + Reference를 동시에 열어 배치 확인
- 작은 노트북 화면에서 기본 창 크기가 잘리지 않는지 확인
- Reset Windows가 모든 창 위치와 크기를 안정적으로 복원하는지 확인

## 우선순위 2: Demo Mode 강화

- Demo Mode를 누르면 Room 1, Word Billboard Inspect, Python Tool이 보기 좋은 위치로 열리는지 육안 확인
- 필요하면 Demo Mode 전용 window layout preset을 추가
- Demo Mode에서는 정답 자동 입력 없이 starter code만 준비된 상태를 유지

## 우선순위 3: Review Panel 교육적 설명 강화

- “모든 오브젝트를 해제하지 않아도 Door Code를 추론할 수 있다”는 설명을 Review Panel에 짧게 반영
- 획득한 clue와 Door Code 조건을 연결해서 보여주는 요약 영역 추가

## 우선순위 4: Room 0, 2, 3, 4 Clue Surface 확장

- Room 1과 같은 방식으로 나머지 Room의 generic clue surface를 오브젝트별 시각 표현으로 확장
- 기록실, 제어실, 디버그룸의 오브젝트 성격이 UI에서 드러나게 한다

