import { NextApiResponse } from "next";

export type ErrorHandler<R extends {} = {}> = (
  res: NextApiResponse<R>,
  err: any
) => void;
