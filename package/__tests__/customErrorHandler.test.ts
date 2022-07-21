import { NextApiRequest, NextApiResponse } from "next";
import { createMocks, RequestMethod } from "node-mocks-http";
import { createMiddleware, Router, ApiError, ErrorHandler } from "../index";

const MY_CUSTOM_ERROR_MESSAGE = "Custom!!!";
const DEFAULT_ERROR_STATUS = 123;

class MyCustomError extends Error {
  status: number;

  constructor(status: number) {
    super(MY_CUSTOM_ERROR_MESSAGE);
    this.status = status;
  }
}

const customErrorHandler: ErrorHandler<{
  success: false;
  error: {
    message: string;
    status: number;
  };
}> = (res, err) => {
  let status = DEFAULT_ERROR_STATUS;
  let message = "";

  if (err instanceof MyCustomError) {
    status = err.status;
    message = err.message;
  }

  return res.status(status).json({
    success: false,
    error: {
      status,
      message,
    },
  });
};

const r = new Router({ errorHandler: customErrorHandler });

r.get((req) => {
  throw new ApiError(403, "A message");
  return {};
});
r.post((req) => {
  throw new Error("This message should not show");
  return {};
});
r.delete((req) => {
  throw new MyCustomError(403);
  return {};
});

const handler = r.export();

describe.each<RequestMethod>(["GET", "POST"])("request", (method) => {
  it(`${method} should return correct response`, async () => {
    const { req, res } = createMocks({
      method,
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse
    );
    const data = JSON.parse(res._getData());

    expect(res._getStatusCode()).toBe(DEFAULT_ERROR_STATUS);
    expect(data.error.message).toBe("");
  });
});

describe("request", () => {
  it(`DELETE should return correct response`, async () => {
    const { req, res } = createMocks({
      method: "DELETE",
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse
    );
    const data = JSON.parse(res._getData());

    expect(res._getStatusCode()).toBe(403);
    expect(data.error.message).toBe(MY_CUSTOM_ERROR_MESSAGE);
  });
});
