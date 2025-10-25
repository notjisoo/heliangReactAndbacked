const mongoose = require("mongoose");

// 连接本地 MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/ReactH5", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 定义部门 Schema
const departmentSchema = new mongoose.Schema({
  name: String,
  location: String,
  manager: String,
});

// 定义员工 Schema（带 departmentId 外键）
const employeeSchema = new mongoose.Schema({
  name: String,
  age: Number,
  position: String,
  salary: Number,
  hireDate: Date,
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
});

// 模型
const Department = mongoose.model("Department", departmentSchema);
const Employee = mongoose.model("Employee", employeeSchema);

async function seed() {
  try {
    // 清空旧数据
    await Department.deleteMany({});
    await Employee.deleteMany({});

    // 插入部门
    const departments = await Department.insertMany([
      { name: "研发部", location: "广州", manager: "张经理" },
      { name: "产品部", location: "深圳", manager: "李经理" },
      { name: "测试部门", location: "上海", manager: "王经理" },
      { name: "人事部门", location: "北京", manager: "赵经理" },
      { name: "市场部门", location: "杭州", manager: "钱经理" },
      { name: "行政部门", location: "成都", manager: "孙经理" },
    ]);

    // 职位池
    const positions = [
      "前端工程师",
      "后端工程师",
      "测试工程师",
      "产品经理",
      "UI设计师",
      "剪辑",
      "安卓工程师",
      "Flutter工程师",
      "iOS工程师",
      "推广专员",
    ];

    // 生成 1000 个员工
    const employees = [];
    for (let i = 1; i <= 100000; i++) {
      const dept = departments[Math.floor(Math.random() * departments.length)];
      employees.push({
        name: `员工${i}`,
        age: Math.floor(Math.random() * 23) + 22, // 22-44岁
        position: positions[Math.floor(Math.random() * positions.length)],
        salary: Math.floor(Math.random() * 20000) + 6000, // 6000-26000
        hireDate: new Date(
          2017 + Math.floor(Math.random() * 8), // 2017-2024
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ),
        departmentId: dept._id,
      });
    }

    await Employee.insertMany(employees);

    console.log("✅ 成功插入 6 个部门和 10w 条员工数据！");
  } catch (err) {
    console.error("❌ 插入失败:", err);
  } finally {
    mongoose.connection.close();
  }
}

seed();
