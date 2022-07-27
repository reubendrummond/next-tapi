import { NextApiRequest, NextApiResponse } from "next";
import {
  MiddlewareNext,
  MiddlewareNextResult,
  RouterMiddleware,
} from "./types/middleware";
import { EmptyObject } from "./types/utils";

export const createMiddleware = <R>(
  middleware: ({
    req,
    res,
    next,
  }: {
    req: NextApiRequest;
    res: NextApiResponse<never>;
    next: MiddlewareNext;
  }) => MiddlewareNextResult<R>
) => {
  return middleware;
};
