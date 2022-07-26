import { NextApiRequest, NextApiResponse } from "next";

export type ErrorHandler<R extends {}> = (
  req: NextApiRequest,
  res: NextApiResponse<R>,
  err: any
) => void;
