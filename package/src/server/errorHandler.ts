import { ApiError } from "./ApiError";
import { ErrorHandler } from "./types";
import { ErrorStatusCodes } from "./types/responses";

const DEFAULT_ERROR_CODE = 400;
const DEFAULT_ERROR_MESSAGE = "There was an error :(";

export const defaultErrorHandler: ErrorHandler = (res, err) => {
  let status: ErrorStatusCodes = DEFAULT_ERROR_CODE;
  let message = DEFAULT_ERROR_MESSAGE;

  if (err instanceof ApiError) {
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
