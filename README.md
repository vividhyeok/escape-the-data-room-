# Escape the Data Room!

Python 기초 문법을 한 번 배운 학생들이 방탈출 상황 속 데이터를 해석하며 Python을 다시 꺼내 쓰도록 만드는 웹 기반 2.5D point-and-click MVP입니다.

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

## 모드 차이

`run_app.bat`는 저장된 진행 상태를 유지하는 일반 실행입니다.

`run_test.bat`는 `http://127.0.0.1:5173/?mode=test`로 접속해 새 플레이 테스트 상태로 시작합니다. Python Lab은 비어 있으며, 플레이어가 직접 코드를 쓰거나 필요할 때만 `Load Example`을 눌러 예시 접근을 불러옵니다.

`run_demo.bat`는 `http://127.0.0.1:5173/?mode=demo`로 접속해 Room 1의 Word Billboard 조사창과 Python 도구를 시연용으로 열어 둡니다. 발표자가 흐름을 빠르게 보여주기 위한 모드입니다.

## 핵심 플레이 흐름

1. Room 안의 오브젝트를 클릭한다.
2. Inspect Window에서 상황과 Clue Surface를 확인한다.
3. 데이터가 많으면 `Copy Data`로 raw data를 복사한다.
4. Python Lab을 열어 데이터를 분석한다.
5. Signal Output을 해석해 오브젝트의 Unlock Code를 입력한다.
6. 얻은 힌트를 조합해 Door Keypad의 방 코드를 입력한다.
7. Room Clear Review에서 푼 오브젝트, 놓친 오브젝트, 저장된 코드 draft를 확인한다.

## 현재 구현 상태

- Room 0~4 구조
- 각 Room의 left / center / right view
- Room별 6개 퍼즐 오브젝트 + Door Keypad 구조
- Inspect / Python Lab / Reference / Notebook / Keypad / Review 공통 GameWindow
- 창 드래그, 리사이즈, z-index focus, Reset Windows
- Room 1 발표 시연용 데이터와 오브젝트 UI
- MockPythonRunner 기반 Signal Output
- localStorage 자동 저장
- playtest mode와 demo mode 분리

실제 Pyodide/Skulpt 실행은 아직 붙이지 않았습니다. 현재 Python Lab은 학습 활동에 필요한 범위의 mock output을 반환하는 분석 도구 시뮬레이션입니다.
