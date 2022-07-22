import { createMiddleware, Router } from "../index";
import { createMocks, RequestMethod } from "node-mocks-http";
import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../src/server/examples/middleware";

const body = { data: "Next Tapi" };

const r = new Router().globalMiddleware([authMiddleware]);
const otherMiddleware = createMiddleware((req, res) => {
  return {
    newField: "val",
  };
});

r.middleware([otherMiddleware]).get((res, { session, newField }) => {
  return {
    session,
    newField,
  };
});

r.middleware([otherMiddleware]).post((req, { session, newField }) => {
  return {
    session,
    newField,
  };
});

r.middleware([otherMiddleware]).put((req, { session, newField }) => {
  return {
    session,
    newField,
  };
});

r.middleware([otherMiddleware]).delete((req, { session, newField }) => {
  return {
    session,
    newField,
  };
});

r.middleware([otherMiddleware]).patch((req, { session, newField }) => {
  return {
    session,
    newField,
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
      expect(JSON.parse(res._getData()).newField).toBe("val");
    });
  }
);
