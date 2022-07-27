import { createRouter } from "../index";
import { authMiddleware } from "../src/server/examples/middleware";
import { z } from "zod";
import { createMocks, RequestMethod } from "node-mocks-http";
import { NextApiRequest, NextApiResponse } from "next";

const testBody = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

const validBody: z.infer<typeof testBody> = {
  id: 123456789,
  name: "Next Tapi",
  email: "me@gmail.com",
};

const invalidBody1 = {
  id: "123456789",
  name: "Next Tapi",
  email: "me@gmail.com",
};

const invalidBody2 = {
  id: 123456789,
  name: "Next Tapi",
  email: "me@gmail",
};

const r = createRouter().middleware(authMiddleware);

r.body(testBody.parse).get(({ fields: { session }, body }) => {
  return {
    session,
    body,
  };
});

r.body(testBody.parse).post(({ fields: { session }, body }) => {
  return {
    session,
    body,
  };
});

r.body(testBody.parse).put(({ fields: { session }, body }) => {
  return {
    session,
    body,
  };
});

r.body(testBody.parse).delete(({ fields: { session }, body }) => {
  return {
    session,
    body,
  };
});

r.body(testBody.parse).patch(({ fields: { session }, body }) => {
  return {
    session,
    body,
  };
});

const handler = r.export();

describe.each<RequestMethod>(["POST", "DELETE", "PUT", "PATCH"])(
  "request",
  (method) => {
    it(`${method} should return 200 response`, async () => {
      const { req, res } = createMocks({
        method,
        body: validBody,
      });

      await handler(
        req as unknown as NextApiRequest,
        res as unknown as NextApiResponse
      );

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          body: validBody,
        })
      );
    });
  }
);

describe.each<RequestMethod>(["POST", "DELETE", "PUT", "PATCH"])(
  "request",
  (method) => {
    describe.each([invalidBody1, invalidBody2])("", (body) => {
      it(`${method} should return 400 response`, async () => {
        const { req, res } = createMocks({
          method,
          body,
        });

        await handler(
          req as unknown as NextApiRequest,
          res as unknown as NextApiResponse
        );

        expect(res._getStatusCode()).toBe(400);
      });
    });
  }
);

describe("request", () => {
  it("should return 400 response", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse
    );
    const data = JSON.parse(res._getData());

    expect(res._getStatusCode()).toBe(400);
  });
});
