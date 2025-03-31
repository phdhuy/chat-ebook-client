import { X } from "lucide-react";

interface PdfSettingsProps {
  show: boolean;
  scale: number;
  rotation: number;
  darkMode: boolean;
  onClose: () => void;
  onScaleChange: (scale: number) => void;
  onRotationChange: (rotation: number) => void;
  onDarkModeChange: (darkMode: boolean) => void;
}

export const PdfSettings: React.FC<PdfSettingsProps> = ({
  show,
  scale,
  rotation,
  darkMode,
  onClose,
  onScaleChange,
  onRotationChange,
  onDarkModeChange,
}) => {
  if (!show) return null;

  return (
    <div className="fixed top-16 right-0 w-72 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-md z-20 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold">Reading Settings</h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Close settings"
        >
          <X size={18} />
        </button>
      </div>
      <div className="p-4 overflow-y-auto">
        <div className="mb-6">
          <label className="block font-medium mb-2">Zoom Level</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={scale}
              onChange={(e) => onScaleChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm font-medium">
              {Math.round(scale * 100)}%
            </span>
          </div>
        </div>
        <div className="mb-6">
          <label className="block font-medium mb-2">Page Rotation</label>
          <div className="grid grid-cols-4 gap-2">
            {[0, 90, 180, 270].map((deg) => (
              <button
                key={deg}
                onClick={() => onRotationChange(deg)}
                className={`py-2 px-3 text-sm border rounded-md transition-colors ${
                  rotation === deg
                    ? "bg-purple-600 text-white border-purple-600 dark:bg-purple-700 dark:border-purple-700"
                    : "border-gray-300 dark:border-gray-600 hover:border-purple-600 dark:hover:border-purple-500"
                }`}
              >
                {deg}°
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block font-medium mb-2">Display Mode</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onDarkModeChange(false)}
              className={`py-2 px-3 text-sm border rounded-md transition-colors ${
                !darkMode
                  ? "bg-purple-600 text-white border-purple-600 dark:bg-purple-700 dark:border-purple-700"
                  : "border-gray-300 dark:border-gray-600 hover:border-purple-600 dark:hover:border-purple-500"
              }`}
            >
              Light
            </button>
            <button
              onClick={() => onDarkModeChange(true)}
              className={`py-2 px-3 text-sm border rounded-md transition-colors ${
                darkMode
                  ? "bg-purple-600 text-white border-purple-600 dark:bg-purple-700 dark:border-purple-700"
                  : "border-gray-300 dark:border-gray-600 hover:border-purple-600 dark:hover:border-purple-500"
              }`}
            >
              Dark
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
