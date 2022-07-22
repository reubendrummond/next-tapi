import { createMiddleware } from "next-tapi";
import { authRouter } from "server/routers";

const router = authRouter();

router
  .middleware([
    createMiddleware((req) => {
      return {
        newField: "value",
      };
    }),
  ])
  .get((req, { session, newField }) => {
    return {
      session,
      newField,
    };
  });

export default router.export();
