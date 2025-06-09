import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { format, startOfDay, subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { BarChart3, Brain, FileText, Upload, Send, CalendarIcon, FilterIcon } from "lucide-react";
import UsageSkeleton from "@/components/skeleton/usage-skeleton";
import { useGetApiUsageByUserId } from "../hooks/use-get-api-usage-by-user-id";

interface UsageModalProps {
  open: boolean;
  userId: string;
  onOpenChange: (open: boolean) => void;
}

export default function UsageModal({ open, userId, onOpenChange }: UsageModalProps) {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [quickFilter, setQuickFilter] = useState<string>("30days");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const { data: usageResponse, isLoading, error } = useGetApiUsageByUserId(userId, dateRange);
  const usageData = usageResponse?.data || [];

  const handleQuickFilterChange = (value: string) => {
    setQuickFilter(value);
    const today = new Date();

    switch (value) {
      case "today":
        setDateRange({ from: startOfDay(today), to: today });
        break;
      case "7days":
        setDateRange({ from: subDays(today, 7), to: today });
        break;
      case "30days":
        setDateRange({ from: subDays(today, 30), to: today });
        break;
      case "90days":
        setDateRange({ from: subDays(today, 90), to: today });
        break;
      case "year":
        setDateRange({ from: subDays(today, 365), to: today });
        break;
      case "custom":
        setIsCalendarOpen(true);
        break;
    }
  };

  const getUsageIcon = (resourceType: string) => {
    switch (resourceType) {
      case "GENERATE_MIND_MAP":
        return <Brain className="w-6 h-6" />;
      case "SEND_MESSAGE":
        return <Send className="w-6 h-6" />;
      case "SUMMARIZE_EBOOK":
        return <FileText className="w-6 h-6" />;
      case "UPLOAD_EBOOK":
        return <Upload className="w-6 h-6" />;
      default:
        return <BarChart3 className="w-6 h-6" />;
    }
  };

  const getUsageLabel = (resourceType: string) => {
    switch (resourceType) {
      case "GENERATE_MIND_MAP":
        return "Mind Maps Generated";
      case "SEND_MESSAGE":
        return "Messages Sent";
      case "SUMMARIZE_EBOOK":
        return "Ebooks Summarized";
      case "UPLOAD_EBOOK":
        return "Ebooks Uploaded";
      default:
        return resourceType.replace(/_/g, " ").toLowerCase();
    }
  };

  const getUsageColor = (resourceType: string) => {
    switch (resourceType) {
      case "GENERATE_MIND_MAP":
        return "from-purple-500 to-pink-600";
      case "SEND_MESSAGE":
        return "from-blue-500 to-cyan-600";
      case "SUMMARIZE_EBOOK":
        return "from-green-500 to-emerald-600";
      case "UPLOAD_EBOOK":
        return "from-orange-500 to-red-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const totalUsage = usageData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px] p-0 gap-0 border-none shadow-2xl bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden">
        <DialogHeader className="p-8 border-b border-gray-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            API Usage
          </DialogTitle>
        </DialogHeader>
        <div className="p-8">
          {isLoading ? (
            <UsageSkeleton />
          ) : error ? (
            <div>Error: {error.message}</div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    API Usage Overview
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Track your API usage across different features
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Select value={quickFilter} onValueChange={handleQuickFilterChange}>
                    <SelectTrigger className="w-[180px] bg-white dark:bg-zinc-900 border-gray-200/70 dark:border-zinc-800/70 rounded-xl">
                      <SelectValue placeholder="Filter period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="7days">Last 7 days</SelectItem>
                      <SelectItem value="30days">Last 30 days</SelectItem>
                      <SelectItem value="90days">Last 90 days</SelectItem>
                      <SelectItem value="year">Last year</SelectItem>
                      <SelectItem value="custom">Custom range</SelectItem>
                    </SelectContent>
                  </Select>

                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal bg-white dark:bg-zinc-900 border-gray-200/70 dark:border-zinc-800/70 rounded-xl",
                          !dateRange.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} -{" "}
                              {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from}
                        selected={dateRange}
                        onSelect={(range) => {
                          setDateRange(range || { from: undefined, to: undefined });
                          if (range?.from && range?.to) {
                            setQuickFilter("custom");
                          }
                        }}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>

                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white dark:bg-zinc-900 border-gray-200/70 dark:border-zinc-800/70 rounded-xl"
                    onClick={() => console.log("Applying filters:", dateRange)}
                  >
                    <FilterIcon className="h-4 w-4" />
                    <span className="sr-only">Apply filters</span>
                  </Button>
                </div>
              </div>

              <Card className="border-gray-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Total Usage
                  </CardTitle>
                  <CardDescription>Your overall API consumption</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">
                    {totalUsage}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Total API calls made
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {usageData.map((usage) => (
                  <Card
                    key={usage.resource_type}
                    className="border-gray-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "p-3 rounded-xl bg-gradient-to-br shadow-lg",
                            getUsageColor(usage.resource_type)
                          )}
                        >
                          <div className="text-white">
                            {getUsageIcon(usage.resource_type)}
                          </div>
                        </div>
                        <div>
                          <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-200">
                            {getUsageLabel(usage.resource_type)}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            Current usage count
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                          {usage.count}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          calls
                        </span>
                      </div>
                      <Progress
                        value={totalUsage > 0 ? (usage.count / totalUsage) * 100 : 0}
                        className="h-2 bg-gray-200 dark:bg-zinc-700"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {totalUsage > 0
                          ? `${((usage.count / totalUsage) * 100).toFixed(
                              1
                            )}% of total usage`
                          : "No usage yet"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {usageData.length === 0 && (
                <Card className="border-gray-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 shadow-lg">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <BarChart3 className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      No Usage Data
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-center">
                      Start using the API features to see your usage statistics here.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}