# test_result_v5

## 테스트 일시

2026-05-24

## 변경 범위

- 공통 `GameWindow` 컴포넌트 추가
- Inspect / Python Lab / Reference / Door Keypad / Notebook / Review를 공통 게임 창 시스템으로 통합
- 각 창에 title bar, close button, resize handle 추가
- title bar 드래그 이동 구현
- 오른쪽 아래 handle 리사이즈 구현
- 클릭한 창이 앞으로 올라오는 z-index focus 구현
- 창 위치와 크기를 localStorage에 저장
- viewport 밖으로 창이 완전히 나가지 않도록 clamp 처리
- Dev 메뉴에 `Reset Windows` 추가
- Demo Mode에서 Room 1 Word Billboard Inspect Window와 Python Tool을 함께 열도록 변경
- Python Lab 문구를 `Run Analysis`, `Signal Output`, `Saved draft` 중심으로 유지

## 실행한 명령

```bash
npm run build
npm run test:v1
npm run test:v2
```

## 결과

- `npm run build`: 통과
- `npm run test:v1`: 통과
- `npm run test:v2`: 통과

## 확인된 핵심 플로우

- Room 1 진입
- Inspect Window 열기
- Python Tool Window 동시 열기
- code draft 자동 저장
- Run Analysis mock output 출력
- Unlock Code 입력 후 clue 획득
- Door Keypad Window 열기
- Room Clear Review Window 표시
- 새로고침 후 저장 상태 복원
- Room 0~4 view별 hotspot 구성 확인

## 참고

자동 테스트는 창 생성과 기존 기능 흐름을 검증한다. 드래그/리사이즈는 구현되어 있으며, 발표 화면에서 실제 마우스로 조작하는 육안 QA가 필요하다.

