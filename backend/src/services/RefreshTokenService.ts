/** @format */

import { refresh_token } from "../db/schemas/refresh_token.schema";
import { RefreshTokenRepository } from "../repositories/refreshToken.repository";
import { AppError } from "../utilities/appError.utility";
import { randomUUID } from "node:crypto";
import {
  getRefreshToken,
  hashRefreshToken,
} from "../utilities/refreshToken.utility";
import { JWTUtility } from "../utilities/jwt.utility";
import { UnitOfWork } from "../infrastructure/database/UnitOfWork";

export class RefreshTokenService {
  //Setting up Model in repo
  private readonly refreshrepo: RefreshTokenRepository<typeof refresh_token>;
  private readonly uow: UnitOfWork;
  constructor() {
    this.refreshrepo = new RefreshTokenRepository(refresh_token);
    this.uow = new UnitOfWork();
  }

  async createRefreshToken(userId: string) {
    //generate a Token
    const token: string = getRefreshToken();
    //Hash a Token
    const token_hash: string = hashRefreshToken(token);

    const family_id = randomUUID();
    //Save in DB
    const data = {
      user_id: userId,
      token_hash,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      family_id,
    };
    const result = await this.refreshrepo.createRefreshToken(data);

    return { result, token };
  }

  async refreshAccessToken(token: string) {
    const token_hash = hashRefreshToken(token);
    // Transaction
    const outcome = await this.uow.transaction(async (tx) => {
      // 1. Find the token.
      const result = await this.refreshrepo.findRefreshTokenByHash(
        token_hash,
        tx,
      );

      // 2. Validate existence and expiry.
      if (!result || result.expires_at <= new Date()) {
        return { kind: "invalid" as const };
      }

      // 3. Detect revoked-token reuse.
      if (result.revoked_at) {
        if (result.replaced_by_token_id) {
          await this.refreshrepo.revokeActiveTokensByFamily(
            result.family_id,
            tx,
          );

          return { kind: "reuse" as const };
        }

        return { kind: "revoked" as const };
      }

      // 4. Generate replacement token.
      const newtoken = getRefreshToken();
      const newtoken_hash = hashRefreshToken(newtoken);

      const data: typeof refresh_token.$inferInsert = {
        user_id: result.user_id,
        token_hash: newtoken_hash,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        family_id: result.family_id,
      };

      // 5. Insert replacement within the transaction.
      const newresult: any = await this.refreshrepo.createRefreshToken(
        data,
        tx,
      );

      if (!newresult) {
        throw new AppError("Failed to create replacement token", 500);
      }

      // 6. Revoke the old token and link it to the replacement.
      const revoked = await this.refreshrepo.revokeAndReplaceRefreshToken(
        result.id,
        newresult.id,
        tx,
      );

      if (!revoked) {
        throw new AppError("Refresh token rotation conflict", 401);
      }

      return {
        kind: "success" as const,
        userId: result.user_id,
        refreshToken: newtoken,
      };
    });

    // 7. Throw only after the transaction commits.
    if (outcome.kind === "reuse") {
      throw new AppError("Refresh token reuse detected", 401);
    }

    if (outcome.kind === "revoked") {
      throw new AppError("Refresh token has been revoked", 401);
    }

    if (outcome.kind === "invalid") {
      throw new AppError("Invalid or expired refresh token", 401);
    }

    // 8. Generate access JWT and return both tokens.
    const accessToken = JWTUtility.signAccessToken(outcome.userId);

    return {
      accessToken,
      refreshToken: outcome.refreshToken,
    };
  }

  async revokeRefreshToken(token: string) {
    // 1. Hash the raw refresh token.
    const token_hash = hashRefreshToken(token);

    // 2. Find and validate the token.
    return this.uow.transaction(async (tx) => {
      const exists = await this.refreshrepo.findRefreshTokenByHash(
        token_hash,
        tx,
      );

      if (!exists) {
        throw new AppError("Invalid refresh token", 401);
      }

      if (exists.revoked_at) {
        throw new AppError("Refresh token has already been revoked", 401);
      }

      if (exists.expires_at <= new Date()) {
        throw new AppError("Refresh token has expired", 401);
      }

      // 3. Revoke the token.
      const revoked = await this.refreshrepo.updateRefreshToken(
        exists.id,
        {
          revoked_at: new Date(),
        },
        tx,
      );

      if (!revoked) {
        throw new AppError("Failed to revoke refresh token", 500);
      }

      // 4. Return logout result.
      return { message: "Logged out successfully" };
    });
  }

  async revokeAllRefreshTokensByFamily(family_id: string) {
    return await this.uow.transaction(async (tx) => {
      return await this.refreshrepo.revokeActiveTokensByFamily(family_id, tx);
    });
  }

  async revokeAllRefreshTokens(token: string) {
    const token_hash = hashRefreshToken(token);

    return await this.uow.transaction(async (tx) => {
      // 1. Find refresh token
      const exists = await this.refreshrepo.findRefreshTokenByHash(
        token_hash,
        tx,
      );

      // 2. Validate existence
      if (!exists) {
        throw new AppError("Invalid refresh token", 401);
      }

      // 3. Check revocation
      if (exists.revoked_at) {
        throw new AppError("Refresh token has already been revoked", 401);
      }

      // 4. Check expiration
      if (exists.expires_at <= new Date()) {
        throw new AppError("Refresh token has expired", 401);
      }

      // 5. Revoke all active tokens in this family
      return await this.refreshrepo.revokeAllRefreshTokensByUserId(
        exists.user_id,
        tx,
      );
    });
  }
}
