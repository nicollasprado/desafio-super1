import AppError from "./AppError";

export default class EmailInUseError extends AppError {
  constructor(email: string) {
    super(`Email in use: ${email}`, 400);
  }
}
