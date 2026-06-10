import { useEffect, useState } from "react";
import { GameShell } from "../components/GameShell";
import { LandingPage } from "../components/LandingPage";
import { ResultDashboardPage } from "../components/ResultDashboardPage";
import { StudentJoinPage } from "../components/StudentJoinPage";
import { TeacherDemoPage } from "../components/TeacherDemoPage";
import { getCurrentStudentSession } from "../lib/classroomApi";

function getCurrentHash(): string {
  return window.location.hash || "#/";
}

export function App(): React.JSX.Element {
  const [hash, setHash] = useState(getCurrentHash);

  useEffect(() => {
    const handleHashChange = () => setHash(getCurrentHash());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  if (hash === "#/teacher") {
    return <TeacherDemoPage />;
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

  if (hash === "#/dashboard") {
    return <ResultDashboardPage />;
  }

  return <LandingPage />;
}
