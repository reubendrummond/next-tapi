import { ApiError } from "../ApiError";
import { createMiddleware } from "../createMiddleware";
import zod from "zod";

export const authMiddleware = createMiddleware((req) => {
  return {
    session: {
      user: {
        id: 1,
        username: "someusername",
      },
    },
  };
});

export const validateBodyMiddleware = <T extends zod.ZodObject<any>>(
  schema: T
) => {
  return createMiddleware((req) => {
    try {
      const validatedBody = schema.parse(req.body) as zod.infer<T>;
      return {
        validatedBody,
      };
    } catch (err) {
      throw new ApiError(400, "Body is invalid");
    }
  });
};

export const errorMiddleware = createMiddleware((req) => {
  throw new ApiError(400, "An error!"); // throw errors in middleware

  return {};
});
