import mongoose from "mongoose";
import { taskSchema } from "../schema/task-schema";

const Task = mongoose.model("tasks", taskSchema);
export { Task };
