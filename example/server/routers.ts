import { authMiddleware } from "server/middleware/auth";
import { Router } from "next-tapi";

export const mainRouter = () => {
  return new Router();
};

export const authRouter = () => {
  const r = new Router();
  return r.globalMiddleware([authMiddleware]);
};
