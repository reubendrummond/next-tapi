import { createRouter } from "../index";
import { createMocks, RequestMethod } from "node-mocks-http";
import { NextApiRequest, NextApiResponse } from "next";

const body = { data: "Next Tapi" };
const unauthorisedMessage = "You are not authorised!";

const r = createRouter();

r.get((res) => {
  return {
    body,
  };
});

r.post((req) => {
  return {
    body,
  };
});

r.put((req) => {
  return {
    body,
  };
});

r.delete((req) => {
  return {
    body,
  };
});

r.patch((req) => {
  return {
    body,
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
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          body: body,
        })
      );
    });
  }
);
