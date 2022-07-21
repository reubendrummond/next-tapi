import { Router } from "../index";
import {
  validateBodyMiddleware,
  authMiddleware,
  errorMiddleware,
} from "../src/server/examples/middleware";
import zod from "zod";
import { ApiError } from "../index";
import { createMocks, RequestMethod } from "node-mocks-http";
import { NextApiRequest, NextApiResponse } from "next";

const testBody = zod.object({
  id: zod.number(),
  name: zod.string(),
  email: zod.string().email(),
});

const validBody: zod.infer<typeof testBody> = {
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

const r = new Router();

r.middleware([authMiddleware, errorMiddleware]).get((re, { session }) => {
  throw new ApiError(403, "You are not authorised!");

  return {
    session,
  };
});

r.middleware([authMiddleware, validateBodyMiddleware(testBody)]).post(
  (req, { session, validatedBody }) => {
    return {
      session,
      validatedBody,
    };
  }
);

r.middleware([authMiddleware, validateBodyMiddleware(testBody)]).put(
  (req, { session, validatedBody }) => {
    return {
      session,
      validatedBody,
    };
  }
);

r.middleware([authMiddleware, validateBodyMiddleware(testBody)]).delete(
  (req, { session, validatedBody }) => {
    return {
      session,
      validatedBody,
    };
  }
);

r.middleware([authMiddleware, validateBodyMiddleware(testBody)]).patch(
  (req, { session, validatedBody }) => {
    return {
      session,
      validatedBody,
    };
  }
);

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
          validatedBody: validBody,
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
