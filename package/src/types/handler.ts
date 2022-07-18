import { NextApiRequest, NextApiResponse } from "next";

export type MethodHandler<T, R extends {}> = (
  req: NextApiRequest,
  res: NextApiResponse<R>,
  fields: T
) => Promise<unknown> | unknown;
