import Joi from "joi";
import { IUser } from "../@types/user";
import { phoneRegex } from "./patterns";

const schema = Joi.object<IUser>({
  email: Joi.string().email().min(5).required(),
  firstName: Joi.string().min(1).max(50).required(),
  lastName: Joi.string().min(1).max(100).required(),
  phone: Joi.string().pattern(phoneRegex).min(9).max(11).required(),
});

export { schema as joiEditUserSchema };
