# Context (First Day) — Escape the Data Room

작성일: 2026-05-25

## 프로젝트 목적 요약
- Python 기초를 한 번 배운 학습자가 방탈출(단서 분석) 흐름 안에서 Python을 다시 “도구로” 쓰게 만드는 웹 기반 복습 활동 도구.
- 퍼즐의 `Unlock Code`(오브젝트 해제)와 방의 `Door Code`(키패드 탈출)는 별개이며, 퍼즐을 풀면 Door Code 추론에 필요한 힌트를 획득.
- V1은 실제 Python 실행이 아니라 `MockPythonRunner`가 퍼즐별 mock output을 반환.

## 사용자가 요청한 핵심 이슈(오늘)
- 해제 코드가 1~2자리/찍어서 맞추기 쉬운 형태가 많아 “방탈출 느낌”이 약함 → 해제코드 형식을 3~4자리(숫자 또는 영문)로 통일 요청.
- 정답을 입력해도 안 열리는(해제 안 되는) 퍼즐이 많으니 전수 수정 요청.
- `Room 1` OX 모니터 데이터가 25×25로 보이는데 20×20으로 변경 요청.
- 지금 당장 플레이해도 문제없이 진행 가능한 상태로 안정화 요청.
- 최종적으로 GitHub 레포에 커밋/푸시, Vercel 배포 가능하도록 세팅 요청.

## 오늘 실제로 반영한 변경(코드)

### 1) 해제 코드 형식(3~4자리) 강제
- 퍼즐 해제 입력(Inspect)과 문 키패드(DoorKeypad) 모두 입력을 대문자 영문/숫자만 받도록 정리.
- 3자리 미만 입력 시 안내 메시지를 띄우고 검증을 진행하지 않도록 처리.

변경 파일:
- src/components/InspectModal.tsx
- src/components/DoorKeypad.tsx

### 2) 퍼즐 데이터 불일치/플로우 복구
- Room 1 시연 플로우가 스모크테스트(`scripts/smoke_test.mjs`)와 문서(`DEVELOPMENT_CONTEXT.md`)의 기대와 맞도록 퍼즐 데이터/출력/정답을 원복 및 정리.
- 실수로 “mock output 자체를 정답으로” 바꾸던 부분을 되돌려, `mock output → 해제코드(Unlock Code)` 흐름이 성립하도록 수정.

핵심 포인트:
- Room 1 Word Billboard: mock output은 `SIXSEVENONENINE`, 입력 해제코드는 `6719` 유지.
- Room 1 Number Panel: 입력 해제코드 `4820` 유지.
- Room 1 Door Code: `7479` 유지.

변경 파일:
- src/data/puzzles.ts

### 3) Room 0의 1자리/긴 문자열 해제코드 제거
- Room 0 퍼즐들의 해제코드를 3~4자리 규칙에 맞게 변경.
- 예) 숫자 결과를 4번 반복(`8888`, `5555`, `2222`)하거나 4글자 약어(`CIRC`, `ECHO`)로 정리.

변경 파일:
- src/data/puzzles.ts

### 4) Room 0 Door Code를 4자리로 변경
- Room 0 Door Code를 4자리로 맞춰(현재 `8528`) DoorKeypad의 3~4자리 규칙과 충돌하지 않게 조정.

변경 파일:
- src/data/rooms.ts

### 5) Room 1 OX 모니터 20×20
- `Room 1` OX 모니터 데이터(`room1OxMonitorData`)를 20줄 × 20문자 형태로 변경.

변경 파일:
- src/data/puzzles.ts

## 검증(테스트/빌드)
- `npm run build` 성공.
- `npm run test:v1` 스모크테스트 전체 PASS (Room 1 시연 플로우 포함).

## Git 상태
- 현재 워크스페이스는 git repo가 아니어서(`.git` 없음) 바로 커밋/푸시 불가.
- 다음 단계에서 `git init` → remote 연결 → 커밋/푸시 필요.

## Vercel 배포 관련
- SPA deep link 대비를 위해 `vercel.json`에 rewrite 설정 추가.
- Vercel 기본 프레임워크 감지(Vite)로 `npm run build` / `dist` 출력이 일반적으로 동작하는 구성.

추가 파일:
- vercel.json

## 다음 해야 할 일(남은 작업)
- GitHub 레포 초기화 및 원격(remote) 연결 후 커밋/푸시.
- (원하면) 퍼즐 주제를 ‘컴퓨터/체크섬’ 느낌이 덜한 일상 소재로 리라이트(데이터 처리 구조는 유지).

## 참고 문서(맥락 핵심)
- PROJECT_CONTEXT.md: 프로젝트 목표/설계 원칙
- DEVELOPMENT_CONTEXT.md: Room 1 시연 중심 설계(Unlock Code vs Door Code)
- IMPLEMENTED_SCOPE.md / KNOWN_LIMITATIONS.md
