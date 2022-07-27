import {
  StandardErrorResponse,
  StandardSuccessResponse,
} from "lib/types/shared";
import { createRouter, createQueryResolver, ErrorHandler } from "next-tapi";
import { authMiddleware } from "server/middleware";
import * as yup from "yup";

const myCustomErrorHandler: ErrorHandler<StandardErrorResponse> = (
  req,
  res,
  err
) => {
  return res.status(400).json({
    success: false,
    error: {
      message: "O no!",
      status: 400,
    },
  });
};

const router = createRouter<StandardSuccessResponse<{}>, StandardErrorResponse>(
  {
    errorHandler: myCustomErrorHandler,
  }
);

interface UserResponse {
  id: number;
  name: string;
}

const yupSchema = yup.object().shape({
  name: yup.string().required(),
  age: yup.number().integer().required(),
});

router

  .body((body) => yupSchema.cast(body))
  .post(({ body }) => {
    return { success: true, data: { body } };
  });

export default router.export();
