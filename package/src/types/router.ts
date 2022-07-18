import { RouterMiddleware, UnwrapMiddleware } from "./middleware";
import { StandardResponse } from "./responses";
import { Methods } from "./methods";
import { MethodHandler } from "./handler";

// export interface IRouter<T extends StandardResponse> {
//   get: RouterMethodHandler<T>;
//   post: RouterMethodHandler<T>;
//   delete: RouterMethodHandler<T>;
//   put: RouterMethodHandler<T>;
//   patch: RouterMethodHandler<T>;
// }

export type RouterMethodHandler<
  R extends StandardResponse<object> = StandardResponse<{
    [key: PropertyKey]: never;
  }>
> = <Ms extends RouterMiddleware<any>[]>(
  middleware: Ms,
  handler: MethodHandler<UnwrapMiddleware<Ms>, R>
) => void;

export interface RouteHandlerObject<R extends StandardResponse> {
  middleware: RouterMiddleware<any>[];
  handler: MethodHandler<any, R> | null;
}

export type RouterHandlers<T extends StandardResponse> = {
  [key in Methods]: RouteHandlerObject<T>;
};
