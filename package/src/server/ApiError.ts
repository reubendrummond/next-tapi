import { ErrorStatusCodes } from "./types/responses";

export class ApiError extends Error {
  status: ErrorStatusCodes;

  constructor(status: ErrorStatusCodes, message: string) {
    super(message);
    this.status = status;
  }
}
