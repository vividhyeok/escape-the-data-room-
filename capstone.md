# ETDR — Escape The Data Room
## 캡스톤 발표 자료 · 개발 세부 사항

---

## 1. 프로젝트 개요

**ETDR(Escape The Data Room)** 은 중학생이 파이썬 기초 문법을 게임을 통해 자연스럽게 익힐 수 있도록 설계된 **브라우저 기반 방탈출 코딩 게임**이다.

| 항목 | 내용 |
|------|------|
| 목적 | 파이썬 입문 특강 사전 학습 / 보조 실습 도구 |
| 대상 | 중학생 (파이썬 완전 입문자) |
| 플랫폼 | 웹 브라우저 (설치 불필요) |
| 언어 | 한국어 |
| 플레이 시간 | 약 30~60분 (4개 방) |

---

## 2. 게임 구조 · 학습 목표

### 방 진행 순서

```
Room 0 (잠긴 서재)
  → Room 1 (신호실)
    → Room 2 (기록실)
      → Room 3 (종합 검토실)
        → 엔딩 / 크레딧
```

### 방별 학습 내용

| 방 | 부제 | 핵심 문법 | 문 코드 |
|----|------|-----------|---------|
| Room 0 | 잠긴 서재 | 변수 할당, 사칙연산, 인덱싱, 슬라이싱 | `8522` |
| Room 1 | 신호실 | `.upper()`, `.replace()`, `.split()`, `if/else` | `7479` |
| Room 2 | 기록실 | `for` 반복문, 리스트 필터링, 딕셔너리, `while` | `3547` |
| Room 3 | 종합 검토실 | 풀이 복습 + 역방향 슬라이싱 보너스 | `1584` |

### 퍼즐 구성 (총 19개)

- **필수 퍼즐**: 각 방 4개 × 3방 = 12개 (문 코드 조각 획득)
- **선택 퍼즐**: 각 방 2개 × 3방 + Room3 1개 = 7개 (보너스 힌트)
- 선택 퍼즐은 숨겨진 오브젝트로 배치, 호기심 있는 학생이 추가 탐험 가능

---

## 3. 기술 스택

### 프론트엔드 프레임워크

| 기술 | 버전 | 용도 |
|------|------|------|
| React | 19 | UI 컴포넌트 |
| TypeScript | 5 | 타입 안전성 |
| Vite | 6 | 빌드 도구 |
| Zustand | 5 | 전역 상태 관리 (localStorage 영속화) |

### 핵심 라이브러리

| 라이브러리 | 용도 |
|-----------|------|
| **Pyodide** | 브라우저 내 Python 3 실행 (WebAssembly) |
| **Web Worker** | Python 실행을 메인 스레드와 분리, UI 블로킹 방지 |
| **CodeMirror 6** | 파이썬 코드 에디터 (문법 강조, 자동 완성, 괄호 매칭) |
| **Three.js** | 3D 파노라마 방 뷰 (원기둥 렌더링) |
| **Lucide React** | UI 아이콘 |

### Python 실행 아키텍처

```
[코드 에디터 (CodeMirror)]
        ↓ 코드 문자열 전달
[Web Worker (pyodideWorker.ts)]
        ↓ Pyodide 로드 (WebAssembly)
  [Python AST 분석] → requiredSyntax 검사
  [테스트 케이스 실행] → 기대값과 비교
        ↓ 결과 반환
[InspectModal / PythonLabWindow]
        ↓ 성공 시
[Zustand 상태 업데이트] → solvePuzzle()
```

---

## 4. 주요 개발 내용

### 4-1. Python 코드 실행 + AST 검사

학생이 작성한 코드를 브라우저 안에서 직접 실행한다.  
단순히 답이 맞는지 확인하는 것 외에, **파이썬 문법을 올바르게 사용했는지** AST(추상 구문 트리)로 검사한다.

```python
# Pyodide 내부에서 실행되는 AST 방문자
class SyntaxCollector(ast.NodeVisitor):
    def visit_Call(self, node):
        if isinstance(node.func, ast.Name):
            self.funcs.append(node.func.id)          # len(), sum() 등
        elif isinstance(node.func, ast.Attribute):
            self.funcs.append(node.func.attr)         # .upper(), .split() 등
        self.generic_visit(node)
```

예: `requiredSyntax: ["For"]` 가 설정된 퍼즐은 for문 없이 `sum()` 만 써서 풀 수 없다.  
`bannedSyntax: ["sum"]` 이 설정된 퍼즐은 `sum()` 사용 시 오답 처리된다.

### 4-2. 3D 파노라마 방 시스템

Three.js로 배경 이미지를 원기둥(Cylinder) 안쪽에 렌더링해 **360° 탐험** 효과를 구현했다.  
플레이어는 마우스 드래그로 좌·우·아래 방향을 탐색하며 오브젝트를 발견한다.

```
배경 이미지(1536×1024px) → Three.js Cylinder Geometry
→ 내면에 텍스처 매핑 → 카메라 회전으로 뷰 전환
```

### 4-3. 드래그 가능한 게임 윈도우 시스템

퍼즐 화면, 코드 에디터, 참고 자료, 도어 키패드가 모두 **드래그·리사이즈 가능한 플로팅 윈도우**로 구현됐다.  
학생이 문제와 코드를 동시에 보면서 풀 수 있도록 멀티윈도우 레이아웃을 지원한다.

### 4-4. 긴장감 연출 시스템

- 15초 이상 조작 없으면 **심박음 + 호흡 사운드** 재생, 화면 비네트(vignette) 효과 강화
- 오답 시 **긴장 버스트** 효과 (짧은 충격음 + 화면 떨림)
- 방 클리어 시 **도어 오픈 사운드** + 화면 플래시 전환

### 4-5. 튜토리얼 + 대화 시스템

게임 시작 후 Room 0에서 순차적으로 튜토리얼 대화가 진행된다.

| 튜토리얼 | 트리거 |
|----------|--------|
| tutorial-1 | 인트로 대화 종료 후 자동 |
| tutorial-2 | 참고자료(Help) 창 첫 오픈 시 |
| tutorial-3 | 출입문 키패드 첫 클릭 시 |
| tutorial-4 | Python Lab 첫 오픈 시 |

### 4-6. 진행 상태 영속화

Zustand + localStorage로 브라우저를 닫아도 **풀이 기록이 저장**된다.  
- 해결한 퍼즐 ID 목록, 작성한 코드 초안, 도어 코드 입력값, 획득한 힌트 등을 저장
- URL 파라미터로 초기화: `?mode=test` (리셋), `?mode=demo` (시연 모드)

---

## 5. 퍼즐 설계 원칙

1. **맥락 있는 상황 설명**: 단순 문제가 아닌 서사(세계관) 안에서 코딩 이유를 제시
2. **단계적 난이도**: Room 0(변수/연산) → Room 1(메서드/조건문) → Room 2(반복/자료구조)
3. **즉각 피드백**: 코드 실행 후 바로 정답/오답 결과와 실제 출력값 표시
4. **스타터 코드 제공**: `___` 빈칸 채우기 방식으로 진입 장벽 최소화
5. **참고자료 내장**: 각 퍼즐에 메서드·문법 레퍼런스 카드 내장

---

## 6. 시연 흐름 (Demo Mode)

URL에 `?mode=demo` 추가하거나 Dev 패널의 **데모 버튼** 클릭 시 시연 모드 활성화.

```
시연 모드 진입
  → 모든 퍼즐의 정답 코드가 자동 입력됨
  → Room 0~2가 클리어된 상태로 시작
  → Room 0부터 오브젝트 클릭 → 퍼즐 확인 → 코드 실행 → 통과
  → 문 키패드에 코드 자동 입력됨
  → Room 1 → Room 2 → Room 3 순서로 이동
  → Room 3 최종 문 통과 → 엔딩 크레딧
```

**시연 포인트 예시**
- Room 0 · 패턴 타일: `answer = data` (변수 할당)
- Room 1 · 단어 전광판: `answer = data.upper()` (메서드 호출)
- Room 2 · 파일 캐비닛: `for x in data: total = total + x` (반복문 + 누적)
- Room 2 · 점수 보드: `answer = data['score']` (딕셔너리 접근)

---

## 7. 폴더 구조

```
ETDR/
├── src/
│   ├── components/         # React 컴포넌트
│   │   ├── GameShell.tsx   # 메인 게임 컨테이너 + 데모 모드
│   │   ├── InspectModal.tsx# 퍼즐 열람 + 코드 에디터
│   │   ├── RoomView.tsx    # Three.js 파노라마 뷰
│   │   ├── DoorKeypad.tsx  # 도어 코드 입력 키패드
│   │   ├── ReviewPanel.tsx # 방 클리어 리뷰 패널
│   │   └── ...
│   ├── data/
│   │   ├── puzzles.ts      # 전체 19개 퍼즐 정의
│   │   ├── rooms.ts        # 방·오브젝트 배치 정의
│   │   └── types.ts        # TypeScript 타입 정의
│   ├── store/
│   │   └── gameStore.ts    # Zustand 전역 상태
│   ├── lib/
│   │   └── pyodideWorker.ts# Web Worker: Python 실행 + AST 검사
│   └── utils/
│       └── SoundEngine.ts  # Web Audio API 사운드 관리
├── public/
│   └── assets/
│       ├── audio/          # BGM, SFX 파일
│       └── images/         # 배경·오브젝트 이미지
├── scripts/
│   └── generate_assets.mjs # OpenAI API 이미지 자동 생성 스크립트
└── howto.md                # 오브젝트 배치 가이드
```

---

## 8. 개발 환경

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 이미지 자동 생성 (OpenAI API 필요)
node scripts/generate_assets.mjs
```

| 항목 | 버전 |
|------|------|
| Node.js | 20+ |
| npm | 10+ |
| TypeScript | 5.x |
| Vite | 6.x |

---

## 9. 학습 효과 검증 설계

- **즉각 피드백**: 코드 실행 즉시 정답/오답 판정 → 시행착오 학습
- **AST 문법 검사**: 정답이 맞아도 지정 문법 미사용 시 재도전 유도
- **힌트 시스템**: 선택 퍼즐 클리어 시 추가 개념 힌트 수집 (인벤토리 `I` 키)
- **코드 초안 저장**: 중간에 나갔다가 다시 와도 작성 코드 유지
- **Room 3 리뷰**: 이전 방에서 풀었던 퍼즐과 코드를 다시 확인하는 복습 공간

---

## 10. 향후 발전 방향

- 함수 정의 (`def`) / 클래스 / 파일 입출력 등 고급 문법 추가 (Room 4~5)
- 멀티플레이어 모드 (실시간 코드 비교)
- 교사용 관리 페이지 (학생별 풀이 기록 조회)
- 문제 에디터 (교사가 직접 퍼즐 생성)
- 영어 버전 추가

---

*개발: 김민혁 · 2026*
