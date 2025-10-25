import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: String,
  age: Number,
  position: String,
  salary: Number,
  hireDate: Date,
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "departments" },
});

export const Employee = mongoose.model("Employee", employeeSchema);
