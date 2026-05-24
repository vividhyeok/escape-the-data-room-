# plan_v5

## 작성 기준

이 계획은 V4 구현 후 다음 검증이 통과한 뒤 작성했다.

- `npm run build`
- `npm run test:v1`
- `npm run test:v2`

## V5 목표

Room 1에서 적용한 “코딩 문제처럼 보이지 않는 오브젝트 조사 경험”을 나머지 Room으로 확장한다. 동시에 Door Code 추론 구조를 발표자가 설명하기 쉽게 정리한다.

## 우선순위 1: Room별 Clue Surface 확장

- Room 0: CRT TV, Desk Terminal, OX Card, Name Tag Bundle, Pattern Tile Box를 각각 시각적 clue surface로 표현
- Room 2: File Cabinet, Broken Name Tags, Score Board, Access Log Table, Timeline Board를 기록실 오브젝트처럼 표현
- Room 3: Switch Panel, Logic Gate Board, Candidate Codes Board를 제어실 장치처럼 표현
- Room 4: Broken Validator, Test Log Monitor, Error Log Server를 디버그 장치처럼 표현

## 우선순위 2: Door Code 추론 문서화

- 각 Room의 6개 힌트를 핵심 힌트 4개와 보조 힌트 2개로 구분
- “4개 힌트만 있어도 통과 가능”한 검산 흐름 작성
- 발표자가 그대로 읽을 수 있는 Room별 설명 문장 작성

## 우선순위 3: Review Panel 설명력 강화

- Review Panel에서 획득한 clue가 Door Code 조건으로 어떻게 쓰이는지 더 명확히 표시
- 풀지 않은 오브젝트가 남아 있어도 클리어 가능했다는 메시지를 짧게 추가

## 우선순위 4: UX QA

- 16:9 발표 화면에서 Room 1 조사창이 너무 복잡하지 않은지 확인
- Room 1 Word Billboard clue surface의 단어 가독성 확인
- OX Monitor와 Number Panel의 데이터가 “문제 텍스트”가 아니라 “장치 표면”처럼 보이는지 확인

