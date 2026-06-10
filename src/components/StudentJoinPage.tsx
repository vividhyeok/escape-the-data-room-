import { Home, Loader2, Play } from "lucide-react";
import { useState } from "react";
import { resetGameWindows } from "./GameWindow";
import { useGameStore } from "../store/gameStore";
import {
  getLastClassCode,
  joinClassSession,
  saveCurrentStudentSession,
  saveLastClassCode,
} from "../lib/classroomApi";

type StudentJoinPageProps = {
  // #/play 에 세션 없이 직접 접근했을 때 "수업 코드 입력 필요" 안내를 함께 보여줍니다.
  requireCodeNotice?: boolean;
};

export function StudentJoinPage({ requireCodeNotice = false }: StudentJoinPageProps): React.JSX.Element {
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
      // 존재하지 않는 코드면 joinClassSession 이 예외를 던지므로, 성공한 경우에만 아래가 실행됩니다.
      const session = await joinClassSession(classCode, nickname);
      saveCurrentStudentSession(session);
      saveLastClassCode(classCode);

      // 이전 학생이 남긴 localStorage 진행 상태로 인해 방 내부에서 시작되는 것을 막기 위해,
      // #/play 로 이동하기 전 게임 진행 상태와 창 레이아웃을 초기화합니다.
      // (이렇게 해야 항상 타이틀/메인 배너부터 시작합니다.)
      useGameStore.getState().resetProgress();
      resetGameWindows();

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
        <h1>ETDR 수업 입장</h1>
        <p>교사가 알려준 6자리 코드를 입력하면 방탈출형 파이썬 복습 활동에 참여합니다.</p>

        {requireCodeNotice ? (
          <p className="classroom-message error">
            수업 코드 입력이 필요합니다. 아래에 교사가 알려준 6자리 코드와 닉네임을 입력해 주세요.
          </p>
        ) : null}

        <label className="classroom-field">
          <span>클래스 코드 (6자리)</span>
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
            수업 코드 확인 후 입장
          </button>
          <a className="classroom-button" href="#/">
            <Home size={18} />
            랜딩으로 돌아가기
          </a>
        </div>

        <ul className="join-notice">
          <li>입장 후 게임은 메인 화면(타이틀)에서 시작됩니다.</li>
          <li>풀이 기록은 교사용 대시보드에 저장됩니다.</li>
          <li>정답을 몰라도 괜찮습니다. 이 활동은 수업 초반에 어려운 개념을 찾기 위한 진단 활동입니다.</li>
        </ul>
      </section>
    </main>
  );
}
