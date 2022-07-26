import { TapiError, createResolver, createRouter } from "next-tapi";
import { StandardResponse } from "lib/types/shared";
import { testSchema } from "lib/schemas/posts";
import { authMiddleware } from "server/middleware/auth";
import { loggerMiddleware } from "server/middleware/log";

const r = createRouter<StandardResponse>()
  .middleware(loggerMiddleware)
  .middleware(authMiddleware);

const get = r
  .middleware(({ next, fields }) => {
    return next({
      body: {
        idk: 1,
      },
    });
  })
  .query((query) => {
    if (typeof query.id === "string")
      return {
        ...query,
        id: query.id,
      };
    if (Array.isArray(query.id))
      return {
        ...query,
        id: query.id[1],
      };

    throw new TapiError({ message: "oh no!" });
  })
  .get(({ fields, query }) => {
    query.id;

    return {
      success: true,
      data: {
        some: "data",
        query,
        fields,
      },
    };
  });

const post = r
  .middleware(({ next, req }) => {
    console.log(req.query);
    return next();
  })
  .body(testSchema.parse)
  .post(({ body, query, res, req }) => {
    res.status(201);
    return {
      success: true,
      data: {
        body,
        query,
      },
    };
  });

export default r.export();
