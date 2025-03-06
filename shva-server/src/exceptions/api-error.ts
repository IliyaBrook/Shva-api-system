export default class ApiError extends Error {
  status: number;
  errors: unknown[];
  constructor(status: number, message: string, errors: unknown[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
  static UnauthorizedError(): ApiError {
    return new ApiError(401, 'Unauthorized');
  }
  static BadRequest(message: string, errors: unknown[] = [])  {
    return new ApiError(400, message, errors);
  }
}