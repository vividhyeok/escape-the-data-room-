import { useEffect, useState } from "react";
import { GameShell } from "../components/GameShell";
import { LandingPage } from "../components/LandingPage";
import { ResultDashboardPage } from "../components/ResultDashboardPage";
import { StudentJoinPage } from "../components/StudentJoinPage";
import { TeacherDemoPage } from "../components/TeacherDemoPage";

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

  if (hash === "#/play" || hash === "#/original") {
    return <GameShell />;
  }

  if (hash === "#/dashboard") {
    return <ResultDashboardPage />;
  }

  return <LandingPage />;
}
