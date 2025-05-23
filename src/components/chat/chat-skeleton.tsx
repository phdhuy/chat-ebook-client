import { Skeleton } from "@/components/ui/skeleton";

export function ChatSkeleton() {
  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 overflow-auto px-4 py-6 space-y-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Skeleton className="w-6 h-4 bg-white/30" />
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Skeleton className="w-6 h-4" />
              <Skeleton className="w-32 h-3" />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm max-w-2xl">
              <div className="space-y-2">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-3/4 h-4" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Skeleton className="w-6 h-6 rounded" />
              <Skeleton className="w-6 h-6 rounded" />
              <Skeleton className="w-6 h-6 rounded" />
              <Skeleton className="w-6 h-6 rounded" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="flex items-end gap-2 max-w-2xl">
            <div className="text-right space-y-1">
              <div className="flex items-center justify-end gap-2 text-sm">
                <Skeleton className="w-32 h-3" />
                <Skeleton className="w-8 h-4" />
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl px-4 py-3">
                <Skeleton className="w-48 h-4 bg-white/30" />
              </div>
            </div>
            <div className="flex-shrink-0">
              <Skeleton className="w-8 h-6 rounded" />
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Skeleton className="w-6 h-4 bg-white/30" />
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Skeleton className="w-6 h-4" />
              <Skeleton className="w-32 h-3" />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm max-w-2xl">
              <div className="space-y-2">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-5/6 h-4" />
                <Skeleton className="w-4/5 h-4" />
                <Skeleton className="w-3/4 h-4" />
                <Skeleton className="w-2/3 h-4" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Skeleton className="w-6 h-6 rounded" />
              <Skeleton className="w-6 h-6 rounded" />
              <Skeleton className="w-6 h-6 rounded" />
              <Skeleton className="w-6 h-6 rounded" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="flex items-end gap-2 max-w-2xl">
            <div className="text-right space-y-1">
              <div className="flex items-center justify-end gap-2 text-sm">
                <Skeleton className="w-32 h-3" />
                <Skeleton className="w-8 h-4" />
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl px-4 py-3">
                <Skeleton className="w-48 h-4 bg-white/30" />
              </div>
            </div>
            <div className="flex-shrink-0">
              <Skeleton className="w-8 h-6 rounded" />
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Skeleton className="w-6 h-4 bg-white/30" />
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Skeleton className="w-6 h-4" />
              <Skeleton className="w-32 h-3" />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm max-w-2xl">
              <div className="space-y-2">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-1/2 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Skeleton className="w-full h-12 rounded-lg" />
          </div>
          <Skeleton className="w-12 h-12 rounded-lg" />
        </div>
        <div className="mt-2">
          <Skeleton className="w-56 h-3" />
        </div>
      </div>
    </div>
  );
}
