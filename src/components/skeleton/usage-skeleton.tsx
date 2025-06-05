import { Card, CardContent, CardHeader } from "../ui/card";

export default function UsageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-pulse">
        <div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-[180px]"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-[200px]"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-10"></div>
        </div>
      </div>

      <Card className="border-gray-200/50 dark:border-zinc-800/50 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 backdrop-blur-sm shadow-lg animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        </CardHeader>
        <CardContent>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array(4)
          .fill(null)
          .map((_, index) => (
            <Card
              key={index}
              className="border-gray-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm shadow-lg animate-pulse"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                  <div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
      </div>

      <Card className="border-gray-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm shadow-lg animate-pulse">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </CardContent>
      </Card>
    </div>
  );
}
