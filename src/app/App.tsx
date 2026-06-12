import { useEffect, useState } from "react";
import { GameShell } from "../components/GameShell";
import { FinalResultsPage } from "../components/FinalResultsPage";
import { LandingPage } from "../components/LandingPage";
import { ResultDashboardPage } from "../components/ResultDashboardPage";
import { StudentJoinPage } from "../components/StudentJoinPage";
import { TeacherConsolePage } from "../components/TeacherConsolePage";
import { TeacherLoginPage } from "../components/TeacherLoginPage";
import { getCurrentStudentSession } from "../lib/classroomApi";
import { isTeacherLoggedIn } from "../lib/teacherAuth";
import { SoundEngine } from "../utils/SoundEngine";

function getCurrentHash(): string {
  return window.location.hash || "#/";
}

// 게임 오디오(BGM·루프 효과음)가 허용되는 라우트.
// 그 외 화면(랜딩/학생 입장/교사 콘솔·모니터·리포트)에서는 어떤 게임 사운드도 들리면 안 된다.
const GAME_AUDIO_ROUTES = new Set(["#/play", "#/original"]);

export function App(): React.JSX.Element {
  const [hash, setHash] = useState(getCurrentHash);
  // 로그인/로그아웃 직후 같은 해시에서 화면을 갱신하기 위한 트리거
  const [authVersion, setAuthVersion] = useState(0);

  useEffect(() => {
    const handleHashChange = () => setHash(getCurrentHash());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // 게임 라우트를 벗어나면 루프 중인 게임 오디오를 즉시 정지한다.
  // (해시 라우팅은 페이지 리로드가 없어 GameShell 이 unmount 되어도 Audio 싱글톤은 계속 재생되기 때문)
  useEffect(() => {
    if (!GAME_AUDIO_ROUTES.has(hash)) {
      SoundEngine.stopBGM();
      SoundEngine.stopBreathing();
    }
  }, [hash]);

  const handleAuthChange = () => setAuthVersion((v) => v + 1);

  // 교사용 화면(콘솔/모니터/리포트)은 교사 로그인 뒤에만 열린다.
  const teacherRoutes: Record<string, () => React.JSX.Element> = {
    "#/teacher": () => <TeacherConsolePage onLogout={handleAuthChange} />,
    "#/dashboard": () => <ResultDashboardPage />,
    "#/results": () => <FinalResultsPage />,
  };

  const teacherRoute = teacherRoutes[hash];
  if (teacherRoute) {
    if (!isTeacherLoggedIn()) {
      return <TeacherLoginPage key={authVersion} onLogin={handleAuthChange} />;
    }
    return teacherRoute();
  }

  if (hash === "#/join") {
    return <StudentJoinPage />;
  }

  // #/original 은 수업 세션 없이도 기존 방탈출 게임을 열 수 있습니다(교사 미리보기 등).
  if (hash === "#/original") {
    return <GameShell />;
  }

  // #/play 는 학생 수업 활동 진입점입니다.
  // 수업 코드로 정상 입장한 학생 세션이 없으면 게임을 열지 않고 입장 화면을 보여줍니다.
  if (hash === "#/play") {
    if (getCurrentStudentSession()) {
      return <GameShell />;
    }
    return <StudentJoinPage requireCodeNotice />;
  }

  return <LandingPage />;
}
