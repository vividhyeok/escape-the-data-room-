import type { Room, RoomObject, ViewId } from "./types";

export const roomOrder = ["room-0", "room-1", "room-2", "room-3", "room-4"] as const;

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
    description: "변수와 기초 연산을 사용해 첫 번째 패스워드를 획득하라.",
    views: defaultViews,
    doorCode: "1333",
    panoramaImage: `${BG}/room-0/pano.png`,
  },
  {
    id: "room-1",
    title: "Room 1",
    subtitle: "보안 게이트",
    description: "조건문을 활용하여 보안망을 통과하라.",
    views: defaultViews,
    doorCode: "PASS",
    panoramaImage: `${BG}/room-1/pano.png`,
  },
  {
    id: "room-2",
    title: "Room 2",
    subtitle: "메인 서버실",
    description: "반복문(for)을 이용해 서버 오류의 횟수를 분석하라.",
    views: defaultViews,
    doorCode: "4",
    panoramaImage: `${BG}/room-2/pano.png`,
  },
  {
    id: "room-3",
    title: "Room 3",
    subtitle: "데이터 보관소",
    description: "리스트 내의 데이터를 순회하며 조건에 맞는 값을 색인하라.",
    views: defaultViews,
    doorCode: "4",
  },
  {
    id: "room-4",
    title: "Room 4",
    subtitle: "탈출구",
    description: "딕셔너리를 활용해 외계 암호를 번역하고 최종 문을 열어라.",
    views: defaultViews,
    doorCode: "7299",
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
  object("room-0-var-math",  "room-0", "center", "암호 생성기", "TERM", "변수와 연산을 학습하는 단말기", "room-0-var-math", "PC", 50, 50, 2, "puzzle", `${OBJ}/room-0/desk-terminal.png`),
  object("door-room-0",      "room-0", "right",  "출입문", "DOOR", "방을 나가는 문", "door-room-0", "KEY", 87, 50, 1, "door", `${SHARED}/door-keypad.png`),

  // Room 1
  object("room-1-if-else",   "room-1", "center", "보안 콘솔", "CONS", "조건문을 학습하는 콘솔", "room-1-if-else", "CONS", 50, 50, 2, "puzzle", `${OBJ}/room-1/ox-monitor.png`),
  object("door-room-1",      "room-1", "right",  "출입문", "DOOR", "방을 나가는 문", "door-room-1", "KEY", 87, 50, 1, "door", `${SHARED}/door-keypad.png`),

  // Room 2
  object("room-2-for-loop",  "room-2", "center", "로그 서버", "SERV", "반복문을 학습하는 서버 컴퓨터", "room-2-for-loop", "SERV", 50, 50, 2, "puzzle", `${OBJ}/room-2/file-cabinet.png`),
  object("door-room-2",      "room-2", "right",  "출입문", "DOOR", "방을 나가는 문", "door-room-2", "KEY", 87, 50, 1, "door", `${SHARED}/door-keypad.png`),

  // Room 3
  object("room-3-list-filter", "room-3", "center", "데이터 패널", "PNL", "리스트 활용을 학습하는 패널", "room-3-list-filter", "PNL", 50, 50, 2, "puzzle", `${OBJ}/room-1/number-panel.png`),
  object("door-room-3",        "room-3", "right",  "출입문", "DOOR", "방을 나가는 문", "door-room-3", "KEY", 87, 50, 1, "door", `${SHARED}/door-keypad.png`),

  // Room 4
  object("room-4-dict-cipher", "room-4", "center", "외계 석판", "STONE", "딕셔너리를 학습하는 고대 석판", "room-4-dict-cipher", "STN", 50, 50, 2, "puzzle", `${OBJ}/room-0/pattern-tile-box.png`),
  object("door-room-4",        "room-4", "right",  "최종 출입문", "DOOR", "게임을 끝내는 마지막 문", "door-room-4", "KEY", 87, 50, 1, "door", `${SHARED}/door-keypad.png`),
];

export function getRoomObjects(roomId: string): RoomObject[] {
  return roomObjects.filter((roomObject) => roomObject.roomId === roomId);
}
