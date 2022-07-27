import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { NextApiRequestQuery } from "next/dist/server/api-utils";
import { Methods } from "./methods";
import { RouterMiddleware, MiddlewareNextResult } from "./middleware";

export type QueryResolver<TRes extends {}> = (
  query: NextApiRequestQuery
) => TRes;
export type BodyResolver<TRes extends {}> = (body: any) => TRes;

export type MethodDefinition = {
  handler: Handler<any, any, any, any> | null;
  middleware: RouterMiddleware[];
  bodyResolver: BodyResolver<any> | null;
  queryResolver: QueryResolver<any> | null;
};

export type DispatcherOptions = MethodDefinition & {
  method: Methods;
};

export type Handler<TRes, TMiddlewareFields, TBody, TQuery> = ({
  req,
  res,
  fields,
  body,
  query,
}: {
  req: NextApiRequest;
  res: NextApiResponse<never>;
  fields: TMiddlewareFields;
  body: TBody extends {} ? TBody : undefined;
  query: TQuery extends {} ? TQuery : undefined;
}) => TRes;

export type DispatchHandler = (options: DispatcherOptions) => void;

export type OnMiddlewareRecursed = <TFields extends {}>(
  req: NextApiRequest,
  res: NextApiResponse,
  fields: TFields
) => MiddlewareNextResult<{}>;

export type RouterOptions = {
  dispatcher: DispatchHandler;
  middleware: RouterMiddleware[];
  bodyResolver: BodyResolver<any> | null;
  queryResolver: QueryResolver<any> | null;
  export: () => NextApiHandler;
};
