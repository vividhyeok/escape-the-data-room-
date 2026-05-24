# test_result_v2

## 테스트 일시

2026-05-24

## 변경 범위

- 중앙 Room 영역을 더 크게 강조하도록 layout 조정
- 좌측 힌트/우측 목표 패널을 대시보드형 카드에서 게임 HUD 느낌으로 변경
- Room 배경 placeholder를 어두운 방, 벽/바닥 분리, vignette, spotlight, cyan/amber glow 중심으로 개선
- 오브젝트 hotspot을 일반 버튼이 아니라 조사 가능한 물체 카드처럼 보이도록 개선
- view 전환 UI를 하단 탭에서 시야 전환 컨트롤 느낌으로 변경
- R0~R4 Room debug navigation을 접힌 dev panel로 이동
- Door Keypad 진입 버튼과 Door Modal을 자물쇠/키패드 장치처럼 보이도록 개선
- Inspect Modal, Help Modal, Python Lab에 floating terminal/window 느낌 추가
- `run_app.bat`와 README 실행/테스트 명령 갱신

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
- Word Billboard 조사창 열기
- Python Lab 열기
- code draft 자동 저장
- Run 클릭 시 mock output 출력
- 답 `6719` 입력 시 힌트 획득
- Number Panel 추가 힌트 획득
- Door Keypad 열기
- Door Code `7479` 입력
- Room 1 Clear Review 표시
- 새로고침 후 저장 상태 복원

## 남은 확인 사항

- headless smoke test는 기능 흐름 검증 중심이다.
- 실제 발표 화면에서의 시각적 인상은 브라우저로 직접 열어 16:9 화면에서 추가 확인이 필요하다.

