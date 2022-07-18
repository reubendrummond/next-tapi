import { RouterMiddleware, UnwrapMiddleware } from "./middleware";
import { Methods } from "./methods";
import { MethodHandler } from "./handler";

export type RouterMethodHandler<
  R extends {} = {
    [key: PropertyKey]: never;
  }
> = <Ms extends RouterMiddleware<any>[]>(
  middleware: Ms,
  handler: MethodHandler<UnwrapMiddleware<Ms>, R>
) => void;

export interface RouteHandlerObject<R extends {}> {
  middleware: RouterMiddleware<any>[];
  handler: MethodHandler<any, R> | null;
}

export type RouterHandlers<T> = {
  [key in Methods]: RouteHandlerObject<T>;
};
