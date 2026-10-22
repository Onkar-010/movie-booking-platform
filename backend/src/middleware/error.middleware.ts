/** @format */

import { Request, Response, NextFunction } from "express";
import { AppError } from "../utilities/appError.utility";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  console.error("Unexpected error:", err);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
