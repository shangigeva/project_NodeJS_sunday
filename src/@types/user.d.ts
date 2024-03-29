type IUser = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  isAdmin?: boolean;
  createdAt?: Date;
  _id?: string;
  failedLoginAttempts: number;
  lastFailedLogin: Date;
  picture?: string;
};

type ILogin = {
  email: string;
  password: string;
};

type IJWTDecoded = {
  payload: IJWTPayload;
  iat: number;
  exp: number;
};

type IJWTPayload = {
  _id: string;
  email: string;
  isAdmin: boolean;
};
type IJWTPayloadUserId = {
  email: string;
  userId: string;
};

export { IUser, ILogin, IJWTDecoded, IJWTPayload, IJWTPayloadUserId };
