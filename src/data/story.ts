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
  "enter-room-1": {
    title: "제2장: 실전 데이터",
    lines: [
      { speaker: "SYSTEM", text: "튜토리얼은 끝났어. 이제부터 진짜 실전 데이터들이 쏟아질 거야." },
      { speaker: "나", text: "방금 그 파이썬 문제들... 학교에서 배운 거랑 비슷하긴 한데." },
      { speaker: "SYSTEM", text: "학교에서 배우는 뻔한 예제랑은 차원이 다를걸? 방심하면 영영 갇히게 될 테니 집중해." },
    ]
  },
  "enter-room-2": {
    title: "제3장: 버려진 아카이브",
    lines: [
      { speaker: "나", text: "캐비닛에 먼지가 가득해... 여긴 대체 뭐야?" },
      { speaker: "SYSTEM", text: "제법인데? 하지만 이번 방은 온갖 찌꺼기 데이터가 굴러다니는 '아카이브'야." },
      { speaker: "SYSTEM", text: "아무리 코드를 잘 짜도, 데이터가 쓰레기면 결과도 쓰레기지(GIGO)." },
      { speaker: "SYSTEM", text: "더러운 데이터를 정제(Cleaning)하지 못하면 문은 절대 열리지 않아." },
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
