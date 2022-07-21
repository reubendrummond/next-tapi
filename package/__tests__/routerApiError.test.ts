import { NextApiRequest, NextApiResponse } from "next";
import { createMocks, RequestMethod } from "node-mocks-http";
import { createMiddleware, Router } from "../index";
import { ApiError } from "../index";

const unauthorisedMessage = "You are not authorised!";
const r = new Router();

r.get((req) => {
  throw new ApiError(403, unauthorisedMessage);
  return {};
});
r.post((req) => {
  throw new ApiError(403, unauthorisedMessage);
  return {};
});
r.delete((req) => {
  throw new ApiError(403, unauthorisedMessage);
  return {};
});
r.put((req) => {
  throw new ApiError(403, unauthorisedMessage);
  return {};
});
r.patch((req) => {
  throw new ApiError(403, unauthorisedMessage);
  return {};
});

const handler = r.export();

describe.each<RequestMethod>(["GET", "POST", "DELETE", "PUT", "PATCH"])(
  "request",
  (method) => {
    it(`${method} should return unauthorised response`, async () => {
      const { req, res } = createMocks({
        method,
      });

      await handler(
        req as unknown as NextApiRequest,
        res as unknown as NextApiResponse
      );
      const data = JSON.parse(res._getData());

      expect(res._getStatusCode()).toBe(403);
      expect(data.error.message).toBe(unauthorisedMessage);
    });
  }
);
