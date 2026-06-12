import {
  ArrowRight,
  BarChart3,
  GraduationCap,
  Joystick,
  KeyRound,
  LineChart,
  MonitorPlay,
  Users,
} from "lucide-react";

export function LandingPage(): React.JSX.Element {
  return (
    <main className="edu edu-landing">
      <header className="edu-topbar">
        <a className="edu-brand" href="#/">
          <span className="edu-logo-mark" aria-hidden="true">
            <GraduationCap size={18} />
          </span>
          <span className="edu-brand-text">
            <strong>THE CODE ROOM</strong>
            <span>게임 기반 파이썬 진단 도구</span>
          </span>
        </a>
        <div className="edu-topbar-right">
          <a className="edu-btn subtle" href="#/join">학생 입장</a>
          <a className="edu-btn primary" href="#/teacher">교사 로그인</a>
        </div>
      </header>

      <section className="edu-hero">
        <span className="edu-hero-badge">방탈출 게임 × 형성평가</span>
        <h1>
          학생은 게임으로 풀고,
          <br />
          교사는 데이터로 봅니다
        </h1>
        <p>
          코드룸은 SW·AI 캠프와 파이썬 수업 초반에 쓰는 게임 기반 진단 도구입니다.
          학생들이 방탈출 게임 속에서 파이썬 문제를 푸는 동안, 교사는 풀이 기록으로
          반 전체가 실제로 어려워하는 개념을 찾아 보완 설명할 수 있습니다.
        </p>
      </section>

      <section className="edu-role-grid" aria-label="시작하기">
        <a className="edu-role-card student" href="#/join">
          <span className="edu-role-icon" aria-hidden="true">
            <Joystick size={24} />
          </span>
          <strong>학생으로 참여하기</strong>
          <span className="edu-role-desc">
            선생님이 알려준 6자리 수업 코드와 닉네임만 있으면 바로 시작할 수 있어요. 설치와 회원가입이
            필요 없습니다.
          </span>
          <span className="edu-role-cta">
            수업 코드로 입장 <ArrowRight size={15} aria-hidden="true" />
          </span>
        </a>

        <a className="edu-role-card teacher" href="#/teacher">
          <span className="edu-role-icon" aria-hidden="true">
            <MonitorPlay size={24} />
          </span>
          <strong>교사로 시작하기</strong>
          <span className="edu-role-desc">
            문제집을 골라 수업 코드를 발급하고, 실시간 진행 현황과 수업이 끝난 뒤의 결과 리포트를
            확인합니다.
          </span>
          <span className="edu-role-cta">
            교사용 콘솔 열기 <ArrowRight size={15} aria-hidden="true" />
          </span>
        </a>
      </section>

      <section className="edu-flow" aria-label="수업 흐름">
        <h2>10분이면 수업 준비가 끝납니다</h2>
        <div className="edu-flow-grid">
          <div className="edu-flow-item">
            <span className="edu-flow-num">1</span>
            <KeyRound size={20} aria-hidden="true" />
            <strong>수업 코드 발급</strong>
            <span>문제집을 고르면 6자리 수업 코드가 만들어집니다.</span>
          </div>
          <div className="edu-flow-item">
            <span className="edu-flow-num">2</span>
            <Users size={20} aria-hidden="true" />
            <strong>학생 입장 · 플레이</strong>
            <span>학생은 코드와 닉네임으로 입장해 방탈출 게임을 진행합니다.</span>
          </div>
          <div className="edu-flow-item">
            <span className="edu-flow-num">3</span>
            <BarChart3 size={20} aria-hidden="true" />
            <strong>실시간 모니터링</strong>
            <span>문제별 진행 상황과 도움이 필요한 학생을 한눈에 봅니다.</span>
          </div>
          <div className="edu-flow-item">
            <span className="edu-flow-num">4</span>
            <LineChart size={20} aria-hidden="true" />
            <strong>결과 리포트</strong>
            <span>개념별 성취도와 보완 추천으로 다음 수업을 설계합니다.</span>
          </div>
        </div>
      </section>

      <footer className="edu-footer">
        <span>THE CODE ROOM · 게임 기반 파이썬 형성평가 도구 (캡스톤 연구 시제품)</span>
        <a href="#/original">수업 코드 없이 게임만 체험하기 →</a>
      </footer>
    </main>
  );
}
