/** @format */

import { eq, sql } from "drizzle-orm";
import { BaseRepository } from "./base.repository";
import { DbTransaction } from "../db/types";
import { users } from "../db/schemas/users.schema"; // adjust to your schema path

export class AuthRepository extends BaseRepository<typeof users> {
  constructor() {
    super(users);
  }

  // Normalize in one place so lookups and inserts always agree.
  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  async findByEmail(email: string, tx?: DbTransaction) {
    const executor = tx ?? this.db;
    const [user] = await executor
      .select()
      .from(users)
      .where(eq(users.email, this.normalizeEmail(email)))
      .limit(1);

    return user ?? null;
  }

  // Safe shape for responses: no password_hash.
  async findPublicById(id: string, tx?: DbTransaction) {
    const executor = tx ?? this.db;
    const [user] = await executor
      .select({ id: users.id, name: users.name, email: users.email })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user ?? null;
  }

  async updateProfile(
    id: string,
    data: { name?: string; email?: string },
    tx?: DbTransaction,
  ) {
    const executor = tx ?? this.db;
    const [user] = await executor
      .update(users)
      .set({
        ...data,
        ...(data.email && { email: this.normalizeEmail(data.email) }),
      })
      .where(eq(users.id, id))
      .returning({ id: users.id, name: users.name, email: users.email });

    return user ?? null;
  }

  async updatePassword(id: string, passwordHash: string, tx?: DbTransaction) {
    const executor = tx ?? this.db;
    const [user] = await executor
      .update(users)
      .set({ password_hash: passwordHash })
      .where(eq(users.id, id))
      .returning({ id: users.id });

    return user ?? null;
  }
}
