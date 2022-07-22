import { createMiddleware, Router } from "next-tapi";
import { authRouter } from "server/routers";

const r = new Router({
  errorHandler: (res, err) => {
    // handle error
  },
});

const router = authRouter();

router
  .middleware([
    createMiddleware((req) => {
      return {
        newField: "value",
      };
    }),
  ])
  .get<{ session: {}; newField: {} }>((req, { session, newField }) => {
    return {
      session,
      newField,
    };
  });

router.get<{ name: string }>((req) => {
  return {
    name: "123",
  };
});

export default router.export();
