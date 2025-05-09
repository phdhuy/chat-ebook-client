export interface ApiError {
  status: string;
  error: {
    code: string;
    message: string;
  };
}
