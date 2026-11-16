/** @format */

import { PgTable } from "drizzle-orm/pg-core";
import { and, eq, InferInsertModel, isNull } from "drizzle-orm";
import { BaseRepository } from "../repositories/base.repository";
import { DbTransaction } from "../db/types";

export class RefreshTokenRepository<
  TTable extends PgTable,
> extends BaseRepository<TTable> {
  constructor(table: TTable) {
    super(table);
  }

  async createRefreshToken(data: InferInsertModel<TTable>, tx?: DbTransaction) {
    const executor = tx ?? this.db;
    const [token] = await executor.insert(this.table).values(data).returning();
    return token ?? null;
  }

  async findRefreshTokenByHash(tokenHash: string, tx?: DbTransaction) {
    const table = this.table as any;
    const executor = tx ?? this.db;
    const [token] = await executor
      .select()
      .from(table)
      .where(eq(table.token_hash, tokenHash))
      .limit(1);

    return token ?? null;
  }

  async findRefreshTokenById(id: string, tx?: DbTransaction) {
    const table = this.table as any;
    const executor = tx ?? this.db;
    const [token] = await executor
      .select()
      .from(table)
      .where(eq(table.id, id))
      .limit(1);

    return token ?? null;
  }

  async updateRefreshToken(
    id: string,
    data: Partial<InferInsertModel<TTable>>,
    tx?: DbTransaction,
  ) {
    const table = this.table as any;
    const executor = tx ?? this.db;
    const [token] = await executor
      .update(table)
      .set(data)
      .where(eq(table.id, id))
      .returning();

    return token ?? null;
  }

  async revokeAndReplaceRefreshToken(
    oldTokenId: string,
    newTokenId: string,
    tx?: DbTransaction,
  ) {
    const table = this.table as any;
    const executor = tx ?? this.db;
    const [token] = await executor
      .update(table)
      .set({
        revoked_at: new Date(),
        replaced_by_token_id: newTokenId,
      })
      .where(eq(table.id, oldTokenId))
      .returning();

    return token ?? null;
  }

  // Revoke all active tokens belonging to the same login session.
  async revokeActiveTokensByFamily(familyId: string, tx?: DbTransaction) {
    const table = this.table as any;
    const executor = tx ?? this.db;
    const revokedTokens = await executor
      .update(table)
      .set({
        revoked_at: new Date(),
      })
      .where(and(eq(table.family_id, familyId), isNull(table.revoked_at)))
      .returning({ id: table.id });

    return revokedTokens;
  }

  async deleteRefreshToken(id: string, tx?: DbTransaction) {
    const table = this.table as any;
    const executor = tx ?? this.db;
    const [deleted] = await executor
      .delete(table)
      .where(eq(table.id, id))
      .returning({ id: table.id });

    return deleted ?? null;
  }

  async revokeAllRefreshTokensByUserId(userId: string, tx?: DbTransaction) {
    const table = this.table as any;
    const executor = tx ?? this.db;

    return executor
      .update(table)
      .set({ revoked_at: new Date() })
      .where(and(eq(table.user_id, userId), isNull(table.revoked_at)));
  }
}
