import { Router } from "../router";
import { StandardResponse } from "../types/responses";
import { authMiddleware } from "./middleware";

const r = new Router();

r.middleware([authMiddleware]).get<StandardResponse<{ status: number }>>(
  (req, res, fields) => {
    return res.status(200).json({ success: true, data: { status: 200 } });
  }
);
