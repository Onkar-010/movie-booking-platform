/** @format */

import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { AppError } from "../utilities/appError.utility";

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.issues.map((i) => i.message).join(", ");
      return next(new AppError(message, 400));
    }

    // Replace body with the cleaned, trimmed, typed data
    req.body = result.data;
    next();
  };
}
