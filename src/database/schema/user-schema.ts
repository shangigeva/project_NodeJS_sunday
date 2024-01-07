import { Schema } from "mongoose";

import { IUser } from "../../@types/user";

const userSchema = new Schema<IUser>({
  firstName: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 256,
  },

  lastName: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 256,
  },
  phone: {
    required: true,
    type: String,
    minlength: 9,
    maxlength: 15,
  },
  email: {
    unique: true,
    required: true,
    type: String,
    minlength: 7,
    maxlength: 20,
  },
  password: {
    required: true,
    type: String,
    minlength: 8,
    maxlength: 100,
  },
  isAdmin: {
    type: Boolean,
    required: false,
    default: false,
  },
  createdAt: {
    type: Date,
    required: false,
    default: new Date(),
  },
  failedLoginAttempts: { type: Number, default: 0, required: false },
  lastFailedLogin: { type: Date, required: false },
});

export { userSchema };
