const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/ReactH5", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ====== Schema 定义 ======
const departmentSchema = new mongoose.Schema({
  name: String,
  location: String,
  manager: String,
});

const employeeSchema = new mongoose.Schema({
  name: String,
  age: Number,
  position: String,
  salary: Number,
  hireDate: Date,
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
});

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  startDate: Date,
  endDate: Date,
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
});

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  date: Date,
  status: { type: String, enum: ["出勤", "迟到", "早退", "缺勤", "请假"] },
  checkIn: Date,
  checkOut: Date,
});

const salaryHistorySchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  oldSalary: Number,
  newSalary: Number,
  changeDate: Date,
  reason: String,
});

const operationLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: String,
  target: String,
  detail: String,
  timestamp: { type: Date, default: Date.now },
});

// ====== 模型 ======
const Department = mongoose.model("Department", departmentSchema);
const Employee = mongoose.model("Employee", employeeSchema);
const Project = mongoose.model("Project", projectSchema);
const Attendance = mongoose.model("Attendance", attendanceSchema);
const SalaryHistory = mongoose.model("SalaryHistory", salaryHistorySchema);
const OperationLog = mongoose.model("OperationLog", operationLogSchema);

// ====== Seed 脚本 ======
async function seed() {
  try {
    // 清空旧数据
    await Project.deleteMany({});
    await Attendance.deleteMany({});
    await SalaryHistory.deleteMany({});
    await OperationLog.deleteMany({});

    const departments = await Department.find();
    const employees = await Employee.find().limit(1000); // 只取前1000个员工做演示

    // 1. 项目数据
    const projects = [];
    for (let i = 1; i <= 20; i++) {
      const dept = departments[Math.floor(Math.random() * departments.length)];
      const members = employees
        .sort(() => 0.5 - Math.random())
        .slice(0, 20)
        .map((e) => e._id);

      projects.push({
        name: `项目${i}`,
        description: `这是项目${i}的描述`,
        startDate: new Date(2020, 0, 1 + i),
        endDate: new Date(2025, 0, 1 + i),
        departmentId: dept._id,
        members,
      });
    }
    await Project.insertMany(projects);

    // 2. 考勤数据
    const attendance = [];
    employees.forEach((emp) => {
      for (let d = 1; d <= 30; d++) {
        const statusArr = ["出勤", "迟到", "早退", "缺勤", "请假"];
        const status = statusArr[Math.floor(Math.random() * statusArr.length)];
        attendance.push({
          employeeId: emp._id,
          date: new Date(2025, 9, d), // 2025年10月
          status,
          checkIn: new Date(2025, 9, d, 9, Math.floor(Math.random() * 30)),
          checkOut: new Date(2025, 9, d, 18, Math.floor(Math.random() * 30)),
        });
      }
    });
    await Attendance.insertMany(attendance);

    // 3. 薪资变动数据
    const salaryHistories = employees.map((emp) => ({
      employeeId: emp._id,
      oldSalary: emp.salary - 1000,
      newSalary: emp.salary,
      changeDate: new Date(2024, Math.floor(Math.random() * 12), 1),
      reason: "年度调薪",
    }));
    await SalaryHistory.insertMany(salaryHistories);

    // 4. 操作日志数据
    const logs = [];
    for (let i = 1; i <= 200; i++) {
      logs.push({
        userId: null, // 这里可以替换成 admin 用户的 _id
        action: ["新增", "修改", "删除", "登录"][Math.floor(Math.random() * 4)],
        target: ["Employee", "Department", "Project"][
          Math.floor(Math.random() * 3)
        ],
        detail: `执行了第${i}次操作`,
        timestamp: new Date(),
      });
    }
    await OperationLog.insertMany(logs);

    console.log("✅ 成功插入项目、考勤、薪资变动、操作日志数据！");
  } catch (err) {
    console.error("❌ 插入失败:", err);
  } finally {
    mongoose.connection.close();
  }
}

seed();
