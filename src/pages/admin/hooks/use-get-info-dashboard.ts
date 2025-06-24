import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { adminApi, InfoDashboardResponse } from "@/api/admin-api";

export const useGetInfoDashboard = (
  dateRange: DateRange,
  options?: Omit<
    UseQueryOptions<ApiResponse<InfoDashboardResponse>, Error>,
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

  return useQuery<ApiResponse<InfoDashboardResponse>, Error>({
    ...options,
    queryKey: ["dashboard-stats", from?.toISOString(), to?.toISOString()],
    queryFn: () => adminApi.dashboard(params),
  });
};