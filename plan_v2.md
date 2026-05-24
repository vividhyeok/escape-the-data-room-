# plan_v2

## 작성 기준

이 계획은 V1 구현 후 다음 검증이 통과한 뒤 작성했다.

- `npm run build`
- `npm run test:v1`

## V2 목표

Room 1의 발표 시연 안정성을 유지하면서, 실제 수업/시연에서 더 자연스럽게 설명할 수 있도록 실행 경험과 콘텐츠 완성도를 높인다.

## 우선순위 1: Python 실행기 고도화

- 기존 `PythonRunner` 인터페이스를 유지한다.
- `MockPythonRunner`는 발표용 fallback으로 남긴다.
- Pyodide 또는 Skulpt 기반 실제 실행기를 실험한다.
- 실행 로딩 상태, 에러 출력, 실행 시간 제한을 추가한다.

## 우선순위 2: Room 0, 2, 3, 4 콘텐츠 확장

- placeholder 퍼즐을 실제 교육용 퍼즐로 교체한다.
- 각 Room의 힌트 조합이 최종 Door Code로 이어지게 설계한다.
- Room별 난이도 상승 흐름을 만든다.
- Room 0은 튜토리얼로 짧고 확실하게 구성한다.

## 우선순위 3: 발표용 UX 개선

- Room 클리어 후 Review Panel에서 코드 draft를 더 쉽게 펼쳐볼 수 있게 한다.
- 현재 풀어야 할 오브젝트와 이미 푼 오브젝트의 시각 구분을 강화한다.
- Door Keypad에 수집 힌트를 조합하기 쉬운 표시 방식을 추가한다.
- 진행 초기화 버튼에 확인 절차를 추가한다.

## 우선순위 4: 에셋 교체 준비

- Room 배경 이미지 경로를 Room data에 추가한다.
- 오브젝트 이미지 경로를 RoomObject data에 추가한다.
- 이미지가 없으면 현재 CSS placeholder를 fallback으로 유지한다.
- 최종 이미지 교체 시 게임 로직 파일을 건드리지 않게 분리한다.

## 우선순위 5: 테스트 유지

- `npm run test:v1`을 V2 smoke test로 확장한다.
- Room 0 튜토리얼 클리어 테스트를 추가한다.
- Python 실행기 교체 후 mock fallback 테스트를 유지한다.

