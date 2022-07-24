import { RouterMiddleware, UnwrapMiddleware } from "./middleware";
import { Methods } from "./methods";
import { MethodHandler } from "./handler";
import { NextApiRequest, NextApiResponse } from "next";
import { UnionToIntersection } from "./utils";

// export type RouterMethodHandler<
//   R extends {} = {
//     [key: PropertyKey]: never;
//   }
// > = <Ms extends RouterMiddleware<any>[]>(
//   middleware: Ms,
//   handler: MethodHandler<UnwrapMiddleware<Ms>, R>
// ) => void;

// export type RouterHandlers<T> = {
//   [key in Methods]: RouteHandlerObject;
// };

export type HandlerWrapper<Res extends {}> = (p: {
  req: NextApiRequest;
  res: NextApiResponse<Res>;
}) => Res | Promise<Res>;

export type HandlerWrapperWithMiddleware<
  Ms extends RouterMiddleware<any, any>[],
  Res extends {}
> = (
  p: { req: NextApiRequest; res: NextApiResponse<Res> },
  fields: UnionToIntersection<ReturnType<Ms[number]>>
) => Res | Promise<Res>;

export type RouteHandlerObject = {
  handler: HandlerWrapperWithMiddleware<
    RouterMiddleware<any, any>[],
    {}
  > | null;
  middleware: RouterMiddleware<any, any>[];
};

export type SetHandlerObject = (
  method: Methods,
  routeHandler: RouteHandlerObject
) => void;
