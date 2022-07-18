import { NextApiHandler, NextApiResponse } from "next";
import { ApiError } from "./ApiError";
import { defaultErrorHandler } from "./errorHandler";
import { ErrorHandler } from "./types";
import { MethodHandler } from "./types/handler";
import { Methods } from "./types/methods";
import { RouterMiddleware } from "./types/middleware";
import { RouteHandlerObject, RouterHandlers } from "./types/router";
import { UnionToIntersection } from "./types/utils";

type RouterMethodReturn<
  Res extends {} = {
    [key: string]: never;
    [key: number]: never;
    [key: symbol]: never;
  }
> = Res;

type RouterMethodMiddleware = RouterMiddleware<any, any>[];

type RouterMethodHandler<
  Res extends RouterMethodReturn,
  Middleware extends RouterMethodMiddleware
> = MethodHandler<UnionToIntersection<ReturnType<Middleware[number]>>, Res>;

export class Router {
  private errorHandler: ErrorHandler = defaultErrorHandler;
  private handlers: RouterHandlers<{}> = {
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
    return {
      get: <Res extends {} = { [_: PropertyKey]: never }>(
        handler: RouterMethodHandler<Res, Ms>
      ) => this._get(middleware, handler),
      post: <Res extends {} = { [_: PropertyKey]: never }>(
        handler: RouterMethodHandler<Res, Ms>
      ) => this._post(middleware, handler),
      delete: <Res extends {} = { [_: PropertyKey]: never }>(
        handler: RouterMethodHandler<Res, Ms>
      ) => this._delete(middleware, handler),
      put: <Res extends {} = { [_: PropertyKey]: never }>(
        handler: RouterMethodHandler<Res, Ms>
      ) => this._put(middleware, handler),
      patch: <Res extends {} = { [_: PropertyKey]: never }>(
        handler: RouterMethodHandler<Res, Ms>
      ) => this._patch(middleware, handler),
    };
  };

  public get = <Res extends {}>(handler: NextApiHandler<Res>) => {
    this.setMethodHandler("get", [], handler);
  };
  public post = <Res extends {}>(handler: NextApiHandler<Res>) => {
    this.setMethodHandler("post", [], handler);
  };
  public delete = <Res extends {}>(handler: NextApiHandler<Res>) => {
    this.setMethodHandler("delete", [], handler);
  };
  public put = <Res extends {}>(handler: NextApiHandler<Res>) => {
    this.setMethodHandler("put", [], handler);
  };
  public patch = <Res extends {}>(handler: NextApiHandler<Res>) => {
    this.setMethodHandler("patch", [], handler);
  };

  private _get = <Ms extends RouterMiddleware<any, any>[], Res extends {}>(
    middleware: Ms,
    handler: RouterMethodHandler<Res, Ms>
  ) => {
    this.setMethodHandler("get", middleware, handler);
  };
  private _post = <Ms extends RouterMiddleware<any, any>[], Res extends {}>(
    middleware: Ms,
    handler: RouterMethodHandler<Res, Ms>
  ) => {
    this.setMethodHandler("post", middleware, handler);
  };
  private _delete = <Ms extends RouterMiddleware<any, any>[], Res extends {}>(
    middleware: Ms,
    handler: RouterMethodHandler<Res, Ms>
  ) => {
    this.setMethodHandler("delete", middleware, handler);
  };
  private _put = <Ms extends RouterMiddleware<any, any>[], Res extends {}>(
    middleware: Ms,
    handler: RouterMethodHandler<Res, Ms>
  ) => {
    this.setMethodHandler("put", middleware, handler);
  };
  private _patch = <Ms extends RouterMiddleware<any, any>[], Res extends {}>(
    middleware: Ms,
    handler: RouterMethodHandler<Res, Ms>
  ) => {
    this.setMethodHandler("patch", middleware, handler);
  };

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
          throw new ApiError(405, `${req.method} method not allowed`);

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
}
