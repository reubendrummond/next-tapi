import { ApiError } from "next-tapi";
import { authMiddleware } from "server/middleware/auth";
import { StandardResponse } from "lib/types/shared";
import { validateBody } from "server/middleware/validateBody";
import { testSchema } from "lib/schemas/posts";
import { mainRouter } from "server/routers";

const router = mainRouter();

export const GET = router
  // .get<StandardResponse<{ session: {} }>>((req, { session }) => {
  .get((req) => {
    if (Math.random() < 0.5)
      throw new ApiError(404, "This was not found buddy");

    return {
      success: true,
      data: {
        thisIsInfered: "so is this type",
      },
    };
  });

export const POST = router
  .middleware([authMiddleware, validateBody(testSchema)])
  .post<StandardResponse<{ session: any; validatedBody: any }>>(
    (req, { session, validatedBody }) => {
      return {
        success: true,
        data: {
          session,
          validatedBody,
        },
      };
    }
  );

export const DELETE = router
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
