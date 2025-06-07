export default function SkeletonLoader() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-2 rounded-lg animate-pulse"
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-6 h-6 rounded-full bg-zinc-700" />
            <div className="h-4 bg-zinc-700 rounded w-3/4" />
          </div>
          <div className="w-7 h-7 bg-zinc-700 rounded" />
        </div>
      ))}
    </div>
  );
}