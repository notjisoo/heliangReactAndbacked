import { Table, Button, Space } from "antd";
import type { TableProps } from "antd";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import type { EmployeesData } from "@/types/employees";
import { useEmployeesData } from "@/hooks/useEmploeeys";

interface DataType {
  key: string;
  name: string;
  age: number;
  position: string;
  salary: string;
  hireDate: string;
  department: string;
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Name",
    dataIndex: "name",
    align: "center",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Age",
    align: "center",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Position",
    dataIndex: "position",
    align: "center",
    key: "position",
  },
  {
    title: "Salary",
    align: "center",
    dataIndex: "salary",
    key: "salary",
  },
  {
    title: "HireDate",
    dataIndex: "hireDate",
    align: "center",
    key: "hireDate",
    render: (_, record) => record.hireDate.split("T")[0],
  },
  {
    title: "Department",
    align: "center",
    dataIndex: "department",
    key: "department",
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <Button onClick={() => console.log("delete " + record.key)}>
          删除
        </Button>
        <Button onClick={() => console.log("delete " + record.key)}>
          查看
        </Button>
      </Space>
    ),
  },
];

function mapEmployeesToDataType(employees: EmployeesData[]): DataType[] {
  return employees.map((emp) => ({
    key: emp._id, // 用 _id 当 key
    name: emp.name,
    age: (emp as any).age ?? 0,
    position: emp.position,
    salary: emp.salary.toString(),
    hireDate: emp.hireDate.split("T")[0],
    department: emp.department,
  }));
}

export default function Setting() {
  const { data, isLoading, error } = useEmployeesData();

  // 导出函数放在组件内部，这样能直接访问 data
  const handleOutData = (type: "current" | "all") => {
    if (type === "current") {
      if (!data) return;

      const ws = XLSX.utils.json_to_sheet(data.data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      FileSaver.saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        "导出数据.xlsx"
      );
    } else {
      // 导出所有数据这里代码就不写 一般如果是大数据的话是在后端给你返回一个下载链接的.
      window.open("http://localhost:3000/getAllEmployeesData");
    }
  };

  return (
    <div className="mt-20">
      <Table<DataType>
        title={() => (
          <div style={{ textAlign: "right" }}>
            <Button type="primary" onClick={() => handleOutData("current")}>
              点击导出当前表格数据
            </Button>
            &nbsp;
            <Button type="primary" onClick={() => handleOutData("all")}>
              点击导出所有数据
            </Button>
          </div>
        )}
        pagination={{ position: ["bottomCenter"], defaultPageSize: 100 }}
        loading={isLoading}
        columns={columns}
        dataSource={mapEmployeesToDataType(data?.data || [])}
        rowKey="key"
      />
    </div>
  );
}
