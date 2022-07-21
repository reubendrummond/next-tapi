import { ApiError, createMiddleware } from "next-router";
import zod from "zod";

export const validateBody = <T extends zod.ZodObject<any>>(schema: T) => {
  return createMiddleware((req) => {
    try {
      const validatedBody = schema.parse(req.body) as zod.infer<T>;
      return {
        validatedBody,
      };
    } catch (err) {
      // some more specific errors in future
      // console.log(err);
      // throw err;
      throw new ApiError(400, "Body is invalid");
    }
  });
};
