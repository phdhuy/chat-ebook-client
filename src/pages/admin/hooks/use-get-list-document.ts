import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api";
import { adminApi, AdminQueryParams, FileInfoResponse } from "@/api/admin-api";

export const useGetListDocument = (
  params: AdminQueryParams,
  options?: Omit<
    UseQueryOptions<ApiResponse<FileInfoResponse[]>>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<FileInfoResponse[]>>({
    ...options,
    queryKey: ["admin-documents", params],
    queryFn: () => adminApi.getListFile(params),
  });
};
