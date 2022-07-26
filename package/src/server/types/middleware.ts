import { NextApiRequest, NextApiResponse } from "next";
import { createMiddleware } from "../createMiddleware";
import { z } from "zod";
import { createRouter } from "../Router";
import { EmptyObject } from "./utils";

export type MiddlewareNext = <R extends {} | undefined>(
  opt?: R
) => MiddlewareNextResult<R>;
export type MiddlewareNextResult<R extends {} | undefined> = Promise<
  { ok: boolean } & R
>;

export type RouterMiddleware = (options: {
  req: NextApiRequest;
  res: NextApiResponse<EmptyObject>;
  next: MiddlewareNext;
  fields: any;
}) => MiddlewareNextResult<any>;

const authMiddleware = createMiddleware(({ next }) => {
  return next({
    session: {
      user: {
        id: 1,
        name: "next tapi",
      },
    },
  });
});

const logger = createMiddleware(async ({ next }) => {
  const start = Date.now();
  const result = await next();
  const time = Date.now() - start;

  const logTime = (time: number, ok: boolean) => {};
  logTime(time, result.ok);

  return result;
});

type StandardResponse<TData extends {}> = {
  success: true;
  data: TData;
};

const r = createRouter<StandardResponse<{}>>().middleware(authMiddleware);

const get = r
  .middleware(logger)
  .middleware(({ next }) => {
    return next({
      some: "field",
    });
  })
  .middleware(({ next }) => {
    return next({
      another: 150,
    });
  })
  .middleware(async ({ next }) => {
    const result = await next({ age: 123 });
    result.ok;
    return result;
  })
  .middleware(({ next }) => next())
  .query(
    z.object({
      limit: z.number().nullable(),
    }).parse
  )
  .get(({ req, res, fields, query }) => {
    fields.age;
    fields.another;

    return {
      success: true,
      data: {
        standard: "no!",
      },
    };
  });

const put = r.put(({ req, res, fields: { session } }) => {
  return {
    success: true,
    data: {
      session,
    },
  };
});

const bodySchema = z.object({
  name: z.string(),
  age: z.number().nullable(),
});

const querySchema = z.object({
  limit: z.number(),
});

const post = r
  .body(bodySchema.parse)
  .query(querySchema.parse)
  .post(({ req, res, fields, body, query }) => {
    return {
      success: true,
      data: {},
    };
  });
