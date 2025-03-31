import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Bookmark,
  Home,
} from "lucide-react";

interface PdfToolbarProps {
  currentPage: number;
  numPages: number;
  scale: number;
  isBookmarked: boolean;
  onPageChange: (page: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onRotate: () => void;
  onToggleBookmark: () => void;
}

export const PdfToolbar: React.FC<PdfToolbarProps> = ({
  currentPage,
  numPages,
  scale,
  isBookmarked,
  onPageChange,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onRotate,
  onToggleBookmark,
}) => {
  const goToPage = (page: number) => {
    if (page >= 1 && page <= numPages) onPageChange(page);
  };

  return (
    <div className="h-12 md:h-14 flex items-center justify-between px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-1 text-sm">
          <input
            type="number"
            value={currentPage}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value)) onPageChange(value);
            }}
            onBlur={(e) => goToPage(parseInt(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                goToPage(parseInt((e.target as HTMLInputElement).value));
            }}
            className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded text-center bg-white dark:bg-gray-700"
            aria-label="Current page"
          />
          <span className="text-gray-500 dark:text-gray-400">/</span>
          <span className="text-gray-500 dark:text-gray-400">{numPages}</span>
        </div>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= numPages}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="hidden md:flex items-center gap-2">
        <button
          onClick={onZoomOut}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Zoom out"
        >
          <ZoomOut size={18} />
        </button>
        <span className="text-sm min-w-[50px] text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={onZoomIn}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Zoom in"
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={onResetZoom}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Reset zoom"
        >
          <Home size={18} />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onRotate}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Rotate page"
        >
          <RotateCw size={18} />
        </button>
        <button
          onClick={onToggleBookmark}
          className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isBookmarked
              ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30"
              : ""
          }`}
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          <Bookmark size={18} />
        </button>
      </div>
    </div>
  );
};
