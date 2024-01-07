import { Schema } from "mongoose";
import { ICard } from "../../@types/card";

const cardSchema = new Schema<ICard>({
  title: { type: String, minlength: 2, maxlength: 256, required: true },
  subtitle: { type: String, minlength: 2, maxlength: 256, required: true },
  description: { type: String, minlength: 2, maxlength: 1024, required: true },
  phone: { type: String, minlength: 9, maxlength: 11, required: true },
  email: {
    type: String,
    unique: true,
    minlength: 5,
    required: true,
  },
  web: { type: String, minlength: 14 },
  userId: { type: String, required: true },
  bizNumber: {
    type: Number,
    required: false,
    default: () => Math.round(Math.random() * 1_000_000),
    // choose randon number
    unique: true,
  },
  likes: [{ type: String }],
});
export { cardSchema };
