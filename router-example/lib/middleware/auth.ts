import { ApiError, createMiddleware } from "next-router";
export const authMiddleware = createMiddleware((req) => {
  // handle unauthenticated
  // throw new ApiError(403, "not alloed :(");

  return {
    session: {
      user: {
        id: 1,
        name: "Bob",
      },
    },
  };
});
