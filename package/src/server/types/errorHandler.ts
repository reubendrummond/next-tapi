import { NextApiResponse } from "next";
import { StandardErrorResponse } from "./responses";

export type ErrorHandler<R = {}> = (res: NextApiResponse<R>, err: any) => void;
