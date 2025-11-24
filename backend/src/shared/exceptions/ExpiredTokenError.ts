import AppError from "./AppError";

export default class ExpiredTokenError extends AppError {
  constructor() {
    super("Expired jwt token", 401);
  }
}
