import { NextApiHandler } from "next";
import { ApiError } from "./ApiError";
import { defaultErrorHandler } from "./errorHandler";
import { ErrorHandler } from "./types";
import { Methods } from "./types/methods";
import { RouterMiddleware } from "./types/middleware";
import {
  HandlerWrapper,
  HandlerWrapperWithMiddleware,
  RouteHandlerObject,
  SetHandlerObject,
} from "./types/router";

export class Router {
  private errorHandler: ErrorHandler = defaultErrorHandler;

  private routeHandlers: {
    [method in Methods]: RouteHandlerObject;
  } = {
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

  private setHandler: SetHandlerObject = (
    method: Methods,
    routeHandler: RouteHandlerObject
  ) => {
    this.routeHandlers[method] = routeHandler;
  };

  public middleware = <Ms extends RouterMiddleware<any, any>[]>(
    middleware: Ms
  ) => {
    return new MiddlewareRouter<Ms>(this.setHandler, middleware);
  };

  private createRoute =
    (method: Methods) =>
    <Res extends Record<string, any>>(handler: HandlerWrapper<Res>) => {
      this.setHandler(method, {
        handler,
        middleware: [],
      });
      return handler;
    };

  public get = this.createRoute("get");
  public post = this.createRoute("post");
  public delete = this.createRoute("delete");
  public put = this.createRoute("put");
  public patch = this.createRoute("patch");

  export(): NextApiHandler {
    return async (req, res) => {
      try {
        let routeHandler: RouteHandlerObject | undefined;

        switch (req.method) {
          case "GET":
            if (!this.routeHandlers.get) break;
            routeHandler = this.routeHandlers.get;
            break;
          case "POST":
            if (!this.routeHandlers.post) break;
            routeHandler = this.routeHandlers.post;
            break;
          case "PUT":
            if (!this.routeHandlers.put) break;
            routeHandler = this.routeHandlers.put;
            break;
          case "PATCH":
            if (!this.routeHandlers.patch) break;
            routeHandler = this.routeHandlers.patch;
            break;
          case "DELETE":
            if (!this.routeHandlers.delete) break;
            routeHandler = this.routeHandlers.delete;
            break;
        }

        if (!routeHandler || !routeHandler.handler)
          throw new ApiError(405, `${req.method} method not allowed`);

        const fields: { [key: PropertyKey]: any } = {};
        for (const middleware of routeHandler.middleware) {
          const middlewareFields = await middleware(req);

          if (typeof middlewareFields !== "object") continue;
          Object.entries(middlewareFields).forEach(([key, value]) => {
            fields[key] = value;
          });
        }
        const resp = await routeHandler.handler(req, fields);
        return res.status(200).json(resp);
      } catch (err) {
        return this.errorHandler(res, err);
      }
    };
  }
}

class MiddlewareRouter<Ms extends RouterMiddleware<any, any>[]> {
  private setHandler: SetHandlerObject;
  private middleware: Ms;

  constructor(setHandler: SetHandlerObject, middleware: Ms) {
    this.setHandler = setHandler;
    this.middleware = middleware;
  }

  private createRoute =
    (method: Methods) =>
    <Res>(handler: HandlerWrapperWithMiddleware<Ms, Res>) => {
      this.setHandler(method, {
        middleware: this.middleware,
        handler,
      });
      return handler;
    };

  public get = this.createRoute("get");
  public post = this.createRoute("post");
  public delete = this.createRoute("delete");
  public put = this.createRoute("put");
  public patch = this.createRoute("patch");
}
