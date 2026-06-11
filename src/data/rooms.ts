import type { Room, RoomObject, ViewId } from "./types";

export const roomOrder = ["room-0", "room-1", "room-2", "room-3"] as const;

const BG = "/assets/images/backgrounds";

const defaultViews: Room["views"] = [
  { id: "left",   title: "왼쪽",  description: "", placeholderTone: "cyan"   },
  { id: "center", title: "정면",  description: "", placeholderTone: "amber"  },
  { id: "right",  title: "오른쪽", description: "", placeholderTone: "violet" },
];

export const rooms: Room[] = [
  {
    id: "room-0",
    title: "Room 0",
    subtitle: "잠긴 서재",
    description: "오래된 서재에 눈을 떴다. 장비들은 파이썬 코드로만 반응한다. 변수 할당·연산·인덱싱·슬라이싱으로 4개의 코드 조각을 모아 문을 열어라.",
    views: defaultViews,
    doorCode: "852271",
    panoramaImage: `${BG}/room-0/pano.png`,
  },
  {
    id: "room-1",
    title: "Room 1",
    subtitle: "신호실",
    description: "라디오와 모니터가 가득한 신호실. 잡음 속에서 코드를 해독해야 한다. 문자열 메서드(upper·replace·split)와 조건문(if/else)으로 4개의 코드 조각을 찾아라.",
    views: defaultViews,
    doorCode: "747936",
    panoramaImage: `${BG}/room-1/pano.png`,
  },
  {
    id: "room-2",
    title: "Room 2",
    subtitle: "기록실",
    description: "방대한 데이터 기록이 쌓인 서버 아카이브. 반복문(for·while)과 딕셔너리로 데이터를 처리하여 4개의 코드 조각을 완성하라.",
    views: defaultViews,
    doorCode: "354792",
    panoramaImage: `${BG}/room-2/pano.png`,
  },
  {
    id: "room-3",
    title: "Room 3",
    subtitle: "종합 검토실",
    description: "지나온 방들의 기록이 모인 공간. 선택 퍼즐을 다시 풀고, 작성했던 코드를 되돌아보며 탈출의 의미를 확인하라.",
    views: defaultViews,
    doorCode: "1584",
  },
];

export const roomsById = Object.fromEntries(rooms.map((room) => [room.id, room])) as Record<string, Room>;

function object(
  id: string,
  roomId: string,
  viewId: ViewId,
  title: string,
  shortLabel: string,
  description: string,
  puzzleId: string,
  placeholderIcon: string,
  x: number,
  y: number,
  scale: number = 1,
  kind: RoomObject["kind"] = "puzzle",
  assetImage?: string,
  rotation?: number,
): RoomObject {
  const isOptional = description.includes("선택") || description.includes("Optional");
  return {
    id, roomId, viewId, title, shortLabel, description, puzzleId,
    placeholderIcon, assetImage, kind, x, y, scale, rotation, isOptional
  };
}

const OBJ = "/assets/images/objects";
const SHARED = `${OBJ}/shared`;

export const roomObjects: RoomObject[] = [
  // Room 0
  object("room-0-tv-sequence",  "room-0", "center", "CRT TV",         "TV",    "공백으로 이어진 단어 신호를 보여 주는 튜토리얼 화면.", "room-0-tv-sequence",  "TV",   59.3, 56.9, 2.1, "puzzle", `${OBJ}/room-0/crt-tv.png`),
  object("room-0-desk-terminal","room-0", "center", "데스크 터미널",  "TERM",  "split과 인덱싱을 가장 짧게 확인하는 잠긴 터미널.",   "room-0-desk-terminal","PC",   5.1, 56, 1.9, "puzzle", `${OBJ}/room-0/desk-terminal.png`),
  object("room-0-mini-ox-card", "room-0", "center", "OX 카드",        "OX",    "공백으로 나뉜 O와 X 신호가 적힌 종이 카드.",         "room-0-mini-ox-card", "OX",   30, 83.8, 1.3, "puzzle", `${OBJ}/room-0/mini-ox-card.png`),
  object("room-0-name-tags",    "room-0", "center", "명찰 묶음",      "NAMES", "공백으로 붙은 이름표에서 반복 이름을 찾는 명찰 묶음.", "room-0-name-tags",    "ID",   65.3, 88.4, 1.6, "puzzle", `${OBJ}/room-0/name-tags-bundle.png`),
  object("room-0-pattern-tiles","room-0", "center", "패턴 타일 박스", "TILES", "나뉜 숫자 신호 중 특정 위치를 꺼내는 타일 상자.",    "room-0-pattern-tiles","GRID", 18.5, 56.5, 1.7, "puzzle", `${OBJ}/room-0/pattern-tile-box.png`),
  object("room-0-bookshelf-note","room-0","center", "책장 쪽지",      "NOTE",  "줄 단위 기록과 슬래시 구분자를 연습하는 짧은 쪽지.",  "room-0-bookshelf-note","NT",  95.8, 47.2, 1.1, "puzzle", `${OBJ}/room-0/bookshelf-note.png`),
  object("room-0-door",         "room-0", "center", "출입문 키패드",  "DOOR",  "네 자리 코드를 기다리는 서재 문.",                    "door-room-0",         "KEY",  87.5, 50, 0.9, "door",   `${SHARED}/door-keypad.png`),

  // Room 1
  object("room-1-word-billboard","room-1","center",  "단어 전광판",    "WORDS", "다섯 글자 조각의 가운데 슬롯을 강조하는 전광판.",     "room-1-word-billboard","TXT", 50, 30, 1.5, "puzzle", `${OBJ}/room-1/word-billboard.png`),
  object("room-1-ox-monitor",   "room-1", "left",   "OX 모니터",      "OX",    "O와 X 신호 노이즈가 반복되는 모니터.",                "room-1-ox-monitor",   "OX",   40, 58.3, 1.2, "puzzle", `${OBJ}/room-1/ox-monitor.png`),
  object("room-1-number-panel", "room-1", "center", "숫자 패널",      "NUM",   "값들이 행 단위로 점멸하는 패널.",                     "room-1-number-panel", "04",   29.6, 50, 1.2, "puzzle", `${OBJ}/room-1/number-panel.png`),
  object("room-1-radio-signal", "room-1", "bottom", "라디오 장치",    "RADIO", "숨겨진 선택 주파수를 기록하는 희미한 라디오.",         "room-1-radio-signal", "RF",   75, 69.4, 2.7, "puzzle", `${OBJ}/room-1/radio-signal-device.png`),
  object("room-1-name-card",    "room-1", "left",   "명함 보드",      "NAMES", "중복 항목이 포함된 명함 보드.",                       "room-1-name-card",    "ID",   66.7, 38.4, 3.6, "puzzle", `${OBJ}/room-1/name-card-board.png`),
  object("room-1-checksum-tablet","room-1","center","노이즈 스트립",  "NOISE", "숫자 신호가 섞인 숨겨진 선택 스트립.",                "room-1-checksum-tablet","NS", 0, 19, 1.9, "puzzle", `${OBJ}/room-1/noise-strip.png`),
  object("door-room-1",         "room-1", "right",  "출입문 키패드",  "DOOR",  "네 자리 코드를 받는 신호실 출구.",                    "door-room-1",         "KEY",  83.8, 44.9, 1.0, "door",   `${SHARED}/door-keypad.png`),

  // Room 2
  object("room-2-file-cabinet", "room-2", "left",   "파일 캐비닛",    "FILES", "뒤섞인 파일 ID가 들어 있는 캐비닛.",                  "room-2-file-cabinet", "FILE", 50, 59.3, 2.6, "puzzle", `${OBJ}/room-2/file-cabinet.png`, 0),
  object("room-2-broken-tags",  "room-2", "bottom", "손상된 명찰",    "TAGS",  "정규화 후 중복 검사가 필요한 손상 명찰.",              "room-2-broken-tags",  "ID",   0, 76.9, 1.4, "puzzle", `${OBJ}/room-2/broken-name-tags.png`),
  object("room-2-score-board",  "room-2", "center", "점수 보드",      "SCORE", "의심스러운 합계가 포함된 점수 행 보드.",               "room-2-score-board",  "88",   78.2, 47.2, 2.5, "puzzle", `${OBJ}/room-2/score-board.png`),
  object("room-2-access-log",   "room-2", "left",   "접근 로그",      "LOG",   "선택 단서로 남겨진 접근 기록.",                       "room-2-access-log",   "LOG",  100, 47.7, 0.7, "puzzle", `${OBJ}/room-2/access-log-table.png`),
  object("room-2-timeline",     "room-2", "right",  "타임라인 보드",  "TIME",  "순서가 뒤섞인 이벤트 타임라인 보드.",                 "room-2-timeline",     "T",    34.3, 48.6, 2.0, "puzzle", `${OBJ}/room-2/timeline-board.png`),
  object("room-2-checksum-ledger","room-2","bottom","아카이브 쪽지",  "NOTE",  "기록 조각을 다시 확인하는 숨겨진 선택 쪽지.",          "room-2-checksum-ledger","NT", 10.2, 62, 1.2, "puzzle", `${OBJ}/room-2/archive-note.png`),
  object("door-room-2",         "room-2", "right",  "출입문 키패드",  "DOOR",  "기록실 문.",                                          "door-room-2",         "KEY",  86.1, 52.8, 0.9, "door",   `${SHARED}/door-keypad.png`),

  // Room 3 (Review Room)
  object("room-3-validator",    "room-3", "center", "Missed Clues Board",  "MISSED", "앞 방에서 놓친 선택 단서를 모아 둔 보드.",            "room-3-validator",    "MC",   29, 42, 1.2),
  object("room-3-test-log",     "room-3", "left",   "Solved Route Board",  "ROUTE",  "해결한 필수 퍼즐과 Door Code 조각을 되짚는 보드.",    "room-3-test-log",     "RT",   36, 48, 1.2),
  object("room-3-candidate-dial","room-3","center", "Play Style Summary",  "STYLE",  "사용한 Python 도구와 풀이 방식을 요약하는 콘솔.",     "room-3-candidate-dial","PS",  69, 39, 1.2),
  object("room-3-error-server", "room-3", "right",  "Saved Draft Archive", "DRAFT",  "작성했던 코드 draft를 다시 확인하는 기록 보관함.",    "room-3-error-server", "DR",   33, 57, 1.2),
  object("room-3-broken-crt",   "room-3", "left",   "Optional Signal Shelf","OPT",   "풀지 않은 선택 신호를 다시 꺼내 보는 선반.",          "room-3-broken-crt",   "OP",   70, 62, 1.2),
  object("room-3-sum-analyzer", "room-3", "center", "Final Review Console","REVIEW", "전체 풀이 흐름을 정리하는 마지막 콘솔.",              "room-3-sum-analyzer", "RV",   52, 62, 1.2),
  object("room-3-door",         "room-3", "right",  "Final Exit Door",     "EXIT",   "최종 탈출 연출을 여는 문.",                           "door-room-3",         "EX",   72, 36, 1.2, "door"),
];

export function getRoomObjects(roomId: string): RoomObject[] {
  return roomObjects.filter((roomObject) => roomObject.roomId === roomId);
}

