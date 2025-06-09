import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { adminApi, ApiUsageResponse } from "@/api/admin-api";

export const useGetApiUsageByUserId = (
  userId: string,
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
    queryKey: ["admin-api-usage", from?.toISOString(), to?.toISOString()],
    queryFn: () => adminApi.getApiUsageByUserId(userId, params),
  });
};
