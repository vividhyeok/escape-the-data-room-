# IMPLEMENTED_SCOPE

## 현재 구현 범위

- Vite + React + TypeScript 프로젝트 구성
- Zustand + localStorage 기반 진행 상태 저장
- Room 0~4 데이터 구조
- Room별 left / center / right view 전환
- Room별 6개 퍼즐 오브젝트 + Door Keypad 구조
- Room 1~3 필수 퍼즐 4개 + 숨겨진 선택 단서 2개 metadata
- 전체 화면형 2.5D point-and-click 게임 씬
- 얇은 HUD, Notebook, Dev Menu, view arrow/dot navigation
- 클릭 가능한 hotspot object
- Inspect Window
- Python Lab Window
- Python Reference Window
- Door Keypad Window
- Notebook Window
- Room Clear Review Window
- 공통 GameWindow 시스템
- GameWindow 드래그 이동
- GameWindow 리사이즈
- z-index focus 처리
- GameWindow 위치/크기 localStorage 저장
- Dev Menu 안의 Reset Windows
- Dev Menu 안의 Demo Mode
- MockPythonRunner 구조
- puzzle별 code draft 저장
- puzzle별 mock output
- puzzle unlock code 체크
- Door Code 조각 / 숨겨진 선택 단서 수집
- Door Code 입력과 Room clear 처리
- Review Panel에서 푼 오브젝트, 놓친 오브젝트, 수집 힌트, 작성 코드 확인

## 최근 반영 사항

- 프로젝트 방향을 데이터 추리형 방탈출로 재정리
- Room 1을 필수 퍼즐 4개 + 숨겨진 선택 단서 2개 구조로 재분류
- Room 2와 Room 3도 필수 퍼즐 4개 + 숨겨진 선택 단서 2개 구조로 재분류
- 필수 퍼즐 해결 시 Door Code 조각을 지급하도록 변경
- Door Keypad에서 필수 Door Code 조각 수집 상태 표시
- 필수 Door Code 조각을 모두 모으기 전 Door Code 입력 제한
- Room 4를 Review / Missed Clues Room 방향으로 이름과 설명 변경
- Room 4에 Missed Clues / Solved Route / Play Style / Draft Archive / Final Review 창 추가
- Room 1 데이터를 손풀이보다 Python 처리가 자연스럽게 느껴지도록 확장
- Word Billboard 단어 수를 약 100개로 확대
- OX Monitor를 20줄 신호 데이터로 조정
- Number Panel을 80개 숫자 데이터로 확대
- Name Card Board를 72개 이름 카드 데이터로 확대
- Radio Signal Device를 72개 주파수 데이터로 확대
- Checksum Tablet 로그를 20줄로 확대
- Word Billboard / OX Monitor / Number Panel / Name Card Board / Radio Signal Device / Checksum Tablet의 Clue Surface를 더 불규칙하고 게임 오브젝트처럼 보이게 조정
- Inspect Window에 `Copy Data` 추가
- 실제 플레이 모드에서는 Python Lab이 빈 코드창으로 열리도록 변경
- `Load Example` 버튼을 통해 예시 접근 코드를 선택적으로 불러오는 흐름 추가
- `run_app.bat`, `run_test.bat`, `run_demo.bat` 실행 모드 분리
- `run_test.md`, `run_demo.md`, `DEVELOPMENT_CONTEXT.md` 추가

## 주요 파일

- `src/data/rooms.ts`
- `src/data/puzzles.ts`
- `src/store/gameStore.ts`
- `src/lib/pythonRunner.ts`
- `src/components/GameShell.tsx`
- `src/components/GameWindow.tsx`
- `src/components/RoomView.tsx`
- `src/components/HotspotObject.tsx`
- `src/components/InspectModal.tsx`
- `src/components/PythonLabWindow.tsx`
- `src/components/HelpModal.tsx`
- `src/components/DoorKeypad.tsx`
- `src/components/NotebookPanel.tsx`
- `src/components/ReviewPanel.tsx`
- `src/styles/global.css`

## 실행 문서

- `README.md`
- `run_test.md`
- `run_demo.md`

## 아직 구현하지 않은 것

- 실제 Pyodide/Skulpt 실행
- 최종 이미지 asset 교체
- 모바일 전용 UX 세밀화
- 교사용 대시보드
- 학습 분석 리포트
- LMS 연동
