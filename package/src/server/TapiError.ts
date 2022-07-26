import { ErrorStatusCodes } from "./types/statusCodes";

export class TapiError extends Error {
  status: ErrorStatusCodes;

  constructor(options: { status?: ErrorStatusCodes; message: string }) {
    super(options.message);
    this.status = options.status || 400;
  }
}
