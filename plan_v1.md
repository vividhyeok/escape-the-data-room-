# plan_v1

## 목표

`Escape the Data Room!`의 발표 가능한 V1 MVP를 구현한다. 최종 이미지는 넣지 않고, Room 1 중심으로 실제 플레이 가능한 흐름을 완성한다.

## 구현 범위

- Vite + React + TypeScript 프로젝트 구성
- Room 0~4 데이터 구조 생성
- Room별 left / center / right view 전환
- Room별 오브젝트 6개 구조 유지
- Room 1의 실제 퍼즐 5개와 Door Code `7479` 구현
- Inspect Modal, Help Modal, Python Lab, Door Keypad, Hint Panel, Review Panel 구현
- 교체 가능한 `PythonRunner` 인터페이스와 `MockPythonRunner` 구현
- localStorage 자동 저장 구현
- README, 구현 범위 문서, 플레이테스트 체크리스트, 한계 문서 작성

## 개발 순서

1. 프로젝트 뼈대와 의존성 구성
2. Room, Object, Puzzle, Hint, PythonRunner 타입 정의
3. Room 1 데이터를 요구사항 기준으로 입력
4. Room 0, 2, 3, 4 placeholder 구조 확장
5. Zustand 기반 진행 상태 저장소 구현
6. 게임 UI와 모달 컴포넌트 구현
7. 어두운 tech-noir placeholder 스타일 적용
8. 빌드 및 실행 확인
9. 테스트 결과를 `test_result_v1.md`에 기록
10. 테스트 완료 후 `plan_v2.md` 작성

