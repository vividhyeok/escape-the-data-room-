# Escape the Data Room!

Python을 사용해 방 안의 데이터를 정돈하고, 후보군을 좁혀 탈출 코드를 추리하는 데이터 추리형 방탈출 게임입니다.

이 프로젝트는 문법별 코딩 문제 사이트가 아니라, 짧은 수업 안에서 Python을 문제 해결 도구로 다시 꺼내 쓰게 만드는 활동형 복습 도구입니다.

## Room 구조

- Room 0: Tutorial / Analysis Basics
- Room 1: Signal Room
- Room 2: Records Room
- Room 3: Review Room (다시 보기)
- Ending Window: 기본 탈출 엔딩과 짧은 풀이 요약

Room 1~2는 본편 방입니다. 각 Room의 필수 퍼즐 4개를 모두 해결하면 Door Code 조각 4개가 완성됩니다. Room 2를 탈출하면 바로 엔딩을 볼 수 있고, 이후 Room 3 Review Room으로 이동해 놓친 단서를 돌아볼 수 있습니다.

## 핵심 플레이 흐름 (5단계)

1. **탐색 (Explore):** 오브젝트를 조사한다.
2. **데이터 확인 (Check Data):** Data Surface를 확인한다.
3. **Python Lab 분석:** Python Lab에서 코드를 작성하고 `Run Analysis`를 실행한다.
4. **Unlock Code 입력:** 분석된 결과를 해석해 `Unlock Code`를 입력한다.
5. **Door Code 조각 획득:** 필수 퍼즐이면 `Door Code` 조각을 얻어 다음 방으로 나아간다.

## 실행 모드

일반 플레이:

```bat
run_app.bat
```

실제 플레이 테스트:

```bat
run_test.bat
```

시연 리허설:

```bat
run_demo.bat
```

직접 실행:

```bash
npm install
npm run dev
```

빌드 확인:

```bash
npm run build
```

스모크 테스트:

```bash
npm run test:v1
npm run test:v2
```

## Supabase / Vercel 설정

수업 세션, 학생 입장, 풀이 로그 저장 기능을 시연하려면 Supabase와 Vercel 환경변수가 필요합니다.

1. Supabase SQL Editor에서 `supabase/schema.sql` 내용을 실행합니다.
2. Supabase에 `class_sessions`, `student_sessions`, `attempt_logs` 테이블이 생성되었는지 확인합니다.
3. 로컬 개발용 `.env.local`에 다음 값을 입력합니다.

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=
```

4. Vercel Project Settings의 Environment Variables에도 같은 두 값을 등록합니다.
5. `VITE_SUPABASE_URL`에는 `/rest/v1`을 붙이지 않습니다. Supabase SDK가 내부에서 해당 경로를 자동으로 붙입니다.
6. 프론트엔드 환경변수에는 Supabase service role key나 secret key를 절대 넣지 않습니다.
7. `supabase/schema.sql`의 RLS policy는 발표/시연용입니다. 실제 운영용 보안 정책으로 사용하면 안 됩니다.

## 현재 구현 상태

- Room 0~3 구조 (총 4개 방)
- 각 Room의 left / center / right view
- Room별 퍼즐 오브젝트 + Door Keypad 구조
- Room 1~2 필수 퍼즐 4개 + 숨겨진 선택 단서 2개 metadata 적용
- Ending Window 기반 기본 탈출 엔딩
- Room 3 Review Room (놓친 단서 보관실) 흐름
- Inspect / Python Lab / Reference / Keypad / Review 공통 GameWindow
- 창 드래그, 리사이즈, z-index focus, Reset Windows
- Pyodide(WebAssembly) 기반 실제 Python 인터프리터 실행 (pyodideWorker)
- localStorage 자동 저장
- playtest mode와 demo mode 분리

브라우저 환경 내에서 Pyodide를 이용해 실제 파이썬 코드가 작동하도록 완벽히 구현되어 있습니다.
