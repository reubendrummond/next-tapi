import { TapiError, createMiddleware } from "next-tapi";
export const authMiddleware = createMiddleware(async ({ next }) => {
  // handle unauthenticated
  // throw new ApiError(403, "not alloed :(");

  await new Promise((res) => setTimeout(res, 300));

  return next({
    session: {
      user: {
        id: 1,
        name: "Bob",
      },
    },
  });
});
