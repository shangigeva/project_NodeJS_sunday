import mongoose from "mongoose";
import { projectSchema } from "../schema/projects-schema";

const Project = mongoose.model("projects", projectSchema);
export { Project };
