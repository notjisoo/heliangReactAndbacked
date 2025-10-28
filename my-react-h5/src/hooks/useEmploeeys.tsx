import { useQuery } from "@tanstack/react-query";
import type { RespsoneEmployeesData } from "@/types/employees";
import request from "@/utils/request";

// 封装成 hook
export function useEmployeesData() {
  return useQuery<RespsoneEmployeesData>({
    queryKey: ["employees"], // 缓存 key
    queryFn: async () => {
      const { data } = await request.get<RespsoneEmployeesData>(
        "/getEmployeesData"
      );
      console.log(data);
      return data;
    },
    // staleTime: 1000 * 60, // 可选：缓存 1 分钟
    // refetchOnWindowFocus: false, // 可选：切回窗口时不自动刷新
  });
}
