import AppError from "./AppError";

export default class ServiceAlreadyExistsError extends AppError {
  constructor(name: string) {
    super(`Service already exists: ${name}`, 400);
  }
}
