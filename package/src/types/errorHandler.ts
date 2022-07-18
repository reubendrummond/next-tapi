import { NextApiResponse } from "next";
import { StandardErrorResponse } from "./responses";

export type ErrorHandler = (
  res: NextApiResponse<StandardErrorResponse>,
  err: any
) => void;
