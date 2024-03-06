import { Schema } from "mongoose";
import { IProject } from "../../@types/project";

const projectSchema = new Schema<IProject>({
  value: {
    type: String,
    minlength: 2,
    maxlength: 200,
    required: true,
    unique: true,
  },
  label: {
    type: String,
    minlength: 2,
    maxlength: 200,
    required: true,
    unique: true,
  },
  createTime: {
    type: Date,
    required: true,
  },
});
export { projectSchema };
