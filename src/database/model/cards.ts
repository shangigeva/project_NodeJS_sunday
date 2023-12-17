import mongoose from "mongoose";
import { cardSchema } from "../schema/card-schema";

const Card = mongoose.model("cards", cardSchema);
export { Card };
