import Joi from "joi";
import { ICard } from "../@types/task";

const schema = Joi.object<ICard>({
  title: Joi.string().min(2).max(256).required(),
});

export { schema as joiCardSchema };
