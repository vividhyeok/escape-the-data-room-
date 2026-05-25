# DEVELOPMENT_CONTEXT

## 현재 개발 방향

이 프로젝트는 코딩 문제 사이트가 아니라 Python을 데이터 정리 도구로 사용하는 데이터 추리형 방탈출 게임이다.

플레이어는 방 안의 오브젝트를 조사하고, Data Surface의 데이터를 Python Lab으로 정돈해 Unlock Code를 얻는다. 필수 퍼즐을 해결하면 Door Code 조각을 얻고, Door Code 조각 4개를 모아 다음 Room으로 이동한다.

## 최신 구조 기준

- Room 0: Tutorial / Analysis Basics
- Room 1: Signal Room
- Room 2: Records Room
- Room 3: Dangerous Stairs / Extra Challenge
- Ending Window: 기본 탈출 엔딩과 짧은 풀이 요약

Room 1~2는 본편 방이고, Room 3은 선택형 Extra Challenge다.

- 필수 퍼즐 4개
- 숨겨진 선택 단서 2개
- Door Keypad

필수 퍼즐 4개는 Door Code 조각을 하나씩 제공한다. Room 2를 탈출하면 기본 엔딩을 볼 수 있고, 강사가 원하면 위험한 계단을 통해 Room 3으로 진입한다.

## Room 1 현재 설계

Room 1 Door Code는 `7479`다.

필수 퍼즐:

- Word Billboard: Unlock Code `6719` → Door Code 1번째 조각 `7`
- OX Monitor: Unlock Code `1937` → Door Code 2번째 조각 `4`
- Number Panel: Unlock Code `4820` → Door Code 3번째 조각 `7`
- Name Card Board: Unlock Code `8052` → Door Code 4번째 조각 `9`

숨겨진 선택 단서:

- Radio Signal Device: Unlock Code `3164`
- Noise Strip: Unlock Code `2748`

## Room 2 현재 설계

Room 2 Door Code는 `3547`다.

필수 퍼즐:

- File Cabinet → Door Code 1번째 조각 `3`
- Broken Name Tags → Door Code 2번째 조각 `5`
- Score Board → Door Code 3번째 조각 `4`
- Timeline Board → Door Code 4번째 조각 `7`

숨겨진 선택 단서:

- Access Log Table
- Archive Note

## Room 3 현재 설계

Room 3은 위험한 계단 아래의 Extra Challenge다. Door Code를 강제하지 않고, 풀 만큼 풀거나 바로 마무리할 수 있다.

필수 퍼즐:

- Logic Gate Board → Door Code 1번째 조각 `4`
- Candidate Codes Board → Door Code 2번째 조각 `0`
- Experiment Console → Door Code 3번째 조각 `2`
- Switch Panel → Door Code 4번째 조각 `6`

숨겨진 선택 단서:

- Warning Lamp Board
- Candidate Dial

## Ending / Review 현재 설계

기본 흐름에서는 Room 2 탈출 후 엔딩 창을 띄운다. Room 4는 Dev/검토용 Review 공간으로 남아 있으나 본편 흐름의 필수 방은 아니다.

- Missed Clues Board: 놓친 숨겨진 선택 단서 확인 및 다시 풀기
- Solved Route Board: 해결한 필수 퍼즐과 Door Code 조각 확인
- Play Style Summary: 사용한 Python 도구와 풀이 방식 요약
- Saved Draft Archive: 저장된 코드 draft 확인
- Final Review Console: Room별 필수/숨겨진 단서 현황 확인
- Final Exit Door: 최종 탈출 연출

중요: Unlock Code와 Door Code 조각은 다른 개념이다. Python Lab의 Signal Output으로 Unlock Code를 확인하고, Unlock Code를 입력하면 Door Code 조각 또는 숨겨진 단서 기록을 얻는다.

## UI 용어 기준

- `Unlock Code`
- `Check Code`
- `Copy Data`
- `Open Python Lab`
- `Run Analysis`
- `Signal Output`
- `Door Code`
- `Hidden Clue`
- `Missed Hidden Clues`

`Problem`, `Quiz`, `Answer`, `Submit` 같은 코딩 문제 사이트 용어는 쓰지 않는다.

## 실행 모드

- `run_app.bat`: 일반 실행. localStorage 상태를 유지한다.
- `run_test.bat`: 실제 플레이 테스트. `?mode=test`로 시작하며 진행 상태를 초기화한다.
- `run_demo.bat`: 발표 시연. `?mode=demo`로 시작하며 Room 1 Word Billboard와 Python Lab을 준비한다.

## 다음 개발자가 지킬 것

- 문제 설명에서 특정 문법을 직접 강제하지 않는다.
- 데이터 상황이 Python 활용을 자연스럽게 유도해야 한다.
- Room 1~3 필수 퍼즐은 해당 Room의 Python 활용 범주를 반드시 경험하게 해야 한다.
- 숨겨진 선택 단서는 필수 진행을 막지 않는다.
- Room 2 이후 기본 선택은 엔딩이다.
- Room 3은 강사가 선택적으로 열어 주는 Extra Challenge다.
- 실제 Python 실행이 아니면 발표와 문서에서 mock 또는 시뮬레이션임을 과장 없이 설명한다.
