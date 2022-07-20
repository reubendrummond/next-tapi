import { RouterMiddleware } from "./types/middleware";
import { IsEmptyObject } from "./types/utils";

export const createMiddleware = <T extends {}>(
  middleware: RouterMiddleware<T>
): RouterMiddleware<
  IsEmptyObject<T> extends true ? Record<PropertyKey, never> : T
> => {
  return middleware;
};
