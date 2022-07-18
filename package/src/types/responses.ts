export interface StandardSuccessResponse<T extends {}> {
  success: true;
  data: T;
}

export interface StandardErrorResponse {
  success: false;
  error: {
    message: string;
    code: number;
  };
}

export type StandardResponse<T = {}> =
  | StandardSuccessResponse<T>
  | StandardErrorResponse;
