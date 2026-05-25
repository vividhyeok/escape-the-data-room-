# Escape the Data Room!

Python을 사용해 방 안의 데이터를 정돈하고, 후보군을 좁혀 탈출 코드를 추리하는 데이터 추리형 방탈출 게임입니다.

이 프로젝트는 문법별 코딩 문제 사이트가 아니라, 짧은 수업 안에서 Python을 문제 해결 도구로 다시 꺼내 쓰게 만드는 활동형 복습 도구입니다.

## Room 구조

- Room 0: Tutorial / Analysis Basics
- Room 1: Signal Room
- Room 2: Records Room
- Room 3: Dangerous Stairs / Extra Challenge
- Ending Window: 기본 탈출 엔딩과 짧은 풀이 요약

Room 1~2는 본편 방입니다. 각 Room의 필수 퍼즐 4개를 모두 해결하면 Door Code 조각 4개가 완성됩니다. Room 2를 탈출하면 바로 엔딩을 볼 수 있고, 시간이 남으면 위험한 계단을 통해 Room 3 Extra Challenge로 진입할 수 있습니다.

## 핵심 플레이 흐름

1. 오브젝트를 조사한다.
2. Data Surface를 확인한다.
3. 필요하면 `Copy Data` 또는 `Open Python Lab`을 사용한다.
4. Python Lab에서 `Run Analysis`를 실행한다.
5. `Signal Output`을 해석해 `Unlock Code`를 입력한다.
6. 필수 퍼즐이면 `Door Code` 조각을 얻는다.
7. Door Code 조각 4개를 모아 다음 Room으로 이동한다.
8. Room 2 이후 엔딩을 보거나, 위험한 계단으로 내려가 Room 3 Extra Challenge를 진행한다.

## 실행 모드

일반 플레이:

```bat
run_app.bat
```

실제 플레이 테스트:

```bat
run_test.bat
```

시연 리허설:

```bat
run_demo.bat
```

직접 실행:

```bash
npm install
npm run dev
```

빌드 확인:

```bash
npm run build
```

스모크 테스트:

```bash
npm run test:v1
npm run test:v2
```

## 현재 구현 상태

- Room 0~4 구조
- 각 Room의 left / center / right view
- Room별 6개 퍼즐 오브젝트 + Door Keypad 구조
- Room 1~3 필수 퍼즐 4개 + 숨겨진 선택 단서 2개 metadata 적용
- Ending Window 기반 기본 탈출 엔딩
- Room 3 Dangerous Stairs 선택형 종료 흐름
- Inspect / Python Lab / Reference / Keypad / Review 공통 GameWindow
- 창 드래그, 리사이즈, z-index focus, Reset Windows
- MockPythonRunner 기반 Signal Output
- localStorage 자동 저장
- playtest mode와 demo mode 분리

실제 Pyodide/Skulpt 실행은 아직 붙이지 않았습니다. 현재 Python Lab은 학습 활동에 필요한 범위의 mock output을 반환하는 분석 도구 시뮬레이션입니다.
