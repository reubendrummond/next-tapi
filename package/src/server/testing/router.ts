import { createMiddleware } from "../createMiddleware";
import { router } from "../Router";
import { z } from "zod";

type StandardResponse<TData extends {}> = {
  success: true;
  data: TData;
};

const getSession = async (req: any, res: any) => {
  return {
    user: {
      id: 1,
      name: "test",
    },
  };
};
const authMiddleware = createMiddleware(async ({ req, res, next }) => {
  const session = await getSession(req, res);

  return next(session);
});

const r = router<StandardResponse<{}>>().middleware(authMiddleware);

const get = r
  .middleware(({ next }) => {
    return next({
      age: 123,
    });
  })
  .get(({ req, res, fields, body, query }) => {
    fields.user.id;

    res.status(201);

    if (Math.random() < 0.5)
      return {
        success: true,
        data: {
          insideRandom: true,
        },
      };

    return {
      success: true,
      data: {
        this: "is inferred",
        so: 1000110110,
      },
    };
  });

const post = r
  .body(
    z.object({
      name: z.string(),
      age: z.number(),
      photoURL: z.string().nullable(),
    })
  )
  .post(({ req, res, body }) => {
    return {
      success: true,
      data: {
        body,
      },
    };
  });
