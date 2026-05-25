# run_demo.md

## 목적

발표와 시연 리허설을 위한 실행 모드입니다.

이 모드에서는 Room 1의 Word Billboard 조사창과 Python Lab이 바로 열리고, Word Billboard의 예시 접근 코드가 draft로 저장된 상태가 됩니다. 실제 학생 플레이용이 아니라 발표자가 구조를 빠르게 보여주기 위한 모드입니다.

## 실행

```bat
run_demo.bat
```

브라우저에서 다음 주소로 접속합니다.

```text
http://127.0.0.1:5173/?mode=demo
```

## 시연 흐름

1. Room 1 Signal Room이 열린다.
2. Word Billboard Inspect Window와 Python Lab Window가 떠 있다.
3. 전광판의 단어가 많아 손으로 필터링하기 번거로운 점을 설명한다.
4. Python Lab에서 `Run Analysis`를 눌러 `SIXSEVENONENINE`을 확인한다.
5. 이를 `SIX SEVEN ONE NINE`으로 해석해 `6719`를 입력한다.
6. Door Code 1번째 조각 `7`을 획득한다.
7. 나머지 필수 퍼즐의 Door Code 조각을 모아 Door Keypad에 `7479`를 입력한다.
8. 숨겨진 선택 단서는 필수 진행과 분리되어 있음을 보여준다.

## 주의

Demo Mode는 빠른 발표를 위한 보조 장치입니다. 실제 플레이성 검증은 `run_test.bat`로 진행합니다.
