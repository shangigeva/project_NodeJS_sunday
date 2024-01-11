import mongoose from "mongoose";
import { taskShema } from "../schema/task-schema";

const Task = mongoose.model("tasks", taskShema);
export { Task };
