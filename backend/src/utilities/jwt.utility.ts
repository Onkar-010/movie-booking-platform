/** @format */

import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { config } from "../config/index";

const JWT_ISSUER: string = "auth-service";
const JWT_AUDIENCE: string = "booking-api";
const JWT_ALGORITHM = "HS256" as const;

interface AccessTokenPayload extends JwtPayload {
  sub: string;
  tokenUse: "access";
  jti: string;
}

function getAccessSecret(): string {
  const secret = config.jwt.secret;

  if (!secret || Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error(
      "JWT_ACCESS_SECRET must be configured with at least 32 bytes",
    );
  }

  return secret;
}

function getAccessExpiry(): SignOptions["expiresIn"] {
  const expiry = config.jwt.expiry;

  if (!/^\d+(s|m|h|d)$/.test(expiry)) {
    throw new Error("Invalid JWT_ACCESS_EXPIRES_IN format");
  }

  return expiry as SignOptions["expiresIn"];
}

export class JWTUtility {
  static signAccessToken(userId: string): string {
    //check userId is Present
    if (!userId) {
      throw new Error("User Id is Required");
    }

    return jwt.sign({ tokenUse: "access" }, getAccessSecret(), {
      algorithm: JWT_ALGORITHM,
      subject: userId,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      expiresIn: getAccessExpiry(),
      jwtid: randomUUID(),
    });
  }

  static verifyAccessToken(token: string): AccessTokenPayload {
    const decoded = jwt.verify(token, getAccessSecret(), {
      algorithms: [JWT_ALGORITHM],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });

    if (
      typeof decoded === "string" ||
      decoded.tokenUse !== "access" ||
      typeof decoded.sub !== "string" ||
      decoded.sub.length === 0 ||
      typeof decoded.jti !== "string" ||
      decoded.jti.length === 0
    ) {
      throw new jwt.JsonWebTokenError("Invalid access token claims");
    }

    return decoded as AccessTokenPayload;
  }
}
