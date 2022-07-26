import { TapiError } from "./TapiError";
import { ErrorHandler } from "./types";
import { ErrorResponse, ErrorStatusCodes } from "./types/statusCodes";

const DEFAULT_ERROR_CODE = 400;
const DEFAULT_ERROR_MESSAGE = "There was an error :(";

export const defaultErrorHandler: ErrorHandler<ErrorResponse> = (
  req,
  res,
  err
) => {
  let status: ErrorStatusCodes = DEFAULT_ERROR_CODE;
  let message = DEFAULT_ERROR_MESSAGE;

  if (err instanceof TapiError) {
    status = err.status;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  return res.status(status).json({
    success: false,
    error: {
      message,
      status,
    },
  });
};
