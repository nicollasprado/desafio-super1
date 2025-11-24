import { NextFunction, Request, Response } from "express";
import AppError from "./AppError";
import { StatusCodes } from "http-status-codes";

export default function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
}
