# test_result_v3

## 테스트 일시

2026-05-24

## 변경 범위

- 기본 레이아웃을 `좌측 패널 | 중앙 캔버스 | 우측 패널` 구조에서 `Game Scene + HUD + Floating Windows` 구조로 변경
- 좌우 고정 패널 제거
- Hint/Inventory/Progress 확인을 `Notebook` floating panel로 이동
- Room jump는 기본 노출하지 않고 `Dev` 메뉴 안으로 이동
- `Demo Mode`를 Dev 메뉴에 추가
- 시야 전환을 LEFT/CENTER/RIGHT 탭에서 화면 좌우 edge 버튼과 dot indicator로 변경
- Hotspot을 버튼이 아니라 조사 가능한 오브젝트처럼 보이도록 개선
- Inspect Modal을 좌측 오브젝트 preview + 우측 데이터 조사창 구조로 변경
- hint acquired toast, wrong answer shake, modal scale-in, view fade 등 경량 피드백 추가
- Room 0~4에 6번째 퍼즐 오브젝트 추가
- 각 방을 6개 단서 퍼즐 + Door Keypad 구조로 확장
- 새 퍼즐 힌트는 Door Code 추론용 보조 조건으로 설계
- smoke test에 Room 0~4 view별 hotspot 구조 검증 추가

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

## 자동 확인된 항목

- Room 1 기본 시연 흐름 유지
- Word Billboard 조사, Python Lab, mock output, answer check, hint 획득
- Door Keypad 방 안 오브젝트 클릭 방식으로 진입
- Door Code `7479`로 Room 1 클리어
- Review Panel 저장 상태 복원
- Room 0~4 이동 가능
- 각 Room의 center / left / right view별 hotspot 구성 확인
- 각 Room이 6개 퍼즐 오브젝트 + Door Keypad 구조를 가짐

## 참고

V3 smoke test는 기능과 DOM 구조 중심 검증이다. 실제 발표 화면의 인상은 `run_app.bat` 실행 후 16:9 화면에서 육안 확인이 필요하다.

