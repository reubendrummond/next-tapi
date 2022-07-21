import { Router, ApiError } from "next-router";
import { authMiddleware } from "lib/middleware/auth";
import { StandardResponse } from "lib/types/shared";
import { validateBody } from "lib/middleware/validateBody";
import { testSchema } from "lib/schemas/posts";

const router = new Router();

export const get = router
  .middleware([authMiddleware])
  // .get<StandardResponse<{ session: {} }>>((req, { session }) => {
  .get((req, { session }) => {
    if (Math.random() < 0.5)
      throw new ApiError(404, "This was not found buddy");

    return {
      success: true,
      data: {
        session,
      },
    };
  });

const post = router.post<StandardResponse<{ smthn: string }>>((req) => {
  return {
    success: true,
    data: {
      smthn: "a string",
    },
  };
});

router
  .middleware([authMiddleware, validateBody(testSchema)])
  .post((req, { session, validatedBody }) => {
    return {
      success: true,
      data: {
        session,
        validatedBody,
      },
    };
  });

router
  .middleware([authMiddleware])
  .delete<StandardResponse<{ name: string }>>((req, { session }) => {
    return {
      success: true,
      data: {
        name: "lksjad",
        session,
      },
    };
  });

export default router.export();
