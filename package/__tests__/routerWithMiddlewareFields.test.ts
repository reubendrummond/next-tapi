import { createRouter, TapiError } from "../index";
import { createMocks } from "node-mocks-http";
import { NextApiRequest, NextApiResponse } from "next";

const finalResult = {
  ok: true,
  one: "one",
  two: "two",
  three: "three",
};

describe("request middleware should return", () => {
  it("correct result", async () => {
    const r = createRouter();

    r.middleware(async ({ next, fields }) => {
      expect(fields).toStrictEqual({});
      const result = await next({ one: "one" });
      expect(result).toStrictEqual(finalResult);
      return result;
    })
      .middleware(async ({ next, fields }) => {
        expect(fields).toStrictEqual({ one: "one" });
        const result = await next({ two: "two" });
        expect(result).toStrictEqual(finalResult);
        return result;
      })
      .middleware(async ({ next, fields }) => {
        expect(fields).toStrictEqual({ one: "one", two: "two" });
        const result = await next({ three: "three" });
        expect(result).toStrictEqual(finalResult);
        return result;
      })
      .get(({ fields }) => {
        return {
          fields,
        };
      });

    const handler = r.export();

    const { req, res } = createMocks({
      method: "GET",
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse
    );
    const data = JSON.parse(res._getData());
    const { ok, ...fields } = finalResult;
    expect(data.fields).toStrictEqual(fields);
    expect(res._getStatusCode()).toBe(200);
  });

  it("error result", async () => {
    const r = createRouter();

    r.middleware(async ({ next, fields }) => {
      expect(fields).toStrictEqual({});
      const result = await next({ one: "one" });
      expect(result.ok).toStrictEqual(false);
      throw new TapiError({
        message: "This should be ok",
      });
      return result;
    })
      .middleware(async ({ next, fields }) => {
        throw new TapiError({
          status: 418,
          message: "",
        });
        return next();
      })
      .get(() => {
        return {};
      });

    const handler = r.export();

    const { req, res } = createMocks({
      method: "GET",
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse
    );
    const data = JSON.parse(res._getData());
    expect(data.error.message).toBe("");
    expect(res._getStatusCode()).toBe(418);
  });
});
