import { useRef, useEffect, useCallback, useState } from "react";

export const useTextSelection = (
  containerRef: React.RefObject<HTMLElement>,
  textLayerRef: React.RefObject<HTMLElement>
) => {
  const copyIconRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);
  const [range, setRange] = useState<Range | null>(null);

  const handleCopy = useCallback(() => {
    if (!range) return;
    const text = range.toString();
    if (text) {
      navigator.clipboard
        .writeText(text)
        .then(() => setCopied(true))
        .catch(() => {});
    }
  }, [range]);

  const clearSelection = useCallback(() => {
    setRange(null);
    copyIconRef.current?.classList.add("hidden");
  }, []);

  useEffect(() => {
    if (copied) {
      const t = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(t);
    }
  }, [copied]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const debounce = (fn: () => void, delay: number) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(fn, delay);
    };

    const onMouseUp = () => {
      debounce(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) {
          clearSelection();
          return;
        }
        const r = sel.getRangeAt(0);
        if (textLayerRef.current?.contains(r.commonAncestorContainer)) {
          setRange(r);
          const rects = r.getClientRects();
          const last = rects[rects.length - 1];
          const cont = containerRef.current!.getBoundingClientRect();
          Object.assign(copyIconRef.current!.style, {
            top: `${last.bottom - cont.top}px`,
            left: `${last.right - cont.left + 10}px`,
            transform: "translate(0, -100%)",
          });
          copyIconRef.current!.classList.remove("hidden");
        }
      }, 0);
    };

    const onSelectionChange = () => {
      debounce(() => {
        if (!window.getSelection()?.toString()) clearSelection();
      }, 100);
    };

    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("selectionchange", onSelectionChange);
    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("selectionchange", onSelectionChange);
      clearTimeout(timeoutId);
    };
  }, [clearSelection, containerRef, textLayerRef]);

  return { copyIconRef, handleCopy, copied, range, clearSelection };
};