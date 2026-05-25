import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Puzzle, RoomHint, ViewId } from "../data/types";
import { GAME_STORAGE_KEY, getGameStorage } from "../lib/storage";

type GameProgress = {
  currentRoomId: string;
  currentViewId: ViewId;
  solvedPuzzleIds: string[];
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
};

type GameActions = {
  setCurrentRoom: (roomId: string) => void;
  setCurrentView: (viewId: ViewId) => void;
  saveCodeDraft: (puzzleId: string, code: string) => void;
  solvePuzzle: (puzzle: Puzzle) => void;
  setDoorInput: (roomId: string, attempt: string) => void;
  recordDoorAttempt: (roomId: string, attempt: string) => void;
  clearRoom: (roomId: string) => void;
  closeReview: () => void;
  resetProgress: () => void;
  setGameState: (state: "TITLE" | "PLAYING" | "CREDITS") => void;
  setDialogue: (dialogueId: string | null) => void;
  setTextSpeed: (speed: "fast" | "normal" | "slow" | "instant") => void;
};

export type GameStore = GameProgress & GameActions;

const initialProgress: GameProgress = {
  currentRoomId: "room-0",
  currentViewId: "center",
  solvedPuzzleIds: [],
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
      setTextSpeed: (textSpeed) => set({ textSpeed }),
    }),
    {
      name: GAME_STORAGE_KEY,
      storage: createJSONStorage(getGameStorage),
      version: 3,
      partialize: (state) => ({
        currentRoomId: state.currentRoomId,
        currentViewId: state.currentViewId,
        solvedPuzzleIds: state.solvedPuzzleIds,
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
