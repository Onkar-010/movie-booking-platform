/** @format */

import { and, eq, isNull } from "drizzle-orm";
import { BaseRepository } from "./base.repository";
import { DbTransaction } from "../db/types";
import { refresh_token as refreshTokens } from "../db/schemas/refresh_token.schema";

export class RefreshTokenRepository extends BaseRepository<
  typeof refreshTokens
> {
  constructor() {
    super(refreshTokens);
  }

  async findByHash(tokenHash: string, tx?: DbTransaction) {
    const executor = tx ?? this.db;
    const [token] = await executor
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.token_hash, tokenHash))
      .limit(1);

    return token ?? null;
  }

  // Returns null if the old token was already revoked (reuse / race).
  async revokeAndReplace(
    oldTokenId: string,
    newTokenId: string,
    tx?: DbTransaction,
  ) {
    const executor = tx ?? this.db;
    const [token] = await executor
      .update(refreshTokens)
      .set({
        revoked_at: new Date(),
        replaced_by_token_id: newTokenId,
      })
      .where(
        and(eq(refreshTokens.id, oldTokenId), isNull(refreshTokens.revoked_at)),
      )
      .returning();

    return token ?? null;
  }

  // Revoke all active tokens in the same login session.
  async revokeActiveByFamily(familyId: string, tx?: DbTransaction) {
    const executor = tx ?? this.db;
    return executor
      .update(refreshTokens)
      .set({ revoked_at: new Date() })
      .where(
        and(
          eq(refreshTokens.family_id, familyId),
          isNull(refreshTokens.revoked_at),
        ),
      )
      .returning({ id: refreshTokens.id });
  }

  async revokeAllByUserId(userId: string, tx?: DbTransaction) {
    const executor = tx ?? this.db;
    return executor
      .update(refreshTokens)
      .set({ revoked_at: new Date() })
      .where(
        and(
          eq(refreshTokens.user_id, userId),
          isNull(refreshTokens.revoked_at),
        ),
      )
      .returning({ id: refreshTokens.id });
  }
}
