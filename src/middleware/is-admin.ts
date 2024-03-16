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
  console.log("adm");

  throw new TaskError("token is missing in Authorization header", 400);
};

const isAdmin: RequestHandler = async (req: any, res: any, next) => {
  const token = extractToken(req);
  const { email } = auth.verifyJWT(token);
  //get user from database
  const user = await User.findOne({ email });

  const isAdmin = user?.isAdmin;
  if (isAdmin) {
    return next();
  }

  return res.status(401).json({ message: "Must be admin" });
};

export { isAdmin, extractToken };
