import AppError from "./AppError";

export default class PasswordMismatchError extends AppError {
  constructor() {
    super("Credenciais Inválidas", 400);
  }
}
