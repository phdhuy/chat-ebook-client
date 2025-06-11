import { useState, useCallback } from "react";

export const useFullscreen = (ref: React.RefObject<HTMLElement>) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      ref.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, [ref]);

  return { isFullscreen, toggleFullscreen };
};