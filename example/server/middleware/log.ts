import { createMiddleware } from "next-tapi";

export const loggerMiddleware = createMiddleware(async ({ next }) => {
  const start = Date.now();
  const result = await next();
  const dif = Date.now() - start;

  console.log(result, dif);
  return result;
});
