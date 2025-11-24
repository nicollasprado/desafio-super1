import AppError from "./AppError";

export default class InvalidTokenError extends AppError {
  constructor() {
    super("Invalid jwt token", 401);
  }
}
