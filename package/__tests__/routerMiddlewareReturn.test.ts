import { NextApiRequest, NextApiResponse } from "next";
import { createMocks, RequestMethod } from "node-mocks-http";
import { createMiddleware, Router } from "../index";
import { ApiError } from "../index";

const unauthorisedMessage = "You are not authorised!";
const r = new Router();

const m1 = createMiddleware((req, res) => {
  res.status(200).json({
    data: "m1",
  });

  return {};
});

const m2 = createMiddleware(() => {
  return {};
});

r.middleware([m1]).get((req) => {
  return {
    data: "Regular response",
  };
});

const handler = r.export();

describe.each<RequestMethod>(["GET"])("request", (method) => {
  it(`${method} should not throw an error`, async () => {
    const { req, res } = createMocks({
      method,
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse
    );

    const data = JSON.parse(res._getData());

    expect(res._getStatusCode()).toBe(200);
  });
});
