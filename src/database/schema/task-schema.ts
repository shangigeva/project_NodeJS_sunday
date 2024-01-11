import { Schema } from "mongoose";
import { ICard } from "../../@types/task";

const taskShema = new Schema<ICard>({
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
