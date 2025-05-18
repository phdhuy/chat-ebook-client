import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  RotateCw,
  Sun,
  Moon,
  Minimize,
  Maximize,
  Settings,
  Search,
  ArrowUp,
  ArrowDown,
  XCircle,
} from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

interface PdfHeaderProps {
  showToc: boolean
  setShowToc: (value: boolean) => void
  currentPage: number
  numPages: number
  goToPage: (page: number) => void
  scale: number
  setScale: (scale: number | ((prev: number) => number)) => void
  rotation: number
  setRotation: (rotation: number | ((prev: number) => number)) => void
  darkMode: boolean
  setDarkMode: (value: boolean) => void
  isFullscreen: boolean
  toggleFullscreen: () => void
  showSettings: boolean
  setShowSettings: (value: boolean) => void
  onSearchText?: (searchTerm: string) => Promise<number>
  onNextMatch?: () => Promise<void>
  onPrevMatch?: () => Promise<void>
  onClearSearch?: () => void
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
  darkMode,
  setDarkMode,
  isFullscreen,
  toggleFullscreen,
  showSettings,
  setShowSettings,
  onSearchText,
  onNextMatch,
  onPrevMatch,
  onClearSearch,
}) => {
  const [searchValue, setSearchValue] = useState<string>("")
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [showTextSearch, setShowTextSearch] = useState<boolean>(false)
  const [textSearchValue, setTextSearchValue] = useState<string>("")
  const [searchResults, setSearchResults] = useState<{ current: number; total: number }>({ current: 0, total: 0 })
  const textSearchInputRef = useRef<HTMLInputElement>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const pageNumber = Number.parseInt(searchValue)
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= numPages) {
      goToPage(pageNumber)
      setSearchValue("")
    }
  }

  const handleTextSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (textSearchValue && onSearchText) {
      const totalMatches = await onSearchText(textSearchValue)
      setSearchResults({ current: totalMatches > 0 ? 1 : 0, total: totalMatches })
    }
  }

  const handleNextMatch = async () => {
    if (onNextMatch) {
      await onNextMatch()
      setSearchResults((prev) => ({
        ...prev,
        current: prev.current < prev.total ? prev.current + 1 : 1,
      }))
    }
  }

  const handlePrevMatch = async () => {
    if (onPrevMatch) {
      await onPrevMatch()
      setSearchResults((prev) => ({
        ...prev,
        current: prev.current > 1 ? prev.current - 1 : prev.total,
      }))
    }
  }

  const handleClearSearch = () => {
    setTextSearchValue("")
    setSearchResults({ current: 0, total: 0 })
    if (onClearSearch) {
      onClearSearch()
    }
  }

  useEffect(() => {
    if (showTextSearch && textSearchInputRef.current) {
      textSearchInputRef.current.focus()
    }
  }, [showTextSearch])

  return (
    <div className="h-12 flex items-center justify-between px-4 bg-white/90 dark:bg-gray-800/90 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center gap-2 flex-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setShowToc(!showToc)}
          aria-label="Toggle table of contents"
        >
          {showToc ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>

        {showTextSearch ? (
          <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden max-w-xs md:max-w-md lg:max-w-lg">
            <form onSubmit={handleTextSearch} className="flex items-center flex-1">
              <div className="flex items-center px-2 py-1 border-r border-gray-200 dark:border-gray-700">
                <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
              <input
                ref={textSearchInputRef}
                type="text"
                value={textSearchValue}
                onChange={(e) => setTextSearchValue(e.target.value)}
                className="h-8 flex-1 px-2 py-1 bg-transparent border-none focus:outline-none text-sm"
                placeholder="Search in document..."
              />
              {textSearchValue && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  aria-label="Clear search"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              )}
            </form>
            <div className="flex items-center px-2 text-xs text-gray-500 dark:text-gray-400 border-l border-gray-200 dark:border-gray-700">
              {searchResults.total > 0 ? `${searchResults.current}/${searchResults.total}` : "0/0"}
            </div>
            <div className="flex items-center border-l border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handlePrevMatch}
                disabled={searchResults.total === 0}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-50"
                aria-label="Previous match"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMatch}
                disabled={searchResults.total === 0}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-50"
                aria-label="Next match"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowTextSearch(false)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 border-l border-gray-200 dark:border-gray-700"
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowTextSearch(true)}
            aria-label="Search in document"
          >
            <Search className="h-4 w-4" />
          </Button>
        )}

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {showSearch ? (
            <form onSubmit={handleSearch} className="flex items-center">
              <Input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="h-7 w-16 text-xs px-2 py-1 focus-visible:ring-1"
                placeholder={`1-${numPages}`}
                autoFocus
                onBlur={() => {
                  if (!searchValue) setShowSearch(false)
                }}
              />
            </form>
          ) : (
            <button
              className="text-xs font-medium px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              onClick={() => setShowSearch(true)}
              aria-label="Search page"
            >
              {currentPage}/{numPages}
            </button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= numPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-gray-50/80 dark:bg-gray-700/50 rounded-md px-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setScale((prev) => Math.max(0.5, prev - 0.2))}
          aria-label="Zoom out"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="text-xs w-10 text-center font-medium">{Math.round(scale * 100)}%</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setScale((prev) => Math.min(3, prev + 0.2))}
          aria-label="Zoom in"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hidden sm:flex"
          onClick={() => setRotation((prev) => (prev + 90) % 360)}
          aria-label="Rotate"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setDarkMode(!darkMode)}
          aria-label={darkMode ? "Light mode" : "Dark mode"}
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setShowSettings(!showSettings)}
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default PdfHeader