import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { Methods } from "./types/methods";
import {
  RouterMiddleware,
  MiddlewareNext,
  MiddlewareNextResult,
} from "./types/middleware";
import { EmptyObject } from "./types/utils";

type DispatcherOptions = {
  method: Methods;
  handler: any;
  middleware: [];
  bodySchema: any;
  querySchema: any;
};

type DispatchHandler = (options: DispatcherOptions) => void;

export const router = <TStandardResponse extends {}>() => {
  const methodDef: {
    [key in Methods]: {
      handler: null;
      middleware: [];
      bodySchema: null;
      querySchema: null;
    };
  } = {
    get: {
      handler: null,
      middleware: [],
      bodySchema: null,
      querySchema: null,
    },
    post: {
      handler: null,
      middleware: [],
      bodySchema: null,
      querySchema: null,
    },
    delete: {
      handler: null,
      middleware: [],
      bodySchema: null,
      querySchema: null,
    },
    put: {
      handler: null,
      middleware: [],
      bodySchema: null,
      querySchema: null,
    },
    patch: {
      handler: null,
      middleware: [],
      bodySchema: null,
      querySchema: null,
    },
  };

  const build = () => {};

  const dispatcher: DispatchHandler = ({ method, ...rest }) => {
    methodDef[method] = rest;
  };

  const router = new Router<TStandardResponse>({
    dispatcher,
    middleware: [],
    bodySchema: null,
    querySchema: null,
    // export: build
  });

  return router;
};

type SubRouterOptions<
  TBody extends z.ZodObject<any> | null,
  TQuery extends z.ZodObject<any> | null
> = {
  dispatcher: DispatchHandler;
  middleware: RouterMiddleware[];
  bodySchema: TBody;
  querySchema: TQuery;
};

const s = z.object({
  input: z.string(),
});

class Router<
  TStandardResponse extends {} = {},
  TMiddlewareFields extends {} = {},
  TBody extends z.ZodObject<any> | null = null,
  TQuery extends z.ZodObject<any> | null = null
> {
  private _dispatcher: DispatchHandler;
  private _middleware: RouterMiddleware[];
  private _bodySchema: TBody;
  private _querySchema: TQuery;

  constructor(options: SubRouterOptions<TBody, TQuery>) {
    this._dispatcher = options.dispatcher;
    this._middleware = options.middleware;
    this._bodySchema = options.bodySchema;
    this._querySchema = options.querySchema;
  }

  middleware = <R extends {}>(
    m: ({
      req,
      res,
      next,
    }: {
      req: NextApiRequest;
      res: NextApiResponse<EmptyObject>;
      next: MiddlewareNext;
    }) => MiddlewareNextResult<R> // sketchhhhh
  ) => {
    return new Router<
      TStandardResponse,
      // TMiddlewareFields & R,
      {
        // this tomfoolery is to combine the object union
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
      bodySchema: this._bodySchema,
      querySchema: this._querySchema,
    });
  };

  public body = <TSchema extends z.ZodObject<any>>(schema: TSchema) => {
    const r = new Router<TStandardResponse, TMiddlewareFields, TSchema, TQuery>(
      {
        middleware: this._middleware,
        dispatcher: this._dispatcher,
        bodySchema: schema,
        querySchema: this._querySchema,
      }
    );

    return {
      get: r.get,
      post: r.post,
      delete: r.delete,
      put: r.put,
      patch: r.patch,
      query: r.query,
    };
  };

  public query = <TSchema extends z.ZodObject<any>>(schema: TSchema) => {
    const r = new Router<TStandardResponse, TMiddlewareFields, TBody, TSchema>({
      middleware: this._middleware,
      dispatcher: this._dispatcher,
      bodySchema: this._bodySchema,
      querySchema: schema,
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
    return <Res extends TStandardResponse>(
      handler: ({
        req,
        res,
        fields,
        body,
        query,
      }: {
        req: NextApiRequest;
        res: Omit<NextApiResponse, "json"> & {
          json: <B extends TStandardResponse>(body: B) => B;
        };
        fields: TMiddlewareFields;
        body: TBody extends z.ZodObject<any> ? z.infer<TBody> : undefined;
        query: TQuery extends z.ZodObject<any> ? z.infer<TQuery> : undefined;
      }) => Res
    ) => {
      // do smthn with handler
      return handler;
    };
  };

  public get = this.createRoute("get");
  public post = this.createRoute("post");
  public delete = this.createRoute("delete");
  public put = this.createRoute("put");
  public patch = this.createRoute("patch");
}
