# DEVELOPMENT_CONTEXT

## 현재 개발 방향

이 프로젝트는 코딩 문제 사이트가 아니라 Python 복습 활동을 방탈출 게임 형식으로 포장한 교육 도구다.

사용자는 방 안의 오브젝트를 조사하고, 그 안의 데이터를 해석해 짧은 Unlock Code를 얻는다. 각 Unlock Code를 맞히면 Door Code를 추론하는 힌트를 받는다.

Python Lab은 정답 제출창이 아니라 선택형 분석 도구다. 데이터가 많아 손으로 처리하기 귀찮거나 실수하기 쉬울 때 자연스럽게 열게 만드는 것이 목표다.

## 최신 구현 기준

- 전체 화면은 게임 씬이 중심이다.
- HUD는 얇게 얹히고, 큰 좌우 대시보드 패널은 기본 화면에 노출하지 않는다.
- Inspect, Python Lab, Reference, Door Keypad, Notebook, Review는 모두 공통 GameWindow를 사용한다.
- GameWindow는 드래그 이동, 리사이즈, z-index focus, 위치/크기 저장을 지원한다.
- Room 1은 발표 시연 중심 방이다.
- Room 1 데이터는 손으로도 풀 수 있지만 Python을 쓰는 편이 훨씬 빠르게 느껴지도록 밀도를 높였다.
- 실제 플레이 모드에서는 Python Lab이 빈 상태로 열린다.
- Demo Mode에서만 Word Billboard의 예시 접근 코드가 미리 저장된다.

## 실행 모드

- `run_app.bat`: 일반 실행. localStorage 상태를 유지한다.
- `run_test.bat`: 실제 플레이 테스트. `?mode=test`로 시작하며 진행 상태를 초기화한다.
- `run_demo.bat`: 발표 시연. `?mode=demo`로 시작하며 Room 1 Word Billboard와 Python Lab을 준비한다.

## Room 1 현재 설계

Room 1 Door Code는 `7479`다.

힌트 구조:

- Word Billboard: `6719` 입력 후 `CD - AB = 5다.`
- OX Monitor: `1937` 입력 후 `마지막 숫자는 9다.`
- Number Panel: `4820` 입력 후 `첫 번째 숫자는 7이다.`
- Name Card Board: `8052` 입력 후 `각 자리 숫자의 합은 27이다.`
- Radio Signal Device: `3164` 입력 후 `코드는 홀수다.`
- Checksum Tablet: `2748` 입력 후 `두 번째 숫자는 4다.`

중요: 퍼즐의 Python output은 중간 신호일 수 있고, Inspect Window에 입력하는 값은 짧은 Unlock Code다.

## 다음 개발자가 지킬 것

- 문제 설명에서 특정 문법을 강제하지 않는다.
- `Problem`, `Submit`, `Expected Answer` 같은 코딩 사이트 용어를 UI에 늘리지 않는다.
- `Unlock Code`, `Check Code`, `Signal Output`, `Clue Surface`, `Access granted`, `Access denied` 용어를 유지한다.
- 실제 플레이 모드에 정답 코드가 자동으로 노출되지 않게 한다.
- 시연 편의 기능은 Dev Menu 또는 Demo Mode에만 둔다.
- 실행 방법이 바뀌면 `run_app.bat`, `run_test.bat`, `run_demo.bat`, `README.md`를 함께 갱신한다.
