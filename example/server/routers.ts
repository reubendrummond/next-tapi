import { authMiddleware } from "server/middleware/auth";
import { createRouter } from "next-tapi";
import { StandardSuccessResponse } from "lib/types/shared";

export const mainRouter = () => {
  return createRouter<StandardSuccessResponse<{}>>();
};

export const authRouter = () => {
  return createRouter<StandardSuccessResponse<{}>>().middleware(authMiddleware);
};
