import type { Room, RoomObject, ViewId } from "./types";

export const roomOrder = ["room-0", "room-1", "room-2", "room-3", "room-4"] as const;

const defaultViews: Room["views"] = [
  {
    id: "left",
    title: "왼쪽",
    description: "",
    placeholderTone: "cyan",
  },
  {
    id: "center",
    title: "정면",
    description: "",
    placeholderTone: "amber",
  },
  {
    id: "right",
    title: "오른쪽",
    description: "",
    placeholderTone: "violet",
  },
];

export const rooms: Room[] = [
  {
    id: "room-0",
    title: "Room 0",
    subtitle: "잠긴 서재",
    description: "오브젝트를 조사하고 코드를 계산해 힌트를 모은 뒤 문을 열어라.",
    views: defaultViews,
    doorCode: "8528",
  },
  {
    id: "room-1",
    title: "Room 1",
    subtitle: "신호실",
    description: "숨겨진 조건에 맞는 신호값만 선택해 Door Code를 추론하라.",
    views: defaultViews,
    doorCode: "7479",
  },
  {
    id: "room-2",
    title: "Room 2",
    subtitle: "기록실",
    description: "분산된 기록을 필터링해 일관된 코드를 찾아내라.",
    views: defaultViews,
    doorCode: "3547",
  },
  {
    id: "room-3",
    title: "Room 3",
    subtitle: "제어실",
    description: "패널과 논리 조건을 조합해 후보 코드를 좁혀라.",
    views: defaultViews,
    doorCode: "4026",
  },
  {
    id: "room-4",
    title: "Room 4",
    subtitle: "디버그실",
    description: "손상된 검증기와 로그를 디버깅해 탈출 코드를 찾아라.",
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
  kind: RoomObject["kind"] = "puzzle",
): RoomObject {
  return {
    id,
    roomId,
    viewId,
    title,
    shortLabel,
    description,
    puzzleId,
    placeholderIcon,
    kind,
    x,
    y,
  };
}

export const roomObjects: RoomObject[] = [
  object("room-0-tv-sequence", "room-0", "right", "CRT TV", "TV", "숫자 시퀀스를 반복 출력하는 튜토리얼 화면.", "room-0-tv-sequence", "TV", 24, 38),
  object("room-0-desk-terminal", "room-0", "left", "데스크 터미널", "TERM", "짧은 실행 결과를 표시하는 잠긴 터미널.", "room-0-desk-terminal", "PC", 34, 48),
  object("room-0-mini-ox-card", "room-0", "right", "OX 카드", "OX", "O와 X 기호가 교대로 적힌 종이 카드.", "room-0-mini-ox-card", "OX", 52, 57),
  object("room-0-name-tags", "room-0", "left", "명찰 묶음", "NAMES", "고무줄로 묶인 중복 명찰 묶음.", "room-0-name-tags", "ID", 70, 58),
  object("room-0-pattern-tiles", "room-0", "right", "패턴 타일 박스", "TILES", "반복 패턴이 새겨진 타일 상자.", "room-0-pattern-tiles", "GRID", 76, 42),
  object("room-0-bookshelf-note", "room-0", "center", "책장 쪽지", "NOTE", "파이썬 책 사이에 끼워진 짧은 쪽지.", "room-0-bookshelf-note", "NT", 32, 56),
  object("room-0-door", "room-0", "center", "출입문 키패드", "DOOR", "네 자리 코드를 기다리는 서재 문.", "door-room-0", "KEY", 73, 38, "door"),

  object("room-1-word-billboard", "room-1", "center", "단어 전광판", "WORDS", "다섯 글자 조각의 가운데 슬롯을 강조하는 전광판.", "room-1-word-billboard", "TXT", 30, 43),
  object("room-1-ox-monitor", "room-1", "left", "OX 모니터", "OX", "O와 X 신호 노이즈가 반복되는 모니터.", "room-1-ox-monitor", "OX", 35, 48),
  object("room-1-number-panel", "room-1", "center", "숫자 패널", "NUM", "값들이 행 단위로 점멸하는 패널.", "room-1-number-panel", "04", 68, 37),
  object("room-1-radio-signal", "room-1", "left", "라디오 장치", "RADIO", "필터링이 필요한 주파수를 기록하는 라디오.", "room-1-radio-signal", "RF", 70, 62),
  object("room-1-name-card", "room-1", "right", "명함 보드", "NAMES", "중복 항목이 포함된 명함 보드.", "room-1-name-card", "ID", 34, 55),
  object("room-1-checksum-tablet", "room-1", "right", "체크섬 태블릿", "SUM", "출구 코드의 자릿수 검사 결과를 보여주는 태블릿.", "room-1-checksum-tablet", "Σ", 55, 64),
  object("room-1-door", "room-1", "right", "출입문 키패드", "DOOR", "네 자리 코드를 받는 신호실 출구.", "door-room-1", "KEY", 74, 37, "door"),

  object("room-2-file-cabinet", "room-2", "left", "파일 캐비닛", "FILES", "뒤섞인 파일 ID가 들어 있는 캐비닛.", "room-2-file-cabinet", "FILE", 35, 48),
  object("room-2-broken-tags", "room-2", "left", "손상된 명찰", "TAGS", "정규화 후 중복 검사가 필요한 손상 명찰.", "room-2-broken-tags", "ID", 70, 58),
  object("room-2-score-board", "room-2", "center", "점수 보드", "SCORE", "의심스러운 합계가 포함된 점수 행 보드.", "room-2-score-board", "88", 69, 36),
  object("room-2-access-log", "room-2", "center", "접근 로그", "LOG", "유효·무효 행이 섞인 접근 기록.", "room-2-access-log", "LOG", 30, 52),
  object("room-2-timeline", "room-2", "right", "타임라인 보드", "TIME", "순서가 뒤섞인 이벤트 타임라인 보드.", "room-2-timeline", "T", 34, 56),
  object("room-2-checksum-ledger", "room-2", "right", "체크섬 장부", "SUM", "접근 코드를 자릿수 조건으로 요약한 장부.", "room-2-checksum-ledger", "Σ", 54, 64),
  object("room-2-door", "room-2", "right", "출입문 키패드", "DOOR", "기록실 문.", "door-room-2", "KEY", 72, 36, "door"),

  object("room-3-switch-panel", "room-3", "left", "스위치 패널", "SWITCH", "규칙을 만족해야 하는 스위치 패널.", "room-3-switch-panel", "SW", 36, 48),
  object("room-3-logic-gate", "room-3", "center", "논리 게이트 보드", "LOGIC", "참·거짓 신호를 조합하는 논리 보드.", "room-3-logic-gate", "AND", 30, 42),
  object("room-3-candidate-codes", "room-3", "right", "후보 코드 보드", "CODES", "부분 제약 조건이 달린 후보 코드 보드.", "room-3-candidate-codes", "PIN", 34, 56),
  object("room-3-warning-lamp", "room-3", "left", "경고 램프 보드", "LAMP", "그룹 패턴으로 점멸하는 경고 램프 보드.", "room-3-warning-lamp", "WARN", 70, 62),
  object("room-3-experiment", "room-3", "center", "실험 콘솔", "EXP", "샘플 출력이 기록된 실험 콘솔.", "room-3-experiment", "LAB", 69, 38),
  object("room-3-power-meter", "room-3", "right", "전력 측정기", "METER", "후보 코드의 자릿수 합을 비교하는 전력 측정기.", "room-3-power-meter", "Σ", 55, 64),
  object("room-3-door", "room-3", "right", "출입문 키패드", "DOOR", "제어실 문.", "door-room-3", "KEY", 72, 36, "door"),

  object("room-4-validator", "room-4", "center", "손상된 검증기", "VALID", "이유 불명으로 코드를 거부하는 검증기.", "room-4-validator", "VAL", 29, 42),
  object("room-4-test-log", "room-4", "left", "테스트 로그", "TEST", "패스·실패 케이스가 나열된 테스트 모니터.", "room-4-test-log", "TST", 36, 48),
  object("room-4-candidate-dial", "room-4", "center", "후보 다이얼", "DIAL", "후보 값을 순환하는 다이얼.", "room-4-candidate-dial", "DIAL", 69, 39),
  object("room-4-error-server", "room-4", "right", "에러 로그 서버", "ERROR", "에러 로그를 스트리밍하는 서버 콘솔.", "room-4-error-server", "ERR", 33, 57),
  object("room-4-broken-crt", "room-4", "left", "손상된 CRT", "CRT", "출력 조각을 반복하는 깨진 CRT.", "room-4-broken-crt", "CRT", 70, 62),
  object("room-4-sum-analyzer", "room-4", "center", "합계 분석기", "SUM", "유효 코드의 자릿수 합을 검사하는 진단 패널.", "room-4-sum-analyzer", "Σ", 52, 62),
  object("room-4-door", "room-4", "right", "출입문 키패드", "DOOR", "디버그실 마지막 출구.", "door-room-4", "KEY", 72, 36, "door"),
];

export function getRoomObjects(roomId: string): RoomObject[] {
  return roomObjects.filter((roomObject) => roomObject.roomId === roomId);
}
