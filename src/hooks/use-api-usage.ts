import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { ApiUsageResponse, userApi } from "@/api/user-api";
import { ApiResponse } from "@/types/api";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

export const useApiUsage = (
  dateRange: DateRange,
  options?: Omit<
    UseQueryOptions<ApiResponse<ApiUsageResponse>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  const { from, to } = dateRange;
  const params: Record<string, string> = {};

  if (from) {
    params.from = format(from, "yyyy-MM-dd'T'HH:mm:ss");
  }
  if (to) {
    params.to = format(to, "yyyy-MM-dd'T'HH:mm:ss");
  }

  return useQuery<ApiResponse<ApiUsageResponse>, Error>({
    ...options,
    queryKey: ["api-usage", from?.toISOString(), to?.toISOString()],
    queryFn: () => userApi.countApiUsage(params),
  });
};