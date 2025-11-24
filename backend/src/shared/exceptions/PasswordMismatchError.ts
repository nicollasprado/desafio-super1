import AppError from "./AppError";

export default class PasswordMismatchError extends AppError {
  constructor() {
    super("Invalid credentials", 400);
  }
}
