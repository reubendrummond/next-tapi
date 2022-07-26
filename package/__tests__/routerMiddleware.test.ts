import next, { NextApiRequest, NextApiResponse } from "next";
import { createMocks, RequestMethod } from "node-mocks-http";
import { createMiddleware, createRouter } from "../index";

const r = createRouter();

const someMiddleware = createMiddleware(({ next }) => {
  return next({
    data: "someMiddleware",
  });
});

const delay = createMiddleware(async ({ next }) => {
  await new Promise((res) => setTimeout(res, 100));
  return next();
});

const logger = createMiddleware(async ({ next }) => {
  const start = Date.now();
  const result = await next();
  const dif = Date.now() - start;

  expect(dif).toBeGreaterThan(100);

  return result;
});

describe.each<RequestMethod>(["GET"])("request", (method) => {
  r.middleware(logger)
    .middleware(someMiddleware)
    .middleware(delay)
    .get(({ fields }) => {
      expect(fields.data).toBe("someMiddleware");

      return {
        data: "Regular response",
      };
    });

  const handler = r.export();

  it(`${method} should not throw an error`, async () => {
    const { req, res } = createMocks({
      method,
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse
    );

    const data = JSON.parse(res._getData());

    expect(data.data).toBe("Regular response");
    expect(res._getStatusCode()).toBe(200);
  });
});
