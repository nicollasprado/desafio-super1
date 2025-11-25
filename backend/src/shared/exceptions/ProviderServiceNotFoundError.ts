import AppError from "./AppError";

export default class ProviderServiceNotFoundError extends AppError {
  constructor(param?: string, value?: string) {
    if (param && value) {
      super(`ProviderService not found with ${param}: ${value}`);
    } else {
      super("ProviderService not found");
    }
  }
}
