import { ErrorStatusCodes } from "./types/statusCodes";

export class ApiError extends Error {
  status: ErrorStatusCodes;

  constructor(status: ErrorStatusCodes, message: string) {
    super(message);
    this.status = status;
  }
}
