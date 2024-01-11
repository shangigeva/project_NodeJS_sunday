import mongoose from "mongoose";
import { taskShema } from "../schema/task-schema";

const Card = mongoose.model("cards", taskShema);
export { Card };
