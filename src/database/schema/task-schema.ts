import { Schema } from "mongoose";
import { ITask } from "../../@types/task";

const taskShema = new Schema<ITask>({
  createTime: {
    type: Date,
    required: true,
    // default: new Date(),
  },
  TaskNumb: {
    type: Number,
    required: false,
    default: () => Math.round(Math.random() * 1_000_000),
    unique: true,
  },
  title: { type: String, minlength: 2, maxlength: 200, required: true },
  subtitle: { type: String, minlength: 2, maxlength: 200, required: true },
  status: { type: String, minlength: 2, maxlength: 200, required: true },
  priority: { type: String, minlength: 2, maxlength: 200, required: true },
  label: { type: String, minlength: 2, maxlength: 200, required: true },
  owner: { type: String, minlength: 2, maxlength: 200, required: true },
  project: { type: String, minlength: 2, maxlength: 200, required: true },
});
export { taskShema };
