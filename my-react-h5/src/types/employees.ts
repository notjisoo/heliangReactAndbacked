export interface EmployeesData {
  _id: string; // 后端返回的 id
  name: string;
  position: string;
  salary: number;
  hireDate: string; // 注意拼写要和 DataType 对齐
  department: string;
}

export type RespsoneEmployeesData = {
  data: EmployeesData[];
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};
