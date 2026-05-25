export type ViewId = "left" | "center" | "right" | "bottom";

export type RoomView = {
  id: ViewId;
  title: string;
  description: string;
  placeholderTone: string;
  backgroundImage?: string;
};

export type Room = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  views: RoomView[];
  doorCode: string;
  panoramaImage?: string;
};

export type RoomObjectKind = "puzzle" | "door";

export type RoomObject = {
  id: string;
  roomId: string;
  viewId: ViewId;
  title: string;
  shortLabel: string;
  description: string;
  puzzleId: string;
  placeholderIcon?: string;
  assetImage?: string;
  kind: RoomObjectKind;
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
};

export type ReferenceItem = {
  label: string;
  description: string;
};

export type RoomHint = {
  id: string;
  roomId: string;
  puzzleId: string;
  text: string;
  description: string;
  value: string;
};

export type Puzzle = {
  id: string;
  roomId: string;
  title: string;
  objectId: string;
  situationText: string;
  dataText: string;
  expectedAnswer: string;
  mockOutput?: string;
  referenceItems: ReferenceItem[];
  rewardHint: RoomHint;
  starterCode?: string;
  isRequired?: boolean;
  isHidden?: boolean;
  requiredForDoor?: boolean;
  doorCodePiece?: string;
  doorCodePosition?: number;
  targetConcepts?: string[];
  usefulConcepts?: string[];
  puzzleType?: string;
  expectedStrategyDescription?: string;
};
