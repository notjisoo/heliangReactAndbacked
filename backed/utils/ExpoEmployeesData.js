import { Employee } from "../models/employeeSchema.js";
import ExcelJS from "exceljs";

export const ExpoEmployeesData = async (req, res) => {
  try {
    // 1. 查询所有员工数据（注意：10w 条数据可能比较大，建议只在导出时用）
    const employees = await Employee.find()
      .populate("departmentId", "name")
      .lean();

    // 2. 创建工作簿
    const workbook = new ExcelJS.Workbook();

    // 3. 每 1w 条数据一个 sheet
    const chunkSize = 10000;
    for (let i = 0; i < employees.length; i += chunkSize) {
      const chunk = employees.slice(i, i + chunkSize);

      const worksheet = workbook.addWorksheet(`Sheet${i / chunkSize + 1}`);

      // 设置表头
      worksheet.columns = [
        {
          header: "姓名",
          key: "name",
          width: 20,
        },
        {
          header: "年龄",
          key: "age",
          width: 10,
        },
        {
          header: "职位",
          key: "position",
          width: 20,
        },
        {
          header: "薪资",
          key: "salary",
          width: 15,
        },
        {
          header: "入职日期",
          key: "hireDate",
          width: 20,
        },
        {
          header: "部门",
          key: "department",
          width: 20,
        },
      ];

      // 插入数据
      chunk.forEach((emp) => {
        worksheet.addRow({
          name: emp.name,
          age: emp.age,
          position: emp.position,
          salary: emp.salary,
          hireDate: emp.hireDate
            ? new Date(emp.hireDate).toISOString().split("T")[0]
            : "",
          department: emp.departmentId?.name || "",
        });
      });

      // 表头居中
      worksheet.getRow(1).alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      // 所有行居中
      worksheet.eachRow((row) => {
        row.alignment = { horizontal: "center", vertical: "middle" };
      });
    }

    // 4. 设置响应头，返回文件流
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=employees.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "导出失败" });
  }
};
