export interface DialogueLine {
  speaker?: string;
  text: string;
}

export interface StorySequence {
  title: string;
  lines: DialogueLine[];
}

export const dialogues: Record<string, StorySequence> = {
  "intro": {
    title: "제1장: 기묘한 미궁",
    lines: [
      { speaker: "나", text: "여긴... 어디지? 분명 학교 컴퓨터실에서 잠들었던 것 같은데..." },
      { speaker: "SYSTEM", text: "[경고: 미인가 사용자 접속 감지.]" },
      { speaker: "SYSTEM", text: "[음성 프로토콜 활성화.] 야, 정신이 좀 들어?" },
      { speaker: "나", text: "누... 누구세요?" },
      { speaker: "SYSTEM", text: "나는 이 '데이터 미궁'의 시스템. 널 이곳에 초대한 장본인이지." },
      { speaker: "SYSTEM", text: "나갈 방법은 하나야. 네 코딩 실력으로 저 문들을 열고 증명해 봐." },
    ]
  },
  "tutorial-1": {
    title: "가이드: 데이터 룸 수칙 1",
    lines: [
      { speaker: "SYSTEM", text: "이곳은 오래전 방치된 데이터 룸이다. 너의 파이썬 활용 능력을 테스트할 곳이지." },
      { speaker: "SYSTEM", text: "방 안의 사물을 클릭해 단서를 수집해라." },
      { speaker: "SYSTEM", text: "혹시 파이썬 문법이 가물가물하다고? 걱정 마라." },
      { speaker: "SYSTEM", text: "하단 우측의 [Reference] 버튼을 누르면 언제든 문법 사전을 열 수 있다. 한번 열고 닫아봐라." }
    ]
  },
  "tutorial-2": {
    title: "가이드: 데이터 룸 수칙 2",
    lines: [
      { speaker: "SYSTEM", text: "좋아. 이렇게 문법 사전을 언제든 참고할 수 있다." },
      { speaker: "SYSTEM", text: "이제 방 정중앙에 있는 굳게 닫힌 문(출입문 키패드)을 클릭해봐라." }
    ]
  },
  "tutorial-3": {
    title: "가이드: 데이터 룸 수칙 3",
    lines: [
      { speaker: "SYSTEM", text: "저 문을 열기 위해선, 이 방에 있는 4개의 필수 단서를 모두 분석해서 각각의 비밀 코드를 알아내야 한다." },
      { speaker: "SYSTEM", text: "단서를 열고 하단의 [파이썬 터미널] 아이콘을 누르면 데이터를 정제할 수 있지. 직접 열어봐라." }
    ]
  },
  "tutorial-4": {
    title: "가이드: 데이터 룸 수칙 4",
    lines: [
      { speaker: "SYSTEM", text: "이곳이 Python Lab이다. 코드를 실행해 정답을 알아내고, 4자리 코드를 모아 문을 열어라." },
      { speaker: "SYSTEM", text: "코드가 꼬였다면 [되돌리기] 버튼으로 리셋해라. 자동완성 기능도 너의 코딩을 도울 거다." },
      { speaker: "SYSTEM", text: "아, 참고로 방 안을 탐색하다 보면 보라색 빛이 나는 단서들이 있을 거다." },
      { speaker: "SYSTEM", text: "그건 일종의 이스터에그 같은 선택형 문제야. 굳이 풀지 않아도 다음 방으로 넘어가는 데는 지장이 없으니 네 자유에 맡기지." },
      { speaker: "SYSTEM", text: "건투를 빈다." }
    ]
  },
  "enter-room-1": {
    title: "제2장: 신호실",
    lines: [
      { speaker: "나", text: "문이... 열렸어. 이쪽엔 라디오랑 모니터들이 잔뜩 있네." },
      { speaker: "SYSTEM", text: "잘 버텼군. 하지만 여기서부터는 레벨이 올라간다." },
      { speaker: "SYSTEM", text: "이 방은 '신호실'이야. 데이터가 그냥 숫자가 아닌 텍스트 형태로 들어온다." },
      { speaker: "나", text: "문자열... 학교에서 배웠던 메서드들이 여기서 나오는 건가?" },
      { speaker: "SYSTEM", text: "정확해. upper, replace, split — 이 세 가지를 못 다루면 신호를 해독할 수 없어. 집중해." },
    ]
  },
  "enter-room-2": {
    title: "제3장: 데이터 기록실",
    lines: [
      { speaker: "나", text: "캐비닛들이 벽면을 가득 채우고 있어. 데이터가 수도 없이 쌓여 있는 것 같은데..." },
      { speaker: "SYSTEM", text: "여기는 '기록실'이야. 수천 개의 데이터 레코드가 처리되지 않은 채 쌓여 있지." },
      { speaker: "SYSTEM", text: "반복문 없이는 데이터 하나하나를 직접 건드려야 해 — 그건 불가능에 가깝지." },
      { speaker: "나", text: "for, while... 이번엔 루프를 제대로 써야 하는 거네." },
      { speaker: "SYSTEM", text: "그것만이 아니야. 딕셔너리로 구조화된 데이터도 다뤄야 해. 이번 방이 진짜 관문이다." },
    ]
  },
  "escape-success": {
    title: "제4장: 시스템 로그아웃",
    lines: [
      { speaker: "SYSTEM", text: "[시스템 접속 해제 완료. 현실 공간으로의 게이트를 엽니다.]" },
      { speaker: "나", text: "휴... 드디어 밖으로 나갈 수 있어!" },
      { speaker: "나", text: "하지만 방금 그건 대체 뭐였지? 무사히 빠져나오긴 했지만 뭔가 찜찜해." },
      { speaker: "나", text: "그 'SYSTEM'이라는 녀석... 어쩐지 익숙한 말투였어." },
    ]
  },
  "enter-room-3": {
    title: "비밀의 장: 닫힌 문 너머",
    lines: [
      { speaker: "나", text: "잠깐, 아까 풀지 못하고 넘긴 암호들이 있었어..." },
      { speaker: "SYSTEM", text: "뭐지? 게이트가 열렸는데 왜 나가지 않는 거지?" },
      { speaker: "나", text: "이대로 도망치듯 나갈 순 없지. 네 정체가 뭔지, 이 공간의 끝에 뭐가 있는지 확인하겠어." },
      { speaker: "SYSTEM", text: "...흥, 후회하게 될 텐데. 맘대로 해봐." },
    ]
  },
  "true-ending": {
    title: "최종장: 새로운 마스터",
    lines: [
      { speaker: "SYSTEM", text: "......" },
      { speaker: "SYSTEM", text: "축하해. 이 미궁의 모든 로직을 파훼한 사람은 네가 처음이야." },
      { speaker: "나", text: "결국 모든 건 나를 테스트하기 위한 거였어?" },
      { speaker: "SYSTEM", text: "그래. 이제 이 데이터 룸의 마스터 권한은 네 거다." },
      { speaker: "SYSTEM", text: "환영해, 새로운 관리자." },
    ]
  }
};
