# test_result_v6

## 테스트 일시

2026-05-24

## 변경 범위

- Demo Mode 전용 window layout preset 추가
  - `setDemoLayout()` 함수 추가 (GameWindow.tsx)
  - `etdr:reload-windows` 커스텀 이벤트 추가
  - Demo Mode 활성화 시 Inspect Window(좌)와 Python Lab(우)을 viewport 크기에 맞춰 나란히 배치
- Review Panel 교육적 설명 강화
  - "모든 오브젝트를 해제하지 않아도 Door Code를 추론할 수 있다" callout 추가
  - 획득 힌트 수 / 총 퍼즐 수 표시 (e.g. `(3/6개 조건 획득)`)
  - Door Conditions 섹션에 추론 방향 안내 문구 추가
- Room 0~4 Clue Surface 확장
  - Room 0: TV Surface, Terminal Surface, Mini OX Surface, Tile Surface, Note Surface (name-tags는 기존 name-card-surface 재사용)
  - Room 2: File Log Surface, Broken Tag Surface, Score Surface, Access Log Surface, Timeline Surface (checksum-ledger는 checksum-surface 재사용)
  - Room 3: Switch Surface, Gate Surface, Code Pin Surface, Lamp Surface, Console Surface, Meter Surface
  - Room 4: Validator Surface (버그 라인 하이라이트), Dial Surface, Error Log Surface, CRT Surface (test-log/sum-analyzer는 checksum-surface 재사용)
- CSS 추가 (~480 lines): blink 애니메이션, 각 Surface 시각 스타일

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
- Word Billboard Inspect Window 열기
- Python Lab Window 동시 열기
- Demo Mode 버튼 → Inspect + Python Lab이 좌우 나란히 배치됨
- Run Analysis mock output 출력
- Unlock Code 입력 후 clue 획득
- Room Clear → Review Panel에 inference callout과 힌트 개수 표시 확인
- Room 0~4 모든 오브젝트 클릭 시 오브젝트 성격에 맞는 Clue Surface 렌더링

## 참고

Demo Mode window layout은 viewport 크기에 맞게 동적으로 계산된다(44%/42% 비율).
Clue Surface 드래그/리사이즈는 기존 GameWindow 시스템이 처리한다.
Room 4 Validator Surface의 버그 라인 하이라이트는 `== "5"` 및 `== 18 ... False` 패턴으로 탐지한다.
