import { SignOptions } from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_EXPIRES_IN?: SignOptions["expiresIn"];
      JWT_SECRET: string;
    }
  }
}
