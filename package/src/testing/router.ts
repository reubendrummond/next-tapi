import { ApiError } from "../ApiError";
import { Router } from "../Router";
import { authMiddleware } from "./middleware";

const r = new Router();

r.middleware([authMiddleware]).get<{ status: number }>((req, res, fields) => {
  // throw new ApiError(400, "That was a terrible request");

  return res.status(200).json({ status: 200 });
});

r.middleware([authMiddleware]).get<{ name: string }>((req, res, fields) => {
  return res.status(200).json({
    name: "name here",
  });
});

r.middleware([authMiddleware]).get<{}>((req, res, fields) => {
  return res.json({
    success: true,
    data: {},
  });
});
