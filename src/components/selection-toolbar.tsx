import { useFloating, flip, offset, shift, autoUpdate } from "@floating-ui/react";
import { useEffect } from "react";
import { BookOpen, FileText, RefreshCw, MessageCircle, Copy, Highlighter } from "lucide-react";

type Props = {
  range: Range | null;
  onAction: (action: string) => void;
};

export function SelectionToolbar({ range, onAction }: Props) {
  const { x, y, strategy, update, refs } = useFloating({
    placement: "top",
    middleware: [offset(8), flip(), shift()],
  });

  useEffect(() => {
    if (range) {
      refs.setReference({
        getBoundingClientRect: () => range.getBoundingClientRect(),
        contextElement: document.body,
      });
      update();
    }
  }, [range, refs, update]);

  useEffect(() => {
    if (refs.reference.current && refs.floating.current) {
      return autoUpdate(refs.reference.current, refs.floating.current, update);
    }
  }, [refs.reference, refs.floating, update]);

  if (!range) return null;

  return (
    <div
      ref={refs.setFloating}
      style={{
        position: strategy,
        top: y ?? 0,
        left: x ?? 0,
      }}
      className="selection-toolbar bg-white dark:bg-zinc-900 shadow-lg rounded-full p-1.5 flex items-center space-x-1 border border-gray-100 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-150 z-50"
    >
      <ToolbarButton icon={<BookOpen size={14} />} tooltip="Explain" onClick={() => onAction("explain")} />
      <ToolbarButton icon={<FileText size={14} />} tooltip="Summarize" onClick={() => onAction("summarize")} />
      <ToolbarButton icon={<RefreshCw size={14} />} tooltip="Rewrite" onClick={() => onAction("rewrite")} />
      <div className="h-4 w-px bg-gray-200 dark:bg-zinc-700 mx-0.5" />
      <div className="flex items-center space-x-1 px-1">
        {[
          { color: "red", tooltip: "Red" },
          { color: "yellow", tooltip: "Yellow" },
          { color: "green", tooltip: "Green" },
          { color: "purple", tooltip: "Purple" },
        ].map(({ color, tooltip }) => (
          <HighlightButton key={color} color={color} tooltip={tooltip} onClick={() => onAction(`highlight-${color}`)} />
        ))}
      </div>
      <div className="h-4 w-px bg-gray-200 dark:bg-zinc-700 mx-0.5" />
      <ToolbarButton icon={<MessageCircle size={14} />} tooltip="Comment" onClick={() => onAction("comment")} />
      <ToolbarButton icon={<Copy size={14} />} tooltip="Copy" onClick={() => onAction("copy")} />
    </div>
  );
}

function ToolbarButton({
  icon,
  tooltip,
  onClick,
}: {
  icon: React.ReactNode
  tooltip: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group relative h-8 w-8 flex items-center justify-center rounded-full bg-transparent hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
      aria-label={tooltip}
    >
      <span className="text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
        {icon}
      </span>

      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 dark:bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {tooltip}
      </span>
    </button>
  )
}

function HighlightButton({
  color,
  tooltip,
  onClick,
}: {
  color: string
  tooltip: string
  onClick: () => void
}) {
  const getColorClasses = () => {
    switch (color) {
      case "red":
        return "bg-red-500 hover:bg-red-600"
      case "yellow":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "green":
        return "bg-green-500 hover:bg-green-600"
      case "purple":
        return "bg-purple-500 hover:bg-purple-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <button
      onClick={onClick}
      className="group relative flex items-center justify-center"
      aria-label={`Highlight ${tooltip}`}
    >
      <div
        className={`h-5 w-5 rounded-full ${getColorClasses()} transition-transform hover:scale-110 cursor-pointer flex items-center justify-center`}
      >
        <Highlighter size={10} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 dark:bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {tooltip}
      </span>
    </button>
  )
}
