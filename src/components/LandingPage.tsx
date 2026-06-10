import { BarChart3, BookOpen, Play, TerminalSquare, Users } from "lucide-react";

export function LandingPage(): React.JSX.Element {
  return (
    <main className="classroom-page landing-page">
      <div className="classroom-scanlines" aria-hidden="true" />
      <section className="landing-hero">
        <span className="classroom-kicker">// ESCAPE THE DATA ROOM</span>
        <h1>ETDR 수업 세션</h1>
        <p>
          기존 파이썬 방탈출 게임을 유지하면서, 교사가 문제 세트를 선택하고 학생 풀이 로그를 확인하는
          서버 연동형 형성평가 MVP입니다.
        </p>
        <div className="landing-actions" aria-label="주요 화면 이동">
          <a className="classroom-button primary" href="#/teacher">
            <BookOpen size={18} />
            교사용 콘솔
          </a>
          <a className="classroom-button" href="#/join">
            <Users size={18} />
            학생 접속
          </a>
          <a className="classroom-button" href="#/original">
            <Play size={18} />
            기존 게임
          </a>
        </div>
      </section>

      <section className="classroom-band">
        <div className="flow-grid">
          <div className="flow-item">
            <BookOpen size={22} />
            <strong>문제 은행 선택</strong>
            <span>교과서형 파이썬 문제와 기존 게임 퍼즐을 매핑합니다.</span>
          </div>
          <div className="flow-item">
            <TerminalSquare size={22} />
            <strong>클래스 코드 입장</strong>
            <span>학생은 6자리 코드와 닉네임으로 같은 도메인에서 입장합니다.</span>
          </div>
          <div className="flow-item">
            <BarChart3 size={22} />
            <strong>분석 대시보드</strong>
            <span>풀이 성공률, 실패 횟수, 개념별 어려움을 수업 뒤 확인합니다.</span>
          </div>
        </div>
      </section>
    </main>
  );
}
