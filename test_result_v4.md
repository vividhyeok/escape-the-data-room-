# test_result_v4

## 테스트 일시

2026-05-24

## 변경 범위

- Room 1 Inspect Modal을 코딩 문제 카드가 아니라 오브젝트 조사창처럼 재구성
- Word Billboard / OX Monitor / Number Panel / Name Card Board / Radio Signal Device의 데이터를 오브젝트별 clue surface로 표현
- `Problem Data`, `Answer`, `Solved` 같은 문제풀이 사이트 용어를 `Clue Surface`, `Unlock Code`, `Clue acquired`, `Access granted/denied` 중심으로 변경
- Python Lab을 optional analysis tool처럼 보이게 문구 조정
- Notebook과 Review Panel의 용어를 `Puzzle Status`에서 `Object Status`, `Clue Log`, `Door Conditions` 중심으로 변경
- Inspect Modal에서 오답 시 shake, 정답 시 clue acquired toast 흐름 유지
- smoke test 입력 selector를 새 `unlock-input` 구조에 맞게 보정

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
- Word Billboard 오브젝트 조사창 열기
- Python Lab 열기
- code draft 자동 저장
- Run Analysis 클릭 시 mock output 출력
- Unlock Code `6719` 입력 시 clue 획득
- Number Panel Unlock Code `4820` 입력 시 clue 획득
- Door Keypad 오브젝트 클릭 후 `7479` 입력
- Room Clear Review 표시
- 저장 상태 복원
- Room 0~4 view별 hotspot 구성 확인

## 남은 확인 사항

- Room 1 외 다른 Room의 Inspect Modal도 현재 generic clue surface를 사용한다.
- V5에서는 Room 0, 2, 3, 4의 주요 오브젝트도 Room 1과 같은 방식으로 오브젝트별 clue surface를 확장할 수 있다.

