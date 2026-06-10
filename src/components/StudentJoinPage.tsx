import { Home, Loader2, Play } from "lucide-react";
import { useState } from "react";
import {
  getLastClassCode,
  joinClassSession,
  saveCurrentStudentSession,
  saveLastClassCode,
} from "../lib/classroomApi";

export function StudentJoinPage(): React.JSX.Element {
  const [classCode, setClassCode] = useState(() => getLastClassCode());
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  function updateClassCode(value: string): void {
    setClassCode(value.replace(/\D/g, "").slice(0, 6));
  }

  async function handleJoin(): Promise<void> {
    if (classCode.length !== 6) {
      setMessage("6자리 수업 코드를 입력해 주세요.");
      return;
    }

    if (!nickname.trim()) {
      setMessage("닉네임을 입력해 주세요.");
      return;
    }

    setIsJoining(true);
    setMessage("");

    try {
      const session = await joinClassSession(classCode, nickname);
      saveCurrentStudentSession(session);
      saveLastClassCode(classCode);
      window.location.hash = "#/play";
    } catch (error) {
      console.warn(error);
      setMessage(error instanceof Error ? error.message : "해당 수업 코드를 찾을 수 없습니다.");
    } finally {
      setIsJoining(false);
    }
  }

  return (
    <main className="classroom-page join-page">
      <div className="classroom-scanlines" aria-hidden="true" />
      <section className="join-console">
        <span className="classroom-kicker">// STUDENT ACCESS</span>
        <h1>학생 접속</h1>
        <p>교사가 알려준 6자리 클래스 코드와 닉네임을 입력하면 기존 방탈출 게임으로 입장합니다.</p>

        <label className="classroom-field">
          <span>클래스 코드</span>
          <input
            inputMode="numeric"
            maxLength={6}
            onChange={(event) => updateClassCode(event.currentTarget.value)}
            placeholder="000000"
            value={classCode}
          />
        </label>

        <label className="classroom-field">
          <span>닉네임</span>
          <input
            onChange={(event) => setNickname(event.currentTarget.value)}
            placeholder="예: 민준"
            value={nickname}
          />
        </label>

        {message ? <p className="classroom-message error">{message}</p> : null}

        <div className="classroom-actions-row">
          <button className="classroom-button primary" disabled={isJoining} onClick={handleJoin} type="button">
            {isJoining ? <Loader2 className="spin" size={18} /> : <Play size={18} />}
            입장하기
          </button>
          <a className="classroom-button" href="#/">
            <Home size={18} />
            랜딩으로 돌아가기
          </a>
        </div>
      </section>
    </main>
  );
}
