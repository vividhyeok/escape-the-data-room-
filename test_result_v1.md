# test_result_v1

## 테스트 일시

2026-05-24

## 실행한 명령

```bash
npm run build
npm run test:v1
```

## 결과

- `npm run build`: 통과
- `npm run test:v1`: 통과

## V1 Smoke Test 확인 항목

- Room 1 진입 확인
- Room 1 오브젝트 렌더링 확인
- Word Billboard 조사창 열기 확인
- Python Lab 열기 확인
- 코드 draft 자동 저장 확인
- Run 버튼 클릭 시 mock output `SIXSEVENONENINE` 출력 확인
- 답 `6719` 입력 시 힌트 `CD - AB = 5다.` 획득 확인
- Number Panel 답 `4820` 입력 시 두 번째 힌트 획득 확인
- Door Keypad 열기 확인
- Door code attempt `7479` 자동 저장 확인
- Door Code `7479` 입력 시 Room 1 클리어 확인
- Review Panel에서 풀지 않은 퍼즐 확인
- 새로고침 후 저장 상태 복원 확인
- 브라우저 런타임 오류 없음 확인

## 비고

테스트는 `scripts/smoke_test.mjs`에서 Vite 서버를 임시로 띄운 뒤, headless Edge/Chrome을 CDP로 조작하는 방식으로 수행했다.

