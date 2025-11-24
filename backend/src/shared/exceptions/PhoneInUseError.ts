import AppError from "./AppError";

export default class PhoneInUseError extends AppError {
  constructor(phone: string) {
    super(`Phone in use: ${phone}`, 400);
  }
}
