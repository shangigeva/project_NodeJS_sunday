import Joi from "joi";
import { ITask } from "../@types/task";

const schema = Joi.object<ITask>({
  title: Joi.string().min(2).max(256).required(),
});

export { schema as joiTaskSchema };
