import { NextApiRequest, NextApiResponse } from "next";
import { createMocks, RequestMethod } from "node-mocks-http";
import { Router } from "../index";

const r = new Router();
const handler = r.export();

describe.each<RequestMethod>(["GET", "POST", "DELETE", "PUT", "PATCH"])(
  "request",
  (method) => {
    it(`${method} should return 405 response`, async () => {
      const { req, res } = createMocks({
        method,
      });

      await handler(
        req as unknown as NextApiRequest,
        res as unknown as NextApiResponse
      );
      const data = JSON.parse(res._getData());

      expect(res._getStatusCode()).toBe(405);
      expect(data.error.message).toContain(method);
      expect(data.error.message).toContain("method");
      expect(data.error.message).toContain("not");
    });
  }
);
