import { config as configDotenv } from "dotenv";
configDotenv();

import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import cors from "cors";
import bcrypt from "bcrypt";

import { Departments } from "./models/department.js";
import { Employee } from "./models/employeeSchema.js";
import { ExpoEmployeesData } from "./utils/ExpoEmployeesData.js";
const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;
const MONGO_URL = process.env.MONGO_URL;

app.use(cors());
app.use(bodyParser.json());

// 连接本地 MongoDB
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 定义用户模型
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  name: String,
});

const User = mongoose.model("User", userSchema);

// 注册接口
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.json({ message: "注册成功", code: 200 });
  } catch (err) {
    res.status(400).json({ message: "注册失败", error: err.message, code: -1 });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "用户名或密码错误" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "用户名或密码错误" });
    }

    // 生成短期 access token
    const accessToken = jwt.sign(
      { id: user._id, username: user.username },
      SECRET_KEY,
      { expiresIn: "15m" } // 15分钟有效
    );

    // 生成长期 refresh token
    const refreshToken = jwt.sign(
      { id: user._id, username: user.username },
      SECRET_KEY,
      { expiresIn: "7d" } // 7天有效
    );

    // refresh token 建议存数据库或 Redis，用于校验和注销
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: "success",
      code: 200,
      data: {
        accessToken,
        refreshToken,
        user: { id: user._id, username: user.username },
      },
    });
  } catch (err) {
    res.status(500).json({ message: "服务器错误", error: err.message });
  }
});

app.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "缺少 refresh token" });
  }

  try {
    // 校验 refresh token
    const decoded = jwt.verify(refreshToken, SECRET_KEY);

    // 可选：检查数据库里是否存在该 refresh token
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "无效的 refresh token" });
    }

    // 生成新的 access token
    const newAccessToken = jwt.sign(
      { id: user._id, username: user.username },
      SECRET_KEY,
      { expiresIn: "15m" }
    );

    res.json({
      code: 200,
      message: "刷新成功",
      data: { accessToken: newAccessToken },
    });
  } catch (err) {
    res.status(403).json({ message: "refresh token 已过期或无效" });
  }
});

// 需要鉴权的接口
app.get("/profile", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    res.json({ message: "获取成功", user });
  });
});

app.get("/getEmployeesData", async (req, res) => {
  try {
    // 从 query 里取分页参数
    const page = parseInt(req.query.page) || 1; // 当前页
    const limit = parseInt(req.query.limit) || 1000; // 每页条数，默认 1000
    const skip = (page - 1) * limit;

    // 查询员工并 populate 部门
    const employees = await Employee.find()
      .populate("departmentId", "name") // 只取部门的 name 字段
      .skip(skip)
      .limit(limit)
      .lean(); // lean() 提升查询性能

    // 总数
    const total = await Employee.countDocuments();

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: employees.map((emp) => ({
        ...emp,
        department: emp.departmentId?.name || null, // 返回部门名
        departmentId: undefined, // 不返回原始 id
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "服务器错误" });
  }
});

app.get("/getAllEmployeesData", ExpoEmployeesData);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
