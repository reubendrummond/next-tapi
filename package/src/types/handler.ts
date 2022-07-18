import { NextApiRequest, NextApiResponse } from "next";
import { StandardResponse } from "./responses";

export type MethodHandler<T, R extends StandardResponse> = (
  req: NextApiRequest,
  res: NextApiResponse<R>,
  fields: T
) => Promise<unknown> | unknown;
