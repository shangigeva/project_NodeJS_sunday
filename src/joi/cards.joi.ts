import Joi from "joi";
import { ICard } from "../@types/card";

const schema = Joi.object<ICard>({
  title: Joi.string().min(2).max(256).required(),
  subtitle: Joi.string().min(2).max(256).required(),
  description: Joi.string().min(2).max(1024).required(),
  phone: Joi.string().min(9).max(11).required(),
  email: Joi.string().email().required(),
  web: Joi.string().min(14),
});

export { schema as joiCardSchema };
