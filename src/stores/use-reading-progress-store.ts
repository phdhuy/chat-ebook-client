import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";

export interface ReadingProgress {
  conversationId: string;
  currentPage: number;
  totalPages: number;
  lastReadAt: string;
  readingTime: number; // in seconds
  progressPercentage: number;
  bookTitle?: string;
}

interface ReadingProgressState {
  progressMap: Record<string, ReadingProgress>;
  addProgress: (progress: ReadingProgress) => void;
  updateProgress: (
    conversationId: string,
    updates: Partial<ReadingProgress>
  ) => void;
  getProgress: (conversationId: string) => ReadingProgress | null;
  removeProgress: (conversationId: string) => void;
  clearAllProgress: () => void;
  getRecentBooks: (limit?: number) => ReadingProgress[];
  getTotalReadingTime: () => number;
}

const readingProgressStoreCreator: StateCreator<
  ReadingProgressState,
  [],
  [["zustand/persist", ReadingProgressState]]
> = (set, get) => ({
  progressMap: {},

  addProgress: (progress: ReadingProgress) =>
    set((state) => ({
      progressMap: {
        ...state.progressMap,
        [progress.conversationId]: progress,
      },
    })),

  updateProgress: (conversationId: string, updates: Partial<ReadingProgress>) =>
    set((state) => {
      const existing = state.progressMap[conversationId];
      if (!existing) return state;

      const updatedProgress: ReadingProgress = {
        ...existing,
        ...updates,
        lastReadAt: new Date().toISOString(),
      };

      // Calculate progress percentage
      if (updates.currentPage && updates.totalPages) {
        updatedProgress.progressPercentage = Math.round(
          (updates.currentPage / updates.totalPages) * 100
        );
      }

      return {
        progressMap: {
          ...state.progressMap,
          [conversationId]: updatedProgress,
        },
      };
    }),

  getProgress: (conversationId: string) => {
    const state = get();
    return state.progressMap[conversationId] || null;
  },

  removeProgress: (conversationId: string) =>
    set((state) => {
      const newProgressMap = { ...state.progressMap };
      delete newProgressMap[conversationId];
      return { progressMap: newProgressMap };
    }),

  clearAllProgress: () => set({ progressMap: {} }),

  getRecentBooks: (limit = 5) => {
    const state = get();
    const sortedBooks = Object.values(state.progressMap)
      .sort(
        (a, b) =>
          new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime()
      )
      .slice(0, limit);
    return sortedBooks;
  },

  getTotalReadingTime: () => {
    const state = get();
    return Object.values(state.progressMap).reduce(
      (total, progress) => total + progress.readingTime,
      0
    );
  },
});

export const useReadingProgressStore = create<ReadingProgressState>()(
  persist(readingProgressStoreCreator, {
    name: "reading-progress-storage",
  })
);
