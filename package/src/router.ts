import { NextApiHandler, NextApiResponse } from "next";
import { authMiddleware } from "./testing/middleware";
import { MethodHandler } from "./types/handler";
import { Methods } from "./types/methods";
import { RouterMiddleware } from "./types/middleware";
import { StandardErrorResponse, StandardResponse } from "./types/responses";
import {
  RouteHandlerObject,
  RouterHandlers,
  // RouterMethodHandler,
} from "./types/router";
import { UnionToIntersection } from "./types/utils";

// type DefaultStandardResponse = StandardResponse<{ [key: PropertyKey]: never }>;

// import { IRouter } from "./types/router";

// type RouterMethodHandler<
//   R extends StandardResponse<object> = StandardResponse<{
//     [key: string]: never;
//     [key: number]: never;
//     [key: symbol]: never;
//   }>
// > = <Ms extends RouterMiddleware<any, any>[]>(
//   middleware: Ms,
//   handler: MethodHandler<UnionToIntersection<ReturnType<Ms[number]>>, R>
// ) => void;

type RouterMethodReturn<
  Res extends StandardResponse<object> = StandardResponse<{
    [key: string]: never;
    [key: number]: never;
    [key: symbol]: never;
  }>
> = Res;

type RouterMethodMiddleware = RouterMiddleware<any, any>[];

type RouterMethodHandler<
  Res extends RouterMethodReturn,
  Middleware extends RouterMethodMiddleware
> = MethodHandler<UnionToIntersection<ReturnType<Middleware[number]>>, Res>;

// type RouterMethodWithMiddleware = (
//   middleware: RouterMiddleware<any, any>[],
//   handler: NextApiHandler
// ) => void;

export class Router {
  handlers: RouterHandlers<StandardResponse<{}>> = {
    get: {
      handler: null,
      middleware: [],
    },
    post: {
      handler: null,
      middleware: [],
    },
    delete: {
      handler: null,
      middleware: [],
    },
    put: {
      handler: null,
      middleware: [],
    },
    patch: {
      handler: null,
      middleware: [],
    },
  };
  constructor() {}

  private setMethodHandler(
    method: Methods,
    middleware: RouterMiddleware<object>[],
    handler: MethodHandler<any, any>
  ) {
    this.handlers[method] = {
      middleware,
      handler,
    };
  }

  public middleware = <Ms extends RouterMiddleware<any>[]>(middleware: Ms) => {
    const ret = {
      get: <Res extends StandardResponse>(
        handler: RouterMethodHandler<Res, Ms>
      ) => this._get(middleware, handler),
    };

    return ret;
  };

  // public get<
  //   Res extends StandardResponse = DefaultStandardResponse,
  //   Ms extends RouterMethodMiddleware = RouterMethodMiddleware
  // >(middleware: Ms, handler: RouterMethodHandler<Res, RouterMethodMiddleware>) {
  //   this.setMethodHandler("get", middleware, handler);
  // }

  public get = <Res extends StandardResponse>(handler: NextApiHandler<Res>) => {
    this.setMethodHandler("get", [], handler);
  };

  private _get = <
    Ms extends RouterMiddleware<any, any>[],
    Res extends StandardResponse<{}>
  >(
    middleware: Ms,
    handler: RouterMethodHandler<Res, Ms>
  ) => {
    this.setMethodHandler("get", middleware, handler);
  };

  // public post = <Res>(middleware, handler): RouterMethodHandler<Res> => {
  //   this.setMethodHandler("post", middleware, handler);
  // };
  // public delete: RouterMethodHandler = (middleware, handler) => {
  //   this.setMethodHandler("delete", middleware, handler);
  // };
  // public put: RouterMethodHandler = (middleware, handler) => {
  //   this.setMethodHandler("put", middleware, handler);
  // };
  //   public patch = <R, Ms extends RouterMiddleware<any, any>[]>(middleware: Ms, handler: MethodHandler<UnionToIntersection<ReturnType<Ms[number]>>, R>) => {
  //     this.setMethodHandler("patch", middleware, handler);
  //   };
  // public patch = <R>() => {
  //   <Ms extends RouterMiddleware<any, any>[]>(
  //     middleware: Ms,
  //     handler: MethodHandler<UnionToIntersection<ReturnType<Ms[number]>>, R>
  //   ) => {
  //     this.setMethodHandler("put", middleware, handler);
  //   };
  // };

  export(): NextApiHandler {
    return async (req, res) => {
      try {
        let handler: RouteHandlerObject<any> | undefined;

        switch (req.method) {
          case "GET":
            if (!this.handlers.get) break;
            handler = this.handlers.get;
            break;
          case "POST":
            if (!this.handlers.post) break;
            handler = this.handlers.post;
            break;
          case "PUT":
            if (!this.handlers.put) break;
            handler = this.handlers.put;
            break;
          case "PATCH":
            if (!this.handlers.patch) break;
            handler = this.handlers.patch;
            break;
          case "DELETE":
            if (!this.handlers.delete) break;
            handler = this.handlers.delete;
            break;
        }

        if (!handler || !handler.handler)
          throw new Error(`${req.method} method not supported`);

        const fields: { [key: PropertyKey]: any } = {};
        for (const middleware of handler.middleware) {
          const middlewareFields = await middleware(req);

          if (typeof middlewareFields !== "object") continue;
          Object.entries(middlewareFields).forEach(([key, value]) => {
            fields[key] = value;
          });
        }
        return await handler.handler(req, res, fields);
      } catch (err) {
        return this.errorHandler(res, err);
      }
    };
  }

  private errorHandler(res: NextApiResponse<StandardErrorResponse>, err: any) {
    // if (err instanceof ApiError) {
    // handler ApiErrors
    // }

    if (err instanceof Error) {
      // do some error checking
    }
    return res.status(400).json({
      success: false,
      error: {
        message: "npp",
        code: 123,
      },
    });
  }
}

// const errorHandler = (
//   res: NextApiResponse<StandardErrorResponse>,
//   err: any
// ) => {};

const r = new Router();

r.middleware([authMiddleware]).get<StandardResponse<{ name: string }>>(
  (req, res, fields) => {
    return res.status(200).json({
      success: true,
      data: {
        name: "name here",
      },
    });
  }
);

r.middleware([authMiddleware]).get((req, res, fields) => {});
