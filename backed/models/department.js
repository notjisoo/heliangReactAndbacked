import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: String,
  location: String,
  manager: String,
});

export const Departments = mongoose.model("departments", departmentSchema);
