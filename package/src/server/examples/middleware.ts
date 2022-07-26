import { ApiError } from "../ApiError";
import { createMiddleware } from "../createMiddleware";
import zod from "zod";

export const authMiddleware = createMiddleware(({ req, res, next }) => {
  return next({
    session: {
      user: {
        id: 1,
        username: "someusername",
      },
    },
  });
});

export const validateBodyMiddleware = <T extends zod.ZodObject<any>>(
  schema: T
) => {
  return createMiddleware(({ req, next }) => {
    try {
      const validatedBody = schema.parse(req.body) as zod.infer<T>;
      return next({
        validatedBody,
      });
    } catch (err) {
      throw new ApiError(400, "Body is invalid");
    }
  });
};

export const errorMiddleware = createMiddleware(({ req, next }) => {
  if (Math.random() < 0.5) throw new ApiError(400, "An error!"); // throw errors in middleware

  return next();
});
