import { NextApiRequest, NextApiResponse } from "next";
import { createMocks, RequestMethod } from "node-mocks-http";
import { createMiddleware, createRouter } from "../index";
import { TapiError } from "../index";

const unauthorisedMessage = "You are not authorised!";
const r = createRouter();

r.get((req) => {
  throw new TapiError({ status: 403, message: unauthorisedMessage });
  return {};
});
r.post((req) => {
  throw new TapiError({ status: 403, message: unauthorisedMessage });
  return {};
});
r.delete((req) => {
  throw new TapiError({ status: 403, message: unauthorisedMessage });
  return {};
});
r.put((req) => {
  throw new TapiError({ status: 403, message: unauthorisedMessage });
  return {};
});
r.patch((req) => {
  throw new TapiError({ status: 403, message: unauthorisedMessage });
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
