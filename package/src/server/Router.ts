import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { NextApiRequestQuery } from "next/dist/server/api-utils";
import { defaultErrorHandler } from "./errorHandler";
import { TapiError } from "./TapiError";
import { ErrorHandler } from "./types";
import { Methods } from "./types/methods";
import {
  RouterMiddleware,
  MiddlewareNext,
  MiddlewareNextResult,
} from "./types/middleware";
import {
  BodyResolver,
  DispatchHandler,
  Handler,
  MethodDefinition,
  OnMiddlewareRecursed,
  QueryResolver,
  RouterOptions,
} from "./types/router";
import { ErrorResponse } from "./types/statusCodes";
import { EmptyObject } from "./types/utils";

export const createRouter = <
  TStandardResponse extends {},
  TStandardErrorResponse extends {} = ErrorResponse
>(options?: {
  errorHandler?: ErrorHandler<TStandardErrorResponse>;
}) => {
  const errorHandler = options?.errorHandler || defaultErrorHandler;

  const methods: ReadonlyArray<Methods> = [
    "get",
    "post",
    "delete",
    "put",
    "patch",
  ];
  const methodDefs = methods.reduce(
    (acc, curr) => {
      acc[curr] = {
        handler: null,
        middleware: [],
        bodyResolver: null,
        queryResolver: null,
      };
      return acc;
    },
    {} as {
      [key in Methods]: MethodDefinition;
    }
  );

  const build = (): NextApiHandler => async (req, res) => {
    try {
      const method = req?.method?.toLowerCase() as Methods | undefined;
      if (!method || !methods.includes(method))
        throw new TapiError({
          message: `${req.method} method not supported`,
          status: 405,
        });
      const { handler, middleware, bodyResolver, queryResolver } =
        methodDefs[method];

      if (!handler)
        throw new TapiError({
          message: `${req.method} method not supported`,
          status: 405,
        });

      const onMiddlewareComplete: OnMiddlewareRecursed = async (
        req,
        res,
        fields
      ) => {
        // validate inputs
        let body: {} | undefined;
        let query: {} | undefined;

        if (bodyResolver) body = bodyResolver(req.body);
        if (queryResolver) query = queryResolver(req.query);

        const response = await handler({ req, res, fields, body, query });
        if (!res.writableFinished) res.json(response);

        return { ok: true, ...fields };
      };

      const callMiddlewareRecursive = async (
        count: number,
        req: NextApiRequest,
        res: NextApiResponse,
        fields: {}
      ): MiddlewareNextResult<{}> => {
        try {
          const m = middleware[count];
          if (!m) return onMiddlewareComplete(req, res, fields);

          const next = ((opts: {} | undefined) => {
            if (typeof opts === "object") {
              fields = { ...fields, ...opts };
            }

            return callMiddlewareRecursive(count + 1, req, res, fields);
          }) as MiddlewareNext;

          return await m({ req, res, next, fields });
        } catch (err) {
          errorHandler(req, res, err);
          return { ok: false, ...fields };
        }
      };

      // go through middleware
      const fields = {};
      await callMiddlewareRecursive(0, req, res, fields);
    } catch (err) {
      return errorHandler(req, res, err);
    }
  };

  const dispatcher: DispatchHandler = ({ method, ...rest }) => {
    methodDefs[method] = rest;
  };

  const router = new Router<TStandardResponse>({
    dispatcher,
    middleware: [],
    bodyResolver: null,
    queryResolver: null,
    export: build,
  });

  return router;
};

class Router<
  TStandardResponse extends {} = {},
  TMiddlewareFields extends {} = {},
  TBody extends {} | null = null,
  TQuery extends {} | null = null
> {
  private _dispatcher: DispatchHandler;
  private _middleware: RouterMiddleware[];
  private _bodyResolver: BodyResolver<any> | null;
  private _queryResolver: QueryResolver<{}> | null;
  private _build: () => NextApiHandler;

  constructor(options: RouterOptions) {
    this._dispatcher = options.dispatcher;
    this._middleware = options.middleware;
    this._bodyResolver = options.bodyResolver;
    this._queryResolver = options.queryResolver;
    this._build = options.export;
  }

  export = () => this._build();

  middleware = <R extends {}>(
    m: ({
      req,
      res,
      next,
      fields,
    }: {
      req: NextApiRequest;
      res: NextApiResponse<never>;
      next: MiddlewareNext;
      fields: TMiddlewareFields;
    }) => MiddlewareNextResult<R> // sketchhhhh
  ) => {
    return new Router<
      TStandardResponse,
      {
        // this tomfoolery is to combine the object union nicely, equivalent to TMiddlewareFields & R
        [Key in
          | keyof TMiddlewareFields
          | keyof R]: Key extends keyof TMiddlewareFields
          ? TMiddlewareFields[Key]
          : Key extends keyof R
          ? R[Key]
          : never;
      },
      TBody,
      TQuery
    >({
      middleware: [...this._middleware, m],
      dispatcher: this._dispatcher,
      bodyResolver: this._bodyResolver,
      queryResolver: this._queryResolver,
      export: this._build,
    });
  };

  public body = <TRes extends {}>(resolver: (body: any) => TRes) => {
    const r = new Router<TStandardResponse, TMiddlewareFields, TRes, TQuery>({
      middleware: this._middleware,
      dispatcher: this._dispatcher,
      bodyResolver: resolver,
      queryResolver: this._queryResolver,
      export: this._build,
    });

    return {
      get: r.get,
      post: r.post,
      delete: r.delete,
      put: r.put,
      patch: r.patch,
      query: r.query,
    };
  };

  public query = <TRes extends {}>(
    resolver: (query: NextApiRequestQuery) => TRes
  ) => {
    const r = new Router<TStandardResponse, TMiddlewareFields, TBody, TRes>({
      middleware: this._middleware,
      dispatcher: this._dispatcher,
      bodyResolver: this._bodyResolver,
      queryResolver: resolver,
      export: this._build,
    });

    return {
      get: r.get,
      post: r.post,
      delete: r.delete,
      put: r.put,
      patch: r.patch,
    };
  };

  private createRoute = (method: Methods) => {
    return <TRes extends TStandardResponse>(
      handler: Handler<TRes, TMiddlewareFields, TBody, TQuery>
    ) => {
      this._dispatcher({
        method,
        handler,
        middleware: this._middleware,
        bodyResolver: this._bodyResolver,
        queryResolver: this._queryResolver,
      });

      return {} as TRes;
    };
  };

  public get = this.createRoute("get");
  public post = this.createRoute("post");
  public delete = this.createRoute("delete");
  public put = this.createRoute("put");
  public patch = this.createRoute("patch");
}
