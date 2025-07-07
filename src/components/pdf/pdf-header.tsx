import type React from "react";
import { useState } from "react";
import {
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Minimize,
  Maximize,
  Search,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  fitToWidth?: () => void;
  fitToPage?: () => void;
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
  fitToWidth,
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

  const zoomPresets: { label: string; value: number }[] = [
    { label: "Fit to Width", value: -1 },
    { label: "25%", value: 0.25 },
    { label: "50%", value: 0.5 },
    { label: "75%", value: 0.75 },
    { label: "100%", value: 1 },
    { label: "125%", value: 1.25 },
    { label: "150%", value: 1.5 },
    { label: "200%", value: 2 },
  ];

  return (
    <TooltipProvider>
      <div className="h-14 flex items-center justify-between px-6 bg-white dark:bg-gray-950 border-b border-gray-200/60 dark:border-gray-700/60 backdrop-blur-xl sticky top-0 z-40 shadow-lg shadow-black/5">
        {/* Left Section - TOC and Navigation */}
        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:scale-105"
                onClick={() => setShowToc(!showToc)}
                aria-label="Toggle table of contents"
              >
                {showToc ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{showToc ? "Hide" : "Show"} Table of Contents</p>
            </TooltipContent>
          </Tooltip>

          <Separator
            orientation="vertical"
            className="h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent dark:via-gray-600"
          />

          <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 rounded-2xl p-0.5 border border-gray-200/80 dark:border-gray-700/80 shadow-sm backdrop-blur-sm">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Previous Page (←)</p>
              </TooltipContent>
            </Tooltip>

            {showSearch ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <Input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-8 w-24 text-sm px-3 border-0 bg-gray-50 dark:bg-gray-700 focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
                  placeholder={`1-${numPages}`}
                  autoFocus
                  onBlur={() => {
                    if (!searchValue) setShowSearch(false);
                  }}
                />
              </form>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="flex items-center gap-2 text-sm font-medium px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 min-w-0 group"
                    onClick={() => setShowSearch(true)}
                    aria-label="Go to page"
                  >
                    <span className="tabular-nums font-semibold text-blue-600 dark:text-blue-400">
                      {currentPage}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500">/</span>
                    <span className="tabular-nums text-gray-600 dark:text-gray-400">
                      {numPages}
                    </span>
                    <Search className="h-3.5 w-3.5 ml-1 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Go to Page (Ctrl+G)</p>
                </TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= numPages}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Next Page (→)</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Center Section - Enhanced Zoom Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 rounded-2xl p-0.5 border border-gray-200/80 dark:border-gray-700/80 shadow-sm backdrop-blur-sm">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                  onClick={() =>
                    setScale((prev) => Math.max(0.25, prev - 0.25))
                  }
                  disabled={scale <= 0.25}
                  aria-label="Zoom out"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom Out (Ctrl+-)</p>
              </TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-9 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <span className="text-sm font-semibold tabular-nums min-w-[3.5rem] text-center text-blue-600 dark:text-blue-400">
                    {Math.round(scale * 100)}%
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-32">
                {zoomPresets.map((preset) => (
                  <DropdownMenuItem
                    key={preset.value}
                    onClick={() => {
                      if (preset.value === -1) {
                        fitToWidth?.();
                      } else {
                        setScale(preset.value);
                      }
                    }}
                    className={
                      scale === preset.value
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : ""
                    }
                  >
                    {preset.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200"
                  onClick={() => setScale((prev) => Math.min(3, prev + 0.25))}
                  disabled={scale >= 3}
                  aria-label="Zoom in"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom In (Ctrl++)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  aria-label="Rotate"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Rotate (Ctrl+R)</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Right Section - Fullscreen */}
        <div className="flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 hover:scale-105"
                onClick={toggleFullscreen}
                aria-label={
                  isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                }
              >
                {isFullscreen ? (
                  <Minimize className="h-4 w-4" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isFullscreen ? "Exit" : "Enter"} Fullscreen (F11)</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PdfHeader;
