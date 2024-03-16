import { RequestHandler, Request } from "express";
import { TaskError } from "../error/tasks-error";
import { auth } from "../service/auth-service";
import { User } from "../database/model/user";

const extractToken = (req: Request) => {
  const authHeader = req.header("Authorization");
  if (
    authHeader &&
    authHeader.length > 7 &&
    authHeader.toLowerCase().startsWith("bearer ")
  ) {
    return authHeader.substring(7);
  }
  console.log("omer");

  throw new TaskError("token is missing in Authorization header", 400);
};
const validateToken: RequestHandler = async (req: any, res: any, next) => {
  try {
    const token = extractToken(req);
    const { email } = auth.verifyJWT(token);
    const user = await User.findOne({ email });
    if (!user) throw new TaskError("User does not exist", 401);
    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
};
export { validateToken };
