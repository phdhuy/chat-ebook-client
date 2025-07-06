import { useEffect, useRef } from "react";
import { useReadingProgressStore } from "@/stores/use-reading-progress-store";

interface UseRestoreReadingPositionOptions {
  conversationId: string;
  numPages: number;
  isLoading?: boolean;
  onPageRestore?: (page: number) => void;
}

export const useRestoreReadingPosition = ({
  conversationId,
  numPages,
  isLoading = false,
  onPageRestore,
}: UseRestoreReadingPositionOptions) => {
  const { getProgress } = useReadingProgressStore();
  const hasRestoredRef = useRef(false);

  useEffect(() => {
    // Wait for PDF to load and pages to be available
    if (hasRestoredRef.current || !numPages || isLoading) return;

    const progress = getProgress(conversationId);
    if (
      progress &&
      progress.currentPage > 1 &&
      progress.currentPage <= numPages
    ) {
      // Only restore if we're not on the first page and the page is valid
      onPageRestore?.(progress.currentPage);
      hasRestoredRef.current = true;
    }
  }, [conversationId, numPages, isLoading, getProgress, onPageRestore]);

  return {
    hasRestored: hasRestoredRef.current,
  };
};
