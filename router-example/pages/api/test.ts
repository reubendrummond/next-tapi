import { Router, ApiError } from "next-router";
import { authMiddleware } from "lib/middleware/auth";
import { StandardResponse } from "lib/types/shared";
import { validateBody } from "lib/middleware/validateBody";
import { testSchema } from "lib/schemas/posts";

const router = new Router();

router
  .middleware([authMiddleware])
  .get<StandardResponse<{ session: {} }>>((req, res, { session }) => {
    if (Math.random() < 0.5)
      throw new ApiError(404, "This was not found buddy");

    res.status(200).json({
      success: true,
      data: {
        session,
      },
    });
  });

router
  .middleware([authMiddleware, validateBody(testSchema)])
  .post<StandardResponse<{ session: {}; validatedBody: {} }>>(
    (req, res, { session, validatedBody }) => {
      res.status(200).json({
        success: true,
        data: {
          session,
          validatedBody,
        },
      });
    }
  );

router
  .middleware([authMiddleware])
  .delete<StandardResponse<{ name: string }>>((req, res, fields) => {
    res.status(200).json({
      success: true,
      data: {
        name: "lksjad",
      },
    });
  });

export default router.export();
