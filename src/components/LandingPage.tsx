import { BarChart3, BookOpen, Play, TerminalSquare, Users } from "lucide-react";

export function LandingPage(): React.JSX.Element {
  return (
    <main className="classroom-page landing-page page-enter">
      <div className="classroom-scanlines" aria-hidden="true" />
      <section className="landing-hero page-enter-item" style={{ ["--i" as string]: 0 }}>
        <span className="classroom-kicker">// ESCAPE THE DATA ROOM</span>
        <h1>ETDR 수업 세션</h1>
        <p>
          ETDR은 SW/AI 캠프나 비교과 파이썬 수업 초반에 학생들의 기초 문법 이해 수준을 짧게 진단하고,
          교사가 학생들이 실제로 어려워한 개념만 선별해 보완 설명할 수 있도록 돕는 방탈출형 게임 기반
          형성평가 도구입니다.
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

      <section className="classroom-band page-enter-item" style={{ ["--i" as string]: 1 }}>
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
