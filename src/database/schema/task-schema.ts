import { Schema } from "mongoose";
import { ITask } from "../../@types/task";

const taskShema = new Schema<ITask>({
  userId: { type: String, required: true },
  bizNumber: {
    type: Number,
    required: false,
    default: () => Math.round(Math.random() * 1_000_000),
    // choose randon number
    unique: true,
  },
});
export { taskShema };
