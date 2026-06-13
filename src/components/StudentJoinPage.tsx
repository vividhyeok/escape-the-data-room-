import { ArrowLeft, Joystick, Loader2, Play } from "lucide-react";
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

  async function handleJoin(event?: React.FormEvent): Promise<void> {
    event?.preventDefault();

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
      // 이 수업이 사용하는 문제집을 게임에 반영 (reset 이후에 설정해 기본값을 덮어씀)
      useGameStore.getState().setActiveProblemSetId(session.problemSetId ?? "tcr-foundation");
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
    <main className="edu edu-join">
      <div className="edu-join-wrap">
        <a className="edu-login-home" href="#/">
          <ArrowLeft size={14} aria-hidden="true" /> 코드룸 홈
        </a>

        <form className="edu-join-card" onSubmit={handleJoin}>
          <span className="edu-join-icon" aria-hidden="true">
            <Joystick size={26} />
          </span>
          <h1>수업 입장</h1>
          <p className="edu-join-desc">
            선생님이 알려준 <strong>6자리 수업 코드</strong>와 닉네임을 입력하면 게임이 시작됩니다.
          </p>

          {requireCodeNotice ? (
            <p className="edu-form-error" role="alert">
              수업 코드 입력이 필요합니다. 교사가 알려준 코드를 입력해 주세요.
            </p>
          ) : null}

          <label className="edu-input-group">
            <span>수업 코드</span>
            <input
              autoFocus
              className="edu-code-input"
              inputMode="numeric"
              maxLength={6}
              onChange={(event) => updateClassCode(event.currentTarget.value)}
              placeholder="000000"
              value={classCode}
            />
          </label>

          <label className="edu-input-group">
            <span>닉네임</span>
            <input
              maxLength={12}
              onChange={(event) => setNickname(event.currentTarget.value)}
              placeholder="예: 민준"
              value={nickname}
            />
          </label>

          {message ? (
            <p className="edu-form-error" role="alert">{message}</p>
          ) : null}

          <button className="edu-btn primary block" disabled={isJoining} type="submit">
            {isJoining ? <Loader2 className="spin" size={17} /> : <Play size={17} />}
            입장하기
          </button>

          <ul className="edu-join-notice">
            <li>입장하면 게임 타이틀 화면부터 시작됩니다.</li>
            <li>정답을 몰라도 괜찮아요. 어떤 개념이 어려운지 찾는 활동입니다.</li>
            <li>풀이 기록은 선생님 화면에만 표시됩니다.</li>
          </ul>
        </form>
      </div>
    </main>
  );
}
