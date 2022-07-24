import { NextApiRequest, NextApiResponse } from "next";
import { createMiddleware } from "../createMiddleware";
import { z } from "zod";
import { router } from "../Router";
import { EmptyObject } from "./utils";

export type MiddlewareNext = <R extends {}>(opt?: R) => MiddlewareNextResult<R>;
export type MiddlewareNextResult<R extends {} | undefined> = Promise<
  // {ok: boolean}
  Omit<{ ok: boolean } & R, keyof R>
>;

export type MiddlewareNextResultPromise<R> = Promise<MiddlewareNextResult<R>>;

export type RouterMiddleware = (options: {
  req: NextApiRequest;
  res: NextApiResponse<EmptyObject>;
  next: MiddlewareNext;
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

const r = router<StandardResponse<{}>>().middleware(authMiddleware);

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
    })
  )
  .get(({ req, res, fields, query }) => {
    fields.age;
    fields.another;

    return res.json({
      success: true,
      data: {
        standard: "no!",
      },
    });
  });

const put = r.put(({ req, res, fields: { session } }) => {
  return res.json({
    success: true,
    data: {
      session,
    },
  });
});

const bodySchema = z.object({
  name: z.string(),
  age: z.number().nullable(),
});

const querySchema = z.object({
  limit: z.number(),
});

const post = r
  .body(bodySchema)
  .query(querySchema)
  .post(({ req, res, fields, body, query }) => {
    return res.json({
      success: true,
      data: {},
    });
  });
