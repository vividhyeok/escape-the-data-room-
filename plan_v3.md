# plan_v3

## 작성 기준

이 계획은 V2 UI polish 이후 다음 검증이 통과한 뒤 작성했다.

- `npm run build`
- `npm run test:v1`
- `npm run test:v2`

## V3 목표

프로젝트 구조를 `PROJECT_CONTEXT.md`의 교육적 의도에 더 정확히 맞춘다. 특히 퍼즐 비밀번호와 룸 탈출 비밀번호를 명확히 분리하고, “6개 퍼즐 중 일부만 풀어도 Door Code를 추론할 수 있는 구조”를 데이터 설계에 반영한다.

## 우선순위 1: 비밀번호/힌트 구조 정리

- 각 퍼즐의 `expectedAnswer`는 개별 장치 비밀번호로 유지한다.
- 각 퍼즐의 `rewardHint`는 룸 비밀번호를 추론하는 조건으로 명확히 작성한다.
- Door Code는 Room 단위 최종 비밀번호로 유지한다.
- 힌트 4개만 있어도 Door Code를 추론할 수 있도록 중복/보조 힌트를 설계한다.

## 우선순위 2: Room별 퍼즐 수 확장 검토

- 현재 구조는 5개 퍼즐 + Door Keypad 중심이다.
- 목표 구조는 6개 단서 퍼즐 + Door Keypad이다.
- Room 1 시연 안정성을 깨지 않도록 6번째 퍼즐 추가 여부를 먼저 설계한다.
- 추가 퍼즐은 UI와 데이터 구조를 크게 흔들지 않는 방식으로 넣는다.

## 우선순위 3: 전체 Room 콘텐츠 점검

- Room 0, 2, 3, 4의 실제 퍼즐 데이터가 Door Code 힌트 체계와 맞는지 검토한다.
- placeholder 문구나 임시 힌트가 남아 있으면 제거한다.
- Room별 난이도 흐름을 Tutorial → Filtering → Records → Logic → Debug 순서로 정리한다.

## 우선순위 4: 발표 시연 안정성

- 16:9 화면에서 Room 1 주요 오브젝트가 잘 보이는지 확인한다.
- Room debug navigation은 발표 중 실수로 눈에 띄지 않게 유지한다.
- Review Panel에서 “풀지 않은 문제도 확인 가능” 메시지가 잘 전달되도록 다듬는다.

## 우선순위 5: 테스트 확장

- `npm run test:v2`를 실제 V2 확장 테스트로 분리한다.
- Room 0~4 이동과 각 Room의 Door Code 입력을 자동 검증한다.
- 퍼즐 정답과 Door Code가 분리되어 저장되는지 확인한다.

