import { GraduationCap, Info, Lock, LogIn, User } from "lucide-react";
import { useState } from "react";
import { loginTeacher } from "../lib/teacherAuth";

type TeacherLoginPageProps = {
  onLogin: () => void;
};

export function TeacherLoginPage({ onLogin }: TeacherLoginPageProps): React.JSX.Element {
  const [teacherId, setTeacherId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  function handleSubmit(event: React.FormEvent): void {
    event.preventDefault();

    if (!teacherId.trim() || !password) {
      setError("아이디와 비밀번호를 입력해 주세요.");
      return;
    }

    const account = loginTeacher(teacherId, password);
    if (!account) {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      setShake(true);
      window.setTimeout(() => setShake(false), 400);
      return;
    }

    setError("");
    onLogin();
  }

  return (
    <main className="edu edu-login">
      <div className="edu-login-wrap">
        <a className="edu-login-home" href="#/">← 코드룸 홈</a>

        <form className={`edu-login-card ${shake ? "shake" : ""}`} onSubmit={handleSubmit}>
          <div className="edu-login-brand">
            <span className="edu-logo-mark" aria-hidden="true">
              <GraduationCap size={22} />
            </span>
            <div>
              <strong>코드룸 교사용 콘솔</strong>
              <span>THE CODE ROOM · Teacher Console</span>
            </div>
          </div>

          <h1>교사 로그인</h1>
          <p className="edu-login-desc">
            수업 만들기, 실시간 모니터링, 수업 기록 조회는 교사 계정으로 로그인한 뒤 이용할 수 있습니다.
          </p>

          <label className="edu-input-group">
            <span>아이디</span>
            <div className="edu-input-icon">
              <User size={16} aria-hidden="true" />
              <input
                autoComplete="username"
                autoFocus
                onChange={(e) => setTeacherId(e.currentTarget.value)}
                placeholder="교사 아이디"
                value={teacherId}
              />
            </div>
          </label>

          <label className="edu-input-group">
            <span>비밀번호</span>
            <div className="edu-input-icon">
              <Lock size={16} aria-hidden="true" />
              <input
                autoComplete="current-password"
                onChange={(e) => setPassword(e.currentTarget.value)}
                placeholder="비밀번호"
                type="password"
                value={password}
              />
            </div>
          </label>

          {error ? (
            <p className="edu-form-error" role="alert">{error}</p>
          ) : null}

          <button className="edu-btn primary block" type="submit">
            <LogIn size={17} />
            로그인
          </button>

          <div className="edu-login-hint">
            <Info size={14} aria-hidden="true" />
            <span>
              시연 환경입니다. 계정 <code>teacher</code> / <code>1234</code> 로 로그인할 수 있습니다.
            </span>
          </div>
        </form>

        <p className="edu-login-foot">
          학생이신가요? <a href="#/join">수업 코드로 입장하기</a>
        </p>
      </div>
    </main>
  );
}
