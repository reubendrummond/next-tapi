import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { createMocks, RequestMethod } from "node-mocks-http";
import { createRouter, TapiError } from "../index";
import { z } from "zod";

const testSchema = z.object({
  name: z.string(),
  age: z.number().int(),
});

const validPost = {
  name: "NextTapi",
  age: 0,
};

const invalidPost1 = {
  name: "NextTapi",
  age: 0.01,
};

const invalidPost2 = {};

let handler: NextApiHandler<any>;

describe("request", () => {
  beforeEach(() => {
    const r = createRouter();
    r.body(testSchema.parse).post(() => {
      return { success: true };
    });
    handler = r.export();
  });

  it.each([validPost])(`POST should return success response`, async (body) => {
    const { req, res } = createMocks({
      method: "POST",
      body,
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse
    );
    const data = JSON.parse(res._getData());

    expect(res._getStatusCode()).toBe(200);
    expect(data.success).toBe(true);
  });
});

it.each([invalidPost1, invalidPost2])(
  "body should throw error",
  async (body) => {
    const { req, res } = createMocks({
      method: "POST",
      body,
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse
    );
    const data = JSON.parse(res._getData());

    expect(res._getStatusCode()).toBe(400);
    expect(data.success).toBe(false);
  }
);
