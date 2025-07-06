import { useEffect, useRef, useCallback } from "react";
import {
  useReadingProgressStore,
  ReadingProgress,
} from "@/stores/use-reading-progress-store";

interface UseReadingProgressOptions {
  conversationId: string;
  totalPages: number;
  bookTitle?: string;
  autoSaveInterval?: number; // in milliseconds, default 30 seconds
}

export const useReadingProgress = ({
  conversationId,
  totalPages,
  bookTitle,
  autoSaveInterval = 30000,
}: UseReadingProgressOptions) => {
  const { getProgress, addProgress, updateProgress } =
    useReadingProgressStore();

  const sessionStartTimeRef = useRef<number>(Date.now());
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isTrackingRef = useRef<boolean>(false);

  // Initialize progress tracking
  useEffect(() => {
    const existingProgress = getProgress(conversationId);

    if (!existingProgress) {
      // Create new progress entry
      const newProgress: ReadingProgress = {
        conversationId,
        currentPage: 1,
        totalPages,
        lastReadAt: new Date().toISOString(),
        readingTime: 0,
        progressPercentage: Math.round((1 / totalPages) * 100),
        bookTitle,
      };
      addProgress(newProgress);
    } else {
      // Update existing progress with new total pages if changed
      if (existingProgress.totalPages !== totalPages) {
        updateProgress(conversationId, {
          totalPages,
          progressPercentage: Math.round(
            (existingProgress.currentPage / totalPages) * 100
          ),
        });
      }
    }

    sessionStartTimeRef.current = Date.now();
    isTrackingRef.current = true;

    // Start auto-save interval
    autoSaveIntervalRef.current = setInterval(() => {
      if (isTrackingRef.current) {
        const sessionTime = Math.floor(
          (Date.now() - sessionStartTimeRef.current) / 1000
        );
        const existingProgress = getProgress(conversationId);
        if (existingProgress) {
          updateProgress(conversationId, {
            readingTime: existingProgress.readingTime + sessionTime,
          });
        }
        sessionStartTimeRef.current = Date.now();
      }
    }, autoSaveInterval);

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }

      // Save final session time when component unmounts
      if (isTrackingRef.current) {
        const sessionTime = Math.floor(
          (Date.now() - sessionStartTimeRef.current) / 1000
        );
        const existingProgress = getProgress(conversationId);
        if (existingProgress) {
          updateProgress(conversationId, {
            readingTime: existingProgress.readingTime + sessionTime,
          });
        }
      }
    };
  }, [
    conversationId,
    totalPages,
    bookTitle,
    autoSaveInterval,
    getProgress,
    addProgress,
    updateProgress,
  ]);

  // Pause tracking when page is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isTrackingRef.current = false;
        // Save current session time
        const sessionTime = Math.floor(
          (Date.now() - sessionStartTimeRef.current) / 1000
        );
        const existingProgress = getProgress(conversationId);
        if (existingProgress) {
          updateProgress(conversationId, {
            readingTime: existingProgress.readingTime + sessionTime,
          });
        }
      } else {
        isTrackingRef.current = true;
        sessionStartTimeRef.current = Date.now();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [conversationId, getProgress, updateProgress]);

  const updateCurrentPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        updateProgress(conversationId, {
          currentPage: page,
          progressPercentage: Math.round((page / totalPages) * 100),
        });
      }
    },
    [conversationId, totalPages, updateProgress]
  );

  const getCurrentProgress = useCallback(() => {
    return getProgress(conversationId);
  }, [conversationId, getProgress]);

  const formatReadingTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }, []);

  return {
    updateCurrentPage,
    getCurrentProgress,
    formatReadingTime,
  };
};
