import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock } from "lucide-react";
import {
  useReadingProgressStore,
} from "@/stores/use-reading-progress-store";
import { Link } from "react-router-dom";

interface ReadingHistoryProps {
  limit?: number;
  className?: string;
}

export const ReadingHistory: React.FC<ReadingHistoryProps> = ({
  limit = 5,
  className = "",
}) => {
  const { getRecentBooks, getTotalReadingTime } =
    useReadingProgressStore();
  const recentBooks = getRecentBooks(limit);
  const totalReadingTime = getTotalReadingTime();

  const formatReadingTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatLastRead = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  if (recentBooks.length === 0) {
    return (
      <Card className={`bg-white dark:bg-gray-800 ${className}`}>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No Reading History
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Start reading ebooks to see your progress here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-white dark:bg-gray-800 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Reading History
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="h-4 w-4" />
          <span>Total reading time: {formatReadingTime(totalReadingTime)}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentBooks.map((book) => (
          <div
            key={book.conversationId}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {book.bookTitle || "Untitled Book"}
                </h4>
                <Badge variant="secondary" className="text-xs">
                  {book.progressPercentage}%
                </Badge>
              </div>

              <div className="space-y-2">
                <Progress
                  value={book.progressPercentage}
                  className="h-1.5 bg-gray-200 dark:bg-gray-700"
                />
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    Page {book.currentPage} of {book.totalPages}
                  </span>
                  <span>{formatReadingTime(book.readingTime)}</span>
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  Last read: {formatLastRead(book.lastReadAt)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <Button
                asChild
                size="sm"
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Link to={`/chat/${book.conversationId}`}>
                  Continue Reading
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
