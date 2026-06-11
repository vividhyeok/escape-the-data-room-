import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Puzzle, RoomHint, ViewId } from "../data/types";
import { GAME_STORAGE_KEY, getGameStorage } from "../lib/storage";

type GameProgress = {
  currentRoomId: string;
  currentViewId: ViewId;
  solvedPuzzleIds: string[];
  skippedPuzzleIds: string[];
  puzzleFailCounts: Record<string, number>;
  collectedHints: RoomHint[];
  codeDrafts: Record<string, string>;
  doorInputs: Record<string, string>;
  doorAttempts: Record<string, string[]>;
  clearedRoomIds: string[];
  reviewRoomId?: string;
  gameState: "TITLE" | "PLAYING" | "CREDITS";
  currentDialogueId: string | null;
  unlockedStories: string[];
  textSpeed: "fast" | "normal" | "slow" | "instant";
  bgmVolume: number;
  sfxVolume: number;
  isMuted: boolean;
  isDemoMode: boolean;
};

type GameActions = {
  setCurrentRoom: (roomId: string) => void;
  setCurrentView: (viewId: ViewId) => void;
  saveCodeDraft: (puzzleId: string, code: string) => void;
  solvePuzzle: (puzzle: Puzzle) => void;
  recordPuzzleFail: (puzzleId: string) => void;
  skipPuzzle: (puzzle: Puzzle) => void;
  setDoorInput: (roomId: string, attempt: string) => void;
  recordDoorAttempt: (roomId: string, attempt: string) => void;
  clearRoom: (roomId: string) => void;
  closeReview: () => void;
  resetProgress: () => void;
  setGameState: (state: "TITLE" | "PLAYING" | "CREDITS") => void;
  setDialogue: (dialogueId: string | null) => void;
  setTextSpeed: (speed: "fast" | "normal" | "slow" | "instant") => void;
  setBgmVolume: (vol: number) => void;
  setSfxVolume: (vol: number) => void;
  setIsMuted: (muted: boolean) => void;
  setDemoMode: (enabled: boolean) => void;
};

export type GameStore = GameProgress & GameActions;

const initialProgress: GameProgress = {
  currentRoomId: "room-0",
  currentViewId: "center",
  solvedPuzzleIds: [],
  skippedPuzzleIds: [],
  puzzleFailCounts: {},
  collectedHints: [],
  codeDrafts: {},
  doorInputs: {},
  doorAttempts: {},
  clearedRoomIds: [],
  reviewRoomId: undefined,
  gameState: "TITLE",
  currentDialogueId: null,
  unlockedStories: [],
  textSpeed: "normal",
  bgmVolume: 0.2,
  sfxVolume: 0.8,
  isMuted: false,
  isDemoMode: false,
};

function addUnique<T>(items: T[], item: T, predicate: (existing: T) => boolean): T[] {
  return items.some(predicate) ? items : [...items, item];
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...initialProgress,
      setCurrentRoom: (roomId) =>
        set({
          currentRoomId: roomId,
          currentViewId: "center",
          reviewRoomId: undefined,
        }),
      setCurrentView: (viewId) => set({ currentViewId: viewId }),
      saveCodeDraft: (puzzleId, code) =>
        set((state) => ({
          codeDrafts: {
            ...state.codeDrafts,
            [puzzleId]: code,
          },
        })),
      solvePuzzle: (puzzle) =>
        set((state) => ({
          solvedPuzzleIds: addUnique(state.solvedPuzzleIds, puzzle.id, (id) => id === puzzle.id),
          collectedHints: addUnique(
            state.collectedHints,
            puzzle.rewardHint,
            (existingHint) => existingHint.id === puzzle.rewardHint.id,
          ),
        })),
      recordPuzzleFail: (puzzleId) =>
        set((state) => ({
          puzzleFailCounts: {
            ...state.puzzleFailCounts,
            [puzzleId]: (state.puzzleFailCounts[puzzleId] ?? 0) + 1,
          },
        })),
      // 스킵: 못 푼 학생도 조각을 얻어 방을 통과하고 게임을 끝낼 수 있게 한다.
      // (스킵한 퍼즐은 skippedPuzzleIds 로 따로 표시해 교사 데이터에서 구분 가능)
      skipPuzzle: (puzzle) =>
        set((state) => ({
          solvedPuzzleIds: addUnique(state.solvedPuzzleIds, puzzle.id, (id) => id === puzzle.id),
          skippedPuzzleIds: addUnique(state.skippedPuzzleIds, puzzle.id, (id) => id === puzzle.id),
          collectedHints: addUnique(
            state.collectedHints,
            puzzle.rewardHint,
            (existingHint) => existingHint.id === puzzle.rewardHint.id,
          ),
        })),
      setDoorInput: (roomId, attempt) =>
        set((state) => ({
          doorInputs: {
            ...state.doorInputs,
            [roomId]: attempt,
          },
        })),
      recordDoorAttempt: (roomId, attempt) =>
        set((state) => ({
          doorAttempts: {
            ...state.doorAttempts,
            [roomId]: addUnique(state.doorAttempts[roomId] ?? [], attempt, (existingAttempt) => existingAttempt === attempt),
          },
        })),
      clearRoom: (roomId) =>
        set((state) => ({
          clearedRoomIds: addUnique(state.clearedRoomIds, roomId, (id) => id === roomId),
          reviewRoomId: roomId,
        })),
      closeReview: () => set({ reviewRoomId: undefined }),
      resetProgress: () => set(initialProgress),
      setGameState: (gameState) => set({ gameState }),
      setDialogue: (id) =>
        set((state) => {
          if (!id) return { currentDialogueId: null };
          const unlocked = new Set(state.unlockedStories);
          unlocked.add(id);
          return { currentDialogueId: id, unlockedStories: Array.from(unlocked) };
        }),
      setTextSpeed: (speed) => set({ textSpeed: speed }),
      setBgmVolume: (vol) => set({ bgmVolume: vol }),
      setSfxVolume: (vol) => set({ sfxVolume: vol }),
      setIsMuted: (muted) => set({ isMuted: muted }),
      setDemoMode: (enabled) => set({ isDemoMode: enabled }),
    }),
    {
      name: GAME_STORAGE_KEY,
      storage: createJSONStorage(getGameStorage),
      version: 3,
      partialize: (state) => ({
        currentRoomId: state.currentRoomId,
        currentViewId: state.currentViewId,
        solvedPuzzleIds: state.solvedPuzzleIds,
        skippedPuzzleIds: state.skippedPuzzleIds,
        puzzleFailCounts: state.puzzleFailCounts,
        collectedHints: state.collectedHints,
        codeDrafts: state.codeDrafts,
        doorInputs: state.doorInputs,
        doorAttempts: state.doorAttempts,
        clearedRoomIds: state.clearedRoomIds,
        reviewRoomId: state.reviewRoomId,
        gameState: state.gameState,
        currentDialogueId: state.currentDialogueId,
      }),
    },
  ),
);
