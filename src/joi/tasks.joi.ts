import Joi from "joi";
import { ITask } from "../@types/task";

const schema = Joi.object<ITask>({
  title: Joi.string().min(2).max(200).required(),
  subtitle: Joi.string().min(2).max(200).required(),
  status: Joi.string().min(2).max(200).required(),
  priority: Joi.string().min(2).max(200).required(),
  label: Joi.string().min(2).max(200).required(),
  owner: Joi.string().min(2).max(200).required(),
});

export { schema as joiTaskSchema };
