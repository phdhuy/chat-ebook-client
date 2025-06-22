import type React from "react";
import { useState } from "react";
import {
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  RotateCw,
  Minimize,
  Maximize,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface PdfHeaderProps {
  showToc: boolean;
  setShowToc: (value: boolean) => void;
  currentPage: number;
  numPages: number;
  goToPage: (page: number) => void;
  scale: number;
  setScale: (scale: number | ((prev: number) => number)) => void;
  rotation: number;
  setRotation: (rotation: number | ((prev: number) => number)) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

const PdfHeader: React.FC<PdfHeaderProps> = ({
  showToc,
  setShowToc,
  currentPage,
  numPages,
  goToPage,
  scale,
  setScale,
  setRotation,
  isFullscreen,
  toggleFullscreen,
}) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNumber = Number.parseInt(searchValue);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= numPages) {
      goToPage(pageNumber);
      setSearchValue("");
      setShowSearch(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowSearch(false);
      setSearchValue("");
    }
  };

  return (
    <div className="h-14 flex items-center justify-between px-4 bg-white/95 dark:bg-gray-900/95 border-b border-gray-200/80 dark:border-gray-700/80 backdrop-blur-md sticky top-0 z-30 shadow-sm">
      {/* Left Section - TOC and Navigation */}
      <div className="left-4 flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={() => setShowToc(!showToc)}
          aria-label="Toggle table of contents"
        >
          {showToc ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1 bg-gray-50/80 dark:bg-gray-800/50 rounded-lg p-1 border border-gray-200/50 dark:border-gray-700/50">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 hover:bg-white dark:hover:bg-gray-700 transition-colors"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>

          {showSearch ? (
            <form onSubmit={handleSearch} className="flex items-center">
              <Input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-7 w-20 text-xs px-2 border-0 bg-white dark:bg-gray-700 focus-visible:ring-1 focus-visible:ring-blue-500"
                placeholder={`1-${numPages}`}
                autoFocus
                onBlur={() => {
                  if (!searchValue) setShowSearch(false);
                }}
              />
            </form>
          ) : (
            <button
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 hover:bg-white dark:hover:bg-gray-700 rounded transition-colors min-w-0"
              onClick={() => setShowSearch(true)}
              aria-label="Search page"
            >
              <span className="tabular-nums">{currentPage}</span>
              <span className="text-gray-400 dark:text-gray-500">/</span>
              <span className="tabular-nums text-gray-600 dark:text-gray-400">
                {numPages}
              </span>
              <Search className="h-3 w-3 ml-1 text-gray-400" />
            </button>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 hover:bg-white dark:hover:bg-gray-700 transition-colors"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= numPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Center Section - Zoom Controls */}
      <div className="flex items-center gap-1 bg-gray-50/80 dark:bg-gray-800/50 rounded-lg p-1 border border-gray-200/50 dark:border-gray-700/50 mr-[40px]">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 hover:bg-white dark:hover:bg-gray-700 transition-colors"
          onClick={() => setScale((prev) => Math.max(0.5, prev - 0.2))}
          disabled={scale <= 0.5}
          aria-label="Zoom out"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <div className="flex items-center px-3 py-1">
          <span className="text-sm font-medium tabular-nums min-w-[3rem] text-center">
            {Math.round(scale * 100)}%
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 hover:bg-white dark:hover:bg-gray-700 transition-colors"
          onClick={() => setScale((prev) => Math.min(3, prev + 0.2))}
          disabled={scale >= 3}
          aria-label="Zoom in"
        >
          <Plus className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-5 mx-1" />

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 hover:bg-white dark:hover:bg-gray-700 transition-colors"
          onClick={() => setRotation((prev) => (prev + 90) % 360)}
          aria-label="Rotate"
        >
          <RotateCw className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default PdfHeader;