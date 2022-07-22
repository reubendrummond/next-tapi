import { Router } from "../index";
import { createMocks, RequestMethod } from "node-mocks-http";
import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../src/server/examples/middleware";

const body = { data: "Next Tapi" };

const r = new Router().globalMiddleware([authMiddleware]);

r.get((res, { session }) => {
  return {
    session,
  };
});

r.post((req, { session }) => {
  return {
    session,
  };
});

r.put((req, { session }) => {
  return {
    session,
  };
});

r.delete((req, { session }) => {
  return {
    session,
  };
});

r.patch((req, { session }) => {
  return {
    session,
  };
});

const handler = r.export();

describe.each<RequestMethod>(["GET", "POST", "DELETE", "PUT", "PATCH"])(
  "request",
  (method) => {
    it(`${method} should return 200 response`, async () => {
      const { req, res } = createMocks({
        method,
        body,
      });

      await handler(
        req as unknown as NextApiRequest,
        res as unknown as NextApiResponse
      );

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData()).session).toBeDefined();
    });
  }
);
