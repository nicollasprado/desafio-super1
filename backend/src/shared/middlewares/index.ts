import authMiddleware from "./authMiddleware";
import { validation } from "./validation";

const middlewares = {
  validation,
  authMiddleware,
};

export default middlewares;
