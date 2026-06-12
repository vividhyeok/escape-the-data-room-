// 교수자 로그인 (시연용 간이 인증)
//
// 실제 서비스에서는 Supabase Auth 등으로 교체해야 하지만,
// 현재 환경에서는 "교사 계정으로 보호된 콘솔" 흐름을 보여주는 것이 목적이므로
// 고정 계정 + localStorage 세션으로만 동작한다.
// 이 모듈만 교체하면 나머지 화면(콘솔/모니터/리포트)은 그대로 재사용할 수 있다.

const TEACHER_AUTH_KEY = "etdr.teacherAuth";

const DEMO_TEACHER_ID = "teacher";
const DEMO_TEACHER_PW = "1234";

export type TeacherAccount = {
  id: string;
  /** 콘솔 상단 등에 표시할 이름 */
  displayName: string;
  /** 소속 표기 (시연용) */
  organization: string;
};

const DEMO_TEACHER_ACCOUNT: TeacherAccount = {
  id: DEMO_TEACHER_ID,
  displayName: "김민혁 선생님",
  organization: "SW·AI 교육캠프",
};

export function loginTeacher(id: string, password: string): TeacherAccount | null {
  if (id.trim().toLowerCase() !== DEMO_TEACHER_ID || password !== DEMO_TEACHER_PW) {
    return null;
  }

  try {
    window.localStorage.setItem(
      TEACHER_AUTH_KEY,
      JSON.stringify({ id: DEMO_TEACHER_ACCOUNT.id, loggedInAt: new Date().toISOString() }),
    );
  } catch {
    // localStorage 를 못 쓰는 환경이어도 로그인 자체는 통과시킨다 (세션 유지만 안 됨)
  }

  return DEMO_TEACHER_ACCOUNT;
}

export function getTeacherAccount(): TeacherAccount | null {
  try {
    const raw = window.localStorage.getItem(TEACHER_AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { id?: string };
    return parsed.id === DEMO_TEACHER_ID ? DEMO_TEACHER_ACCOUNT : null;
  } catch {
    return null;
  }
}

export function isTeacherLoggedIn(): boolean {
  return getTeacherAccount() !== null;
}

export function logoutTeacher(): void {
  try {
    window.localStorage.removeItem(TEACHER_AUTH_KEY);
  } catch {
    // 무시
  }
}
