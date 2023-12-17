import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { IJWTPayloadUserId, IJWTPayload, IJWTDecoded } from "../@types/user";
const authService = {
  hashPassword: (plainTextPassword: string, rounds = 12) => {
    return bcrypt.hash(plainTextPassword, rounds);
  },

  validatePassword: (plainTextPassword: string, hash: string) => {
    return bcrypt.compare(plainTextPassword, hash);
  },

  generateJWT: (payload: IJWTPayload) => {
    const secret = process.env.JWT_SECRET!;
    const expiresIn = "1d";
    return jwt.sign({ payload }, secret, { expiresIn });
  },
  generateJWTUserId: (payload: IJWTPayloadUserId) => {
    const secret = process.env.JWT_SECRET!;
    return jwt.sign({ payload }, secret);
  },
  verifyJWT: (token: string) => {
    try {
      const secret = process.env.JWT_SECRET!;
      console.log(jwt.verify(token, secret));
      const { payload } = jwt.verify(token, secret) as IJWTDecoded;
      return payload;
    } catch (error) {
      console.error("Error verifying JWT:", error);
      throw new Error("Invalid token");
    }
  },

  verifyJWTUserId: (token: string) => {
    try {
      const secret = process.env.JWT_SECRET!;
      const payload = jwt.verify(token, secret, { ignoreExpiration: true });
      return payload as IJWTPayloadUserId;
    } catch (error) {
      console.error("Error verifying JWT:", error);
      throw new Error("Invalid token");
    }
  },
};

// export the entire object:
export { authService as auth };
