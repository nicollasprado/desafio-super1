import AppError from "./AppError";

export default class UserNotFoundError extends AppError {
  constructor(param: string, value: any) {
    super(`User not found with ${param}: ${value}`, 400);
  }
}
