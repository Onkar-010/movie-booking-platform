/** @format */

import { JWTUtility } from "../utilities/jwt.utility";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utilities/appError.utility";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        tokenId: string;
      };
    }
  }
}

/**
 * Understand what happens in this code
        1. req.get("authorization") reads the client's authorization header.
        2. The regular expression extracts the token from Bearer <token>.
        3. JWTUtility.verifyAccessToken(token) verifies its signature, expiry, issuer, audience and token-use claim.
        4. req.auth makes the verified user ID available to downstream handlers.
        5. next() allows the request to continue only when verification succeeds.
 */

export function authenticateAccessToken(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authorization = req.get("authorization");
  if (!authorization) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  const match = authorization.match(/^Bearer\s+(\S+)$/i);
  const token = match?.[1];

  if (!token) {
    res.status(401).json({
      message: "Invalid authorization header",
    });
    return;
  }

  try {
    const payload = JWTUtility.verifyAccessToken(token);

    req.auth = {
      userId: payload.sub,
      tokenId: payload.jti,
    };

    next();
  } catch (error: unknown) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError("Access token expired", 401));
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Invalid access token", 401));
    }

    return next(error);
  }
}
