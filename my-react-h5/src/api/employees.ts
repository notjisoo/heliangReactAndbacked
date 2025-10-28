import type { RespsoneEmployeesData } from "@/types/employees";
import request from "@/utils/request";

export const getEmployeesData = async (): Promise<RespsoneEmployeesData> => {
  const { data } = await request.get<RespsoneEmployeesData>(
    "/getEmployeesData"
  );
  return data;
};

export const ExpoAllEmployeesData =
  async (): Promise<RespsoneEmployeesData> => {
    const { data } = await request.get<RespsoneEmployeesData>(
      "/getAllEmployeesData"
    );
    return data;
  };
