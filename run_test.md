# run_test.md

## 목적

실제 플레이 감각을 확인하기 위한 실행 모드입니다.

이 모드에서는 시연용 starter code를 자동으로 보여주지 않습니다. 학생 입장처럼 빈 Python Lab에서 시작하고, 필요하면 `Copy Data`와 `Load Example`을 선택적으로 사용합니다.

## 실행

```bat
run_test.bat
```

브라우저에서 다음 주소로 접속합니다.

```text
http://127.0.0.1:5173/?mode=test
```

## 확인할 것

- Room 1에 정상 진입하는가
- Word Billboard 데이터가 손으로 고르기에는 충분히 많은가
- `Copy Data`가 동작하는가
- Python Lab이 기본적으로 빈 상태인가
- 사용자가 직접 코드 draft를 작성할 수 있는가
- `Run Analysis` 후 Signal Output을 보고 `6719`를 해석할 수 있는가
- Door Code `7479`로 Room 1을 클리어할 수 있는가
- 새로고침 후 진행 상태가 복원되는가

## 주의

`mode=test`는 시작 시 진행 상태와 창 위치를 초기화합니다. 저장 상태를 유지하며 이어서 플레이하려면 `run_app.bat`를 사용합니다.
