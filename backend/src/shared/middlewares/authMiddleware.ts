import { NextFunction, Request, Response } from "express";
import InvalidTokenError from "../exceptions/InvalidTokenError";
import JwtService from "../services/JwtService";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw new InvalidTokenError();
  }

  const [_, token] = authorization.split("Bearer ");

  if (!token) {
    throw new InvalidTokenError();
  }

  try {
    await JwtService.verifyToken(token);
  } catch (err) {
    throw new InvalidTokenError();
  }

  return next();
};

export default authMiddleware;
